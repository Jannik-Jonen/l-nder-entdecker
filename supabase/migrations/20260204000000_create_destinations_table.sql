-- Create destinations table
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT,
    type TEXT CHECK (type IN ('country', 'island', 'city', 'region')),
    image_url TEXT,
    description TEXT,
    highlights TEXT[],
    best_season TEXT,
    average_daily_cost NUMERIC,
    currency TEXT,
    visa_info TEXT,
    vaccination_info TEXT,
    health_safety_info TEXT,
    source TEXT,
    parent_id UUID REFERENCES public.destinations(id),
    coords_lat DOUBLE PRECISION,
    coords_lon DOUBLE PRECISION,
    children_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON public.destinations
    FOR SELECT
    USING (true);

-- Create policy for authenticated users (admins) to insert/update/delete
-- Assuming service role bypasses RLS, but explicit policy for authenticated users if needed
-- For now, read-only for public is the main requirement. 
-- We can add admin policies later if specific auth logic is defined.

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_destinations_updated_at
    BEFORE UPDATE ON public.destinations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
