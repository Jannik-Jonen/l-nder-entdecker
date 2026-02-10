CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_destinations_name_trgm
  ON public.destinations
  USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_destinations_country_trgm
  ON public.destinations
  USING gin (country gin_trgm_ops);
