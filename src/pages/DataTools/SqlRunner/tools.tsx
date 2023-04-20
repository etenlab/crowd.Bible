export function TableFromResponce({
  sqlResponce,
}: {
  sqlResponce: Array<{ [key: string]: string }>;
}) {
  const headers = sqlResponce[0] ? Object.keys(sqlResponce[0]) : [];
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i} style={{ border: `solid 1px gray` }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sqlResponce.map((resp, i) => (
          <tr key={i}>
            {headers.map((header, ih) => (
              <td key={ih} style={{ border: `solid 1px gray` }}>
                {resp[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
