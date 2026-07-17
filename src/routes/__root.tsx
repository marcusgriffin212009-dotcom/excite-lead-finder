import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gexcite — AI Lead Finder for Your Business" },
      { name: "description", content: "Gexcite is an AI-powered lead finding platform that surfaces real prospective customers for your business." },
      { property: "og:title", content: "Gexcite — AI Lead Finder" },
      { property: "og:description", content: "Find real leads for your business with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function TopBar() {
  return (
    <div className="border-b border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl px-6 py-2 text-center text-xs uppercase tracking-[0.35em]">
        Founded by Marcus R. Griffin
      </div>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <TopBar />
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between py-5">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="text-3xl italic tracking-tight">Gexcite</span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              &mdash; est. 2026
            </span>
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link to="/" className="italic hover:underline underline-offset-4">Home</Link>
            <Link to="/about" className="italic hover:underline underline-offset-4">About</Link>
            <Link to="/find-leads" className="italic hover:underline underline-offset-4">Find Leads</Link>
            <Link
              to="/auth"
              className="border border-foreground px-4 py-1.5 italic hover:bg-foreground hover:text-background"
            >
              Sign in →
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-3xl italic">Gexcite</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A small machine that reads the web, so you can spend your
              afternoons writing better emails.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Pages</p>
            <ul className="mt-4 space-y-2 text-sm italic">
              <li><Link to="/" className="hover:underline underline-offset-4">Home</Link></li>
              <li><Link to="/about" className="hover:underline underline-offset-4">About</Link></li>
              <li><Link to="/find-leads" className="hover:underline underline-offset-4">Find Leads</Link></li>
              <li><Link to="/auth" className="hover:underline underline-offset-4">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Colophon</p>
            <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">
              Set in Times New Roman.<br />
              Printed in dark grey &amp; white.<br />
              Powered by curiosity, and a large language model.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Gexcite</span>
          <span className="italic normal-case tracking-normal">Real leads, quietly gathered.</span>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background text-foreground" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
