import { Helmet } from 'react-helmet-async';
import { useMemo, useState } from 'react';
import PageHead from '../../components/PageHead/PageHead';
import CtaBand from '../../components/CtaBand/CtaBand';
import { jobs, jobTypes } from '../../data/jobs';
import styles from './Career.module.css';

export default function Career() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [checkedTypes, setCheckedTypes] = useState(new Set(jobTypes));

  function toggleType(type) {
    setCheckedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    return jobs.filter((job) => {
      const haystack = `${job.title} ${job.keywords}`.toLowerCase();
      const matchKw = !kw || haystack.includes(kw);
      const matchLoc = !loc || job.location.toLowerCase().includes(loc);
      const matchRemote = !remoteOnly || job.remote;
      const matchType = checkedTypes.has(job.type);
      return matchKw && matchLoc && matchRemote && matchType;
    });
  }, [keyword, location, remoteOnly, checkedTypes]);

  return (
    <>
      <Helmet><title>SACHI — Career</title></Helmet>

      <PageHead eyebrow="Open positions" title="Step into a career with purpose.">
        <p className={styles.headText}>
          Explore current opportunities across our community health initiatives, outreach operations, and training workshops in Uganda.
        </p>
      </PageHead>

      <section className={styles.section}>
        <div className="wrap">
          <div className={styles.filterPanel}>
            <div className={styles.filterInputs}>
              <input
                placeholder="Keywords — e.g. research, WASH, coordinator"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <input
                placeholder="Location — e.g. Kampala, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className={styles.filterRow}>
              <div className={styles.checks}>
                <label>
                  <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
                  Remote positions only
                </label>
                {jobTypes.map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      checked={checkedTypes.has(type)}
                      onChange={() => toggleType(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.count}>
            {filtered.length} {filtered.length === 1 ? 'open position' : 'open positions'}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.noResults}>
              No open positions match your search right now — try adjusting your filters.
            </div>
          ) : (
            <div className={styles.list}>
              {filtered.map((job) => (
                <div className={styles.card} key={job.title}>
                  <div>
                    <h3>{job.title}</h3>
                    <p>{job.type} · {job.location}{job.remote ? ' · Remote OK' : ''}</p>
                  </div>
                  <a href="#" className={styles.viewLink}>View role &rarr;</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Don't see the right fit?"
        text="We're always glad to hear from people who care about community health. Send us your CV and we'll keep it on file."
      />
    </>
  );
}
