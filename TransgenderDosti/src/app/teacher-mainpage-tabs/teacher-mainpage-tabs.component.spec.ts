import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMainpageTabsComponent } from './teacher-mainpage-tabs.component';

describe('TeacherMainpageTabsComponent', () => {
  let component: TeacherMainpageTabsComponent;
  let fixture: ComponentFixture<TeacherMainpageTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherMainpageTabsComponent]
    });
    fixture = TestBed.createComponent(TeacherMainpageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
