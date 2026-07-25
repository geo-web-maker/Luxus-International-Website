// API layer for the Luxuz Consult site + admin panel.
//
// Backed by the FastAPI backend (see backend/README or DESIGN_BRIEF.md).
// Every exported object below (servicesApi, jobsApi, contentApi,
// submissionsApi) is shaped the same way store.js's mock version was —
// list/get/create/update/delete per resource — but every call is now async
// and goes over HTTP via request() from ./apiClient. Pages should not call
// fetch directly; go through these exports, or through the hooks in
// src/hooks/ for read access.

import { request } from "./apiClient";

export function slugify(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---- Services (two-tier: groups + sub-services) ---------------------------

/** Finds a group or child by its `path`. Accepts the full services list
 * (as returned by servicesApi.list()) so callers control freshness/caching
 * instead of this module holding its own copy. */
export function findServiceByPath(servicesList, path) {
  for (const group of servicesList) {
    if (group.path === path) return group;
    for (const child of group.children || []) {
      if (child.path === path) return { ...child, parent: group };
    }
  }
  return null;
}

export const servicesApi = {
  list: () => request("/services"),
  getGroup: (slug) => request(`/services/${slug}`),
  createGroup: (data) =>
    request("/services", { method: "POST", body: JSON.stringify(data) }),
  updateGroup: (slug, data) =>
    request(`/services/${slug}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteGroup: (slug) => request(`/services/${slug}`, { method: "DELETE" }),
  createChild: (groupSlug, data) =>
    request(`/services/${groupSlug}/children`, { method: "POST", body: JSON.stringify(data) }),
  updateChild: (groupSlug, childSlug, data) =>
    request(`/services/${groupSlug}/children/${childSlug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteChild: (groupSlug, childSlug) =>
    request(`/services/${groupSlug}/children/${childSlug}`, { method: "DELETE" }),
  uploadGroupImage: (slug, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request(`/services/${slug}/image`, { method: "POST", body: formData });
  },
  uploadChildImage: (groupSlug, childSlug, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request(`/services/${groupSlug}/children/${childSlug}/image`, {
      method: "POST",
      body: formData,
    });
  },
};

// ---- Jobs -------------------------------------------------------------

export const jobsApi = {
  list: (params) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request(`/jobs${query}`);
  },
  get: (id) => request(`/jobs/${id}`),
  create: (data) => request("/jobs", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id) => request(`/jobs/${id}`, { method: "DELETE" }),
};

// ---- Site content (company info, nav, coverage tags) -----------------

export const contentApi = {
  get: () => request("/content"),
  updateCompany: (data) =>
    request("/content/company", { method: "PATCH", body: JSON.stringify(data) }),
  setCoverageTags: (tags) =>
    request("/content/coverage-tags", {
      method: "PATCH",
      body: JSON.stringify({ isoCoverageTags: tags }),
    }),
};

// ---- Form submissions (admin inbox for Contact / Quote / Job Application) -
// Note: submitting a new entry does NOT go through this object — the three
// public forms POST directly to their own endpoints (see ContactForm.jsx,
// QuoteForm.jsx, JobApplicationForm.jsx). This object is admin-inbox-only.

function bucketPath(bucket) {
  return {
    contact: "contact-messages",
    quote: "quote-requests",
    jobApplication: "job-applications",
  }[bucket];
}

export const submissionsApi = {
  list: (bucket) => request(`/admin/${bucketPath(bucket)}`),
  setHandled: (bucket, id, handled) =>
    request(`/admin/${bucketPath(bucket)}/${id}?handled=${handled}`, { method: "PATCH" }),
  delete: (bucket, id) =>
    request(`/admin/${bucketPath(bucket)}/${id}`, { method: "DELETE" }),
};
