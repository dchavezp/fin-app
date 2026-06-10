import { useLocalSearchParams } from "expo-router";

import { StockAlertFormScreen } from "@/features/alerts/screens/stock-alert-form-screen";

export default function EditAlertRoute() {
  const params = useLocalSearchParams<{ alertId?: string }>();

  return <StockAlertFormScreen alertId={params.alertId ?? ""} mode="edit" />;
}
