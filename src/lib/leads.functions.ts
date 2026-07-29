import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const InputSchema = z.object({
  businessType: z.string().min(1).max(200),
  product: z.string().min(1).max(500),
  targetCustomer: z.string().min(1).max(500),
  count: z.number().int().min(1).max(15).default(8),
});

const LeadSchema = z.object({
  company_name: z.string(),
  contact_person: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  contact_hint: z.string().optional().nullable(),
});

export const findLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    // Fetch existing leads for this user to avoid duplicates
    const { data: existing } = await context.supabase
      .from("leads")
      .select("company_name, website")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(500);
    const existingList = (existing ?? []) as { company_name: string; website: string | null }[];
    const normName = (s: string) => s.trim().toLowerCase().replace(/[,.]/g, "").replace(/\s+(inc|llc|ltd|co|corp|company)\.?$/i, "").trim();
    const normSite = (s: string | null | undefined) =>
      (s ?? "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "").trim();
    const seenNames = new Set(existingList.map((l) => normName(l.company_name)));
    const seenSites = new Set(existingList.map((l) => normSite(l.website)).filter(Boolean));
    const excludeList = existingList.slice(0, 120).map((l) => l.company_name).join(", ");

    const system = `You are leadlurex, an AI sales prospecting assistant. Given a small business's profile, return a JSON array of REAL, publicly-known companies that plausibly match the ideal customer profile. Only include companies that actually exist in the public web/knowledge. Do NOT invent contact emails or phone numbers. For contact_hint, describe how to reach out (e.g. "Contact via their website contact form" or "Reach out via LinkedIn to their Head of Marketing"). Return ONLY valid JSON, no prose, no markdown.`;

    const user = `My business:
- Business type: ${data.businessType}
- What I sell: ${data.product}
- Who I want to sell to: ${data.targetCustomer}

${excludeList ? `IMPORTANT: Do NOT include any of these companies — they have already been suggested previously. Return only NEW, different companies:\n${excludeList}\n\n` : ""}Return a JSON object with a "leads" array of ${data.count} real companies. Each lead has:
{
  "company_name": string,
  "contact_person": string | null (a plausible role-based name if known, else null),
  "role": string (e.g. "Head of Marketing"),
  "website": string | null (real public URL),
  "industry": string,
  "location": string (city, country),
  "reason": string (1-2 sentences why this is a fit),
  "contact_hint": string (how to reach out)
}

Return ONLY {"leads": [...]}. No markdown fences.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
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
      if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits.");
      throw new Error(`AI request failed [${res.status}]: ${body}`);
    }

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { leads: [] };
    }
    const rawLeads = Array.isArray(parsed.leads) ? parsed.leads : [];
    const leads = rawLeads
      .map((l: unknown) => {
        const r = LeadSchema.safeParse(l);
        return r.success ? r.data : null;
      })
      .filter(Boolean) as z.infer<typeof LeadSchema>[];

    // Save to db
    const rows = leads.map((l) => ({
      user_id: context.userId,
      company_name: l.company_name,
      contact_person: l.contact_person ?? null,
      role: l.role ?? null,
      website: l.website ?? null,
      industry: l.industry ?? null,
      location: l.location ?? null,
      reason: l.reason ?? null,
      contact_hint: l.contact_hint ?? null,
    }));
    let inserted: { id: string; company_name: string }[] = [];
    if (rows.length > 0) {
      const { data: ins } = await context.supabase
        .from("leads")
        .insert(rows)
        .select("id, company_name, contact_person, role, website, industry, location, reason, contact_hint, saved");
      inserted = (ins as any) ?? [];
    }

    // Also persist onboarding answers to profile
    await context.supabase
      .from("profiles")
      .update({
        business_type: data.businessType,
        product: data.product,
        target_customer: data.targetCustomer,
        onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", context.userId);

    return { leads: inserted.length > 0 ? inserted : leads };
  });

export const setLeadSaved = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), saved: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("leads")
      .update({ saved: data.saved })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listSavedLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("leads")
      .select("id, company_name, contact_person, role, website, industry, location, reason, contact_hint, created_at")
      .eq("user_id", context.userId)
      .eq("saved", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { leads: data ?? [] };
  });
