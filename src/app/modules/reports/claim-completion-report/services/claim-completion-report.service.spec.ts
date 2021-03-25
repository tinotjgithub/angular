import { TestBed } from '@angular/core/testing';

import { ClaimCompletionReportService } from './claim-completion-report.service';

describe('ClaimCompletionReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaimCompletionReportService = TestBed.get(ClaimCompletionReportService);
    expect(service).toBeTruthy();
  });
});
