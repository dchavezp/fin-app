import { useQuery } from "@tanstack/react-query";

import { fetchWatchlist } from "@/features/stocks/utils/stock-api";

export function useWatchlist() {
  const query = useQuery({
    queryKey: ["dashboard", "watchlist"],
    queryFn: ({ signal }) => fetchWatchlist(signal),
    staleTime: 1000 * 30,
  });

  return {
    ...query,
    data: query.data ?? [],
  };
}
