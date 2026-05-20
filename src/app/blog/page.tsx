import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div>
      <p className="font-sans text-xs text-[var(--color-muted-2)] uppercase tracking-widest mb-2">
        &sect; Blog
      </p>
      <h1 className="font-sans text-2xl font-semibold mb-8">Posts</h1>

      {posts.length === 0 ? (
        <div className="border border-[var(--color-border)] rounded-lg p-8 text-center">
          <p className="text-sm text-[var(--color-muted)]">No posts yet. Check back soon.</p>
        </div>
      ) : (
        <div>
          {posts.map((post, i) => (
            <article
              key={post.slug}
              className={`py-5 ${i < posts.length - 1 ? "border-b border-[var(--color-border)]" : ""}`}
            >
              <Link href={`/blog/${post.slug}`} className="group no-underline block">
                <h2 className="font-sans text-base font-medium mb-1 text-[var(--color-fg)] group-hover:opacity-70 transition-opacity">
                  {post.title}
                </h2>
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[var(--color-muted-2)] mb-2">
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-border)] inline-block" />
                <span>{post.readingTime}</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-border)] inline-block" />
                    <span>
                      {post.tags.map((t, i) => (
                        <span key={t}>
                          {i > 0 && ", "}
                          #{t}
                        </span>
                      ))}
                    </span>
                  </>
                )}
              </div>
              {post.excerpt && (
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{post.excerpt}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
