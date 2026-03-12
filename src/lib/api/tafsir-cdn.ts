/**
 * Fetch + cache client for spa5k tafsir CDN
 * https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/{slug}/{surah}.json
 */

const CDN_BASE = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir";

export type TafsirSlug =
  | "en-tafisr-ibn-kathir"
  | "en-al-jalalayn"
  | "en-asbab-al-nuzul-by-al-wahidi";

export interface TafsirEntry {
  id: number;
  verse_number: number;
  verse_key: string;
  text: string;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function cacheKey(slug: TafsirSlug, surah: number): string {
  return `tqg-tafsir-${slug}-${surah}`;
}

function getFromCache(key: string): TafsirEntry[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key: string, data: TafsirEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage full — silently fail
  }
}

export async function fetchTafsir(
  slug: TafsirSlug,
  surah: number
): Promise<TafsirEntry[]> {
  const key = cacheKey(slug, surah);
  const cached = getFromCache(key);
  if (cached) return cached;

  const url = `${CDN_BASE}/${slug}/${surah}.json`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const json = await res.json();
  // CDN returns either an array or { ayahs: [...] }
  const entries: TafsirEntry[] = Array.isArray(json) ? json : json.ayahs ?? [];

  setCache(key, entries);
  return entries;
}

/** Fetch Ibn Kathir tafsir for a surah */
export function fetchIbnKathir(surah: number) {
  return fetchTafsir("en-tafisr-ibn-kathir", surah);
}

/** Fetch Al-Jalalayn (concise) tafsir for a surah */
export function fetchJalalayn(surah: number) {
  return fetchTafsir("en-al-jalalayn", surah);
}

/** Fetch Asbab al-Nuzul (revelation context) for a surah */
export function fetchAsbabAlNuzul(surah: number) {
  return fetchTafsir("en-asbab-al-nuzul-by-al-wahidi", surah);
}
