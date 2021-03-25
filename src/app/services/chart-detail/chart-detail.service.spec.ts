import { TestBed } from '@angular/core/testing';

import { ChartDetailService } from './chart-detail.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaseHttpService } from '../base-http.service';

describe('ChartDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      BaseHttpService
    ]
  }));

  it('should be created', () => {
    const service: ChartDetailService = TestBed.get(ChartDetailService);
    expect(service).toBeTruthy();
  });
});
