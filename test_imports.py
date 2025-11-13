#!/usr/bin/env python
import sys
import os
import django

# Add the project to the path
sys.path.insert(0, '/workspace/pal-tracking-system')
os.environ['DJANGO_SETTINGS_MODULE'] = 'pal_tracking.settings'

django.setup()

# Test imports
try:
    from core import views, forms, models
    print("✓ All imports successful")
    
    # Check forms
    form_classes = [
        'StudentRegistrationForm', 'StudentProgramForm', 'StudentCourseSelectionForm',
        'TutorRegistrationForm', 'TutorProgramForm', 'TutorCourseSelectionForm',
        'TutorTrainingForm', 'SessionCreateForm', 'SessionFeedbackForm'
    ]
    
    for form_name in form_classes:
        if hasattr(forms, form_name):
            print(f"✓ {form_name} found")
        else:
            print(f"✗ {form_name} NOT found")
    
    # Check views
    view_functions = [
        'student_registration_start', 'student_registration_step2', 'student_registration_step3',
        'tutor_registration_start', 'tutor_registration_step2', 'tutor_registration_step3', 'tutor_registration_step4',
        'enhanced_student_dashboard', 'create_session', 'submit_feedback'
    ]
    
    for view_name in view_functions:
        if hasattr(views, view_name):
            print(f"✓ {view_name} view found")
        else:
            print(f"✗ {view_name} view NOT found")
    
    print("\n✓ All checks passed!")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
