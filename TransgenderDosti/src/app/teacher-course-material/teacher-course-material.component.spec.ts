import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCourseMaterialComponent } from './teacher-course-material.component';

describe('TeacherCourseMaterialComponent', () => {
  let component: TeacherCourseMaterialComponent;
  let fixture: ComponentFixture<TeacherCourseMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherCourseMaterialComponent]
    });
    fixture = TestBed.createComponent(TeacherCourseMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
