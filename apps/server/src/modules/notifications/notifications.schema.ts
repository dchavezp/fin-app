import { z } from "zod";

export const registerTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(["ios", "android"]),
});

export const unregisterTokenSchema = z.object({
  token: z.string().min(1),
});

export type RegisterTokenInput = z.infer<typeof registerTokenSchema>;
export type UnregisterTokenInput = z.infer<typeof unregisterTokenSchema>;
