import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import TaskCard from '../components/TaskCard';
import { formatDate } from '../utils/formatters';
import PriorityBadge from '../components/PriorityBadge';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo, 
  UserCheck, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function DashboardPage({ currentUser, onNavigateToTasks, onSelectTask }) {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

  //  dashboard data
      const dashboardRes = await apiService.getDashboard(currentUser?.id);
      setStats(dashboardRes);

           // Fetch recent all tasks 
      const tasksRes = await apiService.getTasks({ limit: 6, page: 1, sortBy: 'created_at', sortOrder: 'DESC' });
      setRecentTasks(tasksRes.tasks || []);

      // Filter overdue tasks
      const allTasksRes = await apiService.getTasks({ limit: 50, page: 1 });
      const todayStr = new Date().toISOString().split('T')[0];
      const overdue = (allTasksRes.tasks || []).filter(
        t => t.due_date && t.due_date < todayStr && t.status !== 'Completed'
      );
      setOverdueTasks(overdue);

    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md my-4">
        <p className="font-medium">Dashboard Error</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
          onClick={loadDashboardData} 
          className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Welcome back, {currentUser?.name || 'Team Member'} 
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here is a quick overview of your team's current project tasks
          </p>
        </div>
        <button
          onClick={onNavigateToTasks}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors shadow-sm"
        >
          View All Tasks <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Tasks */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Total Tasks</span>
            <ListTodo className="w-5 h-5 text-gray-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900">{stats?.totalTasks || 0}</span>
          </div>
        </div>

        {/* Pending Task */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold uppercase">Pending</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-700">{stats?.pendingTasks || 0}</span>
          </div>
        </div>

        {/* In Progress Task */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-semibold uppercase">In Progress</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-blue-700">{stats?.inProgressTasks || 0}</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-green-600">
            <span className="text-xs font-semibold uppercase">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-green-700">{stats?.completedTasks || 0}</span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between border-l-4 border-l-red-500">
          <div className="flex items-center justify-between text-red-600">
            <span className="text-xs font-semibold uppercase">Overdue</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-red-700">{stats?.overdueTasks || 0}</span>
          </div>
        </div>

        {/* Assigned to Me */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-800">
            <span className="text-xs font-semibold uppercase">Assigned To Me</span>
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-blue-900">{stats?.myAssignedTasks || 0}</span>
          </div>
        </div>

      </div>

      {/* Main area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Recent Team Activity & Tasks</h3>
            <button
              onClick={onNavigateToTasks}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentTasks.map(task => (
              <TaskCard key={task.id} task={task} onClick={onSelectTask} />
            ))}
          </div>
        </div>

        {/* Overdue task */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm h-fit space-y-4">
          <div className="flex items-center gap-2 text-red-700 font-semibold text-sm border-b border-gray-100 pb-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Overdue Tasks Attention ({overdueTasks.length})</span>
          </div>

          {overdueTasks.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">
              🎉 No overdue tasks! All assignments are on track.
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {overdueTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t.id)}
                  className="p-3 bg-red-50 hover:bg-red-100 rounded border border-red-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <PriorityBadge priority={t.priority} />
                    <span className="text-red-700 font-semibold">{formatDate(t.due_date)}</span>
                  </div>
                  <h5 className="font-medium text-sm text-gray-900 line-clamp-1">{t.title}</h5>
                  <p className="text-xs text-gray-500 mt-1">Assigned: {t.assignee_name || 'Unassigned'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
