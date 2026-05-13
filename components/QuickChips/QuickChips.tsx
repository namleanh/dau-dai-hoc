'use client';

import { useState, useEffect } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateHistory = () => {
      setHistory(getSearchHistory());
    };
    updateHistory();

    window.addEventListener('searchHistoryChanged', updateHistory);
    return () => window.removeEventListener('searchHistoryChanged', updateHistory);
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch

  const displayItems = history.length > 0 ? history : DEFAULT_SUGGESTIONS;
  const isHistory = history.length > 0;

  const handleRemove = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    removeSearchHistory(item);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chips}>
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
