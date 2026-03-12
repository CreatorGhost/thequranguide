import { toArabicNum } from "@/lib/utils";

interface AyahNumberProps {
  numberInSurah: number;
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}

export function AyahNumber({ numberInSurah, isPlaying, onToggle, className = "" }: AyahNumberProps) {
  return (
    <span
      className={`vd-anum vd-anum-btn ${isPlaying ? "playing" : ""} ${className}`}
      onClick={onToggle}
      title={isPlaying ? "Stop recitation" : "Play from this ayah"}
    >
      {isPlaying ? (
        <svg width={9} height={9} viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      ) : (
        toArabicNum(numberInSurah)
      )}
    </span>
  );
}
