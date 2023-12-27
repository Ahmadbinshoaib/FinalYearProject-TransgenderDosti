import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCourseAssignmentComponent } from './teacher-course-assignment.component';

describe('TeacherCourseAssignmentComponent', () => {
  let component: TeacherCourseAssignmentComponent;
  let fixture: ComponentFixture<TeacherCourseAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherCourseAssignmentComponent]
    });
    fixture = TestBed.createComponent(TeacherCourseAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
