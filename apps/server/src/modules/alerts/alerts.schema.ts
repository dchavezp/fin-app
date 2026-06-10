import { z } from "zod";

export const createAlertSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .max(10)
    .transform((val) => val.trim().toUpperCase()),
  targetPrice: z.number().positive(),
  direction: z.enum(["above", "below"]),
  label: z.string().max(100).optional(),
});

export const updateAlertSchema = createAlertSchema.partial();

export const alertParamsSchema = z.object({
  id: z.string().min(1),
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
