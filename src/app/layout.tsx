import type { Metadata } from "next";
import { EB_Garamond, Inter, Amiri } from "next/font/google";
import "./globals.css";
import "../styles/design-system.css";
import "../styles/theme.css";
import { ThemeWrapper } from "./theme-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Quran Guide — Your AI-Powered Quran Companion",
  description: "Read, understand, and live the Holy Quran with AI-powered tafsir, word-by-word translation, and audio recitation.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${inter.variable} ${ebGaramond.variable} ${amiri.variable}`}
      >
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
