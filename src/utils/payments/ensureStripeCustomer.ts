import { stripe } from "@/lib/stripe/stripe";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);


export async function ensureStripeCustomer(): Promise<string> {
  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("No session");

  const { data: profile, error: profErr } = await admin
    .from("profiles")
    .select("stripe_customer_id, full_name, email")
    .eq("id", user.id)
    .single();
  if (profErr) throw new Error("Profile load failed");

  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  const idempotencyKey = `customer-create-${user.id}`;
  const customer = await stripe.customers.create({
    email: profile?.email ?? user.email ?? undefined,
    name:
      profile?.full_name ??
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      undefined,
    metadata: { supabase_user_id: user.id },
  }, { idempotencyKey });

  const { error: upErr } = await admin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", user.id);

  if (upErr) {
    try { await stripe.customers.del(customer.id); } catch {}
    throw new Error("Failed to store stripe_customer_id");
  }

  return customer.id;
}
