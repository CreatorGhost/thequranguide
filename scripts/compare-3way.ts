/**
 * 4-way comparison: Claude-Handwritten vs GPT+Context vs GPT-NoContext vs Claude-API
 * Usage: npx tsx scripts/compare-3way.ts 93
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { SURAH_INSIGHTS } from "../src/data/surah-insights";

const OUTDIR = join(new URL(".", import.meta.url).pathname, "output");

const wc = (s: string) => (s ? s.split(/\s+/).filter(Boolean).length : 0);

function getStats(data: any) {
  if (!data) return null;
  const sections = data.sections || [];
  const vocab = data.keyVocabulary || [];
  const stories = data.stories || [];
  const verses = data.notableVerses || [];
  const connections = data.connections || [];

  const totalWords = [
    data.historicalContext?.background,
    data.historicalContext?.occasionOfRevelation,
    data.audience,
    data.coreMessage?.thesis,
    data.coreMessage?.emotionalArc,
    data.coreMessage?.buildUp,
    ...sections.map((s: any) => s.summary),
    ...vocab.map((w: any) => w.deeperMeaning),
    ...stories.map((s: any) => `${s.narrative} ${s.lesson} ${s.connectionToMessage}`),
    ...verses.map((v: any) => `${v.tafsirExcerpt} ${v.linguisticNote} ${v.practicalApplication} ${v.relatedHadith}`),
    ...connections.map((c: any) => c.relationship),
    data.scholarlyNotes,
  ]
    .filter(Boolean)
    .reduce((sum, t) => sum + wc(t), 0);

  // Check hadith quality
  const hadithIssues: string[] = [];
  for (const v of verses) {
    if (!v.relatedHadith || v.relatedHadith.length < 10) {
      hadithIssues.push(`Ayah ${v.ayah}: missing hadith`);
    }
  }

  // Check for likely hallucination markers
  const allText = JSON.stringify(data);
  const hadithCollections = (allText.match(/bukhari|muslim|tirmidhi|abu dawud|nasa'i|ibn majah|ahmad/gi) || []);
  const vagueCitations = (allText.match(/reported in hadith literature/gi) || []);

  return {
    totalWords,
    sections: sections.length,
    avgSectionWords: Math.round(sections.reduce((s: number, sec: any) => s + wc(sec.summary), 0) / Math.max(sections.length, 1)),
    vocab: vocab.length,
    avgVocabWords: Math.round(vocab.reduce((s: number, w: any) => s + wc(w.deeperMeaning), 0) / Math.max(vocab.length, 1)),
    stories: stories.length,
    verses: verses.length,
    connections: connections.length,
    hadithIssues,
    specificCitations: hadithCollections.length,
    vagueCitations: vagueCitations.length,
    thesisWords: wc(data.coreMessage?.thesis),
    backgroundWords: wc(data.historicalContext?.background),
    scholarlyWords: wc(data.scholarlyNotes),
    thesis: data.coreMessage?.thesis || "",
  };
}

// ─── Main ───
const surahNum = Number(process.argv[2]);
if (!surahNum || surahNum < 1 || surahNum > 114) {
  console.log("Usage: npx tsx scripts/compare-3way.ts <surah_number>");
  process.exit(1);
}

const claudeData = SURAH_INSIGHTS[surahNum] || null;

const ctxPath = join(OUTDIR, `insight-${surahNum}.json`);
const ctxData = existsSync(ctxPath) ? JSON.parse(readFileSync(ctxPath, "utf-8")) : null;

const noCtxPath = join(OUTDIR, `insight-${surahNum}-nocontext.json`);
const noCtxData = existsSync(noCtxPath) ? JSON.parse(readFileSync(noCtxPath, "utf-8")) : null;

const claudeApiPath = join(OUTDIR, `insight-${surahNum}-claude.json`);
const claudeApiData = existsSync(claudeApiPath) ? JSON.parse(readFileSync(claudeApiPath, "utf-8")) : null;

const claude = getStats(claudeData);
const withCtx = getStats(ctxData);
const noCtx = getStats(noCtxData);
const claudeApi = getStats(claudeApiData);

console.log(`\n${"═".repeat(80)}`);
console.log(`  COMPARISON — SURAH ${surahNum}`);
console.log(`${"═".repeat(80)}`);

const header = `${"Metric".padEnd(22)} ${"Hand".padStart(8)} ${"GPT+Ctx".padStart(8)} ${"GPT-NoC".padStart(8)} ${"Cld-API".padStart(8)}`;
console.log(`\n  ${header}`);
console.log(`  ${"─".repeat(56)}`);

function row(label: string, a: any, b: any, c: any, d: any) {
  console.log(`  ${label.padEnd(22)} ${String(a ?? "—").padStart(8)} ${String(b ?? "—").padStart(8)} ${String(c ?? "—").padStart(8)} ${String(d ?? "—").padStart(8)}`);
}

row("Total Words", claude?.totalWords, withCtx?.totalWords, noCtx?.totalWords, claudeApi?.totalWords);
row("Sections", claude?.sections, withCtx?.sections, noCtx?.sections, claudeApi?.sections);
row("Avg Section Words", claude?.avgSectionWords, withCtx?.avgSectionWords, noCtx?.avgSectionWords, claudeApi?.avgSectionWords);
row("Key Vocab", claude?.vocab, withCtx?.vocab, noCtx?.vocab, claudeApi?.vocab);
row("Avg Vocab Words", claude?.avgVocabWords, withCtx?.avgVocabWords, noCtx?.avgVocabWords, claudeApi?.avgVocabWords);
row("Stories", claude?.stories, withCtx?.stories, noCtx?.stories, claudeApi?.stories);
row("Notable Verses", claude?.verses, withCtx?.verses, noCtx?.verses, claudeApi?.verses);
row("Connections", claude?.connections, withCtx?.connections, noCtx?.connections, claudeApi?.connections);
row("Background Words", claude?.backgroundWords, withCtx?.backgroundWords, noCtx?.backgroundWords, claudeApi?.backgroundWords);
row("Thesis Words", claude?.thesisWords, withCtx?.thesisWords, noCtx?.thesisWords, claudeApi?.thesisWords);
row("Scholarly Words", claude?.scholarlyWords, withCtx?.scholarlyWords, noCtx?.scholarlyWords, claudeApi?.scholarlyWords);
row("Specific Citations", claude?.specificCitations, withCtx?.specificCitations, noCtx?.specificCitations, claudeApi?.specificCitations);
row("Vague Citations", claude?.vagueCitations, withCtx?.vagueCitations, noCtx?.vagueCitations, claudeApi?.vagueCitations);

// Hadith issues
console.log(`\n  HADITH ISSUES:`);
console.log(`  Hand:      ${claude?.hadithIssues.length === 0 ? "None" : claude?.hadithIssues.join(", ")}`);
console.log(`  GPT+Ctx:   ${withCtx?.hadithIssues.length === 0 ? "None" : withCtx?.hadithIssues.join(", ")}`);
console.log(`  GPT-NoCtx: ${noCtx?.hadithIssues.length === 0 ? "None" : noCtx?.hadithIssues.join(", ")}`);
console.log(`  Cld-API:   ${claudeApi?.hadithIssues.length === 0 ? "None" : (claudeApi?.hadithIssues || ["(no data)"]).join(", ")}`);

// Thesis comparison
console.log(`\n  THESIS COMPARISON:`);
console.log(`  Hand:      "${claude?.thesis || "—"}"`);
console.log(`  GPT+Ctx:   "${withCtx?.thesis || "—"}"`);
console.log(`  GPT-NoCtx: "${noCtx?.thesis || "—"}"`);
console.log(`  Cld-API:   "${claudeApi?.thesis || "—"}"`);
