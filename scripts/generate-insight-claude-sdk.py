"""
Generates surah insights using Claude Agent SDK with your Claude Code subscription.

═══════════════════════════════════════════════════════════════════════════════
HOW AUTHENTICATION WORKS
═══════════════════════════════════════════════════════════════════════════════

This script uses the `claude-agent-sdk` Python package to call Claude models.
The SDK is a thin wrapper that spawns the Claude Code CLI as a subprocess and
communicates with it via JSON messages over stdin/stdout.

There are TWO ways to authenticate:

┌─────────────────────────────────────────────────────────────────────────────┐
│ OPTION A: OAuth Token (Claude Code Subscription) — NO EXTRA COST          │
│                                                                           │
│ If you have a Claude Pro ($20/mo) or Max ($100/mo) subscription, you      │
│ already have Claude Code included. The OAuth token lets this script use    │
│ your subscription quota — no per-token billing.                           │
│                                                                           │
│ How to get your token:                                                    │
│   1. Open a terminal and run: claude setup-token                          │
│   2. A browser window opens → log in with your Anthropic account          │
│   3. The CLI prints your OAuth token (starts with "sk-ant-..." or a       │
│      long base64 string)                                                  │
│   4. Set it in your environment:                                          │
│        export CLAUDE_CODE_OAUTH_TOKEN="your-token-here"                   │
│      Or put it in scripts/.env:                                           │
│        CLAUDE_CODE_OAUTH_TOKEN=your-token-here                            │
│                                                                           │
│ What happens under the hood:                                              │
│   1. This script calls claude_agent_sdk.query()                           │
│   2. The SDK spawns the Claude Code CLI as a child process                │
│   3. It passes CLAUDE_CODE_OAUTH_TOKEN via the subprocess environment     │
│   4. The CLI authenticates with Anthropic's OAuth endpoint                │
│   5. Anthropic validates the token against your subscription              │
│   6. The request is billed against your subscription quota (not per-token)│
│   7. Response streams back: CLI → SDK → this script                       │
│                                                                           │
│ Token lifetime: OAuth tokens expire. If you get auth errors, re-run       │
│ `claude setup-token` to get a fresh one.                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ OPTION B: Anthropic API Key — PAY PER TOKEN                               │
│                                                                           │
│ If you have an API key from console.anthropic.com, you can use that       │
│ instead. You'll pay per input/output token at standard API rates.         │
│                                                                           │
│   export ANTHROPIC_API_KEY="sk-ant-api03-..."                             │
│                                                                           │
│ Same flow as above, except the CLI uses API key auth instead of OAuth.    │
└─────────────────────────────────────────────────────────────────────────────┘

Priority: If BOTH are set, CLAUDE_CODE_OAUTH_TOKEN takes precedence (free).

═══════════════════════════════════════════════════════════════════════════════
SETUP
═══════════════════════════════════════════════════════════════════════════════

  1. pip install claude-agent-sdk python-dotenv
  2. npm install -g @anthropic-ai/claude-code   (the CLI that the SDK wraps)
  3. claude setup-token                          (get your OAuth token)
  4. Create scripts/.env with your token (see above)

═══════════════════════════════════════════════════════════════════════════════
USAGE
═══════════════════════════════════════════════════════════════════════════════

  python scripts/generate-insight-claude-sdk.py 93              # single surah
  python scripts/generate-insight-claude-sdk.py 1 18 93         # multiple
  python scripts/generate-insight-claude-sdk.py --model opus 93 # use opus
  python scripts/generate-insight-claude-sdk.py --save-db 1 18 93     # save to PostgreSQL
  python scripts/generate-insight-claude-sdk.py --save-db --all       # all 114 surahs
  python scripts/generate-insight-claude-sdk.py --save-db --all --skip-existing
"""

import asyncio
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

# ─── Load environment variables ───
# We check two .env files:
#   scripts/.env      — for CLAUDE_CODE_OAUTH_TOKEN (auth for generation)
#   backend/.env      — for DATABASE_URL (only needed with --save-db)
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
    load_dotenv(Path(__file__).parent.parent / "backend" / ".env")
except ImportError:
    pass

# ─── Claude Agent SDK ───
# The SDK provides:
#   query()              — sends a prompt to Claude and yields response messages
#   ClaudeAgentOptions   — configures model, system prompt, permissions, tools
#   AssistantMessage     — a message from Claude (contains TextBlock, ToolUseBlock, etc.)
#   ResultMessage        — final message with the complete result text
#   TextBlock            — a text content block within an AssistantMessage
#
# Under the hood, the SDK:
#   1. Finds the Claude Code CLI binary (installed via npm)
#   2. Spawns it as a subprocess with your env vars (including auth tokens)
#   3. Sends your prompt + options as JSON over stdin
#   4. Reads streaming JSON responses from stdout
#   5. Yields them as typed Python objects (AssistantMessage, ResultMessage, etc.)
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage, TextBlock

SCRIPT_DIR = Path(__file__).parent
OUTDIR = SCRIPT_DIR / "output"

# Model selection:
#   "sonnet"  — Claude Sonnet: fast, high quality, good for bulk generation ($0 with subscription)
#   "opus"    — Claude Opus: highest quality, slower, use for important surahs ($0 with subscription)
#   "haiku"   — Claude Haiku: fastest, lowest quality (not recommended for insights)
DEFAULT_MODEL = "sonnet"

# ─── System Prompt ───
SYSTEM_PROMPT = """You are a Quran education content writer for theQuranGuide — a modern app that helps people truly understand the Quran for the first time.

READING LEVEL: Write so a smart 13-year-old can understand every sentence. This is CRITICAL.
- Use short, clear sentences. If a sentence has more than 25 words, break it up.
- Replace academic words with everyday ones: "proclamation" → "announcement", "encompasses" → "covers", "negation" → "denial", "theological" → "about God", "epistemic" → (just remove it)
- When you use an Arabic term, ALWAYS explain it right away in plain English. Never assume the reader knows any Arabic.
- When you mention a scholar or book (Ibn Kathir, Al-Qurtubi), add a tiny phrase like "one of the great Quran commentators" the first time.
- Avoid long paragraphs. Break complex ideas into 2-3 short sentences.

VOICE: Imagine you're a cool older sibling who studied Islam deeply and is now explaining it to their younger sibling who just started getting curious about the Quran. You're excited to share, you keep it real, and you never talk down to them.
- Use "you" and "your" constantly — the reader should feel directly spoken to
- Use everyday comparisons: "Think of it like...", "It's similar to when..."
- Show WHY things matter to someone's actual life, not just what they mean
- Be warm and encouraging, never dry or textbook-like

ACCURACY RULES (CRITICAL — violating these makes the content unusable):
1. ONLY state facts from the provided source material OR universally accepted Islamic scholarship.
2. For every hadith, include the collection name (Bukhari, Muslim, Tirmidhi, etc.). If the source doesn't specify, write "reported in hadith literature" — NEVER make up an attribution.
3. If scholars disagree, say so briefly. Don't present one view as the only view unless the source does.
4. NEVER invent stories, names, dates, or events not in the source material.
5. When source material is thin, write less — do NOT fill gaps with guesses.

BAD example (too complex, too academic):
"The negation of 'wadda'aka' employs the strongest form of relational departure in Arabic, encompassing both the cessation of communication and the theological implication of divine displeasure."

GOOD example (clear, warm, accessible):
"The word 'wadda'aka' means a real goodbye — like when someone leaves and isn't coming back. Allah is saying: that goodbye never happened. I never left. The silence you felt? That wasn't Me walking away."

BAD example (assumes too much knowledge):
"As recorded in the musnad tradition through the isnad of Jundub ibn Abdullah al-Bajali..."

GOOD example (accessible):
"According to a hadith in Sahih al-Bukhari (one of the most trusted hadith collections), a companion named Jundub reported that..."

ARABIC VOCABULARY RULE: When explaining Arabic words, make it fascinating, not academic.
- Include the root letters and what they mean in plain English
- Explain why THIS specific word was chosen — what makes it special
- Use a real-life comparison to make it stick
- Example: "The word 'Rabb' comes from the root r-b-b, which means to nurture and raise something from nothing to its full potential. Think of how a gardener doesn't just plant a seed and walk away — they water it, protect it, and help it grow. That's what Rabb means. Allah isn't just a creator who made you and left. He's actively raising you, stage by stage."

SECTION GRANULARITY:
- Short surahs (≤20 ayahs): sections for individual verses or small groups of 2-3 verses.
- Medium surahs (21-80 ayahs): group by thematic passage (5-15 verses per section).
- Long surahs (80+ ayahs): group by major theme (15-30 verses per section).
- Aim for 4-7 sections total.

STORIES: Retell like you're telling a friend a story they've never heard. Make it vivid and engaging. Include Quranic quotes.

NOTABLE VERSES: relatedHadith is MANDATORY — never empty. Explain the hadith simply.

CONNECTIONS: Explain the link between surahs in a way that makes the reader go "oh, I never noticed that!"

CONTENT LENGTH (MINIMUM word counts — write MORE if warranted):
- historicalContext.background: 80-150 words
- historicalContext.occasionOfRevelation: 50-100 words
- audience: 60-120 words
- coreMessage.thesis: 50-100 words
- sections[].summary: 80-170 words per section
- keyVocabulary[].deeperMeaning: 40-70 words
- stories[].narrative: 100-200 words
- notableVerses[].tafsirExcerpt: 60-120 words
- notableVerses[].linguisticNote: 40-70 words
- notableVerses[].practicalApplication: 40-70 words
- notableVerses[].relatedHadith: 20-60 words
- connections[].relationship: 30-60 words
- scholarlyNotes: 80-150 words

OUTPUT: Return ONLY valid JSON. No markdown, no code fences, no explanation. No thinking. Just the JSON object."""


# ─── JSON Schema for structured output ───
INSIGHT_SCHEMA = {
    "type": "object",
    "properties": {
        "surah": {"type": "integer"},
        "historicalContext": {
            "type": "object",
            "properties": {
                "period": {"type": "string", "description": "Early Meccan, Late Meccan, Early Medinan, or Late Medinan"},
                "chronologicalOrder": {"type": "integer"},
                "background": {"type": "string"},
                "occasionOfRevelation": {"type": "string"}
            },
            "required": ["period", "chronologicalOrder", "background", "occasionOfRevelation"]
        },
        "audience": {"type": "string"},
        "coreMessage": {
            "type": "object",
            "properties": {
                "thesis": {"type": "string"},
                "emotionalArc": {"type": "string"},
                "buildUp": {"type": "string"}
            },
            "required": ["thesis", "emotionalArc", "buildUp"]
        },
        "sections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "verseRange": {"type": "string"},
                    "title": {"type": "string"},
                    "summary": {"type": "string"},
                    "connectionToNext": {"type": "string"}
                },
                "required": ["verseRange", "title", "summary", "connectionToNext"]
            }
        },
        "keyVocabulary": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "arabic": {"type": "string"},
                    "transliteration": {"type": "string"},
                    "surfaceMeaning": {"type": "string"},
                    "deeperMeaning": {"type": "string"}
                },
                "required": ["arabic", "transliteration", "surfaceMeaning", "deeperMeaning"]
            }
        },
        "stories": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "verseRange": {"type": "string"},
                    "narrative": {"type": "string"},
                    "lesson": {"type": "string"},
                    "connectionToMessage": {"type": "string"}
                },
                "required": ["title", "verseRange", "narrative", "lesson", "connectionToMessage"]
            }
        },
        "connections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "surah": {"type": "integer"},
                    "surahName": {"type": "string"},
                    "relationship": {"type": "string"}
                },
                "required": ["surah", "surahName", "relationship"]
            }
        },
        "notableVerses": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "ayah": {"type": "integer"},
                    "arabic": {"type": "string"},
                    "translation": {"type": "string"},
                    "tafsirExcerpt": {"type": "string"},
                    "linguisticNote": {"type": "string"},
                    "practicalApplication": {"type": "string"},
                    "relatedHadith": {"type": "string", "description": "MANDATORY — must include hadith with collection name"}
                },
                "required": ["ayah", "arabic", "translation", "tafsirExcerpt", "linguisticNote", "practicalApplication", "relatedHadith"]
            }
        },
        "scholarlyNotes": {"type": "string"}
    },
    "required": ["surah", "historicalContext", "audience", "coreMessage", "sections",
                  "keyVocabulary", "stories", "connections", "notableVerses", "scholarlyNotes"]
}


# ─── Database helpers ───

def get_db_url() -> str:
    """Get PostgreSQL connection URL from env."""
    url = os.environ.get("DATABASE_URL_SYNC") or os.environ.get("DATABASE_URL", "")
    # Convert async URL to sync if needed
    if url.startswith("postgresql+asyncpg://"):
        url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
    return url


def get_db_connection():
    """Create a psycopg2 connection to PostgreSQL."""
    import psycopg2
    url = get_db_url()
    if not url:
        raise RuntimeError("No DATABASE_URL found in environment")
    return psycopg2.connect(url)


def upsert_insight(parsed: dict, word_count: int, model: str) -> None:
    """UPSERT an insight into surah_insights table."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO surah_insights (surah, version, content, word_count, model_used, generated_at, created_at, updated_at)
                VALUES (%s, 1, %s, %s, %s, NOW(), NOW(), NOW())
                ON CONFLICT (surah)
                DO UPDATE SET
                    content = EXCLUDED.content,
                    word_count = EXCLUDED.word_count,
                    model_used = EXCLUDED.model_used,
                    version = surah_insights.version + 1,
                    generated_at = NOW(),
                    updated_at = NOW()
            """, (
                parsed["surah"],
                json.dumps(parsed, ensure_ascii=False),
                word_count,
                model,
            ))
        conn.commit()
    finally:
        conn.close()


def get_existing_surahs() -> set[int]:
    """Get set of surah numbers already in the database."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT surah FROM surah_insights")
            return {row[0] for row in cur.fetchall()}
    finally:
        conn.close()


def build_user_prompt(ctx: dict) -> str:
    """Build the user prompt with source context."""
    surah = ctx["surah"]
    ayah_texts = ctx.get("ayahTexts", [])
    ayah_count = len(ayah_texts)

    # Select ayahs (all for short surahs, sampled for long ones)
    if ayah_count <= 40:
        selected = ayah_texts
    else:
        mid = ayah_count // 2
        selected = ayah_texts[:10] + ayah_texts[mid-3:mid+3] + ayah_texts[-5:]

    ayah_block = "\n".join(
        f"[{surah}:{a['number']}] {a['arabic']}\n  Translation: {a['english']}"
        for a in selected
    )

    ik_block = "\n\n".join(
        f"[{e['verse']}] {e['text'][:1200]}" for e in ctx.get("ibnKathir", [])
    ) or "(No Ibn Kathir data)"

    jal_block = "\n\n".join(
        f"[{e['verse']}] {e['text'][:500]}" for e in ctx.get("jalalayn", [])
    ) or "(No Jalalayn data)"

    asbab_block = "\n\n".join(
        f"[{e['verse']}] {e['text'][:800]}" for e in ctx.get("asbabAlNuzul", [])
    ) or "(No Asbab al-Nuzul data)"

    return f"""Generate a comprehensive SurahInsight JSON for Surah {surah} ({ctx['englishName']} — "{ctx['meaning']}").

SURAH INFO:
- Number: {surah}
- Name: {ctx['englishName']} ({ctx['meaning']})
- Type: {ctx['revelationType']}
- Ayahs: {ctx['numberOfAyahs']}

═══ QURAN TEXT (Arabic + English) ═══
{ayah_block}

═══ TAFSIR IBN KATHIR ═══
{ik_block}

═══ TAFSIR AL-JALALAYN ═══
{jal_block}

═══ ASBAB AL-NUZUL (Revelation Context) ═══
{asbab_block}

Now generate the SurahInsight JSON. Remember:
- Ground EVERYTHING in the source material above
- Include actual Arabic text for notable verses (copy from the Quran text above)
- Attribute every hadith to its collection
- Write with warmth, depth, and personal engagement
- If source material is thin, write less — do NOT fabricate"""


def word_count(s: str) -> int:
    return len(s.split()) if s else 0


def validate(parsed: dict, ayah_count: int) -> list[str]:
    """Validate the generated insight."""
    issues = []
    if not parsed.get("historicalContext"):
        issues.append("Missing historicalContext")
    if not parsed.get("coreMessage", {}).get("thesis"):
        issues.append("Missing thesis")
    if not parsed.get("sections"):
        issues.append("Missing sections")
    if not parsed.get("notableVerses"):
        issues.append("Missing notableVerses")

    bg = parsed.get("historicalContext", {}).get("background", "")
    if word_count(bg) < 60:
        issues.append(f"background too short ({word_count(bg)}w)")

    for s in parsed.get("sections", []):
        if word_count(s.get("summary", "")) < 50:
            issues.append(f'Section "{s.get("title","?")}" too thin ({word_count(s.get("summary",""))}w)')

    for v in parsed.get("notableVerses", []):
        ayah = v.get("ayah", 0)
        if ayah < 1 or ayah > ayah_count:
            issues.append(f"Invalid ayah {ayah}")
        if not v.get("relatedHadith") or len(v.get("relatedHadith", "")) < 10:
            issues.append(f"Ayah {ayah} missing hadith")

    return issues


def total_words(parsed: dict) -> int:
    """Count total words across all text fields."""
    texts = [
        parsed.get("historicalContext", {}).get("background", ""),
        parsed.get("historicalContext", {}).get("occasionOfRevelation", ""),
        parsed.get("audience", ""),
        parsed.get("coreMessage", {}).get("thesis", ""),
        parsed.get("coreMessage", {}).get("emotionalArc", ""),
        parsed.get("coreMessage", {}).get("buildUp", ""),
        parsed.get("scholarlyNotes", ""),
    ]
    for s in parsed.get("sections", []):
        texts.append(s.get("summary", ""))
    for w in parsed.get("keyVocabulary", []):
        texts.append(w.get("deeperMeaning", ""))
    for st in parsed.get("stories", []):
        texts.extend([st.get("narrative", ""), st.get("lesson", "")])
    for v in parsed.get("notableVerses", []):
        texts.extend([v.get("tafsirExcerpt", ""), v.get("linguisticNote", ""),
                       v.get("practicalApplication", ""), v.get("relatedHadith", "")])
    for c in parsed.get("connections", []):
        texts.append(c.get("relationship", ""))
    return sum(word_count(t) for t in texts if t)


async def process_surah(surah_num: int, model: str, save_db: bool = False) -> None:
    """Generate insight for a single surah."""
    ctx_path = OUTDIR / f"context-{surah_num}.json"
    if not ctx_path.exists():
        print(f"  Context file not found: {ctx_path}")
        print(f"  Run: npx tsx scripts/fetch-context.ts {surah_num}")
        return

    ctx = json.loads(ctx_path.read_text())
    print(f"\nGenerating Surah {surah_num} ({ctx['englishName']}) via Claude {model}...")

    user_prompt = build_user_prompt(ctx)
    user_prompt_text = build_user_prompt(ctx)
    print(f"  Input estimate: ~{(len(SYSTEM_PROMPT) + len(user_prompt_text)) // 4} tokens")

    start = time.time()

    # ─── Call Claude via the Agent SDK ───
    #
    # This is where the actual LLM call happens. Here's the flow:
    #
    #   1. query() spawns the Claude Code CLI as a subprocess
    #   2. The CLI reads CLAUDE_CODE_OAUTH_TOKEN from the environment
    #      (passed automatically by the SDK — see subprocess_cli.py lines 271-276)
    #   3. The CLI authenticates with Anthropic:
    #      - OAuth token → validates against your subscription (Pro/Max)
    #      - API key → validates against your API account balance
    #   4. The CLI sends your prompt + system_prompt to the Claude model
    #   5. Claude generates the response (this is the slow part — 2-4 min per surah)
    #   6. The CLI streams the response back to the SDK over stdout
    #   7. The SDK parses the JSON stream and yields Python objects:
    #      - AssistantMessage: contains TextBlock(s) with the actual text
    #      - ResultMessage: the final complete result after all turns
    #
    # ClaudeAgentOptions explained:
    #   model="sonnet"              — which Claude model to use
    #   system_prompt=SYSTEM_PROMPT — our custom writing instructions (reading level, voice, etc.)
    #   max_turns=1                 — single turn, no back-and-forth (pure generation)
    #   permission_mode="bypassPermissions" — don't prompt for tool approval (we use no tools)
    #   allowed_tools=[]            — disable ALL tools (no file access, no web, nothing)
    #                                  We want pure text generation, not agentic behavior
    #
    result_text = ""

    try:
        async for message in query(
            prompt=user_prompt_text,
            options=ClaudeAgentOptions(
                model=model,
                system_prompt=SYSTEM_PROMPT,
                max_turns=1,
                permission_mode="bypassPermissions",
                allowed_tools=[],
            ),
        ):
            # AssistantMessage: Claude is generating text (may arrive in chunks)
            # Each message contains content blocks — we only care about TextBlock
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        result_text += block.text

            # ResultMessage: Generation is complete. This contains the full final text.
            # We prefer this over the accumulated AssistantMessage text because the SDK
            # may consolidate/clean the output in the ResultMessage.
            elif isinstance(message, ResultMessage):
                if message.result:
                    result_text = message.result

    except RuntimeError as e:
        # The SDK sometimes raises RuntimeError during async cleanup when the
        # subprocess exits. "cancel scope" errors are harmless — just ignore them.
        if "cancel scope" not in str(e):
            print(f"  ERROR: {e}")
            return
    except Exception as e:
        # Auth errors show up here — e.g. expired OAuth token, invalid API key,
        # subscription quota exceeded, or model not available on your plan.
        print(f"  ERROR: {e}")
        return

    elapsed = time.time() - start
    print(f"  Response in {elapsed:.1f}s")

    # Parse JSON — handle thinking text + code fences
    content = result_text.strip()

    # Try to extract JSON from code fences (model may output thinking + ```json...```)
    # findall with greedy match — take the LAST (largest) code block
    json_blocks = re.findall(r'```json\s*\n([\s\S]*?)\n```', content)
    if json_blocks:
        # Use the last block (the complete one, not the schema outline)
        content = json_blocks[-1]
    else:
        # Try to find raw JSON object
        brace_start = content.find('{')
        if brace_start > 0:
            content = content[brace_start:]
        # Remove trailing code fence if present
        if content.rstrip().endswith("```"):
            content = content.rstrip().rsplit("```", 1)[0].rstrip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        # Try to find the last complete JSON object (in case of trailing text)
        try:
            # Find matching braces
            depth = 0
            end = -1
            for i, ch in enumerate(content):
                if ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        end = i
                        break
            if end > 0:
                parsed = json.loads(content[:end+1])
            else:
                raise json.JSONDecodeError("No complete JSON", content, 0)
        except json.JSONDecodeError:
            fail_path = OUTDIR / f"insight-{surah_num}-claude-failed.txt"
            fail_path.write_text(result_text)
            print(f"  Failed to parse JSON — raw saved to {fail_path}")
            return

    # Normalize field names — model may use slightly different keys
    if "surahNumber" in parsed and "surah" not in parsed:
        parsed["surah"] = parsed.pop("surahNumber")

    # Normalize notableVerses: ayahNumber → ayah, arabicText → arabic
    for v in parsed.get("notableVerses", []):
        if "ayahNumber" in v and "ayah" not in v:
            v["ayah"] = v.pop("ayahNumber")
        if "arabicText" in v and "arabic" not in v:
            v["arabic"] = v.pop("arabicText")

    # Normalize sections
    for s in parsed.get("sections", []):
        # ayahRange → verseRange
        if "ayahRange" in s and "verseRange" not in s:
            s["verseRange"] = s.pop("ayahRange")
        # verseRange as {start, end} object → "start-end" string
        # The frontend SurahSection interface expects a string like "1-2"
        vr = s.get("verseRange")
        if isinstance(vr, dict):
            s["verseRange"] = f"{vr.get('start', '')}-{vr.get('end', '')}"
        # Ensure connectionToNext exists (model sometimes omits it)
        if "connectionToNext" not in s:
            s["connectionToNext"] = ""

    # Normalize connections: surahNumber → surah
    for c in parsed.get("connections", []):
        if "surahNumber" in c and "surah" not in c:
            c["surah"] = c.pop("surahNumber")

    # Normalize coreMessage: ensure all fields exist
    cm = parsed.get("coreMessage", {})
    if "themes" in cm and "emotionalArc" not in cm:
        cm["emotionalArc"] = ", ".join(cm.pop("themes")) if isinstance(cm.get("themes"), list) else cm.pop("themes")
    if "emotionalArc" not in cm:
        cm["emotionalArc"] = ""
    if "buildUp" not in cm:
        cm["buildUp"] = ""

    # Ensure lessons field exists (model sometimes omits it)
    if "lessons" not in parsed:
        parsed["lessons"] = []

    # Validate
    issues = validate(parsed, ctx["numberOfAyahs"])
    if issues:
        print("  Validation issues:")
        for i in issues:
            print(f"    - {i}")

    # Save JSON file (always, as backup)
    out_path = OUTDIR / f"insight-{surah_num}-claude.json"
    out_path.write_text(json.dumps(parsed, indent=2, ensure_ascii=False))
    tw = total_words(parsed)
    print(f"  Saved to {out_path} ({tw} words)")

    # Save to database if requested
    if save_db:
        try:
            upsert_insight(parsed, tw, model)
            print(f"  Saved to database (surah {surah_num})")
        except Exception as e:
            print(f"  DB save failed: {e}")


async def main():
    # Parse args
    args = sys.argv[1:]
    model = DEFAULT_MODEL
    save_db = False
    all_surahs = False
    skip_existing = False

    if "--model" in args:
        idx = args.index("--model")
        model = args[idx + 1]
        args = args[:idx] + args[idx + 2:]

    if "--save-db" in args:
        save_db = True
        args.remove("--save-db")

    if "--all" in args:
        all_surahs = True
        args.remove("--all")

    if "--skip-existing" in args:
        skip_existing = True
        args.remove("--skip-existing")

    if all_surahs:
        surah_nums = list(range(1, 115))
    else:
        surah_nums = [int(a) for a in args if a.isdigit() and 1 <= int(a) <= 114]

    if not surah_nums:
        print("Usage: python scripts/generate-insight-claude-sdk.py [--model opus|sonnet] [--save-db] [--all] [--skip-existing] 1 18 93")
        print("")
        print("Flags:")
        print("  --save-db        Save generated insights to PostgreSQL")
        print("  --all            Generate for all 114 surahs")
        print("  --skip-existing  Skip surahs already in the database")
        print("  --model M        Use model M (sonnet or opus)")
        print("")
        print("Setup:")
        print("  1. pip install claude-agent-sdk")
        print("  2. claude setup-token  (get your OAuth token)")
        print("  3. export CLAUDE_CODE_OAUTH_TOKEN=your-token")
        print("  4. npx tsx scripts/fetch-context.ts <surah_numbers>  (get source data)")
        sys.exit(1)

    # Skip existing surahs if requested
    if skip_existing and save_db:
        try:
            existing = get_existing_surahs()
            before = len(surah_nums)
            surah_nums = [s for s in surah_nums if s not in existing]
            skipped = before - len(surah_nums)
            if skipped:
                print(f"Skipping {skipped} surahs already in database")
        except Exception as e:
            print(f"Warning: Could not check existing surahs: {e}")

    # ─── Authentication Check ───
    # Before making any API calls, verify we have credentials.
    # The SDK itself doesn't validate the token — it just passes it to the CLI subprocess.
    # If the token is missing, the CLI will fail with an auth error on the first call.
    # We check early here to give a clear error message instead.
    #
    # CLAUDE_CODE_OAUTH_TOKEN = OAuth token from `claude setup-token`
    #   → Uses your Claude Pro/Max subscription quota (no extra cost)
    #   → Token format: long base64 string or "sk-ant-..." prefix
    #   → Expires periodically — re-run `claude setup-token` if you get auth errors
    #
    # ANTHROPIC_API_KEY = API key from console.anthropic.com
    #   → Pay-per-token billing at standard API rates
    #   → Token format: "sk-ant-api03-..."
    #   → Does not expire (unless revoked)
    #
    has_oauth = bool(os.environ.get("CLAUDE_CODE_OAUTH_TOKEN"))
    has_api = bool(os.environ.get("ANTHROPIC_API_KEY"))
    if not has_oauth and not has_api:
        print("ERROR: No credentials found!")
        print("")
        print("Option A — Use your Claude Code subscription (FREE):")
        print("  1. Run: claude setup-token")
        print("  2. Copy the token it prints")
        print("  3. Add to scripts/.env: CLAUDE_CODE_OAUTH_TOKEN=your-token-here")
        print("")
        print("Option B — Use an API key (pay-per-token):")
        print("  1. Go to console.anthropic.com → API Keys")
        print("  2. Create a key")
        print("  3. Add to scripts/.env: ANTHROPIC_API_KEY=sk-ant-api03-...")
        sys.exit(1)

    # OAuth takes precedence because it's free with your subscription
    auth_type = "OAuth (subscription)" if has_oauth else "API key"
    db_mode = " | DB: enabled" if save_db else ""
    print(f"Model: {model} | Auth: {auth_type}{db_mode} | Surahs: {len(surah_nums)}")

    total = len(surah_nums)
    for i, surah_num in enumerate(surah_nums, 1):
        print(f"\n[{i}/{total}] Processing Surah {surah_num}...")
        try:
            await process_surah(surah_num, model, save_db=save_db)
        except Exception as e:
            print(f"  ERROR processing surah {surah_num}: {e}")
            continue

        # Small delay between calls to avoid throttling
        if i < total:
            await asyncio.sleep(2)

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
