"use server";

import { createClient } from "@/utils/supabase/server";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { extractFlatErrors, summarize } from "@/utils/zod/zod";
import {
  mapSupabaseErrorToCode,
  userMessageFor,
} from "@/utils/auth/auth-errors";
import type { AuthState } from "@/types/Auth";

export async function resetAction(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    code: String(formData.get("code") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirm_password: String(formData.get("confirm_password") ?? ""),
  };

  const parsed = resetPasswordSchema.safeParse({
    password: raw.password,
    confirm_password: raw.confirm_password,
  });
  if (!parsed.success) {
    const errs = extractFlatErrors(parsed.error);
    return {
      ok: false,
      message: summarize(errs),
      fieldErrors: errs.fieldErrors,
    };
  }

  const supabase = await createClient();

  if (raw.code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      raw.code
    );
    if (exchangeError) {
      return {
        ok: false,
        message: userMessageFor("reset", "reset_link_invalid_or_expired"),
      };
    }
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    if (error) {
      const code = mapSupabaseErrorToCode(
        (error as { status?: number; message: string }).status,
        error.message
      );
      return { ok: false, message: userMessageFor("reset", code) };
    }
  } catch {
    return { ok: false, message: userMessageFor("reset", "network") };
  }

  return { ok: true, message: "Your password has been updated." };
}
