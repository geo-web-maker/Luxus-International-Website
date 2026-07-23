import { useParams, Link } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import JobApplicationForm from "../components/forms/JobApplicationForm";
import { jobs } from "../data/jobs";

export default function JobDetail() {
  const { jobId } = useParams();
  const job = jobs.find((j) => j.id === jobId);

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
            <JobApplicationForm jobTitle={job.title} />
          </div>
        </div>
      </div>
    </>
  );
}
