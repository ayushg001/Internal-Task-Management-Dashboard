import React from 'react';
import { getStatusBadgeStyle } from '../utils/formatters';

export default function StatusBadge({ status }) {
  const badgeClass = getStatusBadgeStyle(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
      {status || 'Unknown'}
    </span>
  );
}
