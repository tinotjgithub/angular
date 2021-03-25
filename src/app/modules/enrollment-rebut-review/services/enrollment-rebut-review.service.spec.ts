import { TestBed } from '@angular/core/testing';

import { EnrollmentRebutReviewService } from './enrollment-rebut-review.service';

describe('EnrollmentRebutReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentRebutReviewService = TestBed.get(EnrollmentRebutReviewService);
    expect(service).toBeTruthy();
  });
});
