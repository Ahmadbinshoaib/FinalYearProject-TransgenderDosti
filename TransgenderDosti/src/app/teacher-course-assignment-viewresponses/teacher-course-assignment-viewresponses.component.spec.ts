import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCourseAssignmentViewresponsesComponent } from './teacher-course-assignment-viewresponses.component';

describe('TeacherCourseAssignmentViewresponsesComponent', () => {
  let component: TeacherCourseAssignmentViewresponsesComponent;
  let fixture: ComponentFixture<TeacherCourseAssignmentViewresponsesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherCourseAssignmentViewresponsesComponent]
    });
    fixture = TestBed.createComponent(TeacherCourseAssignmentViewresponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
