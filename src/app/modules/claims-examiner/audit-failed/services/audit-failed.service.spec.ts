import { TestBed } from "@angular/core/testing";

import { AuditFailedService } from "./audit-failed.service";
import { BaseHttpService } from 'src/app/services/base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { ManualSamplingService } from 'src/app/modules/auditor/manual-sampling/services/manual-sampling.service';

describe("AuditFailedService", () => {
  let service: AuditFailedService;
  let http: BaseHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [BaseHttpService]
    });
    service = TestBed.get(ManualSamplingService);
    http = TestBed.get(BaseHttpService);
    spyOn<any>(http, "get").and.returnValue(true);
    spyOn<any>(http, "post").and.returnValue(true);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
