import { createClient } from '@supabase/supabase-js';
import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(
  req: IncomingMessage & { method?: string; url?: string },
  res: ServerResponse
) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing Supabase configuration' }));
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  const search = (url.searchParams.get('search') || '').trim();
  const type = url.searchParams.get('type') || undefined;
  const countryCode = url.searchParams.get('countryCode') || undefined;

  const columns =
    'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count';

  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
  let query = supabaseAdmin.from('destinations').select(columns).order('name', { ascending: true });

  if (type) query = query.contains('types', [type]);
  if (countryCode) query = query.eq('country_code', countryCode);
  if (search) {
    const s = search.replace(/%/g, '\\%');
    query = query.or(`name.ilike.%${s}%,country.ilike.%${s}%`).limit(100);
  } else {
    query = query.limit(200);
  }

  const { data, error } = await query;
  if (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data || []));
}
