import Link from "next/link";

interface FooterProps {
  variant?: "full" | "minimal";
}

const navigateLinks = [
  { label: "Read Quran", href: "/read" },
  { label: "Insights", href: "/insights" },
  { label: "Search", href: "/search" },
  { label: "Duas", href: "/dua" },
];

const learnLinks = [
  { label: "Arabic Study", href: "/learn" },
  { label: "Quiz", href: "/quiz" },
  { label: "Vocabulary", href: "/learn" },
  { label: "Grammar", href: "/learn" },
];

const moreLinks = [
  { label: "Khatmah Tracker", href: "/khatmah" },
  { label: "Quiz", href: "/quiz" },
  { label: "Search", href: "/search" },
  { label: "Learn Arabic", href: "/learn" },
];

function FooterBottom() {
  return (
    <div
      className="border-t py-6 text-center"
      style={{ borderColor: "var(--tqg-border)" }}
    >
      <p
        className="text-sm"
        style={{ color: "var(--tqg-text-muted)" }}
      >
        &copy; 2026 The Quran Guide
      </p>
      <p
        className="tqg-arabic mt-2 text-sm"
        style={{ color: "var(--tqg-text-muted)", lineHeight: "1.8" }}
      >
        رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ
      </p>
    </div>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4
        className="tqg-heading mb-4 text-sm font-semibold tracking-wide uppercase"
        style={{ color: "var(--tqg-gold-light)" }}
      >
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm transition-colors duration-200 no-underline hover:opacity-80"
              style={{ color: "var(--tqg-text-muted)" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ variant = "full" }: FooterProps) {
  if (variant === "minimal") {
    return (
      <footer className="mt-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FooterBottom />
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto px-4 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top border */}
        <div
          className="mb-12"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, var(--tqg-gold), transparent)",
          }}
        />

        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding column */}
          <div>
            <h3
              className="tqg-heading text-lg font-semibold"
              style={{ color: "var(--tqg-gold-light)" }}
            >
              The Quran Guide
            </h3>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--tqg-text-muted)" }}
            >
              Your companion for understanding, memorizing, and living the Holy
              Quran. AI-powered tafsir, word-by-word translation, and beautiful
              recitation.
            </p>
          </div>

          <FooterLinkColumn title="Navigate" links={navigateLinks} />
          <FooterLinkColumn title="Learn" links={learnLinks} />
          <FooterLinkColumn title="More" links={moreLinks} />
        </div>

        {/* Bottom */}
        <div className="mt-12">
          <FooterBottom />
        </div>
      </div>
    </footer>
  );
}
