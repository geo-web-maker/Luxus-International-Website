import { useRole } from '../../hooks/useRole';
import Topbar from '../Topbar/Topbar';
import styles from './ProtectedSection.module.css';

export default function ProtectedSection({ section, title, children }) {
  const { hasAccess, role } = useRole();

  if (!hasAccess(section)) {
    return (
      <>
        <Topbar title={title} />
        <div className={styles.restricted}>
          <div className={styles.badge}>Access restricted</div>
          <h2>Your role doesn't include this section.</h2>
          <p>
            You're signed in as <strong>{role?.label}</strong>, which doesn't have access to
            {' '}{title}. In the real system, this would be enforced server-side too — this
            screen is what a person navigating here directly (e.g. via a saved link) would see.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title={title} />
      <div className={styles.content}>{children}</div>
    </>
  );
}
