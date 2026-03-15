"use client";

import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  currentPath: string;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Read", href: "/read" },
  { label: "Insights", href: "/insights" },
  { label: "Learn", href: "/learn" },
  { label: "Quiz", href: "/quiz" },
  { label: "Duas", href: "/dua" },
  { label: "Khatmah", href: "/khatmah" },
  { label: "Search", href: "/search" },
];

export function Navbar({ currentPath }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  return (
    <nav
      className="tqg-nav fixed top-0 left-0 right-0 z-50"
      style={{ borderBottom: "1px solid var(--tqg-border)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <svg
              className="h-8 w-8"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="16"
                cy="16"
                r="10"
                stroke="var(--tqg-gold)"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <circle
                cx="16"
                cy="16"
                r="6"
                stroke="var(--tqg-gold)"
                strokeWidth="0.6"
                opacity="0.35"
              />
              <circle
                cx="16"
                cy="16"
                r="2"
                fill="var(--tqg-gold)"
                opacity="0.6"
              />
              <line
                x1="16"
                y1="4"
                x2="16"
                y2="7"
                stroke="var(--tqg-gold)"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <line
                x1="16"
                y1="25"
                x2="16"
                y2="28"
                stroke="var(--tqg-gold)"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <line
                x1="4"
                y1="16"
                x2="7"
                y2="16"
                stroke="var(--tqg-gold)"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <line
                x1="25"
                y1="16"
                x2="28"
                y2="16"
                stroke="var(--tqg-gold)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </svg>
            <div className="flex flex-col leading-none">
              <span
                className="tqg-heading text-sm font-semibold tracking-wide"
                style={{ color: "var(--tqg-gold-light)" }}
              >
                The Quran Guide
              </span>
              <span
                className="tqg-arabic text-xs"
                style={{
                  color: "var(--tqg-text-muted)",
                  lineHeight: "1.4",
                  direction: "rtl",
                }}
              >
                دليل القرآن
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 no-underline"
                style={{
                  color: isActive(link.href)
                    ? "var(--tqg-gold-light)"
                    : "var(--tqg-text-muted)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/read"
              className="tqg-btn-filled hidden text-sm sm:inline-flex"
            >
              Begin Reading
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
              style={{ color: "var(--tqg-text-muted)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div
          className="border-t md:hidden"
          style={{
            borderColor: "var(--tqg-border)",
            background: "rgba(13, 11, 8, 0.95)",
          }}
        >
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 no-underline"
                style={{
                  color: isActive(link.href)
                    ? "var(--tqg-gold-light)"
                    : "var(--tqg-text-muted)",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/read"
              className="tqg-btn-filled mt-2 block w-full text-center text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Begin Reading
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
