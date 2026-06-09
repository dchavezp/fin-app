import { useLocalSearchParams } from "expo-router";

import { StockDetailScreen } from "@/features/stocks/screens/stock-detail-screen";

export default function StockDetailRoute() {
  const params = useLocalSearchParams<{ symbol?: string }>();

  return <StockDetailScreen symbol={params.symbol ?? ""} />;
}
