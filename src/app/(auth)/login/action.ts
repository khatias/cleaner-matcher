"use server";
import { AuthState } from "@/types/Auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/lib/validation/auth";
import { mapSupabaseErrorToCode, userMessageFor } from "@/utils/auth/auth-errors";
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
      const { status, message } = error as { status: number; message: string };
      const code = mapSupabaseErrorToCode(status, message);
      return { ok: false, code, message: userMessageFor("login", code), values: { email: raw.email } };
    }
  } catch {
    return { ok: false, code: "network", message: userMessageFor("login", "network"), values: { email: raw.email } };

  }

  revalidatePath("/", "layout");
  redirect("/");
}
