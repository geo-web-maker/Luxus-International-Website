import { Link } from "react-router-dom";

export default function SidebarServiceCard({ path, name, image }) {
  const hasImage = image?.status === "confirmed" && image?.file;
  return (
    <Link to={path} className="sidebar-service-card">
      <div className="thumb">
        {hasImage ? (
          <img src={image.file} alt="" />
        ) : (
          <span className="no-image mono">◻</span>
        )}
      </div>
      <span className="name">{name}</span>
    </Link>
  );
}
