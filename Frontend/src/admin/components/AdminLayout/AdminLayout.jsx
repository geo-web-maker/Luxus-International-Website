import { Navigate, Outlet } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import Sidebar from '../Sidebar/Sidebar';
import '../../styles/admin-tokens.css';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { role } = useRole();

  if (!role) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={`admin-shell ${styles.shell}`}>
      <Sidebar />
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}
