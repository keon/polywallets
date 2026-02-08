"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { formatAddress, formatUSD, pnlColor, pnlSign, formatPct } from "@/lib/format";
import { track } from "@/lib/track";
import { useState } from "react";
import Link from "next/link";
import type { TradingStyles } from "@/lib/predexon";

interface WalletHeaderProps {
  address: string;
  tradingStyles: TradingStyles;
  isOwner: boolean;
  firstTradeAt: number | null;
  lastTradeAt: number | null;
  realizedPnl?: number;
  roi?: number;
  portfolioValue?: number;
}

function getStyleBadges(styles: TradingStyles): string[] {
  const badges: string[] = [];
  if (styles.primary_style) badges.push(styles.primary_style.replace(/_/g, " "));
  if (styles.is_whale) badges.push("Whale");
  if (styles.is_market_maker) badges.push("Market Maker");
  if (styles.is_degen) badges.push("Degen");
  if (styles.is_high_conviction) badges.push("High Conviction");
  if (styles.is_contrarian) badges.push("Contrarian");
  if (styles.is_value_hunter) badges.push("Value Hunter");
  if (styles.is_buy_and_hold) badges.push("Buy & Hold");
  return badges;
}

export function WalletHeader({ address, tradingStyles, isOwner, firstTradeAt, lastTradeAt, realizedPnl, roi, portfolioValue }: WalletHeaderProps) {
  const [copied, setCopied] = useState(false);
  const badges = getStyleBadges(tradingStyles);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    track("copy-address", { address });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Top bar: back + address + badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors mr-1">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-sm sm:text-base font-medium font-mono" title={address}>{formatAddress(address)}</h1>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={copyAddress}>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
        {isOwner && <Badge variant="secondary" className="text-[10px]">You</Badge>}
        {badges.map((style) => (
          <Badge key={style} variant="outline" className="capitalize text-[10px] px-1.5 py-0 text-muted-foreground">
            {style.toLowerCase()}
          </Badge>
        ))}
        {firstTradeAt && (
          <span className="text-[10px] text-muted-foreground ml-auto hidden sm:inline">
            Since {new Date(firstTradeAt * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            {lastTradeAt && ` · Last ${new Date(lastTradeAt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          </span>
        )}
      </div>

      {/* Hero P&L number — Robinhood style */}
      {realizedPnl !== undefined && (
        <div className="mt-3">
          <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${pnlColor(realizedPnl)}`}>
            {pnlSign(realizedPnl)}{formatUSD(realizedPnl)}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            {roi !== undefined && (
              <span className={`text-xs sm:text-sm font-medium ${pnlColor(roi)}`}>
                {pnlSign(roi)}{formatPct(roi)} all time
              </span>
            )}
            {portfolioValue !== undefined && portfolioValue > 0 && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                · {formatUSD(portfolioValue)} portfolio
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
