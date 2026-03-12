import type { QVerse } from "@/types/quran";

const BASE = "https://api.quran.com/api/v4";

export async function fetchPageWords(page: number): Promise<QVerse[]> {
  const res = await fetch(
    `${BASE}/verses/by_page/${page}?language=en&words=true&word_fields=text_uthmani,audio_url&per_page=50`
  );
  const json = await res.json();
  if (json.verses) return json.verses;
  throw new Error(`Failed to fetch words for page ${page}`);
}
