"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { signUpSchema } from "@/lib/validation/auth";
import { headers } from "next/headers";
import { extractFlatErrors, summarize } from "@/utils/zod/zod";
import {
  mapSupabaseErrorToCode,
  userMessageFor,
} from "@/utils/auth/auth-errors";
import { AuthState } from "@/types/Auth";

async function getBaseUrl() {
  const h = await headers();
  const origin = h.get("origin");
  return process.env.NEXT_PUBLIC_SITE_URL || origin;
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email: (formData.get("email") ?? "").toString(),
    full_name: (formData.get("full_name") ?? "").toString(),
    password: (formData.get("password") ?? "").toString(),
    confirm_password: (formData.get("confirm_password") ?? "").toString(),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const errs = extractFlatErrors(parsed.error);
    return {
      ok: false,
      message: summarize(errs),
      fieldErrors: errs.fieldErrors,
      values: { email: raw.email, full_name: raw.full_name },
    };
  }

  const { email, full_name, password } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getBaseUrl()}`,
        data: { full_name },
      },
    });

    if (error) {
      const code = mapSupabaseErrorToCode(
        (error as { status?: number; message: string }).status,
        error.message
      );
      return {
        ok: false,
        code,
        message: userMessageFor("signup", code),
        values: { email: raw.email, full_name: raw.full_name },
      };
    }
  } catch {
    return {
      ok: false,
      code: "network",
      message: userMessageFor("signup", "network"),
      values: { email: raw.email, full_name: raw.full_name },
    };
  }

  revalidatePath("/", "layout");
  return {
    ok: true,
    message:
      "Check your email for a verification link. If you don't receive one, you may already be registered—try resetting your password.",
  };
}
