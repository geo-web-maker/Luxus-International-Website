import { useNavigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { ROLES } from '../../data/roles';
import '../../styles/admin-tokens.css';
import styles from './Login.module.css';

export default function Login() {
  const { signInAs } = useRole();
  const navigate = useNavigate();

  function handleSelect(key) {
    signInAs(key);
    navigate('/admin');
  }

  return (
    <div className={`admin-shell ${styles.wrap}`}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          SACHI <span className={styles.brandSub}>admin</span>
        </div>
        <h1>Demo sign-in</h1>
        <p className={styles.lede}>
          There's no real authentication wired up yet — pick a role below to preview exactly
          what that admin type would see. This is what gets replaced with real login + role
          checks once the FastAPI backend is connected.
        </p>

        <div className={styles.roleList}>
          {Object.entries(ROLES).map(([key, role]) => (
            <button key={key} className={styles.roleBtn} onClick={() => handleSelect(key)}>
              <div>
                <div className={styles.roleName}>{role.label}</div>
                <div className={styles.roleDesc}>{role.description}</div>
              </div>
              <span className={styles.arrow}>&rarr;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
