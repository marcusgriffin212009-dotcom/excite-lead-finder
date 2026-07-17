import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            AI Lead Generation
          </p>
          <h1 className="text-5xl md:text-6xl leading-tight">
            Meet <span className="italic">Gexcite</span> — your AI sales prospector.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Tell Gexcite about your business, what you sell, and who you want to sell
            to. Our AI searches the web to surface real companies and prospects that
            fit your ideal customer profile.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/auth"
              className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              to="/about"
              className="rounded-md border border-border px-6 py-3 hover:bg-accent"
            >
              Learn more
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            14-day free trial. Then $29/month.
          </p>
        </div>
      </section>

      {/* Features on white */}
      <section className="bg-card text-card-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-3">
          {[
            {
              title: "Tell us about your business",
              body: "A short onboarding captures what you sell and who your ideal buyer looks like.",
            },
            {
              title: "AI searches the web",
              body: "Gexcite scans public company data to identify real businesses that match your criteria.",
            },
            {
              title: "Actionable leads",
              body: "Every lead includes company name, likely role to contact, industry, location, and why they fit.",
            },
          ].map((f) => (
            <div key={f.title} className="border border-border/40 p-8">
              <h3 className="text-2xl">{f.title}</h3>
              <p className="mt-3 text-base leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl">Simple, monthly pricing</h2>
          <div className="mx-auto mt-8 max-w-md border border-border bg-card p-10 text-card-foreground">
            <p className="text-sm uppercase tracking-widest">Gexcite Pro</p>
            <p className="mt-4 text-5xl">$29<span className="text-lg">/mo</span></p>
            <p className="mt-2 text-sm text-muted-foreground">
              Unlimited AI lead searches. Cancel anytime.
            </p>
            <Link
              to="/auth"
              className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground hover:opacity-90"
            >
              Start 14-day free trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
