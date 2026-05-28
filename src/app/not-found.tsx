import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="font-sans text-6xl font-semibold mb-4">404</h1>
      <p className="text-sm text-[var(--color-muted)] mb-8 max-w-sm">
        Page not found. The link might be broken or the page may have moved.
      </p>
      <Link
        href="/"
        className="font-mono text-xs text-[var(--color-link)] no-underline hover:underline"
      >
        &larr; Back to home
      </Link>
    </div>
  );
}
