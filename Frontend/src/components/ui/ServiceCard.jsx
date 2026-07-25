import { Link } from "react-router-dom";

export default function ServiceCard({ path, name, image }) {
  const hasImage = image?.status === "confirmed" && image?.file;
  return (
    <Link to={path} className="card">
      {hasImage ? (
        <img src={image.file} alt={name} className="card-image" />
      ) : (
        <span className="filetag mono">
          ◻ image pending{image?.note ? ` — ${image.note}` : ""}
        </span>
      )}
      <span className="id mono">{path}</span>
      <span className="name">{name}</span>
    </Link>
  );
}
