from django.core.management.base import BaseCommand
from core.models import User


class Command(BaseCommand):
    help = 'Create a test student user'

    def handle(self, *args, **kwargs):
        # Check if student already exists
        if User.objects.filter(email='student@agu.edu').exists():
            self.stdout.write(self.style.WARNING('Test student already exists'))
            return
        
        # Create test student
        user = User.objects.create_user(
            username='student',
            email='student@agu.edu',
            password='student123',
            first_name='Test',
            last_name='Student',
            role='Student',
            student_id='S12345'
        )
        
        self.stdout.write(self.style.SUCCESS(f'✅ Created test student: {user.email}'))
        self.stdout.write(self.style.SUCCESS(f'   Email: student@agu.edu'))
        self.stdout.write(self.style.SUCCESS(f'   Password: student123'))

