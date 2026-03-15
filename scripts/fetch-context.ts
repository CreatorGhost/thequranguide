/**
 * Fetches all source material for a surah from free CDN + API sources.
 * Saves a context packet JSON that the generation script will use.
 *
 * Usage: npx tsx scripts/fetch-context.ts 1 18 93
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const CDN = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir";
const QURAN_API = "https://api.alquran.cloud/v1";

interface ContextPacket {
  surah: number;
  surahName: string;
  englishName: string;
  meaning: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahTexts: { number: number; arabic: string; english: string }[];
  ibnKathir: { verse: string; text: string }[];
  jalalayn: { verse: string; text: string }[];
  asbabAlNuzul: { verse: string; text: string }[];
  fetchedAt: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function fetchSurahContext(surahNum: number): Promise<ContextPacket> {
  console.log(`\n📖 Fetching context for Surah ${surahNum}...`);

  // Fetch all sources in parallel
  const [arabicData, englishData, ibnKathirData, jalalaynData, asbabData] =
    await Promise.all([
      fetchJson(`${QURAN_API}/surah/${surahNum}/ar.alafasy`),
      fetchJson(`${QURAN_API}/surah/${surahNum}/en.sahih`),
      fetchJson(`${CDN}/en-tafisr-ibn-kathir/${surahNum}.json`),
      fetchJson(`${CDN}/en-al-jalalayn/${surahNum}.json`),
      fetchJson(`${CDN}/en-asbab-al-nuzul-by-al-wahidi/${surahNum}.json`),
    ]);

  // Parse Quran text
  const surahInfo = arabicData?.data;
  const arabicAyahs = surahInfo?.ayahs || [];
  const englishAyahs = englishData?.data?.ayahs || [];

  const ayahTexts = arabicAyahs.map((a: any, i: number) => ({
    number: a.numberInSurah,
    arabic: a.text,
    english: englishAyahs[i]?.text || "",
  }));

  // Parse tafsir sources
  const parseTafsir = (data: any) => {
    if (!data) return [];
    const entries = Array.isArray(data) ? data : data.ayahs || [];
    return entries
      .filter((e: any) => e.text && stripHtml(e.text).length > 20)
      .map((e: any) => ({
        verse: e.verse_key || `${surahNum}:${e.verse_number}`,
        text: stripHtml(e.text),
      }));
  };

  const ibnKathir = parseTafsir(ibnKathirData);
  const jalalayn = parseTafsir(jalalaynData);
  const asbabAlNuzul = parseTafsir(asbabData);

  console.log(
    `   ✅ ${ayahTexts.length} ayahs, ${ibnKathir.length} Ibn Kathir, ${jalalayn.length} Jalalayn, ${asbabAlNuzul.length} Asbab`
  );

  return {
    surah: surahNum,
    surahName: surahInfo?.name || "",
    englishName: surahInfo?.englishName || "",
    meaning: surahInfo?.englishNameTranslation || "",
    revelationType: surahInfo?.revelationType || "",
    numberOfAyahs: surahInfo?.numberOfAyahs || ayahTexts.length,
    ayahTexts,
    ibnKathir,
    jalalayn,
    asbabAlNuzul,
    fetchedAt: new Date().toISOString(),
  };
}

// ─── Concurrency limiter ───
async function pLimit(concurrency: number, tasks: (() => Promise<void>)[]) {
  const executing = new Set<Promise<void>>();
  for (const task of tasks) {
    const p: Promise<void> = task().then(() => { executing.delete(p); });
    executing.add(p);
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
}

// ─── Main ───
const rawArgs = process.argv.slice(2);
const hasAll = rawArgs.includes("--all");
const hasForce = rawArgs.includes("--force");
const numericArgs = rawArgs.filter((a) => !a.startsWith("--")).map(Number).filter((n) => n >= 1 && n <= 114);

const surahNums = hasAll ? Array.from({ length: 114 }, (_, i) => i + 1) : numericArgs;

if (surahNums.length === 0) {
  console.log("Usage: npx tsx scripts/fetch-context.ts [--all] [--force] 1 18 93");
  console.log("");
  console.log("Flags:");
  console.log("  --all    Fetch context for all 114 surahs");
  console.log("  --force  Re-fetch even if context file already exists");
  process.exit(1);
}

const outDir = join(new URL(".", import.meta.url).pathname, "output");
mkdirSync(outDir, { recursive: true });

(async () => {
  let fetched = 0;
  let skipped = 0;

  const tasks = surahNums.map((surahNum) => async () => {
    const path = join(outDir, `context-${surahNum}.json`);

    // Skip if already exists and --force not set
    if (!hasForce && existsSync(path)) {
      skipped++;
      return;
    }

    try {
      const ctx = await fetchSurahContext(surahNum);
      writeFileSync(path, JSON.stringify(ctx, null, 2));
      fetched++;
      console.log(`   [${fetched + skipped}/${surahNums.length}] Saved context-${surahNum}.json`);
    } catch (err) {
      console.error(`   Failed for surah ${surahNum}:`, err);
    }
  });

  // Run with concurrency limit of 5
  await pLimit(5, tasks);

  console.log(`\nDone. Fetched: ${fetched}, Skipped: ${skipped}`);
})();
