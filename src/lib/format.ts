export function formatUSD(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${value < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${value < 0 ? "-" : ""}$${(abs / 1_000).toFixed(2)}K`;
  return `${value < 0 ? "-" : ""}$${abs.toFixed(2)}`;
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function pnlColor(value: number): string {
  if (value > 0) return "text-[var(--color-profit)]";
  if (value < 0) return "text-[var(--color-loss)]";
  return "text-muted-foreground";
}

export function pnlSign(value: number): string {
  if (value > 0) return "+";
  return "";
}

export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}
