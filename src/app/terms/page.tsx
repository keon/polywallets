import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: February 7, 2026
      </p>

      <div className="prose prose-sm prose-neutral max-w-none space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using Polywallets (&ldquo;the Service&rdquo;), you agree to be
            bound by these Terms of Service. If you do not agree to these terms, please do not
            use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">2. Description of Service</h2>
          <p className="text-muted-foreground">
            Polywallets is a free, open-source, client-side web application that allows users
            to explore publicly available Polymarket wallet data, including positions, profit
            and loss, trading performance, and leaderboard rankings. The Service also allows
            connected wallet owners to redeem resolved positions directly through the
            Polymarket smart contract.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. No Backend Storage</h2>
          <p className="text-muted-foreground">
            <strong className="text-foreground">
              Polywallets does not store any user data on its servers.
            </strong>{" "}
            All user preferences, search history, and session data are stored exclusively in
            your browser&apos;s local storage. We do not maintain user accounts, profiles, or
            any form of server-side user data. You are solely responsible for managing your
            local browser data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">4. Wallet Interactions</h2>
          <p className="text-muted-foreground">
            When you connect your wallet and initiate transactions (such as redeeming
            positions), you interact directly with blockchain smart contracts. Polywallets
            does not custody, control, or have access to your funds, private keys, or seed
            phrases at any time. You are solely responsible for all transactions you authorize
            through your wallet.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">5. No Financial Advice</h2>
          <p className="text-muted-foreground">
            The information displayed on Polywallets is derived from publicly available
            blockchain data and is provided for informational purposes only. Nothing on
            Polywallets constitutes financial advice, investment advice, trading advice, or
            any other kind of professional advice. You should not make any financial decisions
            based solely on the data presented on this platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">6. Data Accuracy</h2>
          <p className="text-muted-foreground">
            While we strive to display accurate data, Polywallets relies on third-party APIs
            and public blockchain data. We do not guarantee the accuracy, completeness, or
            timeliness of any information displayed. Data may be delayed, incomplete, or
            contain errors. Use the information at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">7. Assumption of Risk</h2>
          <p className="text-muted-foreground">
            Interacting with blockchain protocols and prediction markets involves inherent
            risks, including but not limited to smart contract bugs, network congestion,
            transaction failures, and loss of funds. By using Polywallets, you acknowledge
            and accept these risks. We are not responsible for any losses incurred through
            the use of this Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">8. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the maximum extent permitted by law, Polywallets and its contributors shall
            not be liable for any direct, indirect, incidental, special, consequential, or
            punitive damages arising from your use of, or inability to use, the Service.
            This includes damages arising from errors in displayed data, failed transactions,
            or any interaction with third-party smart contracts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">9. No Warranties</h2>
          <p className="text-muted-foreground">
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
            without warranties of any kind, whether express or implied, including but not
            limited to implied warranties of merchantability, fitness for a particular
            purpose, and non-infringement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">10. Modifications</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these Terms of Service at any time. Changes will
            be effective when posted on this page. Your continued use of the Service after
            changes are posted constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">11. Governing Law</h2>
          <p className="text-muted-foreground">
            These terms shall be governed by and construed in accordance with applicable laws,
            without regard to conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">12. Contact</h2>
          <p className="text-muted-foreground">
            If you have questions about these Terms of Service, please open an issue on our
            GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
}
