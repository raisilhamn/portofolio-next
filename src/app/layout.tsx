import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rais Ilham | Portfolio",
  description: "Computer Science graduate. I build software, explore systems, and write about things I find interesting.",
};

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (!theme) { theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.style.colorScheme = theme;
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <header className="sticky top-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-sm border-b border-[var(--color-border)]">
          <nav className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
            <Link
              href="/"
              className="font-sans text-sm font-medium text-[var(--color-fg)] no-underline hover:opacity-70 transition-opacity"
            >
              Rais Ilham
            </Link>
            <div className="flex items-center gap-6">
              <ul className="flex gap-6 font-sans text-sm list-none m-0 p-0">
                {nav.map(({ href, label }) => (
                  <li key={href} className="m-0">
                    <Link
                      href={href}
                      className="text-[var(--color-muted)] no-underline hover:text-[var(--color-fg)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
          {children}
        </main>
        <footer className="border-t border-[var(--color-border)] py-6 text-center text-xs font-sans text-[var(--color-muted-2)]">
          <div className="max-w-3xl mx-auto px-4">
            &copy; {new Date().getFullYear()} Rais Ilham. Built with Next.js.
          </div>
        </footer>
      </body>
    </html>
  );
}
