import type { StockFilter } from "./types";

export const STOCK_FILTER_OPTIONS: Array<{
  label: string;
  value: StockFilter;
}> = [
  { label: "All", value: "all" },
  { label: "Gainers", value: "gainers" },
  { label: "Losers", value: "losers" },
  { label: "Large Cap", value: "large-cap" },
];
