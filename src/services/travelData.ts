import { Destination } from '@/types/travel';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { isLocalSupabase } from '@/integrations/supabase/client';
import migrationRaw from '../../supabase/migrations/20260210153000_expand_destinations_countries.sql?raw';

interface WikiSection {
  toclevel: number;
  level: string;
  line: string;
  number: string;
  index: string;
  fromtitle: string;
  byteoffset: number;
  anchor: string;
}

interface WikiParseResult {
  parse: {
    title: string;
    pageid: number;
    text: {
      '*': string;
    };
    sections: WikiSection[];
    images: string[];
  };
}

// Fallback data for costs and currencies if not found in text
const COUNTRY_DATA: Record<string, { currency: string; cost: number; region: string }> = {
  // Asia
  'thailand': { currency: 'THB', cost: 45, region: 'asia' },
  'vietnam': { currency: 'VND', cost: 40, region: 'asia' },
  'japan': { currency: 'JPY', cost: 120, region: 'asia' },
  'indonesia': { currency: 'IDR', cost: 35, region: 'asia' },
  'india': { currency: 'INR', cost: 30, region: 'asia' },
  // Europe
  'germany': { currency: 'EUR', cost: 100, region: 'europe' },
  'france': { currency: 'EUR', cost: 110, region: 'europe' },
  'italy': { currency: 'EUR', cost: 105, region: 'europe' },
  'spain': { currency: 'EUR', cost: 90, region: 'europe' },
  'uk': { currency: 'GBP', cost: 115, region: 'europe' },
  // Americas
  'usa': { currency: 'USD', cost: 150, region: 'americas' },
  'canada': { currency: 'CAD', cost: 130, region: 'americas' },
  'mexico': { currency: 'MXN', cost: 60, region: 'americas' },
  'brazil': { currency: 'BRL', cost: 70, region: 'americas' },
  // Oceania
  'australia': { currency: 'AUD', cost: 120, region: 'oceania' },
  'new zealand': { currency: 'NZD', cost: 110, region: 'oceania' },
};

const getCountryData = (text: string, title: string) => {
  const lowerText = (text + ' ' + title).toLowerCase();
  for (const [country, data] of Object.entries(COUNTRY_DATA)) {
    if (lowerText.includes(country)) {
      return data;
    }
  }
  return { currency: 'EUR', cost: 85, region: 'unknown' }; // Default
};

const cleanWikiText = (html: string): string => {
  return html
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\[\d+\]/g, '') // Remove citations like [1]
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
};

export const fetchRichDestinationData = async (query: string): Promise<Partial<Destination> | null> => {
  try {
    const countryData = getCountryData(query, query);
    const baseHighlightsCity = ['Altstadt', 'Museen', 'Aussichtspunkte', 'Parks', 'Märkte'];
    const baseHighlightsIsland = ['Strände', 'Schnorchelspots', 'Bootstouren', 'Leuchttürme', 'Küstenpfade'];
    const baseHighlightsRegion = ['Panoramarouten', 'Naturparks', 'Aussichtspunkte', 'Kulinarik', 'Kulturorte'];
    const baseHighlightsCountry = ['Hauptstädte', 'Nationalparks', 'Kulturstätten', 'Küsten', 'Gebirge'];
    const name = query.trim();
    const description = `${name} bietet Highlights und praktische Reisetipps basierend auf kuratierten Quellen.`;
    const imageUrl = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
    return {
      description,
      imageUrl,
      highlights: baseHighlightsCity,
      averageDailyCost: countryData.cost,
      currency: countryData.currency,
      bestSeason: 'Ganzjährig',
      visaInfo: 'Einreisebestimmungen vor Reise prüfen.',
      healthSafetyInfo: 'Gesundheits- und Sicherheitshinweise beachten.',
    };
  } catch (error) {
    console.error('Error building aggregated travel data:', error);
    return null;
  }
};

type DestinationRow = {
  id: string;
  name: string;
  country: string;
  country_code: string | null;
  type: 'country' | 'island' | 'city' | 'region';
  types?: Array<'country' | 'island' | 'city' | 'region'> | null;
  image_url: string | null;
  description: string | null;
  highlights: string[] | null;
  best_season: string | null;
  average_daily_cost: number | null;
  currency: string | null;
  visa_info: string | null;
  vaccination_info: string | null;
  health_safety_info: string | null;
  source: string | null;
  parent_id: string | null;
  coords_lat: number | null;
  coords_lon: number | null;
  children_count: number | null;
  created_at?: string;
  updated_at?: string;
};

const fromDestinations = () => supabaseUntyped.from('destinations');

const rankDestinations = (list: Destination[], search?: string) => {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  const query = search?.trim();
  if (!query) return list;
  const q = normalize(query);
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
  const scoreRow = (row: Destination) => {
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
  return list
    .slice()
    .sort((a, b) => {
      const aScore = scoreRow(a);
      const bScore = scoreRow(b);
      if (aScore !== bScore) return bScore - aScore;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10);
};

const fallbackDestinationImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';

const flagFromCountryCode = (countryCode?: string | null) => {
  if (!countryCode) return null;
  return `https://flagcdn.com/w1280/${countryCode.toLowerCase()}.png`;
};

const genericDescription = 'Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.';
const genericHighlights = ['Hauptstadt', 'Natur', 'Kultur', 'Kulinarik'];
const genericVisaInfo = 'Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.';
const genericVaccinationInfo = 'Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.';
const genericHealthSafetyInfo = 'Aktuelle Reise- und Sicherheitshinweise beachten.';

const migrationImageMap = (() => {
  try {
    const match = migrationRaw.match(/jsonb_to_recordset\(\s*'([\s\S]*?)'\s*::jsonb\s*\)/);
    if (!match) return null;
    const jsonText = match[1].replace(/''/g, "'");
    const data = JSON.parse(jsonText) as Array<{
      country_code?: string;
      image_url?: string;
      name?: string;
      country?: string;
    }>;
    const map = new Map<string, string>();
    data.forEach((entry) => {
      const url = entry?.image_url;
      if (!url) return;
      if (entry?.country_code) map.set(String(entry.country_code).toUpperCase(), url);
      if (entry?.name) map.set(`name:${String(entry.name).toLowerCase()}`, url);
      if (entry?.country) map.set(`country:${String(entry.country).toLowerCase()}`, url);
    });
    return map;
  } catch {
    return null;
  }
})();

type MigrationEntry = {
  name?: string;
  country?: string;
  country_code?: string;
  description?: string;
  highlights?: string[];
  best_season?: string;
  average_daily_cost?: number;
  currency?: string | null;
  visa_info?: string;
  vaccination_info?: string;
  health_safety_info?: string;
  source?: string;
};

const migrationDataMap = (() => {
  try {
    const match = migrationRaw.match(/jsonb_to_recordset\(\s*'([\s\S]*?)'\s*::jsonb\s*\)/);
    if (!match) return null;
    const jsonText = match[1].replace(/''/g, "'");
    const data = JSON.parse(jsonText) as MigrationEntry[];
    const map = new Map<string, MigrationEntry>();
    data.forEach((entry) => {
      if (entry?.country_code) map.set(String(entry.country_code).toUpperCase(), entry);
      if (entry?.name) map.set(`name:${String(entry.name).toLowerCase()}`, entry);
      if (entry?.country) map.set(`country:${String(entry.country).toLowerCase()}`, entry);
    });
    return map;
  } catch {
    return null;
  }
})();

const getMigrationData = (row: DestinationRow): MigrationEntry | null => {
  if (!migrationDataMap) return null;
  if (row.country_code) {
    const byCode = migrationDataMap.get(row.country_code.toUpperCase());
    if (byCode) return byCode;
  }
  const byName = migrationDataMap.get(`name:${row.name.toLowerCase()}`);
  if (byName) return byName;
  return migrationDataMap.get(`country:${row.country.toLowerCase()}`) || null;
};

const applyMigrationFallback = (row: DestinationRow): DestinationRow => {
  const migration = getMigrationData(row);
  if (!migration) return row;
  return {
    ...row,
    description: row.description?.trim() ? row.description : migration.description ?? row.description,
    highlights:
      Array.isArray(row.highlights) && row.highlights.length > 0
        ? row.highlights
        : migration.highlights ?? row.highlights,
    best_season: row.best_season?.trim() ? row.best_season : migration.best_season ?? row.best_season,
    average_daily_cost:
      typeof row.average_daily_cost === 'number'
        ? row.average_daily_cost
        : migration.average_daily_cost ?? row.average_daily_cost,
    currency: row.currency?.trim() ? row.currency : migration.currency ?? row.currency,
    visa_info: row.visa_info?.trim() ? row.visa_info : migration.visa_info ?? row.visa_info,
    vaccination_info: row.vaccination_info?.trim()
      ? row.vaccination_info
      : migration.vaccination_info ?? row.vaccination_info,
    health_safety_info: row.health_safety_info?.trim()
      ? row.health_safety_info
      : migration.health_safety_info ?? row.health_safety_info,
    source: row.source?.trim() ? row.source : migration.source ?? row.source,
  };
};

const getMigrationImage = (row: DestinationRow) => {
  if (!migrationImageMap) return null;
  const byCode = row.country_code ? migrationImageMap.get(row.country_code.toUpperCase()) : null;
  if (byCode) return byCode;
  const byName = migrationImageMap.get(`name:${row.name.toLowerCase()}`);
  if (byName) return byName;
  return migrationImageMap.get(`country:${row.country.toLowerCase()}`) || null;
};

const sanitizeGeneratedRow = (row: DestinationRow): DestinationRow => {
  if (row.source !== 'generated') return row;
  const descriptionMatches = row.description?.trim() === genericDescription;
  const highlightsMatches =
    Array.isArray(row.highlights) &&
    row.highlights.length === genericHighlights.length &&
    row.highlights.every((h) => genericHighlights.includes(h));
  const visaMatches = row.visa_info?.trim() === genericVisaInfo;
  const vaccinationMatches = row.vaccination_info?.trim() === genericVaccinationInfo;
  const healthMatches = row.health_safety_info?.trim() === genericHealthSafetyInfo;
  const bestSeasonMatches = row.best_season?.trim() === 'Ganzjährig';

  if (!descriptionMatches && !highlightsMatches && !visaMatches && !vaccinationMatches && !healthMatches && !bestSeasonMatches) {
    return row;
  }

  return {
    ...row,
    description: descriptionMatches ? null : row.description,
    highlights: highlightsMatches ? null : row.highlights,
    best_season: bestSeasonMatches ? null : row.best_season,
    visa_info: visaMatches ? null : row.visa_info,
    vaccination_info: vaccinationMatches ? null : row.vaccination_info,
    health_safety_info: healthMatches ? null : row.health_safety_info,
  };
};

const resolveDestinationImage = (row: DestinationRow) => {
  const migrationImage = getMigrationImage(row);
  if (migrationImage) return migrationImage;
  const imageUrl = row.image_url;
  if (imageUrl) return imageUrl;
  const flag = flagFromCountryCode(row.country_code);
  if (flag) return flag;
  return fallbackDestinationImage;
};

const toDestination = (row: DestinationRow): Destination => {
  const sanitized = sanitizeGeneratedRow(row);
  const enriched = applyMigrationFallback(sanitized);
  return {
    id: enriched.id,
    name: enriched.name,
    country: enriched.country,
    countryCode: enriched.country_code || undefined,
    type: enriched.type,
    types: Array.isArray(enriched.types) ? enriched.types : undefined,
    imageUrl: resolveDestinationImage(enriched),
    description: enriched.description || '',
    highlights: Array.isArray(enriched.highlights) ? enriched.highlights : [],
    bestSeason: enriched.best_season || '',
    averageDailyCost: typeof enriched.average_daily_cost === 'number' ? enriched.average_daily_cost : 0,
    currency: enriched.currency || 'EUR',
    visaInfo: enriched.visa_info || undefined,
    vaccinationInfo: enriched.vaccination_info || undefined,
    healthSafetyInfo: enriched.health_safety_info || undefined,
    source: enriched.source || undefined,
    parentId: enriched.parent_id || undefined,
    coords:
      typeof enriched.coords_lat === 'number' && typeof enriched.coords_lon === 'number'
        ? { lat: enriched.coords_lat, lon: enriched.coords_lon }
        : undefined,
    childrenCount: typeof enriched.children_count === 'number' ? enriched.children_count : undefined,
  };
};

export const fetchDestinationsCatalog = async (_opts?: {
  type?: Destination['type'];
  countryCode?: string;
  countryCodes?: string[];
  search?: string;
}): Promise<Destination[]> => {
  try {
    const columns = isLocalSupabase
      ? 'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count'
      : 'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count';
    const search = _opts?.search?.trim();
    const isLocalHost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const canUseApi = !isLocalSupabase && !isLocalHost;
    const countryCodes =
      _opts?.countryCodes?.map((code) => code.trim().toUpperCase()).filter(Boolean) ?? [];
    if (canUseApi) {
      let apiData: DestinationRow[] | null = null;
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (_opts?.type) params.set('type', _opts.type);
        if (_opts?.countryCode) params.set('countryCode', _opts.countryCode);
        if (countryCodes.length > 0) params.set('countryCodes', countryCodes.join(','));
        const response = await fetch(`/api/destinations?${params.toString()}`);
        if (response.ok) apiData = (await response.json()) as DestinationRow[];
      } catch (error) {
        apiData = null;
      }
      if (apiData && (search || apiData.length > 0)) {
        const mapped = apiData.map(toDestination);
        if (search && mapped.length === 0) return [];
        return search ? rankDestinations(mapped, search) : mapped;
      }
    }
    if (isLocalSupabase) {
      const { data, error } = await fromDestinations()
        .select(columns)
        .order('name', { ascending: true });
      if (error) throw error;
      let rows = (data || []) as DestinationRow[];
      if (_opts?.type) {
        rows = rows.filter((row) => row.type === _opts.type || (Array.isArray(row.types) && row.types.includes(_opts.type)));
      }
      if (_opts?.countryCode) {
        const code = _opts.countryCode.toUpperCase();
        rows = rows.filter((row) => (row.country_code || '').toUpperCase() === code);
      }
      if (countryCodes.length > 0) {
        rows = rows.filter((row) => countryCodes.includes((row.country_code || '').toUpperCase()));
      }
      if (search) {
        const s = search.toLowerCase();
        rows = rows.filter((row) =>
          row.name.toLowerCase().includes(s) ||
          row.country.toLowerCase().includes(s) ||
          (row.description || '').toLowerCase().includes(s)
        );
      }
      const mapped = rows.map(toDestination);
      if (search && mapped.length === 0) return [];
      return search ? rankDestinations(mapped, search) : mapped;
    }
    let query = fromDestinations()
      .select(columns)
      .order('name', { ascending: true });
    if (_opts?.type) query = query.contains('types', [_opts.type]);
    if (_opts?.countryCode) query = query.eq('country_code', _opts.countryCode);
    if (countryCodes.length > 0) query = query.in('country_code', countryCodes);
    if (search) {
      const s = search.replace(/%/g, '\\%');
      query = query.or(`name.ilike.%${s}%,country.ilike.%${s}%`).limit(100);
    }
    const { data, error } = await query;
    if (error) throw error;
    const rows = (data || []) as DestinationRow[];
    const mapped = rows.map(toDestination);
    if (search && mapped.length === 0) return [];
    return search ? rankDestinations(mapped, search) : mapped;
  } catch {
    return [];
  }
};

export const getDestinationById = async (_id: string): Promise<Destination | null> => {
  try {
  const columns = isLocalSupabase
      ? 'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count'
      : 'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count';
    const { data, error } = await fromDestinations()
      .select(columns)
      .eq('id', _id)
      .single();
    if (error) throw error;
    if (!data) return null;
    return toDestination(data as DestinationRow);
  } catch {
    return null;
  }
};

export const getChildren = async (_id: string, _type?: Destination['type']): Promise<Destination[]> => {
  try {
  const columns = isLocalSupabase
      ? 'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count'
      : 'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count';
    if (isLocalSupabase) {
      const { data, error } = await fromDestinations()
        .select(columns)
        .eq('parent_id', _id)
        .order('name', { ascending: true });
      if (error) throw error;
      let rows = (data || []) as DestinationRow[];
      if (_type) rows = rows.filter((row) => row.type === _type || (Array.isArray(row.types) && row.types.includes(_type)));
      return rows.map(toDestination);
    }
    let query = fromDestinations()
      .select(columns)
      .eq('parent_id', _id)
      .order('name', { ascending: true });
    if (_type) query = query.contains('types', [_type]);
    const { data, error } = await query;
    if (error) throw error;
    const rows = (data || []) as DestinationRow[];
    return rows.map(toDestination);
  } catch {
    return [];
  }
};

export const getAncestors = async (_id: string): Promise<Destination[]> => {
  const result: Destination[] = [];
  try {
    let currentId: string | null = _id;
    for (let i = 0; i < 10; i++) {
      if (!currentId) break;
      const { data } = await fromDestinations()
        .select('id,name,country,country_code,type,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count')
        .eq('id', currentId)
        .single();
      if (!data) break;
      const dest = toDestination(data as DestinationRow);
      result.push(dest);
      currentId = dest.parentId || null;
    }
    return result;
  } catch {
    return result;
  }
};
