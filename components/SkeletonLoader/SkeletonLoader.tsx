import styles from './SkeletonLoader.module.css';

export default function SkeletonLoader() {
  return (
    <div className={styles.container} aria-label="Đang tải kết quả...">
      {/* University header skeleton */}
      <div className={styles.card}>
        <div className={styles.headerSkeleton}>
          <div className={`${styles.skeleton} ${styles.iconSkeleton}`} />
          <div style={{ flex: 1 }}>
            <div className={`${styles.skeleton} ${styles.titleSkeleton}`} />
            <div className={`${styles.skeleton} ${styles.subtitleSkeleton}`} />
          </div>
        </div>
      </div>

      {/* Score card skeleton */}
      <div className={styles.card}>
        <div className={styles.headerSkeleton}>
          <div className={`${styles.skeleton} ${styles.iconSkeleton}`} />
          <div className={`${styles.skeleton} ${styles.titleSkeleton}`} />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.rowSkeleton}>
            <div className={`${styles.skeleton} ${styles.textSkeleton}`} />
            <div className={`${styles.skeleton} ${styles.scoreSkeleton}`} />
            <div className={`${styles.skeleton} ${styles.trendSkeleton}`} />
          </div>
        ))}
      </div>

      {/* Career card skeleton */}
      <div className={styles.card}>
        <div className={styles.headerSkeleton}>
          <div className={`${styles.skeleton} ${styles.iconSkeleton}`} />
          <div className={`${styles.skeleton} ${styles.titleSkeleton}`} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.listItemSkeleton}>
            <div className={`${styles.skeleton} ${styles.dotSkeleton}`} />
            <div style={{ flex: 1 }}>
              <div className={`${styles.skeleton} ${styles.textSkeleton}`} />
              <div className={`${styles.skeleton} ${styles.textSkeletonShort}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Similar items skeleton */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.headerSkeleton}>
            <div className={`${styles.skeleton} ${styles.iconSkeleton}`} />
            <div className={`${styles.skeleton} ${styles.titleSkeleton}`} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.skeleton} ${styles.listLineSkeleton}`} />
          ))}
        </div>
        <div className={styles.card}>
          <div className={styles.headerSkeleton}>
            <div className={`${styles.skeleton} ${styles.iconSkeleton}`} />
            <div className={`${styles.skeleton} ${styles.titleSkeleton}`} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.skeleton} ${styles.listLineSkeleton}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
