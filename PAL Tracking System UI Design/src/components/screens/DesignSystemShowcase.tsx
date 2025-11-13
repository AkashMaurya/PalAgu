import React, { useState } from 'react';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';
import { Select } from '../design-system/Select';
import { Textarea } from '../design-system/Textarea';
import { Checkbox } from '../design-system/Checkbox';
import { Radio, RadioGroup } from '../design-system/Radio';
import { Card } from '../design-system/Card';
import { Badge } from '../design-system/Badge';
import { Chip } from '../design-system/Chip';
import { Alert } from '../design-system/Alert';
import { Modal } from '../design-system/Modal';
import { Stepper } from '../design-system/Stepper';
import { Tabs } from '../design-system/Tabs';
import { Table, Column } from '../design-system/Table';
import { Pagination } from '../design-system/Pagination';
import { useToast } from '../design-system/Toast';
import { Search, Plus, Download, Trash2, Edit, Heart } from 'lucide-react';

export function DesignSystemShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  const sampleData = [
    { id: '1', name: 'John Doe', role: 'Student', status: 'Active' },
    { id: '2', name: 'Jane Smith', role: 'Tutor', status: 'Active' },
    { id: '3', name: 'Bob Johnson', role: 'Admin', status: 'Inactive' },
  ];

  const tableColumns: Column<typeof sampleData[0]>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8">
      <div className="grid-container max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-[var(--color-text-primary)] mb-4">
            PAL Design System
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            A comprehensive design system built for the Peer-Assisted Learning Tracking System.
            Features accessible components, light/dark themes, and responsive layouts.
          </p>
        </div>

        {/* Color Palette */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Color Palette</h2>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">Primary (Indigo)</h4>
              <div className="grid grid-cols-5 gap-3">
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].slice(0, 5).map((shade) => (
                  <div key={shade} className="text-center">
                    <div
                      className="h-16 rounded-[var(--radius-md)] mb-2"
                      style={{ backgroundColor: `var(--color-primary-${shade})` }}
                    />
                    <p className="text-xs text-[var(--color-text-tertiary)]">{shade}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">Accent (Emerald)</h4>
              <div className="grid grid-cols-5 gap-3">
                {[100, 200, 300, 400, 500].map((shade) => (
                  <div key={shade} className="text-center">
                    <div
                      className="h-16 rounded-[var(--radius-md)] mb-2"
                      style={{ backgroundColor: `var(--color-accent-${shade})` }}
                    />
                    <p className="text-xs text-[var(--color-text-tertiary)]">{shade}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">Secondary (Violet)</h4>
              <div className="grid grid-cols-5 gap-3">
                {[100, 200, 300, 400, 500].map((shade) => (
                  <div key={shade} className="text-center">
                    <div
                      className="h-16 rounded-[var(--radius-md)] mb-2"
                      style={{ backgroundColor: `var(--color-secondary-${shade})` }}
                    />
                    <p className="text-xs text-[var(--color-text-tertiary)]">{shade}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Typography */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-[var(--color-text-primary)]">Heading 1</h1>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                2.25rem / 36px - Page titles
              </p>
            </div>
            <div>
              <h2 className="text-[var(--color-text-primary)]">Heading 2</h2>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                1.875rem / 30px - Section headers
              </p>
            </div>
            <div>
              <h3 className="text-[var(--color-text-primary)]">Heading 3</h3>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                1.5rem / 24px - Card headers
              </p>
            </div>
            <div>
              <p className="text-[var(--color-text-primary)]">
                Body text - Regular paragraph content using Inter font family
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                1rem / 16px - Body copy
              </p>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Buttons</h2>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">Variants</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">Sizes</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">With Icons</h4>
              <div className="flex flex-wrap gap-3">
                <Button icon={<Plus className="w-4 h-4" />}>Add Item</Button>
                <Button icon={<Download className="w-4 h-4" />} iconPosition="right">
                  Download
                </Button>
                <Button variant="outline" icon={<Search className="w-4 h-4" />}>
                  Search
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">States</h4>
              <div className="flex flex-wrap gap-3">
                <Button loading>Loading...</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Form Inputs */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Form Inputs</h2>
          
          <div className="space-y-6 max-w-2xl">
            <Input
              label="Text Input"
              placeholder="Enter text here..."
              helperText="This is a helper text"
            />
            
            <Input
              label="With Icon"
              placeholder="Search..."
              icon={<Search className="w-4 h-4" />}
            />
            
            <Input
              label="Error State"
              placeholder="Invalid input"
              error="This field is required"
            />
            
            <Input
              label="Success State"
              placeholder="Valid input"
              success="Looks good!"
            />
            
            <Select
              label="Select Dropdown"
              placeholder="Choose an option"
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ]}
            />
            
            <Textarea
              label="Textarea"
              placeholder="Enter multiple lines of text..."
              maxLength={200}
              showCount
            />
          </div>
        </Card>

        {/* Checkboxes & Radios */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Selection Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-4">Checkboxes</h4>
              <div className="space-y-3">
                <Checkbox label="Default checkbox" />
                <Checkbox
                  label="With description"
                  description="This checkbox has additional descriptive text"
                />
                <Checkbox label="Checked by default" defaultChecked />
                <Checkbox label="Disabled" disabled />
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-4">Radio Buttons</h4>
              <RadioGroup label="Choose an option">
                <Radio name="demo" value="option1" label="Option 1" />
                <Radio name="demo" value="option2" label="Option 2" />
                <Radio
                  name="demo"
                  value="option3"
                  label="Option 3"
                  description="With description text"
                />
              </RadioGroup>
            </div>
          </div>
        </Card>

        {/* Badges & Chips */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Badges & Chips</h2>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">Badges</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[var(--color-text-secondary)] mb-3">Chips</h4>
              <div className="flex flex-wrap gap-2">
                <Chip label="Default" />
                <Chip label="Selected" selected />
                <Chip label="With Icon" icon={<Heart className="w-4 h-4" />} />
                <Chip
                  label="Removable"
                  onRemove={() => console.log('removed')}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Alerts</h2>
          
          <div className="space-y-4 max-w-3xl">
            <Alert variant="info" title="Information">
              This is an informational message to keep users informed.
            </Alert>
            <Alert variant="success" title="Success">
              Your action was completed successfully!
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review this important information before proceeding.
            </Alert>
            <Alert variant="error" title="Error" onClose={() => {}}>
              An error occurred. Please try again.
            </Alert>
          </div>
        </Card>

        {/* Stepper */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Stepper</h2>
          <Stepper
            steps={[
              { label: 'Step 1', description: 'First step' },
              { label: 'Step 2', description: 'Second step' },
              { label: 'Step 3', description: 'Final step' },
            ]}
            currentStep={2}
          />
        </Card>

        {/* Tabs */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Tabs</h2>
          <Tabs
            tabs={[
              {
                id: 'tab1',
                label: 'Overview',
                content: (
                  <div className="p-4 bg-[var(--color-background-secondary)] rounded-[var(--radius-md)]">
                    <p className="text-[var(--color-text-primary)]">Overview content goes here</p>
                  </div>
                ),
              },
              {
                id: 'tab2',
                label: 'Details',
                content: (
                  <div className="p-4 bg-[var(--color-background-secondary)] rounded-[var(--radius-md)]">
                    <p className="text-[var(--color-text-primary)]">Details content goes here</p>
                  </div>
                ),
              },
              {
                id: 'tab3',
                label: 'Settings',
                content: (
                  <div className="p-4 bg-[var(--color-background-secondary)] rounded-[var(--radius-md)]">
                    <p className="text-[var(--color-text-primary)]">Settings content goes here</p>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        {/* Table */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Table</h2>
          <Table columns={tableColumns} data={sampleData} />
        </Card>

        {/* Pagination */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Pagination</h2>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </Card>

        {/* Modal & Toast */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Modal & Toast</h2>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button
              variant="success"
              onClick={() =>
                showToast({
                  title: 'Success!',
                  description: 'Your action was completed successfully',
                  variant: 'success',
                })
              }
            >
              Success Toast
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                showToast({
                  title: 'Error!',
                  description: 'Something went wrong',
                  variant: 'error',
                })
              }
            >
              Error Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                showToast({
                  title: 'Information',
                  description: 'Here is some important information',
                  variant: 'info',
                })
              }
            >
              Info Toast
            </Button>
          </div>

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Modal Title"
            description="This is a modal dialog"
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Confirm</Button>
              </>
            }
          >
            <p className="text-[var(--color-text-primary)]">
              Modal content goes here. You can add any content you want inside the modal.
            </p>
          </Modal>
        </Card>

        {/* Grid System */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-[var(--color-text-primary)] mb-6">Responsive Grid System</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            12-column desktop (1440px), 8-column tablet, 4-column mobile with 8pt spacing
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-text-primary)]"
              >
                Column {i}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
