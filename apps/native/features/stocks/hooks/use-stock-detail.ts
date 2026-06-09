import { useQuery } from "@tanstack/react-query";

import { fetchStockDetail } from "../utils/stock-api";

export function useStockDetail(symbol: string) {
  return useQuery({
    queryKey: ["stock", symbol],
    queryFn: ({ signal }) => fetchStockDetail(symbol, signal),
    enabled: symbol.length > 0,
    staleTime: 1000 * 30,
  });
}
