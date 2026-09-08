import type { Metadata } from "next";
import { Geist, Geist_Mono, Racing_Sans_One } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face for door-panel car numbers — reads like a stock-car number.
const racing = Racing_Sans_One({
  variable: "--font-racing",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Model Duel — 2026 NASCAR Chase",
  description:
    "A season-long head-to-head: a basic stats Random Forest vs. an advanced engineered-metric Random Forest, scored race by race across the 2026 NASCAR Chase.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${racing.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="checkers h-6 w-6 rounded-sm" aria-hidden />
              <span className="text-sm font-semibold tracking-tight">
                THE MODEL DUEL
                <span className="ml-2 hidden font-normal text-muted-foreground sm:inline">
                  2026 NASCAR Chase
                </span>
              </span>
            </Link>
            <nav className="ml-auto flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                The Duel
              </Link>
              <Link
                href="/races/1"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Races
              </Link>
              <Link
                href="/glossary"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Glossary
              </Link>
              <Link
                href="/methodology"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Methodology
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>

        <footer className="border-t border-border/80">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
            Built with Next.js, shadcn/ui, and Supabase. Predictions are
            Random-Forest projections, not betting advice. Data entered manually
            after each Chase race.
          </div>
        </footer>
      </body>
    </html>
  );
}
