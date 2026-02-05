import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const supabaseUntyped = supabase as SupabaseClient;
