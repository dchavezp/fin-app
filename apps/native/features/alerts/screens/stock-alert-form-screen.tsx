import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Container } from "@/components/container";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { useStockAlerts } from "../stock-alerts-context";
import type { StockAlertDirection } from "../types";

type StockAlertFormScreenProps = {
  alertId?: string;
  mode: "create" | "edit";
};

const DEFAULT_DIRECTION: StockAlertDirection = "above";

export function StockAlertFormScreen({
  alertId,
  mode,
}: StockAlertFormScreenProps) {
  const router = useRouter();
  const { createAlert, deleteAlert, getAlert, updateAlert } = useStockAlerts();
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const existingAlert =
    mode === "edit" && alertId ? getAlert(alertId) : undefined;

  const [symbol, setSymbol] = useState(existingAlert?.symbol ?? "");
  const [targetPrice, setTargetPrice] = useState(
    existingAlert ? String(existingAlert.targetPrice) : "",
  );
  const [direction, setDirection] = useState<StockAlertDirection>(
    existingAlert?.direction ?? DEFAULT_DIRECTION,
  );
  const [label, setLabel] = useState(existingAlert?.label ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!existingAlert) {
      return;
    }

    setSymbol(existingAlert.symbol);
    setTargetPrice(String(existingAlert.targetPrice));
    setDirection(existingAlert.direction);
    setLabel(existingAlert.label ?? "");
  }, [existingAlert]);

  function validate() {
    const normalizedSymbol = symbol.trim().toUpperCase();
    const normalizedTargetPrice = targetPrice.trim();
    const parsedTargetPrice = Number(normalizedTargetPrice);

    if (!normalizedSymbol) {
      return "Enter a stock symbol.";
    }

    if (
      !/^\d*\.?\d+$/.test(normalizedTargetPrice) ||
      !Number.isFinite(parsedTargetPrice) ||
      parsedTargetPrice <= 0
    ) {
      return "Enter a valid target price.";
    }

    return null;
  }

  function handleSave() {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      symbol: symbol.trim().toUpperCase(),
      targetPrice: Number(targetPrice.trim()),
      direction,
      label: label.trim() || undefined,
    };

    if (mode === "edit" && alertId) {
      updateAlert(alertId, payload);
      router.replace("/alerts");
      return;
    }

    createAlert(payload);
    router.replace("/alerts");
  }

  function handleDelete() {
    if (!alertId) {
      return;
    }

    Alert.alert(
      "Delete alert?",
      `Remove ${existingAlert?.symbol ?? "this alert"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteAlert(alertId);
            router.replace("/alerts");
          },
        },
      ],
    );
  }

  if (mode === "edit" && !existingAlert) {
    return (
      <Container includeBottomInset={false}>
        <View style={[styles.screen, { backgroundColor: theme.background }]}>
          <View
            style={[
              styles.header,
              {
                backgroundColor: theme.background,
                borderBottomColor: theme.surfaceVariant,
              },
            ]}
          >
            <Pressable
              onPress={() => router.replace("/alerts")}
              style={styles.headerAction}
            >
              <Ionicons name="arrow-back" size={22} color={theme.primary} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Alert not found
            </Text>
            <View style={styles.headerAction} />
          </View>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.cardBorder },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              This alert no longer exists.
            </Text>
            <Text style={[styles.cardBody, { color: theme.textTertiary }]}>
              Go back to the alerts list and create a new one.
            </Text>
            <Pressable
              onPress={() => router.replace("/alerts")}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text
                style={[styles.primaryButtonText, { color: theme.surface }]}
              >
                Back to alerts
              </Text>
            </Pressable>
          </View>
        </View>
      </Container>
    );
  }

  return (
    <Container includeBottomInset={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="automatic"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={[styles.scrollView, { backgroundColor: theme.background }]}
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: theme.background,
                borderBottomColor: theme.surfaceVariant,
              },
            ]}
          >
            <Pressable
              onPress={() => router.replace("/alerts")}
              style={styles.headerAction}
            >
              <Ionicons name="arrow-back" size={22} color={theme.primary} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {mode === "edit" ? "Edit alert" : "New alert"}
            </Text>
            <View style={styles.headerAction} />
          </View>

          <View style={styles.formBody}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Alert details
            </Text>
            <Text style={[styles.cardBody, { color: theme.textTertiary }]}>
              Save a symbol, target price, and direction for the alert.
            </Text>

            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {error}
              </Text>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Symbol</Text>
              <TextInput
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="AAPL"
                placeholderTextColor={theme.textTertiary}
                onChangeText={(value) => {
                  setError(null);
                  setSymbol(value.toUpperCase());
                }}
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.text },
                ]}
                value={symbol}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Target price
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                placeholder="185.00"
                placeholderTextColor={theme.textTertiary}
                onChangeText={(value) => {
                  setError(null);
                  setTargetPrice(value);
                }}
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.text },
                ]}
                value={targetPrice}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Notify me when price is
              </Text>
              <View style={styles.segmentRow}>
                {(
                  [
                    {
                      icon: "trending-up" as const,
                      label: "Above",
                      value: "above" as const,
                    },
                    {
                      icon: "trending-down" as const,
                      label: "Below",
                      value: "below" as const,
                    },
                  ] as const
                ).map((option) => {
                  const active = direction === option.value;
                  const optionColor = active ? theme.surface : theme.text;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        setError(null);
                        setDirection(option.value);
                      }}
                      style={[
                        styles.segmentButton,
                        {
                          backgroundColor: active
                            ? theme.primary
                            : theme.surfaceContainerLow,
                        },
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={16}
                        color={optionColor}
                      />
                      <Text
                        style={[styles.segmentText, { color: optionColor }]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Label</Text>
              <TextInput
                placeholder="Optional note"
                placeholderTextColor={theme.textTertiary}
                onChangeText={(value) => {
                  setError(null);
                  setLabel(value);
                }}
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.text },
                ]}
                value={label}
              />
            </View>

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[styles.primaryButtonText, { color: theme.surface }]}
              >
                {mode === "edit" ? "Save changes" : "Create alert"}
              </Text>
            </Pressable>

            {mode === "edit" ? (
              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [
                  styles.dangerButton,
                  { borderColor: theme.error, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={[styles.dangerButtonText, { color: theme.error }]}>
                  Delete alert
                </Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  formBody: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardBody: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
  },
  errorText: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "600",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "600",
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 10,
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 12,
  },
  segmentText: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
    textAlign: "center",
  },
  primaryButton: {
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
  },
  dangerButton: {
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  dangerButtonText: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
  },
});
