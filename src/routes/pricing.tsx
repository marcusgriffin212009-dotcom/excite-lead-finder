import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
});

const PRICING_IMG =
  "https://images.unsplash.com/photo-1460925895917-afdab87c716f?w=1200&q=80";

function Pricing() {
  return (
    <div className="overflow-hidden">
      {/* ————— Pricing Header ————— */}
      <section className="grain bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              § Subscription Plans
            </p>
            <h1 className="mt-6 text-[3.25rem] leading-[0.98] md:text-[5.5rem]">
              Plans that grow{" "}
              <span className="italic">with&nbsp;your</span>
              <br />
              <span className="italic">ambition.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Start free for two weeks. No credit card required. Choose the plan
              that fits your prospecting needs.
            </p>
          </div>
        </div>
      </section>

      {/* ————— Plans Comparison ————— */}
      <section className="bg-card text-card-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Starter Plan */}
            <div className="group relative border border-card-foreground/20 bg-background p-10 transition-all hover:border-card-foreground/40">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Trial Period
              </p>
              <h2 className="mt-4 text-3xl italic">Two Weeks, Free</h2>
              <p className="mt-2 text-sm text-card-foreground/70">
                Get started with no commitment
              </p>
              <p className="mt-6 text-4xl italic text-foreground">$0</p>
              <p className="mt-1 text-sm text-card-foreground/60">14 days</p>
              
              <ul className="mt-10 space-y-4 border-t border-card-foreground/20 pt-10">
                {[
                  "5 lead searches per day",
                  "Basic lead information",
                  "Up to 10 saved leads",
                  "Email support",
                  "No credit card required",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/70" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth"
                className="mt-10 block w-full border border-foreground bg-foreground px-6 py-3 text-center text-background italic hover:opacity-90"
              >
                Start Free Trial
              </Link>
              <p className="mt-3 text-xs text-card-foreground/50 text-center">
                Upgrade to paid plan anytime
              </p>
            </div>

            {/* Pro Plan */}
            <div className="group relative border-2 border-foreground bg-foreground text-background p-10">
              <div className="absolute -top-4 left-6 bg-foreground px-3 py-1">
                <p className="text-xs uppercase tracking-[0.35em]">Most Popular</p>
              </div>
              <p className="text-xs uppercase tracking-[0.35em] text-background/70">
                Monthly Subscription
              </p>
              <h2 className="mt-4 text-3xl italic">Unlimited Pro</h2>
              <p className="mt-2 text-sm text-background/80">
                Perfect for serious prospectors
              </p>
              <p className="mt-6 text-5xl italic">$50</p>
              <p className="mt-1 text-sm text-background/70">/month, billed monthly</p>
              
              <ul className="mt-10 space-y-4 border-t border-background/20 pt-10">
                {[
                  "Unlimited lead searches",
                  "Unlimited leads generated per search",
                  "Advanced lead information & insights",
                  "Unlimited saved leads",
                  "Priority email support",
                  "Export leads to CSV",
                  "Company research data",
                  "Contact research & verification",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth"
                className="mt-10 block w-full border border-background bg-background px-6 py-3 text-center text-foreground italic hover:bg-background/90"
              >
                Start Free Trial
              </Link>
              <p className="mt-3 text-xs text-background/50 text-center">
                Access paid features after 14-day trial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ————— FAQ Section ————— */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground text-center">
            Frequently Asked
          </p>
          <h2 className="mt-4 text-center text-4xl italic">Questions about pricing</h2>
          
          <div className="mt-16 space-y-12">
            {[
              {
                q: "Can I cancel my subscription?",
                a: "Yes. Cancel anytime, without questions or penalties. Your access continues until the end of your billing cycle.",
              },
              {
                q: "What happens after my free trial?",
                a: "You'll receive a reminder before your trial ends. To continue, simply choose your plan. If you don't subscribe, your account access will be paused.",
              },
              {
                q: "Do you offer annual billing?",
                a: "Currently, we bill monthly. Contact us if you're interested in annual pricing — we may be able to work something out.",
              },
              {
                q: "Can I upgrade or downgrade?",
                a: "You can upgrade to the Pro plan at any time during your trial or free period. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) and process payments securely through Stripe.",
              },
              {
                q: "Is there a limit to how many leads I can find?",
                a: "With the Pro plan, you have unlimited lead searches and unlimited leads per search. The only limit is your curiosity and time.",
              },
            ].map((item, idx) => (
              <div key={idx} className="border-b border-border pb-8 last:border-0">
                <h3 className="text-lg font-semibold italic text-foreground">
                  {item.q}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Call to Action ————— */}
      <section className="grain bg-card text-card-foreground">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-4xl italic md:text-5xl">
            Ready to find your next customer?
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-card-foreground/75">
            Start your free trial today. Two weeks to explore, zero risk. Then,
            if you're ready, join hundreds of prospectors using leadlurex to
            build their business.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-3 border border-foreground bg-foreground px-8 py-4 text-background hover:opacity-90"
            >
              <span className="italic">Start Free Trial</span>
              <span>→</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 border border-foreground px-8 py-4 italic hover:bg-foreground hover:text-background"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
