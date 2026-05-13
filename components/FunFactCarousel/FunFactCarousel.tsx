'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/results/page.module.css';

interface FunFactCarouselProps {
  funFacts: string[];
}

export default function FunFactCarousel({ funFacts }: FunFactCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!funFacts || funFacts.length <= 1) return;

    const intervalId = setInterval(() => {
      // Start fade out
      setIsFading(true);
      
      // Change text halfway through the interval (e.g. after 300ms)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
        // Start fade in
        setIsFading(false);
      }, 300); // 300ms matches the fade out transition duration

    }, 15000); // 15 seconds

    return () => clearInterval(intervalId);
  }, [funFacts]);

  if (!funFacts || funFacts.length === 0) return null;

  return (
    <div className={styles.funFactCard} style={{ animationDelay: '50ms' }}>
      <span className={styles.funFactIcon}>💡</span>
      <div>
        <h4 className={styles.funFactTitle}>Có thể bạn chưa biết?</h4>
        <p 
          className={styles.funFactDesc}
          style={{ 
            opacity: isFading ? 0 : 1, 
            transition: 'opacity 0.3s ease-in-out' 
          }}
        >
          {funFacts[currentIndex]}
        </p>
      </div>
    </div>
  );
}
