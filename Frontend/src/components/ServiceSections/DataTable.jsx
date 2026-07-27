import RichText from "./RichText";

// Generic data table for arbitrary columns/rows — covers credential
// comparison tables, side-by-side benefit lists (as a 2-column table),
// agendas, and anything else that's naturally tabular but doesn't fit the
// fixed label:value shape of SpecTable. Cell text supports the same
// bullet/bold subset as richtext sections, so a cell can hold a short list
// (e.g. "Employees" benefits) not just a single line.
export default function DataTable({ heading, columns, rows }) {
  return (
    <div className="data-table-wrap">
      {heading && <h3>{heading}</h3>}
      <div className="data-table-scroll">
        <table className="data-table">
          {columns && columns.length > 0 && (
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>
                    <RichText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
