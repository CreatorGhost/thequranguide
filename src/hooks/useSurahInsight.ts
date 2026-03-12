"use client";

import { useState, useEffect } from "react";
import { SURAHS } from "@/data/surahs";
import { SURAH_INSIGHTS, type SurahInsight } from "@/data/surah-insights";
import {
  fetchIbnKathir,
  fetchAsbabAlNuzul,
  type TafsirEntry,
} from "@/lib/api/tafsir-cdn";
import type { SurahInfo } from "@/types/quran";

export interface SurahInsightData {
  surahInfo: SurahInfo | null;
  curated: SurahInsight | null;
  ibnKathir: TafsirEntry[];
  asbabAlNuzul: TafsirEntry[];
  loading: boolean;
  hasCurated: boolean;
}

export function useSurahInsight(surahNum: number): SurahInsightData {
  const [ibnKathir, setIbnKathir] = useState<TafsirEntry[]>([]);
  const [asbabAlNuzul, setAsbabAlNuzul] = useState<TafsirEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const surahInfo = SURAHS.find((s) => s.number === surahNum) ?? null;
  const curated = SURAH_INSIGHTS[surahNum] ?? null;

  useEffect(() => {
    if (surahNum < 1 || surahNum > 114) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([fetchIbnKathir(surahNum), fetchAsbabAlNuzul(surahNum)])
      .then(([ik, an]) => {
        if (!cancelled) {
          setIbnKathir(ik);
          setAsbabAlNuzul(an);
        }
      })
      .catch(() => {
        // CDN failures are non-critical
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [surahNum]);

  return {
    surahInfo,
    curated,
    ibnKathir,
    asbabAlNuzul,
    loading,
    hasCurated: curated !== null,
  };
}
