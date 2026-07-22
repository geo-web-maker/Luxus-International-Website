import { useLocation } from "react-router-dom";
import { company } from "../../data/siteContent";

export default function TopBar() {
  const { pathname } = useLocation();
  const displayPath = pathname === "/" ? "/ home" : pathname;

  return (
    <div className="topbar mono">
      <div className="wrap">
        <span>luxuzconsult.com <span className="hl">{displayPath}</span></span>
        <span>tel: <span className="hl">{company.phone}</span> · 24/7</span>
      </div>
    </div>
  );
}
