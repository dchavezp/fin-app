import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  useAlertsQuery,
  useCreateAlertMutation,
  useDeleteAlertMutation,
  useUpdateAlertMutation,
} from "./hooks/use-alerts-query";
import type { StockAlert, StockAlertInput } from "./types";

type StockAlertsContextValue = {
  alerts: StockAlert[];
  isLoading: boolean;
  createAlert: (input: StockAlertInput) => Promise<StockAlert | null>;
  deleteAlert: (alertId: string) => Promise<void>;
  getAlert: (alertId: string) => StockAlert | undefined;
  updateAlert: (
    alertId: string,
    input: StockAlertInput,
  ) => Promise<StockAlert | null>;
};

const StockAlertsContext = createContext<StockAlertsContextValue | null>(null);

function normalizeInput(input: StockAlertInput): StockAlertInput {
  return {
    symbol: input.symbol.trim().toUpperCase(),
    targetPrice: input.targetPrice,
    direction: input.direction,
    label: input.label?.trim() || undefined,
  };
}

export function StockAlertsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useAlertsQuery();
  const alerts = data ?? [];
  const createMutation = useCreateAlertMutation();
  const updateMutation = useUpdateAlertMutation();
  const deleteMutation = useDeleteAlertMutation();

  const getAlert = useCallback(
    (alertId: string) => alerts.find((alert) => alert.id === alertId),
    [alerts],
  );

  const createAlert = useCallback(
    async (input: StockAlertInput): Promise<StockAlert | null> => {
      const normalizedInput = normalizeInput(input);

      try {
        const result = await createMutation.mutateAsync(normalizedInput);

        return result;
      } catch {
        return null;
      }
    },
    [createMutation],
  );

  const updateAlert = useCallback(
    async (
      alertId: string,
      input: StockAlertInput,
    ): Promise<StockAlert | null> => {
      const normalizedInput = normalizeInput(input);

      try {
        const result = await updateMutation.mutateAsync({
          alertId,
          input: normalizedInput,
        });

        return result;
      } catch {
        return null;
      }
    },
    [updateMutation],
  );

  const deleteAlert = useCallback(
    async (alertId: string) => {
      try {
        await deleteMutation.mutateAsync(alertId);
      } catch {
        // Silently fail
      }
    },
    [deleteMutation],
  );

  const value = useMemo<StockAlertsContextValue>(
    () => ({
      alerts,
      isLoading,
      createAlert,
      deleteAlert,
      getAlert,
      updateAlert,
    }),
    [alerts, isLoading, createAlert, deleteAlert, getAlert, updateAlert],
  );

  return (
    <StockAlertsContext.Provider value={value}>
      {children}
    </StockAlertsContext.Provider>
  );
}

export function useStockAlerts() {
  const context = useContext(StockAlertsContext);

  if (!context) {
    throw new Error("useStockAlerts must be used within StockAlertsProvider");
  }

  return context;
}
