"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { track } from "@/lib/track";
import { useWalletEnabled } from "@/lib/use-wallet-enabled";
import { ThemeToggle } from "@/components/theme-toggle";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const isLocal = useWalletEnabled();
  const { address: connectedAddress, isConnected } = useAccount();

  const goToConnectedWallet = () => {
    if (connectedAddress) {
      track("view-own-wallet");
      router.push(`/w/${connectedAddress}`);
    }
  };

  return (
    <header className="border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Polywallets" width={24} height={24} className="h-6 w-6 dark:invert" />
          <span className="text-base font-bold">Polywallets</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a
            href="https://x.com/keonwkim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/keon/polywallets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          {isLocal && isConnected && connectedAddress && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToConnectedWallet}
              className="gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">My Wallet</span>
            </Button>
          )}
          {isLocal && <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />}
        </div>
      </div>
    </header>
  );
}
