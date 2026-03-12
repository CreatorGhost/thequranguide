interface TajweedOverlayProps {
  text: string;
  className?: string;
}

/*
 * Tajweed class-to-color mapping.
 * These map the CSS classes used in `text_uthmani_tajweed` from the Quran API
 * (e.g. <tajweed class="ham_wasl">) to distinct colors for visual tajweed coding.
 */
const TAJWEED_COLORS: Record<string, string> = {
  ham_wasl: "#4CAF50",           // green
  laam_shamsiyah: "#FF9800",     // orange
  madda_normal: "#2196F3",       // blue
  qalqala: "#F44336",            // red
  ghunnah: "#9C27B0",            // purple
  ikhfaa: "#009688",             // teal
  idghaam: "#3F51B5",            // indigo
  iqlab: "#E91E63",              // pink
  madd: "#00BCD4",               // cyan
  madda_permissible: "#00BCD4",  // cyan (alternate madd)
  madda_obligatory: "#0097A7",   // dark cyan
  madda_necessary: "#00838F",    // deeper cyan
  ikhfaa_shafawi: "#26A69A",     // teal variant
  idghaam_shafawi: "#5C6BC0",    // indigo variant
  idghaam_ghunnah: "#7E57C2",    // deep purple
  idghaam_wo_ghunnah: "#5C6BC0", // indigo variant
  ikhfaa_ikhfaa: "#009688",      // teal
  silent: "#757575",             // grey
};

interface TajweedSegment {
  text: string;
  className: string | null;
}

/**
 * Parse the tajweed-annotated text into segments.
 * Input format example:
 *   "بِسْمِ <tajweed class="ham_wasl">ٱ</tajweed>للَّهِ"
 *
 * This extracts the class names and plain text content.
 */
function parseTajweedText(raw: string): TajweedSegment[] {
  const segments: TajweedSegment[] = [];
  const tagPattern = /<tajweed\s+class="([^"]*)">([\s\S]*?)<\/tajweed>/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(raw)) !== null) {
    // Text before this tag
    if (match.index > lastIndex) {
      const before = raw.slice(lastIndex, match.index);
      if (before) {
        segments.push({ text: before, className: null });
      }
    }

    // The tagged text
    segments.push({
      text: match[2],
      className: match[1],
    });

    lastIndex = match.index + match[0].length;
  }

  // Any remaining text after the last tag
  if (lastIndex < raw.length) {
    const remainder = raw.slice(lastIndex);
    if (remainder) {
      segments.push({ text: remainder, className: null });
    }
  }

  return segments;
}

export function TajweedOverlay({ text, className }: TajweedOverlayProps) {
  // If text contains no tajweed tags, render plain
  if (!text.includes("<tajweed")) {
    return <span className={className}>{text}</span>;
  }

  const segments = parseTajweedText(text);

  return (
    <>
      <style>{`
        .tjw-wrap {
          direction: rtl;
          line-height: inherit;
          font-family: inherit;
          font-size: inherit;
        }
        .tjw-tag {
          position: relative;
          transition: opacity 0.15s;
        }
        .tjw-tag:hover {
          opacity: 0.85;
        }
        .tjw-tip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) scale(0.9);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s, transform 0.2s;
          z-index: 100;
          background: rgba(16, 14, 10, 0.96);
          border: 1px solid rgba(212, 180, 74, 0.20);
          border-radius: 8px;
          padding: 6px 12px;
          white-space: nowrap;
          font-family: 'EB Garamond', serif;
          font-size: 11px;
          color: rgba(212, 180, 74, 0.60);
          letter-spacing: 0.04em;
          direction: ltr;
          backdrop-filter: blur(8px);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
        }
        .tjw-tip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: rgba(212, 180, 74, 0.15);
        }
        .tjw-tag:hover .tjw-tip {
          opacity: 1;
          transform: translateX(-50%) scale(1);
          pointer-events: auto;
        }
      `}</style>

      <span className={`tjw-wrap ${className || ""}`}>
        {segments.map((seg, i) => {
          if (!seg.className) {
            return <span key={i}>{seg.text}</span>;
          }

          const color = TAJWEED_COLORS[seg.className] || "#F0DFA0";
          const label = seg.className.replace(/_/g, " ");

          return (
            <span
              key={i}
              className="tjw-tag"
              style={{ color }}
            >
              {seg.text}
              <span className="tjw-tip">
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                    marginRight: 6,
                    verticalAlign: "middle",
                  }}
                />
                {label}
              </span>
            </span>
          );
        })}
      </span>
    </>
  );
}
