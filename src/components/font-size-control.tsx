"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "font-size";
const MIN = 0.8;
const MAX = 1.4;
const STEP = 0.05;

export function FontSizeControl() {
  const [size, setSize] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = parseFloat(localStorage.getItem(STORAGE_KEY) || "1");
    const clamped = Math.min(MAX, Math.max(MIN, saved));
    setSize(clamped);
    document.documentElement.style.fontSize = `${clamped * 100}%`;
    setMounted(true);
  }, []);

  const update = useCallback((val: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, val));
    const rounded = Math.round(clamped / STEP) * STEP;
    setSize(rounded);
    document.documentElement.style.fontSize = `${rounded * 100}%`;
    localStorage.setItem(STORAGE_KEY, String(rounded));
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 shadow-sm opacity-30 hover:opacity-100 transition-opacity duration-300">
      <button
        onClick={() => update(size - STEP)}
        className="flex items-center justify-center w-6 h-6 rounded border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer text-xs font-mono"
        aria-label="Decrease font size"
      >
        A-
      </button>
      <span
        onClick={() => update(1)}
        className="font-mono text-[11px] text-[var(--color-muted)] w-8 text-center tabular-nums cursor-pointer hover:text-[var(--color-fg)] transition-colors"
        title="Reset to 100%"
      >
        {Math.round(size * 100)}%
      </span>
      <button
        onClick={() => update(size + STEP)}
        className="flex items-center justify-center w-6 h-6 rounded border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer text-xs font-mono"
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
