from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('users/', views.user_management, name='user_management'),
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:user_id>/edit/', views.edit_user, name='edit_user'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    path('users/bulk-upload/', views.bulk_upload_users, name='bulk_upload_users'),
    path('analytics/', views.analytics_dashboard, name='analytics'),
    path('manager/analytics/', views.manager_analytics, name='manager_analytics'),
    path('student/', views.student_dashboard, name='student_dashboard'),
    path('student/enhanced/', views.enhanced_student_dashboard, name='enhanced_student_dashboard'),
    path('settings/', views.settings_view, name='settings'),
    
    # Student Registration (Multi-step)
    path('register/student/', views.student_registration_start, name='student_registration_start'),
    path('register/student/step2/', views.student_registration_step2, name='student_registration_step2'),
    path('register/student/step3/', views.student_registration_step3, name='student_registration_step3'),

    # Tutor Registration (Multi-step - PAL Action Plan v2: 3 steps)
    path('register/tutor/', views.tutor_registration_start, name='tutor_registration_start'),
    path('register/tutor/step2/', views.tutor_registration_step2, name='tutor_registration_step2'),
    path('register/tutor/step3/', views.tutor_registration_step3, name='tutor_registration_step3'),

    # Session Management
    path('session/create/', views.create_session, name='create_session'),
    path('session/<int:session_id>/feedback/', views.submit_feedback, name='submit_feedback'),

    # Learner Feedback (PAL Action Plan v2)
    path('feedback/submit/', views.learner_feedback_submit, name='learner_feedback_submit'),

    # Analytics Export (PAL Action Plan v2)
    path('analytics/export-pdf/', views.analytics_export_pdf, name='analytics_export_pdf'),
    path('analytics/export-excel/', views.analytics_export_excel, name='analytics_export_excel'),

    # Evaluation Year Management (PAL Action Plan v2)
    path('evaluation-years/', views.manage_evaluation_years, name='manage_evaluation_years'),
    path('evaluation-years/create/', views.create_evaluation_year, name='create_evaluation_year'),
    path('evaluation-years/<int:year_id>/edit/', views.edit_evaluation_year, name='edit_evaluation_year'),
    path('evaluation-years/<int:year_id>/delete/', views.delete_evaluation_year, name='delete_evaluation_year'),

    # AJAX/HTMX Endpoints
    path('api/years/', views.get_years_for_program, name='get_years_for_program'),
    path('get-years/', views.get_years_by_program, name='get_years_by_program'),
]
