/**
 * Search orchestrator
 * Combines Tavily web search + Gemini structured output
 * Includes simple in-memory cache with TTL
 */

import { searchTavily } from './tavily';
import { structureWithGemini } from './gemini';
import type { SearchResult } from '@/types';

/** Cache entry with expiration */
interface CacheEntry {
  data: SearchResult;
  expiresAt: number;
}

/** Cache TTL: 1 hour */
const CACHE_TTL_MS = 60 * 60 * 1000;
const MAX_CACHE_SIZE = 100;

/** Simple in-memory LRU-ish cache */
const cache = new Map<string, CacheEntry>();

function getCacheKey(query: string): string {
  return query.trim().toLowerCase();
}

function getFromCache(query: string): SearchResult | null {
  const key = getCacheKey(query);
  const entry = cache.get(key);

  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCache(query: string, data: SearchResult): void {
  const key = getCacheKey(query);

  // Evict oldest entries if cache is full
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }

  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Perform a full search: Tavily → Gemini → Structured Result
 * Results are cached for 1 hour
 */
export async function performSearch(query: string): Promise<SearchResult> {
  // Check cache first
  const cached = getFromCache(query);
  if (cached) {
    return cached;
  }

  // Step 1: Search the web with Tavily
  const tavilyResults = await searchTavily(query);

  if (tavilyResults.length === 0) {
    throw new Error('Không tìm thấy kết quả. Vui lòng thử từ khóa khác.');
  }

  // Step 2: Combine raw content for Gemini
  const rawContent = tavilyResults
    .map((r, i) => `[Nguồn ${i + 1}: ${r.title}]\n${r.content}`)
    .join('\n\n---\n\n');

  const sources = tavilyResults.map((r) => ({
    title: r.title,
    url: r.url,
  }));

  // Step 3: Structure with Gemini
  const result = await structureWithGemini(query, rawContent, sources);

  // Step 4: Cache the result
  setCache(query, result);

  return result;
}
