import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About leadlurex — AI Lead Finder" },
      { name: "description", content: "Learn how leadlurex uses AI to help small businesses find real sales leads." },
      { property: "og:title", content: "About leadlurex" },
      { property: "og:description", content: "How leadlurex finds real leads for your business." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200" },
    ],
  }),
  component: About,
});

const IMG_TEAM = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80";
const IMG_MEETING = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80";
const IMG_OFFICE = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80";
const IMG_CHART = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80";
const IMG_DESK = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80";

function About() {
  return (
    <div>
      {/* Masthead */}
      <section className="grain bg-background">
        <div className="mx-auto max-w-6xl px-6 pt-10">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span>On the house</span>
            <span>A short manifesto</span>
            <span>Filed under: About</span>
          </div>
          <div className="mt-4 hairline" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            &sect; Chapter Zero — Why we made this
          </p>
          <h1 className="mt-6 text-6xl leading-[1.02] md:text-7xl">
            Selling is hard.<br />
            <span className="italic">Knowing who to sell to</span> is harder.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            leadlurex was built for the founder at the kitchen table, the
            freelancer between clients, the two-person studio wondering how
            the sales pipeline is supposed to fill itself. It won't cold-call
            for you. It will, however, read the internet quite carefully.
          </p>
          <img
            src={IMG_TEAM}
            alt="Team collaborating around a table"
            className="mt-12 h-[460px] w-full object-cover grayscale contrast-110"
            loading="lazy"
          />
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Plate I — a Tuesday, somewhere small and busy
          </p>
        </div>
      </section>

      {/* Mission on white — with drop cap */}
      <section className="bg-card text-card-foreground">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.35em] text-card-foreground/60">
              Our mission, plainly stated
            </p>
            <h2 className="mt-4 text-4xl leading-tight md:text-5xl">
              To make prospecting feel <span className="italic">less lonely</span>,
              and a great deal more precise.
            </h2>
            <p className="dropcap mt-8 text-lg leading-relaxed">
              Selling is a slow craft. Cold lists are stale by the time they
              reach you; scraped databases invent job titles that never
              existed. We wanted something quieter — a tool that reads the
              open web, thinks about your specific business, and hands back a
              short list of real companies with a written argument for each.
            </p>
            <p className="mt-6 leading-relaxed">
              Tell leadlurex what you make and who it's for. It will do the
              rest — patiently, and without the sales-tech theatrics.
            </p>
          </div>
          <div className="md:col-span-5">
            <img
              src={IMG_MEETING}
              alt="Business meeting in progress"
              className="h-[420px] w-full object-cover grayscale"
              loading="lazy"
            />
            <figure className="mt-8 border-l-2 border-card-foreground pl-5">
              <blockquote className="text-xl italic leading-snug">
                &ldquo;The best sales tool is a thoughtful email to the right
                person. Everything else is just noise dressed up in a
                dashboard.&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-xs uppercase tracking-[0.3em] text-card-foreground/60">
                — House motto
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* How it works — editorial */}
      <section className="grain bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="rule-ornament text-xs uppercase tracking-[0.4em] text-muted-foreground">
            The method
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              { n: "I.", t: "Answer a few questions", b: "Business type, product, and target customer. Five minutes, tops." },
              { n: "II.", t: "The machine reads", b: "leadlurex scans directories, press, and hiring signals for a fit." },
              { n: "III.", t: "You write the email", b: "Each lead arrives with company, role, and a paragraph of reasoning." },
            ].map((s) => (
              <div key={s.n} className="border-t border-border pt-6">
                <p className="text-5xl italic text-muted-foreground">{s.n}</p>
                <h3 className="mt-4 text-2xl">{s.t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-card text-card-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-xs uppercase tracking-[0.35em] text-card-foreground/60">
            Plates II — IV · Scenes from the working day
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-6">
            <img src={IMG_OFFICE} alt="Modern office workspace" className="md:col-span-4 h-96 w-full object-cover grayscale" loading="lazy" />
            <img src={IMG_DESK} alt="Quiet desk" className="md:col-span-2 h-96 w-full object-cover grayscale" loading="lazy" />
            <img src={IMG_CHART} alt="Business analytics chart" className="md:col-span-3 h-80 w-full object-cover grayscale" loading="lazy" />
            <div className="md:col-span-3 flex flex-col justify-center border-l-2 border-card-foreground/40 px-8">
              <p className="text-3xl italic leading-snug">
                A pipeline is not built in a day. It is built one thoughtful
                message at a time — and it helps, tremendously, to know where
                to begin.
              </p>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-card-foreground/60">
                — from the leadlurex handbook
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
