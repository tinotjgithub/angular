import { TestBed } from '@angular/core/testing';

import { EnrollmentAuditReviewWorkflowService } from './enrollment-audit-review-workflow.service';

describe('EnrollmentAuditReviewWorkflowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentAuditReviewWorkflowService = TestBed.get(EnrollmentAuditReviewWorkflowService);
    expect(service).toBeTruthy();
  });
});
