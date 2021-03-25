import { TestBed } from '@angular/core/testing';

import { EnrollmentManagementService } from './enrollment-management.service';

describe('EnrollmentManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentManagementService = TestBed.get(EnrollmentManagementService);
    expect(service).toBeTruthy();
  });
});
