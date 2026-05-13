export const HISTORY_KEY = 'dau_dai_hoc_search_history';
export const MAX_HISTORY = 10;

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return;
  const history = getSearchHistory();
  const trimmed = query.trim();
  const newHistory = [trimmed, ...history.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  // Dispatch a custom event so other components can update
  window.dispatchEvent(new Event('searchHistoryChanged'));
}

export function removeSearchHistory(query: string) {
  if (typeof window === 'undefined') return;
  const history = getSearchHistory();
  const newHistory = history.filter((q) => q !== query);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  window.dispatchEvent(new Event('searchHistoryChanged'));
}
