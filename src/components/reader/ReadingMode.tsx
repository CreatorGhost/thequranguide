import type { Ayah, QVerse, AyahPlayData, SurahGroup } from "@/types/quran";
import { SurahBanner } from "./SurahBanner";
import { AyahNumber } from "./AyahNumber";
import { InteractiveWord } from "./InteractiveWord";
import type { QWord } from "@/types/quran";

function SpeakerIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  );
}

interface ReadingModeProps {
  groupedBySurah: SurahGroup[];
  verseByKey: Map<string, QVerse>;
  playingAyah: number | null;
  playingWordId: number | null;
  pageAyahPlayData: AyahPlayData[];
  ayahPlayIdx: Map<number, number>;
  stopAudio: () => void;
  playWordAudio: (word: QWord, verseKey: string) => void;
  playAyahSequence: (startIdx: number, ayahDataList: AyahPlayData[]) => void;
  showTransliteration?: boolean;
}

export function ReadingMode({
  groupedBySurah,
  verseByKey,
  playingAyah,
  playingWordId,
  pageAyahPlayData,
  ayahPlayIdx,
  stopAudio,
  playWordAudio,
  playAyahSequence,
  showTransliteration,
}: ReadingModeProps) {
  return (
    <>
      <div className="vd-hint">
        <SpeakerIcon size={13} />
        <span>Tap any word to hear its pronunciation &middot; Tap the ayah number to play line-by-line from that point</span>
      </div>

      {groupedBySurah.map((group, gi) => {
        const isFirstAyah = group.ayahs[0].numberInSurah === 1;
        return (
          <div key={gi}>
            {isFirstAyah && (
              <SurahBanner surah={group.surah} showDivider={gi > 0} />
            )}

            <div className="vd-quran">
              {group.ayahs.map((ayah) => {
                const verseKey = `${ayah.surah.number}:${ayah.numberInSurah}`;
                const verse = verseByKey.get(verseKey);
                const isAyahPlaying = playingAyah === ayah.number;

                if (verse && verse.words) {
                  return (
                    <span key={ayah.number} className={isAyahPlaying ? "vd-ayah-playing" : ""}>
                      {verse.words.map((word) => {
                        if (word.char_type_name === "end") {
                          return (
                            <span key={word.id}>
                              {" "}
                              <AyahNumber
                                numberInSurah={ayah.numberInSurah}
                                isPlaying={isAyahPlaying}
                                onToggle={() =>
                                  isAyahPlaying
                                    ? stopAudio()
                                    : playAyahSequence(ayahPlayIdx.get(ayah.number) ?? 0, pageAyahPlayData)
                                }
                              />
                              {" "}
                            </span>
                          );
                        }

                        return (
                          <InteractiveWord
                            key={word.id}
                            word={word}
                            isActive={playingWordId === word.id}
                            onClick={() => playWordAudio(word, verseKey)}
                            showTransliteration={showTransliteration}
                          />
                        );
                      })}
                    </span>
                  );
                }

                return (
                  <span key={ayah.number} className={isAyahPlaying ? "vd-ayah-playing" : ""}>
                    {ayah.text}{" "}
                    <AyahNumber
                      numberInSurah={ayah.numberInSurah}
                      isPlaying={isAyahPlaying}
                      onToggle={() =>
                        isAyahPlaying
                          ? stopAudio()
                          : playAyahSequence(ayahPlayIdx.get(ayah.number) ?? 0, pageAyahPlayData)
                      }
                    />{" "}
                  </span>
                );
              })}
            </div>

            {gi < groupedBySurah.length - 1 &&
              !groupedBySurah[gi + 1].ayahs[0]?.numberInSurah && (
                <div className="vd-surah-divider" />
              )}
          </div>
        );
      })}
    </>
  );
}
