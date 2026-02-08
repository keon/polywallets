"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, pnlColor, pnlSign } from "@/lib/format";
import type { Position, PositionsResponse } from "@/lib/predexon";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

const PREVIEW_COUNT = 5;

interface PositionsTableProps {
  data: PositionsResponse | null;
  loading: boolean;
  isOwner: boolean;
  onRedeem?: (position: Position) => void;
  redeemedIds?: Set<string>;
}

export function PositionsTable({ data, loading, isOwner, onRedeem, redeemedIds }: PositionsTableProps) {
  const [showClosed, setShowClosed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Positions</h2>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
    );
  }

  if (!data || data.positions.length === 0) {
    return (
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Positions</h2>
        <p className="text-muted-foreground text-xs">No positions found.</p>
      </div>
    );
  }

  const openPositions = data.positions.filter((p) => p.position.shares > 0);
  const closedPositions = data.positions.filter((p) => p.position.shares === 0);
  const allDisplay = showClosed ? data.positions : openPositions;
  const displayPositions = expanded ? allDisplay : allDisplay.slice(0, PREVIEW_COUNT);
  const hasMore = allDisplay.length > PREVIEW_COUNT;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Positions</h2>
          <span className="text-[10px] text-muted-foreground/70">
            {openPositions.length} open · {closedPositions.length} closed
          </span>
        </div>
        <button
          onClick={() => setShowClosed(!showClosed)}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {showClosed ? "Hide closed" : "Show closed"}
        </button>
      </div>
      <div className="divide-y divide-border/50">
        {displayPositions.map((pos) => (
          <div key={`${pos.market.condition_id}-${pos.market.side}`} className="flex items-center justify-between py-2.5 gap-3">
            <div className="min-w-0 flex-1">
              <a
                href={`https://polymarket.com/markets?_q=${encodeURIComponent(pos.market.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium truncate text-xs sm:text-sm leading-tight hover:underline inline-flex items-center gap-1 group max-w-full"
              >
                <span className="truncate">{pos.market.title}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
              </a>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-medium ${pos.market.side === "YES" ? "text-[var(--color-profit)]" : "text-muted-foreground"}`}>
                  {pos.market.side_label || pos.market.side}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {pos.position.shares.toFixed(2)} @ {pos.position.avg_entry_price.toFixed(3)}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-xs sm:text-sm font-medium tabular-nums">{formatUSD(pos.current.value_usd)}</p>
              <p className={`text-[10px] font-mono tabular-nums ${pnlColor(pos.pnl.unrealized_usd)}`}>
                {pnlSign(pos.pnl.unrealized_usd)}{formatUSD(pos.pnl.unrealized_usd)}
              </p>
            </div>
            {isOwner && pos.current.price >= 0.99 && pos.position.shares > 0 && (
              redeemedIds?.has(pos.market.condition_id) ? (
                <span className="hidden sm:inline text-[10px] text-muted-foreground">Redeemed</span>
              ) : (
                <button
                  onClick={() => onRedeem?.(pos)}
                  className="hidden sm:inline text-[11px] font-medium text-[var(--color-profit)] hover:underline"
                >
                  Redeem
                </button>
              )
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center py-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? "Show less" : `Show all ${allDisplay.length}`}
        </button>
      )}
    </div>
  );
}
