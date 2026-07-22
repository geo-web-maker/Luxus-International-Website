import { Helmet } from 'react-helmet-async';
import PageHead from '../../components/PageHead/PageHead';
import SupportNote from '../../components/SupportNote/SupportNote';
import CtaBand from '../../components/CtaBand/CtaBand';
import styles from './Gallery.module.css';

const photoCount = 6;

export default function Gallery() {
  return (
    <>
      <Helmet><title>SACHI — Gallery</title></Helmet>

      <PageHead eyebrow="Gallery" title="A glimpse into our work in the field.">
        <p className={styles.headText}>
          Community health sessions, outreach programmes, training workshops, and the people we're proud to serve across Uganda.
        </p>
      </PageHead>

      <section className={styles.section}>
        <div className="wrap">
          <div className={styles.grid}>
            {Array.from({ length: photoCount }).map((_, i) => (
              <div className={styles.photo} key={i}>[ field photography ]</div>
            ))}
          </div>
          <SupportNote text="Each of these moments was made possible by donor support. Help us create more of them." />
        </div>
      </section>

      <CtaBand
        title="Be part of the change in your community"
        text="Every photo tells a story of lives impacted. Partner with us and let's create more stories worth telling."
        ctaLabel="Get involved"
      />
    </>
  );
}
