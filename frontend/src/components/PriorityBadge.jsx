import React from 'react';
import { getPriorityBadgeStyle } from '../utils/formatters';

export default function PriorityBadge({ priority }) {
  const badgeClass = getPriorityBadgeStyle(priority);

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badgeClass}`}>
      {priority || 'Medium'}
    </span>
  );
}
