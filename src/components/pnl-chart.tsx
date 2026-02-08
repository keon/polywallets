"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, pnlSign } from "@/lib/format";
import type { WalletPnLResponse } from "@/lib/predexon";
import type { TimeWindow } from "@/components/metrics-cards";
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
  timeWindow?: TimeWindow;
}

function formatDate(ts: number, timeWindow?: TimeWindow): string {
  const date = new Date(ts * 1000);
  if (timeWindow === "one_day") {
    return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAxisDate(ts: number, timeWindow?: TimeWindow): string {
  const date = new Date(ts * 1000);
  if (timeWindow === "one_day") {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PnlChart({ data, loading, timeWindow }: PnlChartProps) {
  if (loading) {
    return <Skeleton className="h-48 sm:h-56 w-full rounded-none" />;
  }

  if (!data || data.pnl_over_time.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center">
        <p className="text-muted-foreground text-xs">No P&L data available.</p>
      </div>
    );
  }

  const lastPnl = data.pnl_over_time[data.pnl_over_time.length - 1]?.pnl_to_date ?? 0;
  const isPositive = lastPnl >= 0;

  const chartData = data.pnl_over_time.map((d) => ({
    ts: d.timestamp,
    pnl: d.pnl_to_date,
  }));

  const strokeColor = isPositive ? "#00C805" : "#FF5000";

  return (
    <div className="h-48 sm:h-56 -mx-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.12} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="ts"
            tickFormatter={(ts) => formatAxisDate(ts, timeWindow)}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            minTickGap={50}
          />
          <YAxis hide />
          <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              fontSize: "12px",
              padding: "6px 10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            labelFormatter={(ts) => formatDate(Number(ts), timeWindow)}
            formatter={(value) => [
              `${pnlSign(Number(value))}${formatUSD(Number(value))}`,
              "P&L",
            ]}
          />
          <Area
            type="monotone"
            dataKey="pnl"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill="url(#pnlGradient)"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0, fill: strokeColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
