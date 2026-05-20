import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { CopyButton } from "@/components/copy-button";

const components: Components = {
  h2: ({ children, ...props }) => (
    <h2 className="group" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="group" {...props}>
      {children}
    </h3>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    const codeEl = children as any;
    const code = codeEl?.props?.children?.toString() ?? "";

    return (
      <div className="relative group">
        <CopyButton code={code} />
        <pre {...props}>{children}</pre>
      </div>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 rounded text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)]" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={`${className} leading-relaxed`} {...props}>
        {children}
      </code>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-2 border-[var(--color-border)] pl-4 italic text-[var(--color-muted)] my-6" {...props}>
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-[var(--color-border)]" />,
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [rehypeAutolinkHeadings, {
          behavior: "append",
          properties: {
            className: "heading-anchor",
            ariaHidden: "true",
            tabIndex: -1,
          },
          content: {
            type: "element",
            tagName: "span",
            properties: { className: "anchor-icon" },
            children: [{ type: "text", value: "#" }],
          },
        }],
        rehypeHighlight,
      ]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
