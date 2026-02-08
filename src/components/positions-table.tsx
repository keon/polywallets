"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, pnlColor, pnlSign } from "@/lib/format";
import type { Position, PositionsResponse } from "@/lib/predexon";
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
        <h2 className="text-lg font-bold mb-4">Positions</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      </div>
    );
  }

  if (!data || data.positions.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-4">Positions</h2>
        <p className="text-muted-foreground text-sm">No positions found.</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold">Positions</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {openPositions.length} open · {closedPositions.length} closed
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          {data.summary && (
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-base sm:text-lg font-bold">{formatUSD(data.summary.total_value_usd)}</p>
            </div>
          )}
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => setShowClosed(!showClosed)}>
            {showClosed ? "Hide" : "Show"} Closed
          </Button>
        </div>
      </div>
      <div className="divide-y">
        {displayPositions.map((pos) => (
          <div key={`${pos.market.condition_id}-${pos.market.side}`} className="flex items-center justify-between py-3 gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate text-xs sm:text-sm">{pos.market.title}</p>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                <Badge variant={pos.market.side === "YES" ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                  {pos.market.side_label || pos.market.side}
                </Badge>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {pos.position.shares.toFixed(2)} @ {pos.position.avg_entry_price.toFixed(3)}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-xs sm:text-sm font-medium">{formatUSD(pos.current.value_usd)}</p>
              <p className={`text-[10px] sm:text-xs font-mono ${pnlColor(pos.pnl.unrealized_usd)}`}>
                {pnlSign(pos.pnl.unrealized_usd)}{formatUSD(pos.pnl.unrealized_usd)}
              </p>
            </div>
            {isOwner && pos.current.price >= 0.99 && pos.position.shares > 0 && (
              redeemedIds?.has(pos.market.condition_id) ? (
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] sm:text-xs text-muted-foreground">
                  Redeemed
                </Badge>
              ) : (
                <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => onRedeem?.(pos)}>
                  Redeem
                </Button>
              )
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : `Show all ${allDisplay.length}`}
        </Button>
      )}
    </div>
  );
}
