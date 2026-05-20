import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { PostMeta } from "@/lib/posts";

const socialLinks = [
  { label: "Email", href: "mailto:rais@example.com", icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" },
  { label: "GitHub", href: "https://github.com/raisilham", icon: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" },
  { label: "LinkedIn", href: "https://linkedin.com/in/raisilham", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { label: "Twitter", href: "https://twitter.com/raisilham", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
];

const skills = [
  "Go", "TypeScript", "React", "Next.js", "Node.js",
  "PostgreSQL", "Redis", "Docker", "Linux", "Python",
  "C++", "Rust", "GraphQL", "gRPC", "Kubernetes",
];

const experiences = [
  {
    title: "Software Engineer",
    company: "Tech Corp",
    companyUrl: "https://example.com",
    period: "jan 2025 \u2013 present",
    summary: "Building distributed systems and backend infrastructure.",
    details: [
      "Designed and implemented a microservices architecture handling 10k+ requests/sec",
      "Built a real-time data pipeline processing millions of events daily",
      "Reduced latency by 40% through query optimization and caching strategies",
      "Mentored junior engineers through code reviews and pair programming",
    ],
    tags: ["Go", "PostgreSQL", "Redis", "gRPC", "Kubernetes"],
  },
  {
    title: "Full-Stack Developer",
    company: "Startup XYZ",
    companyUrl: "https://example.com",
    period: "jun \u2013 dec 2024",
    summary: "Owned product development end-to-end at an early-stage startup.",
    details: [
      "Built the entire web application from scratch using Next.js and Node.js",
      "Implemented CI/CD pipeline reducing deploy time by 70%",
      "Designed database schema and API architecture for multi-tenant SaaS platform",
      "Integrated third-party services including Stripe, SendGrid, and AWS S3",
    ],
    tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
  },
  {
    title: "Backend Intern",
    company: "DevShop",
    companyUrl: "https://example.com",
    period: "jan \u2013 apr 2024",
    summary: "Contributed to internal tools and API development.",
    details: [
      "Developed RESTful APIs for internal dashboard serving 500+ users",
      "Wrote comprehensive unit and integration tests achieving 85% coverage",
      "Refactored legacy codebase improving maintainability and reducing bugs",
    ],
    tags: ["Python", "FastAPI", "PostgreSQL", "Docker"],
  },
];

const projects = [
  {
    title: "DistKV",
    description: "A distributed key-value store with Raft consensus, built from scratch in Go.",
    status: "completed" as const,
    href: "https://github.com/raisilham/distkv",
    tags: ["Go", "Raft", "gRPC", "BadgerDB"],
  },
  {
    title: "CollabEdit",
    description: "Real-time collaborative text editor using CRDTs and operational transforms.",
    status: "completed" as const,
    href: "https://github.com/raisilham/collabedit",
    tags: ["TypeScript", "CRDT", "WebSocket", "React"],
  },
  {
    title: "Minicomp",
    description: "A compiler for a minimal functional language targeting LLVM IR.",
    status: "ongoing" as const,
    href: "https://github.com/raisilham/minicomp",
    tags: ["Rust", "LLVM", "Parsing"],
  },
];

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return <HomeContent posts={recentPosts} />;
}

function HomeContent({ posts }: { posts: PostMeta[] }) {
  return (
    <div>
      {/* Hero */}
      <section className="mb-16">
        <p className="font-sans text-xs text-[var(--color-muted-2)] uppercase tracking-widest mb-3">
          Rais Ilham
        </p>
        <h1 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-tight">
          Computer Science Graduate.<br />
          <span className="text-[var(--color-muted)]">Builder. Writer. Tinkerer.</span>
        </h1>
        <p className="text-base leading-relaxed text-[var(--color-muted)] max-w-prose">
          I build software, explore systems, and write about things I find interesting.
          Passionate about distributed systems, compilers, and clean architecture.
        </p>
        <div className="mt-5 flex gap-2">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border-hover)] transition-colors"
              aria-label={s.label}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d={s.icon} />
              </svg>
            </a>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-16">
        <h2 className="font-sans text-sm font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[var(--color-fg)] inline-block" />
          Experience
        </h2>
        <div className="space-y-1">
          {experiences.map((exp) => (
            <details
              key={exp.title}
              className="group border-b border-[var(--color-border)] py-4 open:pb-4"
            >
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none marker:hidden">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-sans text-sm font-medium">{exp.title}</span>
                    <span className="text-[var(--color-muted-2)] text-xs">&middot;</span>
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-link)] no-underline hover:underline"
                    >
                      {exp.company}
                    </a>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{exp.summary}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-[var(--color-muted-2)]">{exp.period}</span>
                  <span className="font-mono text-sm text-[var(--color-muted-2)] transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <div className="mt-4 pl-0">
                <ul className="space-y-2.5">
                  {exp.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-muted)]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-border-hover)]" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-[var(--color-border)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-16">
        <h2 className="font-sans text-sm font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[var(--color-fg)] inline-block" />
          Projects
        </h2>
        <div className="grid gap-4">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 transition-colors hover:border-[var(--color-border-hover)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[11px] text-[var(--color-muted-2)]">{(i + 1).toString().padStart(2, "0")}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                        p.status === "ongoing"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.status === "ongoing" ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                      />
                      {p.status}
                    </span>
                  </div>
                  <h3 className="font-sans text-base font-medium mb-1">{p.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{p.description}</p>
                </div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg border border-[var(--color-border)] px-2.5 py-1 font-mono text-[10px] text-[var(--color-muted)] no-underline hover:border-[var(--color-border-hover)] hover:text-[var(--color-fg)] transition-colors"
                >
                  Code ↗
                </a>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-muted-2)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-16">
        <h2 className="font-sans text-sm font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[var(--color-fg)] inline-block" />
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded border border-[var(--color-border)] px-2.5 py-1 font-mono text-xs text-[var(--color-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-fg)] transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="mb-16">
        <h2 className="font-sans text-sm font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[var(--color-fg)] inline-block" />
          <Link href="/blog" className="no-underline text-[var(--color-fg)] hover:underline">
            Recent Writings
          </Link>
        </h2>
        <div>
          {posts.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">No posts yet.</p>
          ) : (
            posts.map((post, i) => (
              <div
                key={post.slug}
                className={`py-3.5 ${i < posts.length - 1 ? "border-b border-[var(--color-border)]" : ""}`}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-start justify-between gap-4 no-underline"
                >
                  <span className="text-sm font-medium text-[var(--color-fg)] group-hover:opacity-70 transition-opacity">
                    {post.title}
                  </span>
                  <span className="font-mono text-xs text-[var(--color-muted-2)] shrink-0">
                    {post.date}
                  </span>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="font-sans text-sm font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[var(--color-fg)] inline-block" />
          Contact
        </h2>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          Interested in working together or just want to say hi? Reach out at{" "}
          <a href="mailto:rais@example.com" className="text-[var(--color-link)] hover:underline">
            rais@example.com
          </a>{" "}
          or find me on{" "}
          <a href="https://linkedin.com/in/raisilham" target="_blank" rel="noopener noreferrer" className="text-[var(--color-link)] hover:underline">
            LinkedIn
          </a>.
        </p>
      </section>
    </div>
  );
}
