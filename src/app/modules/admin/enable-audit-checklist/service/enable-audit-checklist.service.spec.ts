import { TestBed } from '@angular/core/testing';

import { EnableAuditChecklistService } from './enable-audit-checklist.service';

describe('EnableAuditChecklistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnableAuditChecklistService = TestBed.get(EnableAuditChecklistService);
    expect(service).toBeTruthy();
  });
});
