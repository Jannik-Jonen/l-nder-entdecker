
export interface WikiData {
  description: string;
  imageUrl?: string;
  extract?: string;
}

export const fetchWikiData = async (query: string): Promise<WikiData | null> => {
  try {
    // First search for the most relevant page title
    const searchUrl = `https://de.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.query?.search?.length) {
      return null;
    }

    const title = searchData.query.search[0].title;

    // Then fetch details for that page
    const detailsUrl = `https://de.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(title)}&pithumbsize=1000&exintro=1&explaintext=1&origin=*`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    const pages = detailsData.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (pageId === '-1') return null;

    return {
      description: page.extract || `Keine Beschreibung für ${title} verfügbar.`,
      imageUrl: page.thumbnail?.source,
      extract: page.extract
    };
  } catch (error) {
    console.error('Error fetching Wikivoyage data:', error);
    return null;
  }
};
