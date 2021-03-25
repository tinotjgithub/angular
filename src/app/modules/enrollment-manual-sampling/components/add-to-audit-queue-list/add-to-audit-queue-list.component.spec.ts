import { async, ComponentFixture, TestBed } from "@angular/core/testing";
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
import { NotifierService } from "src/app/services/notifier.service";
import { of } from "rxjs";
import { EnrollmentManualSamplingService } from "../../services/enrollment-manual-sampling.service";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AddToAuditQueueListComponent } from "./add-to-audit-queue-list.component";
import { RadioButtonModule } from 'primeng/radiobutton';

describe("AddToAuditQueueListComponent", () => {
  let component: AddToAuditQueueListComponent;
  let fixture: ComponentFixture<AddToAuditQueueListComponent>;
  let service;
  let notifierSpy;
  let notifierService;
  let confirmService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddToAuditQueueListComponent],
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
        RadioButtonModule,
        ConfirmDialogModule,
        ComponentsModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToAuditQueueListComponent);
    service = fixture.debugElement.injector.get(EnrollmentManualSamplingService);
    notifierService = fixture.debugElement.injector.get(NotifierService);
    component = fixture.componentInstance;
    notifierSpy = spyOn(notifierService, "throwNotification");
    confirmService = fixture.debugElement.injector.get(ConfirmationService);
    service.auditerQueueList = payload;
    fixture.detectChanges();
    component.showSpinner = false;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  const auditors = [
    {
      id: 8,
      name: "Mohammad Fazil"
    },
    {
      id: 93,
      name: "Manisha Swami"
    },
    {
      id: 107,
      name: "Brian Blaze"
    },
    {
      id: 118,
      name: "George Floyd"
    },
    {
      id: 115,
      name: "Dory Wilson"
    },
    {
      id: 123,
      name: "Test_Audi Aud"
    }
  ];

  it("getAuditorNames", () => {
    const spy = spyOn(service, "getAuditorNamesForRouteOut").and.returnValue(
      of(auditors)
    );
    component.getAuditorNames();
    expect(spy).toHaveBeenCalled();
    expect(component.auditorNames).toEqual(auditors);
  });
  const selectedValues = [
    {
      claimId: "20190403000013",
      claimType: "Institutional-IP",
      claimStatus: "Final",
      receiptDate: "04/03/2019",
      claimsAge: 467,
      providerId: "S00000626",
      providerName: "Supplier_UST5",
      memberGroupCode: "01141970",
      memberGroupName: "BB2 CarePlus Account",
      billedAmount: 15000,
      allowedAmount: 10500,
      paidAmount: 10500,
      processedDate: "05/08/2020 01:01",
      examinerName: "Abinaya Rajendran",
      claimQueueName: "hcc_super_user",
      claimFactKey: 40223,
      claimSource: "EDI",
      entryDate: "05/07/2020 06:09",
      reviewRepairReason:
        "Claim requires review payment total greater than $10,000.00",
      lineOfBusiness: null,
      planType: null,
      owner: "system",
      serviceDate: "03/01/2019",
      tinNumber: "99-9999999",
      paymentStatus: "Check Not Issued",
      processWorkflow: "Adjusted Claims",
      diagnosisCodes: ["074.3"],
      procedureCodes: [],
      memberId: "503007565",
      memberName: "Shuck, Herbert",
      auditSamplingCriteriaId: 28,
      userGroups: [
        {
          groupId: 19,
          groupName: "Hcc_Super_User"
        }
      ]
    }
  ];

  it("assign", () => {
    component.selectedValues = selectedValues;
    service.auditerQueueList = payload;
    component.auditor = { auidtorId: "id", auditotName: "name" };
    spyOn(confirmService, "confirm").and.callFake((confirm: Confirmation) =>
      confirm.accept()
    );
    const spy = spyOn(component, "assignClaimsToAuditor");
    component.assign();
    expect(spy).toHaveBeenCalled();
  });

  const auditor = {
    id: 107,
    name: "Brian Blaze"
  };
  it("assignClaimsToAuditor", () => {
    service.auditerQueueList = payload;
    const spy = spyOn(service, "assignClaimsToAuditor").and.returnValue(
      of(true)
    );
    component.auditor = auditor;
    component.selectedValues = selectedValues;
    component.assignClaimsToAuditor();
    expect(spy).toHaveBeenCalled();
    expect(notifierSpy).toHaveBeenCalled();
  });

  const payload = [
    {
      claimId: "20190403000013",
      claimType: "Institutional-IP",
      claimStatus: "Final",
      receiptDate: "04/03/2019",
      claimsAge: 467,
      providerId: "S00000626",
      providerName: "Supplier_UST5",
      memberGroupCode: "01141970",
      memberGroupName: "BB2 CarePlus Account",
      billedAmount: 15000,
      allowedAmount: 10500,
      paidAmount: 10500,
      processedDate: "05/08/2020 01:01",
      examinerName: "Abinaya Rajendran",
      claimQueueName: "hcc_super_user",
      claimFactKey: 40223,
      claimSource: "EDI",
      entryDate: "05/07/2020 06:09",
      reviewRepairReason:
        "Claim requires review payment total greater than $10,000.00",
      lineOfBusiness: null,
      planType: null,
      owner: "system",
      serviceDate: "03/01/2019",
      tinNumber: "99-9999999",
      paymentStatus: "Check Not Issued",
      processWorkflow: "Adjusted Claims",
      diagnosisCodes: ["074.3"],
      procedureCodes: [],
      memberId: "503007565",
      memberName: "Shuck, Herbert",
      auditSamplingCriteriaId: 28,
      userGroups: [
        {
          groupId: 19,
          groupName: "Hcc_Super_User"
        }
      ]
    },
    {
      claimId: "20190327000001",
      claimType: "Professional",
      claimStatus: "Final",
      receiptDate: "03/27/2019",
      claimsAge: 474,
      providerId: "S35150",
      providerName: "Test Community Care",
      memberGroupCode: "TEST123",
      memberGroupName: "PDryden_test",
      billedAmount: 100,
      allowedAmount: 50,
      paidAmount: 50,
      processedDate: "02/16/2020 20:11",
      examinerName: null,
      claimQueueName: "hcc_super_user",
      claimFactKey: 36006,
      claimSource: "EDI",
      entryDate: "02/14/2020 13:27",
      reviewRepairReason: null,
      lineOfBusiness: null,
      planType: null,
      owner: "system",
      serviceDate: "02/11/2019",
      tinNumber: "38-3533998",
      paymentStatus: "Check Issued",
      processWorkflow: "Manually Adjudicated",
      diagnosisCodes: ["074.3"],
      procedureCodes: [],
      memberId: "Pat_1",
      memberName: "Dryden, Pat",
      auditSamplingCriteriaId: 28,
      userGroups: [
        {
          groupId: 18,
          groupName: "Hcc_Super_User"
        }
      ]
    },
    {
      claimId: "XXX",
      claimType: "Professional",
      claimStatus: "Denied",
      receiptDate: "05/01/2019",
      claimsAge: 439,
      providerId: "S000000102",
      providerName: "Presbyterian Dbabb",
      memberGroupCode: "HEM0001",
      memberGroupName: "Humana Edge MA",
      billedAmount: 5000,
      allowedAmount: 0,
      paidAmount: 0,
      processedDate: "03/23/2020 11:54",
      examinerName: null,
      claimQueueName: "hcc_super_user",
      claimFactKey: 38042,
      claimSource: "Paper",
      entryDate: "01/28/2020 00:42",
      reviewRepairReason: null,
      lineOfBusiness: null,
      planType: null,
      owner: "U60075",
      serviceDate: "04/10/2019",
      tinNumber: "12-2085561",
      paymentStatus: "Check Not Issued",
      processWorkflow: "Manually Adjudicated",
      diagnosisCodes: ["074.3", "074.5"],
      procedureCodes: [],
      memberId: "200000437-01",
      memberName: "Abrego, Iliana",
      auditSamplingCriteriaId: 28,
      userGroups: [
        {
          groupId: 25,
          groupName: "Hcc_Super_User"
        },
        {
          groupId: 19,
          groupName: "WB_Test_Group_1"
        }
      ]
    }
  ];

  it("removeAssignedClaimsAndReturnAuidtQueue", () => {
    component.selectedValues = selectedValues;
    service.auditerQueueList = payload;
    spyOn(service, "removeAssignedClaimsAndReturnAuidtQueue").and.returnValue(
      payload.filter(e => e.claimId !== selectedValues[0].claimId)
    );
    component.removeAssignedClaimsFromGrid(selectedValues);
    expect(component.gridData).toEqual(
      payload.filter(e => e.claimId !== selectedValues[0].claimId)
    );
  });

  it("initializePageAfterAssign", () => {
    component.initializePageAfterAssign();
    expect(component.selectedValues).toEqual([]);
    expect(component.assignedQueueCount).toEqual(0);
    expect(component.showAlert).toEqual(false);
    expect(component.auditor).toEqual("");
  });

  it("change", () => {
    const event = { value: auditor };
    const spy = spyOn(component, "getAssociatedUserGroupsOfAuditor");
    component.change(event);
    expect(component.auditor).toEqual(auditor);
    expect(spy).toHaveBeenCalled();
  });

  it("getAssociatedUserGroupsOfAuditor", () => {
    const associatedusergrps = {
      associatedUserGroupDetails: [
        {
          groupId: 19,
          groupName: "Hcc_Super_User"
        }
      ],
      auditQueueCountDetails: 25
    };
    spyOn(service, "getAssociatedUserGroupsOfAuditor").and.returnValue(
      of(associatedusergrps)
    );
    const spy = spyOn(component, "filterDownClaimGrid");
    service.auditerQueueList = payload;
    component.getAssociatedUserGroupsOfAuditor(10);
    expect(component.associatedUserGroups).toEqual([19]);
    expect(component.assignedQueueCount).toEqual(25);
    expect(spy).toHaveBeenCalled();
  });

  it("getAssociatedUserGroupsOfAuditor with 0 Usergrps", () => {
    spyOn(service, "getAssociatedUserGroupsOfAuditor").and.returnValue(
      of({ associatedUserGroupDetails: [], auditQueueCountDetails: 0 })
    );
    component.getAssociatedUserGroupsOfAuditor(10);
    expect(component.associatedUserGroups).toEqual([]);
    expect(component.assignedQueueCount).toEqual(0);
  });

  const filteredGrid = [
    {
      claimId: "20190403000013",
      claimType: "Institutional-IP",
      claimStatus: "Final",
      receiptDate: "04/03/2019",
      claimsAge: 467,
      providerId: "S00000626",
      providerName: "Supplier_UST5",
      memberGroupCode: "01141970",
      memberGroupName: "BB2 CarePlus Account",
      billedAmount: 15000,
      allowedAmount: 10500,
      paidAmount: 10500,
      processedDate: "05/08/2020 01:01",
      examinerName: "Abinaya Rajendran",
      claimQueueName: "hcc_super_user",
      claimFactKey: 40223,
      claimSource: "EDI",
      entryDate: "05/07/2020 06:09",
      reviewRepairReason:
        "Claim requires review payment total greater than $10,000.00",
      lineOfBusiness: null,
      planType: null,
      owner: "system",
      serviceDate: "03/01/2019",
      tinNumber: "99-9999999",
      paymentStatus: "Check Not Issued",
      processWorkflow: "Adjusted Claims",
      diagnosisCodes: ["074.3"],
      procedureCodes: [],
      memberId: "503007565",
      memberName: "Shuck, Herbert",
      auditSamplingCriteriaId: 28,
      userGroups: [{ groupId: 19, groupName: "Hcc_Super_User" }]
    },
    {
      claimId: "XXX",
      claimType: "Professional",
      claimStatus: "Denied",
      receiptDate: "05/01/2019",
      claimsAge: 439,
      providerId: "S000000102",
      providerName: "Presbyterian Dbabb",
      memberGroupCode: "HEM0001",
      memberGroupName: "Humana Edge MA",
      billedAmount: 5000,
      allowedAmount: 0,
      paidAmount: 0,
      processedDate: "03/23/2020 11:54",
      examinerName: null,
      claimQueueName: "hcc_super_user",
      claimFactKey: 38042,
      claimSource: "Paper",
      entryDate: "01/28/2020 00:42",
      reviewRepairReason: null,
      lineOfBusiness: null,
      planType: null,
      owner: "U60075",
      serviceDate: "04/10/2019",
      tinNumber: "12-2085561",
      paymentStatus: "Check Not Issued",
      processWorkflow: "Manually Adjudicated",
      diagnosisCodes: ["074.3", "074.5"],
      procedureCodes: [],
      memberId: "200000437-01",
      memberName: "Abrego, Iliana",
      auditSamplingCriteriaId: 28,
      userGroups: [
        { groupId: 25, groupName: "Hcc_Super_User" },
        { groupId: 19, groupName: "WB_Test_Group_1" }
      ]
    }
  ];
  it("filterDownClaimGrid", () => {
    component.associatedUserGroups = [19];
    (service as any).auditerQueueList = payload;
    component.filterDownClaimGrid(component.associatedUserGroups);
    expect(component.gridData).toEqual(filteredGrid);
  });

  it("setGridData", () => {
    component.setGridData(filteredGrid);
    expect(filteredGrid).toEqual(component.gridData);
  });

  it("getAssociatedUserGroups", () => {
    const userGrps = [
      {
        groupId: 25,
        groupName: "Hcc_Super_User"
      },
      {
        groupId: 19,
        groupName: "WB_Test_Group_1"
      }
    ];
    const array = component.getAssociatedUserGroups(userGrps);
    expect(array).toEqual([25, 19]);
  });

  it("loadAuditerQueueList", () => {
    spyOn(service, 'loadAuditerQueueList').and.returnValue(of([]));
    spyOn(service, 'setAuditorQueueList');
    spyOn(component, 'getAuditorNames');
    component.ngOnInit();
    component.assign();
    expect(component.gridData).toEqual([]);
  });
});
