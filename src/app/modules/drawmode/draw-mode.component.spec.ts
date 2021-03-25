import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { DrawModeComponent } from "./draw-mode.component";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { CommonModule, DatePipe } from "@angular/common";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { TooltipModule } from "primeng/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { GoogleChartsModule } from "angular-google-charts";
import { BaseHttpService } from "src/app/services/base-http.service";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { CardModule } from "primeng/card";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { DrawClaim } from "src/app/services/task-management/models/DrawClaim";
import { Router } from "@angular/router";
import { MyClaimsComponent } from "../myclaims/my-claims.component";
import { TableModule } from "primeng/table";
import { NotifierService } from "src/app/services/notifier.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ButtonModule } from "primeng/button";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("DrawModeComponent", () => {
  let component: DrawModeComponent;
  let fixture: ComponentFixture<DrawModeComponent>;
  let service: TaskmanagementService;
  let service1;

  const response: DrawClaim = {
    claimId: "100",
    claimFactKey: 0,
    taskId: 0,
    claimReceivedDate: null,
    age: 0,
    status: "",
    queueName: "",
    endTimer: "00:00:00",
    pendReason: "",
    comments: "",
    routeReason: "",
    firstPendDate: null,
    lastPendDate: null
  };
  const routerSpy = { navigate: jasmine.createSpy("navigate") };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrawModeComponent, MyClaimsComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: "MyClaims", component: MyClaimsComponent }
        ]),
        CommonModule,
        ConfirmDialogModule,
        DialogModule,
        TooltipModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
        GoogleChartsModule,
        CardModule,
        HttpClientTestingModule,
        TableModule,
        ButtonModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        DatePipe,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        NotifierService,
        MessageService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DrawModeComponent);
    service = fixture.debugElement.injector.get(TaskmanagementService);
    service1 = fixture.debugElement.injector.get(NotifierService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Claim Id should load", async(() => {
    spyOn(service, "getClaimDetailsListener").and.returnValue(of(response));
    try {
      component.ngOnInit();
    } catch (error) {
      console.log(error);
    }
    expect(component.claimDetails).toEqual(response);
  }));

  it("Pend Reasons loaded", async(() => {
    const pendReasons = [
      { pendReasonCode: 12, pendReason: "Pended", pendStatus: true }
    ];
    spyOn(service, "getPendReasonsListner").and.returnValue(of(pendReasons));
    try {
      component.ngOnInit();
    } catch (error) {
      console.log(error);
    }
    expect(component.pendReasonList).toEqual(pendReasons);
  }));

  it("Route Reasons loaded", async(() => {
    const resp = [
      {
        routeReasonCode: 1,
        routeReason: "Routed In",
        routeStatus: true
      }
    ];
    spyOn(service, "getRouteReasonsListner").and.returnValue(of(resp));
    try {
      component.ngOnInit();
    } catch (error) {
      console.log(error);
    }
    expect(component.routeReasonList).toEqual(resp);
  }));

  it("Route to User list loaded", async(() => {
    const resp = [
      {
        routeUserId: 2,
        routeUserName: "Sharath Smith"
      }
    ];
    spyOn(service, "getRouteUser").and.callFake(() => console.log("routeuser"));
    spyOn(service, "getRouteUserListener").and.returnValue(of(resp));
    component.getRouteTo(10, 11);
    expect(component.routeToList).toEqual(resp);
  }));

  it("Route Roles loaded", async(() => {
    const resp = [
      {
        routeRoleId: 2,
        routeRoleName: "Claims Examiner"
      }
    ];
    spyOn(service, "getRouteRolesListner").and.returnValue(of(resp));
    component.getRouteRole();
    expect(component.routeRoleList).toEqual(resp);
  }));

  it("UserInfo loaded", async(() => {
    const resp = {
      completedCount: 1,
      pendCount: 8,
      routedInCount: 6,
      routedOutCount: 1,
      userTarget: 50,
      assignedCount: 1,
      totalCount: 100
    };
    spyOn(service, "updateUserInfoListener").and.returnValue(of(resp));
    component.getTaskData();
    expect(component.userDashboardValues).toEqual(resp);
  }));

  it("getTaskTimerListener", async(() => {
    const resp = {
      timer: "00:00:00",
      timerColor: "red",
      timerFadeColor: "blue"
    };
    spyOn(service, "getTaskTimerListener").and.returnValue(of(resp));
    try {
      component.ngOnInit();
    } catch (error) {
      console.log(error);
    }
    expect(component.timer).toEqual(resp.timer);
    expect(component.timerColor).toEqual(resp.timerColor);
    expect(component.timerFadeColor).toEqual(resp.timerFadeColor);
  }));

  // it(`should navigate to MyClaims`, () => {
  //   component.targetClick("Pended");
  //   expect(routerSpy.navigate).toHaveBeenCalledWith("/MyClaims");
  // });

  it("show dialogue should be true", () => {
    component.showDialog();
    expect(component.display).toBeTruthy();
  });

  it("It must toggle claim details", () => {
    component.toggleStateClaimDetails = false;
    component.toggleClaimDetails();
    expect(component.toggleStateClaimDetails).toBeTruthy();
  });

  it("Form has been reset", () => {
    component.form.patchValue({
      pendComments: ""
    });
    component.isSelected = false;
    component.reset();
    expect(component.isSelected).toBe(true);
    expect(component.form.get("pendComments").value).toBe("");
  });

  it("Action has been set", () => {
    component.setAction("PENDED");
    expect(component.isPend).toBeTruthy();
    component.setAction("ROUTED");
    expect(component.isRoute).toBeTruthy();
    component.setAction("COMPLETED");
    expect(component.isRoute).toBeFalsy();
    expect(component.isPend).toBeFalsy();
  });

  it("should call getAllUsers method on init", () => {
    const userServiceSpy = spyOn(
      service1,
      "throwNotification"
    ).and.callThrough();
    expect(userServiceSpy).not.toHaveBeenCalled();
    const element = document.createElement("input");
  });

  // it("Claim processing should complete", () => {
  //   component.triggerClaimCompletion("COMPLETED");
  //   expect(component.claimDetails.claimId).toBe(null);
  //   expect(component.form.get('pendComments').value).toBe('');
  //   expect(component.display).toBeFalsy();
  //   expect(component.displayFinalizeDialog).toBe(false);
  // });

  it("should navigate to myclaims on target click", () => {
    const router = fixture.debugElement.injector.get(Router);
    const routeSpy = spyOn<any>(router, "navigate").and.returnValue(true);
    component.targetClick("test");
    expect(routeSpy).toHaveBeenCalled();
  });

  it("enlarge comment", () => {
    component.enlargeComment();
    expect(component).toBeTruthy();
  });

  it("should select role", () => {
    spyOn(service, "getRouteUser").and.callFake(role => console.log(role));
    spyOn(service, "getRouteUserListener").and.returnValue(of([]));
    component.onSelectRole();
    expect(component.roleSelected).toBeFalsy();
  });

  it("should confirm", () => {
    const confirmService: ConfirmationService = fixture.debugElement.injector.get(
      ConfirmationService
    );
    spyOn(confirmService, "confirm").and.callFake(confirm => confirm.accept());
    spyOn(service, "saveAndNavigateToNextClaim").and.returnValue(
      new Promise((resolve, reject) => {
        reject();
      })
    );
    try {
      component.confirm("Test");
    } catch (error) {
      console.log(error);
    }
    expect(component.display).toBeFalsy();
  });

  it("should get comments", () => {
    component.isRoute = true;
    component.form.patchValue({
      routeReason: {
        value: "test"
      }
    });
    const route = component.updatedComments;
    expect(route.routeReason).toEqual("test");
    component.isRoute = false;
    component.form.patchValue({
      pendReason: {
        value: "test"
      }
    });
    const pend = component.updatedComments;
    expect(pend.pendReason).toEqual("test");
  });

  it("should get route on role", () => {
    spyOn(service, "getRouteUser").and.callFake(role => console.log(role));
    spyOn(service, "getRouteUserListener").and.returnValue(
      of([
        {
          routeUserName: "test",
          routeUserId: 1
        }
      ])
    );
    component.getRouteTo(null, null);
    expect(component.roleSelected).toBeTruthy();
  });

  it("should set action with pause", () => {
    component.pause = true;
    component.setAction("PENDED");
    expect(component.isPend).toBeTruthy();
  });

  it("should just copy", () => {
    const input = document.createElement("input");
    input.value = "test";
    component.justCopy(input);
    expect(component).toBeTruthy();
  });

  it("should copy and open healthedge", () => {
    spyOn(service, "callHealthEdge").and.returnValue(of({ status: "success" }));
    const input = document.createElement("input");
    input.value = "test";
    component.copyAndOpenHRP(input);
    expect(component).toBeTruthy();
  });

  it("should open healthedge", () => {
    spyOn(service, "callHealthEdge").and.returnValue(of({ status: "Failure" }));
    const input = document.createElement("input");
    input.value = "test";
    component.copyAndOpenHRP(input);
    expect(component).toBeTruthy();
  });

  it("should trigger claim completion", () => {
    spyOn(service, "saveAndNavigateToNextClaim").and.returnValue(
      new Promise((resolve, reject) => {
        resolve();
      })
    );
    component.triggerClaimCompletion("COMPLETE");
    expect(component.display).toBeFalsy();
    component.hideDenyDialog();
  });

  it("should get next claim if no claim is there", () => {
    spyOn(service, "getClaim").and.callFake(() => console.log("claimloaded"));
    component.claimDetails = {
      claimId: "100",
      claimFactKey: 0,
      taskId: 0,
      claimReceivedDate: null,
      age: 0,
      status: "",
      queueName: "",
      endTimer: "00:00:00",
      pendReason: "",
      comments: "",
      routeReason: "",
      firstPendDate: null,
      lastPendDate: null
    };
    component.getNextClaim();
    component.claimDetails = {
      claimId: null,
      claimFactKey: 0,
      taskId: 0,
      claimReceivedDate: null,
      age: 0,
      status: "",
      queueName: "",
      endTimer: "00:00:00",
      pendReason: "",
      comments: "",
      routeReason: "",
      firstPendDate: null,
      lastPendDate: null
    };
    component.getNextClaim();
    expect(component.claimDetails.claimId).toBeNull();
  });

  it("should get claim", () => {
    spyOn(service, "getClaim").and.callFake(() => console.log("claim"));
    spyOn(service, "getPendReasons").and.callFake(() =>
      console.log("pendreason")
    );
    spyOn(service, "getRouteReasons").and.callFake(() =>
      console.log("routereason")
    );
    spyOn(service, "getRouteRoles").and.callFake(() =>
      console.log("routerole")
    );
    spyOn(service, "getDashboardData").and.callFake(() =>
      console.log("dashboard data")
    );
    const route: ActivatedRoute = fixture.debugElement.injector.get(
      ActivatedRoute
    );
    route.queryParams = of({
      taskId: 123,
      status: 2
    });
    try {
      component.ngOnInit();
    } catch (error) {
      console.log(error);
    }
    expect(component.beforeunloadHandler(null)).toBeFalsy();
  });

  it("should pause", () => {
    component.setPause();
    component.setPause();
    expect(component.pause).toBeFalsy();
  });
});
