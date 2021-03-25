import { TestBed } from '@angular/core/testing';

import { EnrollmentManualAssignmentService } from './enrollment-manual-assignment.service';

describe('EnrollmentManualAssignmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentManualAssignmentService = TestBed.get(EnrollmentManualAssignmentService);
    expect(service).toBeTruthy();
  });
});
