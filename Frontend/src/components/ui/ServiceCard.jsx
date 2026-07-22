import { Link } from "react-router-dom";

export default function ServiceCard({ path, name, image }) {
  const pending = !image || image.status === "pending";
  return (
    <Link to={path} className="card">
      {pending && (
        <span className="filetag mono">
          ◻ image pending{image?.note ? ` — ${image.note}` : ""}
        </span>
      )}
      <span className="id mono">{path}</span>
      <span className="name">{name}</span>
    </Link>
  );
}
