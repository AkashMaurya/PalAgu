import React from 'react';
import { Users, Calendar, MessageSquare, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card } from '../design-system/Card';
import { Badge } from '../design-system/Badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const kpis = [
    {
      label: 'Total Users',
      value: '1,234',
      change: '+12% this month',
      icon: <Users className="w-5 h-5" />,
      color: 'text-[var(--color-primary-600)]',
    },
    {
      label: 'Active Sessions',
      value: '45',
      change: '8 scheduled today',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-[var(--color-accent-500)]',
    },
    {
      label: 'Pending Applications',
      value: '23',
      change: 'Needs review',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-[var(--color-warning-600)]',
    },
    {
      label: 'Avg. Feedback Score',
      value: '4.6',
      change: '+0.2 vs last month',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-[var(--color-success-600)]',
    },
  ];

  const applicationsData = [
    { name: 'Pending', value: 23, color: '#f59e0b' },
    { name: 'Approved', value: 156, color: '#10b981' },
    { name: 'Declined', value: 12, color: '#ef4444' },
  ];

  const sessionsData = [
    { month: 'Jun', sessions: 120 },
    { month: 'Jul', sessions: 145 },
    { month: 'Aug', sessions: 168 },
    { month: 'Sep', sessions: 190 },
    { month: 'Oct', sessions: 210 },
    { month: 'Nov', sessions: 235 },
  ];

  const feedbackData = [
    { rating: '1 Star', count: 5 },
    { rating: '2 Stars', count: 12 },
    { rating: '3 Stars', count: 45 },
    { rating: '4 Stars', count: 120 },
    { rating: '5 Stars', count: 180 },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'application',
      user: 'Emma Wilson',
      action: 'submitted a tutor application',
      time: '5 mins ago',
      status: 'pending',
    },
    {
      id: '2',
      type: 'session',
      user: 'Michael Chen',
      action: 'completed a tutoring session',
      time: '15 mins ago',
      status: 'completed',
    },
    {
      id: '3',
      type: 'feedback',
      user: 'Sarah Johnson',
      action: 'received a 5-star feedback',
      time: '1 hour ago',
      status: 'positive',
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Applications by Status */}
        <Card variant="elevated">
          <h3 className="text-[var(--color-text-primary)] mb-6">Applications by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {applicationsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Sessions Over Time */}
        <Card variant="elevated">
          <h3 className="text-[var(--color-text-primary)] mb-6">Sessions Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-text-tertiary)" />
              <YAxis stroke="var(--color-text-tertiary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="var(--color-primary-600)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Distribution */}
        <Card variant="elevated" className="lg:col-span-2">
          <h3 className="text-[var(--color-text-primary)] mb-6">Feedback Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feedbackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="rating" stroke="var(--color-text-tertiary)" />
              <YAxis stroke="var(--color-text-tertiary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="var(--color-accent-500)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card variant="elevated">
          <h3 className="text-[var(--color-text-primary)] mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-3 rounded-[var(--radius-md)] bg-[var(--color-background-secondary)]"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {activity.user}
                  </p>
                  <Badge
                    variant={
                      activity.status === 'completed'
                        ? 'success'
                        : activity.status === 'pending'
                        ? 'warning'
                        : 'info'
                    }
                    size="sm"
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                  {activity.action}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
