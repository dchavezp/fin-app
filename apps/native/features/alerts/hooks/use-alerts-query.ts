import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StockAlertInput } from "../types";
import {
  createAlert,
  deleteAlert,
  fetchAlerts,
  updateAlert,
} from "../utils/alert-api";

const ALERTS_QUERY_KEY = ["alerts"];

export function useAlertsQuery() {
  return useQuery({
    queryKey: ALERTS_QUERY_KEY,
    queryFn: ({ signal }) => fetchAlerts(signal),
    staleTime: 1000 * 30,
  });
}

export function useCreateAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StockAlertInput) => createAlert(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    },
  });
}

export function useUpdateAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertId,
      input,
    }: {
      alertId: string;
      input: Partial<StockAlertInput>;
    }) => updateAlert(alertId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    },
  });
}

export function useDeleteAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => deleteAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    },
  });
}
