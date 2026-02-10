import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on Polymarket trading, wallet analytics, and prediction markets.",
};

const posts = [
  {
    slug: "best-polymarket-whale-watchers-user-trackers",
    title: "Best Polymarket User Trackers and Whale Watchers in 2026",
    description:
      "Discover the best Polymarket user trackers and whale watchers in 2026. Learn how to follow top traders, spot whale activity, and use on-chain analytics to improve your prediction market strategy.",
    date: "February 10, 2026",
  },
  {
    slug: "best-polymarket-user-tracker",
    title: "Best Polymarket User Tracker for Analytics and Market Insights",
    description:
      "Compare the best user trackers for Polymarket analytics. Learn how to track users, monitor positions, and analyze trading performance across Polymarket markets.",
    date: "February 8, 2026",
  },
  {
    slug: "track-user-activity-positions-polymarket",
    title: "How to Track User Activity and Positions on Polymarket",
    description:
      "A practical guide to tracking user activity, open positions, and trading performance on Polymarket using on-chain tools and wallet analytics.",
    date: "February 8, 2026",
  },
  {
    slug: "understanding-polymarket-wallets",
    title: "Understanding Polymarket Wallets: A Beginner's Guide",
    description:
      "Learn how Polymarket wallets work, what on-chain data reveals about trading performance, and how to use Polywallets to analyze any trader.",
    date: "February 8, 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Insights on Polymarket trading, wallet analytics, and prediction
        markets.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group border border-border/50 rounded-lg p-5 hover:border-border transition-colors"
          >
            <p className="text-xs text-muted-foreground mb-1.5">{post.date}</p>
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors mb-1.5">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              {post.description}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Read more
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <footer className="border-t border-border/50 py-4 mt-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Polywallets</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://x.com/keonwkim"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/keon/polywallets"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
