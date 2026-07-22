import { useStore } from "../../lib/store";

export default function Footer() {
  const { content } = useStore();
  const { company } = content;
  return (
    <div className="footer mono">
      <span>© {new Date().getFullYear()} {company.name}</span>
      <span className="hl">/ser · /eng · /gis · /hse · /career</span>
    </div>
  );
}
