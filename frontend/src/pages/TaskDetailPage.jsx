import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  ArrowLeft, 
  Save, 
  MessageSquare, 
  History,
  Send,
  ShieldCheck
} from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

export default function TaskDetailPage({ taskId, users = [], currentUser, onBack }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Edit State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    assigned_to: '',
    due_date: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Comment State
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    if (taskId) {
      loadTaskDetails();
    }
  }, [taskId]);

  const loadTaskDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTaskById(taskId);
      setTask(data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'Pending',
        priority: data.priority || 'Medium',
        assigned_to: data.assigned_to || '',
        due_date: data.due_date || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load task details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      await apiService.updateTask(taskId, {
        ...formData,
        user_id: currentUser?.id,
        assigned_to: formData.assigned_to ? Number(formData.assigned_to) : null,
        due_date: formData.due_date || null
      });

      const refreshed = await apiService.getTaskById(taskId);
      setTask(refreshed);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentSubmitting(true);
      await apiService.addComment(taskId, {
        user_id: currentUser?.id,
        comment: newComment.trim()
      });

      setNewComment('');
      const refreshed = await apiService.getTaskById(taskId);
      setTask(refreshed);
    } catch (err) {
      alert(`Failed to add comment: ${err.message}`);
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 text-center py-16">
        <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        <p className="text-sm text-gray-500 mt-2">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </Button>
        <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
          {error || 'Task not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </Button>
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded text-sm">
          ✓ Task updated successfully & logged in activity history!
        </div>
      )}

      {/* Role-based Permission Notice */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>
            Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.role}). Authorized to edit and post notes.
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Task Form Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <form onSubmit={handleUpdate} className="space-y-5">
            
            <Input
              label="Task Title"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={['Pending', 'In Progress', 'Completed', 'Blocked']}
              />

              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                options={['Low', 'Medium', 'High', 'Urgent']}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Assigned User"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                placeholder="Unassigned"
                options={users.map(u => ({ value: u.id, label: u.name }))}
              />

              <Input
                label="Due Date"
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed explanation of the task..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>

          </form>
        </div>

        {/* Sidebar: Comments & Activity Audit History */}
        <div className="space-y-6">
          
          {/* Comments Box */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" /> Comments & Notes ({task.comments?.length || 0})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {(!task.comments || task.comments.length === 0) ? (
                <p className="text-xs text-gray-400 text-center py-4">No comments yet.</p>
              ) : (
                task.comments.map((c) => (
                  <div key={c.id} className="p-2.5 bg-gray-50 rounded border border-gray-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-gray-800">
                      <span>{c.user_name || 'User'}</span>
                      <span className="text-gray-400 text-[10px]">{formatDateTime(c.created_at)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-2 border-t border-gray-200 space-y-2">
              <textarea
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post a comment..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Button type="submit" size="sm" disabled={commentSubmitting || !newComment.trim()} className="w-full gap-1">
                <Send className="w-3.5 h-3.5" /> Post Comment
              </Button>
            </form>
          </div>

          {/* Task Activity & Audit Logs Timeline */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" /> Activity History & Audit Logs
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 text-xs">
              {(!task.logs || task.logs.length === 0) ? (
                <p className="text-xs text-gray-400 text-center py-4">No activity logged yet.</p>
              ) : (
                task.logs.map(log => (
                  <div key={log.id} className="border-l-2 border-blue-500 pl-3 py-1 space-y-0.5">
                    <div className="font-medium text-gray-800">{log.action}</div>
                    <div className="text-[10px] text-gray-400">
                      {log.user_name ? `By ${log.user_name} • ` : ''}{formatDateTime(log.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
