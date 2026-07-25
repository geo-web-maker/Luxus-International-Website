import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import "../styles/admin.css";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/content", label: "Site content" },
  { to: "/admin/submissions", label: "Submissions" },
];

/** Route guard + shell. Renders the login page (via redirect) if there's no
 * token; otherwise renders the sidebar + whichever admin page matched. */
export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <div className="admin-rail">
        <div className="admin-rail-brand">
          Luxuz <span className="hl">Admin</span>
        </div>
        <nav className="admin-rail-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "on" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-rail-foot">
          <button className="admin-rail-link" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
