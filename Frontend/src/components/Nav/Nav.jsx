import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={`${styles.inner} wrap`}>
        <NavLink to="/" className={styles.mark}>
          <span className={styles.markDot} />
          SACHI
        </NavLink>

        <nav>
          <ul className={styles.navList}>
            <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''} end>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ''}>About</NavLink></li>
            <li><NavLink to="/programmes" className={({ isActive }) => isActive ? styles.active : ''}>Programmes</NavLink></li>
            <li><NavLink to="/gallery" className={({ isActive }) => isActive ? styles.active : ''}>Gallery</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? styles.active : ''}>Contact</NavLink></li>
            <li><NavLink to="/career" className={({ isActive }) => isActive ? styles.active : ''}>Career</NavLink></li>
          </ul>
        </nav>

        <NavLink to="/donate" className={styles.donate}>Donate</NavLink>
      </div>
    </header>
  );
}
