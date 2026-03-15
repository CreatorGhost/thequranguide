// ─── Al Quran Cloud API types ───
export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  hizbQuarter: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

// ─── Quran.com v4 API types ───
export interface QWord {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: "word" | "end";
  text_uthmani: string;
  text_indopak: string;
  text: string;
  translation: { text: string; language_name: string } | null;
  transliteration: { text: string; language_name: string } | null;
}

export interface QVerse {
  id: number;
  verse_number: number;
  verse_key: string;
  chapter_id: number;
  hizb_number: number;
  juz_number: number;
  manzil_number: number;
  page_number: number;
  words: QWord[];
}

export type ViewMode = "reading" | "translation" | "word-by-word";

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  startPage: number;
  revelationType: "Meccan" | "Medinan";
}

export interface JuzInfo {
  number: number;
  startPage: number;
  startSurah: number;
  startAyah: number;
}

export interface SurahGroup {
  surah: Ayah["surah"];
  ayahs: Ayah[];
}

export interface VersesGroup {
  chapterId: number;
  verses: QVerse[];
}

export interface AyahPlayData {
  ayahNum: number;
  verseKey: string;
  words: QWord[];
}
