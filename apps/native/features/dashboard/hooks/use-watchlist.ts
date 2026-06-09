import { useCallback, useState } from "react";

import { MOCK_WATCHLIST, type WatchlistItem } from "../constants";

export function useWatchlist() {
  const [data] = useState<WatchlistItem[]>(MOCK_WATCHLIST);
  const [isPending] = useState(false);

  const refetch = useCallback(async () => {
    /* TODO: fetch from Finnhub API */
  }, []);

  return { data, isPending, refetch };
}
