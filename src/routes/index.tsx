import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

const HERO_IMG =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80";
const PORTRAIT_IMG =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80";
const CITY_IMG =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80";

function Index() {
  return (
    <div className="overflow-hidden">
      {/* ————— Masthead ————— */}
      <section className="grain bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-6 pt-10">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span>Vol. I</span>
            <span>An AI Journal of Sales &amp; Prospecting</span>
            <span>No. 001</span>
          </div>
          <div className="mt-4 hairline" />
        </div>

        {/* Hero */}
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7 fade-up">
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              &sect; AI Lead Generation, established 2026
            </p>
            <h1 className="text-[3.25rem] leading-[0.98] md:text-[5.5rem]">
              The quiet art of{" "}
              <span className="italic">finding&nbsp;the</span>
              <br />
              <span className="italic">right</span> person to sell to.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              <span className="text-foreground">Gexcite</span> is a small,
              curious machine. Tell it about your business — what you make,
              who it's for — and it will comb the open web for real
              companies who ought to be hearing from you.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to="/auth"
                className="group inline-flex items-center gap-3 bg-foreground px-7 py-4 text-background hover:opacity-90"
              >
                <span className="italic">Begin</span>
                <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/about"
                className="text-sm italic underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground"
              >
                Read our manifesto
              </Link>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Fourteen days, gratis · then fifty dollars a month
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="relative">
              <img
                src={HERO_IMG}
                alt="Notebook, coffee, and a quiet morning of prospecting"
                className="h-[520px] w-full object-cover grayscale contrast-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/20 mix-blend-multiply" />
              <div className="absolute -bottom-6 -left-6 hidden bg-background px-5 py-4 md:block">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Case No. 04</p>
                <p className="mt-1 italic">"Twelve leads before lunch."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-border/60 py-5 overflow-hidden">
          <div className="marquee-track flex whitespace-nowrap text-2xl italic text-muted-foreground">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-10 pr-10">
                <span>Founders</span><span>✦</span>
                <span>Freelancers</span><span>✦</span>
                <span>Consultants</span><span>✦</span>
                <span>Studios</span><span>✦</span>
                <span>Agencies</span><span>✦</span>
                <span>Solo operators</span><span>✦</span>
                <span>Small teams</span><span>✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Editorial: How it works ————— */}
      <section className="bg-card text-card-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Chapter One</p>
              <h2 className="mt-4 text-5xl leading-tight">
                A methodical little<br /><span className="italic">prospector.</span>
              </h2>
              <p className="mt-6 leading-relaxed">
                Three steps, no theatrics. You describe your world; Gexcite
                does the reading.
              </p>
            </div>
            <ol className="md:col-span-8 space-y-10">
              {[
                {
                  n: "I.",
                  t: "You describe your business",
                  b: "A short conversation. What you sell. Who your best customer looks like. Where they gather.",
                },
                {
                  n: "II.",
                  t: "Gexcite reads the web",
                  b: "The model searches public company data — directories, press, hiring signals — and assembles a shortlist.",
                },
                {
                  n: "III.",
                  t: "You receive real leads",
                  b: "Company, likely contact, industry, location, and — most importantly — a written argument for why they fit.",
                },
              ].map((s) => (
                <li key={s.n} className="grid grid-cols-[4rem_1fr] gap-6 border-b border-card-foreground/15 pb-8">
                  <span className="text-4xl italic text-card-foreground/50">{s.n}</span>
                  <div>
                    <h3 className="text-2xl">{s.t}</h3>
                    <p className="mt-2 leading-relaxed text-card-foreground/75">{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ————— Testimonial spread ————— */}
      <section className="grain bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src={PORTRAIT_IMG}
              alt="A quiet founder at work"
              className="h-[460px] w-full object-cover grayscale"
              loading="lazy"
            />
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Plate I — a subscriber, at rest
            </p>
          </div>
          <figure className="md:col-span-7 flex flex-col justify-center">
            <p className="text-6xl leading-none italic text-muted-foreground">&ldquo;</p>
            <blockquote className="mt-4 text-3xl leading-snug md:text-4xl">
              I stopped guessing who to email. Gexcite hands me a list of
              companies with a paragraph on each — I read, I write, I send.
              It feels less like software and more like a quiet colleague.
            </blockquote>
            <figcaption className="mt-8 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              — A founder, in her second month
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ————— Ledger of numbers ————— */}
      <section className="bg-card text-card-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="rule-ornament text-xs uppercase tracking-[0.4em] text-card-foreground/60">
            The ledger, so far
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-4">
            {[
              { n: "14", l: "days, free of charge" },
              { n: "∞", l: "searches per month" },
              { n: "1", l: "small serif font" },
              { n: "0", l: "sales calls required" },
            ].map((k) => (
              <div key={k.l} className="border-t border-card-foreground/30 pt-6">
                <p className="text-6xl italic">{k.n}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.25em] text-card-foreground/70">{k.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Pricing / call to arms ————— */}
      <section className="grain relative bg-background">
        <img
          src={CITY_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15 grayscale"
          loading="lazy"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Subscription
          </p>
          <h2 className="mt-4 text-5xl italic md:text-6xl">
            Fifty dollars, monthly.
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">
            Begin with a fortnight, gratis. After that, a modest sum for
            unlimited searches, saved leads, and the peace of mind that
            somewhere — a small machine is quietly reading on your behalf.
          </p>
          <div className="mt-10">
            <Link
              to="/auth"
              className="inline-flex items-center gap-3 border border-foreground bg-foreground px-8 py-4 text-background hover:bg-transparent hover:text-foreground"
            >
              <span className="italic">Start the free fortnight</span>
              <span>→</span>
            </Link>
          </div>
          <p className="mt-6 text-xs italic text-muted-foreground">
            Cancel any time, without fuss.
          </p>
        </div>
      </section>
    </div>
  );
}
