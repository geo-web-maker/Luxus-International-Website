import { useState } from 'react';
import ProtectedSection from '../../components/ProtectedSection/ProtectedSection';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import { initialContactSubmissions } from '../../data/mockData';
import styles from './ContactAdmin.module.css';

export default function ContactAdmin() {
  const [messages, setMessages] = useState(initialContactSubmissions);
  const [viewing, setViewing] = useState(null);

  function openMessage(msg) {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: 'Read' } : m)));
    setViewing({ ...msg, status: 'Read' });
  }

  return (
    <ProtectedSection section="contact" title="Contact submissions">
      <p className={styles.hint}>Demo submissions — real messages will arrive via the FastAPI contact endpoint.</p>

      <DataTable
        columns={['Name', 'Subject', 'Date', 'Status', '']}
        rows={messages}
        renderRow={(m) => (
          <tr key={m.id}>
            <td className={styles.nameCell}>{m.name}</td>
            <td>{m.subject}</td>
            <td className="a-mono">{m.date}</td>
            <td>
              <span className={`a-badge ${m.status === 'New' ? 'a-badge-warn' : 'a-badge-neutral'}`}>
                {m.status}
              </span>
            </td>
            <td>
              <button className="a-btn a-btn-sm" onClick={() => openMessage(m)}>View</button>
            </td>
          </tr>
        )}
      />

      {viewing && (
        <Modal title={viewing.subject} onClose={() => setViewing(null)}>
          <div className={styles.metaRow}>
            <div><strong>{viewing.name}</strong></div>
            <div className="a-mono">{viewing.email}</div>
            <div className="a-mono">{viewing.date}</div>
          </div>
          <p className={styles.messageBody}>{viewing.message}</p>
        </Modal>
      )}
    </ProtectedSection>
  );
}
