import React, { useState } from 'react';
import { Stepper } from '../design-system/Stepper';
import { Input } from '../design-system/Input';
import { Select } from '../design-system/Select';
import { Button } from '../design-system/Button';
import { Card } from '../design-system/Card';
import { Alert } from '../design-system/Alert';
import { Checkbox } from '../design-system/Checkbox';
import { CheckCircle } from 'lucide-react';

interface StudentRegistrationProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function StudentRegistration({ onComplete, onCancel }: StudentRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    mobile: '',
    // Step 2
    program: '',
    year: '',
    // Step 3
    selectedCourses: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { label: 'Personal Info', description: 'Basic details' },
    { label: 'Academic Info', description: 'Program & year' },
    { label: 'Course Selection', description: 'Choose courses' },
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

  const availableCourses = [
    { id: 'cs101', name: 'CS 101 - Intro to Programming', program: 'cs' },
    { id: 'cs201', name: 'CS 201 - Data Structures', program: 'cs' },
    { id: 'math101', name: 'MATH 101 - Calculus I', program: 'math' },
    { id: 'math201', name: 'MATH 201 - Calculus II', program: 'math' },
    { id: 'eng105', name: 'ENG 105 - Academic Writing', program: 'eng' },
    { id: 'phys101', name: 'PHYS 101 - Physics I', program: 'eng' },
  ];

  const filteredCourses = formData.program
    ? availableCourses.filter((c) => c.program === formData.program || c.id.startsWith('eng'))
    : availableCourses;

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.studentId) newErrors.studentId = 'Student ID is required';
      if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    }

    if (step === 2) {
      if (!formData.program) newErrors.program = 'Please select a program';
      if (!formData.year) newErrors.year = 'Please select a year';
    }

    if (step === 3) {
      if (formData.selectedCourses.length === 0) {
        newErrors.courses = 'Please select at least one course';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete?.();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const toggleCourse = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter((id) => id !== courseId)
        : [...prev.selectedCourses, courseId],
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8">
      <div className="grid-container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-[var(--color-text-primary)] mb-2">Student Registration</h1>
          <p className="text-[var(--color-text-secondary)]">
            Complete the steps below to register for the PAL program
          </p>
        </div>

        <Stepper steps={steps} currentStep={currentStep} className="mb-8" />

        <Card variant="elevated" padding="lg">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-[var(--color-text-primary)] mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  error={errors.lastName}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="john.doe@university.edu"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                helperText="Use your university email address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Student ID"
                  placeholder="STU123456"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  error={errors.studentId}
                />
                <Input
                  label="Mobile Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  error={errors.mobile}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-[var(--color-text-primary)] mb-6">Academic Information</h3>
              
              <Alert variant="info">
                Select your current program and year. This helps us match you with relevant courses and tutors.
              </Alert>

              <Select
                label="Program"
                placeholder="Select your program"
                required
                options={programs}
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                error={errors.program}
                helperText="Your current academic program"
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
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text-primary)]">Course Selection</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Select courses you'd like to receive tutoring for
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                  {formData.selectedCourses.length} selected
                </div>
              </div>

              {errors.courses && (
                <Alert variant="error">{errors.courses}</Alert>
              )}

              <div className="space-y-3">
                {filteredCourses.map((course) => (
                  <Checkbox
                    key={course.id}
                    label={course.name}
                    checked={formData.selectedCourses.includes(course.id)}
                    onChange={() => toggleCourse(course.id)}
                  />
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="py-8 text-center text-[var(--color-text-secondary)]">
                  No courses available. Please select a program first.
                </div>
              )}
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
            {currentStep === steps.length ? 'Complete Registration' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
