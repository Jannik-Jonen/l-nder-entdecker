CREATE POLICY "Authenticated users can insert destinations" ON public.destinations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update destinations" ON public.destinations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
