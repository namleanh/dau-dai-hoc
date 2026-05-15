'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar/SearchBar';
import QuickChips from '@/components/QuickChips/QuickChips';
import { addSearchHistory } from '@/lib/history';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = useCallback(
    (query: string) => {
      addSearchHistory(query);
      router.push(`/results?q=${encodeURIComponent(query)}`);
    },
    [router]
  );

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        {/* Animated graduation cap */}
        <div className={styles.iconContainer}>
          <span className={styles.icon}>🎓</span>
        </div>

        {/* Title & tagline */}
        <h1 className={styles.title}>
          Đậu Đại Học
        </h1>
        <p className={styles.tagline}>
          Tra cứu điểm chuẩn, ngành học & cơ hội nghề nghiệp
        </p>

        {/* Search bar */}
        <div className={styles.searchWrapper}>
          <SearchBar onSearch={handleSearch} autoFocus />
        </div>

        {/* Quick suggestion chips */}
        <QuickChips onSelect={handleSearch} />
      </div>

      {/* Subtle footer */}
      <footer className={styles.footer}>
        <p>Dữ liệu được tổng hợp từ các nguồn uy tín bằng AI</p>
        <p className={styles.disclaimer}>* Kết quả mang tính chất tham khảo. Vui lòng đối chiếu với website chính thức của trường Đại học để có thông tin chính xác nhất.</p>
      </footer>
    </main>
  );
}
