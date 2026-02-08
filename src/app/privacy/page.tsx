import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: February 7, 2026
      </p>

      <div className="prose prose-sm prose-neutral max-w-none space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-3">Overview</h2>
          <p className="text-muted-foreground">
            Polywallets (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a
            client-side wallet explorer for Polymarket. We are committed to protecting your
            privacy.{" "}
            <strong className="text-foreground">
              We do not collect, store, or process any personal information on our servers.
            </strong>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">No Backend Data Storage</h2>
          <p className="text-muted-foreground">
            Polywallets does not have user accounts, databases, or any server-side storage of
            user information. All user preferences, recent searches, and session data are
            stored exclusively in your browser&apos;s <code className="text-xs bg-muted px-1 py-0.5 rounded">localStorage</code>.
            This data never leaves your device and is not transmitted to our servers or any
            third party.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Wallet Connections</h2>
          <p className="text-muted-foreground">
            When you connect a wallet through our app, the connection is handled entirely by
            your wallet provider (e.g., MetaMask, WalletConnect). We do not store your wallet
            address, private keys, or any wallet-related credentials on our servers. Wallet
            connection state is managed client-side by the wallet provider&apos;s SDK.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Blockchain Data</h2>
          <p className="text-muted-foreground">
            Polywallets displays publicly available blockchain data from the Polygon network and
            Polymarket. This includes wallet positions, trading history, and performance
            metrics. This information is already public on the blockchain and is fetched via
            third-party data APIs. We do not enrich, correlate, or link this data to any
            personal identity.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">On-Chain Transactions</h2>
          <p className="text-muted-foreground">
            When you redeem a position through Polywallets, the transaction is submitted
            directly from your wallet to the Polymarket smart contract on the Polygon
            blockchain. We do not act as an intermediary, custodian, or relay for any
            transactions. Your wallet signs and broadcasts the transaction directly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Analytics</h2>
          <p className="text-muted-foreground">
            We use Umami, a privacy-focused analytics tool, to understand general usage
            patterns (e.g., page views). Umami does not use cookies, does not collect personal
            data, and does not track users across websites. All analytics data is aggregated
            and anonymous.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Local Storage</h2>
          <p className="text-muted-foreground">
            The following data is stored locally in your browser and never sent to our servers:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Recent wallet search history</li>
            <li>Redeemed position records</li>
            <li>Wallet connection preferences (managed by wallet provider)</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            You can clear this data at any time by clearing your browser&apos;s local storage
            or site data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Third-Party Services</h2>
          <p className="text-muted-foreground">
            We use the following third-party services, each with their own privacy policies:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Predexon API — for fetching publicly available Polymarket analytics data</li>
            <li>WalletConnect / RainbowKit — for wallet connection</li>
            <li>Umami — for anonymous, cookie-free analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. Changes will be reflected on
            this page with an updated date. Continued use of Polywallets after changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Contact</h2>
          <p className="text-muted-foreground">
            If you have questions about this privacy policy, please open an issue on our
            GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
}
