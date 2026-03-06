
-- Trip routes (overarching journey, e.g. "Weltreise 2026")
CREATE TABLE public.trip_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Meine Weltreise',
  description text,
  status text NOT NULL DEFAULT 'planning',
  total_budget numeric,
  budget_currency text DEFAULT 'EUR',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routes" ON public.trip_routes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own routes" ON public.trip_routes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own routes" ON public.trip_routes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own routes" ON public.trip_routes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trip stops within a route
CREATE TABLE public.trip_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.trip_routes(id) ON DELETE CASCADE,
  destination_name text NOT NULL,
  destination_code text,
  image_url text,
  coords_lat numeric,
  coords_lon numeric,
  start_date date,
  end_date date,
  daily_budget numeric,
  currency text DEFAULT 'EUR',
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  transport_to_next text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stops" ON public.trip_stops FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trip_routes WHERE id = trip_stops.route_id AND user_id = auth.uid()));
CREATE POLICY "Users can create own stops" ON public.trip_stops FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.trip_routes WHERE id = trip_stops.route_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own stops" ON public.trip_stops FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trip_routes WHERE id = trip_stops.route_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own stops" ON public.trip_stops FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trip_routes WHERE id = trip_stops.route_id AND user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_trip_routes BEFORE UPDATE ON public.trip_routes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_trip_stops BEFORE UPDATE ON public.trip_stops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
