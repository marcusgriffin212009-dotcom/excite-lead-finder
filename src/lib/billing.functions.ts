import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const PLUS_PRICE_ID = "price_1U7cUXP6zNmSkfp9mNKEEY1f";
export const PLUS_PRODUCT_ID = "prod_V7sF6eDoH12PMT";

async function stripeClient() {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  const { default: Stripe } = await import("stripe");
  return new Stripe(key, { apiVersion: "2025-08-27.basil" as never });
}

export const checkSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | undefined)?.email ?? null;
    const result = {
      subscribed: false,
      plan: null as string | null,
      current_period_end: null as string | null,
      cancel_at_period_end: false,
    };

    if (email) {
      try {
        const stripe = await stripeClient();
        const customers = await stripe.customers.list({ email, limit: 1 });
        if (customers.data.length > 0) {
          const customerId = customers.data[0]!.id;
          const subs = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            limit: 1,
          });
          const sub = subs.data[0];
          if (sub) {
            const periodEnd =
              (sub as unknown as { current_period_end?: number }).current_period_end ??
              (sub.items.data[0] as unknown as { current_period_end?: number } | undefined)
                ?.current_period_end;
            result.subscribed = true;
            result.plan = "plus";
            result.cancel_at_period_end = sub.cancel_at_period_end;
            result.current_period_end = periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null;
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("subscribers").upsert(
            {
              user_id: context.userId,
              email,
              stripe_customer_id: customerId,
              stripe_subscription_id: sub?.id ?? null,
              subscribed: result.subscribed,
              plan: result.plan,
              cancel_at_period_end: result.cancel_at_period_end,
              current_period_end: result.current_period_end,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
        }
      } catch (err) {
        console.error("[check-subscription]", err);
      }
    }

    return result;
  });

export const createCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ origin: z.string().url() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const email = (context.claims as { email?: string } | undefined)?.email;
    if (!email) throw new Error("No email on this account");

    const stripe = await stripeClient();
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customerId = customers.data[0]?.id;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: PLUS_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      success_url: `${data.origin}/pricing?checkout=success`,
      cancel_url: `${data.origin}/pricing?checkout=cancelled`,
    });

    return { url: session.url };
  });

export const customerPortal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ origin: z.string().url() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const email = (context.claims as { email?: string } | undefined)?.email;
    if (!email) throw new Error("No email on this account");

    const stripe = await stripeClient();
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customerId = customers.data[0]?.id;
    if (!customerId) throw new Error("No billing account found yet.");

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${data.origin}/pricing`,
    });

    return { url: portal.url };
  });
