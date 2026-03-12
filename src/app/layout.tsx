import type { Metadata } from "next";
import "./globals.css";
import "../styles/theme.css";
import { ThemeWrapper } from "./theme-wrapper";

export const metadata: Metadata = {
  title: "theQuranGuide — Your AI-Powered Quran Companion",
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
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
