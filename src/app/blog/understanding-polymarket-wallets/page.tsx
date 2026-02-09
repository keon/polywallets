import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Understanding Polymarket Wallets: A Beginner's Guide",
  description:
    "Learn how Polymarket wallets work, what on-chain data reveals about trading performance, and how to use Polywallets to analyze any trader.",
};

export default function BlogPost() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Blog
      </Link>

      <h1 className="text-3xl font-bold mb-2">
        Understanding Polymarket Wallets: A Beginner&apos;s Guide
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        February 8, 2026
      </p>

      <div className="prose prose-sm prose-neutral max-w-none space-y-8 text-sm leading-relaxed">
        <section>
          <p className="text-muted-foreground">
            Polymarket has become one of the most popular prediction markets in
            crypto, letting users trade on the outcomes of real-world events.
            Behind every trade is a wallet&mdash;a blockchain address on the
            Polygon network that holds positions, records profits and losses, and
            tells the story of a trader&apos;s journey. In this guide, we&apos;ll
            break down what Polymarket wallets are, what you can learn from them,
            and how Polywallets makes it easy to explore any wallet&apos;s
            performance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            What Is a Polymarket Wallet?
          </h2>
          <p className="text-muted-foreground">
            A Polymarket wallet is simply an Ethereum-compatible address on the
            Polygon network. When you create a Polymarket account or connect an
            existing wallet, your trades are executed on-chain through smart
            contracts. Every position you open, every share you buy or sell, and
            every payout you receive is recorded on the blockchain and publicly
            visible.
          </p>
          <p className="text-muted-foreground mt-3">
            This transparency is what makes tools like Polywallets possible. By
            reading on-chain data, anyone can see a wallet&apos;s full trading
            history without needing any special access or API keys.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Key Metrics You Can Track
          </h2>
          <p className="text-muted-foreground">
            When you look up a wallet on Polywallets, you&apos;ll see several
            important metrics that paint a picture of trading performance:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
            <li>
              <strong className="text-foreground">Total P&L</strong> &mdash; The
              overall profit or loss across all markets, including both realized
              gains from settled markets and unrealized gains from open
              positions.
            </li>
            <li>
              <strong className="text-foreground">Win Rate</strong> &mdash; The
              percentage of resolved markets where the trader ended up
              profitable. A high win rate suggests consistent, well-researched
              bets.
            </li>
            <li>
              <strong className="text-foreground">Markets Traded</strong>{" "}
              &mdash; The total number of distinct prediction markets a wallet
              has participated in. Some traders focus on a few markets while
              others diversify broadly.
            </li>
            <li>
              <strong className="text-foreground">Volume</strong> &mdash; The
              total dollar value of trades executed. High volume traders move
              markets and often have access to better information or models.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Reading a Wallet&apos;s Positions
          </h2>
          <p className="text-muted-foreground">
            Positions are the core of any Polymarket wallet. Each position
            represents a bet on a specific outcome in a prediction market. When
            viewing positions on Polywallets, you&apos;ll see the market name,
            the outcome the trader is betting on, the size of their position, the
            average entry price, and the current value.
          </p>
          <p className="text-muted-foreground mt-3">
            Comparing the entry price to the current market price reveals whether
            a trader got in early at favorable odds or entered late at a premium.
            This kind of analysis can help you understand the strategies that
            successful traders use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            How to Use Polywallets
          </h2>
          <p className="text-muted-foreground">
            Getting started with Polywallets is straightforward. Simply paste any
            Polygon wallet address into the search bar on the home page and
            hit enter. You&apos;ll immediately see the wallet&apos;s P&L
            summary, open positions, market performance breakdown, and
            historical charts.
          </p>
          <p className="text-muted-foreground mt-3">
            You can also explore top traders through the leaderboard, which ranks
            wallets by total P&L across different time windows. Found an
            interesting trader? Click their address to dive into their full
            portfolio and see exactly how they&apos;re allocating their
            capital.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Why On-Chain Transparency Matters
          </h2>
          <p className="text-muted-foreground">
            One of the most powerful aspects of prediction markets on the
            blockchain is transparency. Unlike traditional betting platforms
            where results are hidden behind closed doors, every Polymarket trade
            is verifiable on-chain. This means you can verify claims, study
            winning strategies, and learn from the best traders in the
            ecosystem&mdash;all without needing anyone&apos;s permission.
          </p>
          <p className="text-muted-foreground mt-3">
            Polywallets is built on this principle of open access. All data
            displayed comes directly from the blockchain and third-party
            analytics APIs. We don&apos;t store personal information or require
            accounts&mdash;just paste an address and start exploring.
          </p>
        </section>
      </div>
    </div>
  );
}
