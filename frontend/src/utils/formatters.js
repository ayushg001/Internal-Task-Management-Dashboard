// Helper Utility Functions

// Format date strings into human readable format (e.g. "Aug 15, 2026")
export function   formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Format datetime strings into human readable format
export function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '-';
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return dateTimeString;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Return color styling class for Status badges
export function getStatusBadgeStyle(status) {
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'in progress':
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'blocked':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Return color styling class for Priority badges
export function getPriorityBadgeStyle(priority) {
  const normalized = (priority || '').toLowerCase();
  switch (normalized) {
    case 'low':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'medium':
      return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'urgent':
      return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
