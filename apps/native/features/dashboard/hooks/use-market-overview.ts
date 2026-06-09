import { useCallback, useState } from "react";

import { type MarketOverview, MOCK_MARKET_OVERVIEW } from "../constants";

export function useMarketOverview() {
  const [data] = useState<MarketOverview>(MOCK_MARKET_OVERVIEW);
  const [isPending] = useState(false);

  const refetch = useCallback(async () => {
    /* TODO: fetch from Finnhub API */
  }, []);

  return { data, isPending, refetch };
}
