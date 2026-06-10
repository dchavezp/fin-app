import { relations } from "drizzle-orm";
import { index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const priceAlert = pgTable(
  "price_alert",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    symbol: text("symbol").notNull(),
    targetPrice: real("target_price").notNull(),
    direction: text("direction", { enum: ["above", "below"] }).notNull(),
    label: text("label"),
    triggeredAt: timestamp("triggered_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("price_alert_userId_idx").on(table.userId),
    index("price_alert_symbol_idx").on(table.symbol),
  ],
);

export const priceAlertRelations = relations(priceAlert, ({ one }) => ({
  user: one(user, {
    fields: [priceAlert.userId],
    references: [user.id],
  }),
}));
