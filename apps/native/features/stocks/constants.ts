import type { StockChartRange, StockFilter } from "./types";

export const STOCK_FILTER_OPTIONS: Array<{
  label: string;
  value: StockFilter;
}> = [
  { label: "All", value: "all" },
  { label: "Gainers", value: "gainers" },
  { label: "Losers", value: "losers" },
  { label: "Large Cap", value: "large-cap" },
];

export const STOCK_CHART_RANGE_OPTIONS: Array<{
  label: string;
  value: StockChartRange;
}> = [
  { label: "1D", value: "1D" },
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
  { label: "1Y", value: "1Y" },
];
