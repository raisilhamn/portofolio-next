import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { TocEntry } from "@/lib/posts";
import { MarkdownContent } from "./markdown-content";
import { SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      url: `${SITE_URL}/blog/${post.meta.slug}`,
      type: "article",
      publishedTime: post.meta.date,
      tags: post.meta.tags,
    },
    twitter: {
      title: post.meta.title,
      description: post.meta.excerpt,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.meta.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <Link
        href="/blog"
        className="font-mono text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-fg)] transition-colors"
      >
        &larr; Back to posts
      </Link>

      <header className="mt-3 mb-8">
        <h1 className="font-sans text-2xl sm:text-3xl font-semibold leading-tight mb-3">
          {post.meta.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[var(--color-muted-2)]">
          <time>{post.meta.date}</time>
          <span className="w-1 h-1 rounded-full bg-[var(--color-border)] inline-block" />
          <span>{post.meta.readingTime}</span>
          {post.meta.tags && post.meta.tags.length > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-[var(--color-border)] inline-block" />
              <span>
                {post.meta.tags.map((t, i) => (
                  <span key={t}>{i > 0 && ", "}#{t}</span>
                ))}
              </span>
            </>
          )}
        </div>
      </header>

      {post.headings.length > 0 && (
        <Toc headings={post.headings} />
      )}

      <div className="prose">
        <MarkdownContent content={post.content} />
      </div>
    </article>
  );
}

function Toc({ headings }: { headings: TocEntry[] }) {
  return (
    <details className="mb-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] group open:pb-2">
      <summary className="flex items-center justify-between px-4 py-2.5 cursor-pointer list-none marker:hidden font-sans text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
        Table of Contents
        <span className="font-mono text-sm text-[var(--color-muted-2)] transition-transform duration-200 group-open:rotate-45">+</span>
      </summary>
      <ul className="space-y-1 m-0 p-0 list-none px-4 pb-2">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? "1rem" : "0" }}>
            <a
              href={`#${h.id}`}
              className="font-mono text-[11px] text-[var(--color-muted)] no-underline hover:text-[var(--color-fg)] transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
