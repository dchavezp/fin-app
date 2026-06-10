import { db, deviceToken } from "@finn-app/db";
import { and, eq } from "drizzle-orm";

import type { RegisterTokenInput } from "./notifications.schema";

function generateId() {
  return `dt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function registerDeviceToken(
  userId: string,
  input: RegisterTokenInput,
) {
  const existing = await db
    .select()
    .from(deviceToken)
    .where(
      and(eq(deviceToken.userId, userId), eq(deviceToken.token, input.token)),
    )
    .limit(1);

  const existingRow = existing[0];

  if (existingRow) {
    const [token] = await db
      .update(deviceToken)
      .set({ platform: input.platform, updatedAt: new Date() })
      .where(eq(deviceToken.id, existingRow.id))
      .returning();

    return token;
  }

  const [token] = await db
    .insert(deviceToken)
    .values({
      id: generateId(),
      userId,
      token: input.token,
      platform: input.platform,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return token;
}

export async function unregisterDeviceToken(userId: string, token: string) {
  const [deleted] = await db
    .delete(deviceToken)
    .where(and(eq(deviceToken.userId, userId), eq(deviceToken.token, token)))
    .returning();

  return deleted ?? null;
}

export async function getDeviceTokensByUser(userId: string) {
  return db.select().from(deviceToken).where(eq(deviceToken.userId, userId));
}

export async function getDeviceTokensByUserId(userId: string) {
  return db.select().from(deviceToken).where(eq(deviceToken.userId, userId));
}
