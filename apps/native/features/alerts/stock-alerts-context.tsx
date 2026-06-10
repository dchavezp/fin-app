import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import type { StockAlert, StockAlertInput } from "./types";

type StockAlertsContextValue = {
  alerts: StockAlert[];
  createAlert: (input: StockAlertInput) => StockAlert;
  deleteAlert: (alertId: string) => void;
  getAlert: (alertId: string) => StockAlert | undefined;
  updateAlert: (
    alertId: string,
    input: StockAlertInput,
  ) => StockAlert | undefined;
};

const StockAlertsContext = createContext<StockAlertsContextValue | null>(null);

function createAlertId() {
  return `alert_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeInput(input: StockAlertInput): StockAlertInput {
  return {
    symbol: input.symbol.trim().toUpperCase(),
    targetPrice: input.targetPrice,
    direction: input.direction,
    label: input.label?.trim() || undefined,
  };
}

export function StockAlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  const value = useMemo<StockAlertsContextValue>(
    () => ({
      alerts,
      createAlert: (input) => {
        const now = new Date().toISOString();
        const normalizedInput = normalizeInput(input);
        const nextAlert: StockAlert = {
          id: createAlertId(),
          createdAt: now,
          updatedAt: now,
          ...normalizedInput,
        };

        setAlerts((current) => [nextAlert, ...current]);

        return nextAlert;
      },
      deleteAlert: (alertId) => {
        setAlerts((current) => current.filter((alert) => alert.id !== alertId));
      },
      getAlert: (alertId) => alerts.find((alert) => alert.id === alertId),
      updateAlert: (alertId, input) => {
        const normalizedInput = normalizeInput(input);
        let updatedAlert: StockAlert | undefined;

        setAlerts((current) =>
          current.map((alert) => {
            if (alert.id !== alertId) {
              return alert;
            }

            updatedAlert = {
              ...alert,
              ...normalizedInput,
              updatedAt: new Date().toISOString(),
            };

            return updatedAlert;
          }),
        );

        return updatedAlert;
      },
    }),
    [alerts],
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
