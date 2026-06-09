import { useCallback, useState } from "react";

import { type ChartData, MOCK_CHART_DATA } from "../constants";

export function useChartData() {
  const [data] = useState<ChartData[]>(MOCK_CHART_DATA);
  const [isPending] = useState(false);

  const refetch = useCallback(async () => {
    /* TODO: fetch from Finnhub API */
  }, []);

  return { data, isPending, refetch };
}
