import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import { useStore } from "../lib/store";

const filterOptions = ["Freelance", "Full time", "Part time", "Internship", "Temporary"];

export default function Career() {
  const { jobs, content } = useStore();
  const { company } = content;
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [activeFilters, setActiveFilters] = useState(new Set(filterOptions));

  const toggleFilter = (f) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) { next.delete(f); } else { next.add(f); }
      return next;
    });
  };

  const results = jobs.filter((j) => {
    const matchesKeyword = keyword === "" || j.title.toLowerCase().includes(keyword.toLowerCase());
    const matchesLocation = location === "" || j.location.toLowerCase().includes(location.toLowerCase());
    return matchesKeyword && matchesLocation && !j.filled;
  });

  return (
    <>
      <PageHeader eyebrow="/career" title="Join the team" />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="btn-primary">Search jobs</button>
      </div>

      <div className="filters mono">
        {filterOptions.map((f) => (
          <label key={f} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={activeFilters.has(f)}
              onChange={() => toggleFilter(f)}
            />
            {f}
          </label>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="empty">
          No open positions right now — check back soon, or send your CV to{" "}
          <span className="mono" style={{ color: "var(--brand-blue)" }}>{company.email}</span>
        </div>
      ) : (
        <div className="section" style={{ paddingTop: 0 }}>
          {results.map((job) => (
            <Link
              key={job.id}
              to={`/career/${job.id}`}
              className="sidebar-item"
              style={{ display: "flex", padding: "18px 0" }}
            >
              <span>
                <strong>{job.title}</strong> — {job.location}
                {job.remote ? " · Remote" : ""}
              </span>
              <span className="mono" style={{ color: "var(--text-muted)" }}>{job.type}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
