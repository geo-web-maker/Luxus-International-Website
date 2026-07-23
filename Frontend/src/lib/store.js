// Local data layer for the Luxuz Consult site + admin panel.
//
// There is no backend yet (see README), so this is backed by localStorage and
// seeded from the static files in src/data/ on first load. Every exported API
// object below (servicesApi, jobsApi, contentApi, submissionsApi) is shaped
// the way the eventual FastAPI routes will be — list/get/create/update/delete
// per resource — so that swapping the body of each function for a fetch()
// call is the only change needed once the backend exists. Pages should not
// reach into localStorage directly; go through these exports.

import { useSyncExternalStore } from "react";
import { services as servicesSeed } from "../data/services";
import { jobs as jobsSeed } from "../data/jobs";
import { company as companySeed, navLinks as navLinksSeed, isoCoverageTags as coverageSeed } from "../data/siteContent";

const STORAGE_KEY = "luxuz-cms-v1";

function seed() {
  return {
    services: structuredClone(servicesSeed),
    jobs: structuredClone(jobsSeed),
    content: {
      company: structuredClone(companySeed),
      navLinks: structuredClone(navLinksSeed),
      coverageTags: structuredClone(coverageSeed),
    },
    submissions: { contact: [], quote: [], jobApplication: [] },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Defensive merge so new fields added to the seed later (e.g. a new
      // submissions bucket) still show up for people with older saved state.
      return {
        ...seed(),
        ...parsed,
        content: { ...seed().content, ...parsed.content },
        submissions: { ...seed().submissions, ...parsed.submissions },
      };
    }
  } catch {
    // corrupt or inaccessible storage (e.g. private browsing) — fall back to seed
  }
  return seed();
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — state still updates in memory for this session
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  return state;
}

/** Reactive read hook — re-renders the calling component on any store write. */
export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function slugify(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Reset all admin-editable data back to the seed content. Used by the danger-zone action in Admin > Site content. */
export function resetToSeed() {
  state = seed();
  persist();
}

// ---- Services (two-tier: groups + sub-services) ---------------------------

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
  list() {
    return state.services;
  },
  getGroup(slug) {
    return state.services.find((g) => g.slug === slug) || null;
  },
  createGroup(data) {
    const slug = slugify(data.slug || data.name);
    if (!slug) throw new Error("Group needs a name.");
    if (state.services.some((g) => g.slug === slug)) {
      throw new Error(`A service group with slug "${slug}" already exists.`);
    }
    const group = {
      slug,
      path: data.path?.trim() || `/ser/${slug}`,
      name: data.name.trim(),
      shortName: data.shortName?.trim() || data.name.trim(),
      summary: data.summary?.trim() || "",
      image: data.image?.status ? data.image : { status: "pending" },
      ...(data.includedServices?.length ? { includedServices: data.includedServices } : {}),
      children: [],
    };
    state = { ...state, services: [...state.services, group] };
    persist();
    return group;
  },
  updateGroup(slug, data) {
    state = {
      ...state,
      services: state.services.map((g) =>
        g.slug === slug
          ? {
              ...g,
              ...data,
              slug: g.slug, // slug is the stable key — changing it is a delete+recreate
              includedServices: data.includedServices?.length ? data.includedServices : undefined,
            }
          : g
      ),
    };
    persist();
  },
  deleteGroup(slug) {
    state = { ...state, services: state.services.filter((g) => g.slug !== slug) };
    persist();
  },
  createChild(groupSlug, data) {
    const group = state.services.find((g) => g.slug === groupSlug);
    if (!group) throw new Error("Parent group not found.");
    const slug = slugify(data.slug || data.name);
    if (!slug) throw new Error("Sub-service needs a name.");
    if ((group.children || []).some((c) => c.slug === slug)) {
      throw new Error(`A sub-service with slug "${slug}" already exists in this group.`);
    }
    const child = {
      slug,
      path: data.path?.trim() || `${group.path}/${slug}`,
      name: data.name.trim(),
      ...(data.standardCode?.trim() ? { standardCode: data.standardCode.trim() } : {}),
      ...(data.note?.trim() ? { note: data.note.trim() } : {}),
      ...(data.benefits?.length ? { benefits: renumberBenefits(data.benefits) } : {}),
    };
    state = {
      ...state,
      services: state.services.map((g) =>
        g.slug === groupSlug ? { ...g, children: [...(g.children || []), child] } : g
      ),
    };
    persist();
    return child;
  },
  updateChild(groupSlug, childSlug, data) {
    state = {
      ...state,
      services: state.services.map((g) =>
        g.slug === groupSlug
          ? {
              ...g,
              children: g.children.map((c) =>
                c.slug === childSlug
                  ? {
                      ...c,
                      ...data,
                      slug: c.slug,
                      benefits: data.benefits?.length ? renumberBenefits(data.benefits) : undefined,
                    }
                  : c
              ),
            }
          : g
      ),
    };
    persist();
  },
  deleteChild(groupSlug, childSlug) {
    state = {
      ...state,
      services: state.services.map((g) =>
        g.slug === groupSlug ? { ...g, children: g.children.filter((c) => c.slug !== childSlug) } : g
      ),
    };
    persist();
  },
};

function renumberBenefits(benefits) {
  return benefits.map((b, i) => ({ ...b, id: String(i + 1).padStart(2, "0") }));
}

// ---- Jobs -------------------------------------------------------------

export const jobsApi = {
  list() {
    return state.jobs;
  },
  get(id) {
    return state.jobs.find((j) => j.id === id) || null;
  },
  create(data) {
    const id = slugify(data.id || data.title);
    if (!id) throw new Error("Job needs a title.");
    if (state.jobs.some((j) => j.id === id)) {
      throw new Error(`A job with id "${id}" already exists.`);
    }
    const job = { ...data, id };
    state = { ...state, jobs: [...state.jobs, job] };
    persist();
    return job;
  },
  update(id, data) {
    state = { ...state, jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...data, id: j.id } : j)) };
    persist();
  },
  delete(id) {
    state = { ...state, jobs: state.jobs.filter((j) => j.id !== id) };
    persist();
  },
};

// ---- Site content (company info, nav, coverage tags) -----------------

export const contentApi = {
  get() {
    return state.content;
  },
  updateCompany(data) {
    state = { ...state, content: { ...state.content, company: { ...state.content.company, ...data } } };
    persist();
  },
  setCoverageTags(tags) {
    state = { ...state, content: { ...state.content, coverageTags: tags } };
    persist();
  },
};

// ---- Form submissions (inbox for Contact / Quote / Job Application) ------

export const submissionsApi = {
  list(bucket) {
    return state.submissions[bucket] || [];
  },
  create(bucket, data) {
    const entry = { id: makeId(), createdAt: new Date().toISOString(), handled: false, ...data };
    state = { ...state, submissions: { ...state.submissions, [bucket]: [entry, ...state.submissions[bucket]] } };
    persist();
    return entry;
  },
  setHandled(bucket, id, handled) {
    state = {
      ...state,
      submissions: {
        ...state.submissions,
        [bucket]: state.submissions[bucket].map((e) => (e.id === id ? { ...e, handled } : e)),
      },
    };
    persist();
  },
  delete(bucket, id) {
    state = {
      ...state,
      submissions: { ...state.submissions, [bucket]: state.submissions[bucket].filter((e) => e.id !== id) },
    };
    persist();
  },
};
