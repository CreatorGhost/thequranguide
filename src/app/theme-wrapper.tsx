"use client";

import { ThemeProvider } from "@/components/ui/ThemeProvider";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
