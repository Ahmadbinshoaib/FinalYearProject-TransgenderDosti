import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHomepageComponent } from './business-homepage.component';

describe('BusinessHomepageComponent', () => {
  let component: BusinessHomepageComponent;
  let fixture: ComponentFixture<BusinessHomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessHomepageComponent]
    });
    fixture = TestBed.createComponent(BusinessHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
