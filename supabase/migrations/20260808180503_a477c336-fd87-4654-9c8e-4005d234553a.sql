CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscribed boolean NOT NULL DEFAULT false,
  plan text,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_subscription_select" ON public.subscribers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.lead_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.lead_searches TO authenticated;
GRANT ALL ON public.lead_searches TO service_role;

ALTER TABLE public.lead_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_searches_select" ON public.lead_searches
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "own_searches_insert" ON public.lead_searches
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_lead_searches_user_created ON public.lead_searches (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();