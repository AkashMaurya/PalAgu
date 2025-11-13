from django.core.management.base import BaseCommand
from core.models import Program, Year, Course


class Command(BaseCommand):
    help = 'Add courses for all years based on exact AGU curriculum'

    def handle(self, *args, **kwargs):
        self.stdout.write('Adding courses for all years...')

        # Get programs
        try:
            md_program = Program.objects.get(code='MD')
            ns_program = Program.objects.get(code='NS')
        except Program.DoesNotExist:
            self.stdout.write(self.style.ERROR('Programs not found. Run populate_data first.'))
            return

        # MD Program Courses (Exact from AGU curriculum)
        md_courses = {
            1: [
                ('BEHAV101', 'Behavioral Sciences'),
                ('COMP101', 'Computer Skills'),
                ('ENG101', 'English I'),
                ('ENG102', 'English II'),
                ('BIO101', 'General Biology'),
                ('HBIO101', 'Human Biology'),
                ('ETHICS101', 'Islamic Medical Ethics'),
                ('PHYS101', 'Medical Physics'),
                ('TERM101', 'Medical Terminology'),
                ('STUDY101', 'Study Skills'),
            ],
            2: [
                ('ENV201', 'Man & His Environment'),
                ('RESP201', 'Respiratory'),
                ('CARD201', 'Cardiovascular'),
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
                ('OBGYN501', 'Obs & Gyn.'),
                ('INTMED501', 'Internal Medicine'),
                ('PEDS501', 'Pediatrics'),
            ],
            6: [
                ('FAMM601', 'Family Medicine'),
                ('PSYCH601', 'Psychiatry'),
                ('SURG601', 'Surgery'),
            ],
        }

        # Nursing Program Courses (Exact from AGU curriculum)
        ns_courses = {
            1: [
                ('ANAT101', 'Anatomy & Physiology I'),
                ('BEHAV101', 'Behavioral Sciences'),
                ('BIOCHEM101', 'Biochemistry'),
                ('COMP101', 'Computer Skills'),
                ('ENG101', 'English I'),
                ('ENG102', 'English II'),
                ('NFUND101', 'Fundamentals of Nursing Practice'),
                ('NINTRO101', 'Introduction to Nursing Profession'),
                ('NTERM101', 'Medical Terminology for Nursing'),
                ('NSTUDY101', 'Study Skills for Nursing'),
            ],
            2: [
                ('NUTR201', 'Clinical Nutrition'),
                ('COMM201', 'Communication Skills'),
                ('EPID201', 'Epidemiology and Biostatistics'),
                ('GROW201', 'Growth and Development'),
                ('HASS201', 'Health Assessment'),
                ('HTECH201', 'Health Technology'),
                ('ETHICS201', 'Islamic Ethics and Human Rights'),
                ('MEDSURG201', 'Medical-Surgical Nursing I'),
                ('MICRO201', 'Microbiology and Infection Control'),
                ('PHARM201', 'Pharmacology'),
            ],
        }

        # Clear existing courses first (optional - remove if you want to keep old courses)
        Course.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared all existing courses'))

        # Add MD courses
        for year_num, courses in md_courses.items():
            try:
                year = Year.objects.get(program=md_program, year_number=year_num)
                for code, name in courses:
                    course, created = Course.objects.get_or_create(
                        program=md_program,
                        year=year,
                        code=code,
                        defaults={'name': name}
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'✓ Created: {course}'))
                    else:
                        self.stdout.write(f'  Already exists: {course}')
            except Year.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'⚠ Year {year_num} not found for MD program'))

        # Add Nursing courses
        for year_num, courses in ns_courses.items():
            try:
                year = Year.objects.get(program=ns_program, year_number=year_num)
                for code, name in courses:
                    course, created = Course.objects.get_or_create(
                        program=ns_program,
                        year=year,
                        code=code,
                        defaults={'name': name}
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'✓ Created: {course}'))
                    else:
                        self.stdout.write(f'  Already exists: {course}')
            except Year.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'⚠ Year {year_num} not found for Nursing program'))

        # Summary
        total_courses = Course.objects.count()
        md_count = Course.objects.filter(program=md_program).count()
        ns_count = Course.objects.filter(program=ns_program).count()

        self.stdout.write(self.style.SUCCESS(f'\n✅ Finished adding courses!'))
        self.stdout.write(self.style.SUCCESS(f'   Total: {total_courses} courses'))
        self.stdout.write(self.style.SUCCESS(f'   MD: {md_count} courses'))
        self.stdout.write(self.style.SUCCESS(f'   Nursing: {ns_count} courses'))

