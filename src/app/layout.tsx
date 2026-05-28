import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { FontSizeControl } from "@/components/font-size-control";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Portfolio`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='5' fill='%23fff'/%3E%3Cg transform='translate(2,2) scale(0.83)'%3E%3Cpath d='M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M22 10v6' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M6 12.5V16a6 3 0 0 0 12 0v-3.5' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3C/svg%3E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;1,14..32,400;1,14..32,600&family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400;1,600&display=swap"
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
        <FontSizeControl />
        <Analytics />
      </body>
    </html>
  );
}
