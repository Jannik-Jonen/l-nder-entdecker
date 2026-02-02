
export interface WikiData {
  description: string;
  imageUrl?: string;
  extract?: string;
  bestSeason?: string;
}

export const fetchWikiData = async (query: string): Promise<WikiData | null> => {
  try {
    // First search for the most relevant page title
    const searchUrl = `https://de.wikivoyage.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.query?.search?.length) {
      return null;
    }

    const title = searchData.query.search[0].title;

    // Then fetch details for that page
    const detailsUrl = `https://de.wikivoyage.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(title)}&pithumbsize=1000&exintro=1&explaintext=1&origin=*`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    const pages = detailsData.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (pageId === '-1') return null;

    const extract: string | undefined = page.extract;
    let bestSeason: string | undefined;
    if (extract) {
      const lower = extract.toLowerCase();
      const months = [
        'januar','februar','märz','april','mai','juni','juli','august','september','oktober','november','dezember'
      ];
      const foundMonths = months.filter((m) => lower.includes(m));
      if (lower.includes('beste reisezeit') || lower.includes('reisezeit') || foundMonths.length >= 2) {
        const startIdx = Math.max(lower.indexOf('beste reisezeit'), lower.indexOf('reisezeit'));
        const snippet = startIdx >= 0 ? extract.slice(startIdx, Math.min(extract.length, startIdx + 250)) : extract.slice(0, 250);
        const monthMap: Record<string, string> = {
          januar: 'Jan', februar: 'Feb', märz: 'Mär', april: 'Apr', mai: 'Mai', juni: 'Jun',
          juli: 'Jul', august: 'Aug', september: 'Sep', oktober: 'Okt', november: 'Nov', dezember: 'Dez'
        };
        const order = ['januar','februar','märz','april','mai','juni','juli','august','september','oktober','november','dezember'];
        const indices = order.map((m) => ({ m, i: snippet.toLowerCase().indexOf(m) })).filter((x) => x.i >= 0).sort((a,b) => a.i - b.i);
        if (indices.length >= 2) {
          const first = monthMap[indices[0].m];
          const last = monthMap[indices[indices.length - 1].m];
          bestSeason = `${first}–${last}`;
        } else if (foundMonths.length > 0) {
          bestSeason = foundMonths.map((m) => monthMap[m]).join(', ');
        }
      }
    }

    return {
      description: page.extract || `Keine Beschreibung für ${title} verfügbar.`,
      imageUrl: page.thumbnail?.source,
      extract: page.extract,
      bestSeason,
    };
  } catch (error) {
    console.error('Error fetching Wikivoyage data:', error);
    return null;
  }
};
