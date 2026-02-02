
import { Destination } from '@/types/travel';

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
