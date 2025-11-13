import React, { useState } from 'react';
import { Input } from '../design-system/Input';
import { Button } from '../design-system/Button';
import { Card } from '../design-system/Card';
import { Checkbox } from '../design-system/Checkbox';
import { Alert } from '../design-system/Alert';
import { GraduationCap } from 'lucide-react';

interface LoginProps {
  onLogin?: (role: 'student' | 'tutor' | 'admin') => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate login
    setTimeout(() => {
      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      // Demo login - different roles based on email
      if (email.includes('admin')) {
        onLogin?.('admin');
      } else if (email.includes('tutor')) {
        onLogin?.('tutor');
      } else {
        onLogin?.('student');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)] dark:from-[var(--color-neutral-900)] dark:to-[var(--color-neutral-800)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-500)] text-white mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-[var(--color-text-primary)] mb-2">PAL Tracking System</h1>
          <p className="text-[var(--color-text-secondary)]">
            Peer-Assisted Learning Platform
          </p>
        </div>

        {/* Login Card */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-[var(--color-text-primary)] mb-6">Sign In</h2>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <a
                href="#"
                className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Don't have an account?{' '}
              <a
                href="#"
                className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors"
              >
                Register here
              </a>
            </p>
          </div>
        </Card>

        {/* Demo Instructions */}
        <Card variant="bordered" padding="md" className="mt-6">
          <p className="text-xs text-[var(--color-text-secondary)] text-center mb-3">
            Demo Accounts - Use any password
          </p>
          <div className="space-y-2 text-xs text-[var(--color-text-tertiary)]">
            <p>• student@university.edu - Student view</p>
            <p>• tutor@university.edu - Tutor view</p>
            <p>• admin@university.edu - Admin view</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
