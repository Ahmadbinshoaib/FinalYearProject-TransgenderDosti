import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCourseDashboardComponent } from './teacher-course-dashboard.component';

describe('TeacherCourseDashboardComponent', () => {
  let component: TeacherCourseDashboardComponent;
  let fixture: ComponentFixture<TeacherCourseDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherCourseDashboardComponent]
    });
    fixture = TestBed.createComponent(TeacherCourseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
