import { Link } from "react-router-dom";
import { useServices } from "../../hooks/useServices";
import { useJobs } from "../../hooks/useJobs";
import { useSubmissions } from "../../hooks/useSubmissions";

export default function AdminDashboard() {
  const { data: services, loading: servicesLoading } = useServices();
  const { data: jobs, loading: jobsLoading } = useJobs();
  const contact = useSubmissions("contact");
  const quote = useSubmissions("quote");
  const jobApplication = useSubmissions("jobApplication");

  const loading =
    servicesLoading || jobsLoading || contact.loading || quote.loading || jobApplication.loading;

  const unhandledCount = (list) => (list || []).filter((e) => !e.handled).length;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-page-sub">
            Overview of services, open roles, and pending form submissions.
          </p>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="admin-stat-grid">
          <Link to="/admin/services" className="admin-stat-card">
            <div className="admin-stat-value">{services?.length ?? 0}</div>
            <div className="admin-stat-label">Service groups</div>
            <div className="admin-stat-sub">
              {(services || []).reduce((sum, g) => sum + (g.children?.length || 0), 0)} sub-services
            </div>
          </Link>
          <Link to="/admin/jobs" className="admin-stat-card">
            <div className="admin-stat-value">{jobs?.length ?? 0}</div>
            <div className="admin-stat-label">Job listings</div>
            <div className="admin-stat-sub">
              {(jobs || []).filter((j) => !j.filled).length} open
            </div>
          </Link>
          <Link to="/admin/submissions" className="admin-stat-card">
            <div className="admin-stat-value">
              {unhandledCount(contact.data) + unhandledCount(quote.data) + unhandledCount(jobApplication.data)}
            </div>
            <div className="admin-stat-label">Unhandled submissions</div>
            <div className="admin-stat-sub">
              {unhandledCount(contact.data)} contact · {unhandledCount(quote.data)} quotes ·{" "}
              {unhandledCount(jobApplication.data)} applications
            </div>
          </Link>
        </div>
      )}

      <div className="admin-panel">
        <h2>Quick links</h2>
        <p>Jump straight to the section you need to edit.</p>
        <div className="admin-group-actions">
          <Link to="/admin/services" className="btn-ghost">Manage services</Link>
          <Link to="/admin/jobs" className="btn-ghost">Manage jobs</Link>
          <Link to="/admin/content" className="btn-ghost">Edit site content</Link>
          <Link to="/admin/submissions" className="btn-ghost">View submissions</Link>
        </div>
      </div>
    </>
  );
}
