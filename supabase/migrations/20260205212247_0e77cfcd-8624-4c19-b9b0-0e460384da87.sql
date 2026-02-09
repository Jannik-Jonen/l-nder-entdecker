-- Destinationen-Katalog (von Admin gepflegt)
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT,
  type TEXT NOT NULL DEFAULT 'city' CHECK (type IN ('country', 'island', 'city', 'region')),
  image_url TEXT,
  description TEXT,
  highlights TEXT[],
  best_season TEXT,
  average_daily_cost NUMERIC,
  currency TEXT DEFAULT 'EUR',
  visa_info TEXT,
  vaccination_info TEXT,
  health_safety_info TEXT,
  source TEXT,
  parent_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  coords_lat NUMERIC,
  coords_lon NUMERIC,
  children_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index für Performance
CREATE INDEX idx_destinations_type ON public.destinations(type);
CREATE INDEX idx_destinations_country_code ON public.destinations(country_code);
CREATE INDEX idx_destinations_parent_id ON public.destinations(parent_id);
CREATE UNIQUE INDEX idx_destinations_unique_name_country_type ON public.destinations(name, country, type);

-- RLS aktivieren
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Jeder kann Destinationen lesen (öffentlicher Katalog)
CREATE POLICY "Anyone can view destinations"
  ON public.destinations FOR SELECT
  USING (true);

-- Guide Posts (Destinations-verknüpft)
CREATE TABLE public.guide_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  tags TEXT[],
  sources TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_guide_posts_destination ON public.guide_posts(destination_id);
CREATE INDEX idx_guide_posts_status ON public.guide_posts(status);

ALTER TABLE public.guide_posts ENABLE ROW LEVEL SECURITY;

-- Veröffentlichte Posts kann jeder lesen
CREATE POLICY "Anyone can view published guide posts"
  ON public.guide_posts FOR SELECT
  USING (status = 'published');

-- Autoren können eigene Posts sehen
CREATE POLICY "Authors can view own guide posts"
  ON public.guide_posts FOR SELECT
  USING (auth.uid() = author_id);

-- Autoren können Posts erstellen
CREATE POLICY "Users can create guide posts"
  ON public.guide_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Autoren können eigene Posts bearbeiten
CREATE POLICY "Authors can update own guide posts"
  ON public.guide_posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Autoren können eigene Posts löschen
CREATE POLICY "Authors can delete own guide posts"
  ON public.guide_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Blog Posts (allgemeine Reisetipps, nicht an Destination gebunden)
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  tags TEXT[],
  sources TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Veröffentlichte Posts kann jeder lesen
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

-- Autoren können eigene Posts sehen
CREATE POLICY "Authors can view own blog posts"
  ON public.blog_posts FOR SELECT
  USING (auth.uid() = author_id);

-- Autoren können Posts erstellen
CREATE POLICY "Users can create blog posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Autoren können eigene Posts bearbeiten
CREATE POLICY "Authors can update own blog posts"
  ON public.blog_posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Autoren können eigene Posts löschen
CREATE POLICY "Authors can delete own blog posts"
  ON public.blog_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Trigger für updated_at
CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guide_posts_updated_at
  BEFORE UPDATE ON public.guide_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
