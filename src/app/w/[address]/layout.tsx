import type { Metadata } from "next";

function formatAddr(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}): Promise<Metadata> {
  const { address } = await params;
  const short = formatAddr(address);

  return {
    title: `${short} — Wallet Profile`,
    description: `View Polymarket positions, P&L, trading style, and performance for wallet ${short}.`,
    openGraph: {
      title: `${short} — Polywallets`,
      description: `Polymarket wallet profile for ${short}. Positions, P&L, win rate, and trading analytics.`,
    },
    twitter: {
      card: "summary",
      title: `${short} — Polywallets`,
      description: `Polymarket wallet profile for ${short}. Positions, P&L, win rate, and trading analytics.`,
    },
  };
}

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
