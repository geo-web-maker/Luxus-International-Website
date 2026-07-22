import PageHeader from "../components/layout/PageHeader";
import ServiceCard from "../components/ui/ServiceCard";
import { useStore } from "../lib/store";

export default function Services() {
  const { services } = useStore();
  return (
    <>
      <PageHeader eyebrow="/services" title="Our services" />
      <div className="section">
        <div className="grid3">
          {services.map((s) => (
            <ServiceCard key={s.slug} path={s.path} name={s.shortName} image={s.image} />
          ))}
        </div>
      </div>
    </>
  );
}
