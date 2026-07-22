import { useRole } from '../../hooks/useRole';
import ProtectedSection from '../../components/ProtectedSection/ProtectedSection';
import StatCard from '../../components/StatCard/StatCard';
import { programmes } from '../../../data/programmes';
import { jobs } from '../../../data/jobs';
import { initialContactSubmissions, initialDonations } from '../../data/mockData';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { hasAccess } = useRole();

  const totalDonations = initialDonations.reduce((sum, d) => sum + d.amount, 0);
  const newMessages = initialContactSubmissions.filter((m) => m.status === 'New').length;
  const openJobs = jobs.length;

  return (
    <ProtectedSection section="dashboard" title="Dashboard">
      <div className={styles.grid}>
        {hasAccess('programmes') && (
          <StatCard label="Programme areas" value={programmes.length} sub="All published" />
        )}
        {hasAccess('career') && (
          <StatCard label="Open positions" value={openJobs} sub="Across all types" />
        )}
        {hasAccess('contact') && (
          <StatCard label="New messages" value={newMessages} sub="Awaiting response" />
        )}
        {hasAccess('donations') && (
          <StatCard label="Total raised" value={`UGX ${totalDonations.toLocaleString()}`} sub="This is mock data" />
        )}
      </div>

      <div className={styles.welcome}>
        <h2>Welcome back.</h2>
        <p>
          Use the sidebar to jump into the sections your role has access to. This dashboard
          is a demo — the cards above only show up if your current role can see that section,
          the same way the sidebar links do.
        </p>
      </div>
    </ProtectedSection>
  );
}
