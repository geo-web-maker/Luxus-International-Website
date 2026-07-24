import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import { useJobs } from "../hooks/useJobs";
import { useContent } from "../hooks/useContent";

const filterOptions = ["Freelance", "Full time", "Part time", "Internship", "Temporary"];

// Normalizes both sides so "Full Time" (backend) matches "Full time"
// (checkbox label) regardless of spacing/case differences.
function normalizeType(str) {
  return (str || "").toLowerCase().replace(/\s+/g, " ").trim();
}


export default function Career() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [activeFilters, setActiveFilters] = useState(new Set(filterOptions));

  // Server-side search: keyword/location/filled are now query params on
  // GET /api/jobs (see backend Phase 3) instead of an in-memory .filter().
  const { data: jobs, loading, error } = useJobs({ keyword, location, filled: false });
  const { data: content } = useContent();

  const toggleFilter = (f) => {
   setActiveFilters((prev) => {
     const next = new Set(prev);
     if (next.has(f)) { next.delete(f); } else { next.add(f); }
     return next;
    });
  };

  // Client-side pass over the already-fetched page: activeFilters is a
 // small fixed checkbox set, not worth a server round-trip per toggle.
  const normalizedActive = new Set([...activeFilters].map(normalizeType));
  const results = (jobs || []).filter((j) => normalizedActive.has(normalizeType(j.type)));
  const company = content?.company;

  return (
    <>
      <PageHeader eyebrow="/career" title="Join the team" />
      <div className = "wrap">
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

       {loading ? (
          <div className="empty">Loading…</div>
        ) : error ? (
          <div className="empty">Couldn't load jobs: {error.message}</div>
        ) : results.length === 0 ? (
          <div className="empty">
            No open positions right now — check back soon, or send your CV to{" "}
            <span className="mono" style={{ color: "var(--brand-blue)" }}>{company?.email}</span>
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
      </div>
    </>
  );
}
