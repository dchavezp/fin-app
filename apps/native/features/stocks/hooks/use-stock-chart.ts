import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { STOCK_CHART_RANGE_OPTIONS } from "../constants";
import type { StockChartRange, StockHistoryPoint } from "../types";
import { fetchStockHistory } from "../utils/stock-api";

function formatChartLabel(point: StockHistoryPoint, range: StockChartRange) {
  const date = new Date(point.time * 1000);

  switch (range) {
    case "1D":
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });
    case "1W":
      return date.toLocaleDateString("en-US", {
        weekday: "short",
      });
    case "1M":
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    default:
      return date.toLocaleDateString("en-US", {
        month: "short",
      });
  }
}

function shouldShowLabel(index: number, total: number) {
  if (total <= 4) {
    return true;
  }

  const count = total <= 10 ? 4 : 3;
  const stride = (total - 1) / (count - 1);

  for (let i = 0; i < count; i += 1) {
    if (index === Math.round(i * stride)) {
      return true;
    }
  }

  return false;
}

export function useStockChart(symbol: string) {
  const [range, setRange] = useState<StockChartRange>("1D");

  const query = useQuery({
    queryKey: ["stock", symbol, "history", range],
    queryFn: ({ signal }) => fetchStockHistory(symbol, range, signal),
    enabled: symbol.length > 0,
    staleTime: 1000 * 60,
  });

  const chartData = useMemo(() => {
    const points = query.data?.points ?? [];

    return points.map((point) => ({
      dataPointText: point.close.toFixed(2),
      label: "",
      value: point.close,
    }));
  }, [query.data?.points]);

  const xLabels = useMemo(() => {
    const points = query.data?.points ?? [];

    return points.reduce<Array<{ id: string; label: string }>>(
      (acc, point, index) => {
        if (shouldShowLabel(index, points.length)) {
          acc.push({
            id: `${point.time}`,
            label: formatChartLabel(point, range),
          });
        }

        return acc;
      },
      [],
    );
  }, [query.data?.points, range]);

  const summary = useMemo(() => {
    const points = query.data?.points ?? [];

    if (points.length === 0) {
      return null;
    }

    const start = points[0]?.close ?? 0;
    const end = points[points.length - 1]?.close ?? 0;
    const change = end - start;
    const changePercent = start === 0 ? 0 : (change / start) * 100;

    return {
      change,
      changePercent,
      high: Math.max(...points.map((point) => point.close)),
      low: Math.min(...points.map((point) => point.close)),
    };
  }, [query.data?.points]);

  return {
    chartData,
    error: query.error,
    isEmpty: chartData.length === 0,
    isError: query.isError,
    isPending: query.isPending,
    range,
    rangeOptions: STOCK_CHART_RANGE_OPTIONS,
    setRange,
    summary,
    xLabels,
  };
}
