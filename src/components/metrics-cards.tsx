"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUSD, formatPct, pnlColor, pnlSign } from "@/lib/format";
import type { WalletProfile, WindowMetrics, AllTimeMetrics } from "@/lib/predexon";

interface MetricsCardsProps {
  profile: WalletProfile;
}

function MetricItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <p className="text-[11px] sm:text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg sm:text-xl font-bold ${className ?? ""}`}>{value}</p>
    </div>
  );
}

function StatRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs sm:text-sm text-muted-foreground">{label}</span>
      <span className={`text-xs sm:text-sm font-medium font-mono ${className ?? ""}`}>{value}</span>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
  return `${(seconds / 86400).toFixed(1)}d`;
}

export function MetricsCards({ profile }: MetricsCardsProps) {
  const windows: { key: keyof WalletProfile["metrics"]; label: string }[] = [
    { key: "one_day", label: "24h" },
    { key: "seven_day", label: "7d" },
    { key: "thirty_day", label: "30d" },
    { key: "all_time", label: "All Time" },
  ];

  const allTime = profile.metrics.all_time as AllTimeMetrics;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all_time">
        <TabsList>
          {windows.map((w) => (
            <TabsTrigger key={w.key} value={w.key}>{w.label}</TabsTrigger>
          ))}
        </TabsList>
        {windows.map((w) => {
          const m: WindowMetrics | undefined = profile.metrics[w.key];
          if (!m) return null;
          const isAllTime = w.key === "all_time";
          const at = isAllTime ? (m as AllTimeMetrics) : null;
          return (
            <TabsContent key={w.key} value={w.key}>
              {/* Primary metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 py-3 sm:py-4">
                <MetricItem
                  label="Realized P&L"
                  value={`${pnlSign(m.realized_pnl)}${formatUSD(m.realized_pnl)}`}
                  className={pnlColor(m.realized_pnl)}
                />
                <MetricItem label="Volume" value={formatUSD(m.volume)} />
                <MetricItem
                  label="ROI"
                  value={`${pnlSign(m.roi)}${formatPct(m.roi)}`}
                  className={pnlColor(m.roi)}
                />
                <MetricItem label="Win Rate" value={formatPct(m.win_rate)} />
                <MetricItem label="Record" value={`${m.wins}W – ${m.losses}L`} />
                <MetricItem label="Profit Factor" value={m.profit_factor === 0 ? "—" : m.profit_factor.toFixed(2)} />
              </div>

              {/* Secondary stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 border-t divide-y sm:divide-y-0">
                <div>
                  <StatRow label="Trades" value={m.trades.toLocaleString()} />
                  <StatRow label="Positions Closed" value={m.positions_closed.toLocaleString()} />
                  <StatRow label="Fees Paid" value={formatUSD(m.fees_paid)} />
                  {m.fees_refunded > 0 && (
                    <StatRow label="Fees Refunded" value={formatUSD(m.fees_refunded)} />
                  )}
                </div>
                <div>
                  {m.avg_buy_price !== null && (
                    <StatRow label="Avg Buy Price" value={`$${m.avg_buy_price.toFixed(3)}`} />
                  )}
                  {m.avg_sell_price !== null && (
                    <StatRow label="Avg Sell Price" value={`$${m.avg_sell_price.toFixed(3)}`} />
                  )}
                  {at && (
                    <>
                      <StatRow
                        label="Best Position"
                        value={`${pnlSign(at.best_position_realized_pnl)}${formatUSD(at.best_position_realized_pnl)}`}
                        className={pnlColor(at.best_position_realized_pnl)}
                      />
                      <StatRow
                        label="Worst Position"
                        value={`${pnlSign(at.worst_position_realized_pnl)}${formatUSD(at.worst_position_realized_pnl)}`}
                        className={pnlColor(at.worst_position_realized_pnl)}
                      />
                    </>
                  )}
                </div>
                {at && (
                  <div>
                    <StatRow label="Avg Hold Time" value={formatDuration(at.avg_hold_time_seconds)} />
                    <StatRow label="Max Win Streak" value={at.max_win_streak.toString()} />
                    <StatRow label="Max Loss Streak" value={at.max_loss_streak.toString()} />
                    <StatRow label="Active Positions" value={at.active_positions.toLocaleString()} />
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Wallet overview stats */}
      {allTime && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4">
          <div>
            <p className="text-[11px] sm:text-xs text-muted-foreground">Wallet Age</p>
            <p className="text-sm sm:text-base font-medium">{allTime.wallet_age_days.toLocaleString()} days</p>
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-muted-foreground">Total Positions</p>
            <p className="text-sm sm:text-base font-medium">{allTime.total_positions.toLocaleString()}</p>
          </div>
          {profile.entry_edge !== null && (
            <div>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Entry Edge</p>
              <p className={`text-sm sm:text-base font-medium ${pnlColor(profile.entry_edge)}`}>
                {pnlSign(profile.entry_edge)}{formatPct(profile.entry_edge)}
              </p>
            </div>
          )}
          <div>
            <p className="text-[11px] sm:text-xs text-muted-foreground">Net Fees</p>
            <p className="text-sm sm:text-base font-medium">
              {formatUSD(allTime.fees_paid - allTime.fees_refunded)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
