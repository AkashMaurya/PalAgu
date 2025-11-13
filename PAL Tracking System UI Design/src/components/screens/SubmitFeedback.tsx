import React, { useState } from 'react';
import { Input } from '../design-system/Input';
import { Select } from '../design-system/Select';
import { Textarea } from '../design-system/Textarea';
import { Button } from '../design-system/Button';
import { Card } from '../design-system/Card';
import { Radio, RadioGroup } from '../design-system/Radio';
import { Chip } from '../design-system/Chip';
import { Alert } from '../design-system/Alert';
import { CheckCircle, Star } from 'lucide-react';

interface SubmitFeedbackProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  studentProgram?: string;
  studentYear?: string;
}

export function SubmitFeedback({
  onSubmit,
  onCancel,
  studentProgram = 'Computer Science',
  studentYear = 'Year 2',
}: SubmitFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    tutor: '',
    session: '',
    topic: '',
    duration: '',
    explanationRating: '',
    usefulnessRating: '',
    organizationRating: '',
    attendAgain: null as boolean | null,
    wellOrganized: null as boolean | null,
    comments: '',
  });

  const tutors = [
    { value: 'sarah', label: 'Sarah Johnson' },
    { value: 'michael', label: 'Michael Chen' },
    { value: 'emma', label: 'Emma Davis' },
  ];

  const sessions = [
    { value: 's1', label: 'CS 101 - Nov 8, 2025' },
    { value: 's2', label: 'MATH 201 - Nov 10, 2025' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit?.();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center py-8">
        <div className="grid-container max-w-md">
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-success-100)] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[var(--color-success-600)]" />
            </div>
            <h2 className="text-[var(--color-text-primary)] mb-2">Feedback Submitted!</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Thank you for sharing your experience. Your feedback helps us improve the tutoring program.
            </p>
            <Button onClick={onSubmit}>Return to Dashboard</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8">
      <div className="grid-container max-w-3xl">
        <div className="mb-6">
          <h1 className="text-[var(--color-text-primary)] mb-2">Submit Learner Feedback</h1>
          <p className="text-[var(--color-text-secondary)]">
            Help us improve by sharing your tutoring session experience
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card variant="elevated" padding="lg" className="space-y-6">
            {/* Pre-filled Student Info */}
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-background-secondary)]">
              <h4 className="text-sm text-[var(--color-text-primary)] mb-2">Student Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[var(--color-text-tertiary)]">Program:</span>
                  <span className="ml-2 text-[var(--color-text-primary)]">{studentProgram}</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-tertiary)]">Year:</span>
                  <span className="ml-2 text-[var(--color-text-primary)]">{studentYear}</span>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div>
              <h3 className="text-[var(--color-text-primary)] mb-4">Session Details</h3>
              
              <div className="space-y-6">
                <Select
                  label="Select Tutor"
                  placeholder="Choose a tutor"
                  required
                  options={tutors}
                  value={formData.tutor}
                  onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
                  helperText="Searchable dropdown - start typing to filter"
                />

                <Select
                  label="Session"
                  placeholder="Select a session"
                  required
                  options={sessions}
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                />

                <Input
                  label="Topic Covered"
                  placeholder="e.g., Object-Oriented Programming"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />

                <Input
                  label="Duration (minutes)"
                  type="number"
                  placeholder="60"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="text-[var(--color-text-primary)] mb-4">Rate Your Experience</h3>
              
              <div className="space-y-6">
                <RadioGroup
                  label="How clear was the tutor's explanation?"
                  required
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Radio
                      key={rating}
                      name="explanation"
                      value={rating.toString()}
                      label={`${rating} ${rating === 1 ? 'Star' : 'Stars'}`}
                      checked={formData.explanationRating === rating.toString()}
                      onChange={(e) =>
                        setFormData({ ...formData, explanationRating: e.target.value })
                      }
                    />
                  ))}
                </RadioGroup>

                <RadioGroup
                  label="How useful was this session?"
                  required
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Radio
                      key={rating}
                      name="usefulness"
                      value={rating.toString()}
                      label={`${rating} ${rating === 1 ? 'Star' : 'Stars'}`}
                      checked={formData.usefulnessRating === rating.toString()}
                      onChange={(e) =>
                        setFormData({ ...formData, usefulnessRating: e.target.value })
                      }
                    />
                  ))}
                </RadioGroup>

                <RadioGroup
                  label="How organized was the session?"
                  required
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Radio
                      key={rating}
                      name="organization"
                      value={rating.toString()}
                      label={`${rating} ${rating === 1 ? 'Star' : 'Stars'}`}
                      checked={formData.organizationRating === rating.toString()}
                      onChange={(e) =>
                        setFormData({ ...formData, organizationRating: e.target.value })
                      }
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Yes/No Questions */}
            <div>
              <h4 className="text-sm text-[var(--color-text-primary)] mb-3">Quick Questions</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    Would you attend another session with this tutor?
                  </p>
                  <div className="flex gap-2">
                    <Chip
                      label="Yes"
                      selected={formData.attendAgain === true}
                      onClick={() => setFormData({ ...formData, attendAgain: true })}
                    />
                    <Chip
                      label="No"
                      selected={formData.attendAgain === false}
                      onClick={() => setFormData({ ...formData, attendAgain: false })}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    Was the session well-organized?
                  </p>
                  <div className="flex gap-2">
                    <Chip
                      label="Yes"
                      selected={formData.wellOrganized === true}
                      onClick={() => setFormData({ ...formData, wellOrganized: true })}
                    />
                    <Chip
                      label="No"
                      selected={formData.wellOrganized === false}
                      onClick={() => setFormData({ ...formData, wellOrganized: false })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <Textarea
              label="Additional Comments"
              placeholder="Share any additional feedback or suggestions..."
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              maxLength={500}
              showCount
              helperText="Optional - help us understand your experience better"
            />
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
