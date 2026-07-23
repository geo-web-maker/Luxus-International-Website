import { useNavigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import styles from './Topbar.module.css';

export default function Topbar({ title }) {
  const { role, signOut } = useRole();
  const navigate = useNavigate();

  function handleSwitch() {
    signOut();
    navigate('/admin/login');
  }

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>
        <div className={styles.viewingAs}>
          Viewing as <strong>{role?.label}</strong>
        </div>
        <button className={styles.switchBtn} onClick={handleSwitch}>Switch role</button>
      </div>
    </header>
  );
}
