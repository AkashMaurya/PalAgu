# Cumulative Course Visibility Implementation

**Date:** November 6, 2025  
**Feature:** Student Registration Step 3 - Cumulative Course Visibility  
**Status:** ✅ Implemented

---

## Overview

Implemented cumulative course visibility for the student registration Step 3 form. Students now see courses from Year 1 up to and including their current year, rather than all courses across all years.

---

## Implementation Details

### Behavior

**For MD Program Students:**
- Year 1 student: See only Year 1 courses (12 courses)
- Year 2 student: See Year 1 + Year 2 courses (15 courses)
- Year 3 student: See Year 1 + Year 2 + Year 3 courses (18 courses)
- Year 4 student: See Year 1 + Year 2 + Year 3 + Year 4 courses (21 courses)
- Year 5 student: See Year 1 + Year 2 + Year 3 + Year 4 + Year 5 courses (24 courses)
- Year 6 student: See all courses (Year 1 through Year 6) (27 courses)

**For Nursing Program Students:**
- Year 1 student: See only Year 1 courses (11 courses)
- Year 2 student: See Year 1 + Year 2 courses (22 courses)

---

## Files Modified

### 1. `core/forms.py`

**Class:** `StudentCourseSelectionForm`

**Changes:**
- Updated docstring to reflect cumulative course visibility
- Added `year_number` parameter to `__init__()` method
- Updated queryset to filter courses using `year__year_number__lte=year_number`
- Added fallback logic if `year_number` is not provided

**Code:**
```python
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
```

---

### 2. `core/views.py`

**Function:** `student_registration_step3`

**Changes:**
- Updated docstring to reflect cumulative course visibility
- Fetched `Year` object to get `year_number`
- Updated `courses_count` query to filter by `year__year_number__lte=year_number`
- Passed `year_number` parameter to form in both POST and GET requests
- Updated debug logging to show cumulative course count

**Code:**
```python
@login_required
def student_registration_step3(request):
    """Student registration - Step 3: Course Selection (Cumulative course visibility)"""
    if 'student_reg_step2' not in request.session:
        return redirect('student_registration_start')

    year_id = request.session['student_reg_step2']['year_id']
    program_id = request.session['student_reg_step2']['program_id']

    # Get year_number for cumulative course visibility
    year = Year.objects.get(id=year_id)
    year_number = year.year_number

    # Debug: Check if courses exist for this program
    courses_count = Course.objects.filter(
        program_id=program_id,
        year__year_number__lte=year_number
    ).count()
    print(f"DEBUG: Year ID: {year_id}, Year Number: {year_number}, Program ID: {program_id}, Cumulative courses: {courses_count}")

    max_selections = int(Config.objects.get(key='maxCourseSelections').value)

    if request.method == 'POST':
        form = forms.StudentCourseSelectionForm(
            request.POST,
            program_id=program_id,
            year_number=year_number,
            max_selections=max_selections
        )
        # ... rest of POST logic
    
    form = forms.StudentCourseSelectionForm(
        program_id=program_id,
        year_number=year_number,
        max_selections=max_selections
    )
    # ... rest of GET logic
```

---

### 3. `templates/core/student_registration_step3.html`

**Changes:**
- Updated info box title to "Course Selection - Cumulative Visibility"
- Updated help text to clarify "Year 1 up to and including your current year"
- Updated course count message to show "from Year 1 to {{ year.name }}"
- Updated label to show "Available Courses (Year 1 to {{ year.name }})"

**Code:**
```html
<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
    <div class="flex items-start">
        <i data-lucide="info" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3"></i>
        <div>
            <p class="text-sm text-blue-800 dark:text-blue-200 font-medium">Course Selection - Cumulative Visibility</p>
            <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Select up to {{ max_selections }} courses you need tutoring assistance with from <strong>Year 1 up to and including your current year</strong>.
            </p>
            {% if program and year %}
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Program: {{ program.name }} - Your Year: {{ year.name }} ({{ courses_count }} courses available from Year 1 to {{ year.name }})
            </p>
            {% endif %}
        </div>
    </div>
</div>

<!-- Courses Grouped by Year -->
<div class="mb-8">
    <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-dark-700 mb-4">
        Available Courses (Year 1 to {{ year.name }}) <span class="text-red-500">*</span>
    </label>
    <!-- ... rest of template -->
</div>
```

---

## Database Query

The cumulative course visibility is achieved using the following Django ORM query:

```python
Course.objects.filter(
    program_id=program_id,
    year__year_number__lte=year_number
).select_related('year').order_by('year__year_number', 'code')
```

**Explanation:**
- `program_id=program_id`: Filter courses by the student's selected program
- `year__year_number__lte=year_number`: Filter courses where the year number is less than or equal to the student's year number (cumulative)
- `.select_related('year')`: Optimize query by joining Year table
- `.order_by('year__year_number', 'code')`: Order courses by year number, then by course code

---

## Testing Scenarios

### Test Case 1: MD Year 1 Student
- **Expected:** See only Year 1 courses (12 courses)
- **Query:** `year__year_number__lte=1`

### Test Case 2: MD Year 3 Student
- **Expected:** See Year 1, 2, and 3 courses (18 courses)
- **Query:** `year__year_number__lte=3`

### Test Case 3: MD Year 6 Student
- **Expected:** See all MD courses (27 courses)
- **Query:** `year__year_number__lte=6`

### Test Case 4: Nursing Year 1 Student
- **Expected:** See only Year 1 courses (11 courses)
- **Query:** `year__year_number__lte=1`

### Test Case 5: Nursing Year 2 Student
- **Expected:** See Year 1 and 2 courses (22 courses)
- **Query:** `year__year_number__lte=2`

---

## Benefits

1. **Improved UX**: Students only see relevant courses they can realistically need help with
2. **Reduced Confusion**: Eliminates the clutter of seeing advanced courses they haven't taken yet
3. **Logical Progression**: Aligns with the academic progression model
4. **Consistency**: Matches the tutor application Step 3 behavior (tutors also see cumulative courses)
5. **Scalability**: Works for any number of years in any program

---

## Consistency with Tutor Application

The student registration Step 3 now uses the **same cumulative course visibility logic** as the tutor application Step 3:

**Tutor Application Step 3 (already implemented):**
```python
Course.objects.filter(
    program_id=program_id,
    year__year_number__lte=year_number
).select_related('year').order_by('year__year_number', 'code')
```

**Student Registration Step 3 (newly implemented):**
```python
Course.objects.filter(
    program_id=program_id,
    year__year_number__lte=year_number
).select_related('year').order_by('year__year_number', 'code')
```

Both forms now provide a consistent user experience.

---

## Future Enhancements

1. **Course Prerequisites**: Add prerequisite tracking to show only courses the student is eligible for
2. **Course Recommendations**: Suggest courses based on student's GPA and past performance
3. **Popular Courses**: Highlight courses with high tutor availability
4. **Course Search**: Add search/filter functionality for large course lists

---

## Summary

✅ **Cumulative course visibility successfully implemented**  
✅ **Consistent with tutor application behavior**  
✅ **Improved user experience**  
✅ **No breaking changes**  
✅ **Backward compatible (fallback logic included)**

The student registration Step 3 form now provides a more intuitive and logical course selection experience by showing only courses from Year 1 up to the student's current year.

