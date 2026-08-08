import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setRememberMe } from "@/lib/remember";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to leadlurex" },
      { name: "description", content: "Sign in or start your leadlurex free trial." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    const next =
      typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//")
        ? s.next
        : undefined;
    return next ? { next } : {};
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    const go = () => {
      let target = next;
      if (!target) {
        try {
          const stored = sessionStorage.getItem("postAuthNext");
          if (stored && stored.startsWith("/") && !stored.startsWith("//")) target = stored;
          sessionStorage.removeItem("postAuthNext");
        } catch {
          /* ignore */
        }
      }
      if (target) {
        window.location.href = target;
      } else {
        navigate({ to: "/find-leads" });
      }
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) go();
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go();
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    setRememberMe(remember);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: next ? window.location.origin + next : window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setInfo("Account created. If email confirmation is enabled, check your inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    setRememberMe(remember);
    try {
      if (next) sessionStorage.setItem("postAuthNext", next);
    } catch {
      /* ignore */
    }
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(result.error.message ?? "Google sign-in failed");
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return; // browser is navigating to Google
      // Tokens received and session set — the auth listener above handles the redirect.
    } catch (err: any) {
      setError(err?.message ?? "Google sign-in failed");
      setGoogleLoading(false);
    }
  };


  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-6 py-12">
      <div className="w-full bg-card p-10 text-card-foreground">
        <h1 className="text-3xl">
          {mode === "signup" ? "Start your free trial" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "14 days free. No card required."
            : "Sign in to find your next leads."}
        </p>

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="mt-6 w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground hover:bg-accent disabled:opacity-50"
        >
          {googleLoading ? "Opening Google..." : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
            </div>
          )}
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 border border-border"
            />
            <span>Remember me</span>
          </label>


          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          {mode === "signup" ? "Already have an account?" : "New to leadlurex?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="underline"
          >
            {mode === "signup" ? "Sign in" : "Start free trial"}
          </button>
        </p>
      </div>
    </div>
  );
}
