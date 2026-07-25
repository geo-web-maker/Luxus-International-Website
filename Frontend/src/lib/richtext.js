/** Parses the small markdown subset admins write for a "richtext" content
 * section: blank line = new paragraph, "- " = bullet (2 spaces of extra
 * indent = one nesting level), "**bold**" = bold. Deliberately not full
 * markdown — just enough to cover every prose pattern seen across the
 * site's service pages (single/multi paragraph intros, nested bullet
 * lists with bold lead-ins, simple checklists) without admins needing to
 * hand-author structured fields per paragraph/bullet. */

function parseBulletLines(lines) {
  let i = 0;
  function parseLevel(indent) {
    const items = [];
    while (i < lines.length && lines[i].indent >= indent) {
      if (lines[i].indent > indent) {
        if (items.length === 0) {
          // Orphaned deeper indent with nothing to nest under — treat as
          // this level instead of dropping it.
          items.push({ text: lines[i].text, children: null });
          i += 1;
          continue;
        }
        items[items.length - 1].children = parseLevel(lines[i].indent);
        continue;
      }
      const item = { text: lines[i].text, children: null };
      i += 1;
      if (i < lines.length && lines[i].indent > indent) {
        item.children = parseLevel(lines[i].indent);
      }
      items.push(item);
    }
    return items;
  }
  return parseLevel(lines[0]?.indent ?? 0);
}

export function parseRichText(text) {
  if (!text) return [];
  const rawLines = text.split("\n");
  const blocks = [];
  let paraBuf = [];
  let bulletBuf = [];

  const flushPara = () => {
    if (paraBuf.length) {
      blocks.push({ type: "p", text: paraBuf.join(" ") });
      paraBuf = [];
    }
  };
  const flushBullets = () => {
    if (bulletBuf.length) {
      blocks.push({ type: "ul", items: parseBulletLines(bulletBuf) });
      bulletBuf = [];
    }
  };

  for (const raw of rawLines) {
    const bulletMatch = raw.match(/^(\s*)-\s+(.*)$/);
    if (bulletMatch) {
      flushPara();
      bulletBuf.push({ indent: Math.floor(bulletMatch[1].length / 2), text: bulletMatch[2] });
    } else if (raw.trim() === "") {
      flushPara();
      flushBullets();
    } else {
      flushBullets();
      paraBuf.push(raw.trim());
    }
  }
  flushPara();
  flushBullets();
  return blocks;
}

/** Splits "**bold**" out of a plain-text line into an array of
 * { text, bold } fragments, for the renderer to turn into <strong>. */
export function parseInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  return parts.map((part) =>
    part.startsWith("**") && part.endsWith("**")
      ? { text: part.slice(2, -2), bold: true }
      : { text: part, bold: false }
  );
}
