import { TestBed } from '@angular/core/testing';

import { LearnerProfileService } from './learner-profile.service';

describe('LearnerProfileService', () => {
  let service: LearnerProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnerProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
