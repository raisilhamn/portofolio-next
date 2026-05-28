"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "./copy-button";

export function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const id = "m-" + Math.random().toString(36).slice(2, 8);

  useEffect(() => {
    import("mermaid")
      .then((mod) => {
        const mermaid = mod.default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
        });

        if (ref.current) {
          ref.current.innerHTML = "";
        }

        mermaid.render(id, code).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        });
      })
      .catch(() => setError("Failed to render diagram"));
  }, [code, id]);

  if (error) {
    return (
      <div className="my-4 p-4 text-red-500 text-sm border border-red-300 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="my-6 space-y-4">
      <div className="flex justify-center p-6 rounded-lg bg-white border border-[var(--color-border)]">
        <div ref={ref} />
      </div>
      <div className="relative group">
        <CopyButton code={code} />
        <pre className="overflow-x-auto p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
          <code className="leading-relaxed">{code}</code>
        </pre>
      </div>
    </div>
  );
}
