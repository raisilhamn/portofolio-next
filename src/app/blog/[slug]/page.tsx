import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MarkdownContent } from "./markdown-content";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
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

      <div className="prose">
        <MarkdownContent content={post.content} />
      </div>
    </article>
  );
}
