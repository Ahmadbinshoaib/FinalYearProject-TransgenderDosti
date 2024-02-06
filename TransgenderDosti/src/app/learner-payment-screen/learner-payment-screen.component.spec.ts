import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerPaymentScreenComponent } from './learner-payment-screen.component';

describe('LearnerPaymentScreenComponent', () => {
  let component: LearnerPaymentScreenComponent;
  let fixture: ComponentFixture<LearnerPaymentScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerPaymentScreenComponent]
    });
    fixture = TestBed.createComponent(LearnerPaymentScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
