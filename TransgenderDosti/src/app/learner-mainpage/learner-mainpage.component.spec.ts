import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerMainpageComponent } from './learner-mainpage.component';

describe('LearnerMainpageComponent', () => {
  let component: LearnerMainpageComponent;
  let fixture: ComponentFixture<LearnerMainpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerMainpageComponent]
    });
    fixture = TestBed.createComponent(LearnerMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
