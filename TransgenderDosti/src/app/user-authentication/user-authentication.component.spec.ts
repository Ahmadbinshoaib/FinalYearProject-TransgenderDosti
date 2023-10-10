import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthenticationComponent } from './user-authentication.component';

describe('UserAuthenticationComponent', () => {
  let component: UserAuthenticationComponent;
  let fixture: ComponentFixture<UserAuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAuthenticationComponent]
    });
    fixture = TestBed.createComponent(UserAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
