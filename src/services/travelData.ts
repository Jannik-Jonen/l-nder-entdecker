import { Destination } from '@/types/travel';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { isLocalSupabase } from '@/integrations/supabase/client';
import { inspirationDestinations } from '@/data/mockData';

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

const toDestination = (row: DestinationRow): Destination => ({
  id: row.id,
  name: row.name,
  country: row.country,
  countryCode: row.country_code || undefined,
  type: row.type,
  types: Array.isArray(row.types) ? row.types : undefined,
  imageUrl: row.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
  description: row.description || '',
  highlights: Array.isArray(row.highlights) ? row.highlights : [],
  bestSeason: row.best_season || '',
  averageDailyCost: typeof row.average_daily_cost === 'number' ? row.average_daily_cost : 0,
  currency: row.currency || 'EUR',
  visaInfo: row.visa_info || undefined,
  vaccinationInfo: row.vaccination_info || undefined,
  healthSafetyInfo: row.health_safety_info || undefined,
  source: row.source || undefined,
  parentId: row.parent_id || undefined,
  coords: typeof row.coords_lat === 'number' && typeof row.coords_lon === 'number' ? { lat: row.coords_lat, lon: row.coords_lon } : undefined,
  childrenCount: typeof row.children_count === 'number' ? row.children_count : undefined,
});

export const fetchDestinationsCatalog = async (_opts?: {
  type?: Destination['type'];
  countryCode?: string;
  search?: string;
}): Promise<Destination[]> => {
  const fallbackSearch = (search?: string) => {
    let list = inspirationDestinations.slice();
    if (_opts?.type) list = list.filter((d) => d.type === _opts.type || (Array.isArray(d.types) && d.types.includes(_opts.type)));
    if (_opts?.countryCode) list = list.filter((d) => (d.countryCode || '').toUpperCase() === _opts.countryCode?.toUpperCase());
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((d) =>
        d.name.toLowerCase().includes(s) ||
        d.country.toLowerCase().includes(s) ||
        (d.description || '').toLowerCase().includes(s)
      );
    }
    return rankDestinations(list, search);
  };
  try {
    const columns = isLocalSupabase
      ? 'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count'
      : 'id,name,country,country_code,type,types,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count';
    const search = _opts?.search?.trim();
    const isLocalHost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const canUseApi = !isLocalSupabase && !isLocalHost;
    if (canUseApi) {
      let apiData: DestinationRow[] | null = null;
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (_opts?.type) params.set('type', _opts.type);
        if (_opts?.countryCode) params.set('countryCode', _opts.countryCode);
        const response = await fetch(`/api/destinations?${params.toString()}`);
        if (response.ok) apiData = (await response.json()) as DestinationRow[];
      } catch (error) {
        apiData = null;
      }
      if (apiData && (search || apiData.length > 0)) {
        const mapped = apiData.map(toDestination);
        if (search && mapped.length === 0) return fallbackSearch(search);
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
      if (search) {
        const s = search.toLowerCase();
        rows = rows.filter((row) =>
          row.name.toLowerCase().includes(s) ||
          row.country.toLowerCase().includes(s) ||
          (row.description || '').toLowerCase().includes(s)
        );
      }
      const mapped = rows.map(toDestination);
      if (search && mapped.length === 0) return fallbackSearch(search);
      return search ? rankDestinations(mapped, search) : mapped;
    }
    let query = fromDestinations()
      .select(columns)
      .order('name', { ascending: true });
    if (_opts?.type) query = query.contains('types', [_opts.type]);
    if (_opts?.countryCode) query = query.eq('country_code', _opts.countryCode);
    if (search) {
      const s = search.replace(/%/g, '\\%');
      query = query.or(`name.ilike.%${s}%,country.ilike.%${s}%`).limit(100);
    }
    const { data, error } = await query;
    if (error) throw error;
    const rows = (data || []) as DestinationRow[];
    const mapped = rows.map(toDestination);
    if (search && mapped.length === 0) return fallbackSearch(search);
    return search ? rankDestinations(mapped, search) : mapped;
  } catch {
    return fallbackSearch(_opts?.search?.trim());
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
    const found = inspirationDestinations.find((d) => d.id === _id);
    return found || null;
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
    let list = inspirationDestinations.filter((d) => d.parentId === _id);
    if (_type) list = list.filter((d) => d.type === _type || (Array.isArray(d.types) && d.types.includes(_type)));
    return list.sort((a, b) => a.name.localeCompare(b.name));
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
    let current = inspirationDestinations.find((d) => d.id === _id) || null;
    for (let i = 0; i < 10; i++) {
      if (!current) break;
      result.push(current);
      current = current.parentId ? inspirationDestinations.find((d) => d.id === current?.parentId) || null : null;
    }
    return result;
  }
};
