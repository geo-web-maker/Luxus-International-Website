import { useLocation } from "react-router-dom";
import { useStore } from "../../lib/store";

export default function TopBar() {
  const { content } = useStore();
  const { company } = content;
  const { pathname } = useLocation();
  const displayPath = pathname === "/" ? "/ home" : pathname;

  return (
    <div className="topbar mono">
      <span>luxuzconsult.com <span className="hl">{displayPath}</span></span>
      <span>tel: <span className="hl">{company.phone}</span> · 24/7</span>
    </div>
  );
}
