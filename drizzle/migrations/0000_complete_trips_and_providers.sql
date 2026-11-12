ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'provider';

ALTER TABLE public.trip_routes ADD COLUMN IF NOT EXISTS trip_type text NOT NULL DEFAULT 'world_trip';
ALTER TABLE public.trip_routes ALTER COLUMN trip_type SET DEFAULT 'trip';
ALTER TABLE public.trip_routes ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE public.trip_routes ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE public.trip_routes ADD COLUMN IF NOT EXISTS travelers integer NOT NULL DEFAULT 1;
ALTER TABLE public.trip_routes ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE public.trip_routes ADD COLUMN IF NOT EXISTS original_prompt text;

CREATE TABLE public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  provider_type text NOT NULL DEFAULT 'accommodation',
  description text,
  website text,
  contact_email text,
  phone text,
  country text,
  city text,
  logo_url text,
  sustainability_info text,
  certifications text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.providers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.providers TO authenticated;
GRANT ALL ON public.providers TO service_role;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public sees approved providers" ON public.providers FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners see own provider" ON public.providers FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners create provider" ON public.providers FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update provider" ON public.providers FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete provider" ON public.providers FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Admins manage providers" ON public.providers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.provider_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  offer_type text NOT NULL DEFAULT 'accommodation',
  title text NOT NULL,
  description text,
  destination_id uuid REFERENCES public.destinations(id) ON DELETE SET NULL,
  location text,
  country text,
  price_from numeric,
  currency text NOT NULL DEFAULT 'EUR',
  price_unit text DEFAULT 'pro Nacht',
  image_url text,
  external_url text,
  sustainability_tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.provider_offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_offers TO authenticated;
GRANT ALL ON public.provider_offers TO service_role;
ALTER TABLE public.provider_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public sees approved offers" ON public.provider_offers FOR SELECT USING (
  status = 'approved' AND EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.status = 'approved'));
CREATE POLICY "Owners see own offers" ON public.provider_offers FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_id = auth.uid()));
CREATE POLICY "Owners create offers" ON public.provider_offers FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_id = auth.uid()));
CREATE POLICY "Owners update offers" ON public.provider_offers FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_id = auth.uid()));
CREATE POLICY "Owners delete offers" ON public.provider_offers FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_id = auth.uid()));
CREATE POLICY "Admins manage offers" ON public.provider_offers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Non-admins can never approve themselves: any owner insert/edit goes back to review
CREATE OR REPLACE FUNCTION public.enforce_moderation_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER providers_moderation BEFORE INSERT OR UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.enforce_moderation_status();
CREATE TRIGGER offers_moderation BEFORE INSERT OR UPDATE ON public.provider_offers FOR EACH ROW EXECUTE FUNCTION public.enforce_moderation_status();
CREATE TRIGGER providers_updated BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER offers_updated BEFORE UPDATE ON public.provider_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.trip_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.trip_routes(id) ON DELETE CASCADE,
  day_number integer,
  item_type text NOT NULL DEFAULT 'activity',
  title text NOT NULL,
  description text,
  location text,
  start_time text,
  end_time text,
  cost_planned numeric,
  cost_actual numeric,
  currency text NOT NULL DEFAULT 'EUR',
  booking_status text NOT NULL DEFAULT 'idea',
  link text,
  offer_id uuid REFERENCES public.provider_offers(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_items TO authenticated;
GRANT ALL ON public.trip_items TO service_role;
ALTER TABLE public.trip_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage trip items" ON public.trip_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trip_routes r WHERE r.id = route_id AND r.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.trip_routes r WHERE r.id = route_id AND r.user_id = auth.uid()));
CREATE TRIGGER trip_items_updated BEFORE UPDATE ON public.trip_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX trip_items_route_idx ON public.trip_items(route_id, day_number, sort_order);
CREATE INDEX provider_offers_provider_idx ON public.provider_offers(provider_id);

CREATE POLICY "Provider images public read" ON storage.objects FOR SELECT USING (bucket_id = 'provider-images');
CREATE POLICY "Users upload own provider images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'provider-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own provider images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'provider-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own provider images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'provider-images' AND (storage.foldername(name))[1] = auth.uid()::text);