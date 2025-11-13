from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import RegexValidator
from .models import User, Student, TutorApplication, Program, Year, Course, Session, Feedback, EvaluationYear


class AdminUserCreationForm(forms.ModelForm):
    """Form for admin to manually create users"""
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
            'placeholder': 'Enter password'
        }),
        label="Password",
        help_text="Minimum 8 characters"
    )
    password_confirm = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
            'placeholder': 'Confirm password'
        }),
        label="Confirm Password"
    )

    # Student-specific fields (shown only when role=Student)
    program = forms.ModelChoiceField(
        queryset=Program.objects.all(),
        required=False,
        widget=forms.Select(attrs={
            'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
            'hx-get': '/get-years/',
            'hx-target': '#id_year',
            'hx-trigger': 'change'
        }),
        label="Program",
        help_text="Required for Student role"
    )

    year = forms.ModelChoiceField(
        queryset=Year.objects.none(),
        required=False,
        widget=forms.Select(attrs={
            'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
            'id': 'id_year'
        }),
        label="Year",
        help_text="Required for Student role"
    )

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role', 'student_id']
        widgets = {
            'email': forms.EmailInput(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'placeholder': 'user@agu.edu'
            }),
            'first_name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'placeholder': 'First name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'placeholder': 'Last name'
            }),
            'role': forms.Select(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'id': 'id_role',
                'x-on:change': 'roleChanged($event.target.value)'
            }),
            'student_id': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'placeholder': 'Student ID (optional for Admin/Manager)'
            }),
        }

    def __init__(self, *args, **kwargs):
        program_id = kwargs.pop('program_id', None)
        super().__init__(*args, **kwargs)

        # If program_id is provided, filter years
        if program_id:
            self.fields['year'].queryset = Year.objects.filter(program_id=program_id).order_by('year_number')
        else:
            # If POST data is present, get program from POST data
            if args and hasattr(args[0], 'get'):
                program_id = args[0].get('program')
                if program_id:
                    self.fields['year'].queryset = Year.objects.filter(program_id=program_id).order_by('year_number')

            # If still no program, show all years (for validation to work)
            if not program_id:
                self.fields['year'].queryset = Year.objects.all().order_by('program__name', 'year_number')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("A user with this email already exists.")
        return email

    def clean_student_id(self):
        student_id = self.cleaned_data.get('student_id')

        # Check uniqueness if provided
        if student_id and User.objects.filter(student_id=student_id).exists():
            raise forms.ValidationError("A user with this student ID already exists.")

        return student_id

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        role = cleaned_data.get('role')
        program = cleaned_data.get('program')
        year = cleaned_data.get('year')
        student_id = cleaned_data.get('student_id')

        # Password validation
        if password and password_confirm:
            if password != password_confirm:
                self.add_error('password_confirm', "Passwords do not match")
            if len(password) < 8:
                self.add_error('password', "Password must be at least 8 characters long")

        # Student-specific validation
        if role == 'Student':
            if not student_id:
                self.add_error('student_id', "Student ID is required for Student role.")
            if not program:
                self.add_error('program', "Program is required for Student role.")
            if not year:
                self.add_error('year', "Year is required for Student role.")

        return cleaned_data


class AdminUserEditForm(forms.ModelForm):
    """Form for admin to edit existing users"""

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role', 'student_id']
        widgets = {
            'email': forms.EmailInput(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'placeholder': 'user@agu.edu'
            }),
            'first_name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'placeholder': 'First name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'placeholder': 'Last name'
            }),
            'role': forms.Select(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent'
            }),
            'student_id': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent',
                'placeholder': 'Student ID (optional for Admin/Manager)'
            }),
        }

    def __init__(self, *args, **kwargs):
        self.user_id = kwargs.pop('user_id', None)
        super().__init__(*args, **kwargs)

    def clean_email(self):
        email = self.cleaned_data.get('email')
        # Check if email exists for other users
        if User.objects.filter(email=email).exclude(id=self.user_id).exists():
            raise forms.ValidationError("A user with this email already exists.")
        return email

    def clean_student_id(self):
        student_id = self.cleaned_data.get('student_id')
        role = self.cleaned_data.get('role')

        # Student ID is required only for Student role
        if role == 'Student' and not student_id:
            raise forms.ValidationError("Student ID is required for Students.")

        # Check uniqueness if provided
        if student_id and User.objects.filter(student_id=student_id).exclude(id=self.user_id).exists():
            raise forms.ValidationError("A user with this student ID already exists.")

        return student_id


class StudentRegistrationForm(forms.ModelForm):
    """Step 1: Personal Information - Auto-filled for logged-in users"""

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'student_id']

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

        # Make fields read-only if user is logged in and has data
        if self.user:
            if self.user.email:
                self.fields['email'].widget.attrs['readonly'] = True
                self.fields['email'].help_text = "Email from your account"
            if self.user.first_name:
                self.fields['first_name'].widget.attrs['readonly'] = True
            if self.user.last_name:
                self.fields['last_name'].widget.attrs['readonly'] = True

    def clean_email(self):
        email = self.cleaned_data.get('email')
        # Check if email exists for other users (exclude current instance)
        query = User.objects.filter(email=email)
        if self.instance and self.instance.pk:
            query = query.exclude(pk=self.instance.pk)

        if query.exists():
            raise forms.ValidationError("A user with this email already exists.")
        return email

    def clean_student_id(self):
        student_id = self.cleaned_data.get('student_id')
        # Student ID is required for Student role
        if not student_id:
            raise forms.ValidationError("Student ID is required.")

        # Check uniqueness (exclude current instance)
        query = User.objects.filter(student_id=student_id)
        if self.instance and self.instance.pk:
            query = query.exclude(pk=self.instance.pk)

        if query.exists():
            raise forms.ValidationError("A user with this student ID already exists.")
        return student_id


class StudentProgramForm(forms.Form):
    """Step 2: Program Selection"""
    program = forms.ModelChoiceField(queryset=Program.objects.all(), empty_label="Select Program")
    year = forms.ModelChoiceField(queryset=Year.objects.none(), empty_label="Select Year")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'program' in self.data:
            try:
                program_id = int(self.data.get('program'))
                self.fields['year'].queryset = Year.objects.filter(program_id=program_id)
            except (ValueError, TypeError):
                pass


class StudentCourseSelectionForm(forms.Form):
    """Step 3: Course Selection - Cumulative course visibility (Year 1 up to student's year)"""
    courses = forms.ModelMultipleChoiceField(
        queryset=Course.objects.none(),
        widget=forms.CheckboxSelectMultiple,
        required=True
    )

    def __init__(self, *args, **kwargs):
        program_id = kwargs.pop('program_id', None)
        year_number = kwargs.pop('year_number', None)
        max_selections = kwargs.pop('max_selections', 3)
        super().__init__(*args, **kwargs)

        if program_id and year_number:
            # Cumulative course visibility: Show courses from Year 1 up to and including student's year
            self.fields['courses'].queryset = Course.objects.filter(
                program_id=program_id,
                year__year_number__lte=year_number
            ).select_related('year').order_by('year__year_number', 'code')
        elif program_id:
            # Fallback: Show all courses if year_number not provided
            self.fields['courses'].queryset = Course.objects.filter(
                year__program_id=program_id
            ).select_related('year').order_by('year__year_number', 'code')

        self.max_selections = max_selections

    def clean_courses(self):
        courses = self.cleaned_data.get('courses')
        if len(courses) > self.max_selections:
            raise forms.ValidationError(f"You can select a maximum of {self.max_selections} courses")
        return courses


class TutorApplicationStep1Form(forms.Form):
    """Step 1: Personal and Interest Information"""
    # Mobile validator: exactly 8 digits
    mobile_validator = RegexValidator(
        regex=r'^\d{8}$',
        message='Mobile number must be exactly 8 digits with no characters.'
    )

    # Personal Information
    name = forms.CharField(max_length=200, required=True, label="Name")
    student_id = forms.CharField(max_length=50, required=True, label="Student ID")
    email = forms.EmailField(required=True, label="Email")
    mobile = forms.CharField(
        max_length=8,
        required=False,
        validators=[mobile_validator],
        help_text="Exactly 8 digits, no characters"
    )

    # PAL Engagement Questions
    engaged_in_pal = forms.ChoiceField(
        choices=TutorApplication.PAL_ENGAGEMENT_CHOICES,
        widget=forms.RadioSelect,
        label="Have you been engaged in PAL?",
        required=True
    )
    wants_training = forms.BooleanField(
        required=False,
        label="Interested to get training in session planning as PAL tutors?"
    )
    wants_certificate = forms.BooleanField(
        required=False,
        label="Like to receive a certificate to acknowledge contribution?"
    )
    suggestions = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        required=False,
        label="What else do you like to see in the PAL program at AGU?"
    )
    interested_as_tutor = forms.BooleanField(
        required=False,
        label="Interested to act as PAL tutors and teach to your peers* or near-peers**?",
        help_text="*Student of the same year **Students of the junior years"
    )

    def clean_student_id(self):
        student_id = self.cleaned_data.get('student_id')
        # Check if student_id exists in User model
        if not User.objects.filter(student_id=student_id).exists():
            # This is okay for new registrations
            pass
        return student_id


class TutorApplicationStep2Form(forms.Form):
    """Step 2: Academic Details"""
    program = forms.ModelChoiceField(
        queryset=Program.objects.all(),
        widget=forms.RadioSelect,
        empty_label=None,
        label="Program"
    )
    year = forms.ModelChoiceField(
        queryset=Year.objects.all().select_related('program').order_by('program__code', 'year_number'),
        empty_label="Select Year",
        label="Year of study"
    )
    gpa = forms.FloatField(
        min_value=0.0,
        max_value=4.0,
        required=False,
        label="GPA (Optional)",
        help_text="Enter your GPA (0.0 - 4.0)"
    )
    motivation = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4}),
        required=True,
        label="Why do you want to be a PAL tutor?",
        help_text="Short open answer"
    )
    confidence_rating = forms.ChoiceField(
        choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')],
        widget=forms.RadioSelect,
        label="Rate your confidence in teaching a small group",
        help_text="1 (Low) to 5 (High)",
        required=True
    )

    # Optional preferences
    # Note: These are handled as checkboxes in the template, but stored as CharField
    # The view will convert the list of checked values to comma-separated strings
    preferred_days = forms.CharField(
        max_length=200,
        required=False,
        label="Preferred teaching days"
    )
    preferred_times = forms.CharField(
        max_length=200,
        required=False,
        label="Preferred teaching times"
    )
    preferred_mode = forms.ChoiceField(
        choices=[('', '---')] + list(TutorApplication.PREFERRED_MODE_CHOICES),
        required=False,
        label="Preferred mode"
    )
    max_sessions_per_week = forms.IntegerField(
        min_value=1,
        required=False,
        label="Maximum sessions/hours per week"
    )

    # Consent
    consent = forms.BooleanField(
        required=True,
        label="I consent that all information is accurate, and I agree that my PAL participation hours may appear on the AGU Skills Record."
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'program' in self.data:
            try:
                program_id = int(self.data.get('program'))
                self.fields['year'].queryset = Year.objects.filter(program_id=program_id).order_by('year_number')
            except (ValueError, TypeError):
                pass


class TutorApplicationStep3Form(forms.Form):
    """Step 3: Course Selection - Limit to exactly 3 courses"""
    courses = forms.ModelMultipleChoiceField(
        queryset=Course.objects.none(),
        widget=forms.CheckboxSelectMultiple,
        required=True,
        label="Select EXACTLY THREE courses you can tutor",
        help_text="You must select exactly 3 courses from your program (up to and including your year)"
    )

    def __init__(self, *args, **kwargs):
        program_id = kwargs.pop('program_id', None)
        year_number = kwargs.pop('year_number', None)
        super().__init__(*args, **kwargs)

        if program_id and year_number:
            # Show courses from selected program, only up to and including the applicant's year
            self.fields['courses'].queryset = Course.objects.filter(
                program_id=program_id,
                year__year_number__lte=year_number
            ).select_related('year').order_by('year__year_number', 'code')

    def clean_courses(self):
        courses = self.cleaned_data.get('courses')
        if len(courses) != 3:
            raise forms.ValidationError("You must select exactly 3 courses.")
        return courses


class LearnerFeedbackForm(forms.ModelForm):
    """Learner Feedback Form (PAL Action Plan v2)"""

    class Meta:
        model = Feedback
        fields = ['program', 'year', 'tutor', 'topic', 'duration', 'explanation_rating', 'attend_again',
                 'well_organized', 'usefulness_rating', 'comments']
        widgets = {
            'program': forms.Select(attrs={
                'class': 'w-full px-4 py-3 border rounded-lg',
                'required': True
            }),
            'year': forms.Select(attrs={
                'class': 'w-full px-4 py-3 border rounded-lg',
                'required': True
            }),
            'tutor': forms.Select(attrs={
                'class': 'w-full px-4 py-3 border rounded-lg',
                'required': True
            }),
            'topic': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border rounded-lg',
                'placeholder': 'Enter session title/topic',
                'required': True
            }),
            'duration': forms.RadioSelect(),
            'explanation_rating': forms.RadioSelect(choices=[(i, str(i)) for i in range(1, 6)]),
            'usefulness_rating': forms.RadioSelect(choices=[(i, str(i)) for i in range(1, 6)]),
            'attend_again': forms.RadioSelect(choices=[(True, 'Yes'), (False, 'No')]),
            'well_organized': forms.RadioSelect(choices=[(True, 'Yes'), (False, 'No')]),
            'comments': forms.Textarea(attrs={
                'rows': 4,
                'class': 'w-full px-4 py-3 border rounded-lg',
                'placeholder': 'How could this session be improved?'
            }),
        }
        labels = {
            'program': 'Your Program',
            'year': 'Your Year',
            'tutor': 'Name of the Tutor',
            'topic': 'Title/Topic of the session',
            'duration': 'Duration',
            'explanation_rating': "How would you rate your tutor's explanation skills?",
            'attend_again': 'Would you attend another session with this tutor?',
            'well_organized': 'Was the session well-organized and time-managed?',
            'usefulness_rating': 'How useful was the session for your understanding?',
            'comments': 'How could this session be improved?',
        }

    def __init__(self, *args, **kwargs):
        learner = kwargs.pop('learner', None)
        super().__init__(*args, **kwargs)

        # Set initial values from student profile if available
        if learner and not args:  # Only set initial if not POST data
            try:
                student = learner.student_profile
                self.fields['program'].initial = student.program
                self.fields['year'].initial = student.year
            except:
                pass  # No student profile, let user select

        # Get approved tutor IDs
        approved_tutor_ids = []

        if learner:
            try:
                student = learner.student_profile
                # Filter tutors: Approved tutors in same program, years >= learner's year (near-peer)
                approved_tutor_ids = TutorApplication.objects.filter(
                    status='Approved',
                    program=student.program,
                    year__year_number__gte=student.year.year_number
                ).values_list('user_id', flat=True)
            except:
                # Fallback: all approved tutors if no student profile
                approved_tutor_ids = TutorApplication.objects.filter(
                    status='Approved'
                ).values_list('user_id', flat=True)
        else:
            # Fallback: all approved tutors
            approved_tutor_ids = TutorApplication.objects.filter(
                status='Approved'
            ).values_list('user_id', flat=True)

        # Set queryset
        self.fields['tutor'].queryset = User.objects.filter(
            id__in=approved_tutor_ids
        ).order_by('first_name', 'last_name')

        # Add searchable class for JavaScript enhancement
        self.fields['tutor'].widget.attrs.update({
            'class': 'w-full px-4 py-3 border border-neutral-300 dark:border-neutral-dark-300 rounded-lg bg-neutral-50 dark:bg-neutral-dark-50 text-neutral-900 dark:text-neutral-dark-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark-500 focus:border-transparent searchable-select',
            'id': 'id_tutor',
            'required': True
        })


class SessionFeedbackForm(forms.ModelForm):
    """Legacy Session Feedback Form"""
    class Meta:
        model = Feedback
        fields = ['rating', 'satisfaction', 'helpfulness', 'comments']
        widgets = {
            'rating': forms.RadioSelect(choices=[(i, str(i)) for i in range(1, 6)]),
            'satisfaction': forms.RadioSelect(choices=[(i, str(i)) for i in range(1, 6)]),
            'helpfulness': forms.RadioSelect(choices=[(i, str(i)) for i in range(1, 6)]),
            'comments': forms.Textarea(attrs={'rows': 4}),
        }


class SessionCreateForm(forms.ModelForm):
    """Create session form for tutors"""
    class Meta:
        model = Session
        fields = ['learner', 'course', 'evaluation_year', 'session_date', 'duration', 'notes']
        widgets = {
            'session_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }

    def __init__(self, *args, **kwargs):
        tutor = kwargs.pop('tutor', None)
        super().__init__(*args, **kwargs)

        if tutor:
            # Only show students as learners
            self.fields['learner'].queryset = User.objects.filter(role='Student')
            # Only show courses the tutor can teach
            tutor_apps = TutorApplication.objects.filter(user=tutor, status='Approved')
            course_ids = []
            for app in tutor_apps:
                course_ids.extend(app.courses.values_list('id', flat=True))
            self.fields['course'].queryset = Course.objects.filter(id__in=course_ids)

        # Set default evaluation year to active year
        active_year = EvaluationYear.objects.filter(is_active=True).first()
        if active_year:
            self.fields['evaluation_year'].initial = active_year


class EvaluationYearForm(forms.ModelForm):
    """Form for creating/editing Evaluation Years"""
    class Meta:
        model = EvaluationYear
        fields = ['year', 'start_date', 'end_date', 'is_active', 'programs']
        widgets = {
            'year': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 border rounded-lg',
                'placeholder': 'e.g., 2025-26'
            }),
            'start_date': forms.DateInput(attrs={
                'type': 'date',
                'class': 'w-full px-4 py-3 border rounded-lg'
            }),
            'end_date': forms.DateInput(attrs={
                'type': 'date',
                'class': 'w-full px-4 py-3 border rounded-lg'
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'rounded'
            }),
            'programs': forms.CheckboxSelectMultiple(),
        }
        help_texts = {
            'is_active': 'Only one year can be active at a time',
            'programs': 'Select programs (MD/Nursing) for this evaluation year'
        }


class AnalyticsFilterForm(forms.Form):
    """Form for filtering analytics dashboard"""
    evaluation_year = forms.ModelChoiceField(
        queryset=EvaluationYear.objects.all().order_by('-start_date'),
        required=False,
        empty_label="All Years",
        label="Evaluation Year"
    )
    program = forms.ModelChoiceField(
        queryset=Program.objects.all(),
        required=False,
        empty_label="All Programs",
        label="Program"
    )
    start_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}),
        label="Start Date"
    )
    end_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}),
        label="End Date"
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set default to active evaluation year
        active_year = EvaluationYear.objects.filter(is_active=True).first()
        if active_year and not self.data:
            self.fields['evaluation_year'].initial = active_year
            self.fields['start_date'].initial = active_year.start_date
            self.fields['end_date'].initial = active_year.end_date
