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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const [curated, setCurated] = useState<SurahInsight | null>(
    SURAH_INSIGHTS[surahNum] ?? null
  );
  const [loading, setLoading] = useState(true);

  const surahInfo = SURAHS.find((s) => s.number === surahNum) ?? null;

  useEffect(() => {
    // Reset to static fallback on surah change
    setCurated(SURAH_INSIGHTS[surahNum] ?? null);

    if (surahNum < 1 || surahNum > 114) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Fetch CDN tafsir data + API insight in parallel
    const cdnPromise = Promise.all([
      fetchIbnKathir(surahNum),
      fetchAsbabAlNuzul(surahNum),
    ]);

    const apiPromise = fetch(`${API_BASE}/api/insights/${surahNum}`)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);

    Promise.all([cdnPromise, apiPromise])
      .then(([[ik, an], apiData]) => {
        if (cancelled) return;
        setIbnKathir(ik);
        setAsbabAlNuzul(an);
        // API insight overrides static data if available
        if (apiData?.content) {
          setCurated(apiData.content as SurahInsight);
        }
      })
      .catch(() => {
        // Failures are non-critical — static fallback remains
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
