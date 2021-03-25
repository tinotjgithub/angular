import { TestBed } from "@angular/core/testing";

import { ManualSamplingService } from "./manual-sampling.service";
import { BaseHttpService } from "src/app/services/base-http.service";
import { Router } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "primeng/api";

describe("ManualSamplingService", () => {
  let service: ManualSamplingService;
  let http: BaseHttpService;
  let router: Router;
  let navigateSpy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [BaseHttpService, MessageService]
    });
    service = TestBed.get(ManualSamplingService);
    http = TestBed.get(BaseHttpService);
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, "navigateByUrl");
    spyOn<any>(http, "get").and.returnValue(true);
    spyOn<any>(http, "post").and.returnValue(true);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("getSavedSettings", () => {
    expect(service.getSavedSettings()).toBeTruthy();
  });
  it("getAvailableilterSettings", () => {
    expect(service.getAvailableilterSettings()).toBeTruthy();
  });
  it("getAvailableClaimExaminers", () => {
    expect(service.getAvailableClaimExaminers(1)).toBeTruthy();
  });
  it("refreshClaimCount", () => {
    expect(service.refreshClaimCount(1)).toBeTruthy();
  });
  it("addToAuditQueue", () => {
    expect(service.addToAuditQueue(1)).toBeTruthy();
  });
  it("getAuditQueueCount", () => {
    expect(service.getAuditQueueCount()).toBeTruthy();
  });
  it("saveSamplingSettings", () => {
    expect(service.saveSamplingSettings(1)).toBeTruthy();
  });
  it("loadClaimStatistics", () => {
    expect(service.loadClaimStatistics(1)).toBeTruthy();
  });
});
