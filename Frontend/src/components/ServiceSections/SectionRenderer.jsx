import RichText from "./RichText";
import ContentGrid from "./ContentGrid";
import SpecTable from "./SpecTable";
import DataTable from "./DataTable";

export default function SectionRenderer({ sections }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="content-sections">
      {sections.map((section) => (
        <div className="content-section" key={section.id}>
          {section.type === "richtext" && (
            <>
              {section.heading && <h3>{section.heading}</h3>}
              <RichText text={section.body} />
            </>
          )}
          {section.type === "content-grid" && (
            <ContentGrid heading={section.heading} layout={section.layout} items={section.items} />
          )}
          {section.type === "spec-table" && (
            <>
              {section.heading && <h3>{section.heading}</h3>}
              <SpecTable rows={section.rows || []} />
            </>
          )}
          {section.type === "data-table" && (
            <DataTable heading={section.heading} columns={section.columns} rows={section.rows || []} />
          )}
        </div>
      ))}
    </div>
  );
}
