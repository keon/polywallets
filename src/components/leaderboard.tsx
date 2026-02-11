"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD, formatPct, formatCompact, formatAddress, pnlColor, pnlSign } from "@/lib/format";
import Link from "next/link";
import { Search, ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { track } from "@/lib/track";

interface LeaderboardEntry {
  rank: number;
  user: string;
  metrics: {
    realized_pnl: number;
    total_pnl?: number;
    volume: number;
    roi: number;
    trades: number;
    wins: number;
    losses: number;
    win_rate: number;
    profit_factor: number;
    positions_closed?: number;
    avg_buy_price: number | null;
    avg_sell_price: number | null;
    fees_paid?: number;
    fees_refunded?: number;
  };
  trading_styles: {
    primary_style: string;
  };
  entry_edge?: number | null;
  first_trade_at?: number | null;
}

interface Market {
  condition_id: string;
  title: string;
  market_slug: string;
  status: string;
  total_volume_usd: number;
  image_url?: string;
}

function rankColor(rank: number): string {
  if (rank === 1) return "text-[var(--color-rank-gold)]";
  if (rank === 2) return "text-[var(--color-rank-silver)]";
  if (rank === 3) return "text-[var(--color-rank-bronze)]";
  return "text-muted-foreground";
}

function formatPrice(value: number | null): string {
  if (value === null || value === undefined) return "\u2014";
  return `${(value * 100).toFixed(1)}\u00a2`;
}

function formatShortDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

const SEP = " \u00b7 ";

export function Leaderboard() {
  return (
    <Tabs defaultValue="global" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="global" className="text-xs sm:text-sm">Global</TabsTrigger>
        <TabsTrigger value="market" className="text-xs sm:text-sm">By Market</TabsTrigger>
      </TabsList>
      <TabsContent value="global">
        <GlobalLeaderboard />
      </TabsContent>
      <TabsContent value="market">
        <MarketLeaderboard />
      </TabsContent>
    </Tabs>
  );
}

const TIME_WINDOWS = [
  { value: "all_time", label: "ALL" },
  { value: "30d", label: "30D" },
  { value: "7d", label: "7D" },
  { value: "1d", label: "24H" },
] as const;

function GlobalLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [window, setWindow] = useState("all_time");

  const fetchLeaderboard = useCallback((w: string) => {
    setLoading(true);
    fetch(`/api/leaderboard/global?window=${w}&sort_by=realized_pnl&limit=20`)
      .then((r) => r.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLeaderboard(window);
  }, [window, fetchLeaderboard]);

  return (
    <div className="pt-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top Traders</h3>
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
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : (
        <LeaderboardList entries={entries} />
      )}
    </div>
  );
}

function MarketLeaderboard() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketsLoading, setMarketsLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/markets?status=open&sort=volume&limit=20")
      .then((r) => r.json())
      .then((data) => setMarkets(data.markets || []))
      .catch(() => {})
      .finally(() => setMarketsLoading(false));
  }, []);

  const selectMarket = (market: Market) => {
    setSelectedMarket(market);
    setEntriesLoading(true);
    fetch(`/api/leaderboard/market?condition_id=${market.condition_id}&sort_by=realized_pnl&limit=20`)
      .then((r) => r.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => {})
      .finally(() => setEntriesLoading(false));
  };

  const filteredMarkets = markets.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedMarket) {
    return (
      <div className="pt-3">
        <button
          onClick={() => { setSelectedMarket(null); setEntries([]); }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </button>
        <a
          href={`https://polymarket.com/markets?_q=${encodeURIComponent(selectedMarket.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline inline-flex items-center gap-1 group"
        >
          {selectedMarket.title}
          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
        </a>
        <p className="text-[10px] text-muted-foreground mb-3">
          Volume: {formatUSD(selectedMarket.total_volume_usd)}
        </p>
        {entriesLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground text-xs">No leaderboard data for this market.</p>
        ) : (
          <LeaderboardList entries={entries} />
        )}
      </div>
    );
  }

  return (
    <div className="pt-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Select a Market</h3>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search markets..."
          className="pl-9 h-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {marketsLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {filteredMarkets.map((market) => (
            <button
              key={market.condition_id}
              className="w-full text-left py-2.5 flex items-center justify-between gap-3 hover:bg-accent/30 -mx-2 px-2 rounded-sm transition-colors"
              onClick={() => selectMarket(market)}
            >
              <span className="font-medium text-xs sm:text-sm truncate">{market.title}</span>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                {formatUSD(market.total_volume_usd)}
              </span>
            </button>
          ))}
          {filteredMarkets.length === 0 && (
            <p className="text-muted-foreground text-xs py-4 text-center">No markets found.</p>
          )}
        </div>
      )}
    </div>
  );
}

const PREVIEW_COUNT = 10;

function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const display = expanded ? entries : entries.slice(0, PREVIEW_COUNT);
  const hasMore = entries.length > PREVIEW_COUNT;

  return (
    <div>
      <div className="divide-y divide-border/50">
        {display.map((entry) => {
          const m = entry.metrics;

          return (
            <Link
              key={entry.user}
              href={`/w/${entry.user}`}
              onClick={() => track("leaderboard-click", { address: entry.user, rank: entry.rank })}
              className="flex items-center justify-between py-2 gap-3 hover:bg-accent/30 -mx-2 px-2 rounded-sm transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`font-mono font-bold text-[11px] w-5 shrink-0 tabular-nums ${rankColor(entry.rank)}`}>
                  {entry.rank}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-xs font-medium" title={entry.user}>{formatAddress(entry.user)}</p>
                  <p className="text-[9px] text-muted-foreground/60 font-mono tabular-nums mt-px truncate">
                    <span className="capitalize" title="Trading style">{entry.trading_styles.primary_style.toLowerCase().replace(/_/g, " ")}</span>
                    <span className="hidden sm:inline">
                      {SEP}<span title="Total volume">${formatCompact(m.volume)}</span>
                      {SEP}<span title="Total trades">{m.trades}t</span>
                      {SEP}<span title="Win rate">{formatPct(m.win_rate)}w</span>
                      {m.avg_buy_price != null && <>{SEP}<span title="Avg buy price">{formatPrice(m.avg_buy_price)}b</span></>}
                      {m.avg_sell_price != null && <>{SEP}<span title="Avg sell price">{formatPrice(m.avg_sell_price)}s</span></>}
                      {entry.first_trade_at && <>{SEP}<span title="First trade">{formatShortDate(entry.first_trade_at)}</span></>}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="text-right">
                  <p className={`font-mono text-xs font-medium tabular-nums ${pnlColor(m.realized_pnl)}`} title="Realized P&L">
                    {pnlSign(m.realized_pnl)}{formatUSD(m.realized_pnl)}
                  </p>
                  <p className={`font-mono text-[10px] tabular-nums ${pnlColor(m.roi)}`} title="Return on investment">
                    {pnlSign(m.roi)}{formatPct(m.roi)}
                  </p>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
              </div>
            </Link>
          );
        })}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center py-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? "Show less" : `View all ${entries.length}`}
        </button>
      )}
    </div>
  );
}
