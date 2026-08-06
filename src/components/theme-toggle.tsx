"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    const swap = () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    };
    const handler = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || !document.startViewTransition) return swap();
      document.startViewTransition(swap);
    };
    toggle.addEventListener("click", handler);
    return () => toggle.removeEventListener("click", handler);
  }, []);

  return (
    <button
      id="theme-toggle"
      className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer"
      aria-label="Toggle theme"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `<svg class="dark:hidden" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg><svg class="hidden dark:block" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
      }}
    />
  );
}
