'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
  compact?: boolean;
}

export default function SearchBar({
  onSearch,
  isLoading = false,
  initialValue = '',
  autoFocus = false,
  compact = false,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed.length >= 2) {
        onSearch(trimmed);
      }
    },
    [value, onSearch]
  );

  return (
    <form
      className={`${styles.searchForm} ${compact ? styles.compact : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={`${styles.searchContainer} ${isLoading ? styles.loading : ''}`}>
        <svg
          className={styles.searchIcon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          id="search-input"
          type="text"
          className={styles.searchInput}
          placeholder="Nhập tên trường hoặc ngành học..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus={autoFocus}
          disabled={isLoading}
          aria-label="Tìm kiếm trường đại học hoặc ngành học"
        />

        {isLoading && (
          <div className={styles.spinner} aria-label="Đang tìm kiếm...">
            <div className={styles.spinnerDot} />
            <div className={styles.spinnerDot} />
            <div className={styles.spinnerDot} />
          </div>
        )}

        {!isLoading && value.length > 0 && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => setValue('')}
            aria-label="Xóa tìm kiếm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <button
        type="submit"
        className={styles.searchButton}
        disabled={isLoading || value.trim().length < 2}
      >
        Tìm kiếm
      </button>
    </form>
  );
}
