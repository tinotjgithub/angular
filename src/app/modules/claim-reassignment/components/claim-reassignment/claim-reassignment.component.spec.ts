import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClaimReassignmentComponent } from "./claim-reassignment.component";
import { ClaimReassignmentService } from "../../service/claim-reassignment.service";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { MessageService, ConfirmationService, Confirmation } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { of, throwError } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";
import { MultiSelectModule } from "primeng/multiselect";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { exec } from "child_process";

describe("ClaimReassignmentComponent", () => {
  let component: ClaimReassignmentComponent;
  let fixture: ComponentFixture<ClaimReassignmentComponent>;
  let service;
  let messageService;
  let confirmationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimReassignmentComponent],
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
          {
            path: "ClaimRouting",
            component: ClaimReassignmentComponent
          }
        ]),
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        NgbModule,
        DialogModule,
        TooltipModule,
        ConfirmDialogModule,
        DropdownModule,
        HttpClientTestingModule,
        AutoCompleteModule,
        MultiSelectModule,
        ComponentsModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ClaimReassignmentComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ClaimReassignmentService);
    messageService = fixture.debugElement.injector.get(NotifierService);
    confirmationService = fixture.debugElement.injector.get(
      ConfirmationService
    );
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("getAssignToStatus", () => {
    component.initiallizeAssignFromForm();
    component.initiallizeAssignToForm();
    component.assignToForm.patchValue({
      role: { value: 1, label: "Manager" }
    });
    component.assignFromForm.patchValue({
      role: { value: 1, label: "Manager" }
    });
    const spy = spyOn(service, "getAssignFromStatus").and.returnValue(
      of(["Pended", "Routed"])
    );
    component.claimStatusCount = [
      { count: 10, status: "Pended" },
      { count: 14, status: "Routed" }
    ];
    component.getAssignToStatus();
    expect(component.assinToStatus).toEqual([
      { label: "Pended", value: "Pended", disabled: false },
      { label: "Routed", value: "Routed", disabled: false }
    ]);
    component.claimStatusCount = [
      { count: 0, status: "Pended" },
      { count: 0, status: "Routed" }
    ];
    component.getAssignToStatus();
    expect(component.assinToStatus).toBeDefined();
    component.claimStatusCount = undefined;
    component.getAssignToStatus();
    expect(component.assinToStatus).toEqual([
      { label: "Pended", value: "Pended", disabled: false },
      { label: "Routed", value: "Routed", disabled: false }
    ]);

    component.claimStatusCount = [
      { count: 10, status: "Pended" },
      { count: 14, status: "Routed" }
    ];
    component.getAssignToStatus();
    const serviceConf = fixture.debugElement.injector.get(ConfirmationService);
    const confirmSpy = spyOn(serviceConf, "confirm");

    component.getAssignToStatus();
    expect(confirmSpy).toHaveBeenCalled();

    component.assignToForm.patchValue({
      role: { value: 1, label: "Claims Lead" }
    });
    component.assignFromForm.patchValue({
      role: { value: 1, label: "Claims Lead" }
    });
    component.getAssignToStatus();
    expect(confirmSpy).toHaveBeenCalled();
    component.assignToForm.patchValue({
      role: { value: 1, label: "Claims Examiner" }
    });
    component.assignFromForm.patchValue({
      role: { value: 1, label: "Claims Lead" }
    });
    component.getAssignToStatus();
    expect(component.disableStatus).toBeFalsy();
  });

  const data = [
    {
      slNo: 1,
      claimId: "2019060500000168",
      claimStatus: "ROUTED",
      claimType: null,
      receiptDate: "2019-11-11",
      age: 0,
      memberName: "Johnny Blaze",
      providerName: "Physician Billing Services",
      billedAmount: 49166.09,
      queueName: "Q1",
      wfmStatus: "Pended",
      wfmAge: 0,
      taskAssignmentId: 1,
      pendedId: 1,
      routedId: 1
    }
  ];
  it("listClaims", () => {
    const spy = spyOn(service, "listClaims").and.returnValue(of(data));
    const spy1 = spyOn(messageService, "throwNotification");
    component.initiallizeAssignFromForm();
    component.assignFromForm.patchValue({
      status: [{ value: "Pended", label: "Pended" }],
      userName: { value: 5, label: "Manju Varghese" },
      userGroup: [{ value: 5, label: "UG" }]
    });
    component.assignToForm.patchValue({
      status: [{ value: "Pended", label: "Pended" }]
    });
    component.listClaims();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      claimStatus: ["Pended"],
      assignFromDto: Object({ value: 5, label: "Manju Varghese" }),
      assignToDto: "",
      userGroups: [Object({ value: 5, label: "UG" })]
    });
    expect(component.gridData).toEqual(data);
    expect(component.listedCount).toBe(1);
    expect(spy1).toHaveBeenCalled();
    spy.and.returnValue(throwError(null));
    component.listClaims();
    expect(component.showSpinner).toBeFalsy();
  });

  it("initiallizeAssignFromForm", () => {
    component.initiallizeAssignFromForm();
    expect(component.assignFromForm).toBeDefined();
  });

  it("initiallizeAssignToForm", () => {
    component.initiallizeAssignToForm();
    expect(component.assignToForm).toBeDefined();
  });

  // {"originalEvent":{"isTrusted":true},"value":3}
  const users = [
    {
      value: 15,
      label: "Robert Downey"
    },
    {
      value: 5,
      label: "Manju Varghese"
    }
  ];
  const roles = [
    {
      value: 3,
      label: "Claims Lead"
    },
    {
      value: 4,
      label: "Claims Examiner"
    }
  ];
  it("assignFromRoleSelected", () => {
    const spy = spyOn(service, "getAssignFromUsersList").and.returnValue(
      of(users)
    );
    spyOn(service, "getFromRoles").and.returnValue(of(roles));
    component.getFromRoles();
    component.assignFromRoleSelected({
      originalEvent: { isTrusted: true },
      value: 3
    });
    expect(spy).toHaveBeenCalled();
    expect(component.userNamesAssignFrom).toEqual(users);
  });

  it("getRoles", () => {
    const spy = spyOn(service, "getToRoles").and.returnValue(of(roles));
    component.getToRoles({ label: "", value: "" });
    expect(spy).toHaveBeenCalled();
    expect(component.toRoles).toEqual(roles);
  });

  const reasons = {
    reassignmentReasonDtos: [
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Missing configuration",
        status: true
      },
      {
        reassignmentReasonCode: 2,
        reassignmentReason: "Missing Info",
        status: true
      }
    ]
  };
  const reason = [
    { value: 1, label: "Missing configuration" },
    { value: 2, label: "Missing Info" }
  ];
  it("getReasignmentReasons", () => {
    const spy = spyOn(service, "getReassignmentReasonList").and.returnValue(
      of(reasons)
    );
    component.getReasignmentReasons();
    expect(spy).toHaveBeenCalled();
    expect(component.getReassignmentReasonSource).toEqual(reason);
  });

  it("mapReassignmentReasons", () => {
    component.mapReassignmentReasons(reasons.reassignmentReasonDtos);
    expect(component.getReassignmentReasonSource).toEqual(reason);
    component.mapReassignmentReasons(undefined);
    expect(component.getReassignmentReasonSource).toEqual([]);
  });

  it("getReasonFromCode", () => {
    component.getReassignmentReasonSource = [
      { value: 1, label: "Missing configuration" },
      { value: 2, label: "Missing Info" }
    ];
    expect(component.getReasonFromCode(2)).toEqual([
      {
        label: "Missing Info",
        value: 2
      }
    ]);
  });

  it("reAssign", () => {
    const confirmationSpy = spyOn(confirmationService, "confirm");
    const spy2 = confirmationSpy.and.callFake((confirm: Confirmation) =>
      confirm.accept()
    );
    const throwNotificationSpy = spyOn(messageService, "throwNotification");
    component.selectedValues = [];
    component.reAssign();
    expect(spy2).not.toHaveBeenCalled();
    expect(throwNotificationSpy).toHaveBeenCalled();
  });

  it("setCols", () => {
    component.setCols();
    expect(component.cols).toBeDefined();
  });

  it("searchAssignFromUserName", () => {
    spyOn(service, "getAssignFromUsersList").and.returnValue(of(users));
    spyOn(service, "getFromRoles").and.returnValue(of(roles));
    component.getFromRoles();
    component.assignFromRoleSelected({
      originalEvent: { isTrusted: true },
      value: 3
    });
    component.userNamesAssignFrom = users;
    component.searchAssignFromUserName({
      originalEvent: { isTrusted: true },
      query: "m"
    });
    expect(component.filtereduserNamesAssignFrom).toEqual([
      { value: 5, label: "Manju Varghese" }
    ]);
  });

  it("searchAssignToUserName", () => {
    spyOn(service, "getAssignFromUsersList").and.returnValue(of(users));
    spyOn(service, "getToRoles").and.returnValue(of(roles));
    component.initiallizeAssignFromForm();
    component.initiallizeAssignToForm();
    component.assignFromForm.patchValue({
      role: { value: "5", label: "Claims Examiner" }
    });
    component.assignToForm.patchValue({
      role: { value: "5", label: "Claims Examiner" }
    });
    component.getToRoles({ value: "", label: "" });
    component.assignToRoleSelected();
    component.userNamesAssignTo = users;
    component.searchAssignToUserName({
      originalEvent: { isTrusted: true },
      query: "m"
    });
    expect(component.filteredUserNamesAssignTo).toEqual([
      { value: 5, label: "Manju Varghese" }
    ]);
  });

  it("assignToRoleSelected", () => {
    component.initiallizeAssignFromForm();
    component.initiallizeAssignToForm();
    component.assignToExaminerFromLeadlogin = true;

    component.assignToForm.patchValue({
      role: { value: 1, label: "Claims Lead" }
    });
    component.assignFromForm.patchValue({
      role: { value: 1, label: "Manager" }
    });
    component.assignToRoleSelected();
    expect(component.assignToExaminerFromLeadlogin).toBeFalsy();
    component.assignToForm.patchValue({
      role: { value: 1, label: "Claims Lead" }
    });
    component.assignFromForm.patchValue({
      role: { value: 1, label: "Claims Examiner" }
    });
    component.assignToRoleSelected();
    expect(component.assignToExaminerFromLeadlogin).toBeFalsy();
    component.assignToForm.patchValue({
      role: { value: 1, label: "Claims Examiner" }
    });
    component.assignFromForm.patchValue({
      role: { value: 1, label: "Manager" }
    });
    const confService = fixture.debugElement.injector.get(ConfirmationService);
    const spy = spyOn(confService, "confirm");

    component.assignToRoleSelected();
    expect(spy).toHaveBeenCalled();
    spy.and.callFake((confirm: Confirmation) => confirm.reject());
    component.assignToRoleSelected();
    expect(component.assignToForm.get("role").value).toBeNull();

    const auth = fixture.debugElement.injector.get(AuthenticationService);
    auth.roleId = "Claims Lead";
    component.assignFromForm.patchValue({
      role: { value: 1, label: "Claims Lead" }
    });
    component.assignToForm.patchValue({
      role: { value: 1, label: "Claims Examiner" }
    });
    const spysetMyUserNameAsLead = spyOn(component, "setMyUserNameAsLead");
    spy.and.callFake((confirm: Confirmation) => confirm.accept());
    component.assignToRoleSelected();
    expect(spysetMyUserNameAsLead).toHaveBeenCalled();
  });

  it("getFormControl", () => {
    component.initiallizeAssignFromForm();
    expect(component.getFormControl("role")).toBeDefined();
  });

  it("getAssignToFormControl", () => {
    component.initiallizeAssignFromForm();
    expect(component.getAssignToFormControl("role")).toBeDefined();
  });

  // it("refresh", () => {
  //   component.initiallizeAssignFromForm();
  //   component.initiallizeAssignToForm();
  //   component.assignFromForm.patchValue({
  //     userName: { value: 5, label: "Manju Varghese" },
  //     status: [{ value: "Pended", label: "Pended" }]
  //   });
  //   component.assignToForm.patchValue({
  //     userName: { value: 5, label: "Manju Varghese" }
  //   });
  //   spyOn(service, "refreshClaims").and.returnValue(of(data));
  //   component.refresh();
  //   expect(component.refreshLength).toBeGreaterThan(0);
  //   expect(component.gridData).toEqual(data);
  // });

  it("reAssign", () => {
    component.initiallizeAssignFromForm();
    component.initiallizeAssignToForm();
    component.assignToForm.patchValue({
      role: 3,
      userName: { value: 15, label: "Robert Downey" },
      status: "Pended"
    });
    component.assignToForm.patchValue({
      role: 3,
      userName: { value: 15, label: "To Robert Downey" },
      reassignReason: 1,
      reassignComments: "dsdf"
    });
    const spy = spyOn(service, "reAssignClaims").and.returnValue(of(true));
    component.getReassignmentReasonSource = [
      { value: 1, label: "Missing configuration" },
      { value: 2, label: "Missing Info" }
    ];
    component.reAssignClaims();
    expect(spy).toHaveBeenCalled();
    expect(component.userNamesAssignTo).toEqual([]);
    expect(component.refreshLength).toEqual(0);
    expect(component.listedCount).toEqual(0);
  });

  it("setMyUserNameAsLead", () => {
    const auth = fixture.debugElement.injector.get(AuthenticationService);
    auth.userId = "12";
    auth.userName = "Me";
    const userName = { label: "Me", value: "12" };
    const spy = spyOn(component, "loadUserGroups");
    component.initiallizeAssignFromForm();
    component.initiallizeAssignToForm();
    component.setMyUserNameAsLead();
    expect(component.assignFromForm.get("userName").value).toEqual(userName);
    expect(component.assignToExaminerFromLeadlogin).toBeTruthy();
    expect(spy).toHaveBeenCalledWith({ value: userName });
  });

  it("loadUserGroups", () => {
    const spy = spyOn(service, "loadUserGroups").and.returnValue(
      of([{ value: "1", label: "UG" }])
    );
    const value = { value: "1", label: "User" };
    const spy1 = spyOn(component, "loadClaimStatusCount");
    component.loadUserGroups({ value });
    expect(spy).toHaveBeenCalled();
    expect(component.userGroups).toEqual([{ value: "1", label: "UG" }]);
    expect(spy1).toHaveBeenCalled();
  });
});
