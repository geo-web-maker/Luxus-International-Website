import { parseInline, parseRichText } from "../../lib/richtext";

function Inline({ text }) {
  return parseInline(text).map((frag, i) =>
    frag.bold ? <strong key={i}>{frag.text}</strong> : <span key={i}>{frag.text}</span>
  );
}

function BulletList({ items }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Inline text={item.text} />
          {item.children && <BulletList items={item.children} />}
        </li>
      ))}
    </ul>
  );
}

export default function RichText({ text }) {
  const blocks = parseRichText(text);
  return (
    <div className="richtext">
      {blocks.map((block, i) =>
        block.type === "p" ? (
          <p key={i}><Inline text={block.text} /></p>
        ) : (
          <BulletList key={i} items={block.items} />
        )
      )}
    </div>
  );
}
