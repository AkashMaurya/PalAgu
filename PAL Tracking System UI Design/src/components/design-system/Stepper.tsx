import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = '' }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCompleted
                        ? 'bg-[var(--color-primary-600)] text-white'
                        : isCurrent
                        ? 'bg-[var(--color-primary-600)] text-white ring-4 ring-[var(--color-primary-100)]'
                        : 'bg-[var(--color-background-secondary)] border-2 border-[var(--color-border)] text-[var(--color-text-tertiary)]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm">{stepNumber}</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm ${
                      isCurrent
                        ? 'text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)] max-w-[120px]">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 max-w-[100px] mb-8">
                  <div
                    className={`h-0.5 transition-all duration-200 ${
                      stepNumber < currentStep
                        ? 'bg-[var(--color-primary-600)]'
                        : 'bg-[var(--color-border)]'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
