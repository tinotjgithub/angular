import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HeaderComponent } from "./header.component";
import { CommonModule } from "@angular/common";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MessageService, ConfirmationService, Confirmation } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { HeaderService } from "src/app/services/header/header.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { BnNgIdleService } from "bn-ng-idle";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { DialogModule } from "primeng/dialog";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ReportService } from 'src/app/services/report/report.service';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

class MockAuthenticationService extends AuthenticationService {
  logout() {
    this.clearSessions();
  }
}

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let confirmService: ConfirmationService;
  let headerService: HeaderService;
  let authService: AuthenticationService;
  let localStorage: CryptoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, ChangePasswordComponent],
      imports: [
        CommonModule,
        OverlayPanelModule,
        RouterTestingModule,
        HttpClientTestingModule,
        DialogModule,
        ConfirmDialogModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        HeaderService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        ConfirmationService,
        BnNgIdleService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    headerService = fixture.debugElement.injector.get(HeaderService);
    confirmService = fixture.debugElement.injector.get(ConfirmationService);
    authService = fixture.debugElement.injector.get(AuthenticationService);
    localStorage = fixture.debugElement.injector.get(CryptoService);
    router = fixture.debugElement.injector.get(Router);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should subscribe to claimdetails changes", () => {
    const claim = {
      claimId: "123",
      claimFactKey: 1,
      taskId: 1,
      claimReceivedDate: null,
      age: 12,
      status: "",
      queueName: "",
      endTimer: "",
      pendReason: "",
      routeReason: "",
      firstPendDate: null,
      lastPendDate: null,
      comments: ""
    };
    headerService.updateClaimDetails(claim);
    expect(component.claimDetails.taskId).toEqual(1);
  });

  it("should not allow to logout when claim is loaded", () => {
    authService.isAuthenticated = true;
    component.claimDetails = {
      claimId: "123",
      claimFactKey: 1,
      taskId: 1,
      claimReceivedDate: null,
      age: 12,
      status: "",
      queueName: "",
      endTimer: "",
      pendReason: "",
      routeReason: "",
      firstPendDate: null,
      lastPendDate: null,
      comments: ""
    };
    component.logout();
    expect(authService.isAuthenticated).toBeTruthy();
  });

  it("should allow to logout when claim is not loaded", () => {
    spyOn(confirmService, "confirm").and.callFake(
      (confirmation: Confirmation) => {
        return confirmation.accept();
      }
    );
    authService.isAuthenticated = true;
    component.logout();
    expect(authService.isAuthenticated).toBeFalsy();
  });

  it("should navigate according to role", () => {
    const navigationSpy = spyOn<any>(router, "navigateByUrl").and.returnValue(
      true
    );
    localStorage.setItem("roleId", "Administrator");
    component.navigateToRoleBasedHome();
    expect(navigationSpy).toHaveBeenCalledWith("ActiveUserSnapshot");
    localStorage.setItem("roleId", "Claims Examiner");
    component.navigateToRoleBasedHome();
    expect(navigationSpy).toHaveBeenCalledWith("ClaimsExaminerQueue");
    localStorage.setItem("roleId", "Claims Auditor");
    component.navigateToRoleBasedHome();
    expect(navigationSpy).toHaveBeenCalledWith("auditor-home");
    localStorage.setItem("roleId", "Manager");
    component.navigateToRoleBasedHome();
    expect(navigationSpy).toHaveBeenCalledWith("manager-home");
    localStorage.setItem("roleId", "Claims Lead");
    component.navigateToRoleBasedHome();
    expect(navigationSpy).toHaveBeenCalledWith("lead-home");
    localStorage.setItem("roleId", "Approver");
    component.navigateToRoleBasedHome();
    expect(navigationSpy).toHaveBeenCalledWith("ClaimsExaminerQueue");
    localStorage.setItem("roleId", "Update Checklist");
    component.navigateToRoleBasedHome();
    expect(navigationSpy).toHaveBeenCalledWith("Dashboard");
    localStorage.clear();
    component.navigateToRoleBasedHome();
    expect(navigationSpy).toHaveBeenCalledWith("");
  });

  it("should subscribe to idle timer", () => {
    authService.isAuthenticated = true;
    const idleService = fixture.debugElement.injector.get(BnNgIdleService);
    spyOn(idleService, "startWatching").and.returnValue(of(false));
    component.ngOnInit();
    expect(authService.isAuthenticated).toBeTruthy();
  });

  it("should logout when user is idle for a particular time", () => {
    authService.isAuthenticated = true;
    const idleService = fixture.debugElement.injector.get(BnNgIdleService);
    spyOn(idleService, "startWatching").and.returnValue(of(true));
    component.ngOnInit();
    expect(authService.isAuthenticated).toBeFalsy();
  });

  it("should open side menu bar", () => {
    component.menuOpen();
    expect(headerService.openSideMenu).toBeTruthy();
  });

  it("should not allow to logout when audit claim is loaded", () => {
    headerService.$auditClaimDetails = of({
      claimId: 1234
    });
    component.ngOnInit();
    authService.isAuthenticated = true;
    component.logout();
    expect(authService.isAuthenticated).toBeTruthy();
    headerService.$auditClaimDetails = of({
      claimId: 1234,
      auditFlowId: 12
    });
    component.ngOnInit();
    authService.isAuthenticated = true;
    component.logout();
    expect(authService.isAuthenticated).toBeTruthy();
  });

  it("should get breadcrumb", () => {
    localStorage.setItem("roleId", "Manager");
    component.ngOnInit();
    localStorage.clear();
    TestBed.get(Router).events.next(new NavigationEnd(42, "/", "/"));
    const route = {
      children: [],
      snapshot: {
        url: [
          {
            path: "/"
          },
          { path: "test" }
        ],
        data: {
          breadcrumb: [{ label: "tst", url: "/" }]
        }
      }
    };
    component.createBreadcrumbs(
      {
        children: [
          route,
          {
            children: [],
            snapshot: {
              url: [{ path: "" }],
              data: {
                breadcrumb: null
              }
            }
          }
        ]
      },
      "/",
      []
    );
    expect(component.items).toBeTruthy();
  });

  it('createBreadcrumbs', () => {
    const route = {
      children: [
        {
          children: [],
          snapshot: {
            url: [
              {
                path: ''
              }
            ],
            data: {
              breadcrumb: null
            }
          }
        }
      ]
    };
    component.createBreadcrumbs(route);
    expect(component).toBeTruthy();
  });
  it("should download file in excel format", () => {
    const reportService = fixture.debugElement.injector.get(ReportService);
    spyOn<any>(reportService, 'downloadAttachment').and.returnValue(of({body: 'test'}));
    const spyObj = document.createElement("a");
    const blob = new Blob(['test'], {
      type:
        "application/zip"
    });
    const url = URL.createObjectURL(blob);
    spyObj.setAttribute("href", url);
    spyObj.setAttribute("download", "HRP-Connector.zip");
    document.body.appendChild(spyObj);
    spyOn(document, "createElement").and.returnValue(spyObj);
    const syy = spyOn(spyObj, "click");
    fixture.detectChanges();
    component.downloadConnector();
    // tslint:disable-next-line: deprecation
    expect(document.createElement).toHaveBeenCalledTimes(1);
    // tslint:disable-next-line: deprecation
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(syy).toHaveBeenCalled();
    spyOnProperty(window, 'navigator').and.returnValue( {
      msSaveBlob: (bl: any, name) => console.log(bl, name),
      msSaveOrOpenBlob: true
    });
    component.downloadConnector();
  });

  it("should not download file", () => {
    const reportService = fixture.debugElement.injector.get(ReportService);
    spyOn<any>(reportService, 'downloadAttachment').and.returnValue(throwError({status: 404}));
    component.downloadConnector();
    expect(component.fileLoading).toBeFalsy();
  });

  it("should not download file when download is undefined", () => {
    const spyObj = document.createElement("u");
    document.body.appendChild(spyObj);
    const syy = spyOn(spyObj, "click");
    spyOn(document, "createElement").and.returnValue(spyObj);
    const reportService = fixture.debugElement.injector.get(ReportService);
    spyOn<any>(reportService, 'downloadAttachment').and.returnValue(of({body: 'test'}));
    fixture.detectChanges();
    component.downloadConnector();
    expect(syy).not.toHaveBeenCalled();
  });
});
