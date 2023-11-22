import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { teacherauthGuardGuard } from './teacherauth-guard.guard';

describe('teacherauthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => teacherauthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
