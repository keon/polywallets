"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { formatAddress } from "@/lib/format";
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

export function WalletHeader({ address, tradingStyles, isOwner, firstTradeAt, lastTradeAt }: WalletHeaderProps) {
  const [copied, setCopied] = useState(false);
  const badges = getStyleBadges(tradingStyles);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    track("copy-address", { address });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold font-mono" title={address}>{formatAddress(address)}</h1>
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={copyAddress}>
            {copied ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </Button>
          {isOwner && <Badge variant="secondary">Your Wallet</Badge>}
        </div>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {badges.map((style) => (
            <Badge key={style} variant="outline" className="capitalize text-xs">
              {style.toLowerCase()}
            </Badge>
          ))}
        </div>
        {firstTradeAt && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Trading since {new Date(firstTradeAt * 1000).toLocaleDateString()}
            {lastTradeAt && ` · Last trade ${new Date(lastTradeAt * 1000).toLocaleDateString()}`}
          </p>
        )}
      </div>
    </div>
  );
}
