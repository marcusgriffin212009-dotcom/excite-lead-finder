import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "set_lead_saved",
  title: "Save or unsave a lead",
  description:
    "Add a lead to the user's Lead List, or remove it, by lead id. Use list_leads to find ids.",
  inputSchema: {
    id: z.string().uuid().describe("The lead id."),
    saved: z.boolean().describe("true to save to the Lead List, false to remove it."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, saved }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("leads")
      .update({ saved })
      .eq("id", id)
      .select("id, company_name, saved");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data || data.length === 0) {
      return { content: [{ type: "text", text: `No lead found with id ${id}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data[0]) }],
      structuredContent: { lead: data[0] },
    };
  },
});
