import { useState } from 'react';
import ProtectedSection from '../../components/ProtectedSection/ProtectedSection';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import { ROLES, initialAdminUsers } from '../../data/roles';
import styles from './UsersAdmin.module.css';

export default function UsersAdmin() {
  const [users, setUsers] = useState(initialAdminUsers);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '', role: 'content_manager' });

  function changeRole(id, role) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  function addUser() {
    if (!draft.name.trim() || !draft.email.trim()) return;
    setUsers((prev) => [...prev, { ...draft, id: Date.now() }]);
    setDraft({ name: '', email: '', role: 'content_manager' });
    setAdding(false);
  }

  return (
    <ProtectedSection section="users" title="Admin users">
      <div className={styles.toolbar}>
        <p className={styles.hint}>
          Assign each admin a role — the sidebar and page access they get is entirely driven by
          this. This is the page that would only ever be visible to Super Admins.
        </p>
        <button className="a-btn a-btn-primary" onClick={() => setAdding(true)}>+ Add admin</button>
      </div>

      <DataTable
        columns={['Name', 'Email', 'Role', 'Sections visible']}
        rows={users}
        renderRow={(u) => {
          const role = ROLES[u.role];
          return (
            <tr key={u.id}>
              <td className={styles.nameCell}>{u.name}</td>
              <td className="a-mono">{u.email}</td>
              <td>
                <select
                  className={styles.roleSelect}
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  {Object.entries(ROLES).map(([key, r]) => (
                    <option key={key} value={key}>{r.label}</option>
                  ))}
                </select>
              </td>
              <td className={styles.sectionsCell}>{role.sections.length} of {ROLES.super_admin.sections.length}</td>
            </tr>
          );
        }}
      />

      {adding && (
        <Modal
          title="Add a new admin"
          onClose={() => setAdding(false)}
          footer={
            <>
              <button className="a-btn" onClick={() => setAdding(false)}>Cancel</button>
              <button className="a-btn a-btn-primary" onClick={addUser}>Add admin</button>
            </>
          }
        >
          <div>
            <label htmlFor="user-name">Name</label>
            <input id="user-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="user-email">Email</label>
            <input id="user-email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </div>
          <div>
            <label htmlFor="user-role">Role</label>
            <select id="user-role" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}>
              {Object.entries(ROLES).map(([key, r]) => (
                <option key={key} value={key}>{r.label}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}
    </ProtectedSection>
  );
}
