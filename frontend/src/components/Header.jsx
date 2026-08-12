import React from 'react';
import { LayoutDashboard, CheckSquare, Globe, LogIn, LogOut, FileText, UserCheck } from 'lucide-react';
import { apiService } from '../services/api';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  setCurrentUser,
  onOpenLogin 
}) {
  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    onOpenLogin();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / App Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">TeamTask</h1>
              <span className="text-xs text-gray-500">Internal Management Dashboard</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Task Management
            </button>

            <button
              onClick={() => setActiveTab('external')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'external'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              External API
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'docs'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              API Docs
            </button>
          </nav>

          {/* Authentication & User Bar */}
          <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">{currentUser.email}</div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 rounded text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-gray-100 py-2 justify-around">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-xs flex flex-col items-center gap-1 p-1 ${
              activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`text-xs flex flex-col items-center gap-1 p-1 ${
              activeTab === 'tasks' ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Tasks
          </button>

          <button
            onClick={() => setActiveTab('external')}
            className={`text-xs flex flex-col items-center gap-1 p-1 ${
              activeTab === 'external' ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}
          >
            <Globe className="w-4 h-4" />
            External
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`text-xs flex flex-col items-center gap-1 p-1 ${
              activeTab === 'docs' ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            Docs
          </button>
        </div>

      </div>
    </header>
  );
}
