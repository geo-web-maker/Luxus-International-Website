import PageHeader from "../components/layout/PageHeader";
import ServiceCard from "../components/ui/ServiceCard";
import { useServices } from "../hooks/useServices";

export default function Services() {
  const { data: services, loading, error } = useServices();

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="/services" title="Our services" />
        <div className="section"><div className="wrap">Loading…</div></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader eyebrow="/services" title="Our services" />
        <div className="section"><div className="wrap">Couldn't load services: {error.message}</div></div>
      </>
    );
  }

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
