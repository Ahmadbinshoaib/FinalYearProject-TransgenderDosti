import { TestBed } from '@angular/core/testing';

import { EducationPageServicesService } from './education-page-services.service';

describe('EducationPageServicesService', () => {
  let service: EducationPageServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducationPageServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
