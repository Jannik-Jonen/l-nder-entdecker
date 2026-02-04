
import { Destination } from '@/types/travel';
import { supabaseUntyped } from '@/lib/supabase-untyped';
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

const extractHighlights = (html: string, sections: WikiSection[]): string[] => {
  // Find "Sehenswürdigkeiten" or "See" section
  const section = sections.find(s => 
    s.line.toLowerCase().includes('sehenswürdigkeiten') || 
    s.line.toLowerCase().includes('see')
  );

  if (!section) return [];

  // In a real implementation, we would parse the HTML of that specific section.
  // Since the API returns the full text, we need to find the content between this header and the next.
  // However, simpler is to just look for list items <li> in the full HTML if we could isolate the section.
  // But strictly parsing HTML with Regex is fragile. 
  // Let's try to find the section index and fetch just that section content if needed, 
  // but for now, let's extract generic bold items or list items from the *whole* text if strictly sectioned?
  // No, that's too messy.
  
  // Better approach: The 'parse' API returns the whole text in `text['*']`. 
  // We can try to split by the section headers (h2/h3).
  // But parsing the raw HTML structure is best done by a DOMParser if we were in browser context.
  // We are in browser context!
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find the header for highlights
    const headers = Array.from(doc.querySelectorAll('h2, h3'));
    const targetHeader = headers.find(h => {
      const text = h.textContent?.toLowerCase() || '';
      return text.includes('sehenswürdigkeiten') || text.includes('see');
    });

    if (!targetHeader) return [];

    const highlights: string[] = [];
    let nextNode = targetHeader.nextElementSibling;
    
    // Collect up to 5 highlights from the immediate following list or paragraphs
    while (nextNode && highlights.length < 5) {
      if (['H2', 'H3'].includes(nextNode.tagName)) break; // Stop at next section
      
      if (nextNode.tagName === 'UL') {
        const items = Array.from(nextNode.querySelectorAll('li'));
        for (const item of items) {
          // Extract the name (usually in bold) or just the first sentence
          const bold = item.querySelector('b, strong');
          const text = bold ? bold.textContent : item.textContent?.split('.')[0];
          if (text && text.length > 3 && text.length < 100) {
            highlights.push(text.trim());
            if (highlights.length >= 5) break;
          }
        }
      }
      nextNode = nextNode.nextElementSibling;
    }
    
    return highlights;
  } catch (e) {
    console.error('Error parsing highlights:', e);
    return [];
  }
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

const toDestination = (row: DestinationRow): Destination => ({
  id: row.id,
  name: row.name,
  country: row.country,
  countryCode: row.country_code || undefined,
  type: row.type,
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
  try {
    let query = supabaseUntyped
      .from('destinations')
      .select('id,name,country,country_code,type,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count')
      .order('name', { ascending: true });
    if (_opts?.type) query = query.eq('type', _opts.type);
    if (_opts?.countryCode) query = query.eq('country_code', _opts.countryCode);
    if (_opts?.search) query = query.ilike('name', `%${_opts.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    const rows = (data || []) as DestinationRow[];
    return rows.map(toDestination);
  } catch {
    let list = inspirationDestinations.slice();
    if (_opts?.type) list = list.filter((d) => d.type === _opts.type);
    if (_opts?.countryCode) list = list.filter((d) => (d.countryCode || '').toUpperCase() === _opts.countryCode?.toUpperCase());
    if (_opts?.search) {
      const s = _opts.search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(s));
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
};

export const getDestinationById = async (_id: string): Promise<Destination | null> => {
  try {
    const { data, error } = await supabaseUntyped
      .from('destinations')
      .select('id,name,country,country_code,type,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count')
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
    let query = supabaseUntyped
      .from('destinations')
      .select('id,name,country,country_code,type,image_url,description,highlights,best_season,average_daily_cost,currency,visa_info,vaccination_info,health_safety_info,source,parent_id,coords_lat,coords_lon,children_count')
      .eq('parent_id', _id)
      .order('name', { ascending: true });
    if (_type) query = query.eq('type', _type);
    const { data, error } = await query;
    if (error) throw error;
    const rows = (data || []) as DestinationRow[];
    return rows.map(toDestination);
  } catch {
    let list = inspirationDestinations.filter((d) => d.parentId === _id);
    if (_type) list = list.filter((d) => d.type === _type);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
};

export const getAncestors = async (_id: string): Promise<Destination[]> => {
  const result: Destination[] = [];
  try {
    let currentId: string | null = _id;
    for (let i = 0; i < 10; i++) {
      if (!currentId) break;
      const { data } = await supabaseUntyped
        .from('destinations')
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
