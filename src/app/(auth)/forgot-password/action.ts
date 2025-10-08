"use server";

import { createClient } from "@/utils/supabase/server";
import { emailSchema } from "@/lib/validation/auth";
import {
  mapSupabaseErrorToCode,
  userMessageFor,
} from "@/utils/auth/auth-errors";

import type { AuthState } from "@/types/Auth";

type ForgotKeys = "email";
type FieldErrors = Partial<Record<ForgotKeys, string[]>>;

export async function forgotAction(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");

  const parsed = emailSchema.safeParse(email);

  if (!parsed.success) {
    const errs: FieldErrors = { email: ["Enter a valid email address."] };
    return {
      ok: false,
      fieldErrors: errs,
      values: { email },
      message: "Please fix the errors and try again.",
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }`,
    });

    const code = error
      ? mapSupabaseErrorToCode(
          (error as { status?: number; message: string }).status,
          error.message
        )
      : "sent";

    return {
      ok: true,
      values: { email: parsed.data },
      message: userMessageFor("forgot", code),
    };
  } catch {
    return {
      ok: true,
      values: { email },
      message: userMessageFor("forgot", "unknown"),
    };
  }
}
