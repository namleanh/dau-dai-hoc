import type { SourceInfo } from '@/types';
import styles from './SourceFooter.module.css';

interface SourceFooterProps {
  sources: SourceInfo[];
  style?: React.CSSProperties;
}

export default function SourceFooter({ sources, style }: SourceFooterProps) {
  if (sources.length === 0) return null;

  return (
    <div className={styles.footer} style={style}>
      <div className={styles.header}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span className={styles.label}>Nguồn tham khảo</span>
      </div>
      <div className={styles.links}>
        {sources.map((source, index) => {
          // Extract domain from URL
          let domain = '';
          try {
            domain = new URL(source.url).hostname.replace('www.', '');
          } catch {
            domain = source.url;
          }

          return (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              title={source.title}
            >
              {domain}
            </a>
          );
        })}
      </div>
    </div>
  );
}
