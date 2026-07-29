import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listSavedLeads, setLeadSaved } from "@/lib/leads.functions";

export const Route = createFileRoute("/lead-list")({
  head: () => ({
    meta: [
      { title: "Lead list — leadlurex" },
      { name: "description", content: "Your saved leads, quietly gathered in one place." },
      { property: "og:title", content: "Lead list — leadlurex" },
      { property: "og:description", content: "Members-only saved leads for your business." },
    ],
  }),
  component: LeadListPage,
});

type SavedLead = {
  id: string;
  company_name: string;
  contact_person: string | null;
  role: string | null;
  website: string | null;
  industry: string | null;
  location: string | null;
  reason: string | null;
  contact_hint: string | null;
  created_at: string;
};

function LeadListPage() {
  const navigate = useNavigate();
  const runList = useServerFn(listSavedLeads);
  const runSetSaved = useServerFn(setLeadSaved);

  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [leads, setLeads] = useState<SavedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: p } = await supabase
        .from("profiles")
        .select("trial_ends_at")
        .eq("id", data.user.id)
        .maybeSingle();
      const ends = p?.trial_ends_at ?? null;
      const active = ends ? new Date(ends).getTime() > Date.now() : false;
      setTrialEndsAt(ends);
      setHasAccess(active);
      setChecking(false);
      if (active) {
        setLoading(true);
        try {
          const res = await runList({});
          setLeads(res.leads as SavedLead[]);
        } catch (err: any) {
          setError(err.message ?? "Failed to load leads");
        } finally {
          setLoading(false);
        }
      }
    });
  }, [navigate, runList]);

  const handleRemove = async (id: string) => {
    try {
      await runSetSaved({ data: { id, saved: false } });
      setLeads((ls) => ls.filter((l) => l.id !== id));
    } catch (err: any) {
      setError(err.message ?? "Failed to remove lead");
    }
  };

  if (checking) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Members only
        </p>
        <h1 className="mt-6 text-5xl italic">Lead list</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Your saved leads live here. It's part of the paid plan &mdash; fifty
          dollars a month, after the free trial.
        </p>
        {trialEndsAt && (
          <p className="mt-4 text-sm text-muted-foreground">
            Your trial ended on {new Date(trialEndsAt).toLocaleDateString()}.
          </p>
        )}
        <div className="mt-10">
          <Link
            to="/"
            className="border border-foreground px-6 py-3 italic hover:bg-foreground hover:text-background"
          >
            See the plan →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Members
          </p>
          <h1 className="mt-2 text-4xl italic">Lead list</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {leads.length} saved {leads.length === 1 ? "lead" : "leads"}.
          </p>
        </div>
        <Link to="/find-leads" className="text-sm italic underline underline-offset-4">
          ← Find more leads
        </Link>
      </div>

      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="mt-16 text-center text-muted-foreground">Loading your list...</p>
      ) : leads.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-lg italic text-muted-foreground">
            Nothing saved yet. Run a search and tap <span className="not-italic">+ Save</span> on any lead.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {leads.map((lead) => (
            <article key={lead.id} className="relative bg-card p-6 text-card-foreground">
              <button
                onClick={() => handleRemove(lead.id)}
                className="absolute right-4 top-4 border border-border px-2 py-1 text-[11px] uppercase tracking-[0.2em] hover:bg-destructive hover:text-destructive-foreground"
              >
                Remove
              </button>
              <h3 className="pr-24 text-xl">{lead.company_name}</h3>
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
      )}
    </div>
  );
}
