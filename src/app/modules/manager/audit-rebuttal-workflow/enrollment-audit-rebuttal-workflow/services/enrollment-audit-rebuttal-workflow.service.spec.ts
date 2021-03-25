import { TestBed } from '@angular/core/testing';

import { EnrollmentAuditRebuttalWorkflowService } from './enrollment-audit-rebuttal-workflow.service';

describe('EnrollmentAuditRebuttalWorkflowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentAuditRebuttalWorkflowService = TestBed.get(EnrollmentAuditRebuttalWorkflowService);
    expect(service).toBeTruthy();
  });
});
