import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const deviceToken = pgTable(
  "device_token",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    platform: text("platform", { enum: ["ios", "android"] }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("device_token_user_token_unique").on(table.userId, table.token),
    index("device_token_userId_idx").on(table.userId),
  ],
);

export const deviceTokenRelations = relations(deviceToken, ({ one }) => ({
  user: one(user, {
    fields: [deviceToken.userId],
    references: [user.id],
  }),
}));
