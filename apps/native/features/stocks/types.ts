export type StockFilter = "all" | "gainers" | "losers" | "large-cap";
export type StockChartRange = "1D" | "1W" | "1M" | "1Y";

export interface StockListItem {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number | null;
  currency: string | null;
  initials: string;
}

export interface StockDetail {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap: number | null;
  currency: string | null;
  industry: string | null;
  country: string | null;
  website: string | null;
  ipo: string | null;
  logoUrl: string | null;
  shareOutstanding: number | null;
  initials: string;
}

export interface StockHistoryPoint {
  close: number;
  time: number;
}

export interface StockHistory {
  points: StockHistoryPoint[];
  range: StockChartRange;
  resolution: string;
  symbol: string;
}

export interface StockListResponse {
  data: StockListItem[];
}

export interface StockDetailResponse {
  data: StockDetail;
}

export interface StockHistoryResponse {
  data: StockHistory;
}

export interface EarningSurprise {
  actual: number;
  estimate: number;
  period: string;
  quarter: number;
  surprise: number;
  surprisePercent: number;
  symbol: string;
  year: number;
}

export interface EarningsResponse {
  data: EarningSurprise[];
}
