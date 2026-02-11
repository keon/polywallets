"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, formatPct, pnlColor, pnlSign } from "@/lib/format";
import type { WalletMarketsResponse } from "@/lib/predexon";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

const PREVIEW_COUNT = 5;

interface MarketPerformanceProps {
  data: WalletMarketsResponse | null;
  loading: boolean;
}

export function MarketPerformance({ data, loading }: MarketPerformanceProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Markets</h2>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
    );
  }

  if (!data || data.markets.length === 0) {
    return (
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Markets</h2>
        <p className="text-muted-foreground text-xs">No market data available.</p>
      </div>
    );
  }

  const displayMarkets = expanded ? data.markets : data.markets.slice(0, PREVIEW_COUNT);
  const hasMore = data.markets.length > PREVIEW_COUNT;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Markets</h2>
        <span className="text-[10px] text-muted-foreground/70">{data.markets.length} total</span>
      </div>
      <div className="divide-y divide-border/50">
        {displayMarkets.map((market) => (
          <a
            key={market.condition_id}
            href={`https://polymarket.com/markets?_q=${encodeURIComponent(market.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2.5 gap-2 hover:bg-accent/30 -mx-2 px-2 rounded-sm transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs sm:text-sm truncate">{market.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {market.metrics.trades} trades · {market.metrics.wins}W–{market.metrics.losses}L · {formatPct(market.metrics.win_rate)} win
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="text-right">
                <p className={`font-mono text-xs sm:text-sm font-medium tabular-nums ${pnlColor(market.metrics.realized_pnl)}`}>
                  {pnlSign(market.metrics.realized_pnl)}{formatUSD(market.metrics.realized_pnl)}
                </p>
                <p className={`text-[10px] font-mono tabular-nums ${pnlColor(market.metrics.roi)}`}>
                  {pnlSign(market.metrics.roi)}{formatPct(market.metrics.roi)}
                </p>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground/40 shrink-0" />
            </div>
          </a>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center py-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? "Show less" : `Show all ${data.markets.length}`}
        </button>
      )}
    </div>
  );
}
