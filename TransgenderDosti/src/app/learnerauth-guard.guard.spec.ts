import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { learnerauthGuardGuard } from './learnerauth-guard.guard';

describe('learnerauthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => learnerauthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
