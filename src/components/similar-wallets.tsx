"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, formatPct, formatAddress, pnlColor, pnlSign } from "@/lib/format";
import type { SimilarWalletsResponse } from "@/lib/predexon";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const PREVIEW_COUNT = 5;

interface SimilarWalletsProps {
  data: SimilarWalletsResponse | null;
  loading: boolean;
}

export function SimilarWallets({ data, loading }: SimilarWalletsProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Similar Wallets</h2>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
    );
  }

  if (!data || data.similar_wallets.length === 0) {
    return (
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Similar Wallets</h2>
        <p className="text-muted-foreground text-xs">No similar wallets found.</p>
      </div>
    );
  }

  const displayWallets = expanded ? data.similar_wallets : data.similar_wallets.slice(0, PREVIEW_COUNT);
  const hasMore = data.similar_wallets.length > PREVIEW_COUNT;

  return (
    <div>
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Similar Wallets</h2>
      <div className="divide-y divide-border/50">
        {displayWallets.map((wallet) => (
          <Link
            key={wallet.user}
            href={`/w/${wallet.user}`}
            className="flex items-center justify-between py-2.5 gap-2 hover:bg-accent/30 -mx-2 px-2 rounded-sm transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs sm:text-sm font-medium" title={wallet.user}>{formatAddress(wallet.user)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {wallet.markets_overlap} overlap ({formatPct(wallet.overlap_pct)})
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="text-right">
                <p className={`font-mono text-xs sm:text-sm font-medium tabular-nums ${pnlColor(wallet.metrics.realized_pnl)}`}>
                  {pnlSign(wallet.metrics.realized_pnl)}{formatUSD(wallet.metrics.realized_pnl)}
                </p>
                <p className={`text-[10px] font-mono tabular-nums ${pnlColor(wallet.metrics.roi)}`}>
                  {pnlSign(wallet.metrics.roi)}{formatPct(wallet.metrics.roi)}
                </p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center py-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? "Show less" : `Show all ${data.similar_wallets.length}`}
        </button>
      )}
    </div>
  );
}
