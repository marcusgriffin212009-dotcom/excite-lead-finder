import Stripe from "stripe";

export const PLUS_PRICE_ID = "price_1U7cUXP6zNmSkfp9mNKEEY1f";
export const PLUS_PRODUCT_ID = "prod_V7sF6eDoH12PMT";

export function stripeClient(): Stripe {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, { apiVersion: "2025-08-27.basil" as never });
}

export type SubscriptionStatus = {
  subscribed: boolean;
  plan: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export async function getSubscriptionStatus(
  email: string | null | undefined,
): Promise<SubscriptionStatus> {
  const status: SubscriptionStatus = {
    subscribed: false,
    plan: null,
    current_period_end: null,
    cancel_at_period_end: false,
    stripe_customer_id: null,
    stripe_subscription_id: null,
  };
  if (!email) return status;

  const stripe = stripeClient();
  const customers = await stripe.customers.list({ email, limit: 1 });
  const customer = customers.data[0];
  if (!customer) return status;
  status.stripe_customer_id = customer.id;

  const subs = await stripe.subscriptions.list({
    customer: customer.id,
    status: "active",
    limit: 1,
  });
  const sub = subs.data[0];
  if (!sub) return status;

  const periodEnd =
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    (sub.items.data[0] as unknown as { current_period_end?: number } | undefined)
      ?.current_period_end;

  status.subscribed = true;
  status.plan = "plus";
  status.stripe_subscription_id = sub.id;
  status.cancel_at_period_end = sub.cancel_at_period_end;
  status.current_period_end = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
  return status;
}
