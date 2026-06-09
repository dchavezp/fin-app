export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface CategoryCard {
  id: string;
  label: string;
  icon: string;
}

export interface MarketOverview {
  totalValue: number;
  change: number;
  changePercent: number;
  openPrice: number;
}

export interface ChartData {
  value: number;
  label: string;
  color: string;
}

export const MOCK_MARKET_OVERVIEW: MarketOverview = {
  totalValue: 11000000,
  change: -1265.0,
  changePercent: 8.24,
  openPrice: 111001265,
};

export const MOCK_WATCHLIST: WatchlistItem[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.42,
    change: 1.24,
    changePercent: 1.24,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 175.22,
    change: -0.82,
    changePercent: -0.82,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 824.15,
    change: 4.56,
    changePercent: 4.56,
  },
];

export const MOCK_CATEGORIES: CategoryCard[] = [
  { id: "mutual-funds", label: "Mutual Funds", icon: "account-balance-wallet" },
  { id: "private-equity", label: "Private Equity", icon: "work" },
  { id: "pre-ipo-angel", label: "Pre-IPO Angel", icon: "rocket-launch" },
];

export const MOCK_CHART_DATA: ChartData[] = [
  { value: 32, label: "Mutual Fund", color: "#CDF200" },
  { value: 68, label: "ESOP/Private Equity", color: "#7000FF" },
];

export function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `$${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `$${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatChange(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}
