import { auth, defineMcp } from "@lovable.dev/mcp-js";
import findLeadsTool from "./tools/find-leads";
import listLeadsTool from "./tools/list-leads";
import setLeadSavedTool from "./tools/set-lead-saved";
import getBusinessProfileTool from "./tools/get-business-profile";
import updateBusinessProfileTool from "./tools/update-business-profile";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "leadlurex",
  title: "leadlurex",
  version: "0.1.0",
  instructions:
    "Tools for leadlurex, an AI lead finder. Use get_business_profile to learn the user's business, find_leads to generate new prospects, list_leads to read existing ones, and set_lead_saved to manage their Lead List.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    findLeadsTool,
    listLeadsTool,
    setLeadSavedTool,
    getBusinessProfileTool,
    updateBusinessProfileTool,
  ],
});
