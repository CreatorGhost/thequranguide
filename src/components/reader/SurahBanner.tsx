import type { Ayah } from "@/types/quran";
import { BISMILLAH } from "@/lib/utils";

interface SurahBannerProps {
  surah: Ayah["surah"];
  showDivider?: boolean;
}

export function SurahBanner({ surah, showDivider }: SurahBannerProps) {
  const isFatiha = surah.number === 1;
  const isTawba = surah.number === 9;

  return (
    <>
      {showDivider && <div className="vd-surah-divider" />}
      <div className="vd-surah-banner">
        <div className="vd-surah-banner-name">{surah.name}</div>
        <div className="vd-surah-banner-meta">
          {surah.englishName} &middot; {surah.englishNameTranslation} &middot; {surah.numberOfAyahs} Ayahs
        </div>
      </div>
      {!isTawba && !isFatiha && (
        <div className="vd-bismillah">{BISMILLAH}</div>
      )}
    </>
  );
}
