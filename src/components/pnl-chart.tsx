"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, pnlColor, pnlSign } from "@/lib/format";
import type { WalletPnLResponse } from "@/lib/predexon";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface PnlChartProps {
  data: WalletPnLResponse | null;
  loading: boolean;
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAxisDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PnlChart({ data, loading }: PnlChartProps) {
  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-4">Realized P&L</h2>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data || data.pnl_over_time.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-4">Realized P&L</h2>
        <p className="text-muted-foreground text-sm">No P&L data available.</p>
      </div>
    );
  }

  const realized = data.realized_pnl ?? 0;
  const unrealized = data.unrealized_pnl ?? 0;
  const fees = (data.fees_paid ?? 0) - (data.fees_refunded ?? 0);
  const total = data.total_pnl ?? (realized + unrealized - fees);
  const lastPnl = data.pnl_over_time[data.pnl_over_time.length - 1]?.pnl_to_date ?? 0;
  const isPositive = lastPnl >= 0;

  const chartData = data.pnl_over_time.map((d) => ({
    ts: d.timestamp,
    pnl: d.pnl_to_date,
  }));

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Realized P&L</h2>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Realized</p>
          <p className={`text-sm sm:text-base font-bold font-mono ${pnlColor(realized)}`}>
            {pnlSign(realized)}{formatUSD(realized)}
          </p>
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Unrealized</p>
          <p className={`text-sm sm:text-base font-bold font-mono ${pnlColor(unrealized)}`}>
            {pnlSign(unrealized)}{formatUSD(unrealized)}
          </p>
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Fees Paid</p>
          <p className="text-sm sm:text-base font-bold font-mono">
            {fees > 0 ? "-" : ""}{formatUSD(fees)}
          </p>
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Total (after fees)</p>
          <p className={`text-sm sm:text-base font-bold font-mono ${pnlColor(total)}`}>
            {pnlSign(total)}{formatUSD(total)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "#00C805" : "#FF5000"} stopOpacity={0.15} />
                <stop offset="100%" stopColor={isPositive ? "#00C805" : "#FF5000"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="ts"
              tickFormatter={formatAxisDate}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              tickFormatter={(v: number) => {
                const abs = Math.abs(v);
                if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
                if (abs >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
                return `$${v.toFixed(0)}`;
              }}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              labelFormatter={(ts: number) => formatDate(ts)}
              formatter={(value: number) => [
                `${pnlSign(value)}${formatUSD(value)}`,
                "P&L",
              ]}
            />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke={isPositive ? "#00C805" : "#FF5000"}
              strokeWidth={1.5}
              fill="url(#pnlGradient)"
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0, fill: isPositive ? "#00C805" : "#FF5000" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
