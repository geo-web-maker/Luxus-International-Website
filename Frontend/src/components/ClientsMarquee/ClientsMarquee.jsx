import { useClients } from "../../hooks/useClients";
import styles from "./ClientsMarquee.module.css";

/** Homepage "Our clients" section. Each logo sits on its own light chip
 * tile — this is deliberate, not a placeholder state: it lets any
 * admin-uploaded logo (whatever its own background/colors) sit cleanly on
 * the dark theme without per-image editing. Track is duplicated so the
 * CSS animation can loop seamlessly. */
export default function ClientsMarquee() {
  const { data: clients, loading, error } = useClients();

  if (loading || error || !clients || clients.length === 0) return null;

  const withImages = clients.filter((c) => c.image?.status === "confirmed" && c.image?.file);
  if (withImages.length === 0) return null;

  // Duplicate the list so the track can scroll from 0% to -50% and loop
  // without a visible seam.
  const track = [...withImages, ...withImages];

  return (
    <div className="section">
      <div className={styles.headWrap}>
        <div className={`section-head ${styles.headBar}`}>
          <h2>Trusted by</h2>
          <span className="count mono">{withImages.length} clients &amp; partners</span>
        </div>
      </div>

      <div className={styles.marquee}>
        <div className={styles.track}>
          {track.map((client, i) => (
            <div className={styles.chip} key={`${client.id}-${i}`} title={client.name}>
              <img src={client.image.file} alt={client.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
