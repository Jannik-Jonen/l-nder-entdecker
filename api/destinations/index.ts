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
  const countryCodesParam = url.searchParams.get('countryCodes') || '';
  const fields = url.searchParams.get('fields') || 'full';
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam && !Number.isNaN(Number(limitParam)) ? Math.max(1, Math.min(Number(limitParam), 500)) : null;
  const countryCodes = countryCodesParam
    .split(',')
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
  const debug = url.searchParams.get('debug') === '1';

  const fullColumns =
    'id,name,country,country_code,type,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count';
  const summaryColumns =
    'id,name,country,country_code,type,image_url,description,best_season,average_daily_cost,currency,source,parent_id,children_count';
  const lookupColumns =
    'id,name,country,country_code,type,image_url,source,parent_id,children_count';
  const columns = fields === 'summary' ? summaryColumns : fields === 'lookup' ? lookupColumns : fullColumns;

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
  let query = supabaseAdmin.from('destinations').select(columns as string).order('name', { ascending: true });

  if (type) query = query.eq('type', type);
  if (countryCode) query = query.eq('country_code', countryCode);
  if (countryCodes.length > 0) query = query.in('country_code', countryCodes);
  if (search) {
    const s = search.replace(/%/g, '\\%');
    query = query.or(`name.ilike.%${s}%,country.ilike.%${s}%`).limit(limit || 100);
  } else {
    query = query.limit(limit || 200);
  }

  const { data, error } = await query;
  if (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message }));
    return;
  }

  const rows = (data || []) as unknown as Array<{ name: string; country: string; description?: string | null; type: string }>;
  if (search) {
    const normalize = (value: string) =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
    const q = normalize(search);
    const qWord = q.split(/\s+/).filter(Boolean)[0] || q;
    const scoreText = (text: string) => {
      if (text === q) return 100;
      if (text.startsWith(q)) return 80;
      if (text === qWord) return 60;
      if (text.startsWith(qWord)) return 40;
      if (text.includes(q)) return 20;
      if (text.includes(qWord)) return 10;
      return 0;
    };
    const scoreRow = (row: (typeof rows)[number]) => {
      const name = normalize(row.name);
      const country = normalize(row.country);
      const nameScore = scoreText(name);
      const countryScore = scoreText(country);
      let score = nameScore * 2 + countryScore;
      if (country === q && row.type === 'country') score += 60;
      if (name === q && row.type === 'city') score += 20;
      if (name === q && row.type === 'region') score += 15;
      return score;
    };
    rows.sort((a, b) => {
      const aScore = scoreRow(a);
      const bScore = scoreRow(b);
      if (aScore !== bScore) return bScore - aScore;
      return a.name.localeCompare(b.name);
    });
    rows.splice(50);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(rows));
}
