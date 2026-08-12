import React from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../utils/formatters';
import { Calendar, User } from 'lucide-react';

export default function TaskCard({ task, onClick }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed';

  return (
    <div 
      onClick={() => onClick && onClick(task.id)}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between gap-3"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <h4 className="font-semibold text-gray-900 line-clamp-1 hover:text-blue-600">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-gray-400" />
          <span>{task.assignee_name || 'Unassigned'}</span>
        </div>
        {task.due_date && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(task.due_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
