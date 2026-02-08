const STORAGE_KEY = "recent-wallets";
const MAX_RECENT = 10;

export interface RecentWallet {
  address: string;
  lastVisited: number; // unix ms
}

export function getRecentWallets(): RecentWallet[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // migrate from old string[] format
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      const migrated: RecentWallet[] = parsed.map((a: string) => ({ address: a, lastVisited: Date.now() }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveRecentWallet(address: string) {
  const recent = getRecentWallets().filter(
    (w) => w.address.toLowerCase() !== address.toLowerCase()
  );
  recent.unshift({ address, lastVisited: Date.now() });
  if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch { /* ignore */ }
}

export function removeRecentWallet(address: string) {
  const recent = getRecentWallets().filter(
    (w) => w.address.toLowerCase() !== address.toLowerCase()
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch { /* ignore */ }
}

export function timeAgo(ms: number): string {
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
