import { TestBed } from '@angular/core/testing';

import { EmrollmentLeadLandingPageService } from './emrollment-lead-landing-page.service';

describe('EmrollmentLeadLandingPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmrollmentLeadLandingPageService = TestBed.get(EmrollmentLeadLandingPageService);
    expect(service).toBeTruthy();
  });
});
