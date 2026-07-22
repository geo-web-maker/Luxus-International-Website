import { company } from "../../data/siteContent";

export default function Footer() {
  return (
    <div className="footer mono">
      <span>© {new Date().getFullYear()} {company.name}</span>
      <span className="hl">/ser · /eng · /gis · /hse · /career</span>
    </div>
  );
}
