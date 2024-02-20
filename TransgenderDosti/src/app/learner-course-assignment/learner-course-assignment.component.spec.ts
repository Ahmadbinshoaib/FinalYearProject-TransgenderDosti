import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerCourseAssignmentComponent } from './learner-course-assignment.component';

describe('LearnerCourseAssignmentComponent', () => {
  let component: LearnerCourseAssignmentComponent;
  let fixture: ComponentFixture<LearnerCourseAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerCourseAssignmentComponent]
    });
    fixture = TestBed.createComponent(LearnerCourseAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
