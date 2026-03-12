import type { Ayah } from "@/types/quran";

const BASE = "https://api.alquran.cloud/v1";

export async function fetchPageArabic(page: number): Promise<Ayah[]> {
  const res = await fetch(`${BASE}/page/${page}/quran-uthmani`);
  const json = await res.json();
  if (json.code === 200) return json.data.ayahs;
  throw new Error(`Failed to fetch Arabic page ${page}`);
}

export async function fetchPageTranslation(
  page: number,
  edition = "en.sahih"
): Promise<{ key: string; text: string }[]> {
  const res = await fetch(`${BASE}/page/${page}/${edition}`);
  const json = await res.json();
  if (json.code === 200) {
    return json.data.ayahs.map(
      (a: { surah: { number: number }; numberInSurah: number; text: string }) => ({
        key: `${a.surah.number}:${a.numberInSurah}`,
        text: a.text,
      })
    );
  }
  throw new Error(`Failed to fetch translation page ${page}`);
}
