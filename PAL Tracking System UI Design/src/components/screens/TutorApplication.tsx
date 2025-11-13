import React, { useState } from 'react';
import { Stepper } from '../design-system/Stepper';
import { Input } from '../design-system/Input';
import { Select } from '../design-system/Select';
import { Textarea } from '../design-system/Textarea';
import { Button } from '../design-system/Button';
import { Card } from '../design-system/Card';
import { Radio, RadioGroup } from '../design-system/Radio';
import { Checkbox } from '../design-system/Checkbox';
import { Chip } from '../design-system/Chip';
import { Alert } from '../design-system/Alert';
import { Badge } from '../design-system/Badge';
import { CheckCircle, Info } from 'lucide-react';

interface TutorApplicationProps {
  onComplete?: () => void;
  onCancel?: () => void;
  existingProgram?: string;
}

export function TutorApplication({
  onComplete,
  onCancel,
  existingProgram,
}: TutorApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [notInterested, setNotInterested] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    interested: true,
    // Step 2
    program: existingProgram || '',
    year: '',
    gpa: '',
    motivation: '',
    confidence: '',
    availability: [] as string[],
    mode: '',
    consent: false,
    // Step 3
    selectedCourses: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { label: 'Interest', description: 'Confirm interest' },
    { label: 'Academic Details', description: 'Your background' },
    { label: 'Course Selection', description: 'Courses to tutor' },
  ];

  const programs = [
    { value: 'cs', label: 'Computer Science' },
    { value: 'eng', label: 'Engineering' },
    { value: 'math', label: 'Mathematics' },
    { value: 'business', label: 'Business Administration' },
  ];

  const years = [
    { value: '1', label: 'Year 1' },
    { value: '2', label: 'Year 2' },
    { value: '3', label: 'Year 3' },
    { value: '4', label: 'Year 4' },
  ];

  const availabilityOptions = [
    'Monday Morning',
    'Monday Afternoon',
    'Tuesday Morning',
    'Tuesday Afternoon',
    'Wednesday Morning',
    'Wednesday Afternoon',
    'Thursday Morning',
    'Thursday Afternoon',
    'Friday Morning',
    'Friday Afternoon',
  ];

  const modeOptions = [
    { value: 'online', label: 'Online Only' },
    { value: 'in-person', label: 'In-Person Only' },
    { value: 'both', label: 'Both Online and In-Person' },
  ];

  const courses = [
    { id: 'cs101', name: 'CS 101 - Intro to Programming' },
    { id: 'cs201', name: 'CS 201 - Data Structures' },
    { id: 'cs301', name: 'CS 301 - Algorithms' },
    { id: 'math101', name: 'MATH 101 - Calculus I' },
    { id: 'math201', name: 'MATH 201 - Calculus II' },
    { id: 'eng105', name: 'ENG 105 - Academic Writing' },
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.program) newErrors.program = 'Program is required';
      if (!formData.year) newErrors.year = 'Year is required';
      if (!formData.motivation.trim()) newErrors.motivation = 'Please share your motivation';
      if (!formData.confidence) newErrors.confidence = 'Please rate your confidence';
      if (formData.availability.length === 0) {
        newErrors.availability = 'Please select at least one time slot';
      }
      if (!formData.mode) newErrors.mode = 'Please select a tutoring mode';
      if (!formData.consent) newErrors.consent = 'You must agree to the terms';
    }

    if (step === 3) {
      if (formData.selectedCourses.length !== 3) {
        newErrors.courses = 'Please select exactly 3 courses';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.interested) {
      setNotInterested(true);
      return;
    }

    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const toggleAvailability = (slot: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter((s) => s !== slot)
        : [...prev.availability, slot],
    }));
  };

  const toggleCourse = (courseId: string) => {
    setFormData((prev) => {
      const selected = prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter((id) => id !== courseId)
        : [...prev.selectedCourses, courseId];
      
      // Limit to 3 courses
      if (selected.length > 3) {
        return prev;
      }
      
      return { ...prev, selectedCourses: selected };
    });
  };

  if (notInterested) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center py-8">
        <div className="grid-container max-w-md">
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-info-100)] flex items-center justify-center">
              <Info className="w-8 h-8 text-[var(--color-info-600)]" />
            </div>
            <h2 className="text-[var(--color-text-primary)] mb-2">Thank You for Your Interest</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We appreciate you considering the tutor program. Feel free to apply in the future when you're ready.
            </p>
            <Button onClick={onCancel}>Return to Dashboard</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-8">
        <div className="grid-container max-w-3xl">
          <Card variant="elevated" padding="lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-success-100)] flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[var(--color-success-600)]" />
              </div>
              <h2 className="text-[var(--color-text-primary)] mb-2">Application Submitted!</h2>
              <Badge variant="warning" size="md">Pending Review</Badge>
            </div>

            {/* Application Summary */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[var(--color-text-primary)] mb-4">Application Summary</h3>
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-background-secondary)] space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Program</p>
                      <p className="text-sm text-[var(--color-text-primary)]">
                        {programs.find((p) => p.value === formData.program)?.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Year</p>
                      <p className="text-sm text-[var(--color-text-primary)]">
                        {years.find((y) => y.value === formData.year)?.label}
                      </p>
                    </div>
                    {formData.gpa && (
                      <div>
                        <p className="text-xs text-[var(--color-text-tertiary)] mb-1">GPA</p>
                        <p className="text-sm text-[var(--color-text-primary)]">{formData.gpa}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Confidence</p>
                      <p className="text-sm text-[var(--color-text-primary)]">
                        {formData.confidence}/5
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Selected Courses</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedCourses.map((courseId) => (
                        <Badge key={courseId} variant="primary">
                          {courses.find((c) => c.id === courseId)?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Availability</p>
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {formData.availability.length} time slots selected
                    </p>
                  </div>
                </div>
              </div>

              <Alert variant="info">
                Your application is under review. We'll notify you via email within 5-7 business days about the next steps.
              </Alert>

              <Button onClick={onComplete} className="w-full">
                Return to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8">
      <div className="grid-container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-[var(--color-text-primary)] mb-2">Tutor Application</h1>
          <p className="text-[var(--color-text-secondary)]">
            Join our team of peer tutors and help fellow students succeed
          </p>
        </div>

        <Stepper steps={steps} currentStep={currentStep} className="mb-8" />

        <Card variant="elevated" padding="lg">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-[var(--color-text-primary)]">Are you interested in becoming a tutor?</h3>
              
              <Alert variant="info">
                As a peer tutor, you'll support fellow students in their learning journey while developing valuable teaching and leadership skills.
              </Alert>

              <div className="space-y-6">
                <Input
                  label="First Name"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john.doe@university.edu"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <RadioGroup label="Confirm your interest" required>
                  <Radio
                    name="interest"
                    value="yes"
                    label="Yes, I'm interested in becoming a tutor"
                    checked={formData.interested}
                    onChange={() => setFormData({ ...formData, interested: true })}
                  />
                  <Radio
                    name="interest"
                    value="no"
                    label="No, I'm not interested at this time"
                    checked={!formData.interested}
                    onChange={() => setFormData({ ...formData, interested: false })}
                  />
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-[var(--color-text-primary)] mb-4">Academic Details</h3>

              <Select
                label="Program"
                placeholder="Select your program"
                required
                options={programs}
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                error={errors.program}
                helperText={existingProgram ? 'Locked to your student profile' : 'Your current academic program'}
                disabled={!!existingProgram}
              />

              <Select
                label="Year"
                placeholder="Select your year"
                required
                options={years}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                error={errors.year}
                helperText="Select your current year of study"
              />

              <Input
                label="GPA (Optional)"
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                placeholder="3.75"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                helperText="Your current cumulative GPA (0.0 - 4.0)"
              />

              <Textarea
                label="Why do you want to become a tutor?"
                placeholder="Share your motivation and what you hope to achieve as a peer tutor..."
                required
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                error={errors.motivation}
                maxLength={500}
                showCount
              />

              <RadioGroup
                label="How confident are you in your tutoring abilities?"
                required
                error={errors.confidence}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Radio
                    key={rating}
                    name="confidence"
                    value={rating.toString()}
                    label={`${rating} - ${
                      rating === 1
                        ? 'Not confident'
                        : rating === 2
                        ? 'Slightly confident'
                        : rating === 3
                        ? 'Moderately confident'
                        : rating === 4
                        ? 'Very confident'
                        : 'Extremely confident'
                    }`}
                    checked={formData.confidence === rating.toString()}
                    onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                  />
                ))}
              </RadioGroup>

              <div>
                <label className="block mb-3 text-sm text-[var(--color-text-primary)]">
                  Availability <span className="text-[var(--color-error-500)]">*</span>
                </label>
                <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                  Select all time slots when you're available to tutor
                </p>
                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map((slot) => (
                    <Chip
                      key={slot}
                      label={slot}
                      selected={formData.availability.includes(slot)}
                      onClick={() => toggleAvailability(slot)}
                    />
                  ))}
                </div>
                {errors.availability && (
                  <p className="mt-2 text-xs text-[var(--color-error-500)]">{errors.availability}</p>
                )}
              </div>

              <Select
                label="Preferred Tutoring Mode"
                placeholder="Select mode"
                required
                options={modeOptions}
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                error={errors.mode}
              />

              <Checkbox
                label="I agree to the tutor program terms and conditions"
                description="I commit to maintaining academic integrity and providing quality support to fellow students."
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                error={errors.consent}
                required
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text-primary)]">Course Selection</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Select exactly 3 courses you're qualified to tutor
                  </p>
                </div>
                <Badge
                  variant={formData.selectedCourses.length === 3 ? 'success' : 'neutral'}
                  size="md"
                >
                  {formData.selectedCourses.length}/3 selected
                </Badge>
              </div>

              {errors.courses && (
                <Alert variant="error">{errors.courses}</Alert>
              )}

              <Alert variant="info">
                Choose courses you've successfully completed and feel confident teaching.
              </Alert>

              <div className="space-y-3">
                {courses.map((course) => {
                  const isSelected = formData.selectedCourses.includes(course.id);
                  const isDisabled = !isSelected && formData.selectedCourses.length >= 3;
                  
                  return (
                    <Checkbox
                      key={course.id}
                      label={course.name}
                      checked={isSelected}
                      onChange={() => toggleCourse(course.id)}
                      disabled={isDisabled}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={currentStep === 1 ? onCancel : handleBack}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length ? 'Submit Application' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
