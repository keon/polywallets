"use client";

import { useEffect, useState, use } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { SiteHeader } from "@/components/site-header";
import { WalletHeader } from "@/components/wallet-header";
import { MetricsCards, type TimeWindow } from "@/components/metrics-cards";
import { PositionsTable } from "@/components/positions-table";
import { MarketPerformance } from "@/components/market-performance";
import { SimilarWallets } from "@/components/similar-wallets";
import { PnlChart } from "@/components/pnl-chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getWalletProfile,
  getWalletPositions,
  getWalletMarkets,
  getSimilarWallets,
  getWalletPnL,
  type WalletProfile,
  type PositionsResponse,
  type WalletMarketsResponse,
  type SimilarWalletsResponse,
  type WalletPnLResponse,
  type Position,
} from "@/lib/predexon";
import { formatUSD, pnlColor, pnlSign } from "@/lib/format";

// Polymarket Conditional Tokens Framework (CTF) on Polygon
const CTF_ADDRESS = "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045" as const;
const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" as const;
const PARENT_COLLECTION_ID = "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

const CTF_ABI = [
  {
    name: "redeemPositions",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "collateralToken", type: "address" },
      { name: "parentCollectionId", type: "bytes32" },
      { name: "conditionId", type: "bytes32" },
      { name: "indexSets", type: "uint256[]" },
    ],
    outputs: [],
  },
] as const;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { track } from "@/lib/track";
import { saveRecentWallet } from "@/lib/recent-wallets";
import { useWalletEnabled } from "@/lib/use-wallet-enabled";

export default function WalletPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const isLocal = useWalletEnabled();
  const { address: connectedAddress } = useAccount();
  const isOwner = isLocal && !!connectedAddress && connectedAddress.toLowerCase() === address.toLowerCase();

  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [positions, setPositions] = useState<PositionsResponse | null>(null);
  const [markets, setMarkets] = useState<WalletMarketsResponse | null>(null);
  const [similar, setSimilar] = useState<SimilarWalletsResponse | null>(null);
  const [pnl, setPnl] = useState<WalletPnLResponse | null>(null);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("all_time");

  const [profileLoading, setProfileLoading] = useState(true);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [marketsLoading, setMarketsLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [pnlLoading, setPnlLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [redeemTarget, setRedeemTarget] = useState<Position | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem(`redeemed:${address}`);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const markRedeemed = (conditionId: string) => {
    setRedeemedIds((prev) => {
      const next = new Set(prev);
      next.add(conditionId);
      try {
        localStorage.setItem(`redeemed:${address}`, JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  };

  const {
    writeContract,
    data: redeemTxHash,
    isPending: isRedeemSigning,
    reset: resetRedeem,
  } = useWriteContract();

  const {
    isLoading: isRedeemConfirming,
    isSuccess: isRedeemConfirmed,
  } = useWaitForTransactionReceipt({ hash: redeemTxHash });

  const redeemLoading = isRedeemSigning || isRedeemConfirming;

  useEffect(() => {
    const wallet = address;

    setProfileLoading(true);
    setPositionsLoading(true);
    setMarketsLoading(true);
    setSimilarLoading(true);
    setError(null);

    track("wallet-view", { address: wallet });
    saveRecentWallet(wallet);

    getWalletProfile(wallet)
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setProfileLoading(false));

    getWalletPositions(wallet, { include_closed: true, limit: 200 })
      .then(setPositions)
      .catch(() => {})
      .finally(() => setPositionsLoading(false));

    getWalletMarkets(wallet, { sort_by: "realized_pnl", limit: 100 })
      .then(setMarkets)
      .catch(() => {})
      .finally(() => setMarketsLoading(false));

    getSimilarWallets(wallet, { limit: 20 })
      .then(setSimilar)
      .catch(() => {})
      .finally(() => setSimilarLoading(false));

  }, [address]);

  // Fetch PnL data (re-fetches when time window changes)
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    let startTime: number | undefined;
    let granularity = "day";

    if (timeWindow === "one_day") {
      startTime = now - 86400;
      granularity = "hour";
    } else if (timeWindow === "seven_day") {
      startTime = now - 7 * 86400;
      granularity = "day";
    } else if (timeWindow === "thirty_day") {
      startTime = now - 30 * 86400;
      granularity = "day";
    } else {
      // all_time — no start_time filter
      startTime = undefined;
      granularity = "day";
    }

    setPnlLoading(true);
    getWalletPnL(address, {
      granularity,
      start_time: startTime,
    })
      .then(setPnl)
      .catch(() => {})
      .finally(() => setPnlLoading(false));
  }, [address, timeWindow]);

  const allTimeMetrics = profile?.metrics.all_time;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-3 max-w-sm">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">{error}</h2>
            <div className="flex gap-2 justify-center pt-2">
              <Link href="/">
                <Button variant="outline" size="sm">Back to Search</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* 1. Wallet identity + Hero P&L */}
        {profileLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8 w-36" />
          </div>
        ) : profile ? (
          <WalletHeader
            address={address}
            tradingStyles={profile.trading_styles}
            isOwner={isOwner}
            firstTradeAt={profile.first_trade_at}
            lastTradeAt={profile.last_trade_at}
            realizedPnl={allTimeMetrics?.realized_pnl}
            roi={allTimeMetrics?.roi}
            portfolioValue={positions?.summary?.total_value_usd}
          />
        ) : null}

        {/* 2. Chart — full bleed, no title */}
        <div className="mt-2">
          <PnlChart data={pnl} loading={pnlLoading} timeWindow={timeWindow} />
        </div>

        {/* 3. Stats — Robinhood flat grid with period pills */}
        <div className="mt-5">
          <SectionLabel>Stats</SectionLabel>
          {profileLoading ? (
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
          ) : profile ? (
            <MetricsCards profile={profile} activeWindow={timeWindow} onWindowChange={setTimeWindow} />
          ) : null}
        </div>

        {/* 4. Portfolio summary */}
        {positions?.summary && (
          <div className="mt-5">
            <SectionLabel>Portfolio</SectionLabel>
            <div className="grid grid-cols-3 gap-x-8 mt-1">
              <PortfolioStat label="Total Value" value={formatUSD(positions.summary.total_value_usd)} />
              <PortfolioStat label="Total Cost" value={formatUSD(positions.summary.total_cost_usd)} />
              <PortfolioStat
                label="Unrealized P&L"
                value={`${pnlSign(positions.summary.total_unrealized_pnl_usd)}${formatUSD(positions.summary.total_unrealized_pnl_usd)}`}
                className={pnlColor(positions.summary.total_unrealized_pnl_usd)}
              />
            </div>
          </div>
        )}

        {/* 5. Positions */}
        <div className="mt-5">
          <PositionsTable
            data={positions}
            loading={positionsLoading}
            isOwner={isOwner}
            onRedeem={setRedeemTarget}
            redeemedIds={redeemedIds}
          />
        </div>

        {/* 6. Markets + Similar Wallets */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketPerformance data={markets} loading={marketsLoading} />
          <SimilarWallets data={similar} loading={similarLoading} />
        </div>

        <div className="h-8" />
      </main>

      <Dialog open={!!redeemTarget || isRedeemConfirmed} onOpenChange={(open) => {
        if (!open) {
          setRedeemTarget(null);
          setRedeemError(null);
          resetRedeem();
        }
      }}>
        <DialogContent>
          {isRedeemConfirmed ? (
            <>
              <DialogHeader>
                <DialogTitle>Redemption Complete</DialogTitle>
                <DialogDescription>
                  Your position has been redeemed on-chain.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Transaction</span>
                  <p className="font-mono text-xs mt-1">
                    <a
                      href={`https://polygonscan.com/tx/${redeemTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {redeemTxHash}
                    </a>
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => {
                    if (redeemTarget) markRedeemed(redeemTarget.market.condition_id);
                    setRedeemTarget(null);
                    resetRedeem();
                  }}>Done</Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Redeem Position</DialogTitle>
                <DialogDescription>
                  Redeem your position on &ldquo;{redeemTarget?.market.title}&rdquo;
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Shares</span>
                    <p className="font-mono font-bold">{redeemTarget?.position.shares.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Value</span>
                    <p className="font-mono font-bold">{redeemTarget ? `$${redeemTarget.current.value_usd.toFixed(2)}` : ""}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will call <code className="text-xs bg-muted px-1 py-0.5 rounded">redeemPositions()</code> on the Polymarket CTF contract. Your wallet will prompt you to sign the transaction.
                </p>
                {redeemError && (
                  <p className="text-sm text-[var(--color-loss)] bg-[var(--color-loss)]/10 rounded-md px-3 py-2">
                    {redeemError}
                  </p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { setRedeemTarget(null); setRedeemError(null); resetRedeem(); }} disabled={redeemLoading}>
                    Cancel
                  </Button>
                  <Button
                    disabled={redeemLoading}
                    onClick={() => {
                      if (!redeemTarget) return;
                      const conditionId = redeemTarget.market.condition_id;
                      track("redeem-confirm", { condition_id: conditionId });
                      setRedeemError(null);

                      const conditionIdHex = (conditionId.startsWith("0x") ? conditionId : `0x${conditionId}`) as `0x${string}`;

                      writeContract(
                        {
                          address: CTF_ADDRESS,
                          abi: CTF_ABI,
                          functionName: "redeemPositions",
                          args: [USDC_ADDRESS, PARENT_COLLECTION_ID, conditionIdHex, [1n, 2n]],
                        },
                        {
                          onError: (err) => {
                            const msg = err.message?.includes("User rejected")
                              ? "Transaction rejected by wallet."
                              : err.message || "Transaction failed. Please try again.";
                            setRedeemError(msg.length > 200 ? msg.slice(0, 200) + "…" : msg);
                          },
                        }
                      );
                    }}
                  >
                    {isRedeemSigning ? "Waiting for wallet..." : isRedeemConfirming ? "Confirming..." : "Confirm Redeem"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      {children}
    </h2>
  );
}

function PortfolioStat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between py-[5px]">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium font-mono tabular-nums ${className ?? ""}`}>{value}</span>
    </div>
  );
}
