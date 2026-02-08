"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatUSD, formatPct, formatAddress, pnlColor, pnlSign } from "@/lib/format";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { track } from "@/lib/track";

interface LeaderboardEntry {
  rank: number;
  user: string;
  metrics: {
    realized_pnl: number;
    volume: number;
    roi: number;
    trades: number;
    wins: number;
    losses: number;
    win_rate: number;
    profit_factor: number;
  };
  trading_styles: {
    primary_style: string;
  };
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

export function Leaderboard() {
  return (
    <Tabs defaultValue="global" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="global" className="text-xs sm:text-sm">Global Leaderboard</TabsTrigger>
        <TabsTrigger value="market" className="text-xs sm:text-sm">Market Leaderboard</TabsTrigger>
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
    <div className="pt-4">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-base sm:text-lg font-bold shrink-0">Top Traders</h3>
        <div className="flex gap-0.5 sm:gap-1">
          {([["all_time", "All"], ["30d", "30d"], ["7d", "7d"], ["1d", "24h"]] as const).map(([val, label]) => (
            <Button
              key={val}
              variant={window === val ? "default" : "ghost"}
              size="sm"
              className="px-2 sm:px-3 text-xs sm:text-sm"
              onClick={() => setWindow(val)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
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
      <div className="pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 mb-3"
          onClick={() => {
            setSelectedMarket(null);
            setEntries([]);
          }}
        >
          &larr; Back to markets
        </Button>
        <h3 className="text-base font-bold">{selectedMarket.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Volume: {formatUSD(selectedMarket.total_volume_usd)}
        </p>
        {entriesLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground text-sm">No leaderboard data for this market.</p>
        ) : (
          <LeaderboardList entries={entries} />
        )}
      </div>
    );
  }

  return (
    <div className="pt-4">
      <h3 className="text-lg font-bold mb-3">Select a Market</h3>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search markets..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {marketsLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (
        <div className="divide-y">
          {filteredMarkets.map((market) => (
            <button
              key={market.condition_id}
              className="w-full text-left py-3 flex items-center justify-between gap-3 sm:gap-4 hover:bg-accent/50 -mx-2 px-2 transition-colors"
              onClick={() => selectMarket(market)}
            >
              <span className="font-medium text-xs sm:text-sm truncate">{market.title}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap shrink-0">
                {formatUSD(market.total_volume_usd)}
              </span>
            </button>
          ))}
          {filteredMarkets.length === 0 && (
            <p className="text-muted-foreground text-sm py-4 text-center">No markets found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="divide-y">
      {entries.map((entry) => (
        <Link
          key={entry.user}
          href={`/w/${entry.user}`}
          onClick={() => track("leaderboard-click", { address: entry.user, rank: entry.rank })}
          className="flex items-center justify-between py-3 gap-3 sm:gap-4 hover:bg-accent/50 -mx-2 px-2 transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className={`font-mono font-bold text-xs sm:text-sm w-5 sm:w-6 shrink-0 ${rankColor(entry.rank)}`}>
              {entry.rank}
            </span>
            <div className="min-w-0">
              <p className="font-mono text-xs sm:text-sm" title={entry.user}>{formatAddress(entry.user)}</p>
              <Badge variant="outline" className="text-[10px] sm:text-xs capitalize mt-0.5">
                {entry.trading_styles.primary_style.toLowerCase().replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="text-right">
              <p className={`font-mono text-xs sm:text-sm font-medium ${pnlColor(entry.metrics.realized_pnl)}`}>
                {pnlSign(entry.metrics.realized_pnl)}{formatUSD(entry.metrics.realized_pnl)}
              </p>
              <p className={`font-mono text-[10px] sm:text-xs ${pnlColor(entry.metrics.roi)}`}>
                {pnlSign(entry.metrics.roi)}{formatPct(entry.metrics.roi)}
              </p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
}
