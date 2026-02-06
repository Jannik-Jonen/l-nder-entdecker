ALTER TABLE public.destinations
ADD COLUMN IF NOT EXISTS types TEXT[];

UPDATE public.destinations
SET types = ARRAY[type]
WHERE types IS NULL;
