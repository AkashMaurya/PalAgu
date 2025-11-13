"""
Management command to create test approved tutors for testing the learner feedback form
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from core.models import User, Program, Year, TutorApplication, Course


class Command(BaseCommand):
    help = 'Create test approved tutors for testing'

    def handle(self, *args, **options):
        with transaction.atomic():
            # Get programs and years
            try:
                md_program = Program.objects.get(code='MD')
                ns_program = Program.objects.get(code='NS')
            except Program.DoesNotExist:
                self.stdout.write(self.style.ERROR('Programs not found. Please run populate_data first.'))
                return

            # Get years
            md_year_3 = Year.objects.filter(program=md_program, year_number=3).first()
            md_year_4 = Year.objects.filter(program=md_program, year_number=4).first()
            md_year_5 = Year.objects.filter(program=md_program, year_number=5).first()
            ns_year_3 = Year.objects.filter(program=ns_program, year_number=3).first()
            ns_year_4 = Year.objects.filter(program=ns_program, year_number=4).first()

            if not all([md_year_3, md_year_4, md_year_5, ns_year_3, ns_year_4]):
                self.stdout.write(self.style.ERROR('Years not found. Please run populate_data first.'))
                return

            # Create test tutors
            tutors_data = [
                {
                    'email': 'tutor1@agu.edu',
                    'first_name': 'Ahmed',
                    'last_name': 'Hassan',
                    'student_id': 'T001',
                    'program': md_program,
                    'year': md_year_5,
                    'gpa': 3.8
                },
                {
                    'email': 'tutor2@agu.edu',
                    'first_name': 'Fatima',
                    'last_name': 'Ali',
                    'student_id': 'T002',
                    'program': md_program,
                    'year': md_year_4,
                    'gpa': 3.9
                },
                {
                    'email': 'tutor3@agu.edu',
                    'first_name': 'Mohammed',
                    'last_name': 'Khalid',
                    'student_id': 'T003',
                    'program': md_program,
                    'year': md_year_3,
                    'gpa': 3.7
                },
                {
                    'email': 'tutor4@agu.edu',
                    'first_name': 'Sara',
                    'last_name': 'Ibrahim',
                    'student_id': 'T004',
                    'program': ns_program,
                    'year': ns_year_4,
                    'gpa': 3.85
                },
                {
                    'email': 'tutor5@agu.edu',
                    'first_name': 'Omar',
                    'last_name': 'Abdullah',
                    'student_id': 'T005',
                    'program': ns_program,
                    'year': ns_year_3,
                    'gpa': 3.75
                },
            ]

            created_count = 0
            for tutor_data in tutors_data:
                # Check if user already exists
                if User.objects.filter(email=tutor_data['email']).exists():
                    self.stdout.write(self.style.WARNING(f"User {tutor_data['email']} already exists, skipping..."))
                    continue

                # Create user
                user = User.objects.create_user(
                    username=tutor_data['email'].split('@')[0],  # Use email prefix as username
                    email=tutor_data['email'],
                    password='password123',
                    first_name=tutor_data['first_name'],
                    last_name=tutor_data['last_name'],
                    student_id=tutor_data['student_id'],
                    role='Student'
                )

                # Get 3 courses for this tutor
                courses = Course.objects.filter(
                    program=tutor_data['program'],
                    year__year_number__lte=tutor_data['year'].year_number
                ).order_by('?')[:3]

                # Create tutor application
                app = TutorApplication.objects.create(
                    user=user,
                    mobile='12345678',
                    engaged_in_pal='tutor',
                    wants_training=True,
                    wants_certificate=True,
                    suggestions='Looking forward to helping peers!',
                    interested_as_tutor=True,
                    program=tutor_data['program'],
                    year=tutor_data['year'],
                    gpa=tutor_data['gpa'],
                    motivation='I want to help my peers succeed',
                    confidence_rating=4,
                    consent=True,
                    status='Approved'  # Approve immediately
                )

                # Add courses
                app.courses.set(courses)

                created_count += 1
                self.stdout.write(self.style.SUCCESS(
                    f"✓ Created approved tutor: {user.get_full_name()} ({tutor_data['program'].code}, Year {tutor_data['year'].year_number})"
                ))

            self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully created {created_count} approved tutors!'))
            self.stdout.write(self.style.SUCCESS('You can now test the learner feedback form at /feedback/submit/'))

