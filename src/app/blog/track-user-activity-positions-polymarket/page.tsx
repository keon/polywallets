import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title:
    "How to Track User Activity and Positions on Polymarket",
  description:
    "A practical guide to tracking user activity, open positions, and trading performance on Polymarket using on-chain tools and wallet analytics.",
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
        How to Track User Activity and Positions on Polymarket
      </h1>
      <p className="text-sm text-muted-foreground mb-10">February 8, 2026</p>

      <div className="prose prose-sm prose-neutral max-w-none space-y-8 text-sm leading-relaxed">
        <section>
          <p className="text-muted-foreground">
            Polymarket is a decentralized prediction market where users trade on
            the outcomes of real-world events using crypto. Every trade on
            Polymarket is executed on the Polygon blockchain, which means all
            user activity&mdash;positions, trades, payouts&mdash;is publicly
            recorded and verifiable. This guide walks through the tools and
            methods you can use to track user activity and positions on
            Polymarket, whether you&apos;re monitoring your own wallet or
            researching other traders.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Why User Activity Is Transparent on Polymarket
          </h2>
          <p className="text-muted-foreground">
            Unlike centralized prediction platforms where user data is locked
            behind accounts, Polymarket operates on a public blockchain. When a
            user buys or sells shares in a prediction market, that transaction
            is written to the Polygon network and can be read by anyone. This
            on-chain transparency is fundamental to how decentralized prediction
            markets work&mdash;it ensures fairness, enables independent
            verification, and powers the analytics tools that track user
            positions.
          </p>
          <p className="text-muted-foreground mt-3">
            Because of this architecture, you don&apos;t need any special
            permissions or API keys to track a user&apos;s Polymarket activity.
            All you need is their Polygon wallet address and the right tool to
            interpret the data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            What You Can Track on a Polymarket User
          </h2>
          <p className="text-muted-foreground">
            With the right tools, you can see a detailed picture of any
            Polymarket user&apos;s activity:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
            <li>
              <strong className="text-foreground">Open positions</strong>{" "}
              &mdash; The markets a user is currently active in, which outcome
              they&apos;re betting on, their position size, and how the position
              is performing relative to their entry price.
            </li>
            <li>
              <strong className="text-foreground">Resolved positions</strong>{" "}
              &mdash; Past markets where the outcome has been settled, showing
              whether the user won or lost and how much they made or lost on
              each.
            </li>
            <li>
              <strong className="text-foreground">
                Profit and loss (P&L)
              </strong>{" "}
              &mdash; A running total of a user&apos;s gains and losses across
              all markets, giving you a single number that summarizes their
              overall trading performance.
            </li>
            <li>
              <strong className="text-foreground">Trading volume</strong> &mdash;
              The total dollar value of all trades a user has executed, which
              indicates how active they are on the platform.
            </li>
            <li>
              <strong className="text-foreground">Win rate</strong> &mdash; The
              percentage of settled markets where the user was profitable,
              helping you gauge the consistency of their predictions.
            </li>
            <li>
              <strong className="text-foreground">Market selection</strong>{" "}
              &mdash; Which categories and specific markets a user tends to
              trade in, revealing their areas of expertise or interest.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Tools to Track Polymarket User Activity
          </h2>
          <p className="text-muted-foreground">
            Several tools exist for tracking user activity on Polymarket, each
            with different levels of detail and usability.
          </p>

          <h3 className="text-base font-semibold mt-5 mb-2">Polywallets</h3>
          <p className="text-muted-foreground">
            Polywallets is a dedicated wallet explorer built specifically for
            Polymarket. It combines on-chain data with market context to present
            a complete view of any user&apos;s trading activity. Paste a Polygon
            wallet address into the search bar and you&apos;ll see the
            user&apos;s P&L, win rate, open and resolved positions, trading
            volume, and a breakdown of performance by market.
          </p>
          <p className="text-muted-foreground mt-3">
            Polywallets also features a leaderboard that ranks the
            top-performing traders on Polymarket by total P&L. This is
            especially useful when you want to discover active traders without
            already knowing their wallet addresses. Click any address on the
            leaderboard to see their full position history and activity.
          </p>

          <h3 className="text-base font-semibold mt-5 mb-2">
            PolygonScan and Block Explorers
          </h3>
          <p className="text-muted-foreground">
            General-purpose block explorers like PolygonScan let you look up any
            wallet address on the Polygon network and see its raw transaction
            history. You can verify individual trades, check token balances, and
            trace the flow of funds between wallets. However, block explorers
            display data as raw contract interactions&mdash;they won&apos;t show
            you market names, P&L calculations, or organized position summaries.
            They&apos;re best suited for verifying specific transactions rather
            than tracking ongoing user activity.
          </p>

          <h3 className="text-base font-semibold mt-5 mb-2">
            Polymarket&apos;s Platform
          </h3>
          <p className="text-muted-foreground">
            Polymarket itself provides basic profile pages for users, but these
            are limited in scope. You can see some high-level activity, but the
            platform doesn&apos;t offer the detailed analytics&mdash;like
            position-level P&L, win rates, or leaderboard rankings&mdash;that
            dedicated tracking tools provide.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Step-by-Step: Tracking a User with Polywallets
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s how to track any Polymarket user&apos;s activity and
            positions using Polywallets:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
            <li>
              <strong className="text-foreground">Find the wallet address</strong>{" "}
              &mdash; Every Polymarket user has a Polygon wallet address. You
              can find it on Polymarket&apos;s user profile pages, shared on
              social media, or by browsing the Polywallets leaderboard.
            </li>
            <li>
              <strong className="text-foreground">Search on Polywallets</strong>{" "}
              &mdash; Go to the Polywallets home page and paste the wallet
              address into the search bar. The results load instantly with no
              account or login required.
            </li>
            <li>
              <strong className="text-foreground">Review summary metrics</strong>{" "}
              &mdash; At the top of the wallet page, you&apos;ll see the
              user&apos;s total P&L, win rate, number of markets traded, and
              total volume. These numbers give you a quick read on the
              trader&apos;s overall performance.
            </li>
            <li>
              <strong className="text-foreground">Explore positions</strong>{" "}
              &mdash; Scroll down to see the user&apos;s open and resolved
              positions. Each entry shows the market, the outcome they bet on,
              position size, entry price, and current or final value. This is
              where you can study their market selection and timing.
            </li>
            <li>
              <strong className="text-foreground">
                Compare with the leaderboard
              </strong>{" "}
              &mdash; Use the leaderboard to see how the user stacks up against
              other top traders. You can filter by time period to see who&apos;s
              performing best recently versus all time.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Practical Uses for Position Tracking
          </h2>
          <p className="text-muted-foreground">
            Tracking user positions on Polymarket isn&apos;t just about
            curiosity&mdash;it can directly improve your own trading and
            research. By following traders with strong track records, you can
            identify markets that deserve a closer look. If multiple skilled
            traders are taking the same side of a market, it suggests they may
            have done deeper research or built models that give them an edge.
          </p>
          <p className="text-muted-foreground mt-3">
            Position tracking is also valuable for understanding market
            dynamics. When a large wallet opens or closes a significant
            position, it can move market prices. Being aware of these shifts
            helps you anticipate price movements and avoid trading against
            well-informed participants.
          </p>
          <p className="text-muted-foreground mt-3">
            For researchers and journalists, Polymarket position data provides a
            transparent, verifiable record of how prediction market participants
            are pricing real-world events. Unlike polls or pundit forecasts,
            these are positions backed by real money, which tends to produce more
            calibrated probability estimates.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Getting Started with Polymarket Tracking
          </h2>
          <p className="text-muted-foreground">
            The easiest way to start tracking user activity and positions on
            Polymarket is to visit Polywallets and browse the leaderboard. Find
            a few traders whose activity interests you, explore their wallets,
            and study their positions. All the data is free, requires no account,
            and updates as new on-chain activity is recorded. Over time,
            following skilled traders becomes one of the most practical ways to
            stay informed about how the market is pricing events across politics,
            crypto, sports, and current affairs.
          </p>
        </section>

        <section className="border border-border/50 rounded-lg p-6 text-center">
          <p className="text-foreground font-semibold mb-2">
            Start tracking Polymarket activity now
          </p>
          <p className="text-muted-foreground mb-4">
            Search any wallet address, browse the leaderboard, and explore
            positions&mdash;no account needed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Try Polywallets
          </Link>
        </section>
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
