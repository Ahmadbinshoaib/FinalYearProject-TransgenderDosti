import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationHomepageComponent } from './education-homepage.component';

describe('EducationHomepageComponent', () => {
  let component: EducationHomepageComponent;
  let fixture: ComponentFixture<EducationHomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducationHomepageComponent]
    });
    fixture = TestBed.createComponent(EducationHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
