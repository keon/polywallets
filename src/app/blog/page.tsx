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
    </div>
  );
}
