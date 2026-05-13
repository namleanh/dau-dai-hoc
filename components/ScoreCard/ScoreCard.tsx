import type { AdmissionScore } from '@/types';
import styles from './ScoreCard.module.css';

interface ScoreCardProps {
  scores: AdmissionScore[];
  style?: React.CSSProperties;
}

export default function ScoreCard({ scores, style }: ScoreCardProps) {
  if (scores.length === 0) return null;

  return (
    <div className={styles.card} style={style}>
      <div className={styles.header}>
        <span className={styles.icon}>📊</span>
        <div>
          <h3 className={styles.title}>Điểm chuẩn các năm gần nhất</h3>
          <p className={styles.subtitle}>Theo phương thức xét điểm thi tốt nghiệp</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Ngành</th>
              <th className={styles.thScore}>2023</th>
              <th className={styles.thScore}>2024</th>
              <th className={styles.thScore}>2025</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index} className={styles.row}>
                <td className={styles.td}>
                  <span className={styles.majorName}>{score.majorName}</span>
                  {score.majorCode && (
                    <span className={styles.majorCode}>{score.majorCode}</span>
                  )}
                </td>
                <td className={styles.tdScore}>
                  <span className={styles.score}>{score.score2023 || '-'}</span>
                </td>
                <td className={styles.tdScore}>
                  <span className={styles.score}>{score.score2024 || '-'}</span>
                </td>
                <td className={styles.tdScore}>
                  <span className={styles.score}>{score.score2025 || '-'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
