import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Modal from '../components/Modal';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  ArrowUpDown,
  Calendar,
  X
} from 'lucide-react';

export default function TaskListPage({ users = [], currentUser, onSelectTask }) {
  // State for data
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, currentPage: 1, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal State for New Task
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    assigned_to: '',
    due_date: ''
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Delete Confirmation State
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [page, limit, statusFilter, priorityFilter, assigneeFilter, sortBy, sortOrder]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadTasks();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiService.getTasks({
        search,
        status: statusFilter,
        priority: priorityFilter,
        assignee: assigneeFilter,
        sortBy,
        sortOrder,
        page,
        limit
      });

      setTasks(res.tasks || []);
      setPagination(res.pagination || { totalItems: 0, currentPage: 1, totalPages: 1, limit: 10 });
    } catch (err) {
      setError(err.message || 'Failed to load task list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setAssigneeFilter('');
    setSortBy('created_at');
    setSortOrder('DESC');
    setPage(1);
  };

  // Handle Create Task Form Submit
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setModalError('Task title is required.');
      return;
    }

    try {
      setCreateSubmitting(true);
      setModalError(null);
      await apiService.createTask({
        ...newTask,
        assigned_to: newTask.assigned_to ? Number(newTask.assigned_to) : null,
        due_date: newTask.due_date || null
      });

      setIsCreateModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        assigned_to: '',
        due_date: ''
      });
      loadTasks();
    } catch (err) {
      setModalError(err.message || 'Failed to create task.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await apiService.deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      loadTasks();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tableHeaders = [
    { label: 'Task Name', key: 'title', onClick: () => handleSort('title'), sortIcon: <ArrowUpDown className="w-3 h-3 text-gray-400" /> },
    { label: 'Assignee', key: 'assignee' },
    { label: 'Priority', key: 'priority', onClick: () => handleSort('priority'), sortIcon: <ArrowUpDown className="w-3 h-3 text-gray-400" /> },
    { label: 'Status', key: 'status', onClick: () => handleSort('status'), sortIcon: <ArrowUpDown className="w-3 h-3 text-gray-400" /> },
    { label: 'Due Date', key: 'due_date', onClick: () => handleSort('due_date'), sortIcon: <ArrowUpDown className="w-3 h-3 text-gray-400" /> },
    { label: 'Created Date', key: 'created_at', onClick: () => handleSort('created_at'), sortIcon: <ArrowUpDown className="w-3 h-3 text-gray-400" /> },
    { label: 'Actions', key: 'actions', className: 'text-right' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Task Management</h2>
          <p className="text-sm text-gray-500">Filter, search, assign, and manage team tasks.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create New Task
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by task title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <Select
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Blocked', label: 'Blocked' }
            ]}
          />

          {/* Priority Filter */}
          <Select
            placeholder="All Priorities"
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Urgent', label: 'Urgent' }
            ]}
          />

          {/* Assignee Filter */}
          <Select
            placeholder="All Assignees"
            value={assigneeFilter}
            onChange={(e) => { setAssigneeFilter(e.target.value); setPage(1); }}
            options={users.map(u => ({ value: u.id, label: u.name }))}
          />

        </div>

        {/* Active Filter Clear Tag */}
        {(search || statusFilter || priorityFilter || assigneeFilter) && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            <span className="font-semibold">Active filters:</span>
            <Button size="sm" variant="outline" onClick={handleClearFilters} className="py-0.5 px-2 text-xs gap-1">
              <X className="w-3 h-3" /> Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Task Table */}
      {loading ? (
        <div className="bg-white p-12 border border-gray-200 rounded-lg text-center">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-sm text-gray-500 mt-2">Loading tasks...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Table headers={tableHeaders} emptyMessage="No tasks found matching the selected criteria.">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  <button
                    onClick={() => onSelectTask(task.id)}
                    className="hover:text-blue-600 text-left line-clamp-1"
                  >
                    {task.title}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {task.assignee_name ? (
                    <span className="font-medium text-gray-800">{task.assignee_name}</span>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {formatDate(task.due_date)}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {formatDate(task.created_at)}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => onSelectTask(task.id)}
                    className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-100"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>

          {/* Pagination Controls */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
          />
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={createSubmitting}>
              {createSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          {modalError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded border border-red-200">
              {modalError}
            </div>
          )}

          <Input
            label="Task Title"
            id="task_title"
            required
            placeholder="e.g., Implement Search Endpoint"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              placeholder="Detailed instructions or specifications..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              options={['Pending', 'In Progress', 'Completed', 'Blocked']}
            />

            <Select
              label="Priority"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              options={['Low', 'Medium', 'High', 'Urgent']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assign Team Member"
              value={newTask.assigned_to}
              onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
              placeholder="Unassigned"
              options={users.map(u => ({ value: u.id, label: u.name }))}
            />

            <Input
              label="Due Date"
              id="due_date"
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Confirm Task Deletion"
        footer={
          <>
            <Button variant="outline" onClick={() => setTaskToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteTask}>
              Delete Permanently
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete the task <span className="font-bold text-gray-900">"{taskToDelete?.title}"</span>?
          This action cannot be undone.
        </p>
      </Modal>

    </div>
  );
}
