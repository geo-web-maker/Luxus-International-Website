import { useParams, Link } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import JobApplicationForm from "../components/forms/JobApplicationForm";
import { useJobs } from "../hooks/useJobs";

export default function JobDetail() {
  const { jobId } = useParams();
  const { data: jobs, loading, error } = useJobs();
  const job = jobs?.find((j) => j.id === jobId);

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="/career" title="Loading…" />
        <div className="wrap"><div className="section">Loading…</div></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader eyebrow="/career" title="Error" />
        <div className="wrap"><div className="section">Couldn't load job: {error.message}</div></div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <PageHeader eyebrow="/career" title="Job not found" />
        <div className = "wrap">
          <div className="section">
            <Link to="/career" className="btn-ghost">← Back to all jobs</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow={`/career/${job.id}`} title={job.title} />
      <div className = "wrap">
        <div className="detail-grid">
          <div className="detail-main">
            <p>{job.description}</p>
            <p className="mono" style={{ color: "var(--text-muted)", fontSize: 12 }}>
              {job.location}{job.remote ? " · Remote" : ""} · {job.type} · Deadline: {job.applicationDeadline}
            </p>
          </div>
          <div className="sidebar">
            <h3>Apply now</h3>
            <span className="sub mono">/career/{job.id}/apply</span>
            <JobApplicationForm jobId={job.id} jobTitle={job.title} />
          </div>
        </div>
      </div>
    </>
  );
}
