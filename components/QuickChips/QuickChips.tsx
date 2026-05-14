'use client';

import { useState, useEffect, useRef } from 'react';
import { getSearchHistory, removeSearchHistory } from '@/lib/history';
import styles from './QuickChips.module.css';

interface QuickChipsProps {
  onSelect: (value: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  'Đại học Bách Khoa Hà Nội',
  'Công nghệ thông tin',
  'Đại học Y Hà Nội',
  'Ngành Luật',
  'Ngành Kinh tế',
  'Ngành Kiến trúc',
];

export default function QuickChips({ onSelect }: QuickChipsProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [pendingHistory, setPendingHistory] = useState<string[] | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    setHistory(getSearchHistory());

    const handleHistoryChanged = () => {
      setPendingHistory(getSearchHistory());
    };

    window.addEventListener('searchHistoryChanged', handleHistoryChanged);
    return () => window.removeEventListener('searchHistoryChanged', handleHistoryChanged);
  }, []);

  // Sync pendingHistory to history when interaction ends
  useEffect(() => {
    if (!isInteracting && pendingHistory !== null) {
      setHistory(pendingHistory);
      setPendingHistory(null);
    }
  }, [isInteracting, pendingHistory]);

  // Handle outside clicks/touches to end interaction on mobile
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsInteracting(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch

  const displayItems = history.length > 0 ? history : DEFAULT_SUGGESTIONS;
  const isHistory = history.length > 0;

  const handleRemove = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    removeSearchHistory(item);
    // Force immediate update for removal
    const newHistory = getSearchHistory();
    setHistory(newHistory);
    setPendingHistory(null);
  };

  const handleInteractionStart = () => setIsInteracting(true);
  const handleInteractionEnd = () => setIsInteracting(false);

  return (
    <div className={styles.container} ref={containerRef}>
      <div 
        className={styles.chips}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
      >
        {displayItems.map((item, index) => (
          <button
            key={`${item}-${index}`}
            className={styles.chip}
            onClick={() => onSelect(item)}
            type="button"
            title={item}
          >
            <span className={styles.chipText}>{item}</span>
            {isHistory && (
              <span
                className={styles.removeIcon}
                onClick={(e) => handleRemove(e, item)}
                title="Xóa"
              >
                ×
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
