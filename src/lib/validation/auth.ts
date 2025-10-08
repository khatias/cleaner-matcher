import { z } from "zod";

const PASSWORD_MAX = 72;

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .toLowerCase()
  .max(254, "Email is too long")
  .pipe(z.email({ message: "Invalid email address" }));

const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters long")
  .max(100, "Full name must be at most 100 characters long")
  .regex(
    /^[\p{L}\p{M}\s'’\-–]+$/u,
    "Full name can only contain letters, spaces, apostrophes, and hyphens"
  );

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(PASSWORD_MAX, `Password must be at most ${PASSWORD_MAX} characters long`)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character")
  .refine(
    (v) => !/^\s|\s$/.test(v),
    "Password cannot start or end with spaces"
  );

export const signUpSchema = z
  .object({
    email: emailSchema,
    full_name: fullNameSchema,
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
