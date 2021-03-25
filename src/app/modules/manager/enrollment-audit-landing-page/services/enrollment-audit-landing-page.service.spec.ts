import { TestBed } from '@angular/core/testing';

import { EnrollmentAuditLandingPageService } from './enrollment-audit-landing-page.service';

describe('EnrollmentAuditLandingPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentAuditLandingPageService = TestBed.get(EnrollmentAuditLandingPageService);
    expect(service).toBeTruthy();
  });
});
