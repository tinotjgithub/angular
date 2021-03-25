import { TestBed } from '@angular/core/testing';

import { ManagerEnrollmentLandingPageService } from './manager-enrollment-landing-page.service';

describe('ManagerEnrollmentLandingPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagerEnrollmentLandingPageService = TestBed.get(ManagerEnrollmentLandingPageService);
    expect(service).toBeTruthy();
  });
});
