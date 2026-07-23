import ProtectedSection from '../../components/ProtectedSection/ProtectedSection';
import DataTable from '../../components/DataTable/DataTable';
import StatCard from '../../components/StatCard/StatCard';
import { initialDonations } from '../../data/mockData';
import styles from './DonationsAdmin.module.css';

export default function DonationsAdmin() {
  const total = initialDonations.reduce((sum, d) => sum + d.amount, 0);
  const monthlyDonors = initialDonations.filter((d) => d.type === 'Monthly').length;
  const avgGift = Math.round(total / initialDonations.length);

  return (
    <ProtectedSection section="donations" title="Donations">
      <p className={styles.hint}>Mock donation data — read-only view. Real records connect once payments are wired up.</p>

      <div className={styles.statRow}>
        <StatCard label="Total raised" value={`UGX ${total.toLocaleString()}`} />
        <StatCard label="Monthly donors" value={monthlyDonors} />
        <StatCard label="Average gift" value={`UGX ${avgGift.toLocaleString()}`} />
      </div>

      <DataTable
        columns={['Donor', 'Amount', 'Type', 'Method', 'Date']}
        rows={initialDonations}
        renderRow={(d) => (
          <tr key={d.id}>
            <td className={styles.donorCell}>{d.donor}</td>
            <td className="a-mono">UGX {d.amount.toLocaleString()}</td>
            <td>
              <span className={`a-badge ${d.type === 'Monthly' ? 'a-badge-success' : 'a-badge-neutral'}`}>
                {d.type}
              </span>
            </td>
            <td>{d.method}</td>
            <td className="a-mono">{d.date}</td>
          </tr>
        )}
      />
    </ProtectedSection>
  );
}
