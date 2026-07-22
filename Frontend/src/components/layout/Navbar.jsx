import { NavLink } from "react-router-dom";
import logoWhite from "../../assets/logo-dark-bg.png";
import { useStore } from "../../lib/store";

export default function Navbar() {
  const { content } = useStore();
  const { navLinks } = content;
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        <img src={logoWhite} alt="Luxuz Consult logo" />
        LUXUZ <span>CONSULT</span>
      </NavLink>
      <div className="navlinks">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => (isActive ? "on" : "")}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <NavLink to="/contact?intent=quote" className="navcta">
        Request quote
      </NavLink>
    </nav>
  );
}
