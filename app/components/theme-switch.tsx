"use client";
import { useEffect, useState } from "react";
import { useTheme, ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider storageKey="theme-preference" {...props}>{children}</NextThemesProvider>;
}
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return <button className="theme-button" aria-label={`Switch to ${dark ? "light" : "dark"} mode`} onClick={() => setTheme(dark ? "light" : "dark")} disabled={!mounted}>
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10 3.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" /></svg>
  </button>;
}
