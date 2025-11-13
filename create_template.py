import pandas as pd

# Create sample Excel template for bulk upload
data = {
    'email': ['student1@agu.edu', 'student2@agu.edu', 'tutor1@agu.edu'],
    'password': ['password123', 'password123', 'password123'],
    'first_name': ['John', 'Jane', 'Bob'],
    'last_name': ['Doe', 'Smith', 'Johnson'],
    'role': ['Student', 'Student', 'Tutor'],
    'student_id': ['STU001', 'STU002', 'TUT001']
}

df = pd.DataFrame(data)
df.to_excel('/workspace/pal-tracking-system/bulk_upload_template.xlsx', index=False)
print("Sample Excel template created: bulk_upload_template.xlsx")
