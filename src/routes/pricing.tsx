import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkSubscription, createCheckout, customerPortal } from "@/lib/billing.functions";

export const Route = createFileRoute("/pricing")({
  validateSearch: (s: Record<string, unknown>): { checkout?: boolean } => ({
    checkout: s.checkout === "1" || s.checkout === "true",
  }),
  head: () => ({
    meta: [
      { title: "Pricing — leadlurex Plus, $49.99 a month" },
      {
        name: "description",
        content:
          "Free plan with 2 lead searches a week, or leadlurex Plus at $49.99 a month for unlimited searches and 20 leads per search. Cancel anytime.",
      },
      { property: "og:title", content: "Pricing — leadlurex Plus" },
      {
        property: "og:description",
        content: "Unlimited AI lead searches for $49.99 a month. Cancel anytime.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const navigate = useNavigate();
  const { checkout } = Route.useSearch();
  const runCheck = useServerFn(checkSubscription);
  const runCheckout = useServerFn(createCheckout);
  const runPortal = useServerFn(customerPortal);
  const checkoutStarted = useRef(false);

  const [signedIn, setSignedIn] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    subscribed: boolean;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  } | null>(null);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setSignedIn(false);
      setLoadingStatus(false);
      return;
    }
    setSignedIn(true);
    try {
      const res = await runCheck({});
      setStatus(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check your plan");
    } finally {
      setLoadingStatus(false);
    }
  }, [runCheck]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const startCheckout = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await runCheckout({ data: { origin: window.location.origin } });
      if (!res.url) throw new Error("Stripe did not return a checkout URL");
      // A full-page redirect is more reliable than window.open, especially on mobile
      // and after returning from the authentication flow.
      window.location.assign(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
      setBusy(false);
    }
  }, [runCheckout]);

  useEffect(() => {
    // A visitor who chose Plus before creating an account returns here after
    // authentication and is sent straight to Stripe Checkout.
    if (checkout && signedIn && !loadingStatus && !status?.subscribed && !checkoutStarted.current) {
      checkoutStarted.current = true;
      void startCheckout();
    }
  }, [checkout, signedIn, loadingStatus, status?.subscribed, startCheckout]);

  const handleUpgrade = async () => {
    if (!signedIn) {
      navigate({ to: "/auth", search: { next: "/pricing?checkout=1" } as never });
      return;
    }
    await startCheckout();
  };

  const handleManage = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await runPortal({ data: { origin: window.location.origin } });
      if (res.url) window.location.assign(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing");
      setBusy(false);
    }
  };

  const subscribed = !!status?.subscribed;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          The Ledger &mdash; Membership
        </p>
        <h1 className="mt-6 text-5xl italic">Pricing</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Choose the plan that fits your business. Upgrade to Plus for the full lead-finding experience, with secure monthly billing through Stripe.
        </p>
      </header>

      {error && <p className="mt-8 text-center text-sm text-destructive">{error}</p>}

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <section className="border border-border p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Free plan</p>
          <h2 className="mt-4 text-4xl italic">$0</h2>
          <p className="mt-2 text-sm text-muted-foreground">For getting a feel of it.</p>
          <ul className="mt-8 space-y-3 text-sm leading-relaxed">
            <li>— 2 lead searches per week</li>
            <li>— 8 leads generated per search</li>
            <li>— Saved leads in your Lead list</li>
            <li>— No card required</li>
          </ul>
          {!signedIn && (
            <Link
              to="/auth"
              className="mt-10 inline-block border border-foreground px-6 py-3 italic hover:bg-foreground hover:text-background"
            >
              Create a free account →
            </Link>
          )}
          {signedIn && !subscribed && (
            <p className="mt-10 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Your current plan
            </p>
          )}
        </section>

        <section className="border-2 border-foreground bg-card p-8 text-card-foreground">
          <div className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Plus — full access</p>
            {subscribed && (
              <span className="border border-foreground px-2 py-1 text-[11px] uppercase tracking-[0.2em]">
                Your plan
              </span>
            )}
          </div>
          <h2 className="mt-4 text-4xl italic">
            $49.99 <span className="text-base not-italic text-muted-foreground">/ month</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Billed monthly through Stripe. Cancel anytime.</p>
          <ul className="mt-8 space-y-3 text-sm leading-relaxed">
            <li>— Unlimited lead searches</li>
            <li>— About 20 leads generated per search</li>
            <li>— Full Lead list access, saved forever</li>
            <li>— Reasoning and outreach hints on every lead</li>
          </ul>

          {loadingStatus ? (
            <p className="mt-10 text-sm text-muted-foreground">Checking your plan…</p>
          ) : subscribed ? (
            <div className="mt-10">
              <button
                onClick={handleManage}
                disabled={busy}
                className="border border-foreground px-6 py-3 italic hover:bg-foreground hover:text-background disabled:opacity-50"
              >
                {busy ? "Opening…" : "Manage or cancel subscription →"}
              </button>
              {status?.current_period_end && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {status.cancel_at_period_end ? "Ends" : "Renews"} on{" "}
                  {new Date(status.current_period_end).toLocaleDateString()}.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-10">
              <button
                onClick={handleUpgrade}
                disabled={busy}
                className="bg-primary px-6 py-3 text-primary-foreground italic hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Opening checkout…" : signedIn ? "Subscribe to Plus →" : "Sign up for Plus →"}
              </button>
              <p className="mt-4 text-xs text-muted-foreground">
                Secure Stripe Checkout. Your subscription renews monthly until canceled.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => void refresh()}
          className="text-sm italic underline underline-offset-4 text-muted-foreground"
        >
          Refresh plan status
        </button>
      </div>
    </div>
  );
}
