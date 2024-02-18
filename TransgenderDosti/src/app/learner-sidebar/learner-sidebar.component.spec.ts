import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerSidebarComponent } from './learner-sidebar.component';

describe('LearnerSidebarComponent', () => {
  let component: LearnerSidebarComponent;
  let fixture: ComponentFixture<LearnerSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerSidebarComponent]
    });
    fixture = TestBed.createComponent(LearnerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
