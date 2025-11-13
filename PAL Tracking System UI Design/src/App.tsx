import React, { useState } from 'react';
import { ThemeProvider } from './lib/theme-context';
import { ToastProvider } from './components/design-system/Toast';
import { AppShell } from './components/layout/AppShell';
import { PageHeader } from './components/layout/PageHeader';
import { Login } from './components/screens/Login';
import { StudentDashboard } from './components/screens/StudentDashboard';
import { StudentRegistration } from './components/screens/StudentRegistration';
import { SubmitFeedback } from './components/screens/SubmitFeedback';
import { TutorApplication } from './components/screens/TutorApplication';
import { AdminDashboard } from './components/screens/AdminDashboard';
import { AdminUsers } from './components/screens/AdminUsers';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

type Screen =
  | 'login'
  | 'student-dashboard'
  | 'student-registration'
  | 'submit-feedback'
  | 'tutor-application'
  | 'admin-dashboard'
  | 'admin-users';

type UserRole = 'student' | 'tutor' | 'admin' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentScreen('admin-dashboard');
    } else {
      setCurrentScreen('student-dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('login');
  };

  // Navigation sidebar for different roles
  const StudentSidebar = () => (
    <nav className="space-y-1 px-4">
      <button
        onClick={() => setCurrentScreen('student-dashboard')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm transition-colors ${
          currentScreen === 'student-dashboard'
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </button>
      <button
        onClick={() => setCurrentScreen('student-registration')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm transition-colors ${
          currentScreen === 'student-registration'
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        Registration
      </button>
      <button
        onClick={() => setCurrentScreen('submit-feedback')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm transition-colors ${
          currentScreen === 'submit-feedback'
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        Submit Feedback
      </button>
      <button
        onClick={() => setCurrentScreen('tutor-application')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm transition-colors ${
          currentScreen === 'tutor-application'
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        <GraduationCap className="w-5 h-5" />
        Tutor Application
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
        <Calendar className="w-5 h-5" />
        My Sessions
      </button>
    </nav>
  );

  const AdminSidebar = () => (
    <nav className="space-y-1 px-4">
      <button
        onClick={() => setCurrentScreen('admin-dashboard')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm transition-colors ${
          currentScreen === 'admin-dashboard'
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </button>
      <button
        onClick={() => setCurrentScreen('admin-users')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm transition-colors ${
          currentScreen === 'admin-users'
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        <Users className="w-5 h-5" />
        Users
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
        <Calendar className="w-5 h-5" />
        Sessions
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
        <FileText className="w-5 h-5" />
        Applications
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
        <MessageSquare className="w-5 h-5" />
        Feedback
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
        <Settings className="w-5 h-5" />
        Settings
      </button>
    </nav>
  );

  const renderContent = () => {
    if (currentScreen === 'login') {
      return <Login onLogin={handleLogin} />;
    }

    // Student screens
    if (currentScreen === 'student-dashboard') {
      return (
        <AppShell
          showSidebar
          sidebar={<StudentSidebar />}
          userRole={userRole || 'student'}
          userName="John Doe"
        >
          <StudentDashboard onNavigate={(screen) => setCurrentScreen(screen as Screen)} />
        </AppShell>
      );
    }

    if (currentScreen === 'student-registration') {
      return (
        <AppShell
          showSidebar
          sidebar={<StudentSidebar />}
          userRole={userRole || 'student'}
          userName="John Doe"
        >
          <StudentRegistration
            onComplete={() => setCurrentScreen('student-dashboard')}
            onCancel={() => setCurrentScreen('student-dashboard')}
          />
        </AppShell>
      );
    }

    if (currentScreen === 'submit-feedback') {
      return (
        <AppShell
          showSidebar
          sidebar={<StudentSidebar />}
          userRole={userRole || 'student'}
          userName="John Doe"
        >
          <SubmitFeedback
            onSubmit={() => setCurrentScreen('student-dashboard')}
            onCancel={() => setCurrentScreen('student-dashboard')}
          />
        </AppShell>
      );
    }

    if (currentScreen === 'tutor-application') {
      return (
        <AppShell
          showSidebar
          sidebar={<StudentSidebar />}
          userRole={userRole || 'student'}
          userName="John Doe"
        >
          <TutorApplication
            onComplete={() => setCurrentScreen('student-dashboard')}
            onCancel={() => setCurrentScreen('student-dashboard')}
          />
        </AppShell>
      );
    }

    // Admin screens
    if (currentScreen === 'admin-dashboard') {
      return (
        <AppShell
          showSidebar
          sidebar={<AdminSidebar />}
          userRole="admin"
          userName="Admin User"
        >
          <PageHeader
            title="Dashboard"
            description="Overview of the PAL system"
            breadcrumbs={[
              { label: 'Home', href: '#' },
              { label: 'Dashboard' },
            ]}
          />
          <AdminDashboard />
        </AppShell>
      );
    }

    if (currentScreen === 'admin-users') {
      return (
        <AppShell
          showSidebar
          sidebar={<AdminSidebar />}
          userRole="admin"
          userName="Admin User"
        >
          <AdminUsers />
        </AppShell>
      );
    }

    return <Login onLogin={handleLogin} />;
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        {renderContent()}
      </ToastProvider>
    </ThemeProvider>
  );
}
