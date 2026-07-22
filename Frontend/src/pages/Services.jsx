import PageHeader from "../components/layout/PageHeader";
import ServiceCard from "../components/ui/ServiceCard";
import { services } from "../data/services";

export default function Services() {
  return (
    <>
      <PageHeader eyebrow="/services" title="Our services" />
       <div className="section">
        <div className="wrap">
          <div className="grid3">
            {services.map((s) => (
              <ServiceCard key={s.slug} path={s.path} name={s.shortName} image={s.image} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
