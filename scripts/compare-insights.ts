/**
 * Compares Claude-written insights vs GPT-5.3-generated insights.
 * Prints a side-by-side summary for review.
 *
 * Usage: npx tsx scripts/compare-insights.ts 1
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Import the hardcoded Claude data
import { SURAH_INSIGHTS } from "../src/data/surah-insights";

const OUTDIR = join(new URL(".", import.meta.url).pathname, "output");

function wordCount(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function summarizeInsight(label: string, data: any): void {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${label}`);
  console.log(`${"═".repeat(60)}`);

  if (!data) {
    console.log("  (no data)");
    return;
  }

  // Historical Context
  console.log(`\n  📜 HISTORICAL CONTEXT`);
  console.log(`     Period: ${data.historicalContext?.period || "—"}`);
  console.log(`     Chronological Order: ${data.historicalContext?.chronologicalOrder || "—"}`);
  console.log(`     Background: ${wordCount(data.historicalContext?.background)} words`);
  console.log(`     Occasion: ${wordCount(data.historicalContext?.occasionOfRevelation)} words`);

  // Audience
  console.log(`\n  👥 AUDIENCE: ${wordCount(data.audience)} words`);

  // Core Message
  console.log(`\n  💡 CORE MESSAGE`);
  console.log(`     Thesis: ${wordCount(data.coreMessage?.thesis)} words`);
  console.log(`     Emotional Arc: ${wordCount(data.coreMessage?.emotionalArc)} words`);
  console.log(`     Build Up: ${wordCount(data.coreMessage?.buildUp)} words`);

  // Sections
  console.log(`\n  📑 SECTIONS: ${data.sections?.length || 0}`);
  for (const s of data.sections || []) {
    console.log(`     [${s.verseRange}] ${s.title} — ${wordCount(s.summary)} words`);
  }

  // Key Vocabulary
  console.log(`\n  📝 KEY VOCABULARY: ${data.keyVocabulary?.length || 0}`);
  for (const w of data.keyVocabulary || []) {
    console.log(`     ${w.transliteration} (${w.arabic}) — ${wordCount(w.deeperMeaning)} words`);
  }

  // Stories
  console.log(`\n  📖 STORIES: ${data.stories?.length || 0}`);
  for (const s of data.stories || []) {
    console.log(`     ${s.title} [${s.verseRange}] — ${wordCount(s.narrative)} words`);
  }

  // Notable Verses
  console.log(`\n  ⭐ NOTABLE VERSES: ${data.notableVerses?.length || 0}`);
  for (const v of data.notableVerses || []) {
    const hasArabic = v.arabic && v.arabic.length > 5 ? "✅" : "❌";
    const hasHadith = v.relatedHadith && v.relatedHadith.length > 10 ? "✅" : "❌";
    console.log(`     Ayah ${v.ayah}: Arabic${hasArabic} Hadith${hasHadith} — tafsir ${wordCount(v.tafsirExcerpt)}w, linguistic ${wordCount(v.linguisticNote)}w`);
  }

  // Connections
  console.log(`\n  🔗 CONNECTIONS: ${data.connections?.length || 0}`);
  for (const c of data.connections || []) {
    console.log(`     → Surah ${c.surah} (${c.surahName}): ${wordCount(c.relationship)} words`);
  }

  // Scholarly Notes
  console.log(`\n  🎓 SCHOLARLY NOTES: ${wordCount(data.scholarlyNotes)} words`);

  // Total word count
  const total = [
    data.historicalContext?.background,
    data.historicalContext?.occasionOfRevelation,
    data.audience,
    data.coreMessage?.thesis,
    data.coreMessage?.emotionalArc,
    data.coreMessage?.buildUp,
    ...(data.sections || []).map((s: any) => s.summary),
    ...(data.keyVocabulary || []).map((w: any) => w.deeperMeaning),
    ...(data.stories || []).map((s: any) => s.narrative + " " + s.lesson),
    ...(data.notableVerses || []).map(
      (v: any) =>
        `${v.tafsirExcerpt} ${v.linguisticNote} ${v.practicalApplication} ${v.relatedHadith}`
    ),
    ...(data.connections || []).map((c: any) => c.relationship),
    data.scholarlyNotes,
  ]
    .filter(Boolean)
    .reduce((sum, t) => sum + wordCount(t), 0);

  console.log(`\n  📊 TOTAL WORD COUNT: ${total}`);
}

// ─── Main ───
const surahNum = Number(process.argv[2]);
if (!surahNum || surahNum < 1 || surahNum > 114) {
  console.log("Usage: npx tsx scripts/compare-insights.ts <surah_number>");
  console.log("Example: npx tsx scripts/compare-insights.ts 1");
  process.exit(1);
}

// Claude data
const claudeData = SURAH_INSIGHTS[surahNum] || null;

// GPT data
const gptPath = join(OUTDIR, `insight-${surahNum}.json`);
const gptData = existsSync(gptPath)
  ? JSON.parse(readFileSync(gptPath, "utf-8"))
  : null;

console.log(`\n🔍 COMPARING INSIGHTS FOR SURAH ${surahNum}\n`);

summarizeInsight("🟣 CLAUDE (hardcoded in app)", claudeData);
summarizeInsight("🟢 GPT-5.3 (generated from source data)", gptData);

// Side-by-side key differences
if (claudeData && gptData) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  📋 KEY DIFFERENCES`);
  console.log(`${"═".repeat(60)}`);

  // Compare section count
  const cSec = claudeData.sections?.length || 0;
  const gSec = gptData.sections?.length || 0;
  if (cSec !== gSec) console.log(`  Sections: Claude=${cSec}, GPT=${gSec}`);

  // Compare verse count
  const cVerse = claudeData.notableVerses?.length || 0;
  const gVerse = gptData.notableVerses?.length || 0;
  if (cVerse !== gVerse) console.log(`  Notable Verses: Claude=${cVerse}, GPT=${gVerse}`);

  // Compare which ayahs were picked
  const cAyahs = (claudeData.notableVerses || []).map((v: any) => v.ayah).sort();
  const gAyahs = (gptData.notableVerses || []).map((v: any) => v.ayah).sort();
  console.log(`  Claude picked ayahs: ${cAyahs.join(", ")}`);
  console.log(`  GPT picked ayahs: ${gAyahs.join(", ")}`);

  // Compare period/chronological
  if (claudeData.historicalContext?.period !== gptData.historicalContext?.period) {
    console.log(`  Period: Claude="${claudeData.historicalContext?.period}", GPT="${gptData.historicalContext?.period}"`);
  }
  if (claudeData.historicalContext?.chronologicalOrder !== gptData.historicalContext?.chronologicalOrder) {
    console.log(`  Chronological: Claude=${claudeData.historicalContext?.chronologicalOrder}, GPT=${gptData.historicalContext?.chronologicalOrder}`);
  }

  // Print both theses for direct comparison
  console.log(`\n  💡 THESIS COMPARISON:`);
  console.log(`  Claude: "${claudeData.coreMessage?.thesis}"`);
  console.log(`  GPT:    "${gptData.coreMessage?.thesis}"`);
}

if (!gptData) {
  console.log(`\n⚠️  No GPT data found. Run:`);
  console.log(`   npx tsx scripts/fetch-context.ts ${surahNum}`);
  console.log(`   OPENAI_API_KEY=sk-... npx tsx scripts/generate-insight.ts ${surahNum}`);
}
