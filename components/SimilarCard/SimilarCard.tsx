import type { SimilarItem } from '@/types';
import styles from './SimilarCard.module.css';

interface SimilarCardProps {
  title: string;
  icon: string;
  items: SimilarItem[];
  onItemClick?: (value: string) => void;
  style?: React.CSSProperties;
}

export default function SimilarCard({ title, icon, items, onItemClick, style }: SimilarCardProps) {
  if (items.length === 0) return null;

  return (
    <div className={styles.card} style={style}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.items}>
        {items.map((item, index) => (
          <button
            key={index}
            className={styles.item}
            onClick={() => onItemClick?.(item.name)}
            type="button"
          >
            <div className={styles.itemContent}>
              <span className={styles.itemName}>{item.name}</span>
              {item.hint && <span className={styles.itemHint}>{item.hint}</span>}
            </div>
            <svg
              className={styles.arrow}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
