'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar/SearchBar';
import ScoreCard from '@/components/ScoreCard/ScoreCard';
import CareerCard from '@/components/CareerCard/CareerCard';
import SimilarCard from '@/components/SimilarCard/SimilarCard';
import SourceFooter from '@/components/SourceFooter/SourceFooter';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';
import FunFactCarousel from '@/components/FunFactCarousel/FunFactCarousel';
import QuickChips from '@/components/QuickChips/QuickChips';
import { addSearchHistory } from '@/lib/history';
import type { SearchResult } from '@/types';
import styles from './page.module.css';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) return;

    addSearchHistory(q);
    setIsLoading(true);
    setError(null);
    setErrorCode(null);
    setResult(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Đã xảy ra lỗi.');
        setErrorCode(data.errorCode || null);
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
      setErrorCode('NETWORK_ERROR: Failed to fetch');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query, fetchResults]);

  const handleSearch = useCallback(
    (newQuery: string) => {
      router.push(`/results?q=${encodeURIComponent(newQuery)}`);
    },
    [router]
  );

  const handleSimilarClick = useCallback(
    (name: string) => {
      router.push(`/results?q=${encodeURIComponent(name)}`);
    },
    [router]
  );

  return (
    <main className={styles.main}>
      {/* Header with search */}
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/')}
          type="button"
          aria-label="Về trang chủ"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className={styles.backLogo}>🎓</span>
        </button>

        <div className={styles.headerSearch}>
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            initialValue={query}
            compact
          />
        </div>
      </header>

      {/* Quick search history right below the header */}
      <div className={styles.historyContainer}>
        <QuickChips onSelect={handleSearch} />
      </div>

      {/* Results area */}
      <div className={styles.resultsArea}>
        <div className={styles.resultsContainer}>
          {/* Loading state */}
          {isLoading && <SkeletonLoader />}

          {/* Error state */}
          {error && (
            <div className={styles.errorCard}>
              <span className={styles.errorIcon}>😔</span>
              <h2 className={styles.errorTitle}>Không thể tìm kiếm</h2>
              <p className={styles.errorMessage}>{error}</p>
              <button
                className={styles.retryButton}
                onClick={() => fetchResults(query)}
                type="button"
              >
                Thử lại
              </button>
              {errorCode && (
                <details className={styles.errorDetails}>
                  <summary className={styles.errorDetailsSummary}>
                    Xem chi tiết lỗi
                  </summary>
                  <pre className={styles.errorCode}>{errorCode}</pre>
                </details>
              )}
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className={styles.results}>
              {/* University/Major header */}
              <div className={styles.resultHeader} style={{ animationDelay: '0ms' }}>
                <span className={styles.resultIcon}>
                  {result.type === 'university' ? '🏛️' : '📚'}
                </span>
                <div>
                  <h1 className={styles.resultName}>{result.name}</h1>
                  {result.fullName && result.fullName !== result.name && (
                    <p className={styles.resultFullName}>{result.fullName}</p>
                  )}
                  {result.description && (
                    <p className={styles.resultDesc}>{result.description}</p>
                  )}
                </div>
              </div>

              {/* Fun Fact Carousel */}
              {result.funFacts && result.funFacts.length > 0 && (
                <FunFactCarousel funFacts={result.funFacts} />
              )}

              {/* Admission scores */}
              <ScoreCard
                scores={result.admissionScores}
                style={{ animationDelay: '100ms' }}
              />

              {/* Career opportunities */}
              <CareerCard
                careers={result.careers}
                style={{ animationDelay: '200ms' }}
              />

              {/* Similar items grid */}
              <div className={styles.similarGrid}>
                <SimilarCard
                  title="Ngành tương tự"
                  icon="📚"
                  items={result.similarMajors}
                  onItemClick={handleSimilarClick}
                  style={{ animationDelay: '300ms' }}
                />
                <SimilarCard
                  title="Trường tương tự"
                  icon="🏫"
                  items={result.similarUniversities}
                  onItemClick={handleSimilarClick}
                  style={{ animationDelay: '400ms' }}
                />
              </div>

              {/* Sources */}
              <SourceFooter
                sources={result.sources}
                style={{ animationDelay: '500ms' }}
              />
            </div>
          )}

          {/* Empty state (no query) */}
          {!query && !isLoading && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🔍</span>
              <p className={styles.emptyText}>Nhập tên trường hoặc ngành để bắt đầu tra cứu</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <div className={styles.resultsArea}>
          <div className={styles.resultsContainer}>
            <SkeletonLoader />
          </div>
        </div>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
