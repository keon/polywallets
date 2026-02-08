"use client";

import { useState } from "react";
import { formatUSD, formatPct, pnlColor, pnlSign } from "@/lib/format";
import type { WalletProfile, WindowMetrics, AllTimeMetrics } from "@/lib/predexon";

interface MetricsCardsProps {
  profile: WalletProfile;
}

function formatDuration(seconds: number): string {
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
  return `${(seconds / 86400).toFixed(1)}d`;
}

const WINDOWS: { key: keyof WalletProfile["metrics"]; label: string }[] = [
  { key: "one_day", label: "24H" },
  { key: "seven_day", label: "7D" },
  { key: "thirty_day", label: "30D" },
  { key: "all_time", label: "ALL" },
];

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between py-[5px]">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium font-mono tabular-nums ${className ?? ""}`}>{value}</span>
    </div>
  );
}

export function MetricsCards({ profile }: MetricsCardsProps) {
  const [active, setActive] = useState<keyof WalletProfile["metrics"]>("all_time");
  const m: WindowMetrics | undefined = profile.metrics[active];
  const isAllTime = active === "all_time";
  const at = isAllTime && m ? (m as AllTimeMetrics) : null;
  const allTime = profile.metrics.all_time as AllTimeMetrics | undefined;

  return (
    <div>
      {/* Time period pills — Robinhood style */}
      <div className="flex gap-1 mb-3">
        {WINDOWS.map((w) => (
          <button
            key={w.key}
            onClick={() => setActive(w.key)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
              active === w.key
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {m && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          {/* Column 1: P&L */}
          <div className="divide-y divide-border/50">
            <Stat
              label="Realized P&L"
              value={`${pnlSign(m.realized_pnl)}${formatUSD(m.realized_pnl)}`}
              className={pnlColor(m.realized_pnl)}
            />
            <Stat label="Volume" value={formatUSD(m.volume)} />
            <Stat
              label="ROI"
              value={`${pnlSign(m.roi)}${formatPct(m.roi)}`}
              className={pnlColor(m.roi)}
            />
            <Stat label="Profit Factor" value={m.profit_factor === 0 ? "—" : m.profit_factor.toFixed(2)} />
            {at && (
              <Stat
                label="Best Position"
                value={`${pnlSign(at.best_position_realized_pnl)}${formatUSD(at.best_position_realized_pnl)}`}
                className={pnlColor(at.best_position_realized_pnl)}
              />
            )}
            {at && (
              <Stat
                label="Worst Position"
                value={`${pnlSign(at.worst_position_realized_pnl)}${formatUSD(at.worst_position_realized_pnl)}`}
                className={pnlColor(at.worst_position_realized_pnl)}
              />
            )}
          </div>

          {/* Column 2: Trading */}
          <div className="divide-y divide-border/50">
            <Stat label="Win Rate" value={formatPct(m.win_rate)} />
            <Stat label="Record" value={`${m.wins}W – ${m.losses}L`} />
            <Stat label="Trades" value={m.trades.toLocaleString()} />
            <Stat label="Positions Closed" value={m.positions_closed.toLocaleString()} />
            {m.avg_buy_price !== null && (
              <Stat label="Avg Buy" value={`$${m.avg_buy_price.toFixed(3)}`} />
            )}
            {m.avg_sell_price !== null && (
              <Stat label="Avg Sell" value={`$${m.avg_sell_price.toFixed(3)}`} />
            )}
          </div>

          {/* Column 3: Overview */}
          <div className="divide-y divide-border/50">
            <Stat label="Fees Paid" value={formatUSD(m.fees_paid)} />
            {m.fees_refunded > 0 && (
              <Stat label="Fees Refunded" value={formatUSD(m.fees_refunded)} />
            )}
            {at && <Stat label="Avg Hold Time" value={formatDuration(at.avg_hold_time_seconds)} />}
            {at && <Stat label="Max Win Streak" value={at.max_win_streak.toString()} />}
            {at && <Stat label="Max Loss Streak" value={at.max_loss_streak.toString()} />}
            {allTime && <Stat label="Wallet Age" value={`${allTime.wallet_age_days.toLocaleString()}d`} />}
            {profile.entry_edge !== null && (
              <Stat
                label="Entry Edge"
                value={`${pnlSign(profile.entry_edge)}${formatPct(profile.entry_edge)}`}
                className={pnlColor(profile.entry_edge)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
