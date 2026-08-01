import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const FIELDS =
  "id, company_name, contact_person, role, website, industry, location, reason, contact_hint, saved, created_at";

export default defineTool({
  name: "list_leads",
  title: "List leads",
  description:
    "List the signed-in user's leadlurex leads, newest first. Optionally restrict to leads saved to their Lead List.",
  inputSchema: {
    savedOnly: z.boolean().default(false).describe("Only return leads saved to the Lead List."),
    limit: z.number().int().min(1).max(100).default(25).describe("Maximum number of leads to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ savedOnly, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("leads")
      .select(FIELDS)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (savedOnly) query = query.eq("saved", true);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { leads: data ?? [] },
    };
  },
});
