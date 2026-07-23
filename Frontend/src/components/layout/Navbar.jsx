import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoWhite from "../../assets/logo-dark-bg.png";
import { navLinks } from "../../data/siteContent";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="wrap navbar-inner">
        <NavLink to="/" className="logo">
          <img src={logoWhite} alt="Luxuz Consult logo" />
          LUXUZ <span>CONSULT</span>
        </NavLink>

        {/* Desktop navigation */}
        <div className="navlinks desktop-only">
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

        <div className="nav-actions">
          <NavLink to="/contact?intent=quote" className="navcta desktop-only">
            Request quote
          </NavLink>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-navlinks">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => (isActive ? "on" : "")}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <NavLink
            to="/contact?intent=quote"
            className="mobile-navcta"
            onClick={() => setMobileMenuOpen(false)}
          >
            Request quote
          </NavLink>
        </div>
      )}
    </nav>
  );
}
