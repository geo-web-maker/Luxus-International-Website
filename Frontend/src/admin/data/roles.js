// Demo role model. In the real backend this becomes a `role` field on the
// admin user record, checked server-side on every request — this client-side
// version is only for demoing the UX of role-based page access.

export const ROLES = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full access to every section, including managing other admins.',
    sections: ['dashboard', 'programmes', 'career', 'gallery', 'contact', 'donations', 'users'],
  },
  content_manager: {
    label: 'Content Manager',
    description: 'Manages programme copy and the public photo gallery.',
    sections: ['dashboard', 'programmes', 'gallery'],
  },
  hr_manager: {
    label: 'HR Manager',
    description: 'Manages open positions on the Career page.',
    sections: ['dashboard', 'career'],
  },
  comms_manager: {
    label: 'Comms Manager',
    description: 'Reviews and responds to contact form submissions.',
    sections: ['dashboard', 'contact'],
  },
  finance_viewer: {
    label: 'Finance Viewer',
    description: 'Read-only visibility into donation activity.',
    sections: ['dashboard', 'donations'],
  },
};

export const SECTION_META = {
  dashboard: { label: 'Dashboard', path: '/admin' },
  programmes: { label: 'Programmes', path: '/admin/programmes' },
  career: { label: 'Career', path: '/admin/career' },
  gallery: { label: 'Gallery', path: '/admin/gallery' },
  contact: { label: 'Contact submissions', path: '/admin/contact' },
  donations: { label: 'Donations', path: '/admin/donations' },
  users: { label: 'Admin users', path: '/admin/users' },
};

// Mock roster — who exists and what role they hold. Editable from the
// Users page if you're signed in as super_admin.
export const initialAdminUsers = [
  { id: 1, name: 'Aisha Nakato', email: 'aisha@sachiuganda.org', role: 'super_admin' },
  { id: 2, name: 'Brian Okello', email: 'brian@sachiuganda.org', role: 'content_manager' },
  { id: 3, name: 'Grace Nabirye', email: 'grace@sachiuganda.org', role: 'hr_manager' },
  { id: 4, name: 'Daniel Ssebunya', email: 'daniel@sachiuganda.org', role: 'comms_manager' },
  { id: 5, name: 'Patricia Auma', email: 'patricia@sachiuganda.org', role: 'finance_viewer' },
];
