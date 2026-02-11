const ERROR_MESSAGES: Record<number, string> = {
  429: "Rate limit reached. Please wait a moment and try again.",
  404: "Wallet not found. Please check the address and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "The data service is temporarily unavailable. Please try again shortly.",
  503: "The data service is temporarily unavailable. Please try again shortly.",
};

async function fetchAPI<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const url = new URL(path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url.toString());
    if (res.ok) return res.json();

    if (res.status === 429 && attempt < 2) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      lastError = new Error(ERROR_MESSAGES[429]);
      continue;
    }

    const friendly = ERROR_MESSAGES[res.status];
    if (friendly) throw new Error(friendly);

    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}). ${text ? text : "Please try again."}`);
  }

  throw lastError ?? new Error("Request failed. Please try again.");
}

// ---- Types (matching actual API response shapes) ----

export interface WindowMetrics {
  realized_pnl: number;
  volume: number;
  roi: number;
  trades: number;
  wins: number;
  losses: number;
  win_rate: number;
  profit_factor: number;
  positions_closed: number;
  avg_buy_price: number | null;
  avg_sell_price: number | null;
  fees_paid: number;
  fees_refunded: number;
}

export interface AllTimeMetrics extends WindowMetrics {
  avg_hold_time_seconds: number;
  wallet_age_days: number;
  total_positions: number;
  active_positions: number;
  max_win_streak: number;
  max_loss_streak: number;
  best_position_realized_pnl: number;
  worst_position_realized_pnl: number;
}

export interface TradingStyles {
  is_whale: boolean;
  is_market_maker: boolean;
  is_active_trader: boolean;
  is_buy_and_hold: boolean;
  is_degen: boolean;
  is_high_conviction: boolean;
  is_contrarian: boolean;
  is_value_hunter: boolean;
  primary_style: string;
}

export interface WalletProfile {
  user: string;
  metrics: {
    one_day: WindowMetrics;
    seven_day: WindowMetrics;
    thirty_day: WindowMetrics;
    all_time: AllTimeMetrics;
  };
  trading_styles: TradingStyles;
  entry_edge: number | null;
  first_trade_at: number | null;
  last_trade_at: number | null;
  computed_at: number | null;
}

export interface Position {
  market: {
    condition_id: string;
    market_slug: string;
    title: string;
    side: string;
    side_label: string;
    token_id: string;
    status: string;
  };
  position: {
    shares: number;
    avg_entry_price: number;
    total_cost_usd: number;
  };
  current: {
    price: number;
    value_usd: number;
  };
  pnl: {
    unrealized_usd: number;
    unrealized_pct: number;
    realized_usd: number;
  };
}

export interface PositionsResponse {
  wallet_address: string;
  positions: Position[];
  summary: {
    total_positions: number;
    open_positions: number;
    total_value_usd: number;
    total_cost_usd: number;
    total_unrealized_pnl_usd: number;
    total_realized_pnl_usd: number;
    win_rate: number;
    winning_positions: number;
    losing_positions: number;
    fees_paid: number;
  };
  pagination: {
    limit: number;
    count: number;
    pagination_key: string | null;
    has_more: boolean;
  };
}

export interface MarketEntry {
  condition_id: string;
  title: string;
  market_slug: string;
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
    positions_closed: number;
    avg_buy_price: number | null;
    avg_sell_price: number | null;
    fees_paid: number;
    fees_refunded?: number;
  };
  entry_edge: number | null;
  first_trade_at: number | null;
  last_trade_at: number | null;
}

export interface WalletMarketsResponse {
  user: string;
  window: string;
  markets: MarketEntry[];
  pagination: {
    limit: number;
    count: number;
    pagination_key: string | null;
    has_more: boolean;
  };
}

export interface SimilarWalletEntry {
  rank: number;
  user: string;
  markets_overlap: number;
  overlap_pct: number;
  total_markets: number;
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
}

export interface SimilarWalletsResponse {
  target_wallet: string;
  target_market_count: number;
  window: string;
  similar_wallets: SimilarWalletEntry[];
  pagination: {
    limit: number;
    count: number;
    pagination_key: string | null;
    has_more: boolean;
  };
}

export interface PnLDataPoint {
  timestamp: number;
  pnl_to_date: number;
}

export interface WalletPnLResponse {
  granularity: string;
  start_time: number;
  end_time: number;
  wallet_address: string;
  realized_pnl: number | null;
  unrealized_pnl: number | null;
  fees_paid: number | null;
  fees_refunded: number | null;
  total_pnl: number | null;
  pnl_over_time: PnLDataPoint[];
}

// ---- API Functions (via internal Next.js API routes) ----

export function getWalletProfile(wallet: string) {
  return fetchAPI<WalletProfile>(`/api/wallet/${wallet}/profile`);
}

export function getWalletPositions(
  wallet: string,
  opts?: {
    include_closed?: boolean;
    sort_by?: string;
    order?: string;
    limit?: number;
    pagination_key?: string;
  }
) {
  return fetchAPI<PositionsResponse>(`/api/wallet/${wallet}/positions`, opts as Record<string, string | number | boolean | undefined>);
}

export function getWalletMarkets(
  wallet: string,
  opts?: {
    window?: string;
    sort_by?: string;
    order?: string;
    limit?: number;
    pagination_key?: string;
  }
) {
  return fetchAPI<WalletMarketsResponse>(`/api/wallet/${wallet}/markets`, opts as Record<string, string | number | boolean | undefined>);
}

/**
 * Fetch ALL market condition_ids for a wallet+window by paginating through the markets endpoint.
 * Returns a Set of condition_ids representing every market traded in the given window.
 */
export async function getAllWalletMarketIds(
  wallet: string,
  window: string
): Promise<Set<string>> {
  const ids = new Set<string>();
  let paginationKey: string | undefined;

  do {
    const res = await getWalletMarkets(wallet, {
      window,
      limit: 100,
      pagination_key: paginationKey,
    });
    for (const m of res.markets) {
      ids.add(m.condition_id);
    }
    paginationKey = res.pagination.pagination_key ?? undefined;
  } while (paginationKey);

  return ids;
}

export function getWalletPnL(
  wallet: string,
  opts?: {
    granularity?: string;
    start_time?: number;
    end_time?: number;
  }
) {
  return fetchAPI<WalletPnLResponse>(`/api/wallet/${wallet}/pnl`, {
    granularity: opts?.granularity ?? "day",
    ...opts,
  } as Record<string, string | number | boolean | undefined>);
}

export function getSimilarWallets(
  wallet: string,
  opts?: {
    window?: string;
    min_overlap_pct?: number;
    limit?: number;
  }
) {
  return fetchAPI<SimilarWalletsResponse>(`/api/wallet/${wallet}/similar`, opts as Record<string, string | number | boolean | undefined>);
}
