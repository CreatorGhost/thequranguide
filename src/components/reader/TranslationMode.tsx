import type { Ayah, AyahPlayData, SurahGroup } from "@/types/quran";
import { toArabicNum } from "@/lib/utils";
import { SurahBanner } from "./SurahBanner";

function SpeakerIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  );
}

function StopIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

// Detect if text contains RTL characters (Arabic, Urdu, Farsi, etc.)
function isRtlText(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

interface TranslationModeProps {
  groupedBySurah: SurahGroup[];
  translationMap: Map<string, string>;
  playingAyah: number | null;
  pageAyahPlayData: AyahPlayData[];
  ayahPlayIdx: Map<number, number>;
  stopAudio: () => void;
  playAyahSequence: (startIdx: number, ayahDataList: AyahPlayData[]) => void;
}

export function TranslationMode({
  groupedBySurah,
  translationMap,
  playingAyah,
  pageAyahPlayData,
  ayahPlayIdx,
  stopAudio,
  playAyahSequence,
}: TranslationModeProps) {
  return (
    <>
      {groupedBySurah.map((group, gi) => {
        const isFirstAyah = group.ayahs[0].numberInSurah === 1;
        return (
          <div key={gi}>
            {isFirstAyah && (
              <SurahBanner surah={group.surah} showDivider={gi > 0} />
            )}
            {group.ayahs.map((ayah) => {
              const verseKey = `${ayah.surah.number}:${ayah.numberInSurah}`;
              const translation = translationMap.get(verseKey);
              const isPlaying = playingAyah === ayah.number;
              return (
                <div key={ayah.number} className={`vd-trans-ayah ${isPlaying ? "playing" : ""}`}>
                  <div className="vd-trans-header">
                    <div className="vd-trans-ref">
                      {ayah.surah.englishName} {ayah.surah.number}:{ayah.numberInSurah}
                    </div>
                    <button
                      className={`vd-play-btn ${isPlaying ? "playing" : ""}`}
                      onClick={() =>
                        isPlaying
                          ? stopAudio()
                          : playAyahSequence(ayahPlayIdx.get(ayah.number) ?? 0, pageAyahPlayData)
                      }
                    >
                      {isPlaying ? <StopIcon size={10} /> : <SpeakerIcon size={12} />}
                      <span>{isPlaying ? "Stop" : "Listen"}</span>
                    </button>
                  </div>
                  <div className="vd-trans-arabic">
                    {ayah.text} <span className="vd-anum">{toArabicNum(ayah.numberInSurah)}</span>
                  </div>
                  {translation && (
                    <div className={`vd-trans-english${isRtlText(translation) ? " rtl-text" : ""}`}>
                      {translation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
