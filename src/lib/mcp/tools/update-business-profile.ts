import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_business_profile",
  title: "Update business profile",
  description:
    "Update the signed-in user's leadlurex onboarding answers: business type, what they sell, and who they sell to.",
  inputSchema: {
    businessType: z.string().trim().min(1).max(200).optional(),
    product: z.string().trim().min(1).max(500).optional(),
    targetCustomer: z.string().trim().min(1).max(500).optional(),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ businessType, product, targetCustomer }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (businessType !== undefined) patch.business_type = businessType;
    if (product !== undefined) patch.product = product;
    if (targetCustomer !== undefined) patch.target_customer = targetCustomer;
    if (Object.keys(patch).length === 1) {
      return {
        content: [{ type: "text", text: "Provide at least one field to update." }],
        isError: true,
      };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", ctx.getUserId())
      .select("business_type, product, target_customer");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data?.[0] ?? {}) }],
      structuredContent: { profile: data?.[0] ?? null },
    };
  },
});
