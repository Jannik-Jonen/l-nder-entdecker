
-- Create destination_notes table for global per-destination notes
CREATE TABLE public.destination_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

-- Enable RLS
ALTER TABLE public.destination_notes ENABLE ROW LEVEL SECURITY;

-- Users can view own notes
CREATE POLICY "Users can view own destination notes"
ON public.destination_notes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create own notes
CREATE POLICY "Users can create destination notes"
ON public.destination_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update own notes
CREATE POLICY "Users can update own destination notes"
ON public.destination_notes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete own notes
CREATE POLICY "Users can delete own destination notes"
ON public.destination_notes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE TRIGGER update_destination_notes_updated_at
BEFORE UPDATE ON public.destination_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
