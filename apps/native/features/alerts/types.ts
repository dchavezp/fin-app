export type StockAlertDirection = "above" | "below";

export type StockAlert = {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: StockAlertDirection;
  label?: string;
  createdAt: string;
  updatedAt: string;
};

export type StockAlertInput = {
  symbol: string;
  targetPrice: number;
  direction: StockAlertDirection;
  label?: string;
};
