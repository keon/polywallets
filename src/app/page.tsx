"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, X, Clock } from "lucide-react";
import { Leaderboard } from "@/components/leaderboard";
import { SiteHeader } from "@/components/site-header";
import { formatAddress } from "@/lib/format";
import { getRecentWallets, saveRecentWallet, removeRecentWallet, timeAgo, type RecentWallet } from "@/lib/recent-wallets";
import { track } from "@/lib/track";

export default function Home() {
  const [address, setAddress] = useState("");
  const [recentWallets, setRecentWallets] = useState<RecentWallet[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setRecentWallets(getRecentWallets());

    // Refresh recent wallets when tab regains focus (e.g. navigating back)
    const onFocus = () => setRecentWallets(getRecentWallets());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useCallback(() => {
    const trimmed = address.trim();
    if (trimmed && /^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      track("wallet-search", { address: trimmed });
      saveRecentWallet(trimmed);
      setRecentWallets(getRecentWallets());
      setShowDropdown(false);
      router.push(`/w/${trimmed}`);
    }
  }, [address, router]);

  const selectRecent = (addr: string) => {
    setAddress(addr);
    setShowDropdown(false);
    track("wallet-search", { address: addr, source: "recent" });
    saveRecentWallet(addr);
    setRecentWallets(getRecentWallets());
    router.push(`/w/${addr}`);
  };

  const removeRecent = (e: React.MouseEvent, addr: string) => {
    e.stopPropagation();
    removeRecentWallet(addr);
    setRecentWallets(getRecentWallets());
  };

  const filtered = address.trim()
    ? recentWallets.filter((w) =>
        w.address.toLowerCase().includes(address.trim().toLowerCase())
      )
    : recentWallets;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex flex-col items-center px-4">
        <div className="w-full max-w-4xl space-y-6 sm:space-y-8 pt-10 sm:pt-16 pb-8 sm:pb-12 text-center">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Polywallets
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg">
              Explore any Polymarket wallet. Positions, P&L, performance, and more.
            </p>
          </div>

          <div className="flex gap-2 w-full max-w-2xl mx-auto">
            <div className="relative flex-1" ref={containerRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Enter wallet address (0x...)"
                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onFocus={() => {
                  const latest = getRecentWallets();
                  if (latest.length > 0) {
                    setRecentWallets(latest);
                    setShowDropdown(true);
                  }
                }}
                onClick={() => {
                  const latest = getRecentWallets();
                  if (latest.length > 0) {
                    setRecentWallets(latest);
                    setShowDropdown(true);
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {showDropdown && filtered.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md z-50 overflow-hidden">
                  <div className="px-3 py-2 text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Recently viewed
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filtered.map((wallet) => (
                      <button
                        key={wallet.address}
                        className="w-full text-left px-3 py-2.5 hover:bg-accent/50 flex items-center justify-between gap-2 transition-colors"
                        onClick={() => selectRecent(wallet.address)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs sm:text-sm truncate" title={wallet.address}>
                            {formatAddress(wallet.address)}
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                            {timeAgo(wallet.lastVisited)}
                          </span>
                        </div>
                        <span
                          role="button"
                          className="shrink-0 p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground"
                          onClick={(e) => removeRecent(e, wallet.address)}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              size="lg"
              className="h-11 sm:h-12 px-4 sm:px-6"
              onClick={handleSearch}
              disabled={!address.trim() || !/^0x[a-fA-F0-9]{40}$/.test(address.trim())}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full max-w-4xl pb-16">
          <Leaderboard />
        </div>
      </div>

      <footer className="border-t border-border/50 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Polywallets</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
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
