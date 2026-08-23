import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const checkSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | undefined)?.email ?? null;
    const { getSubscriptionStatus } = await import("./billing.server");

    let status;
    try {
      status = await getSubscriptionStatus(email);
    } catch (err) {
      console.error("[check-subscription]", err);
      return {
        subscribed: false,
        plan: null as string | null,
        current_period_end: null as string | null,
        cancel_at_period_end: false,
      };
    }

    if (status.stripe_customer_id) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("subscribers").upsert(
        {
          user_id: context.userId,
          email,
          stripe_customer_id: status.stripe_customer_id,
          stripe_subscription_id: status.stripe_subscription_id,
          subscribed: status.subscribed,
          plan: status.plan,
          cancel_at_period_end: status.cancel_at_period_end,
          current_period_end: status.current_period_end,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    }

    return {
      subscribed: status.subscribed,
      plan: status.plan,
      current_period_end: status.current_period_end,
      cancel_at_period_end: status.cancel_at_period_end,
    };
  });

export const createCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ origin: z.string().url() }).parse(input))
  .handler(async ({ data, context }) => {
    const email = (context.claims as { email?: string } | undefined)?.email;
    if (!email) throw new Error("No email on this account");

    const { stripeClient, PLUS_PRICE_ID } = await import("./billing.server");
    const stripe = stripeClient();
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
  .inputValidator((input: unknown) => z.object({ origin: z.string().url() }).parse(input))
  .handler(async ({ data, context }) => {
    const email = (context.claims as { email?: string } | undefined)?.email;
    if (!email) throw new Error("No email on this account");

    const { stripeClient } = await import("./billing.server");
    const stripe = stripeClient();
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customerId = customers.data[0]?.id;
    if (!customerId) throw new Error("No billing account found yet.");

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${data.origin}/pricing`,
    });

    return { url: portal.url };
  });
