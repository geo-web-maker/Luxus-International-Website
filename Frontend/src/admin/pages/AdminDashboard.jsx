import { Link } from "react-router-dom";
import { useStore } from "../../lib/store";

export default function AdminDashboard() {
  const { services, jobs, submissions } = useStore();
  const subCount = submissions.contact.length + submissions.quote.length + submissions.jobApplication.length;
  const unhandledCount =
    submissions.contact.filter((s) => !s.handled).length +
    submissions.quote.filter((s) => !s.handled).length +
    submissions.jobApplication.filter((s) => !s.handled).length;
  const childCount = services.reduce((n, g) => n + (g.children?.length || 0), 0);
  const openJobs = jobs.filter((j) => !j.filled).length;

  const cards = [
    { label: "Service groups", value: services.length, sub: `${childCount} sub-services`, to: "/admin/services" },
    { label: "Open job listings", value: openJobs, sub: `${jobs.length} total`, to: "/admin/jobs" },
    { label: "Unhandled submissions", value: unhandledCount, sub: `${subCount} total`, to: "/admin/submissions" },
  ];

  return (
    <>
      <div className="admin-page-head">
        <span className="eyebrow mono">/admin</span>
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stat-grid">
        {cards.map((c) => (
          <Link to={c.to} className="admin-stat-card" key={c.label}>
            <span className="admin-stat-value">{c.value}</span>
            <span className="admin-stat-label">{c.label}</span>
            <span className="admin-stat-sub mono">{c.sub}</span>
          </Link>
        ))}
      </div>

      <div className="admin-panel">
        <h2>Data source</h2>
        <p>
          Everything here is stored in this browser's local storage — there's no backend yet
          (see the project README). Edits made here update the live site immediately in this
          browser, but won't be visible to other visitors or persist across devices until the
          FastAPI + MongoDB backend is wired up.
        </p>
      </div>
    </>
  );
}
