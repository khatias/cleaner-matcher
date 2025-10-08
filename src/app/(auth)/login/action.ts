"use server";
import { AuthState } from "@/types/Auth";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/lib/validation/auth";

import { extractFlatErrors, summarize } from "@/utils/zod/zod";
export async function loginAction(
  _: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email: (formData.get("email") ?? "").toString(),
    password: (formData.get("password") ?? "").toString(),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const errs = extractFlatErrors(parsed.error);
    return {
      ok: false,
      message: summarize(errs),
      fieldErrors: errs.fieldErrors,
      values: { email: raw.email },
    };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        ok: false,
        message: "Invalid credentials.",
        code: "invalid_credentials",
      };
    }
  } catch {
    return {
      ok: false,
      message: "Unable to sign in right now. Please try again.",
      code: "network",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
