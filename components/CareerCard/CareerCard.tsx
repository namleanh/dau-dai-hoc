import type { CareerOption } from '@/types';
import styles from './CareerCard.module.css';

interface CareerCardProps {
  careers: CareerOption[];
  style?: React.CSSProperties;
}

export default function CareerCard({ careers, style }: CareerCardProps) {
  if (careers.length === 0) return null;

  return (
    <div className={styles.card} style={style}>
      <div className={styles.header}>
        <span className={styles.icon}>💼</span>
        <h3 className={styles.title}>Cơ hội nghề nghiệp</h3>
      </div>

      <ul className={styles.list}>
        {careers.map((career, index) => (
          <li key={index} className={styles.item}>
            <div className={styles.dot} />
            <div>
              <span className={styles.careerTitle}>{career.title}</span>
              <p className={styles.careerDesc}>{career.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
