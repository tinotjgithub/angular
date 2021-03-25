import { TestBed } from '@angular/core/testing';

import { EnrollmentAutoSamplingService } from './enrollment-auto-sampling.service';

describe('EnrollmentAutoSamplingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentAutoSamplingService = TestBed.get(EnrollmentAutoSamplingService);
    expect(service).toBeTruthy();
  });
});
