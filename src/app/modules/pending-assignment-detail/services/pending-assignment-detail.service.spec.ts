import { TestBed } from '@angular/core/testing';

import { PendingAssignmentDetailService } from './pending-assignment-detail.service';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('PendingAssignmentDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: BaseHttpService, useClass: MockBaseHttpService},
    ]
  }));

  it('should be created', () => {
    const service: PendingAssignmentDetailService = TestBed.get(PendingAssignmentDetailService);
    expect(service).toBeTruthy();
  });
});
