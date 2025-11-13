from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Program, Year, Course, Student, TutorApplication, Session, Feedback, Config, EvaluationYear


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'student_id', 'is_active']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['email', 'first_name', 'last_name', 'student_id']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'student_id')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'student_id', 'first_name', 'last_name')}),
    )


@admin.register(EvaluationYear)
class EvaluationYearAdmin(admin.ModelAdmin):
    list_display = ['year', 'start_date', 'end_date', 'is_active', 'created_at']
    list_filter = ['is_active', 'start_date']
    search_fields = ['year']
    filter_horizontal = ['programs']
    ordering = ['-start_date']

    fieldsets = (
        ('Year Information', {
            'fields': ('year', 'start_date', 'end_date', 'is_active')
        }),
        ('Programs', {
            'fields': ('programs',),
            'description': 'Select programs (MD/Nursing) for this evaluation year'
        }),
    )


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'created_at']
    search_fields = ['name', 'code']


class YearInline(admin.TabularInline):
    model = Year
    extra = 0
    fields = ['year_number', 'name']


class CourseInline(admin.TabularInline):
    model = Course
    extra = 0
    fields = ['code', 'name', 'year', 'description']
    autocomplete_fields = ['year']


@admin.register(Year)
class YearAdmin(admin.ModelAdmin):
    list_display = ['program', 'year_number', 'name']
    list_filter = ['program']
    ordering = ['program', 'year_number']
    search_fields = ['name', 'program__name']
    inlines = [CourseInline]


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'program', 'year', 'created_at']
    list_filter = ['program', 'year']
    search_fields = ['code', 'name']
    ordering = ['program', 'year', 'code']
    autocomplete_fields = ['program', 'year']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('program', 'year')


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'program', 'year', 'has_disciplinary_warning', 'created_at']
    list_filter = ['program', 'year', 'has_disciplinary_warning']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'user__student_id']
    autocomplete_fields = ['user', 'program', 'year', 'study_year']

    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Academic Information', {
            'fields': ('program', 'year', 'study_year')
        }),
        ('Status', {
            'fields': ('has_disciplinary_warning',)
        }),
    )


@admin.register(TutorApplication)
class TutorApplicationAdmin(admin.ModelAdmin):
    list_display = ['user', 'program', 'year', 'gpa', 'status', 'get_course_count', 'training_completed', 'created_at']
    list_filter = ['status', 'program', 'training_completed', 'wants_training', 'wants_certificate']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'mobile']
    filter_horizontal = ['courses']
    readonly_fields = ['created_at', 'updated_at', 'get_course_count']

    fieldsets = (
        ('Applicant Information', {
            'fields': ('user', 'mobile')
        }),
        ('PAL Engagement', {
            'fields': ('engaged_in_pal', 'wants_training', 'wants_certificate', 'suggestions', 'interested_as_tutor')
        }),
        ('Academic Information', {
            'fields': ('program', 'year', 'gpa', 'motivation', 'confidence_rating')
        }),
        ('Preferences', {
            'fields': ('preferred_days', 'preferred_times', 'preferred_mode', 'max_sessions_per_week'),
            'classes': ('collapse',)
        }),
        ('Course Selection', {
            'fields': ('courses', 'get_course_count'),
            'description': 'Applicant must select EXACTLY 3 courses'
        }),
        ('Consent & Status', {
            'fields': ('consent', 'status', 'training_completed', 'certification_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_course_count(self, obj):
        return obj.get_course_count()
    get_course_count.short_description = 'Courses Selected'


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['tutor', 'learner', 'course', 'evaluation_year', 'session_date', 'duration', 'status']
    list_filter = ['status', 'evaluation_year', 'course__program']
    search_fields = ['tutor__email', 'learner__email', 'course__name']
    date_hierarchy = 'session_date'
    autocomplete_fields = ['tutor', 'learner', 'course', 'evaluation_year']

    fieldsets = (
        ('Participants', {
            'fields': ('tutor', 'learner')
        }),
        ('Session Details', {
            'fields': ('course', 'evaluation_year', 'session_date', 'duration', 'status')
        }),
        ('Notes', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['learner', 'tutor', 'topic', 'explanation_rating', 'usefulness_rating', 'attend_again', 'created_at']
    list_filter = ['explanation_rating', 'usefulness_rating', 'attend_again', 'well_organized', 'duration', 'program', 'year']
    readonly_fields = ['created_at', 'updated_at', 'session_date', 'get_average_rating']
    search_fields = ['learner__email', 'tutor__email', 'topic']
    autocomplete_fields = ['learner', 'tutor', 'program', 'year', 'session']

    fieldsets = (
        ('Learner Information', {
            'fields': ('learner', 'program', 'year')
        }),
        ('Session Information', {
            'fields': ('tutor', 'topic', 'duration', 'session_date', 'session')
        }),
        ('Ratings', {
            'fields': ('explanation_rating', 'usefulness_rating', 'attend_again', 'well_organized', 'rating', 'get_average_rating')
        }),
        ('Comments', {
            'fields': ('comments',)
        }),
        ('Legacy Fields', {
            'fields': ('satisfaction', 'helpfulness'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_average_rating(self, obj):
        return f"{obj.get_average_rating():.2f}"
    get_average_rating.short_description = 'Average Rating'


@admin.register(Config)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ['key', 'value', 'description', 'updated_at']
    search_fields = ['key']
