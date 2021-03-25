import { TestBed } from "@angular/core/testing";
import { AuthenticationService } from "./authentication.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { roles } from "src/app/mocks/mock-data";
import { of, throwError } from "rxjs";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
import { APP_INITIALIZER } from '@angular/core';

describe("AuthenticationService", () => {
  let service: AuthenticationService;
  let http: BaseHttpService;
  let router: Router;
  let navigateSpy;
  let localStorage: CryptoService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        BaseHttpService,
        MessageService
      ]
    });
    service = TestBed.get(AuthenticationService);
    http = TestBed.get(BaseHttpService);
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, "navigateByUrl");
    localStorage = TestBed.get(CryptoService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Get User Roles", () => {
    spyOn(http, "get").and.returnValue(of(roles));
    service.getUserRoles();
    service.getUserRolesListner();
    expect(service.roleResponse).toEqual(roles.roles);
  });

  it("Get User Roles Error", () => {
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    try {
      service.getUserRoles();
    } catch (error) {
      console.log(error);
    }
    expect(service.roleResponse).toEqual([]);
  });

  it("Login", () => {
    spyOn(http, "post").and.returnValue(of(true));
    let res;
    service.login(true).subscribe(val => (res = val));
    expect(res).toEqual(true);
  });

  it("Logout with reset", () => {
    spyOn(http, "get").and.returnValue(of(true));
    service.logout(true);
    expect(service.isAuthenticated).toBeFalsy();
  });

  it("Logout without reset", () => {
    spyOn(http, "get").and.returnValue(of(true));
    service.logout();
    expect(service.isAuthenticated).toBeFalsy();
  });

  it("forceLogout success", () => {
    spyOn(http, "post").and.returnValue(of(true));
    const loc = {
      reload: () => true
    };
    const locSpy = spyOn(loc, "reload");
    service.forceLogout(true, loc);
    expect(locSpy).toHaveBeenCalled();
  });

  it("forceLogout error", () => {
    spyOn(http, "post").and.returnValue(
      throwError({ status: 400, error: { message: "Failed" } })
    );
    try {
      service.forceLogout(true);
    } catch (error) {
      console.log(error);
    }
    expect(service).toBeTruthy();
  });

  it("forceLogout error without message", () => {
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    try {
      service.forceLogout(true);
    } catch (error) {
      console.log(error);
    }
    expect(service).toBeTruthy();
  });

  it("forceLogout error without message", () => {
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.forceLogout(true);
    expect(service).toBeTruthy();
  });

  it("Redirect after Login", () => {
    spyOn(http, "get").and.returnValue(
      of({
        id: 12,
        firstName: "Test",
        lastName: "Test"
      })
    );
    const payload = {
      success: true,
      roleId: "Claims Lead",
      authToken: "ysdgyeuroho"
    };
    service.setLogin(payload);
    expect(navigateSpy).toHaveBeenCalledWith("lead-home");
    payload.roleId = "Manager";
    service.setLogin(payload);
    expect(navigateSpy).toHaveBeenCalledWith("manager-home");
    payload.roleId = "Claims Examiner";
    service.setLogin(payload);
    expect(navigateSpy).toHaveBeenCalledWith("ClaimsExaminerQueue");
    payload.roleId = "Claims Auditor";
    service.setLogin(payload);
    expect(navigateSpy).toHaveBeenCalledWith("auditor-home");
    payload.roleId = "Approver";
    service.setLogin(payload);
    expect(navigateSpy).toHaveBeenCalledWith("ClaimsExaminerQueue");
    expect(navigateSpy).toHaveBeenCalledWith("auditor-home");
    payload.roleId = "Update Checklist";
    service.setLogin(payload);
    expect(navigateSpy).toHaveBeenCalledWith("Dashboard");
    payload.roleId = "Administrator";
    service.setLogin(payload);
    expect(navigateSpy).toHaveBeenCalledWith("ActiveUserSnapshot");
    payload.roleId = "";
    service.setLogin(payload);
    expect(navigateSpy).toHaveBeenCalledWith("");
  });

  it("isTokenExpired", () => {
    let date = "yweuy3@";
    localStorage.setItem("expiresIn", date);
    expect(service.isTokenExpired()).toBeTruthy();
    date = new Date().toISOString();
    localStorage.setItem("expiresIn", date);
    expect(service.isTokenExpired()).toBeTruthy();
  });

  it("checkIsAuthenticated", () => {
    localStorage.clear();
    expect(service.checkIsAuthenticated()).toBeFalsy();
    const crypto: CryptoService = TestBed.get(CryptoService);
    crypto.setItem('authToken', 'asdasdasfasf');
    crypto.setItem('roleId', 'asdasdasfasf');
    expect(service.checkIsAuthenticated()).toBeTruthy();
    crypto.clear();
  });

  it("Functions Coverage", () => {
    service.setWindowParam(true);
    expect(service.detachedWindow).toBeTruthy();
    service.authUpdatedListener();
    const role = service.userRole;
    const username = service.currentUser;
    const userId = service.currentUserId;
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    try {
      const payload = {
        success: true,
        roleId: "Claims Lead",
        authToken: "ysdgyeuroho"
      };
      service.setLogin(payload);
    } catch (error) {
      console.log(error);
    }
  });

  afterEach(() => {
    localStorage.clear();
  });
});
