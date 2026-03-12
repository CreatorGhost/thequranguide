"""
Generates surah insights using Claude Agent SDK with your subscription.

Setup:
  1. pip install claude-agent-sdk
  2. Run: claude setup-token  (in a separate terminal — gives you the OAuth token)
  3. Set: export CLAUDE_CODE_OAUTH_TOKEN=your-token-here
     Or create scripts/.env with: CLAUDE_CODE_OAUTH_TOKEN=your-token-here

Usage:
  python scripts/generate-insight-claude-sdk.py 93          # single surah
  python scripts/generate-insight-claude-sdk.py 1 18 93     # multiple
  python scripts/generate-insight-claude-sdk.py --model opus 93  # use opus
"""

import asyncio
import json
import os
import sys
import time
from pathlib import Path

# Try to load .env
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage, TextBlock

SCRIPT_DIR = Path(__file__).parent
OUTDIR = SCRIPT_DIR / "output"
DEFAULT_MODEL = "sonnet"  # "sonnet" for balance, "opus" for max quality

# ─── System Prompt ───
SYSTEM_PROMPT = """You are a Quran education content writer for theQuranGuide — a modern app that makes deep Quranic understanding accessible. Your writing should feel like a knowledgeable friend explaining the surah over coffee: warm, personal, insightful, and grounded in scholarship.

ACCURACY RULES (CRITICAL — violating these makes the content unusable):
1. ONLY state facts that appear in the provided source material (tafsir texts, hadith references) OR are universally accepted in Islamic scholarship.
2. For every hadith you mention, include the collection name (Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasa'i, Ibn Majah, Ahmad, etc.). If the source material doesn't specify the collection, write "reported in hadith literature" — NEVER fabricate a specific attribution.
3. If scholars differ on an interpretation, say "scholars differ" and briefly present the main views. Do NOT present one view as definitive unless the tafsir source does.
4. NEVER invent stories, names, dates, or events not present in the source material.
5. For "Notable Verses" — prefer the most iconic, widely-recognized, or practically impactful verses.
6. For "Connections" — explain the thematic link in a way that teaches something new.
7. When the source material is thin for a section, write less rather than fabricate.

TONE RULES (this is what makes our app special):
- Write as if you're explaining to a curious friend who respects the Quran but wants to UNDERSTAND it deeply
- Use "you" and "your" frequently — make the reader feel personally addressed
- Show WHY things matter, not just WHAT they say. Don't just summarize — interpret and connect
- Include the Arabic context: explain WHY a specific Arabic word was chosen over alternatives
- Draw out the practical relevance: how does this verse change how someone lives TODAY?
- No filler phrases ("it is worth noting", "interestingly", "it should be mentioned")
- Be direct and substantive — every sentence should teach something

BAD example (too academic):
"This verse declares that all praise belongs to Allah. Tafsir explains that His praise is due because of His blessings."

GOOD example (personal, insightful):
"'All praise belongs to Allah, Lord of all the worlds.' The word Rabb is often translated as Lord, but its Arabic meaning is far richer — it means the one who creates, sustains, nourishes, develops, and brings to maturity. A Rabb doesn't just make something and leave it; He actively nurtures it at every stage."

SECTION GRANULARITY:
- Short surahs (≤20 ayahs): sections for individual verses or small groups of 2-3 verses.
- Medium surahs (21-80 ayahs): group by thematic passage (5-15 verses per section).
- Long surahs (80+ ayahs): group by major theme (15-30 verses per section).
- Aim for 4-7 sections total. Each section summary should feel like a mini-essay.

STORIES: Cover ALL parables/narratives as separate story entries. Retell engagingly with Quranic quotes.

KEY VOCABULARY: deeperMeaning must include etymology (Arabic root, word pattern), why THIS word was chosen.

NOTABLE VERSES: relatedHadith is MANDATORY — never empty.

CONNECTIONS: Explain the thematic arc, not just "both surahs mention X."

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

OUTPUT: Return ONLY valid JSON. No markdown, no code fences, no explanation."""


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


async def process_surah(surah_num: int, model: str) -> None:
    """Generate insight for a single surah."""
    ctx_path = OUTDIR / f"context-{surah_num}.json"
    if not ctx_path.exists():
        print(f"  Context file not found: {ctx_path}")
        print(f"  Run: npx tsx scripts/fetch-context.ts {surah_num}")
        return

    ctx = json.loads(ctx_path.read_text())
    print(f"\nGenerating Surah {surah_num} ({ctx['englishName']}) via Claude {model}...")

    user_prompt = build_user_prompt(ctx)
    full_prompt = f"{SYSTEM_PROMPT}\n\n---\n\n{user_prompt}"
    print(f"  Input estimate: ~{len(full_prompt) // 4} tokens")

    start = time.time()

    # Collect response
    result_text = ""

    try:
        async for message in query(
            prompt=full_prompt,
            options=ClaudeAgentOptions(
                model=model,
                max_turns=1,
                permission_mode="bypassPermissions",
                allowed_tools=[],  # no tools needed — pure generation
            ),
        ):
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        result_text += block.text
            elif isinstance(message, ResultMessage):
                if message.result:
                    result_text = message.result
    except RuntimeError as e:
        # Ignore async cleanup errors from the SDK
        if "cancel scope" not in str(e):
            print(f"  ERROR: {e}")
            return
    except Exception as e:
        print(f"  ERROR: {e}")
        return

    elapsed = time.time() - start
    print(f"  Response in {elapsed:.1f}s")

    # Parse JSON
    content = result_text.strip()
    if content.startswith("```"):
        content = content.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        fail_path = OUTDIR / f"insight-{surah_num}-claude-failed.txt"
        fail_path.write_text(result_text)
        print(f"  Failed to parse JSON — raw saved to {fail_path}")
        return

    # Validate
    issues = validate(parsed, ctx["numberOfAyahs"])
    if issues:
        print("  Validation issues:")
        for i in issues:
            print(f"    - {i}")

    # Save
    out_path = OUTDIR / f"insight-{surah_num}-claude.json"
    out_path.write_text(json.dumps(parsed, indent=2, ensure_ascii=False))
    tw = total_words(parsed)
    print(f"  Saved to {out_path} ({tw} words)")


async def main():
    # Parse args
    args = sys.argv[1:]
    model = DEFAULT_MODEL

    if "--model" in args:
        idx = args.index("--model")
        model = args[idx + 1]
        args = args[:idx] + args[idx + 2:]

    surah_nums = [int(a) for a in args if a.isdigit() and 1 <= int(a) <= 114]

    if not surah_nums:
        print("Usage: python scripts/generate-insight-claude-sdk.py [--model opus|sonnet] 1 18 93")
        print("")
        print("Setup:")
        print("  1. pip install claude-agent-sdk")
        print("  2. claude setup-token  (get your OAuth token)")
        print("  3. export CLAUDE_CODE_OAUTH_TOKEN=your-token")
        print("  4. npx tsx scripts/fetch-context.ts <surah_numbers>  (get source data)")
        sys.exit(1)

    # Check auth
    has_oauth = bool(os.environ.get("CLAUDE_CODE_OAUTH_TOKEN"))
    has_api = bool(os.environ.get("ANTHROPIC_API_KEY"))
    if not has_oauth and not has_api:
        print("ERROR: No credentials found!")
        print("Set CLAUDE_CODE_OAUTH_TOKEN (subscription) or ANTHROPIC_API_KEY (API)")
        print("Get OAuth token: run 'claude setup-token' in a terminal")
        sys.exit(1)

    auth_type = "OAuth (subscription)" if has_oauth else "API key"
    print(f"Model: {model} | Auth: {auth_type} | Surahs: {surah_nums}")

    for surah_num in surah_nums:
        await process_surah(surah_num, model)

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
