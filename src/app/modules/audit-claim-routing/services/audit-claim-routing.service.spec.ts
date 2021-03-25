import { TestBed } from "@angular/core/testing";

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseHttpService } from "./../../../services/base-http.service";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { AuditClaimRoutingService } from "./audit-claim-routing.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("AuditClaimRoutingService", () => {
  let http: BaseHttpService;
  let service: AuditClaimRoutingService;
  let authService: AuthenticationService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        AuditClaimRoutingService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        AuthenticationService
      ]
    })
  );
  describe("", () => {
    beforeEach(() => {
      http = TestBed.get(BaseHttpService);
      service = TestBed.get(AuditClaimRoutingService);
      authService = TestBed.get(AuthenticationService);
      spyOn<any>(service, "get").and.returnValue(of(true));
      spyOn<any>(service, "post").and.returnValue(of(true));
    });

    it("should create", () => {
      expect(service).toBeTruthy();
    });

    it("should get routed in list", () => {
      expect(service.getRoutedInList()).toBeTruthy();
    });
    it("should get audit routed in list when user role is manager", () => {
      authService.roleId = "Manager";
      expect(service.getAuditRoutedInClaim(0)).toBeTruthy();
    });
    it("should get audit routed in list when user role is Lead", () => {
      authService.roleId = "Claims Lead";
      expect(service.getAuditRoutedInClaim(0)).toBeTruthy();
    });
    it("should get audit routed in list when user role is manager - TaskID", () => {
      authService.roleId = "Manager";
      expect(service.getAuditRoutedInClaim(1)).toBeTruthy();
    });
    it("should get audit routed in list when user role is Lead - TaskID", () => {
      authService.roleId = "Claims Lead";
      expect(service.getAuditRoutedInClaim(1)).toBeTruthy();
    });
    it("should get audit routed in claims", () => {
      expect(service.routeAuditRoutedInClaim("test")).toBeTruthy();
    });
    it("should cancel audit task id", () => {
      expect(service.cancelAuditTaskId("test")).toBeTruthy();
    });
  });
  describe("", () => {
    beforeEach(() => {
      http = TestBed.get(BaseHttpService);
      service = TestBed.get(AuditClaimRoutingService);
    });
    it("should get manager lead routed in reasons", () => {
      spyOn<any>(service, "get").and.returnValue(of([]));
      let value = [];
      service
        .getManagerLeadRouteReasonsListner()
        .subscribe(val => (value = val));
      service.getManagerLeadRouteReasons();
      expect(value).toEqual([]);
    });

    it("should get routed in list", () => {
      spyOn<any>(service, "get").and.returnValue(of([]));
      let value = [];
      service.routedInClaimListListener().subscribe(val => (value = val));
      service.getRoutedInList();
      expect(value).toEqual([]);
    });
  });
});
