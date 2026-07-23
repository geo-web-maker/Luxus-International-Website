import { useState } from 'react';
import styles from './Slideshow.module.css';

export default function Slideshow({ images, aspect = '16 / 8', showThumbnails = false }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.slide} style={{ aspectRatio: aspect }}>
        [ no photos yet ]
      </div>
    );
  }

  const current = images[index];

  function go(delta) {
    setIndex((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.slide} style={{ aspectRatio: aspect }}>
        <span className={styles.placeholder}>[ {current.caption} ]</span>

        {images.length > 1 && (
          <>
            <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => go(-1)} aria-label="Previous photo">&larr;</button>
            <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => go(1)} aria-label="Next photo">&rarr;</button>
          </>
        )}

        <div className={styles.captionBar}>{current.caption}</div>
      </div>

      {images.length > 1 && (
        showThumbnails ? (
          <div className={styles.thumbRow}>
            {images.map((img, i) => (
              <button
                key={img.id}
                className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
                onClick={() => setIndex(i)}
              >
                {img.caption}
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.dotRow}>
            {images.map((img, i) => (
              <button
                key={img.id}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
