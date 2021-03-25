import { TestBed } from '@angular/core/testing';

import { FalloutReconAssignmentService } from './fallout-recon-assignment.service';

describe('FalloutReconAssignmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FalloutReconAssignmentService = TestBed.get(FalloutReconAssignmentService);
    expect(service).toBeTruthy();
  });
});
