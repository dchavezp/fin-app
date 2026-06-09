import { z } from "zod";

export const stockFilterSchema = z.enum([
  "all",
  "gainers",
  "losers",
  "large-cap",
]);

export const stockListQuerySchema = z.object({
  filter: stockFilterSchema.default("all"),
  limit: z.coerce.number().int().min(1).max(20).default(12),
});

export const stockSearchQuerySchema = z.object({
  q: z.string().trim().min(1),
  filter: stockFilterSchema.default("all"),
  limit: z.coerce.number().int().min(1).max(20).default(12),
});

export const stockDetailParamsSchema = z.object({
  symbol: z.string().trim().min(1),
});

export const stockHistoryRangeSchema = z.enum(["1D", "1W", "1M", "1Y"]);

export const stockHistoryQuerySchema = z.object({
  range: stockHistoryRangeSchema.default("1D"),
});

export type StockFilter = z.infer<typeof stockFilterSchema>;
export type StockListQuery = z.infer<typeof stockListQuerySchema>;
export type StockSearchQuery = z.infer<typeof stockSearchQuerySchema>;
export type StockDetailParams = z.infer<typeof stockDetailParamsSchema>;
export type StockHistoryRange = z.infer<typeof stockHistoryRangeSchema>;
export type StockHistoryQuery = z.infer<typeof stockHistoryQuerySchema>;
