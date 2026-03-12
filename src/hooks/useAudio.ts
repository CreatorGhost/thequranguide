"use client";

import { useState, useCallback, useRef } from "react";
import type { QWord, AyahPlayData } from "@/types/quran";
import { getWordAudioUrl, getAyahAudioUrl } from "@/lib/utils";

export interface AudioState {
  playingWordId: number | null;
  playingAyah: number | null;
  isSequentialPlaying: string | null;
  reciter: string;
  speed: number;
  loopMode: "none" | "single" | "range";
  loopRange: [number, number] | null;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

export function useAudio() {
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isSequentialPlaying, setIsSequentialPlaying] = useState<string | null>(null);
  const [reciter, setReciter] = useState("ar.alafasy");
  const [speed, setSpeed] = useState(1);
  const [loopMode, setLoopMode] = useState<"none" | "single" | "range">("none");
  const [loopRange, setLoopRange] = useState<[number, number] | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopFlagRef = useRef(false);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAudio = useCallback(() => {
    stopFlagRef.current = true;
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingWordId(null);
    setPlayingAyah(null);
    setIsSequentialPlaying(null);
  }, []);

  const playWordAudio = useCallback((word: QWord, verseKey: string) => {
    stopAudio();
    stopFlagRef.current = false;
    const url = getWordAudioUrl(word, verseKey);
    const audio = new Audio(url);
    audio.playbackRate = speed;
    audioRef.current = audio;
    setPlayingWordId(word.id);
    audio.play().catch(() => setPlayingWordId(null));
    audio.onended = () => {
      audioRef.current = null;
      tooltipTimeoutRef.current = setTimeout(() => setPlayingWordId(null), 1800);
    };
    audio.onerror = () => {
      setPlayingWordId(null);
      audioRef.current = null;
    };
  }, [stopAudio, speed]);

  const playAyahAudio = useCallback((globalAyahNum: number) => {
    stopAudio();
    stopFlagRef.current = false;
    const url = getAyahAudioUrl(globalAyahNum, reciter);
    const audio = new Audio(url);
    audio.playbackRate = speed;
    audioRef.current = audio;
    setPlayingAyah(globalAyahNum);
    audio.play().catch(() => setPlayingAyah(null));
    audio.onended = () => {
      if (loopMode === "single") {
        audio.currentTime = 0;
        audio.play().catch(() => setPlayingAyah(null));
        return;
      }
      setPlayingAyah(null);
      audioRef.current = null;
    };
    audio.onerror = () => {
      setPlayingAyah(null);
      audioRef.current = null;
    };
  }, [stopAudio, reciter, speed, loopMode]);

  const playAyahSequence = useCallback(async (startIdx: number, ayahDataList: AyahPlayData[]) => {
    stopAudio();
    stopFlagRef.current = false;

    const playFrom = async (fromIdx: number) => {
      for (let i = fromIdx; i < ayahDataList.length; i++) {
        if (stopFlagRef.current) break;
        const { ayahNum } = ayahDataList[i];
        setPlayingAyah(ayahNum);

        setTimeout(() => {
          const el = document.querySelector(".vd-ayah-playing");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);

        // Play full ayah audio (not word-by-word)
        const url = getAyahAudioUrl(ayahNum, reciter);
        const audio = new Audio(url);
        audio.playbackRate = speed;
        audioRef.current = audio;

        await new Promise<void>((resolve) => {
          audio.play().catch(() => resolve());
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
        });

        if (stopFlagRef.current) break;

        // Handle single ayah loop
        if (loopMode === "single") {
          i--; // replay same ayah
          await new Promise((r) => setTimeout(r, 300));
          continue;
        }

        await new Promise((r) => setTimeout(r, 400));
      }

      // Handle range loop
      if (!stopFlagRef.current && loopMode === "range" && loopRange) {
        await playFrom(loopRange[0]);
        return;
      }

      setPlayingAyah(null);
      audioRef.current = null;
    };

    await playFrom(startIdx);
  }, [stopAudio, reciter, speed, loopMode, loopRange]);

  const playWordsSequentially = useCallback(async (words: QWord[], verseKey: string) => {
    stopAudio();
    stopFlagRef.current = false;
    setIsSequentialPlaying(verseKey);

    for (const word of words) {
      if (stopFlagRef.current) break;
      if (word.char_type_name !== "word") continue;
      const url = getWordAudioUrl(word, verseKey);
      const audio = new Audio(url);
      audio.playbackRate = speed;
      audioRef.current = audio;
      setPlayingWordId(word.id);
      await new Promise<void>((resolve) => {
        audio.play().catch(() => resolve());
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
      });
      if (stopFlagRef.current) break;
      await new Promise((r) => setTimeout(r, 200));
    }
    setPlayingWordId(null);
    setIsSequentialPlaying(null);
    audioRef.current = null;
  }, [stopAudio, speed]);

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => {
      const idx = SPEEDS.indexOf(prev);
      return SPEEDS[(idx + 1) % SPEEDS.length];
    });
  }, []);

  const cycleReciter = useCallback(() => {
    const reciters = ["ar.alafasy", "ar.abdulbasit", "ar.sudais"];
    setReciter((prev) => {
      const idx = reciters.indexOf(prev);
      return reciters[(idx + 1) % reciters.length];
    });
  }, []);

  const cycleLoopMode = useCallback(() => {
    setLoopMode((prev) => {
      if (prev === "none") return "single";
      if (prev === "single") return "range";
      return "none";
    });
  }, []);

  return {
    playingWordId,
    playingAyah,
    isSequentialPlaying,
    reciter,
    speed,
    loopMode,
    loopRange,
    stopAudio,
    playWordAudio,
    playAyahAudio,
    playAyahSequence,
    playWordsSequentially,
    cycleSpeed,
    cycleReciter,
    cycleLoopMode,
    setReciter,
    setLoopRange,
  };
}
