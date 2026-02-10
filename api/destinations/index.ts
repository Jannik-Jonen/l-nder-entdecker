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

  const FALLBACK_SUPABASE_URL = 'https://axdldqmknnjngxqqurlg.supabase.co';
  const FALLBACK_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_qLxYKroavOk5b6mb2PRc3w_kQB9oEGQ';
  const pickEnv = (entries: Array<[string, string | undefined]>, fallback: string) => {
    for (const [label, value] of entries) {
      const trimmed = value?.trim();
      if (trimmed) return { value: trimmed, source: label };
    }
    return { value: fallback, source: 'fallback' };
  };
  const supabaseUrlPick = pickEnv(
    [
      ['SUPABASE_URL', process.env.SUPABASE_URL],
      ['VITE_SUPABASE_URL', process.env.VITE_SUPABASE_URL],
    ],
    FALLBACK_SUPABASE_URL
  );
  const supabaseKeyPick = pickEnv(
    [
      ['SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY],
      ['SUPABASE_ANON_KEY', process.env.SUPABASE_ANON_KEY],
      ['SUPABASE_PUBLISHABLE_KEY', process.env.SUPABASE_PUBLISHABLE_KEY],
      ['VITE_SUPABASE_ANON_KEY', process.env.VITE_SUPABASE_ANON_KEY],
      ['VITE_SUPABASE_PUBLISHABLE_KEY', process.env.VITE_SUPABASE_PUBLISHABLE_KEY],
    ],
    FALLBACK_SUPABASE_PUBLISHABLE_KEY
  );
  const supabaseUrl = supabaseUrlPick.value;
  const supabaseKey = supabaseKeyPick.value;

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
  const debug = url.searchParams.get('debug') === '1';

  const columns =
    'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count';

  const normalizedSupabaseUrl = /^https?:\/\//i.test(supabaseUrl)
    ? supabaseUrl
    : `https://${supabaseUrl}`;
  if (debug) {
    let restProbe: { ok: boolean; status?: number; error?: string } = { ok: false };
    try {
      const probe = await fetch(
        `${normalizedSupabaseUrl}/rest/v1/destinations?select=id&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      restProbe = { ok: probe.ok, status: probe.status };
    } catch (error) {
      restProbe = { ok: false, error: (error as Error).message };
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        supabaseUrlSource: supabaseUrlPick.source,
        supabaseKeySource: supabaseKeyPick.source,
        supabaseUrl: normalizedSupabaseUrl,
        restProbe,
      })
    );
    return;
  }
  const supabaseAdmin = createClient(normalizedSupabaseUrl, supabaseKey);
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

  const rows = (data || []) as Array<{ name: string; country: string; description?: string | null; type: string }>;
  if (search) {
    const q = search.toLowerCase();
    const word = q.split(/\s+/).filter(Boolean)[0] || q;
    const score = (text: string) => {
      if (text === q) return 5;
      if (text.startsWith(q)) return 4;
      if (text === word) return 3;
      if (text.startsWith(word)) return 2;
      if (text.includes(q)) return 1;
      return 0;
    };
    const typeBoost = (type: string) => (type === 'city' ? 0.4 : type === 'region' ? 0.3 : type === 'country' ? 0.2 : 0);
    rows.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aScore = score(aName) + score(a.country.toLowerCase()) + typeBoost(a.type);
      const bScore = score(bName) + score(b.country.toLowerCase()) + typeBoost(b.type);
      if (aScore !== bScore) return bScore - aScore;
      return aName.localeCompare(bName);
    });
    rows.splice(10);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(rows));
}
