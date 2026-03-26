CREATE TABLE public.sync_test (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.sync_test ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sync test" ON public.sync_test
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated can insert sync test" ON public.sync_test
  FOR INSERT TO authenticated WITH CHECK (true);