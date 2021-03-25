import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditRouteOutComponent } from "./audit-route-out.component";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { PickListModule } from "primeng/picklist";
import { ChipsModule } from "primeng/chips";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TooltipModule } from "primeng/tooltip";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { MessageService, ConfirmationService, Confirmation } from "primeng/api";
import { AuditClaimRoutingService } from "../../services/audit-claim-routing.service";
import { NotifierService } from "src/app/services/notifier.service";
import { of } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("AuditRouteOutComponent", () => {
  let component: AuditRouteOutComponent;
  let fixture: ComponentFixture<AuditRouteOutComponent>;
  let service;
  let notifierSpy;
  let notifierService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditRouteOutComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        HttpClientTestingModule,
        PickListModule,
        ChipsModule,
        CalendarModule,
        CheckboxModule,
        BrowserAnimationsModule,
        TooltipModule,
        DropdownModule,
        ConfirmDialogModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AuditRouteOutComponent);
    service = fixture.debugElement.injector.get(AuditClaimRoutingService);
    notifierService = fixture.debugElement.injector.get(NotifierService);
    notifierSpy = spyOn(notifierService, "throwNotification");
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRouteOutComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditClaimRoutingService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    spyOn(service, "getAuditRoutedInClaim").and.returnValue(of(payload));
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(
      ActivatedRoute
    );
    activatedRoute.queryParams = of({
      auditTaskId: '12345'
    });
    component.ngOnInit();
    component.processClaim('');
    expect(component).toBeTruthy();
  });

  it("initiateForm", () => {
    component.initiateForm();
    expect(component.auditForm).toBeDefined();
  });
  const payload = {
    auditTaskId: 14,
    claimId: "20190722001261",
    claimType: "Institutional (OP)",
    claimStatus: "Denied",
    receiptDate: "05/17/2020",
    claimsAge: 30,
    providerName: "Test Supplier1",
    memberGroupName: "Greenville",
    billedAmount: 500,
    allowedAmount: 0,
    paidAmount: 0,
    processedDate: "05/17/2020 07:15",

    examinerName: "Devika Kumari",
    fromAuditorName: "Brian Blaze",
    fromUserGroup: "hcc_super_user",
    fromRouteComments: "invalid",
    fromRouteReason: "invalid",
    toAuditorNames: [
      {
        id: 19,
        auditorName: "Devika"
      },
      {
        id: 1,
        auditorName: "Devi"
      },
      {
        id: 2,
        auditorName: "Blaze"
      }
    ],
    toRouteReason: [
      {
        routeReasonCode: 19,
        routeReason: "Already Routed Claim"
      },
      {
        routeReasonCode: 1,
        routeReason: "Incorrect Assignment"
      },
      {
        routeReasonCode: 2,
        routeReason: "Approval Required"
      }
    ]
  };

  it("getClaim", () => {
    expect(component.claimDetails).toBeUndefined();
    spyOn(service, "getAuditRoutedInClaim").and.returnValue(of(payload));
    const spy = spyOn(component, "processClaim");
    component.initiateForm();
    component.getClaim();
    expect(spy).toHaveBeenCalled();
  });

  it("processClaim", () => {
    component.processClaim(payload);
    expect(component.claimDetails).toEqual([payload]);
    expect(component.claim).toEqual(payload);
  });

  it("setFormValues", () => {
    component.initiateForm();
    component.setFormValues(payload);
    expect(component.auditForm.get("claimId").value).toEqual(payload.claimId);
    expect(component.toRouteReasonList).toEqual(payload.toRouteReason);
    expect(component.auditTaskId).toEqual(payload.auditTaskId);
  });

  it("should just copy", () => {
    const input = document.createElement("input");
    input.value = "test";
    component.justCopy(input);
    expect(component).toBeTruthy();
  });

  it("should not just copy", () => {
    component.claim = undefined;
    const input = document.createElement("input");
    input.value = "test";
    const spy = spyOn(component, "copyToClipBoard");
    fixture.detectChanges();
    component.justCopy(input);
    expect(spy).not.toHaveBeenCalled();
  });

  it("should call call service on copy", () => {
    component.claim = { claimId: "121242343" };
    const input = document.createElement("input");
    input.value = "test";
    const spy = spyOn(component, "copyToClipBoard");
    fixture.detectChanges();
    component.justCopy(input);
    expect(spy).toHaveBeenCalled();
  });

  it("Route claim", () => {
    const confirmService: ConfirmationService = fixture.debugElement.injector.get(
      ConfirmationService
    );
    spyOn(confirmService, "confirm").and.callFake((confirm: Confirmation) =>
      confirm.accept()
    );
    spyOn(service, "routeAuditRoutedInClaim").and.returnValue(of(true));
    component.initiateForm();
    component.auditForm.patchValue({
      auditTaskId: 1,
      toRouteReason: { routeReasonCode: "Test Reason" },
      toRouteComments: "Comments",
      toAuditorName: { id: "Tino" }
    });
    const spy = spyOn(component, "clearForm");
    component.routeClaim();
    expect(notifierSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it("construct Param", () => {
    component.initiateForm();
    component.auditForm.patchValue({
      auditTaskId: 1,
      toRouteReason: { routeReasonCode: "Test Reason" },
      toRouteComments: "Comments",
      toAuditorName: { id: "Tino" }
    });
    const param = component.constructParam();
    expect(param).toEqual({
      auditTaskId: 1,
      routeReasonCode: "Test Reason",
      routeComments: "Comments",
      routeUserId: "Tino"
    });
  });

  it("clear Form", () => {
    component.claimDetails = [payload];
    const spy = spyOn(service, "cancelAuditTaskId").and.returnValue(of(true));
    const spy2 = spyOn(component, "clearForm");
    component.cancel();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("clearForm", () => {
    component.claim = payload;
    component.claimDetails = [payload];
    component.auditTaskId = 10;
    component.clearForm();
    expect(component.claimDetails).toEqual([]);
    expect(component.claim).toEqual({});
    expect(component.auditTaskId).toEqual(null);
  });

  it("openClaimInHRP", () => {
    spyOn(service, "callHealthEdge").and.returnValue(of({ status: "Failure" }));
    const input = document.createElement("input");
    input.value = "test";
    component.copyToClipBoard(input);
    expect(component).toBeTruthy();
  });

  it("openClaimInHRP should not call service when id is present", () => {
    component.claim = { claimId: "1222323" };
    const spy = spyOn(service, "callHealthEdge").and.returnValue(
      of({ status: "Failure" })
    );
    const input = document.createElement("input");
    input.value = "test";
    fixture.detectChanges();
    component.copyToClipBoard(input);
    expect(spy).not.toHaveBeenCalled();
  });

  it("confirm cancel", () => {
    const confirmService: ConfirmationService = fixture.debugElement.injector.get(
      ConfirmationService
    );
    spyOn(confirmService, "confirm").and.callFake((confirm: Confirmation) =>
      confirm.accept()
    );
    const spy = spyOn(component, "cancel");
    component.confirm();
    expect(spy).toHaveBeenCalled();
  });

  it('Open HRP', () => {
    const spi = spyOn(component, 'copyToClipBoard').and.callFake(() => console.log('Inside'));
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(taskService, 'callHealthEdge').and.returnValue(of(true));
    const input = document.createElement("input");
    input.value = "test";
    component.openClaimInHRP(input);
    component.claim = {};
    component.openClaimInHRP(input);
    component.claim = {claimId: 12323};
    component.openClaimInHRP(input);
    expect(spi).toHaveBeenCalled();
  });

  it('Open HRP - Failure', () => {
    const spi = spyOn(component, 'copyToClipBoard').and.callFake(() => console.log('Inside'));
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(taskService, 'callHealthEdge').and.returnValue(of({status: 'Failure'}));
    const input = document.createElement("input");
    input.value = "test";
    component.claim = {claimId: 12323};
    component.openClaimInHRP(input);
    expect(spi).toHaveBeenCalled();
  });
});
