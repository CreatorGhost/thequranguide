/**
 * Generates surah insight WITHOUT source context — to test how much
 * grounding data improves quality vs pure model knowledge.
 *
 * Usage: OPENAI_API_KEY=sk-... npx tsx scripts/generate-insight-nocontext.ts 93
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Set OPENAI_API_KEY environment variable");
  process.exit(1);
}

const MODEL = "gpt-5.3-chat-latest";
const OUTDIR = join(new URL(".", import.meta.url).pathname, "output");

// Same system prompt as the main script
const SYSTEM_PROMPT = readFileSync(
  join(new URL(".", import.meta.url).pathname, "generate-insight.ts"),
  "utf-8"
).match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/)?.[1] || "";

// Minimal surah info (no tafsir, no ayah text)
const SURAH_INFO: Record<number, { name: string; english: string; meaning: string; type: string; ayahs: number }> = {
  1: { name: "Al-Fatihah", english: "The Opening", meaning: "The Opening", type: "Meccan", ayahs: 7 },
  18: { name: "Al-Kahf", english: "The Cave", meaning: "The Cave", type: "Meccan", ayahs: 110 },
  93: { name: "Ad-Duha", english: "The Morning Hours", meaning: "The Morning Brightness", type: "Meccan", ayahs: 11 },
};

async function callGPT(system: string, user: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
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

async function processSurah(surahNum: number): Promise<void> {
  const info = SURAH_INFO[surahNum];
  if (!info) {
    console.error(`No info for surah ${surahNum}`);
    return;
  }

  console.log(`\nGenerating NO-CONTEXT insight for Surah ${surahNum} (${info.english})...`);

  const userPrompt = `Generate a comprehensive SurahInsight JSON for Surah ${surahNum} (${info.english} — "${info.meaning}").

SURAH INFO:
- Number: ${surahNum}
- Name: ${info.english} (${info.meaning})
- Type: ${info.type}
- Ayahs: ${info.ayahs}

NO SOURCE MATERIAL IS PROVIDED. Use your own knowledge of Islamic scholarship, tafsir, and hadith to generate the content. Be accurate and attribute hadith to their collections.

Generate the SurahInsight JSON now.`;

  const startTime = Date.now();
  const raw = await callGPT(SYSTEM_PROMPT, userPrompt);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   Response received in ${elapsed}s`);

  // Parse
  let jsonStr = raw.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const outPath = join(OUTDIR, `insight-${surahNum}-nocontext.json`);
    writeFileSync(outPath, JSON.stringify(parsed, null, 2));
    console.log(`   Saved to ${outPath}`);
  } catch {
    const rawPath = join(OUTDIR, `insight-${surahNum}-nocontext-failed.txt`);
    writeFileSync(rawPath, raw);
    console.log(`   Failed to parse — raw saved to ${rawPath}`);
  }
}

const args = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= 114);
if (args.length === 0) {
  console.log("Usage: npx tsx scripts/generate-insight-nocontext.ts 93");
  process.exit(1);
}

(async () => {
  for (const s of args) {
    await processSurah(s);
  }
  console.log("\nDone.");
})();
