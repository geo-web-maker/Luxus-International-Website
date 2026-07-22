import { useState } from "react";
import { useStore, servicesApi } from "../../lib/store";
import ServiceGroupModal from "./ServiceGroupModal";
import ServiceChildModal from "./ServiceChildModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminServices() {
  const { services } = useStore();
  const [expanded, setExpanded] = useState(() => new Set(services.map((g) => g.slug)));
  const [groupModal, setGroupModal] = useState(null); // null | "new" | group object
  const [childModal, setChildModal] = useState(null); // null | { group, child? }
  const [deleteTarget, setDeleteTarget] = useState(null); // { kind: "group"|"child", ... }

  const toggle = (slug) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow mono">/admin/services</span>
          <h1>Services</h1>
          <p className="admin-page-sub">
            Two-tier structure: create a group first (e.g. "Management System Certification"),
            then add sub-services inside it (e.g. individual ISO standards). Groups without
            sub-services can list "included services" as simple tags instead.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setGroupModal("new")}>
          + Add service group
        </button>
      </div>

      <div className="admin-list">
        {services.map((group) => {
          const isOpen = expanded.has(group.slug);
          const childSlugs = (group.children || []).map((c) => c.slug);
          return (
            <div className="admin-group" key={group.slug}>
              <button type="button" className="admin-group-head" onClick={() => toggle(group.slug)}>
                <span className={`admin-chevron ${isOpen ? "open" : ""}`}>▸</span>
                <span className="id mono">{group.path}</span>
                <span className="admin-group-name">{group.name}</span>
                <span className="admin-group-count mono">
                  {group.children?.length ? `${group.children.length} sub-services` : "no sub-services"}
                </span>
              </button>

              {isOpen && (
                <div className="admin-group-body">
                  {group.summary && <p className="admin-group-summary">{group.summary}</p>}

                  {group.includedServices?.length > 0 && (
                    <div className="admin-taglist" style={{ marginBottom: 16 }}>
                      {group.includedServices.map((s) => (
                        <span className="admin-tag admin-tag-static" key={s}>{s}</span>
                      ))}
                    </div>
                  )}

                  {group.children?.length > 0 && (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Path</th>
                          <th>Name</th>
                          <th>Standard</th>
                          <th>Benefits</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {group.children.map((child) => (
                          <tr key={child.slug}>
                            <td className="mono">{child.path}</td>
                            <td>{child.name}</td>
                            <td className="mono">{child.standardCode || "—"}</td>
                            <td>{child.benefits?.length || 0}</td>
                            <td className="admin-row-actions">
                              <button type="button" onClick={() => setChildModal({ group, child })}>Edit</button>
                              <button
                                type="button"
                                className="admin-danger-link"
                                onClick={() =>
                                  setDeleteTarget({ kind: "child", groupSlug: group.slug, child })
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <div className="admin-group-actions">
                    <button type="button" className="btn-ghost admin-btn-small" onClick={() => setChildModal({ group })}>
                      + Add sub-service
                    </button>
                    <button type="button" className="btn-ghost admin-btn-small" onClick={() => setGroupModal(group)}>
                      Edit group
                    </button>
                    <button
                      type="button"
                      className="admin-danger-link"
                      onClick={() => setDeleteTarget({ kind: "group", group, childSlugs })}
                    >
                      Delete group
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {groupModal && (
        <ServiceGroupModal
          group={groupModal === "new" ? null : groupModal}
          existingSlugs={services.map((g) => g.slug)}
          onClose={() => setGroupModal(null)}
          onSave={(data) => {
            if (groupModal === "new") {
              servicesApi.createGroup(data);
              setExpanded((prev) => new Set(prev).add(data.slug));
            } else {
              servicesApi.updateGroup(groupModal.slug, data);
            }
          }}
        />
      )}

      {childModal && (
        <ServiceChildModal
          group={childModal.group}
          child={childModal.child}
          existingSlugs={(childModal.group.children || []).map((c) => c.slug)}
          onClose={() => setChildModal(null)}
          onSave={(data) => {
            if (childModal.child) {
              servicesApi.updateChild(childModal.group.slug, childModal.child.slug, data);
            } else {
              servicesApi.createChild(childModal.group.slug, data);
            }
          }}
        />
      )}

      {deleteTarget?.kind === "group" && (
        <ConfirmDialog
          title="Delete service group?"
          message={
            deleteTarget.childSlugs.length > 0
              ? `"${deleteTarget.group.name}" has ${deleteTarget.childSlugs.length} sub-service(s). Deleting the group removes all of them too. This can't be undone.`
              : `Delete "${deleteTarget.group.name}"? This can't be undone.`
          }
          onConfirm={() => servicesApi.deleteGroup(deleteTarget.group.slug)}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {deleteTarget?.kind === "child" && (
        <ConfirmDialog
          title="Delete sub-service?"
          message={`Delete "${deleteTarget.child.name}"? This can't be undone.`}
          onConfirm={() => servicesApi.deleteChild(deleteTarget.groupSlug, deleteTarget.child.slug)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
