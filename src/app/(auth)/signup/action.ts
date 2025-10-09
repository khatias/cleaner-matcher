"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { signUpSchema } from "@/lib/validation/auth";
import { headers } from "next/headers";
import { extractFlatErrors, summarize } from "@/utils/zod/zod";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  mapSupabaseErrorToCode,
  userMessageFor,
} from "@/utils/auth/auth-errors";
import { AuthState } from "@/types/Auth";
import { stripe } from "@/lib/stripe/stripe";

async function getBaseUrl() {
  const h = await headers();
  const origin = h.get("origin");
  return process.env.NEXT_PUBLIC_SITE_URL || origin;
}

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVER-ONLY
);

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
    const { data, error } = await supabase.auth.signUp({
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
    const userId = data.user?.id;
    if (userId) {
      // Try to read existing profile (trigger may have already created it)
      const { data: profile } = await admin
        .from("profiles")
        .select("stripe_customer_id, full_name, email, role")
        .eq("id", userId)
        .single();

      if (!profile?.stripe_customer_id) {
        // Create Stripe customer with idempotency by user id
        const idempotencyKey = `customer-create-${userId}`;
        const customer = await stripe.customers.create(
          {
            email,
            name: full_name || undefined,
            metadata: { supabase_user_id: userId },
          },
          { idempotencyKey }
        );

        // Upsert profile with stripe_customer_id (and minimal fields if row doesn’t exist yet)
        const upsertPayload = {
          id: userId,
          email,
          full_name: full_name || null,
          role: profile?.role ?? "customer" as const,
          stripe_customer_id: customer.id,
        };

        const { error: upErr } = await admin
          .from("profiles")
          .upsert(upsertPayload, { onConflict: "id" });

        if (upErr) {
          // Roll back Stripe customer to avoid orphaning
          try { await stripe.customers.del(customer.id); } catch {}
          return {
            ok: false,
            code: "server",
            message: "We couldn't finish account setup. Please try again.",
            values: { email: raw.email, full_name: raw.full_name },
          };
        }
      }
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
