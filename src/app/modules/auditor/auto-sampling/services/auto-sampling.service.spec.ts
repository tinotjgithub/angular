import { TestBed } from "@angular/core/testing";

import { AutoSamplingService } from "./auto-sampling.service";
import { BaseHttpService } from "src/app/services/base-http.service";
import { Router } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "primeng/api";

describe("AutoSamplingService", () => {
  let service: AutoSamplingService;
  let http: BaseHttpService;
  let router: Router;
  let navigateSpy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [BaseHttpService, MessageService]
    });
    service = TestBed.get(AutoSamplingService);
    http = TestBed.get(BaseHttpService);
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, "navigateByUrl");
    spyOn<any>(http, "get").and.returnValue(true);
    spyOn<any>(http, "post").and.returnValue(true);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getSaved", () => {
    expect(service.getSaved()).toBeTruthy();
  });

  it("getAvailablFilters", () => {
    expect(service.getAvailablFilters()).toBeTruthy();
  });

  it("saveSettings", () => {
    expect(service.saveSettings(1)).toBeTruthy();
  });
});
