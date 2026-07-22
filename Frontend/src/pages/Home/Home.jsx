import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageHead from '../../components/PageHead/PageHead';
import StatStrip from '../../components/StatStrip/StatStrip';
import SupportNote from '../../components/SupportNote/SupportNote';
import CtaBand from '../../components/CtaBand/CtaBand';
import styles from './Home.module.css';

const whyCards = [
  { title: 'Innovative', text: 'Flexible, creative delivery even in the hardest settings.' },
  { title: 'Evidence-based', text: 'Every programme is grounded in research and public health practice.' },
  { title: 'Excellent', text: 'Professionalism and measurable results, every time.' },
  { title: 'Collaborative', text: 'Multi-sector partnerships across physical, mental, and social health.' },
];

const stats = [
  { num: '2022', label: 'Founded in Kampala' },
  { num: '8', label: 'Programme areas' },
  { num: 'Sub-Saharan', label: 'Regional reach' },
  { num: 'Evidence-based', label: 'Our model' },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>SACHI — Healthier communities start upstream</title>
      </Helmet>

      <PageHead
        variant="grid"
        eyebrow="Health promotion · Kampala, Uganda"
        title="Healthier communities start upstream."
        media={
          <div className={styles.heroPhoto}>[ field photography ]</div>
        }
      >
        <p className={styles.lede}>
          SACHI works with communities across Uganda to reduce health risk at its source —
          through research, clean water access, and education that reaches people before crisis does.
        </p>
        <div className={styles.heroActions}>
          <Link to="/contact" className={styles.btnPrimary}>Get in touch</Link>
          <Link to="/programmes" className={styles.btnGhost}>Our programmes</Link>
        </div>
      </PageHead>

      <StatStrip stats={stats} />

      <section className={styles.section}>
        <div className={`${styles.inner} wrap`}>
          <div className={styles.eyebrowLabel}>Why SACHI</div>
          <h2 className={styles.h2}>Built for the community, not around it.</h2>
          <div className={styles.whyGrid}>
            {whyCards.map((c) => (
              <div className={styles.whyCard} key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
          <SupportNote text="SACHI runs entirely on partnerships and donor support — every gift funds real programme delivery, not overhead." />
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.inner} wrap`}>
          <div className={styles.eyebrowLabel}>Programme</div>
          <h2 className={styles.h2}>WASH and environmental health</h2>
          <p className={styles.programmeText}>
            Water, sanitation, and hygiene sit at the root of preventable disease. We build access, not just awareness.
          </p>
          <div className={styles.programmeGrid}>
            <div className={styles.programmePhoto}>[ community water point ]</div>
            <div className={styles.programmeCard}>
              <div className={styles.cardIcon}>1</div>
              <h3>Safe water access</h3>
              <p>Clean drinking water and sanitary facilities in schools and healthcare centres.</p>
            </div>
            <div className={styles.programmeCard}>
              <div className={styles.cardIcon}>2</div>
              <h3>Hygiene practice</h3>
              <p>Household-level behaviour change for handwashing and safe food handling.</p>
            </div>
          </div>
          <Link to="/programmes" className={styles.btnGhostDark}>See all 8 programme areas &rarr;</Link>
        </div>
      </section>

      <CtaBand
        title="Let's bring better health to your community"
        text="Whether you're a community organisation, institution, or individual, we're ready to partner with you."
      />
    </>
  );
}
