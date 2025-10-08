
'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { signUpSchema } from "@/lib/validation/auth";
export type AuthState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Partial<{ email: string; full_name: string }>;
};

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  // (real validation later)
  if (!email || !password) return { ok: false, message: "Email and password are required." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });


  if (error) return { ok: false, message: "Invalid credentials." };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signupAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Gather values
  const raw = {
    email: (formData.get("email") ?? "").toString(),
    full_name: (formData.get("full_name") ?? "").toString(),
    password: (formData.get("password") ?? "").toString(),
    confirm_password: (formData.get("confirm_password") ?? "").toString(),
  };

  // Zod validation
  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();
    // Don’t echo passwords back; only keep safe fields
    return {
      ok: false,
      message: formErrors?.[0] ?? "Please fix the errors and try again.",
      fieldErrors,
      values: { email: raw.email, full_name: raw.full_name },
    };
  }

  // If valid, create the user (example with Supabase)
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm`,
      data: { full_name: parsed.data.full_name },
    },
  });

  if (error) {
    // Map provider error to a safe message
    return { ok: false, message: "Could not create account. Try again." };
  }

  // success UI choice: show message or redirect
  revalidatePath("/", "layout");
  return { ok: true, message: "Check your email to verify your account." };
}