/**
 * Tavily Search API client
 * Searches the web for Vietnamese university admission data
 */

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  results: TavilySearchResult[];
  query: string;
}

const TAVILY_API_URL = 'https://api.tavily.com/search';

/** Domains to prioritize for Vietnamese education data */
const INCLUDE_DOMAINS = [
  'vnexpress.net',
  'tuoitre.vn',
  'thanhnien.vn',
  'vietnamnet.vn',
  'tuyensinh247.com',
  'diemthi.com.vn',
  'moet.gov.vn',
];

/**
 * Search the web for Vietnamese university/major information using Tavily
 * @param query - User's search query (e.g., "Bách Khoa Hà Nội")
 * @returns Array of relevant search results with snippets
 */
export async function searchTavily(query: string): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is not configured');
  }

  // Enhance query with education context for better results
  const enhancedQuery = `${query} điểm chuẩn đại học tuyển sinh Việt Nam ngành học nghề nghiệp`;

  const response = await fetch(TAVILY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: enhancedQuery,
      search_depth: 'advanced',
      include_domains: INCLUDE_DOMAINS,
      max_results: 8,
      include_answer: false,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Tavily API error: ${response.status} - ${errorText}`);
  }

  const data: TavilyResponse = await response.json();
  return data.results || [];
}
