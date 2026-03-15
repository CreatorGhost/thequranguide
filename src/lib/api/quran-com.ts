import type { QVerse } from "@/types/quran";

const BASE = "https://api.quran.com/api/v4";

export async function fetchPageWords(page: number): Promise<QVerse[]> {
  const res = await fetch(
    `${BASE}/verses/by_page/${page}?language=en&words=true&word_fields=text_uthmani,text_indopak,audio_url&per_page=50`
  );
  const json = await res.json();
  if (json.verses) return json.verses;
  throw new Error(`Failed to fetch words for page ${page}`);
}

/** Fetch Indo-Pak script text for a page (verse-level) */
export async function fetchPageIndoPak(page: number): Promise<Map<string, string>> {
  const res = await fetch(`${BASE}/quran/verses/indopak?page_number=${page}`);
  const json = await res.json();
  const map = new Map<string, string>();
  if (json.verses) {
    for (const v of json.verses) {
      map.set(v.verse_key, v.text_indopak);
    }
  }
  return map;
}
