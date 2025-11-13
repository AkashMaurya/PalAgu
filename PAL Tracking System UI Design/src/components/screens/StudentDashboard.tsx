import React from 'react';
import {
  Calendar,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { Card } from '../design-system/Card';
import { Badge } from '../design-system/Badge';
import { Button } from '../design-system/Button';

interface StudentDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const kpis = [
    {
      label: 'Upcoming Sessions',
      value: '3',
      change: '+2 this week',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-[var(--color-primary-600)]',
    },
    {
      label: 'Registered Courses',
      value: '5',
      change: 'Active semester',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-[var(--color-accent-500)]',
    },
    {
      label: 'Pending Feedback',
      value: '2',
      change: 'Needs attention',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'text-[var(--color-warning-600)]',
    },
    {
      label: 'Hours Completed',
      value: '12.5',
      change: '+3.5 this month',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-[var(--color-info-500)]',
    },
  ];

  const recentSessions = [
    {
      id: '1',
      course: 'CS 101 - Intro to Programming',
      tutor: 'Sarah Johnson',
      topic: 'Object-Oriented Programming Basics',
      date: 'Nov 8, 2025',
      time: '2:00 PM - 3:00 PM',
      status: 'completed',
    },
    {
      id: '2',
      course: 'MATH 201 - Calculus II',
      tutor: 'Michael Chen',
      topic: 'Integration Techniques',
      date: 'Nov 12, 2025',
      time: '10:00 AM - 11:00 AM',
      status: 'upcoming',
    },
    {
      id: '3',
      course: 'ENG 105 - Academic Writing',
      tutor: 'Emma Davis',
      topic: 'Essay Structure and Argumentation',
      date: 'Nov 15, 2025',
      time: '3:00 PM - 4:00 PM',
      status: 'upcoming',
    },
  ];

  const announcements = [
    {
      id: '1',
      title: 'New Tutoring Hours Available',
      content: 'Extended evening sessions now available for STEM courses.',
      date: 'Nov 8, 2025',
    },
    {
      id: '2',
      title: 'Feedback Survey Reminder',
      content: 'Please complete feedback for your recent tutoring sessions.',
      date: 'Nov 7, 2025',
    },
  ];

  return (
    <div className="grid-container py-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <Card key={index} variant="elevated">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-[var(--color-text-secondary)]">{kpi.label}</p>
                <h2 className="mt-2 text-[var(--color-text-primary)]">{kpi.value}</h2>
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{kpi.change}</p>
              </div>
              <div className={`p-3 rounded-[var(--radius-md)] bg-[var(--color-background-secondary)] ${kpi.color}`}>
                {kpi.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          variant="elevated"
          padding="none"
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onNavigate?.('submit-feedback')}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white">Submit Feedback</h3>
                <p className="mt-2 text-emerald-50 text-sm">
                  Share your tutoring session experience
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-emerald-100" />
            </div>
            <div className="mt-6 flex items-center gap-2 text-white">
              <span className="text-sm">Get started</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Card>

        <Card
          variant="elevated"
          padding="none"
          className="bg-gradient-to-br from-violet-500 to-violet-600 text-white cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onNavigate?.('tutor-application')}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white">Become a Tutor</h3>
                <p className="mt-2 text-violet-50 text-sm">
                  Apply to help fellow students succeed
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-violet-100" />
            </div>
            <div className="mt-6 flex items-center gap-2 text-white">
              <span className="text-sm">Start application</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <Card variant="elevated" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[var(--color-text-primary)]">Recent Sessions</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-primary-600)] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm text-[var(--color-text-primary)]">
                        {session.course}
                      </h4>
                      <Badge
                        variant={session.status === 'completed' ? 'success' : 'primary'}
                        size="sm"
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                      {session.topic}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.time}
                      </span>
                    </div>
                  </div>
                  {session.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate?.('submit-feedback')}
                    >
                      Give Feedback
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Announcements */}
        <Card variant="elevated">
          <h3 className="text-[var(--color-text-primary)] mb-6">Announcements</h3>
          
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 rounded-[var(--radius-md)] bg-[var(--color-background-secondary)]"
              >
                <h4 className="text-sm text-[var(--color-text-primary)] mb-1">
                  {announcement.title}
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {announcement.date}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
