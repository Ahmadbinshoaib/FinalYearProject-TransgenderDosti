import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerCourseDashboardComponent } from './learner-course-dashboard.component';

describe('LearnerCourseDashboardComponent', () => {
  let component: LearnerCourseDashboardComponent;
  let fixture: ComponentFixture<LearnerCourseDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerCourseDashboardComponent]
    });
    fixture = TestBed.createComponent(LearnerCourseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
