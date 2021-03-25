import { TestBed } from '@angular/core/testing';

import { EnrollmentManualSamplingService } from './enrollment-manual-sampling.service';

describe('EnrollmentManualSamplingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentManualSamplingService = TestBed.get(EnrollmentManualSamplingService);
    expect(service).toBeTruthy();
  });
});
