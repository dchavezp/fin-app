import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { StockFilter } from "../types";
import { fetchStocks } from "../utils/stock-api";

export function useStockSearch() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StockFilter>("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const trimmedQuery = query.trim();
  const isQueryTooShort = trimmedQuery.length > 0 && trimmedQuery.length < 2;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const stocksQuery = useQuery({
    queryKey: ["stocks", debouncedQuery, filter],
    queryFn: ({ signal }) => fetchStocks(filter, debouncedQuery, signal),
    enabled: debouncedQuery.length === 0 || debouncedQuery.length >= 2,
    staleTime: 1000 * 30,
  });

  return {
    ...stocksQuery,
    filter,
    isQueryTooShort,
    query,
    setFilter,
    setQuery,
    stocks: isQueryTooShort ? [] : (stocksQuery.data ?? []),
  };
}
