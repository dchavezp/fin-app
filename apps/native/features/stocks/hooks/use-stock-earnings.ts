import { useQuery } from "@tanstack/react-query";

import { fetchStockEarnings } from "../utils/stock-api";

export function useStockEarnings(symbol: string) {
  return useQuery({
    queryKey: ["stock", symbol, "earnings"],
    queryFn: ({ signal }) => fetchStockEarnings(symbol, signal),
    enabled: symbol.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
