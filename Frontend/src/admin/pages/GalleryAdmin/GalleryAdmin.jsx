import { useState } from 'react';
import ProtectedSection from '../../components/ProtectedSection/ProtectedSection';
import styles from './GalleryAdmin.module.css';

const initialPhotos = [
  { id: 1, caption: 'Community consultation' },
  { id: 2, caption: 'Health talk with elders' },
  { id: 3, caption: 'Accessible seating, outreach' },
  { id: 4, caption: 'Data review session' },
  { id: 5, caption: 'Village-wide gathering' },
  { id: 6, caption: 'Door-to-door outreach' },
];

export default function GalleryAdmin() {
  const [photos, setPhotos] = useState(initialPhotos);

  function addPhoto() {
    setPhotos((prev) => [...prev, { id: Date.now(), caption: 'Untitled photo' }]);
  }

  function removePhoto(id) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function updateCaption(id, caption) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  }

  return (
    <ProtectedSection section="gallery" title="Gallery">
      <div className={styles.toolbar}>
        <p className={styles.hint}>
          "Upload" here just adds a placeholder tile — real uploads connect to storage once the
          backend exists.
        </p>
        <button className="a-btn a-btn-primary" onClick={addPhoto}>+ Add photo</button>
      </div>

      <div className={styles.grid}>
        {photos.map((p) => (
          <div className={styles.tile} key={p.id}>
            <div className={styles.thumb}>[ photo ]</div>
            <input
              className={styles.captionInput}
              value={p.caption}
              onChange={(e) => updateCaption(p.id, e.target.value)}
            />
            <button className={styles.removeBtn} onClick={() => removePhoto(p.id)}>Remove</button>
          </div>
        ))}
      </div>
    </ProtectedSection>
  );
}
