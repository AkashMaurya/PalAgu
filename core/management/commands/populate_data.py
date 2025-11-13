from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Program, Year, Course, Config, EvaluationYear
from datetime import date

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate initial database data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating initial data...')
        
        # Create default admin user
        if not User.objects.filter(email='admin@agu.edu').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@agu.edu',
                password='admin123',
                first_name='System',
                last_name='Administrator',
                role='Admin',
                student_id='ADMIN001'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user (email: admin@agu.edu, password: admin123)'))
        
        # Create programs
        md_program, _ = Program.objects.get_or_create(
            code='MD',
            defaults={'name': 'Medicine', 'description': 'Doctor of Medicine Program'}
        )
        
        ns_program, _ = Program.objects.get_or_create(
            code='NS',
            defaults={'name': 'Nursing', 'description': 'Bachelor of Nursing Program'}
        )
        
        self.stdout.write(self.style.SUCCESS(f'Created programs: {md_program}, {ns_program}'))
        
        # Create years for MD (1-6)
        for i in range(1, 7):
            Year.objects.get_or_create(
                program=md_program,
                year_number=i,
                defaults={'name': f'Year {i}'}
            )
        
        # Create years for Nursing (1-4)
        for i in range(1, 5):
            Year.objects.get_or_create(
                program=ns_program,
                year_number=i,
                defaults={'name': f'Year {i}'}
            )
        
        self.stdout.write(self.style.SUCCESS('Created academic years'))

        # MD Program Courses (as per PAL Action Plan v2)
        md_courses = {
            1: [
                ('BEHSCI101', 'Behavioral Sciences'),
                ('BIOCHEM101', 'Biochemistry'),
                ('BIOSTAT101', 'Biostatistics'),
                ('COMP101', 'Computer Skills'),
                ('ENG101', 'English I'),
                ('ENG102', 'English II'),
                ('GENBIO101', 'General Biology'),
                ('HUMBIO101', 'Human Biology'),
                ('ISLETH101', 'Islamic Medical Ethics'),
                ('MEDPHY101', 'Medical Physics'),
                ('MEDTERM101', 'Medical Terminology'),
                ('STUDY101', 'Study Skills'),
            ],
            2: [
                ('MANENV201', 'Man & His Environment'),
                ('RESP201', 'Respiratory'),
                ('CARDIO201', 'Cardiovascular'),
            ],
            3: [
                ('ENDO301', 'Endocrine, Metabolism & Reproductive'),
                ('GIT301', 'GIT'),
                ('HEMA301', 'Hematopoietic & Immune'),
            ],
            4: [
                ('INTEG401', 'Integumentary & Musculoskeletal'),
                ('NERV401', 'Nervous & Special Senses'),
                ('MULTI401', 'Multi-System Integration'),
            ],
            5: [
                ('OBGYN501', 'Obs. & Gyn.'),
                ('PED501', 'Pediatrics'),
                ('INTMED501', 'Internal Medicine'),
            ],
            6: [
                ('FAMMED601', 'Family Medicine'),
                ('PSYCH601', 'Psychiatry'),
                ('SURG601', 'Surgery'),
            ],
        }

        for year_num, courses in md_courses.items():
            year_obj = Year.objects.get(program=md_program, year_number=year_num)
            for code, name in courses:
                Course.objects.get_or_create(
                    program=md_program,
                    year=year_obj,
                    code=code,
                    defaults={'name': name}
                )

        self.stdout.write(self.style.SUCCESS(f'Created {sum(len(c) for c in md_courses.values())} MD courses'))

        # Nursing Program Courses (as per PAL Action Plan v2)
        ns_courses = {
            1: [
                ('ANAPHY101', 'Anatomy & Physiology I'),
                ('ANAPHY102', 'Anatomy & Physiology II'),
                ('BEHSCI101', 'Behavioral Sciences'),
                ('BIOCHEM101', 'Biochemistry'),
                ('COMP101', 'Computer Skills'),
                ('ENG101', 'English I'),
                ('ENG102', 'English II'),
                ('FUNDNURS101', 'Fundamental of Nursing Practice'),
                ('INTRONURS101', 'Intro. To Nursing Profession'),
                ('MEDTERM101', 'Medical Terminology for Nursing'),
                ('STUDY101', 'Study Skills'),
            ],
            2: [
                ('CLINNUT201', 'Clinical Nutrition'),
                ('COMMSKILL201', 'Communication Skills'),
                ('EPIDBIO201', 'Epidemiology and Biostatistics'),
                ('GROWDEV201', 'Growth and Development'),
                ('HEALTHASS201', 'Health assessment'),
                ('HEALTHTECH201', 'Healthcare Technology'),
                ('ISLETH201', 'Islamic Ethics and Human Rights'),
                ('MEDSURG201', 'Medical/ Surgical Nursing I'),
                ('MICROBIO201', 'Microbiology and Infection Control'),
                ('PATHO201', 'Pathophysiology'),
                ('PHARM201', 'Pharmacology'),
            ],
            # Years 3-4: Not Applicable or add placeholders if needed
        }

        for year_num, courses in ns_courses.items():
            year_obj = Year.objects.get(program=ns_program, year_number=year_num)
            for code, name in courses:
                Course.objects.get_or_create(
                    program=ns_program,
                    year=year_obj,
                    code=code,
                    defaults={'name': name}
                )

        self.stdout.write(self.style.SUCCESS(f'Created {sum(len(c) for c in ns_courses.values())} Nursing courses'))

        # Create Evaluation Years
        eval_year_2025, created = EvaluationYear.objects.get_or_create(
            year='2025-26',
            defaults={
                'start_date': date(2025, 9, 1),
                'end_date': date(2026, 6, 30),
                'is_active': True
            }
        )
        if created:
            eval_year_2025.programs.add(md_program, ns_program)
            self.stdout.write(self.style.SUCCESS('Created Evaluation Year 2025-26 (Active)'))

        eval_year_2024, created = EvaluationYear.objects.get_or_create(
            year='2024-25',
            defaults={
                'start_date': date(2024, 9, 1),
                'end_date': date(2025, 6, 30),
                'is_active': False
            }
        )
        if created:
            eval_year_2024.programs.add(md_program, ns_program)
            self.stdout.write(self.style.SUCCESS('Created Evaluation Year 2024-25'))

        # Create config settings
        Config.objects.get_or_create(
            key='maxCourseSelections',
            defaults={'value': '3', 'description': 'Maximum number of courses a student can select'}
        )

        Config.objects.get_or_create(
            key='minGpaForTutor',
            defaults={'value': '3.0', 'description': 'Minimum GPA required to become a tutor'}
        )
        
        self.stdout.write(self.style.SUCCESS('Created configuration settings'))
        self.stdout.write(self.style.SUCCESS('Initial data creation complete!'))
