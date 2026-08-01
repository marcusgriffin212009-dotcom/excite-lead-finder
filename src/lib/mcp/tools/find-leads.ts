import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

type RuntimeGlobals = typeof globalThis & {
  Deno?: { env?: { get?: (name: string) => string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};

function apiKey(): string {
  const runtime = globalThis as RuntimeGlobals;
  const key =
    runtime.Deno?.env?.get?.("LOVABLE_API_KEY") ?? runtime.process?.env?.["LOVABLE_API_KEY"];
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  return key;
}

const LeadSchema = z.object({
  company_name: z.string(),
  contact_person: z.string().nullish(),
  role: z.string().nullish(),
  website: z.string().nullish(),
  industry: z.string().nullish(),
  location: z.string().nullish(),
  reason: z.string().nullish(),
  contact_hint: z.string().nullish(),
});

const normName = (s: string) =>
  s.trim().toLowerCase().replace(/[,.]/g, "").replace(/\s+(inc|llc|ltd|co|corp|company)\.?$/i, "").trim();
const normSite = (s: string | null | undefined) =>
  (s ?? "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "").trim();

export default defineTool({
  name: "find_leads",
  title: "Find new leads",
  description:
    "Generate new business leads for the signed-in user with the leadlurex AI and store them in their account. Skips companies already suggested before. Takes up to ~30 seconds.",
  inputSchema: {
    businessType: z.string().trim().min(1).max(200).optional().describe("Defaults to the saved profile."),
    product: z.string().trim().min(1).max(500).optional().describe("Defaults to the saved profile."),
    targetCustomer: z.string().trim().min(1).max(500).optional().describe("Defaults to the saved profile."),
    count: z.number().int().min(1).max(10).default(6).describe("How many leads to generate."),
  },
  annotations: { readOnlyHint: false, idempotentHint: false, openWorldHint: true },
  handler: async ({ businessType, product, targetCustomer, count }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);

    const { data: profile } = await supabase
      .from("profiles")
      .select("business_type, product, target_customer")
      .eq("id", ctx.getUserId())
      .maybeSingle();

    const bType = businessType ?? profile?.business_type ?? "";
    const prod = product ?? profile?.product ?? "";
    const target = targetCustomer ?? profile?.target_customer ?? "";
    if (!bType || !prod || !target) {
      return {
        content: [
          {
            type: "text",
            text: "Missing business details. Provide businessType, product and targetCustomer, or set them with update_business_profile first.",
          },
        ],
        isError: true,
      };
    }

    const { data: existing } = await supabase
      .from("leads")
      .select("company_name, website")
      .order("created_at", { ascending: false })
      .limit(500);
    const existingList = (existing ?? []) as { company_name: string; website: string | null }[];
    const seenNames = new Set(existingList.map((l) => normName(l.company_name)));
    const seenSites = new Set(existingList.map((l) => normSite(l.website)).filter(Boolean));
    const excludeList = existingList.slice(0, 120).map((l) => l.company_name).join(", ");

    const system =
      "You are leadlurex, an AI sales prospecting assistant. Given a small business's profile, return a JSON array of REAL, publicly-known companies that plausibly match the ideal customer profile. Only include companies that actually exist. Do NOT invent contact emails or phone numbers. Return ONLY valid JSON, no prose, no markdown.";
    const user = `My business:
- Business type: ${bType}
- What I sell: ${prod}
- Who I want to sell to: ${target}

${excludeList ? `IMPORTANT: Do NOT include any of these companies — they were already suggested:\n${excludeList}\n\n` : ""}Return {"leads": [...]} with ${count} real companies. Each lead: {"company_name","contact_person","role","website","industry","location","reason","contact_hint"}.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey()}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      const msg =
        res.status === 429
          ? "Rate limit reached. Try again shortly."
          : res.status === 402
            ? "AI credits exhausted."
            : `AI request failed [${res.status}]: ${body}`;
      return { content: [{ type: "text", text: msg }], isError: true };
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    let parsed: { leads?: unknown };
    try {
      parsed = JSON.parse(content) as { leads?: unknown };
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? (JSON.parse(match[0]) as { leads?: unknown }) : { leads: [] };
    }

    const leads = (Array.isArray(parsed.leads) ? parsed.leads : [])
      .map((l) => LeadSchema.safeParse(l))
      .flatMap((r) => (r.success ? [r.data] : []))
      .filter((l) => {
        const n = normName(l.company_name);
        const s = normSite(l.website);
        if (!n || seenNames.has(n)) return false;
        if (s && seenSites.has(s)) return false;
        seenNames.add(n);
        if (s) seenSites.add(s);
        return true;
      });

    if (leads.length === 0) {
      return { content: [{ type: "text", text: "No new leads found. Try a broader target customer." }] };
    }

    const { data: inserted, error } = await supabase
      .from("leads")
      .insert(
        leads.map((l) => ({
          user_id: ctx.getUserId(),
          company_name: l.company_name,
          contact_person: l.contact_person ?? null,
          role: l.role ?? null,
          website: l.website ?? null,
          industry: l.industry ?? null,
          location: l.location ?? null,
          reason: l.reason ?? null,
          contact_hint: l.contact_hint ?? null,
        })),
      )
      .select("id, company_name, contact_person, role, website, industry, location, reason, contact_hint, saved");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(inserted ?? []) }],
      structuredContent: { leads: inserted ?? [] },
    };
  },
});
