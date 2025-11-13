# PAL Program Tracking System

A comprehensive web-based application for Arabian Gulf University to manage peer-assisted learning sessions, tutor registration, feedback collection, and analytics dashboards.

## Technology Stack

- **Backend:** Django 4.2.9 with SQLite database
- **Frontend:** HTMX for dynamic interactions, Alpine.js for client-side logic
- **Styling:** Tailwind CSS for modern, responsive design
- **Architecture:** Monolithic MVC pattern with Django

## Features

- **Authentication System:** Role-based access (Admin, Manager, Student, Tutor)
- **Admin Dashboard:** Comprehensive management interface with statistics and quick actions
- **User Management:** Create, edit, delete users with bulk XLSX upload functionality
- **Multi-step Registration Forms:** Conditional fields with HTMX for smooth progression
- **Session Management:** Track tutor-learner pairs, duration, and status
- **Analytics Dashboard:** 9 key metrics with interactive filtering and charts
- **Dark/Light Mode:** System preference detection with manual toggle
- **WCAG Accessibility Compliance:** Following modern design standards

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Setup Instructions

1. Clone the repository and navigate to the project directory:
```bash
cd pal-tracking-system
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- **Linux/Mac:**
  ```bash
  source venv/bin/activate
  ```
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run database migrations:
```bash
python manage.py migrate
```

6. Populate initial data:
```bash
python manage.py populate_data
```

This creates:
- Default admin user: `admin@agu.edu` / `admin123`
- Programs: Medicine (MD) and Nursing (NS)
- Academic years for each program
- Sample courses
- Configuration settings

7. Run the development server:
```bash
python manage.py runserver
```

8. Access the application at `http://localhost:8000`

## Default Credentials

- **Email:** admin@agu.edu
- **Password:** admin123

**Important:** Change the admin password after first login.

## Project Structure

```
pal-tracking-system/
├── config/                 # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── core/                   # Main application
│   ├── models.py          # Database models
│   ├── views.py           # View controllers
│   ├── urls.py            # URL routing
│   ├── admin.py           # Django admin configuration
│   └── management/
│       └── commands/
│           └── populate_data.py
├── templates/              # HTML templates
│   ├── base.html          # Base template with HTMX, Alpine.js, Tailwind
│   └── core/
│       ├── login.html
│       ├── admin_dashboard.html
│       ├── user_management.html
│       ├── analytics_dashboard.html
│       ├── settings.html
│       └── student_dashboard.html
├── static/                 # Static files (CSS, JS, images)
├── media/                  # User-uploaded files
├── db.sqlite3             # SQLite database
├── manage.py              # Django management script
└── requirements.txt       # Python dependencies
```

## Database Models

- **User:** Extended Django user with role-based access
- **Program:** Academic programs (MD, Nursing)
- **Year:** Academic years for each program (1-6 for MD, 1-4 for Nursing)
- **Course:** Courses/topics for each program and year
- **Student:** Student profile linked to User
- **TutorApplication:** Tutor registration and application data
- **Session:** Tutor-learner session records
- **Feedback:** Session feedback and ratings
- **Config:** System configuration settings

## User Roles

1. **Admin:** Full access to all features (CRUD operations, settings, analytics)
2. **Manager:** View-only access to analytics dashboard
3. **Student:** Access to student dashboard and registration
4. **Tutor:** Access to tutor dashboard and session management

## Key Features

### Bulk User Upload

Upload Excel files (.xlsx) with the following columns:
- email (required)
- first_name (required)
- last_name (required)
- role (required: Admin, Manager, Student, Tutor)
- student_id (optional)
- password (optional, defaults to "changeme123")

### Analytics Metrics

1. Total Tutors
2. Total Sessions
3. Total Hours
4. Total Courses
5. Total Programs
6. Total Learners
7. Academic Years
8. Average Rating
9. Total Feedback

### Design System

The application follows a modern minimalist design with:
- Professional blue color scheme (#0066FF light / #3399FF dark)
- Inter font family for typography
- 8-point grid system (8px → 128px spacing)
- Card-based layouts with subtle shadows
- Responsive breakpoints: Mobile (320-768px), Tablet (768-1024px), Desktop (1024px+)

## Configuration

System settings can be modified in the Settings page (Admin only):

- **maxCourseSelections:** Maximum number of courses a student can select (default: 3)
- **minGpaForTutor:** Minimum GPA required to become a tutor (default: 3.0)

## Production Deployment

### Environment Variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### Static Files

```bash
python manage.py collectstatic
```

### Database

For production, consider using PostgreSQL instead of SQLite:

```python
# config/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pal_database',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Web Server

Use Gunicorn for production:

```bash
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Security Checklist

- [ ] Change SECRET_KEY to a random string
- [ ] Set DEBUG = False
- [ ] Configure ALLOWED_HOSTS
- [ ] Use HTTPS
- [ ] Change default admin password
- [ ] Enable CSRF protection (enabled by default)
- [ ] Configure proper database backups
- [ ] Set up logging and monitoring

## Development

### Creating Superuser

```bash
python manage.py createsuperuser
```

### Running Tests

```bash
python manage.py test
```

### Django Admin

Access Django admin at `http://localhost:8000/admin/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

The application follows WCAG 2.1 Level AA guidelines:
- Proper color contrast ratios
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Reduced motion support

## License

Proprietary - Arabian Gulf University

## Support

For technical support, contact the IT department at Arabian Gulf University.

## Version

1.0.0 - November 2025
