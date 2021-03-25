import { TestBed } from '@angular/core/testing';

import { EnrollmentManualPrioritizationService } from './enrollment-manual-prioritization.service';

describe('EnrollmentManualPrioritizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentManualPrioritizationService = TestBed.get(EnrollmentManualPrioritizationService);
    expect(service).toBeTruthy();
  });
});
