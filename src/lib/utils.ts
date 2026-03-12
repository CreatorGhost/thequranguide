import type { QWord } from "@/types/quran";

const ARABIC_DIGITS = ["\u0660", "\u0661", "\u0662", "\u0663", "\u0664", "\u0665", "\u0666", "\u0667", "\u0668", "\u0669"];

export function toArabicNum(n: number): string {
  return String(n)
    .split("")
    .map((c) => ARABIC_DIGITS[parseInt(c)] || c)
    .join("");
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function getWordAudioUrl(word: QWord, verseKey: string): string {
  const [chapter, verse] = verseKey.split(":");
  return `https://audio.qurancdn.com/wbw/${chapter.padStart(3, "0")}_${verse.padStart(3, "0")}_${String(word.position).padStart(3, "0")}.mp3`;
}

export function getAyahAudioUrl(globalAyahNum: number, reciter = "ar.alafasy"): string {
  const reciterMap: Record<string, string> = {
    "ar.alafasy": "https://cdn.islamic.network/quran/audio/128/ar.alafasy",
    "ar.abdulbasit": "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmujawwad",
    "ar.sudais": "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais",
  };
  const base = reciterMap[reciter] || reciterMap["ar.alafasy"];
  return `${base}/${globalAyahNum}.mp3`;
}

export const BISMILLAH = "\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064E\u0647\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650";

export const TOTAL_PAGES = 604;
