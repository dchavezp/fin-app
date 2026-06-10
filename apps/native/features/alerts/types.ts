export type StockAlertDirection = "above" | "below";

export type StockAlert = {
  id: string;
  userId: string;
  symbol: string;
  targetPrice: number;
  direction: StockAlertDirection;
  label?: string;
  triggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StockAlertInput = {
  symbol: string;
  targetPrice: number;
  direction: StockAlertDirection;
  label?: string;
};
