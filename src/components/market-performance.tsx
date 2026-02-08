"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, formatPct, pnlColor, pnlSign } from "@/lib/format";
import type { WalletMarketsResponse } from "@/lib/predexon";
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
        <h2 className="text-lg font-bold mb-4">Markets</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      </div>
    );
  }

  if (!data || data.markets.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-4">Markets</h2>
        <p className="text-muted-foreground text-sm">No market data available.</p>
      </div>
    );
  }

  const displayMarkets = expanded ? data.markets : data.markets.slice(0, PREVIEW_COUNT);
  const hasMore = data.markets.length > PREVIEW_COUNT;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-bold">Markets</h2>
        <span className="text-xs text-muted-foreground">{data.markets.length} total</span>
      </div>
      <div className="divide-y">
        {displayMarkets.map((market) => (
          <div key={market.market_slug} className="py-3 gap-3">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-xs sm:text-sm leading-snug flex-1 min-w-0">{market.title}</p>
              <div className="text-right shrink-0">
                <p className={`font-mono text-xs sm:text-sm font-medium ${pnlColor(market.metrics.realized_pnl)}`}>
                  {pnlSign(market.metrics.realized_pnl)}{formatUSD(market.metrics.realized_pnl)}
                </p>
                <p className={`text-[10px] sm:text-xs font-mono ${pnlColor(market.metrics.roi)}`}>
                  {pnlSign(market.metrics.roi)}{formatPct(market.metrics.roi)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground">
              <span>{market.metrics.trades} trades</span>
              <span>{market.metrics.wins}W – {market.metrics.losses}L</span>
              <span>{formatPct(market.metrics.win_rate)} win</span>
              <span>Vol {formatUSD(market.metrics.volume)}</span>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : `Show all ${data.markets.length}`}
        </Button>
      )}
    </div>
  );
}
