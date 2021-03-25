import {
  async,
  ComponentFixture,
  TestBed,
  ComponentFixtureNoNgZone
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { BaseHttpService } from "src/app/services/base-http.service";
import { of } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";
import { MessageService } from "primeng/api";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AutoSamplingComponent } from "./auto-sampling.component";
import { PickListModule } from "primeng/picklist";
import { ChipsModule } from "primeng/chips";
import { CalendarModule } from "primeng/calendar";
import { AccordionModule } from "primeng/accordion";
import { CheckboxModule } from "primeng/checkbox";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AutoSamplingService } from "../../services/auto-sampling.service";
import { Component } from "@angular/core";

describe("AutoSamplingComponent", () => {
  let component: AutoSamplingComponent;
  let fixture: ComponentFixture<AutoSamplingComponent>;
  let service;
  let notifierService;
  let notifierSpy;
  const data: any[] = [
    {
      groupId: 7,
      groupName: "Itemized_Bill_Team",
      leadId: 5,
      leadNmae: "Manju Varghese",
      managerId: 3,
      managerName: "Deepa John",
      target: 55,
      description: "Itemized Bill Work Group",
      userGroupType: {
        id: 1,
        name: "Claims"
      },
      queueName: {
        queuename: "Itemized Bill WB",
        queueId: 1
      }
    }
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutoSamplingComponent],
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
        AccordionModule,
        CheckboxModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AutoSamplingComponent);
    service = fixture.debugElement.injector.get(AutoSamplingService);
    notifierService = fixture.debugElement.injector.get(NotifierService);
    notifierSpy = spyOn(notifierService, "throwNotification");
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSamplingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("initializeForm", () => {
    component.initializeForm();
    expect(component.formGroup).toBeDefined();
  });

  it("AtLeastOneFieldValidator", () => {
    component.initializeForm();
    component.formGroup.get("claimSource").patchValue({
      EDI: 99.99,
      paper: 99.99
    });
    expect(
      component.AtLeastOneFieldValidator(
        component.formGroup.get("claimSource").value
      )
    ).toBeTruthy();
    component.formGroup.get("claimSource").patchValue({
      EDI: 99.99,
      paper: null
    });
    expect(
      component.AtLeastOneFieldValidator(
        component.formGroup.get("claimSource").value
      )
    ).toEqual({ required: true });
  });

  it("getAvailableFilters", () => {
    const spy = spyOn(service, "getAvailablFilters").and.returnValue(of(true));
    const spy1 = spyOn(component, "setAvilableFilters");
    const spy2 = spyOn(component, "getSavedSettings");

    component.getAvailableFilters();
    expect(component.availableFilters).toBeTruthy();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("getSavedSettings", () => {
    const payload = {
      userGroups: [{ id: 1, name: "QAudit 1" }],
      lineOfBusiness: [
        { id: 1, name: "DDD" },
        { id: 2, name: "Medicaid" }
      ],
      planTypes: [
        { id: 3, name: "HMO" },
        { id: 4, name: "PPO" }
      ],
      processWorkFlowExclusions: [
        "Auto Adjudicated",
        "Adjusted Claims",
        "Externally Priced"
      ],
      billedAmount: 10,
      paidAmount: 0,
      claimSources: [{ EDI: 100, Paper: 100 }],
      claimTypes: [
        {
          Professional: 1,
          "Institutional-IP": 2,
          "Institutional-OP": 3,
          Others: 4
        }
      ],
      paymentStatus: [
        { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 }
      ],
      totalSamplingClaimsPercentage: 78
    };
    const spy = spyOn(service, "getSaved").and.returnValue(of(payload));
    component.initializeForm();
    component.getSavedSettings();
    const form = {
      HDStatus: ["HD Only"],
      billedAmount: 10,
      paidAmount: 0,
      claimSources: [{ EDI: 100, Paper: 100 }],
      claimTypes: [
        {
          Professional: 1,
          "Institutional-IP": 2,
          "Institutional-OP": 3,
          Others: 4
        }
      ],
      lineOfBusiness: [
        { id: 1, name: "DDD" },
        { id: 2, name: "Medicaid" }
      ],
      availableLineOfBusiness: [],
      paymentStatus: [
        { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 }
      ],
      planTypes: [
        { id: 3, name: "HMO" },
        { id: 4, name: "PPO" }
      ],
      availablePlanTypes: [],
      processWorkFlowExclusions: [
        "Auto Adjudicated",
        "Adjusted Claims",
        "Externally Priced"
      ],
      userGroups: [{ id: 1, name: "QAudit 1" }],
      availableUserGroups: [],
      claimSource: { EDI: 100, paper: 100 },
      claimType: {
        Professional: 1,
        "Institutional-IP": 2,
        "Institutional-OP": 3,
        Others: 4
      },
      paymentstatus: { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 },
      totalSamplingClaimsPercentage: 78
    };
    expect(component.formGroup.value).toEqual(form);
    expect(component.HdChecked).toBeTruthy();
  });

  it("onChangeHD", () => {
    component.initializeForm();
    component.onChangeHD(true);
    expect(component.HdChecked).toBeTruthy();
    expect(component.formGroup.get("billedAmount").value).toBe(0);
    expect(component.formGroup.get("paidAmount").value).toBe(0);
  });

  it("setAvilableFilters", () => {
    const form = {
      HDStatus: ["HD Only"],
      billedAmount: 10,
      paidAmount: 0,
      claimSources: [{ EDI: 100, Paper: 100 }],
      claimTypes: [
        {
          Professional: 1,
          "Institutional-IP": 2,
          "Institutional-OP": 3,
          Others: 4
        }
      ],
      lineOfBusiness: [
        { id: 1, name: "DDD" },
        { id: 2, name: "Medicaid" }
      ],
      availableLineOfBusiness: [
        { id: 1, name: "DDD" },
        { id: 2, name: "Medicaid" },
        { id: 3, name: "Commercial" },
        { id: 4, name: "SSS" }
      ],
      paymentStatus: [
        { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 }
      ],
      planTypes: [
        { id: 3, name: "HMO" },
        { id: 4, name: "PPO" }
      ],
      availablePlanTypes: [
        { id: 1, name: "SSS" },
        { id: 2, name: "POS" },
        { id: 3, name: "HMO" },
        { id: 4, name: "PPO" }
      ],
      processWorkFlowExclusions: [
        "Auto Adjudicated",
        "Adjusted Claims",
        "Externally Priced"
      ],
      userGroups: [{ id: 1, name: "QAudit 1" }],
      availableUserGroups: [
        { id: 1, name: "QAudit 1" },
        { id: 2, name: "QAudit 2" }
      ],
      claimSource: { EDI: 100, paper: 100 },
      claimType: {
        Professional: 1,
        "Institutional-IP": 2,
        "Institutional-OP": 3,
        Others: 4
      },
      paymentstatus: { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 },
      totalSamplingClaimsPercentage: 78
    };
    const filters = {
      userGroup: [
        { id: 1, name: "QAudit 1" },
        { id: 2, name: "QAudit 2" }
      ],
      lineOfBusiness: [
        { id: 1, name: "DDD" },
        { id: 2, name: "Medicaid" },
        { id: 3, name: "Commercial" },
        { id: 4, name: "SSS" }
      ],
      planType: [
        { id: 1, name: "SSS" },
        { id: 2, name: "POS" },
        { id: 3, name: "HMO" },
        { id: 4, name: "PPO" }
      ]
    };
    const patched = {
      HDStatus: ["HD Only"],
      billedAmount: 10,
      paidAmount: 0,
      claimSources: [{ EDI: 100, Paper: 100 }],
      claimTypes: [
        {
          Professional: 1,
          "Institutional-IP": 2,
          "Institutional-OP": 3,
          Others: 4
        }
      ],
      lineOfBusiness: [
        { id: 1, name: "DDD" },
        { id: 2, name: "Medicaid" }
      ],
      availableLineOfBusiness: [
        { id: 3, name: "Commercial" },
        { id: 4, name: "SSS" }
      ],
      paymentStatus: [
        { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 }
      ],
      planTypes: [
        { id: 3, name: "HMO" },
        { id: 4, name: "PPO" }
      ],
      availablePlanTypes: [
        { id: 1, name: "SSS" },
        { id: 2, name: "POS" }
      ],
      processWorkFlowExclusions: [
        "Auto Adjudicated",
        "Adjusted Claims",
        "Externally Priced"
      ],
      userGroups: [{ id: 1, name: "QAudit 1" }],
      availableUserGroups: [{ id: 2, name: "QAudit 2" }],
      claimSource: { EDI: 100, paper: 100 },
      claimType: {
        Professional: 1,
        "Institutional-IP": 2,
        "Institutional-OP": 3,
        Others: 4
      },
      paymentstatus: { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 },
      totalSamplingClaimsPercentage: 78
    };

    component.initializeForm();
    component.formGroup.patchValue(form);
    component.availableFilters = filters;
    component.setAvilableFilters();
    expect(component.formGroup.value).toEqual(patched);
  });

  it("trunc", () => {
    expect(component.trunc(102)).toEqual(10);
  });

  it("getFormControl", () => {
    component.initializeForm();
    expect(component.getFormControl("paidAmount")).toEqual(
      component.formGroup.get("paidAmount")
    );
  });

  it("getFormControlClaimType", () => {
    component.initializeForm();
    expect(component.getFormControlClaimType("Professional")).toEqual(
      component.formGroup.get("claimType").get("Professional")
    );
  });

  it("getFormControlClaimType", () => {
    component.initializeForm();
    expect(component.getFormControlClaimType("Professional")).toEqual(
      component.formGroup.get("claimType").get("Professional")
    );
  });

  it("getFormControlPaymentStatus", () => {
    component.initializeForm();
    expect(component.getFormControlPaymentStatus("Denied")).toEqual(
      component.formGroup.get("paymentstatus").get("Denied")
    );
  });

  it("getFormControlClaimSource", () => {
    component.initializeForm();
    expect(component.getFormControlClaimSource("EDI")).toEqual(
      component.formGroup.get("claimSource").get("EDI")
    );
  });

  it("getFormValidationErrors for claimType, claimSource and billed amount", () => {
    component.initializeForm();
    component.HdChecked = true;
    component.formGroup.patchValue({ billedAmount: 0, paidAmount: 0 });
    fixture.detectChanges();
    component.getFormValidationErrors();
    expect(component.errorList.pop()).toEqual(
      "If HD is checked, either Billed amount or Paid amount or both should be a valid monetary value"
    );

    component.formGroup.patchValue({ billedAmount: 0, paidAmount: 10 });
    component.formGroup.get("claimSource").setErrors({ invalid: true });
    component.savedSettingsExist = false;
    fixture.detectChanges();
    component.getFormValidationErrors();
    expect(component.errorList.pop()).toEqual(
      "Atleast one value in Claim Source should be a valid non zero percentage value and no negative values are allowed"
    );

    component.formGroup.patchValue({
      billedAmount: 9,
      paidAmount: 10,
      claimSource: {
        EDI: [1],
        paper: [5]
      },
      paymentstatus: {
        Denied: [0],
        "Check Issued": [144],
        "Check Not Issued": []
      },
      claimType: {
        Professional: [1],
        "Institutional-IP": [],
        "Institutional-OP": [4],
        Others: [5]
      }
    });

    component.formGroup.patchValue({ billedAmount: 0, paidAmount: 10 });
    component.formGroup.get("claimType").setErrors({ invalid: true });
    component.savedSettingsExist = true;
    fixture.detectChanges();
    component.getFormValidationErrors();
    expect(component.errorList.pop()).toEqual(
      "Atleast one value in Claim Type should be a valid non zero percentage value and no negative values are allowed"
    );

    component.formGroup.patchValue({
      billedAmount: 9,
      paidAmount: 10,
      claimSource: {
        EDI: [1],
        paper: [5]
      },
      paymentstatus: {
        Denied: [0],
        "Check Issued": [144],
        "Check Not Issued": []
      },
      claimType: {
        Professional: [1],
        "Institutional-IP": [4],
        "Institutional-OP": [4],
        Others: [5]
      }
    });
    component.formGroup.get("paymentstatus").setErrors({ invalid: true });
    component.savedSettingsExist = true;
    fixture.detectChanges();
    component.getFormValidationErrors();
    expect(component.errorList.pop()).toEqual(
      "Atleast one value in Payment Status should be a valid non zero percentage value and no negative values are allowed"
    );
    component.formGroup.patchValue({ totalSamplingClaimsPercentage: 0 });
    component.formGroup.patchValue({ billedAmount: 0, paidAmount: 10 });
    component.formGroup.patchValue({
      billedAmount: 9,
      paidAmount: 10,
      claimSource: {
        EDI: [1],
        paper: [5]
      },
      paymentstatus: {
        Denied: [3],
        "Check Issued": [3],
        "Check Not Issued": [3]
      }
    });
    fixture.detectChanges();
    component.getFormValidationErrors();

    expect(component.errorList.pop()).toEqual(
      "Sampling percentage should not be zero, and must be a valid % value"
    );
  });

  it("saveSettings", () => {
    component.initializeForm();
    const spy = spyOn(component, "constructParam");
    const spy1 = spyOn(service, "saveSettings").and.returnValue(of(true));
    component.formGroup.patchValue({
      HDStatus: ["HD Only"],
      billedAmount: 10,
      paidAmount: 0,
      claimSources: [{ EDI: 100, Paper: 100 }],
      claimTypes: [
        {
          Professional: 1,
          "Institutional-IP": 2,
          "Institutional-OP": 3,
          Others: 4
        }
      ],
      lineOfBusiness: [
        { id: 1, name: "DDD" },
        { id: 2, name: "Medicaid" }
      ],
      availableLineOfBusiness: [
        { id: 3, name: "Commercial" },
        { id: 4, name: "SSS" }
      ],
      paymentStatus: [
        { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 }
      ],
      planTypes: [
        { id: 3, name: "HMO" },
        { id: 4, name: "PPO" }
      ],
      availablePlanTypes: [
        { id: 1, name: "SSS" },
        { id: 2, name: "POS" }
      ],
      processWorkFlowExclusions: [
        "Auto Adjudicated",
        "Adjusted Claims",
        "Externally Priced"
      ],
      userGroups: [{ id: 1, name: "QAudit 1" }],
      availableUserGroups: [{ id: 2, name: "QAudit 2" }],
      claimSource: { EDI: 100, paper: 100 },
      claimType: {
        Professional: 1,
        "Institutional-IP": 2,
        "Institutional-OP": 3,
        Others: 4
      },
      paymentstatus: { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 },
      totalSamplingClaimsPercentage: 78
    });
    component.saveSettings();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(notifierSpy).toHaveBeenCalled();

    component.formGroup.patchValue({
      totalSamplingClaimsPercentage: 0
    });
    component.saveSettings();
    expect(component.errorList.length).toBe(1);
  });

  it("nullOrUndefined", () => {
    expect(component.nullOrUndefined(null)).toBe(0);
    expect(component.nullOrUndefined(10)).toBe(10);
  });

  it("constructParam", () => {
    const form = {
      HDStatus: ["HD Only"],
      billedAmount: 10,
      paidAmount: 0,
      claimSources: [{ EDI: 100, Paper: 100 }],
      claimTypes: [
        {
          Professional: 1,
          "Institutional-IP": 2,
          "Institutional-OP": 3,
          Others: 4
        }
      ],
      lineOfBusiness: [
        { id: 1, name: "DDD" },
        { id: 2, name: "Medicaid" }
      ],
      availableLineOfBusiness: [
        { id: 3, name: "Commercial" },
        { id: 4, name: "SSS" }
      ],
      paymentStatus: [
        { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 }
      ],
      planTypes: [
        { id: 3, name: "HMO" },
        { id: 4, name: "PPO" }
      ],
      availablePlanTypes: [
        { id: 1, name: "SSS" },
        { id: 2, name: "POS" }
      ],
      processWorkFlowExclusions: [
        "Auto Adjudicated",
        "Adjusted Claims",
        "Externally Priced"
      ],
      userGroups: [{ id: 1, name: "QAudit 1" }],
      availableUserGroups: [{ id: 2, name: "QAudit 2" }],
      claimSource: { EDI: 100, paper: 100 },
      claimType: {
        Professional: 1,
        "Institutional-IP": 2,
        "Institutional-OP": 3,
        Others: 4
      },
      paymentstatus: { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 },
      totalSamplingClaimsPercentage: 78
    };
    const param = {
      processWorkFlowExclusions: [
        "Auto Adjudicated",
        "Adjusted Claims",
        "Externally Priced"
      ],
      selectedLobs: ["DDD", "Medicaid"],
      selectedPlanTypes: ["HMO", "PPO"],
      selectedUserGroupIds: [1],
      claimSources: [{ EDI: 100, Paper: 100 }],
      claimTypes: [
        {
          Professional: 1,
          "Institutional-IP": 2,
          "Institutional-OP": 3,
          Others: 4
        }
      ],
      paymentStatus: [
        { Denied: 11, "Check Issued": 22, "Check Not Issued": 33 }
      ],
      billedAmount: 10,
      paidAmount: 0,
      totalSamplingClaimsPercentage: 78
    };
    component.initializeForm();
    component.formGroup.patchValue(form);
    expect(component.constructParam()).toEqual(param);
  });

  it("setValidNumber for claim source", () => {
    component.formGroup.get("claimSource").patchValue(
      {
        EDI: 5000,
        paper: 5000
      },
      { emitEvent: false }
    );
    fixture.detectChanges();
    component.setValidNumber();
    expect(component.formGroup.get("claimSource").value.EDI).toEqual(500);
    expect(component.formGroup.get("claimSource").value.paper).toEqual(500);
    component.formGroup.get("claimSource").patchValue(
      {
        EDI: 50,
        paper: 50
      },
      { emitEvent: false }
    );
    fixture.detectChanges();
    component.setValidNumber();
    expect(component.formGroup.get("claimSource").value.EDI).toEqual(50);
    expect(component.formGroup.get("claimSource").value.paper).toEqual(50);
  });

  it("setValidateNumber for claimType", () => {
    component.formGroup.get("claimType").patchValue({
      Professional: 5000,
      "Institutional-IP": 5000,
      "Institutional-OP": 5000,
      Others: 5000
    });
    fixture.detectChanges();
    component.setValidNumber();
    expect(component.formGroup.get("claimType").value.Professional).toEqual(
      500
    );
    expect(
      component.formGroup.get("claimType").value["Institutional-IP"]
    ).toEqual(500);
    expect(
      component.formGroup.get("claimType").value["Institutional-OP"]
    ).toEqual(500);
    expect(component.formGroup.get("claimType").value.Others).toEqual(500);

    component.formGroup.get("claimType").patchValue(
      {
        Professional: 50,
        "Institutional-IP": 50,
        "Institutional-OP": 50,
        Others: 50
      },
      { emitEvent: false }
    );
    fixture.detectChanges();
    component.setValidNumber();
    expect(component.formGroup.get("claimType").value.Professional).toEqual(50);
    expect(
      component.formGroup.get("claimType").value["Institutional-IP"]
    ).toEqual(50);
    expect(
      component.formGroup.get("claimType").value["Institutional-OP"]
    ).toEqual(50);
    expect(component.formGroup.get("claimType").value.Others).toEqual(50);
  });

  it("setValidateNumber for paymentstatus", () => {
    component.formGroup.get("paymentstatus").patchValue(
      {
        Denied: 5000,
        "Check Issued": 5000,
        "Check Not Issued": 5000
      },
      { emitEvent: false }
    );
    fixture.detectChanges();
    component.setValidNumber();
    expect(component.formGroup.get("paymentstatus").value.Denied).toEqual(500);
    expect(
      component.formGroup.get("paymentstatus").value["Check Issued"]
    ).toEqual(500);
    expect(
      component.formGroup.get("paymentstatus").value["Check Not Issued"]
    ).toEqual(500);

    component.formGroup.get("paymentstatus").patchValue(
      {
        Denied: 50,
        "Check Issued": 50,
        "Check Not Issued": 50
      },
      { emitEvent: false }
    );
    fixture.detectChanges();
    component.setValidNumber();
    expect(component.formGroup.get("paymentstatus").value.Denied).toEqual(50);
    expect(
      component.formGroup.get("paymentstatus").value["Check Issued"]
    ).toEqual(50);
    expect(
      component.formGroup.get("paymentstatus").value["Check Not Issued"]
    ).toEqual(50);
  });

  it("setValidateNumber for paid amt, billed amt and sampling %", () => {
    component.formGroup.patchValue(
      {
        paidAmount: 50,
        billedAmount: 50,
        totalSamplingClaimsPercentage: 50
      },
      { emitEvent: false }
    );
    fixture.detectChanges();
    component.setValidNumber();
    expect(component.formGroup.get("paidAmount").value).toEqual(50);
    expect(component.formGroup.get("billedAmount").value).toEqual(50);
    expect(
      component.formGroup.get("totalSamplingClaimsPercentage").value
    ).toEqual(50);
  });
});
