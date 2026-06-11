import z from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

const authCredentialsSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

const signInSchema = authCredentialsSchema.extend({
  rememberMe: z.boolean(),
});

const signUpSchema = authCredentialsSchema.extend({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
});

export { signInSchema, signUpSchema };
