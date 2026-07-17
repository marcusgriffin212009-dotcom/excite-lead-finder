import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Gexcite — AI Lead Finder" },
      { name: "description", content: "Learn how Gexcite uses AI to help small businesses find real sales leads." },
      { property: "og:title", content: "About Gexcite" },
      { property: "og:description", content: "How Gexcite finds real leads for your business." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200" },
    ],
  }),
  component: About,
});

const IMG_TEAM = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80";
const IMG_MEETING = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80";
const IMG_OFFICE = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80";
const IMG_CHART = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80";

function About() {
  return (
    <div>
      {/* Hero image */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-5xl">About Gexcite</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            We help entrepreneurs and small businesses find the right people to sell
            to — quickly, and without pretending sales is easy.
          </p>
          <img
            src={IMG_TEAM}
            alt="Team collaborating around a table"
            className="mt-10 h-[420px] w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Mission on white */}
      <section className="bg-card text-card-foreground">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-3xl">Our mission</h2>
            <p className="mt-4 leading-relaxed">
              Selling is hard. Finding the right person to sell to is even harder.
              Gexcite was built for founders, freelancers, and small teams who don't
              have a full sales operation but still need a steady flow of qualified
              prospects. We combine artificial intelligence with public company data
              to surface real leads — not fake names, not stale lists.
            </p>
            <p className="mt-4 leading-relaxed">
              Tell us what your business does and who your best customer looks like.
              Gexcite does the rest.
            </p>
          </div>
          <img
            src={IMG_MEETING}
            alt="Business meeting in progress"
            className="h-full max-h-[400px] w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Answer a few questions", b: "Business type, product, and target customer." },
              { n: "02", t: "AI searches the web", b: "Gexcite finds companies matching your criteria." },
              { n: "03", t: "Reach out", b: "Every lead includes company, role, industry, and fit reasoning." },
            ].map((s) => (
              <div key={s.n} className="border border-border p-8">
                <p className="text-sm text-muted-foreground">{s.n}</p>
                <h3 className="mt-2 text-2xl">{s.t}</h3>
                <p className="mt-3 leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two more images */}
      <section className="bg-card text-card-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-2">
          <img src={IMG_OFFICE} alt="Modern office workspace" className="h-80 w-full object-cover" loading="lazy" />
          <img src={IMG_CHART} alt="Business analytics chart" className="h-80 w-full object-cover" loading="lazy" />
        </div>
      </section>
    </div>
  );
}
