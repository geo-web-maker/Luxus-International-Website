import RichText from "./RichText";
import ContentGrid from "./ContentGrid";

export default function SectionRenderer({ sections }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="content-sections">
      {sections.map((section) => (
        <div className="content-section" key={section.id}>
          {section.type === "richtext" ? (
            <>
              {section.heading && <h3>{section.heading}</h3>}
              <RichText text={section.body} />
            </>
          ) : (
            <ContentGrid heading={section.heading} layout={section.layout} items={section.items} />
          )}
        </div>
      ))}
    </div>
  );
}
