DROP POLICY IF EXISTS "Authenticated users can insert destinations" ON public.destinations;
DROP POLICY IF EXISTS "Authenticated users can update destinations" ON public.destinations;

CREATE POLICY "Admin can insert destinations" ON public.destinations
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'jannik.jonen@gmail.com');

CREATE POLICY "Admin can update destinations" ON public.destinations
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'jannik.jonen@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'jannik.jonen@gmail.com');
