import { TestBed } from '@angular/core/testing';

import { EnrollmentAuditorService } from './enrollment-auditor.service';

describe('EnrollmentAuditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentAuditorService = TestBed.get(EnrollmentAuditorService);
    expect(service).toBeTruthy();
  });
});
