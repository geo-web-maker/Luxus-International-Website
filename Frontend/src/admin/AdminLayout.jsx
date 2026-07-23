import { NavLink, Link } from "react-router-dom";
import { useStore } from "../lib/store";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/submissions", label: "Submissions" },
  { to: "/admin/content", label: "Site content" },
];

export default function AdminLayout({ children }) {
  const { submissions } = useStore();
  const inboxCount =
    submissions.contact.filter((s) => !s.handled).length +
    submissions.quote.filter((s) => !s.handled).length +
    submissions.jobApplication.filter((s) => !s.handled).length;

  const logOut = () => {
    sessionStorage.removeItem("luxuz-admin-session");
    window.location.href = "/admin";
  };

  return (
    <div className="admin-shell">
      <aside className="admin-rail">
        <div className="admin-rail-brand mono">luxuzconsult.com <span className="hl">/admin</span></div>
        <nav className="admin-rail-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "on" : "")}>
              {l.label}
              {l.to === "/admin/submissions" && inboxCount > 0 && (
                <span className="admin-badge">{inboxCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="admin-rail-foot">
          <Link to="/" className="admin-rail-link">← View live site</Link>
          <button type="button" className="admin-rail-link" onClick={logOut}>Log out</button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
