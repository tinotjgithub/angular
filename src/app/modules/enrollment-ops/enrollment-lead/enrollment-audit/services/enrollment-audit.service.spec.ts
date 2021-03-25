import { TestBed } from '@angular/core/testing';

import { EnrollmentAuditService } from './enrollment-audit.service';

describe('EnrollmentAuditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentAuditService = TestBed.get(EnrollmentAuditService);
    expect(service).toBeTruthy();
  });
});
