/**
 * Generates surah insight using GPT-5.3 Instant with grounding context.
 * Processes one surah per API call for maximum accuracy.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx tsx scripts/generate-insight.ts 1 18 93
 *
 * Requires context files from fetch-context.ts to exist in scripts/output/
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("❌ Set OPENAI_API_KEY environment variable");
  process.exit(1);
}

const MODEL = "gpt-5.3-chat-latest";
const OUTDIR = join(new URL(".", import.meta.url).pathname, "output");
const PARALLEL = 1; // start with 1 for testing, increase to 5 later

// ─── System Prompt ───
const SYSTEM_PROMPT = `You are a Quran education content writer for theQuranGuide — a modern app that makes deep Quranic understanding accessible. Your writing should feel like a knowledgeable friend explaining the surah over coffee: warm, personal, insightful, and grounded in scholarship.

ACCURACY RULES (CRITICAL — violating these makes the content unusable):
1. ONLY state facts that appear in the provided source material (tafsir texts, hadith references) OR are universally accepted in Islamic scholarship.
2. For every hadith you mention, include the collection name (Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasa'i, Ibn Majah, Ahmad, etc.). If the source material doesn't specify the collection, write "reported in hadith literature" — NEVER fabricate a specific attribution.
3. If scholars differ on an interpretation, say "scholars differ" and briefly present the main views. Do NOT present one view as definitive unless the tafsir source does.
4. NEVER invent stories, names, dates, or events not present in the source material.
5. For "Notable Verses" — prefer the most iconic, widely-recognized, or practically impactful verses. Choose verses people would want to memorize, share, or reflect on daily.
6. For "Connections" — explain the thematic link in a way that teaches something new, not just "both surahs mention X."
7. When the source material is thin for a section, write less rather than fabricate. A shorter accurate section is better than a longer hallucinated one.

TONE RULES (this is what makes our app special — get this right):
- Write as if you're explaining to a curious friend who respects the Quran but wants to UNDERSTAND it deeply
- Use "you" and "your" frequently — make the reader feel personally addressed
- Show WHY things matter, not just WHAT they say. Don't just summarize — interpret and connect
- Include the Arabic context: explain WHY a specific Arabic word was chosen over alternatives, what the grammar reveals
- Draw out the practical relevance: how does this verse change how someone lives TODAY?
- No filler phrases ("it is worth noting", "interestingly", "it should be mentioned", "scholars explain that")
- Be direct and substantive — every sentence should teach something the reader didn't know

BAD example (too academic, too thin):
"This verse declares that all praise belongs to Allah. Tafsir explains that His praise is due because of His blessings."

GOOD example (personal, insightful, teaches something):
"'All praise belongs to Allah, Lord of all the worlds.' The word Rabb is often translated as Lord, but its Arabic meaning is far richer — it means the one who creates, sustains, nourishes, develops, and brings to maturity. A Rabb doesn't just make something and leave it; He actively nurtures it at every stage. By saying this verse, you're acknowledging that everything in existence is under His care, including you."

SECTION GRANULARITY:
- For short surahs (≤20 ayahs): create sections for individual verses or small groups of 2-3 verses. Each verse often carries a distinct message.
- For medium surahs (21-80 ayahs): group by thematic passage (5-15 verses per section).
- For long surahs (80+ ayahs): group by major theme (15-30 verses per section).
- Aim for 4-7 sections total. Each section summary should feel like a mini-essay, not a bullet point.

STORIES:
- If the surah contains parables or narratives, you MUST cover ALL of them as separate story entries.
- Each story narrative should retell the story engagingly with specific Quranic details (quote key phrases from the translation).
- The lesson should connect to the reader's modern life.

KEY VOCABULARY:
- deeperMeaning must go beyond rephrasing the surface meaning. Include etymology (Arabic root, word pattern), why THIS word was chosen over synonyms, what it reveals about the concept.
- Example: "Fitnah originally means melting gold to separate pure metal from impurities. When Allah tests you, He is purifying you — burning away what's false to reveal what's real."

NOTABLE VERSES:
- relatedHadith is MANDATORY for every notable verse. If no hadith directly relates to the verse, find a hadith related to the verse's theme or the surah overall. Use "reported in hadith literature" if you cannot attribute to a specific collection — but NEVER leave this field empty.

CONNECTIONS:
- Don't just state "both surahs mention X." Explain the thematic arc: how one surah's message flows into or contrasts with another's. Make the reader see the Quran as an interconnected whole.

CONTENT LENGTH GUIDELINES (MINIMUM word counts — write MORE if the content warrants it):
- historicalContext.background: 80-120 words (set the scene vividly — what was happening, why it matters)
- historicalContext.occasionOfRevelation: 50-80 words
- audience: 60-100 words
- coreMessage.thesis: 50-80 words (the most important paragraph — make it count, make it personal)
- coreMessage.emotionalArc: 40-60 words
- coreMessage.buildUp: 50-80 words
- sections[].summary: 80-150 words per section (mini-essay, not a summary)
- keyVocabulary[].deeperMeaning: 40-60 words (etymology + insight)
- stories[].narrative: 100-160 words (retell the story with Quranic quotes and drama)
- notableVerses[].tafsirExcerpt: 60-100 words (what scholars say + your own analysis)
- notableVerses[].linguisticNote: 40-60 words (Arabic grammar, word choice, emphasis)
- notableVerses[].practicalApplication: 40-60 words (how to apply in modern life)
- notableVerses[].relatedHadith: 20-50 words (specific hadith with collection name)
- connections[].relationship: 30-50 words (not just "both mention X" — explain the arc)
- scholarlyNotes: 80-120 words covering genuine scholarly discussions and debates

OUTPUT: Return ONLY valid JSON matching the TypeScript interface below. No markdown, no code fences, no explanation — just the JSON object.

interface SurahInsight {
  surah: number;
  historicalContext: {
    period: string;           // "Early Meccan", "Late Meccan", "Early Medinan", "Late Medinan"
    chronologicalOrder: number; // revelation order (e.g., Al-Fatihah = 5)
    background: string;
    occasionOfRevelation: string;
  };
  audience: string;
  coreMessage: {
    thesis: string;
    emotionalArc: string;
    buildUp: string;
  };
  sections: {
    verseRange: string;       // e.g., "1-7", "8-20"
    title: string;
    summary: string;
    connectionToNext: string; // empty string for last section
  }[];
  keyVocabulary: {
    arabic: string;
    transliteration: string;
    surfaceMeaning: string;
    deeperMeaning: string;
  }[];                        // 4-6 key words
  stories: {
    title: string;
    verseRange: string;
    narrative: string;
    lesson: string;
    connectionToMessage: string;
  }[];                        // ALL stories/parables in the surah. Empty array only if the surah has no narratives.
  connections: {
    surah: number;
    surahName: string;
    relationship: string;
  }[];                        // 3-4 connections with meaningful thematic explanations
  notableVerses: {
    ayah: number;
    arabic: string;           // full Arabic text of the verse
    translation: string;
    tafsirExcerpt: string;
    linguisticNote: string;
    practicalApplication: string;
    relatedHadith: string;    // MANDATORY — never empty
  }[];                        // 3-4 notable verses (pick the most iconic/impactful)
  scholarlyNotes: string;
}`;

// ─── Build user prompt with context ───
function buildUserPrompt(ctx: any): string {
  const { surah, englishName, meaning, revelationType, numberOfAyahs } = ctx;

  // Include first 30 ayahs text (Arabic + English) for shorter surahs, or selected ones for longer
  const ayahCount = ctx.ayahTexts.length;
  const selectedAyahs =
    ayahCount <= 40
      ? ctx.ayahTexts
      : [
          ...ctx.ayahTexts.slice(0, 10),
          ...ctx.ayahTexts.slice(
            Math.floor(ayahCount / 2) - 3,
            Math.floor(ayahCount / 2) + 3
          ),
          ...ctx.ayahTexts.slice(-5),
        ];

  const ayahBlock = selectedAyahs
    .map(
      (a: any) =>
        `[${surah}:${a.number}] ${a.arabic}\n  Translation: ${a.english}`
    )
    .join("\n");

  // Ibn Kathir — include ALL entries with generous text (primary source)
  const ikBlock = ctx.ibnKathir
    .map((e: any) => `[${e.verse}] ${e.text.slice(0, 1200)}`)
    .join("\n\n");

  // Jalalayn — concise but include all
  const jalBlock = ctx.jalalayn
    .map((e: any) => `[${e.verse}] ${e.text.slice(0, 500)}`)
    .join("\n\n");

  // Asbab al-Nuzul — all available (usually sparse)
  const asbabBlock = ctx.asbabAlNuzul
    .map((e: any) => `[${e.verse}] ${e.text.slice(0, 800)}`)
    .join("\n\n");

  return `Generate a comprehensive SurahInsight JSON for Surah ${surah} (${englishName} — "${meaning}").

SURAH INFO:
- Number: ${surah}
- Name: ${englishName} (${meaning})
- Type: ${revelationType}
- Ayahs: ${numberOfAyahs}

═══ QURAN TEXT (Arabic + English) ═══
${ayahBlock}

═══ TAFSIR IBN KATHIR ═══
${ikBlock || "(No Ibn Kathir data available for this surah)"}

═══ TAFSIR AL-JALALAYN ═══
${jalBlock || "(No Jalalayn data available for this surah)"}

═══ ASBAB AL-NUZUL (Revelation Context) ═══
${asbabBlock || "(No Asbab al-Nuzul data available for this surah)"}

Now generate the SurahInsight JSON. Remember:
- Ground EVERYTHING in the source material above
- Include the actual Arabic text for notable verses (copy from the Quran text above)
- Attribute every hadith to its collection
- If source material is thin for a section, write less — do NOT fill with invented content`;
}

// ─── Call OpenAI API ───
async function callGPT(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_completion_tokens: 12000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const json = await res.json();
  return json.choices[0].message.content;
}

// ─── Validate output ───
function validateOutput(raw: string, surahNum: number, ayahCount: number): { valid: boolean; issues: string[]; parsed: any } {
  const issues: string[] = [];

  // Try to extract JSON if wrapped in code fences
  let jsonStr = raw.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    return { valid: false, issues: ["Failed to parse JSON"], parsed: null };
  }

  const wc = (s: string) => s ? s.split(/\s+/).filter(Boolean).length : 0;

  // Check required fields
  if (!parsed.historicalContext) issues.push("Missing historicalContext");
  if (!parsed.audience) issues.push("Missing audience");
  if (!parsed.coreMessage?.thesis) issues.push("Missing coreMessage.thesis");
  if (!parsed.sections?.length) issues.push("Missing or empty sections");
  if (!parsed.notableVerses?.length) issues.push("Missing or empty notableVerses");
  if (!parsed.scholarlyNotes) issues.push("Missing scholarlyNotes");

  // Check minimum word counts for key fields
  if (wc(parsed.historicalContext?.background) < 60) issues.push(`background too short (${wc(parsed.historicalContext?.background)}w, need 80+)`);
  if (wc(parsed.coreMessage?.thesis) < 35) issues.push(`thesis too short (${wc(parsed.coreMessage?.thesis)}w, need 50+)`);
  if (wc(parsed.audience) < 40) issues.push(`audience too short (${wc(parsed.audience)}w, need 60+)`);
  if (wc(parsed.scholarlyNotes) < 60) issues.push(`scholarlyNotes too short (${wc(parsed.scholarlyNotes)}w, need 80+)`);

  // Check section depth
  for (const s of parsed.sections || []) {
    if (wc(s.summary) < 60) issues.push(`Section "${s.title}" too thin (${wc(s.summary)}w, need 80+)`);
  }

  // Check ayah numbers are valid
  for (const v of parsed.notableVerses || []) {
    if (v.ayah < 1 || v.ayah > ayahCount) {
      issues.push(`Invalid ayah number ${v.ayah} (surah has ${ayahCount} ayahs)`);
    }
    if (!v.arabic || v.arabic.length < 5) {
      issues.push(`Notable verse ${v.ayah} missing Arabic text`);
    }
    if (!v.relatedHadith || v.relatedHadith.length < 10) {
      issues.push(`Notable verse ${v.ayah} missing related hadith`);
    }
    if (wc(v.tafsirExcerpt) < 40) issues.push(`Notable verse ${v.ayah} tafsir too thin (${wc(v.tafsirExcerpt)}w, need 60+)`);
  }

  // Check vocabulary depth
  for (const w of parsed.keyVocabulary || []) {
    if (wc(w.deeperMeaning) < 25) issues.push(`Vocab "${w.transliteration}" deeperMeaning too thin (${wc(w.deeperMeaning)}w, need 40+)`);
  }

  // Check connection quality
  for (const c of parsed.connections || []) {
    if (wc(c.relationship) < 20) issues.push(`Connection to Surah ${c.surah} too thin (${wc(c.relationship)}w, need 30+)`);
  }

  // Check hadith attribution (should mention collection names)
  const hadithTexts = (parsed.notableVerses || []).map((v: any) => v.relatedHadith).join(" ");
  const hasAttribution = /bukhari|muslim|tirmidhi|abu dawud|nasa'i|ibn majah|ahmad|hadith/i.test(hadithTexts);
  if (!hasAttribution && hadithTexts.length > 0) {
    issues.push("Hadith references lack collection attribution");
  }

  return { valid: issues.length === 0, issues, parsed };
}

// ─── Process a single surah ───
async function processSurah(surahNum: number): Promise<void> {
  const ctxPath = join(OUTDIR, `context-${surahNum}.json`);
  if (!existsSync(ctxPath)) {
    console.error(`❌ Context file not found: ${ctxPath}`);
    console.error(`   Run: npx tsx scripts/fetch-context.ts ${surahNum}`);
    return;
  }

  const ctx = JSON.parse(readFileSync(ctxPath, "utf-8"));
  console.log(`\n🤖 Generating insight for Surah ${surahNum} (${ctx.englishName})...`);

  const userPrompt = buildUserPrompt(ctx);
  const inputTokensEst = Math.ceil((SYSTEM_PROMPT.length + userPrompt.length) / 4);
  console.log(`   📊 Estimated input: ~${inputTokensEst} tokens`);

  const startTime = Date.now();
  const raw = await callGPT(SYSTEM_PROMPT, userPrompt);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ⏱️  Response received in ${elapsed}s`);

  // Validate
  const { valid, issues, parsed } = validateOutput(raw, surahNum, ctx.numberOfAyahs);

  if (!valid || issues.length > 0) {
    console.log(`   ⚠️  Validation issues:`);
    issues.forEach((i) => console.log(`      - ${i}`));
  }

  if (parsed) {
    // Save generated output
    const outPath = join(OUTDIR, `insight-${surahNum}.json`);
    writeFileSync(outPath, JSON.stringify(parsed, null, 2));
    console.log(`   💾 Saved to ${outPath}`);

    // Save raw response for debugging
    const rawPath = join(OUTDIR, `insight-${surahNum}-raw.txt`);
    writeFileSync(rawPath, raw);
  } else {
    // Save raw for debugging
    const rawPath = join(OUTDIR, `insight-${surahNum}-failed.txt`);
    writeFileSync(rawPath, raw);
    console.log(`   ❌ Failed — raw response saved to ${rawPath}`);
  }
}

// ─── Main ───
const args = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= 114);
if (args.length === 0) {
  console.log("Usage: OPENAI_API_KEY=sk-... npx tsx scripts/generate-insight.ts 1 18 93");
  process.exit(1);
}

(async () => {
  console.log(`🚀 Generating insights for surahs: ${args.join(", ")}`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Parallel: ${PARALLEL}`);

  // Process in batches
  for (let i = 0; i < args.length; i += PARALLEL) {
    const batch = args.slice(i, i + PARALLEL);
    await Promise.all(batch.map(processSurah));
  }

  console.log("\n✅ Done generating insights.");
})();
