const DataTable = ({
  columns,
  data,
  isLoading,
  emptyMessage = "Aucune donnée disponible",
}) => {
  return (
    <div className="w-full overflow-hidden bg-white rounded-3xl border border-secondary-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-50/50 border-b border-secondary-100">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-widest"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, idx) => (
                    <td key={idx} className="px-6 py-4">
                      <div className="h-4 bg-secondary-100 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-secondary-500 font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-secondary-50 transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-4 text-sm text-secondary-700 font-medium"
                    >
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
