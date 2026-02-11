"use client";

import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, formatPct, formatCompact, pnlColor, pnlSign } from "@/lib/format";

interface CohortStats {
  cohort_name: string;
  wallet_count: number;
  total_volume: number;
  total_realized_pnl: number;
  avg_realized_pnl: number;
  median_realized_pnl: number;
  avg_roi: number;
  avg_win_rate: number;
  avg_profit_factor: number;
  avg_trades: number;
  profitable_wallet_pct: number;
  total_fees_paid: number;
  total_fees_refunded: number;
  avg_fees_paid: number;
  avg_fees_refunded: number;
}

interface CohortResponse {
  window: string;
  total_wallets: number;
  cohorts: CohortStats[];
}

const TIME_WINDOWS = [
  { value: "all_time", label: "ALL" },
  { value: "30d", label: "30D" },
  { value: "7d", label: "7D" },
  { value: "1d", label: "24H" },
] as const;

const COHORT_LABELS: Record<string, string> = {
  WHALE: "Whale",
  MARKET_MAKER: "Market Maker",
  ACTIVE_TRADER: "Active Trader",
  BUY_AND_HOLD: "Buy & Hold",
  DEGEN: "Degen",
  HIGH_CONVICTION: "High Conviction",
  CONTRARIAN: "Contrarian",
  VALUE_HUNTER: "Value Hunter",
};

const SEP = " \u00b7 ";

export function CohortAnalytics() {
  const [data, setData] = useState<CohortResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [window, setWindow] = useState("all_time");

  const fetchCohorts = useCallback((w: string) => {
    setLoading(true);
    fetch(`/api/cohorts?window=${w}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCohorts(window);
  }, [window, fetchCohorts]);

  const maxVolume = data ? Math.max(...data.cohorts.map((c) => c.total_volume), 1) : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cohort Analytics</h3>
          {data && !loading && (
            <span className="text-[9px] text-muted-foreground/50 font-mono tabular-nums">
              {data.total_wallets.toLocaleString()} wallets
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {TIME_WINDOWS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setWindow(value)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                window === value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-1.5">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
        </div>
      ) : !data || data.cohorts.length === 0 ? (
        <p className="text-muted-foreground text-xs">No cohort data available.</p>
      ) : (
        <div className="space-y-0.5">
          {data.cohorts
            .sort((a, b) => b.total_volume - a.total_volume)
            .map((cohort) => {
              const barWidth = (cohort.total_volume / maxVolume) * 100;
              return (
                <div key={cohort.cohort_name} className="group relative rounded-sm overflow-hidden">
                  {/* Volume bar background */}
                  <div
                    className="absolute inset-y-0 left-0 bg-foreground/[0.04] group-hover:bg-foreground/[0.07] transition-colors rounded-sm"
                    style={{ width: `${barWidth}%` }}
                  />
                  <div className="relative flex items-center justify-between px-2 py-1.5 gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium truncate">
                          {COHORT_LABELS[cohort.cohort_name] ?? cohort.cohort_name}
                        </span>
                        <span className="text-[9px] text-muted-foreground/50 font-mono tabular-nums shrink-0" title="Wallets in cohort">
                          {cohort.wallet_count.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground/50 font-mono tabular-nums mt-px truncate">
                        <span title="Total volume">${formatCompact(cohort.total_volume)}</span>
                        {SEP}<span title="Avg trades per wallet">{Math.round(cohort.avg_trades)}t/w</span>
                        {SEP}<span title="Avg win rate">{formatPct(cohort.avg_win_rate)}w</span>
                        {SEP}<span title="% of wallets profitable">{formatPct(cohort.profitable_wallet_pct)} prof</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-mono text-xs font-medium tabular-nums ${pnlColor(cohort.avg_realized_pnl)}`} title="Avg realized P&L per wallet">
                        {pnlSign(cohort.avg_realized_pnl)}{formatUSD(cohort.avg_realized_pnl)}
                      </p>
                      <p className={`font-mono text-[9px] tabular-nums ${pnlColor(cohort.avg_roi)}`} title="Avg return on investment">
                        {pnlSign(cohort.avg_roi)}{formatPct(cohort.avg_roi)} roi
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
