import { db, priceAlert } from "@finn-app/db";
import { and, desc, eq, isNull } from "drizzle-orm";

import type { CreateAlertInput, UpdateAlertInput } from "./alerts.schema";

function generateId() {
  return `alert_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function createAlert(userId: string, input: CreateAlertInput) {
  const now = new Date();
  const [alert] = await db
    .insert(priceAlert)
    .values({
      id: generateId(),
      userId,
      symbol: input.symbol,
      targetPrice: input.targetPrice,
      direction: input.direction,
      label: input.label ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return alert;
}

export async function getAlertsByUser(userId: string) {
  return db
    .select()
    .from(priceAlert)
    .where(eq(priceAlert.userId, userId))
    .orderBy(desc(priceAlert.createdAt));
}

export async function getAlertById(alertId: string, userId: string) {
  const [alert] = await db
    .select()
    .from(priceAlert)
    .where(and(eq(priceAlert.id, alertId), eq(priceAlert.userId, userId)));

  return alert ?? null;
}

export async function updateAlert(
  alertId: string,
  userId: string,
  input: UpdateAlertInput,
) {
  const updateData: Partial<typeof priceAlert.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.symbol !== undefined) {
    updateData.symbol = input.symbol;
  }

  if (input.targetPrice !== undefined) {
    updateData.targetPrice = input.targetPrice;
  }

  if (input.direction !== undefined) {
    updateData.direction = input.direction;
  }

  if (input.label !== undefined) {
    updateData.label = input.label ?? null;
  }

  const [alert] = await db
    .update(priceAlert)
    .set(updateData)
    .where(and(eq(priceAlert.id, alertId), eq(priceAlert.userId, userId)))
    .returning();

  return alert ?? null;
}

export async function deleteAlert(alertId: string, userId: string) {
  const [alert] = await db
    .delete(priceAlert)
    .where(and(eq(priceAlert.id, alertId), eq(priceAlert.userId, userId)))
    .returning();

  return alert ?? null;
}

export async function getUntriggeredAlertsBySymbol(symbol: string) {
  return db
    .select()
    .from(priceAlert)
    .where(and(eq(priceAlert.symbol, symbol), isNull(priceAlert.triggeredAt)));
}

export async function markAlertTriggered(alertId: string) {
  await db
    .update(priceAlert)
    .set({ triggeredAt: new Date() })
    .where(eq(priceAlert.id, alertId));
}
