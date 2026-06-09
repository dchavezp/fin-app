export type StockFilter = "all" | "gainers" | "losers" | "large-cap";

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
  initials: string;
}

export interface StockListResponse {
  data: StockListItem[];
}

export interface StockDetailResponse {
  data: StockDetail;
}
