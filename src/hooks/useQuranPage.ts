"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { Ayah, QVerse, SurahGroup, VersesGroup, AyahPlayData } from "@/types/quran";
import { fetchPageArabic, fetchPageTranslation } from "@/lib/api/alquran-cloud";
import { fetchPageWords, fetchPageIndoPak } from "@/lib/api/quran-com";

export function useQuranPage(pageNum: number, onPageLoadStart?: () => void, translationLang = "en.sahih") {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [verses, setVerses] = useState<QVerse[]>([]);
  const [engTranslations, setEngTranslations] = useState<{ key: string; text: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    onPageLoadStart?.();
    Promise.all([
      fetchPageArabic(pageNum),
      fetchPageWords(pageNum),
      fetchPageTranslation(pageNum, translationLang),
      fetchPageIndoPak(pageNum),
    ])
      .then(([arabicData, wordsData, transData, indoPakMap]) => {
        if (cancelled) return;
        // Overlay Indo-Pak text onto ayahs for correct script
        const ayahsWithIndoPak = arabicData.map((ayah) => {
          const key = `${ayah.surah.number}:${ayah.numberInSurah}`;
          const indoPakText = indoPakMap.get(key);
          return indoPakText ? { ...ayah, text: indoPakText } : ayah;
        });
        setAyahs(ayahsWithIndoPak);
        setVerses(wordsData);
        setEngTranslations(transData);
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to fetch page:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, translationLang]);

  // ─── Derived data ───
  const groupedBySurah = useMemo<SurahGroup[]>(() => {
    const groups: SurahGroup[] = [];
    let currentSurahNum = -1;
    for (const ayah of ayahs) {
      if (ayah.surah.number !== currentSurahNum) {
        currentSurahNum = ayah.surah.number;
        groups.push({ surah: ayah.surah, ayahs: [] });
      }
      groups[groups.length - 1].ayahs.push(ayah);
    }
    return groups;
  }, [ayahs]);

  const versesGrouped = useMemo<VersesGroup[]>(() => {
    const groups: VersesGroup[] = [];
    let currentChapter = -1;
    for (const verse of verses) {
      const chapterId = parseInt(verse.verse_key.split(":")[0]);
      if (chapterId !== currentChapter) {
        currentChapter = chapterId;
        groups.push({ chapterId, verses: [] });
      }
      groups[groups.length - 1].verses.push(verse);
    }
    return groups;
  }, [verses]);

  const surahInfo = useMemo(() => {
    const info: Record<number, Ayah["surah"]> = {};
    for (const ayah of ayahs) {
      if (!info[ayah.surah.number]) info[ayah.surah.number] = ayah.surah;
    }
    return info;
  }, [ayahs]);

  const translationMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of engTranslations) map.set(t.key, t.text);
    return map;
  }, [engTranslations]);

  const verseByKey = useMemo(() => {
    const map = new Map<string, QVerse>();
    for (const verse of verses) map.set(verse.verse_key, verse);
    return map;
  }, [verses]);

  const ayahNumMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const ayah of ayahs) {
      map.set(`${ayah.surah.number}:${ayah.numberInSurah}`, ayah.number);
    }
    return map;
  }, [ayahs]);

  const pageAyahPlayData = useMemo<AyahPlayData[]>(() => {
    return ayahs.map((a) => {
      const vk = `${a.surah.number}:${a.numberInSurah}`;
      const verse = verseByKey.get(vk);
      return { ayahNum: a.number, verseKey: vk, words: verse?.words || [] };
    });
  }, [ayahs, verseByKey]);

  const ayahPlayIdx = useMemo(() => {
    const map = new Map<number, number>();
    pageAyahPlayData.forEach((d, i) => map.set(d.ayahNum, i));
    return map;
  }, [pageAyahPlayData]);

  const firstSurah = ayahs.length > 0 ? ayahs[0].surah : null;
  const lastSurah = ayahs.length > 0 ? ayahs[ayahs.length - 1].surah : null;
  const juz = ayahs.length > 0 ? ayahs[0].juz : 0;
  const manzil = ayahs.length > 0 ? ayahs[0].manzil : 0;

  return {
    ayahs,
    verses,
    loading,
    groupedBySurah,
    versesGrouped,
    surahInfo,
    translationMap,
    verseByKey,
    ayahNumMap,
    pageAyahPlayData,
    ayahPlayIdx,
    firstSurah,
    lastSurah,
    juz,
    manzil,
  };
}
