import type { QWord } from "@/types/quran";

interface InteractiveWordProps {
  word: QWord;
  isActive: boolean;
  onClick: () => void;
  showTransliteration?: boolean;
}

function SpeakerIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  );
}

export function InteractiveWord({ word, isActive, onClick, showTransliteration }: InteractiveWordProps) {
  return (
    <span>
      <span
        className={`vd-iword ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        {word.text_indopak || word.text_uthmani || word.text}
        {showTransliteration && word.transliteration?.text && (
          <span className="vd-translit-inline">{word.transliteration.text}</span>
        )}

        <span className="vd-tip">
          {word.translation?.text && (
            <span className="vd-tip-meaning">{word.translation.text}</span>
          )}
          {word.transliteration?.text && (
            <span className="vd-tip-translit">{word.transliteration.text}</span>
          )}
          <span className="vd-tip-listen">
            <SpeakerIcon size={10} />
            {isActive ? "Playing..." : "Tap to listen"}
          </span>
        </span>
      </span>
      {" "}
    </span>
  );
}
