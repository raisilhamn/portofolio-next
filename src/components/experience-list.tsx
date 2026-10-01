"use client";

import { useState } from "react";

type Experience = {
  title: string;
  company: string;
  companyUrl: string;
  period: string;
  summary: string;
  details: string[];
  tags: string[];
};

export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [pinnedTitles, setPinnedTitles] = useState<string[]>([]);

  function togglePinned(title: string) {
    setPinnedTitles((current) =>
      current.includes(title)
        ? current.filter((pinnedTitle) => pinnedTitle !== title)
        : [...current, title],
    );
    setHoveredTitle(null);
  }

  return (
    <div className="space-y-1">
      {experiences.map((exp, index) => {
        const pinned = pinnedTitles.includes(exp.title);
        const expanded = hoveredTitle === exp.title || pinned;
        const detailsId = `experience-details-${index}`;

        return (
          <article
            key={exp.title}
            className="border-b border-[var(--color-border)] py-4"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHoveredTitle(exp.title);
            }}
            onPointerLeave={() => {
              setHoveredTitle((current) => (current === exp.title ? null : current));
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={detailsId}
                    onClick={() => togglePinned(exp.title)}
                    className="cursor-pointer text-left font-sans text-sm font-medium hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-link)]"
                  >
                    {exp.title}
                  </button>
                  <span className="text-xs text-[var(--color-muted-2)]">&middot;</span>
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-link)] no-underline hover:underline"
                  >
                    {exp.company}
                  </a>
                </div>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={detailsId}
                  onClick={() => togglePinned(exp.title)}
                  className="mt-0.5 block cursor-pointer text-left text-xs text-[var(--color-muted)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-link)]"
                >
                  {exp.summary}
                </button>
              </div>
              <button
                type="button"
                aria-label={
                  pinned
                    ? `Collapse ${exp.title} details`
                    : expanded
                      ? `Keep ${exp.title} details open`
                      : `Expand ${exp.title} details`
                }
                aria-expanded={expanded}
                aria-controls={detailsId}
                onClick={() => togglePinned(exp.title)}
                className="flex shrink-0 cursor-pointer items-center gap-3 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-link)]"
              >
                <span className="font-mono text-xs text-[var(--color-muted-2)]">{exp.period}</span>
                <span
                  aria-hidden="true"
                  className={`font-mono text-sm text-[var(--color-muted-2)] transition-transform duration-300 ease-out motion-reduce:transition-none ${pinned ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
            </div>
            <div
              id={detailsId}
              aria-hidden={!expanded}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pt-4">
                  <ul className="space-y-2.5">
                    {exp.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-sm text-[var(--color-muted)]">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-border-hover)]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-[var(--color-border)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
