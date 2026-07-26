import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { findLeads } from "@/lib/leads.functions";

export const Route = createFileRoute("/find-leads")({
  head: () => ({
    meta: [
      { title: "Find Leads — leadlurex" },
      { name: "description", content: "Answer a few questions and let leadlurex find real leads for your business." },
    ],
  }),
  component: FindLeadsPage,
});

type Lead = {
  company_name: string;
  contact_person?: string | null;
  role?: string | null;
  website?: string | null;
  industry?: string | null;
  location?: string | null;
  reason?: string | null;
  contact_hint?: string | null;
};

function FindLeadsPage() {
  const navigate = useNavigate();
  const runFindLeads = useServerFn(findLeads);
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [businessType, setBusinessType] = useState("");
  const [product, setProduct] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUserEmail(data.user.email ?? null);
      // Prefill from profile
      supabase
        .from("profiles")
        .select("business_type, product, target_customer")
        .eq("id", data.user.id)
        .maybeSingle()
        .then(({ data: p }) => {
          if (p) {
            setBusinessType(p.business_type ?? "");
            setProduct(p.product ?? "");
            setTargetCustomer(p.target_customer ?? "");
          }
          setChecking(false);
        });
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLeads([]);
    try {
      const result = await runFindLeads({
        data: { businessType, product, targetCustomer, count: 8 },
      });
      setLeads(result.leads);
    } catch (err: any) {
      setError(err.message ?? "Failed to find leads");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl">Find Leads</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as {userEmail}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6 bg-card p-8 text-card-foreground">
        <div>
          <label className="block text-sm">What type of business do you have?</label>
          <input
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            required
            placeholder="e.g. a small web design agency"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm">What do you sell?</label>
          <textarea
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
            rows={3}
            placeholder="e.g. custom Shopify storefronts for boutique fashion brands, $3k-$8k per project"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm">Who are you looking to sell to?</label>
          <textarea
            value={targetCustomer}
            onChange={(e) => setTargetCustomer(e.target.value)}
            required
            rows={3}
            placeholder="e.g. independent fashion brands in the US or UK with 5-50 employees, currently on Squarespace or WooCommerce"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching the web..." : "Find leads"}
        </button>
      </form>

      {loading && (
        <p className="mt-8 text-center text-muted-foreground">
          leadlurex is scanning public company data. This can take up to a minute...
        </p>
      )}

      {leads.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl">Your leads</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {leads.map((lead, i) => (
              <article key={i} className="bg-card p-6 text-card-foreground">
                <h3 className="text-xl">{lead.company_name}</h3>
                {lead.industry && (
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {lead.industry}{lead.location ? ` · ${lead.location}` : ""}
                  </p>
                )}
                {lead.role && (
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">Reach:</span>{" "}
                    {lead.contact_person ? `${lead.contact_person} — ` : ""}
                    {lead.role}
                  </p>
                )}
                {lead.website && (
                  <p className="mt-1 text-sm">
                    <a
                      href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {lead.website}
                    </a>
                  </p>
                )}
                {lead.reason && (
                  <p className="mt-3 text-sm leading-relaxed">
                    <span className="font-semibold">Why they fit:</span> {lead.reason}
                  </p>
                )}
                {lead.contact_hint && (
                  <p className="mt-3 text-sm leading-relaxed">
                    <span className="font-semibold">How to reach out:</span> {lead.contact_hint}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
