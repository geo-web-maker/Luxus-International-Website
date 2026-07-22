import { useState } from 'react';
import ProtectedSection from '../../components/ProtectedSection/ProtectedSection';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import { jobs as initialJobs, jobTypes } from '../../../data/jobs';
import styles from './CareerAdmin.module.css';

const withStatus = initialJobs.map((j, i) => ({ ...j, id: i + 1, status: 'Open' }));

export default function CareerAdmin() {
  const [jobs, setJobs] = useState(withStatus);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: '', type: jobTypes[0], location: '', remote: false });

  function toggleStatus(id) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: j.status === 'Open' ? 'Closed' : 'Open' } : j)),
    );
  }

  function addJob() {
    if (!draft.title.trim()) return;
    setJobs((prev) => [...prev, { ...draft, id: Date.now(), status: 'Open', keywords: '' }]);
    setDraft({ title: '', type: jobTypes[0], location: '', remote: false });
    setAdding(false);
  }

  return (
    <ProtectedSection section="career" title="Career">
      <div className={styles.toolbar}>
        <p className={styles.hint}>Manage the roles shown on the public Career page.</p>
        <button className="a-btn a-btn-primary" onClick={() => setAdding(true)}>+ Add role</button>
      </div>

      <DataTable
        columns={['Title', 'Type', 'Location', 'Remote', 'Status', '']}
        rows={jobs}
        renderRow={(j) => (
          <tr key={j.id}>
            <td className={styles.titleCell}>{j.title}</td>
            <td className="a-mono">{j.type}</td>
            <td>{j.location}</td>
            <td>{j.remote ? 'Yes' : 'No'}</td>
            <td>
              <span className={`a-badge ${j.status === 'Open' ? 'a-badge-success' : 'a-badge-neutral'}`}>
                {j.status}
              </span>
            </td>
            <td>
              <button className="a-btn a-btn-sm" onClick={() => toggleStatus(j.id)}>
                {j.status === 'Open' ? 'Close role' : 'Reopen'}
              </button>
            </td>
          </tr>
        )}
      />

      {adding && (
        <Modal
          title="Add a new role"
          onClose={() => setAdding(false)}
          footer={
            <>
              <button className="a-btn" onClick={() => setAdding(false)}>Cancel</button>
              <button className="a-btn a-btn-primary" onClick={addJob}>Add role</button>
            </>
          }
        >
          <div>
            <label htmlFor="job-title">Title</label>
            <input id="job-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div>
            <label htmlFor="job-type">Type</label>
            <select id="job-type" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>
              {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="job-location">Location</label>
            <input id="job-location" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
          </div>
          <div className={styles.checkRow}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={draft.remote}
                onChange={(e) => setDraft({ ...draft, remote: e.target.checked })}
              />
              Remote OK
            </label>
          </div>
        </Modal>
      )}
    </ProtectedSection>
  );
}
