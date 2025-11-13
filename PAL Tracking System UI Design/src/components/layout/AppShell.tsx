import React, { useState } from 'react';
import {
  Bell,
  Search,
  User,
  Moon,
  Sun,
  LogOut,
  Settings,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '../../lib/theme-context';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebar?: React.ReactNode;
  userRole?: 'student' | 'tutor' | 'admin';
  userName?: string;
}

export function AppShell({
  children,
  showSidebar = false,
  sidebar,
  userRole = 'student',
  userName = 'John Doe',
}: AppShellProps) {
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
        <div className="grid-container">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Menu */}
            <div className="flex items-center gap-4">
              {showSidebar && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-[var(--radius-base)] transition-colors"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[var(--radius-base)] bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-500)] flex items-center justify-center text-white">
                  P
                </div>
                <span className="text-[var(--color-text-primary)] hidden sm:inline">
                  PAL Tracking
                </span>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-4 rounded-[var(--radius-base)] border border-[var(--color-border)] bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-100)] transition-all"
                />
              </div>
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-[var(--radius-base)] transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-[var(--radius-base)] transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-error-500)] rounded-full" />
              </button>

              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-[var(--radius-base)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-[var(--color-text-primary)] hidden sm:inline">
                    {userName}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-[var(--color-surface)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border border-[var(--color-border)] py-2 z-20">
                      <div className="px-4 py-2 border-b border-[var(--color-border)]">
                        <p className="text-sm text-[var(--color-text-primary)]">{userName}</p>
                        <p className="text-xs text-[var(--color-text-tertiary)] capitalize">{userRole}</p>
                      </div>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors">
                        <HelpCircle className="w-4 h-4" />
                        Help & Support
                      </button>
                      <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-error-500)] hover:bg-[var(--color-surface-hover)] transition-colors">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            {/* Sidebar */}
            <aside
              className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-30 transition-transform duration-300 lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="h-full overflow-y-auto py-6">
                {sidebar}
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
