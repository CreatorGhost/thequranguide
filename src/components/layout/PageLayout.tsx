"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  footerVariant?: "full" | "minimal";
}

export function PageLayout({
  children,
  currentPath,
  footerVariant,
}: PageLayoutProps) {
  return (
    <div className="tqg-page tqg-noise">
      {/* Central golden glow */}
      <div className="tqg-glow" />

      <Navbar currentPath={currentPath} />

      {children}

      <Footer variant={footerVariant} />
    </div>
  );
}
