import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import DashboardPage from './pages/DashboardPage';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import ExternalUsersPage from './pages/ExternalUsersPage';
import ApiDocsPage from './pages/ApiDocsPage';
import Button from './components/Button';
import { useUsers } from './hooks/useUsers';
import { LogIn, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const { users, currentUser, setCurrentUser, loading: loadingUsers } = useUsers();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId);
    setActiveTab('task_detail');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedTaskId(null);
          setActiveTab(tab);
        }}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingUsers ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : !currentUser ? (
          <div className="bg-white p-12 rounded-lg border border-gray-200 text-center max-w-md mx-auto my-12 shadow-sm space-y-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Authentication Required</h2>
              <p className="text-xs text-gray-500 mt-1">
                You are currently logged out. Please sign in to access the task dashboard.
              </p>
            </div>
            <Button onClick={() => setIsLoginOpen(true)} className="w-full gap-2 justify-center">
              <LogIn className="w-4 h-4" /> Sign In Now
            </Button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardPage
                currentUser={currentUser}
                onNavigateToTasks={() => setActiveTab('tasks')}
                onSelectTask={handleSelectTask}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskListPage
                users={users}
                currentUser={currentUser}
                onSelectTask={handleSelectTask}
              />
            )}

            {activeTab === 'task_detail' && selectedTaskId && (
              <TaskDetailPage
                taskId={selectedTaskId}
                users={users}
                currentUser={currentUser}
                onBack={() => setActiveTab('tasks')}
              />
            )}

            {activeTab === 'external' && (
              <ExternalUsersPage />
            )}

            {activeTab === 'docs' && (
              <ApiDocsPage />
            )}
          </>
        )}
      </main>

      {/* Authentication / Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        users={users}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500 mt-auto">
        Internal Task & Management Dashboard • Built with React, Vite, Tailwind CSS & Node.js Express
      </footer>
    </div>
  );
}
