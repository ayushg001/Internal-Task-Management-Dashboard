import React from 'react';

export default function Table({ headers = [], children, emptyMessage = 'No data available' }) {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={typeof header === 'object' ? header.key || index : index}
                className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                  header.className || ''
                }`}
                onClick={header.onClick}
              >
                <div className="flex items-center gap-1">
                  {typeof header === 'object' ? header.label : header}
                  {header.sortIcon}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
          {children}
        </tbody>
      </table>
      {React.Children.count(children) === 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
