import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL (contains tokens from OAuth)
        const hash = window.location.hash;
        
        if (!hash) {
          // No hash means OAuth didn't complete properly
          setError("OAuth callback incomplete. Please try signing in again.");
          setLoading(false);
          return;
        }

        // The tokens should be handled by lovable.auth automatically
        // Just verify the session was established
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Session established, redirect to the app
          window.location.href = "/find-leads";
        } else {
          setError("Failed to establish session. Please try signing in again.");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError(err instanceof Error ? err.message : "An error occurred during sign-in");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-6 py-12">
        <div className="w-full bg-card p-10 text-card-foreground text-center">
          <p className="text-sm text-muted-foreground">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-6 py-12">
        <div className="w-full bg-card p-10 text-card-foreground">
          <h1 className="text-2xl text-destructive">Sign-in Error</h1>
          <p className="mt-4 text-sm text-muted-foreground">{error}</p>
          <a
            href="/auth"
            className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    );
  }

  return null;
}
