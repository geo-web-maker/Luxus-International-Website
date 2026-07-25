import RichText from "./RichText";

function ItemMedia({ media, alt }) {
  if (media?.status !== "confirmed" || !media?.file) return null;
  return (
    <div className="grid-item-media">
      <img src={media.file} alt={alt} />
    </div>
  );
}

export default function ContentGrid({ heading, layout, items }) {
  return (
    <div className={`content-grid ${layout}`}>
      {heading && <div className="content-grid-head">{heading}</div>}
      <div className="grid-items">
        {items.map((item) => (
          <div className="grid-item" key={item.id}>
            <ItemMedia media={item.media} alt={item.heading} />
            <div className="grid-item-heading">{item.heading}</div>
            {item.body && (
              layout === "feature-rows"
                ? <RichText text={item.body} />
                : <div className="grid-item-body">{item.body}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
