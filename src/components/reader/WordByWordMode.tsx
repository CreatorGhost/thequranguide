import type { Ayah, QWord, VersesGroup } from "@/types/quran";
import { toArabicNum } from "@/lib/utils";
import { SurahBanner } from "./SurahBanner";

function PlayIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
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

function SpeakerIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  );
}

function SpeakerWaveIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  );
}

interface WordByWordModeProps {
  versesGrouped: VersesGroup[];
  surahInfo: Record<number, Ayah["surah"]>;
  translationMap: Map<string, string>;
  ayahNumMap: Map<string, number>;
  playingAyah: number | null;
  playingWordId: number | null;
  isSequentialPlaying: string | null;
  stopAudio: () => void;
  playWordAudio: (word: QWord, verseKey: string) => void;
  playAyahAudio: (globalAyahNum: number) => void;
  playWordsSequentially: (words: QWord[], verseKey: string) => void;
}

function isRtlText(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

export function WordByWordMode({
  versesGrouped,
  surahInfo,
  translationMap,
  ayahNumMap,
  playingAyah,
  playingWordId,
  isSequentialPlaying,
  stopAudio,
  playWordAudio,
  playAyahAudio,
  playWordsSequentially,
}: WordByWordModeProps) {
  return (
    <>
      {versesGrouped.map((group, gi) => {
        const info = surahInfo[group.chapterId];
        const isFirstVerse = group.verses[0]?.verse_number === 1;
        return (
          <div key={gi}>
            {isFirstVerse && info && (
              <SurahBanner surah={info} showDivider={gi > 0} />
            )}
            {group.verses.map((verse) => {
              const verseNum = parseInt(verse.verse_key.split(":")[1]);
              const globalNum = ayahNumMap.get(verse.verse_key);
              const translation = translationMap.get(verse.verse_key) || null;
              const isSeqPlaying = isSequentialPlaying === verse.verse_key;
              const isAyahPlaying = globalNum != null && playingAyah === globalNum;
              return (
                <div key={verse.id} className="vd-wbw-ayah">
                  <div className="vd-wbw-ayah-header">
                    <button
                      className={`vd-play-btn ${isAyahPlaying ? "playing" : ""}`}
                      onClick={() =>
                        isAyahPlaying ? stopAudio() : globalNum ? playAyahAudio(globalNum) : null
                      }
                    >
                      {isAyahPlaying ? <StopIcon size={10} /> : <SpeakerWaveIcon size={12} />}
                      <span>Full Ayah</span>
                    </button>
                    <span className="vd-wbw-ayah-label">
                      {info?.englishName || `Surah ${group.chapterId}`} &middot; Ayah {verseNum}
                    </span>
                    <button
                      className={`vd-play-btn ${isSeqPlaying ? "playing" : ""}`}
                      onClick={() =>
                        isSeqPlaying
                          ? stopAudio()
                          : playWordsSequentially(verse.words, verse.verse_key)
                      }
                    >
                      {isSeqPlaying ? <StopIcon size={10} /> : <PlayIcon size={10} />}
                      <span>{isSeqPlaying ? "Stop" : "Word by Word"}</span>
                    </button>
                  </div>
                  <div className="vd-wbw-words">
                    {verse.words.map((word) => {
                      if (word.char_type_name === "end") {
                        return (
                          <div key={word.id} className="vd-wbw-end" style={{ alignSelf: "center" }}>
                            {toArabicNum(verseNum)}
                          </div>
                        );
                      }
                      const isWordPlaying = playingWordId === word.id;
                      return (
                        <div
                          key={word.id}
                          className={`vd-word-card ${isWordPlaying ? "playing" : ""}`}
                          onClick={() => playWordAudio(word, verse.verse_key)}
                        >
                          <div className="vd-word-card-speaker">
                            <SpeakerIcon size={10} />
                          </div>
                          <div className="vd-word-arabic">{word.text_indopak || word.text_uthmani || word.text}</div>
                          {word.transliteration?.text && (
                            <div className="vd-word-translit">{word.transliteration.text}</div>
                          )}
                          {word.translation?.text && (
                            <div className="vd-word-meaning">{word.translation.text}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {translation && (
                    <div
                      className="vd-full-translation"
                      style={isRtlText(translation) ? { direction: "rtl", textAlign: "right", fontSize: "19px", lineHeight: 2.0 } : {}}
                    >
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
