import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthenticationService } from "../../services/authentication.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MessageService, ConfirmationService, Confirmation } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError, Subject } from "rxjs";
import { roles } from "src/app/mocks/mock-data";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

class MockAuthService extends AuthenticationService {
  getUserRoles() {
    const rolesArray: any[] = roles.roles;
    this.userRoles.next(rolesArray);
  }

  logout(reset?) {
    this.clearSessions();
  }
}

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
          { path: "ActiveUserSnapshot", component: LoginComponent }
        ]),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        ConfirmDialogModule,
        DialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        { provide: AuthenticationService, useClass: MockAuthService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        ConfirmationService,
        UserManagementService
      ]
    }).compileComponents();
  }));

  describe("Already logged In", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      service = fixture.debugElement.injector.get(AuthenticationService);
      spyOn(service, "checkIsAuthenticated").and.returnValue(true);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should set authenticated as true", () => {
      expect(service.isAuthenticated).toBe(true);
    });

    it("should get skill set", () => {
      const authService: AuthenticationService = fixture.debugElement.injector.get(
        AuthenticationService
      );
      spyOn(authService, "getUserRolesListner").and.returnValue(of([]));
      component.getSkillSet();
      expect(component.roleList).toEqual([]);
    });

    it("password match validator", () => {
      component.form.reset();
      expect(component.passwordMatch(component.form)).toBeNull();
      component.form.patchValue({
        newPassword: "Test",
        confirmPassword: "Test"
      });
      expect(component.passwordMatch(component.form)).toBeNull();
    });

    it("getter & functions", () => {
      component.toggleReset();
      component.form.patchValue({
        username: "Test"
      });
      const password = component.password.value;
      const roleSelected = component.roleSelected.value;
      const userName = component.username.value;
      expect(userName).toEqual("Test");
    });
  });

  describe("Not logged In", () => {
    let service;
    let userManagementService;
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      service = fixture.debugElement.injector.get(AuthenticationService);
      userManagementService = fixture.debugElement.injector.get(
        UserManagementService
      );
      spyOn(service, "checkIsAuthenticated").and.returnValue(false);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should display message on logout", () => {
      const sub = new Subject();
      service.authUpdated = sub;
      component.ngOnInit();
      sub.next({
        isAuthenticated: false,
        resetSuccess: false
      });
      expect(component).toBeTruthy();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("Reset Form created", () => {
      expect(component.resetFrom).toBeDefined();
    });

    it("Invalid login form", () => {
      expect(component.form.invalid).toBe(true);
    });

    it("Confirm password validation check", () => {
      const form = component.resetFrom;
      form.patchValue({
        newPassword: "Ksk@12345",
        confirmPassword: "Ksk@1234567"
      });
      expect(form.hasError("passwordMatch")).toBe(true);
      form.patchValue({
        newPassword: "Ksk@12345",
        confirmPassword: "Ksk@12345"
      });
      expect(form.hasError("passwordMatch")).toBe(false);
    });

    it("Incorrect Password", () => {
      spyOn(service, "login").and.returnValue(
        throwError({ status: 401, error: { message: "Incorrect Password" } })
      );
      const form = component.form;
      form.patchValue({
        username: "test@12.com",
        password: "Ksk@12345",
        roleSelected: "Administrator"
      });
      try {
        component.onSubmit();
      } catch (error) {
        console.error(error);
      }
      expect(component.loginFailed).toBeTruthy();
      expect(component.errorMessage).toBe("Incorrect Password");
    });

    it("Error No Message", () => {
      spyOn(service, "login").and.returnValue(throwError({ status: 401 }));
      const form = component.form;
      form.patchValue({
        username: "test@12.com",
        password: "Ksk@12345",
        roleSelected: "Administrator"
      });
      try {
        component.onSubmit();
      } catch (error) {
        console.error(error);
      }
      expect(component.loginFailed).toBeTruthy();
    });

    it("User Already Logged in", () => {
      spyOn(service, "login").and.returnValue(
        throwError({
          status: 417,
          error: { message: "User already logged in." }
        })
      );
      const form = component.form;
      form.patchValue({
        username: "test@12.com",
        password: "Ksk@12345",
        roleSelected: "Administrator"
      });
      try {
        component.onSubmit();
      } catch (error) {
        console.error(error);
      }
      expect(component.loginFailed).toBeTruthy();
      expect(component.errorMessage).toBe("User already logged in.");
    });

    it("User Already Logged in - No Message", () => {
      const authService: AuthenticationService = fixture.debugElement.injector.get(
        AuthenticationService
      );
      const confirmService: ConfirmationService = fixture.debugElement.injector.get(
        ConfirmationService
      );
      spyOn(service, "login").and.returnValue(
        throwError({ status: 417, error: { message: "" } })
      );
      spyOn(authService, "forceLogout").and.callFake(payload =>
        console.log(payload)
      );
      spyOn(confirmService, "confirm").and.callFake((confirm: Confirmation) =>
        confirm.accept()
      );
      const form = component.form;
      form.patchValue({
        username: "test@12.com",
        password: "Ksk@12345",
        roleSelected: "Administrator"
      });
      try {
        component.onSubmit();
      } catch (error) {
        console.error(error);
      }
      expect(component.loginFailed).toBeTruthy();
    });

    it("Sucessful Login", () => {
      spyOn(service, "login").and.returnValue(
        of({ jwttoken: "asdhufueufjkbk2132ulu" })
      );
      const form = component.form;
      form.patchValue({
        username: "test@12.com",
        password: "Ksk@12345",
        roleSelected: "Administrator"
      });
      component.onSubmit();
      expect(service.isAuthenticated).toBeTruthy();
    });

    it("Reset on first login", () => {
      spyOn(service, "login").and.returnValue(
        of({ jwttoken: "asdhufueufjkbk2132ulu", passwordReset: true })
      );
      const form = component.form;
      form.patchValue({
        username: "test@12.com",
        password: "Ksk@12345",
        roleSelected: "Administrator"
      });
      component.onSubmit();
      expect(component.isReset).toBeTruthy();
    });

    it("Reset Fail", () => {
      component.isReset = true;
      spyOn(userManagementService, "resetPassword").and.returnValue(
        throwError({ status: 400 })
      );
      try {
        component.onResetSubmit();
      } catch (error) {
        console.error(error);
      }
      expect(component.resetFailed).toBeTruthy();
    });

    it("Reset fail with messase", () => {
      spyOn(userManagementService, "resetPassword").and.returnValue(
        throwError({ status: 400, error: { message: "Invalid User" } })
      );
      try {
        component.onResetSubmit();
      } catch (error) {
        console.error(error);
      }
      expect(component.resetFailed).toBeTruthy();
    });

    it("Reset Success", () => {
      component.isReset = true;
      spyOn(userManagementService, "resetPassword").and.returnValue(of(true));
      // spyOn(service, 'logout').and.callFake(() => console.log('fake logout'));
      component.onResetSubmit();
      expect(component.resetSuccess).toBeTruthy();
    });
  });
});
