import { TestBed, inject, ComponentFixture } from "@angular/core/testing";

import { NavigationGuard } from "./navigation.guard";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "primeng/api";
import { ManualSamplingService } from "src/app/modules/auditor/manual-sampling/services/manual-sampling.service";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";

class MockRouter {
  navigateByUrl(url: string) {
    return url;
  }
}

describe("Route.GuardService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        { provide: Router, useClass: MockRouter },
        NavigationGuard,
        MessageService,
        ManualSamplingService
      ]
    })
  );

  it("should be created", () => {
    localStorage.setItem("authToken", "Test");
    const service: NavigationGuard = TestBed.get(NavigationGuard);
    localStorage.clear();
    expect(service).toBeTruthy();
  });

  it("should can activate on authenticated", () => {
    const service: NavigationGuard = TestBed.get(NavigationGuard);
    const manualSamplingService: ManualSamplingService = TestBed.get(
      ManualSamplingService
    );
    spyOn(manualSamplingService, "navigationEnabled").and.returnValue(true);
    const isActivated = service.canActivate(null, null);
    expect(isActivated).toBeTruthy();
  });

  it("should navigate when not authenticated", () => {
    const service: NavigationGuard = TestBed.get(NavigationGuard);
    const manualSamplingService: ManualSamplingService = TestBed.get(
      ManualSamplingService
    );
    manualSamplingService.navigationEnabled = false;
    (service as any).samplingService = manualSamplingService;
    service.canActivate(null, null);
    expect(service).toBeTruthy();
  });
});
