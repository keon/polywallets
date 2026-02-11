"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, formatPct, pnlColor, pnlSign } from "@/lib/format";
import type { Position, PositionsResponse, WalletMarketsResponse, MarketEntry } from "@/lib/predexon";
import { ExternalLink, ArrowUpDown, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

const PREVIEW_COUNT = 5;

export type PositionSortBy = "value" | "unrealized_pnl" | "realized_pnl" | "cost" | "avg_price" | "current_price" | "entry_date";

const SORT_OPTIONS: { value: PositionSortBy; label: string }[] = [
  { value: "value", label: "Value" },
  { value: "unrealized_pnl", label: "Unrealized P&L" },
  { value: "realized_pnl", label: "Realized P&L" },
  { value: "cost", label: "Cost" },
  { value: "current_price", label: "Price" },
  { value: "entry_date", label: "Entry Date" },
];

function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatPrice(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `${(value * 100).toFixed(1)}\u00a2`;
}

function StatCell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60 leading-none mb-0.5">{label}</p>
      <p className={`text-[11px] font-mono tabular-nums leading-tight ${color ?? "text-foreground/80"}`}>{value}</p>
    </div>
  );
}

interface PositionsTableProps {
  data: PositionsResponse | null;
  loading: boolean;
  isOwner: boolean;
  onRedeem?: (position: Position) => void;
  redeemedIds?: Set<string>;
  sortBy: PositionSortBy;
  onSortChange: (sort: PositionSortBy) => void;
  activeMarketIds?: Set<string> | null;
  marketMetrics?: WalletMarketsResponse | null;
}

export function PositionsTable({ data, loading, isOwner, onRedeem, redeemedIds, sortBy, onSortChange, activeMarketIds, marketMetrics }: PositionsTableProps) {
  const [showClosed, setShowClosed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Build a lookup map: condition_id → MarketEntry
  const metricsMap = useMemo(() => {
    if (!marketMetrics) return new Map<string, MarketEntry>();
    const map = new Map<string, MarketEntry>();
    for (const m of marketMetrics.markets) {
      map.set(m.condition_id, m);
    }
    return map;
  }, [marketMetrics]);

  const sortHeader = (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Positions</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as PositionSortBy)}
            className="text-[11px] text-muted-foreground bg-transparent border-none outline-none cursor-pointer hover:text-foreground transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        {sortHeader}
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
    );
  }

  if (!data || data.positions.length === 0) {
    return (
      <div>
        {sortHeader}
        <p className="text-muted-foreground text-xs">No positions found.</p>
      </div>
    );
  }

  // Filter by active markets for selected time window
  const isFiltered = !!activeMarketIds;
  const filtered = activeMarketIds
    ? data.positions.filter((p) => activeMarketIds.has(p.market.condition_id))
    : data.positions;

  const openPositions = filtered.filter((p) => p.position.shares > 0);
  const closedPositions = filtered.filter((p) => p.position.shares === 0);
  const allDisplay = showClosed ? filtered : openPositions;
  const displayPositions = expanded ? allDisplay : allDisplay.slice(0, PREVIEW_COUNT);
  const hasMore = allDisplay.length > PREVIEW_COUNT;

  const totalOpen = data.positions.filter((p) => p.position.shares > 0).length;
  const totalClosed = data.positions.filter((p) => p.position.shares === 0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Positions</h2>
          <span className="text-[10px] text-muted-foreground/70">
            {isFiltered
              ? `${openPositions.length}/${totalOpen} open \u00b7 ${closedPositions.length}/${totalClosed} closed`
              : `${openPositions.length} open \u00b7 ${closedPositions.length} closed`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as PositionSortBy)}
              className="text-[11px] text-muted-foreground bg-transparent border-none outline-none cursor-pointer hover:text-foreground transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowClosed(!showClosed)}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {showClosed ? "Hide closed" : "Show closed"}
          </button>
        </div>
      </div>
      {displayPositions.length === 0 && (
        <p className="text-muted-foreground text-xs py-3">No positions found in this time period.</p>
      )}
      <div className="divide-y divide-border/50">
        {displayPositions.map((pos) => {
          const rowKey = `${pos.market.condition_id}-${pos.market.side}`;
          const isExpanded = expandedRow === rowKey;
          const mkt = metricsMap.get(pos.market.condition_id);

          return (
            <div key={rowKey}>
              <div
                className="flex items-center justify-between py-2.5 gap-3 cursor-pointer group/row"
                onClick={() => setExpandedRow(isExpanded ? null : rowKey)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <a
                      href={`https://polymarket.com/markets?_q=${encodeURIComponent(pos.market.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium truncate text-xs sm:text-sm leading-tight hover:underline inline-flex items-center gap-1 group max-w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="truncate">{pos.market.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] font-medium ${pos.market.side === "YES" ? "text-[var(--color-profit)]" : "text-muted-foreground"}`} title="Position side">
                      {pos.market.side_label || pos.market.side}
                    </span>
                    <span className="text-[10px] text-muted-foreground" title="Shares held @ avg entry price">
                      {pos.position.shares.toFixed(2)} @ {pos.position.avg_entry_price.toFixed(3)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <p className="font-mono text-xs sm:text-sm font-medium tabular-nums" title="Current value">{formatUSD(pos.current.value_usd)}</p>
                    <p className={`text-[10px] font-mono tabular-nums ${pnlColor(pos.pnl.unrealized_usd)}`} title="Unrealized P&L">
                      {pnlSign(pos.pnl.unrealized_usd)}{formatUSD(pos.pnl.unrealized_usd)}
                    </p>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-muted-foreground/40 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </div>
                {isOwner && pos.current.price >= 0.99 && pos.position.shares > 0 && (
                  redeemedIds?.has(pos.market.condition_id) ? (
                    <span className="hidden sm:inline text-[10px] text-muted-foreground">Redeemed</span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); onRedeem?.(pos); }}
                      className="hidden sm:inline text-[11px] font-medium text-[var(--color-profit)] hover:underline"
                    >
                      Redeem
                    </button>
                  )
                )}
              </div>

              {/* Expandable detail row */}
              {isExpanded && (
                <div className="pb-3 pt-0.5 pl-0.5">
                  {mkt ? (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-2">
                      <StatCell label="Volume" value={formatUSD(mkt.metrics.volume)} />
                      <StatCell label="Trades" value={String(mkt.metrics.trades)} />
                      <StatCell
                        label="ROI"
                        value={`${pnlSign(mkt.metrics.roi)}${formatPct(mkt.metrics.roi)}`}
                        color={pnlColor(mkt.metrics.roi)}
                      />
                      <StatCell label="Avg Buy" value={formatPrice(mkt.metrics.avg_buy_price)} />
                      <StatCell label="Avg Sell" value={formatPrice(mkt.metrics.avg_sell_price)} />
                      <StatCell
                        label="Win Rate"
                        value={`${formatPct(mkt.metrics.win_rate)}`}
                      />
                      {mkt.first_trade_at && (
                        <StatCell label="First Trade" value={formatDate(mkt.first_trade_at)} />
                      )}
                      <StatCell
                        label="Realized"
                        value={`${pnlSign(mkt.metrics.realized_pnl)}${formatUSD(mkt.metrics.realized_pnl)}`}
                        color={pnlColor(mkt.metrics.realized_pnl)}
                      />
                      <StatCell label="Fees" value={formatUSD(mkt.metrics.fees_paid)} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                      <StatCell label="Cost" value={formatUSD(pos.position.total_cost_usd)} />
                      <StatCell label="Entry" value={formatPrice(pos.position.avg_entry_price)} />
                      <StatCell label="Current" value={formatPrice(pos.current.price)} />
                      <StatCell
                        label="Realized"
                        value={`${pnlSign(pos.pnl.realized_usd)}${formatUSD(pos.pnl.realized_usd)}`}
                        color={pnlColor(pos.pnl.realized_usd)}
                      />
                      <StatCell
                        label="Unrealized"
                        value={`${pnlSign(pos.pnl.unrealized_usd)}${formatUSD(pos.pnl.unrealized_usd)}`}
                        color={pnlColor(pos.pnl.unrealized_usd)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
