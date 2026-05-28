import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { PostMeta } from "@/lib/posts";

const socialLinks = [
  { label: "Email", href: "mailto:kerja@raisilham.com", icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" },
  { label: "GitHub", href: "https://github.com/raisilhamn", icon: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" },
  { label: "LinkedIn", href: "https://linkedin.com/in/raisilhamn", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  // { label: "Resume", href: "mailto:kerja@raisilham.com", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
];

const skills = [
  "PHP", "Laravel", "Livewire", "Next.js", "React",
  "JavaScript", "TypeScript", "Python", "Flask", "TensorFlow",
  "PostgreSQL", "MySQL", "Jenkins", "Docker", "Git",
  "Vue", "Flutter", "TailwindCSS", "Metabase", "REST API",
];

const experiences = [
  {
    title: "Software Engineer",
    company: "SEVIMA",
    companyUrl: "https://sevima.com",
    period: "nov 2024 \u2013 may 2026",
    summary: "Full-stack development across the SEVIMA edtech ecosystem serving 500+ institutional clients.",
    details: [
      "Maintained and enhanced the Alumni Tracer Study Module (Next.js, Lumen, PHP) — delivered UI/UX improvements, API performance optimizations, and SSO integration across the SEVIMA ecosystem",
      "Built and maintained SIMKERMA (Collaboration Management System) using Laravel, implementing public partner evaluation, advanced Excel import/export with duplicate validation, selective insertion, and automated error-file generation",
      "Developed a career services platform integrated with the SIAKAD Cloud ecosystem, streamlining job applications, profile management, and career recommendations",
      "Enhanced an internal Applicant Tracking System (ATS) for HR using Laravel and Livewire, managing 10,000+ applicant records with a modernized UI",
      "Maintained training.sevima.com — oversaw payment gateway integrations, automated email systems, and digital certificate distribution",
      "Resolved 700+ technical tickets within Agile framework, delivering 86 feature enhancements and 256 bug fixes",
    ],
    tags: ["Laravel", "PHP", "Next.js", "Livewire", "PostgreSQL", "Jenkins"],
  },
  {
    title: "Machine Learning Mentor",
    company: "Bangkit Academy",
    companyUrl: "https://bangkit.academy",
    period: "feb \u2013 jul 2024",
    summary: "Guided 25 students to 100% graduation at Google, GoTo, Traveloka's flagship tech program.",
    details: [
      "Delivered 19 technical consultation sessions and supported 14 instructor-led training sessions with an average rating of 4.85/5.00",
      "Partnered with instructors to moderate live sessions, facilitating technical Q&A for 100+ participants",
      "Monitored individual student progress with personalized coaching to ensure all project milestones were met",
    ],
    tags: ["Machine Learning", "TensorFlow", "Mentoring", "Python"],
  },
  {
    title: "IT Developer Intern",
    company: "PT. United Tractors Tbk",
    companyUrl: "https://unitedtractors.com",
    period: "aug \u2013 dec 2023",
    summary: "Selected from 11,582 applicants (0.8% acceptance rate) for the prestigious MSIB Batch 5 program.",
    details: [
      "Engineered a web-based Asset Tracking System for the CHCU Division using Laravel and Livewire, reducing manual tracking errors",
      "Developed an automated Notification Module for overdue assets and a Bulk Return feature streamlining high-volume inventory returns",
      "Architected an Audit Stock Opname module and enhanced dashboard analytics for precise inventory reporting",
    ],
    tags: ["Laravel", "Livewire", "MySQL", "PHP"],
  },
];

const projects = [
  {
    title: "Shortlink",
    description: "URL shortener with click analytics — public links expire in 7 days, signed-in users get permanent links with full analytics (clicks by country, referrer, daily chart), admin panel for moderation. Built with Next.js 16, Drizzle ORM, Turso, and NextAuth. Live at s.raisilham.com.",
    href: "https://github.com/raisilhamn/shortlink-next",
    tags: ["Next.js", "Drizzle", "Turso", "NextAuth"],
  },
  {
    title: "DISC Personality Test",
    description: "Full-stack Next.js app for 24-question DISC personality assessment in Indonesian. Users select most/least like statements, get Dominance-Influence-Steadiness-Compliance scores with career recommendations. Includes UUID-based result lookup.",
    href: "https://disc.raisilham.com",
    tags: ["Next.js", "Prisma", "Turso", "TypeScript"],
  },
  {
    title: "InstaApp",
    description: "Full-stack Instagram clone with Laravel + Inertia.js — user auth, posts, likes, comments, follows, explore feed, real-time notifications. Built with Laravel 11, Vue 3, Inertia.js, and Tailwind CSS.",
    href: "https://github.com/raisilhamn/sevima-instaapp",
    tags: ["PHP", "Laravel", "MySQL", "Vue.js", "Tailwind CSS", "Inertia.js"],
  },
  {
    title: "AutoEDA",
    description: "Automatic Exploratory Data Analysis web app — upload CSV, get comprehensive reports with dynamic visualizations, descriptive statistics, and quantitative analysis for continuous, categorical, and textual data.",
    href: "https://bit.ly/eda-rais",
    tags: ["Python", "Flask", "Dash", "Pandas"],
  },
  {
    title: "Agronify",
    description: "Deep learning model for crop disease classification — 8 distinct models using MobileNet achieving 98% accuracy with loss below 4%, enhancing agricultural diagnostics.",
    href: "https://bit.ly/agronify",
    tags: ["Python", "TensorFlow", "MobileNet", "CNN"],
  },
  {
    title: "AksaraKu",
    description: "Javanese script learning app — 2nd place winner at the 2018 National Kihajar Application Competition, Ministry of Education and Culture.",
    href: "https://bit.ly/ME18LOMP02",
    tags: ["Java", "Android", "UI/UX"],
  },
];

const education = [
  {
    degree: "S.Kom., Information Systems",
    school: "Universitas Airlangga",
    period: "2020 \u2013 2024",
    detail: "GPA 3.74/4.00 \u2014 Cum Laude",
  },
  {
    degree: "Machine Learning Path",
    school: "Bangkit Academy (Google, GoTo, Traveloka)",
    period: "2023",
    detail: "TensorFlow Developer Certificate",
  },
];

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return <HomeContent posts={recentPosts} />;
}

function HomeContent({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="font-landing">
      {/* Hero */}
      <section className="mb-16">
        <p className="font-sans text-xs text-[var(--color-muted-2)] uppercase tracking-widest mb-3">
          Rais Ilham Nustara
        </p>
        <h1 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-tight">
          Software Engineer.<br />
          <span className="text-[var(--color-muted)]">Full-Stack. Machine Learning. Mentor.</span>
        </h1>
        <p className="text-base leading-relaxed text-[var(--color-muted)] max-w-prose">
          Software engineer. Built full-stack systems for 500+ institutions at SEVIMA.
          Machine Learning mentor at Bangkit Academy. Cum Laude graduate in Information Systems.
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
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
                    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase" style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-muted)' }} />
                      Completed
                    </span>
                  </div>
                  <h3 className="font-sans text-base font-medium mb-1">{p.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{p.description}</p>
                </div>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-[var(--color-border)] px-2.5 py-1 font-mono text-[10px] text-[var(--color-fg)] no-underline hover:border-[var(--color-border-hover)] transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 blink-live inline-block" />
                      Live
                    </span>
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

      {/* Education */}
      <section className="mb-16">
        <h2 className="font-sans text-sm font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[var(--color-fg)] inline-block" />
          Education
        </h2>
        <div className="space-y-4">
          {education.map((e) => (
            <div key={e.degree} className="border-b border-[var(--color-border)] pb-4">
              <div className="flex items-start justify-between gap-4">
    <div className="font-landing">
                  <h3 className="font-sans text-sm font-medium">{e.degree}</h3>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{e.school}</p>
                </div>
                <span className="font-mono text-xs text-[var(--color-muted-2)] shrink-0">{e.period}</span>
              </div>
              <p className="text-xs text-[var(--color-muted-2)] mt-1 font-mono">{e.detail}</p>
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

      {/* Certifications */}
      <section className="mb-16">
        <h2 className="font-sans text-sm font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[var(--color-fg)] inline-block" />
          Certifications
        </h2>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-3">
            <div>
              <p className="text-sm font-medium font-sans">Junior Web Programmer</p>
              <p className="text-xs text-[var(--color-muted)]">BNSP &mdash; National Professional Certification Agency</p>
            </div>
            <span className="font-mono text-xs text-[var(--color-muted-2)] shrink-0">2024 &ndash; 2027</span>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-3">
            <div>
              <p className="text-sm font-medium font-sans">Certified TensorFlow Developer</p>
              <p className="text-xs text-[var(--color-muted)]">TensorFlow &mdash; Computer Vision, NLP, CNN</p>
            </div>
            <span className="font-mono text-xs text-[var(--color-muted-2)] shrink-0">2023 &ndash; 2026</span>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-3">
            <div>
              <p className="text-sm font-medium font-sans">TOEFL ITP</p>
              <p className="text-xs text-[var(--color-muted)]">Score 577 &mdash; Reading 65 (C1), Listening 62 (C1)</p>
            </div>
            <span className="font-mono text-xs text-[var(--color-muted-2)] shrink-0">2026</span>
          </div>
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
          Open to roles in software engineering, full-stack development, and platform engineering.
          Want my CV? Email me at{" "}
          <a href="mailto:kerja@raisilham.com" className="text-[var(--color-link)] hover:underline">
            kerja@raisilham.com
          </a>{" "}
          or find me on{" "}
          <a href="https://linkedin.com/in/raisilhamn" target="_blank" rel="noopener noreferrer" className="text-[var(--color-link)] hover:underline">
            LinkedIn
          </a>.
        </p>
      </section>
    </div>
  );
}
