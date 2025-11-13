from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator


class User(AbstractUser):
    """Extended user model with role-based access"""
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
        ('Student', 'Student'),
        ('Tutor', 'Tutor'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    student_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'role']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
    
    class Meta:
        ordering = ['-created_at']


class Program(models.Model):
    """Academic programs (MD, Nursing)"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class Year(models.Model):
    """Academic years for each program"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='years')
    year_number = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)])
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.program.code} - {self.name}"
    
    class Meta:
        ordering = ['program', 'year_number']
        unique_together = ['program', 'year_number']


class Course(models.Model):
    """Courses/Topics for each program and year"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='courses')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='courses')
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    class Meta:
        ordering = ['program', 'year', 'code']
        unique_together = ['code', 'program', 'year']


class EvaluationYear(models.Model):
    """Academic evaluation years for tracking sessions and feedback"""
    year = models.CharField(max_length=10, unique=True, help_text="e.g., 2025-26")
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False, help_text="Only one year can be active at a time")
    programs = models.ManyToManyField(Program, related_name='evaluation_years', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.year} ({'Active' if self.is_active else 'Inactive'})"

    def save(self, *args, **kwargs):
        # Ensure only one active year at a time
        if self.is_active:
            EvaluationYear.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-start_date']
        verbose_name = "Evaluation Year"
        verbose_name_plural = "Evaluation Years"


class Student(models.Model):
    """Student profile linked to User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='students',
                            help_text="Current year of study")
    study_year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='study_students',
                                   null=True, blank=True,
                                   help_text="Study year (same as year, for compatibility)")
    has_disciplinary_warning = models.BooleanField(default=False,
                                                   help_text="Has active disciplinary warnings")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.program.code} Year {self.year.year_number}"

    def save(self, *args, **kwargs):
        # Auto-set study_year to year if not provided
        if not self.study_year_id:
            self.study_year = self.year
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']


class TutorApplication(models.Model):
    """Tutor registration/application data"""
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    PAL_ENGAGEMENT_CHOICES = [
        ('tutor', 'Yes, as a tutor'),
        ('learner', 'Yes, as a learner'),
        ('both', 'Yes, as both'),
        ('solo', 'No, I am a solo learner!'),
    ]

    PREFERRED_MODE_CHOICES = [
        ('On-campus', 'On-campus'),
        ('Online', 'Online'),
        ('Hybrid', 'Hybrid'),
    ]

    PREFERRED_TIME_CHOICES = [
        ('Morning', 'Morning'),
        ('Afternoon', 'Afternoon'),
        ('Evening', 'Evening'),
    ]

    # Mobile validator: exactly 8 digits
    mobile_validator = RegexValidator(
        regex=r'^\d{8}$',
        message='Mobile number must be exactly 8 digits with no characters.'
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tutor_applications')
    mobile = models.CharField(max_length=8, blank=True, validators=[mobile_validator],
                             help_text="Exactly 8 digits, no characters")

    # PAL Engagement Questions (Step 1)
    engaged_in_pal = models.CharField(max_length=20, choices=PAL_ENGAGEMENT_CHOICES,
                                     default='solo',
                                     verbose_name="Have you been engaged in PAL?")
    wants_training = models.BooleanField(default=False,
                                        verbose_name="Interested to get training in session planning as PAL tutors?")
    wants_certificate = models.BooleanField(default=False,
                                           verbose_name="Like to receive a certificate to acknowledge contribution?")
    suggestions = models.TextField(blank=True, default='',
                                  verbose_name="What else do you like to see in the PAL program at AGU?")
    interested_as_tutor = models.BooleanField(default=False,
                                             verbose_name="Interested to act as PAL tutors and teach to your peers or near-peers?")

    # Academic Information (Step 2)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    year = models.ForeignKey(Year, on_delete=models.CASCADE, verbose_name="Year of study")
    gpa = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(4.0)],
                           null=True,
                           blank=True,
                           help_text="GPA (0.0 - 4.0)")
    motivation = models.TextField(default='',
                                 verbose_name="Why do you want to be a PAL tutor?",
                                 help_text="Short open answer")
    confidence_rating = models.IntegerField(
        choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')],
        default=3,
        verbose_name="Rate your confidence in teaching a small group",
        help_text="1 (Low) to 5 (High)"
    )

    # Optional preferences
    preferred_days = models.CharField(max_length=200, blank=True,
                                     help_text="e.g., Monday, Wednesday")
    preferred_times = models.CharField(max_length=20, choices=PREFERRED_TIME_CHOICES, blank=True)
    preferred_mode = models.CharField(max_length=20, choices=PREFERRED_MODE_CHOICES, blank=True)
    max_sessions_per_week = models.IntegerField(null=True, blank=True,
                                               validators=[MinValueValidator(1)],
                                               help_text="Maximum sessions/hours per week")

    # Consent (Step 2)
    consent = models.BooleanField(default=False,
                                 verbose_name="I consent that all information is accurate, and I agree that my PAL participation hours may appear on the AGU Skills Record.")

    # Course Selection (Step 3) - Limit to 3 via form validation
    courses = models.ManyToManyField(Course, related_name='tutor_applications',
                                    help_text="Select EXACTLY THREE courses")

    # Application Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    training_completed = models.BooleanField(default=False)
    certification_url = models.FileField(upload_to='certifications/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.status}"

    def get_course_count(self):
        """Return number of selected courses"""
        return self.courses.count()

    class Meta:
        ordering = ['-created_at']


class Session(models.Model):
    """Tutor-learner session records"""
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tutor_sessions')
    learner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='learner_sessions')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    evaluation_year = models.ForeignKey(EvaluationYear, on_delete=models.SET_NULL, null=True, blank=True,
                                       related_name='sessions',
                                       help_text="Academic year for this session")
    session_date = models.DateTimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tutor.get_full_name()} -> {self.learner.get_full_name()} ({self.course.code})"

    def save(self, *args, **kwargs):
        # Auto-assign active evaluation year if not set
        if not self.evaluation_year_id:
            active_year = EvaluationYear.objects.filter(is_active=True).first()
            if active_year:
                self.evaluation_year = active_year
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-session_date']


class Feedback(models.Model):
    """Session feedback and ratings"""
    DURATION_CHOICES = [
        ('less_30', 'Less than 30 Min.'),
        ('30_60', '30 – 60 Min.'),
        ('60_90', '60 – 90 Min.'),
        ('more_90', 'More than 90 Min.'),
    ]

    # Learner Information (auto-populated from logged-in user)
    learner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback_given')
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    year = models.ForeignKey(Year, on_delete=models.CASCADE, verbose_name="Learner's year")

    # Session Information
    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback_received',
                             limit_choices_to={'tutor_applications__status': 'Approved'},
                             verbose_name="Name of the Tutor")
    topic = models.CharField(max_length=200, verbose_name="Title/Topic of the session")
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    session_date = models.DateTimeField(auto_now_add=True, help_text="Auto-documented date/time")
    session = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='feedbacks',
                               help_text="Linked session if available")

    # New Rating Fields (PAL Action Plan v2)
    explanation_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=3,
        verbose_name="How would you rate your tutor's explanation skills?",
        help_text="1 (Poor) to 5 (Excellent)"
    )
    attend_again = models.BooleanField(
        default=True,
        verbose_name="Would you attend another session with this tutor?"
    )
    well_organized = models.BooleanField(
        default=True,
        verbose_name="Was the session well-organized and time-managed?"
    )
    usefulness_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=3,
        verbose_name="How useful was the session for your understanding?",
        help_text="1 (Not useful) to 5 (Very useful)"
    )

    # Overall rating (legacy/general)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],
                                null=True, blank=True,
                                help_text="Overall rating (1-5)")

    # Improvement suggestions
    comments = models.TextField(blank=True, verbose_name="How could this session be improved?")

    # Legacy fields (optional, for backward compatibility)
    satisfaction = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],
                                      null=True, blank=True)
    helpfulness = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],
                                     null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Feedback from {self.learner.get_full_name()} for {self.tutor.get_full_name()} - {self.explanation_rating}/5"

    def get_average_rating(self):
        """Calculate average of all ratings"""
        ratings = [self.explanation_rating, self.usefulness_rating]
        if self.rating:
            ratings.append(self.rating)
        return sum(ratings) / len(ratings) if ratings else 0

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Learner Feedback"
        verbose_name_plural = "Learner Feedbacks"


class Config(models.Model):
    """System configuration settings"""
    key = models.CharField(max_length=100, unique=True)
    value = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.key}: {self.value}"
    
    class Meta:
        ordering = ['key']
