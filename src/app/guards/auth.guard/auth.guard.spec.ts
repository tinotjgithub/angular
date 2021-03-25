import { TestBed, async, inject } from "@angular/core/testing";

import { AuthGuard } from "./auth.guard";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "primeng/api";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("AuthGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        AuthGuard,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        AuthenticationService,
        MessageService,
      ],
    });
  });

  it("should ...", inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it("should activate the route with expected Roles", inject(
    [AuthGuard, AuthenticationService],
    (guard: AuthGuard, service: AuthenticationService) => {
      const activateRoute = new ActivatedRouteSnapshot();
      activateRoute.data = {
        expectedRoles: ["Administrator"],
      };
      service.roleId = 'Administrator';
      expect(guard.canActivate(activateRoute, null)).toBeTruthy();
    }
  ));

  it("should activate the route with expected Roles and childroles", inject(
    [AuthGuard, AuthenticationService],
    (guard: AuthGuard, service: AuthenticationService) => {
      const activateRoute = new ActivatedRouteSnapshot();
      activateRoute.data = {
        expectedRoles: ["Administrator"],
        expectedChildRoles: ['Administrator']
      };
      service.roleId = 'Administrator';
      expect(guard.canActivate(activateRoute, null)).toBeTruthy();
    }
  ));

  it("should not activate the route with role other than expected Roles", inject(
    [AuthGuard, AuthenticationService],
    (guard: AuthGuard, service: AuthenticationService) => {
      const activateRoute = new ActivatedRouteSnapshot();
      activateRoute.data = {
        expectedRoles: ["Administrator"]
      };
      service.roleId = 'Claims Lead';
      expect(guard.canActivate(activateRoute, null)).toBeFalsy();
    }
  ));
});
