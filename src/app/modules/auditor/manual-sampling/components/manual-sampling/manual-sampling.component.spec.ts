import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { BaseHttpService } from "src/app/services/base-http.service";
import { of, throwError } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ManualSamplingComponent } from "./manual-sampling.component";
import { PickListModule } from "primeng/picklist";
import { ChipsModule } from "primeng/chips";
import { RadioButtonModule } from "primeng/radiobutton";
import { CalendarModule } from "primeng/calendar";
import { AccordionModule } from "primeng/accordion";
import { CheckboxModule } from "primeng/checkbox";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ManualSamplingService } from "../../services/manual-sampling.service";
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';

describe("ManualSamplingComponent", () => {
  let component: ManualSamplingComponent;
  let fixture: ComponentFixture<ManualSamplingComponent>;
  let service: ManualSamplingService;
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
      declarations: [ManualSamplingComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        HttpClientTestingModule,
        PickListModule,
        ChipsModule,
        DialogModule,
        ConfirmDialogModule,
        MultiSelectModule,
        ComponentsModule,
        CalendarModule,
        AccordionModule,
        CheckboxModule,
        RadioButtonModule,
        BrowserAnimationsModule,
        AutoCompleteModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSamplingComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ManualSamplingService);
    fixture.detectChanges();
    notifierService = fixture.debugElement.injector.get(NotifierService);
    notifierSpy = spyOn(notifierService, "throwNotification");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("loadClaimStatistics", () => {
    component.formGroup.patchValue({
      processedFromDate: new Date(),
      processedToDate: new Date()
    });
    const payload = {
      otherClaims: 1,
      checkIssued: 160,
      paper: 16,
      adjusted: 366,
      edi: 574,
      denied: 0,
      professional: 345,
      manuallyAdjudicated: 0,
      autoAdjudicated: 255,
      externallyPriced: 1,
      checkNotIssued: 0,
      institutionalIP: 102,
      institutionalOP: 141,
      totalClaims: 700
    };
    const spy = spyOn(service, "loadClaimStatistics").and.returnValue(
      of(payload)
    );
    console.log(service.loadClaimStatistics({}));
    expect(component.formGroup.get("otherClaims").value).toEqual(
      payload.otherClaims
    );
    expect(notifierSpy).toHaveBeenCalled();
  });

  it("getAvialableFilters", () => {
    const spy = spyOn(service, "getAvailableilterSettings").and.returnValue(
      of(true)
    );
    component.availableFilters = false;
    const spy2 = spyOn(component, "setAvailableilters");
    const spy3 = spyOn(component, "getSavedSettings");
    component.getAvialableFilters();
    expect(component.availableFilters).toBeTruthy();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it("removeFromSource", () => {
    const source = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
      { id: 3, name: "C" }
    ];
    const target = [
      { id: 2, name: "B" },
      { id: 3, name: "C" }
    ];
    const res = [{ id: 1, name: "A" }];
    expect(component.removeFromSource(source, target)).toEqual(res);
  });

  it("getSavedSettings", () => {
    const payload = {
      claimType: ["Professional", "Institutional-IP"]
    };
    const spy = spyOn(service, "getSavedSettings").and.returnValue(of(payload));
    const spy2 = spyOn(component, "patchForm");
    component.getSavedSettings();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("initializeForm", () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    fixture.detectChanges();
    component.initializeForm();
    expect(component.yesterday.toString()).toEqual(date.toString());
  });

  it("patchForm", () => {
    let saved1 = {
      claimType: ["Professional", "Institutional-IP"],
      claimSource: ["EDI", "Paper"],
      paymentStatus: ["Denied", "Check Issued"],
      billedAmount: 0,
      paidAmount: 0,
      processWorkFlows: ["Auto Adjudicated", "Externally Priced"],
      userGroup: [],
      claimExaminers: [],
      lineOfBusiness: [],
      planTypes: [],
      diagnosisCodes: [{ id: 1, name: "002.3" }],
      procedureCodes: [{ id: 1, name: "00930ZZ" }],
      providers: [{ code: "MP1002", name: "Mridula Test Provider" }],
      memberGroups: [],
      totalSamplingClaimsPercentage: 0
    };

    const payload = [
      { id: "1", name: "Brad Pitt" },
      { id: "2", name: "Archana Sreekmar" },
      { id: "3", name: "Liya Jose" },
      { id: "4", name: "Rinu Jacob" },
      { id: "5", name: "Harris Ameen" },
      { id: "6", name: "Tino Jose" }
    ];

    const spy = spyOn(service, "getAvailableClaimExaminers").and.returnValue(
      of(payload)
    );
    const spy2 = spyOn(component, "setForm");
    component.patchForm(saved1);
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    saved1 = {
      claimType: ["Professional", "Institutional-IP"],
      claimSource: ["EDI", "Paper"],
      paymentStatus: ["Denied", "Check Issued"],
      billedAmount: 0,
      paidAmount: 0,
      processWorkFlows: ["Auto Adjudicated", "Externally Priced"],
      userGroup: [
        {
          id: 1,
          name: "QAudit 1"
        }
      ],
      claimExaminers: [],
      lineOfBusiness: [],
      planTypes: [],
      diagnosisCodes: [{ id: 1, name: "002.3" }],
      procedureCodes: [{ id: 1, name: "00930ZZ" }],
      providers: [{ code: "MP1002", name: "Mridula Test Provider" }],
      memberGroups: [],
      totalSamplingClaimsPercentage: 0
    };
    component.patchForm(saved1);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  const saved = {
    claimType: ["Professional", "Institutional-IP"],
    claimSource: ["EDI", "Paper"],
    paymentStatus: ["Denied", "Check Issued"],
    billedAmount: 0,
    paidAmount: 0,
    processWorkFlows: ["Auto Adjudicated", "Externally Priced"],
    userGroup: [
      {
        id: 1,
        name: "QAudit 1"
      }
    ],
    claimExaminers: [],
    lineOfBusiness: [],
    planTypes: [],
    diagnosisCodes: [{ id: 1, name: "002.3" }],
    procedureCodes: [{ id: 1, name: "00930ZZ" }],
    providers: [{ code: "MP1002", name: "Mridula Test Provider" }],
    memberGroups: [],
    totalSamplingClaimsPercentage: 0
  };

  it("onMoveToTarget", () => {
    const payload = [
      { id: "1", name: "Brad Pitt" },
      { id: "2", name: "Archana Sreekmar" },
      { id: "3", name: "Liya Jose" },
      { id: "4", name: "Rinu Jacob" },
      { id: "5", name: "Harris Ameen" },
      { id: "6", name: "Tino Jose" }
    ];
    const spy = spyOn(service, "getAvailableClaimExaminers").and.returnValue(
      of(payload)
    );
    const spy2 = spyOn(component, "setForm");
    component.patchForm(saved);
    component.formGroup.patchValue({
      selectedUSerGroups: [
        {
          id: 1,
          name: "QAudit 1"
        }
      ]
    });
    component.onMoveToTarget(true);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  const availableFilters = {
    userGroup: [
      {
        id: "1",
        name: "QAudit-1"
      },
      {
        id: "2",
        name: "QAudit-2"
      }
    ],
    lineOfBusiness: [
      {
        id: 1,
        name: "SSS"
      },
      {
        id: 2,
        name: "Medicaid"
      }
    ],
    planType: [
      {
        id: 1,
        name: "SSS"
      },
      {
        id: 2,
        name: "POS"
      },
      {
        id: 3,
        name: "HMO"
      }
    ],
    diagnosisCodes: [
      {
        id: 1,
        name: "J30.1"
      },
      {
        id: 2,
        name: "A00"
      }
    ],
    providers: [
      {
        code: "Mary Black Physicians Group LLC",
        name: "Mary Black Physicians Group LLC"
      },
      {
        code: "TestProv",
        name: "Physician Billing Services"
      }
    ],
    memberGroup: [
      {
        code: "Louisville-0000",
        name: "Louisville-0000"
      },
      {
        code: "Test523",
        name: "Test5"
      }
    ]
  };

  it("setAvailableilters", () => {
    component.formGroup.get("avalaibelUSerGroups").setValue([]);
    component.availableFilters = {
      userGroup: [1, 2],
      lineOfBusiness: [],
      planType: []
    };
    component.setAvailableilters();
    const userGrp = component.formGroup.get("avalaibelUSerGroups").value;
    expect(userGrp.length).toBeGreaterThan(0);
  });

  it("setForm", () => {
    const formData = {
      claimType: ["Professional", "Institutional-IP"],
      claimSource: ["EDI", "Paper"],
      paymentStatus: ["Denied", "Check Issued"],
      billedAmount: 2,
      paidAmount: 3,
      processWorkFlows: ["Auto Adjudicated", "Externally Priced"],
      userGroup: [
        {
          id: "2",
          name: "QAudit-2"
        }
      ],
      claimExaminers: [{ id: "1", name: "Brad Pitt" }],
      lineOfBusiness: [
        {
          id: 1,
          name: "SSS"
        }
      ],
      planTypes: [
        {
          id: 1,
          name: "SSS"
        }
      ],
      diagnosisCodes: [{ id: 1, name: "002.3" }],
      procedureCodes: [{ id: 1, name: "00930ZZ" }],
      providers: [{ code: "MP1002", name: "Mridula Test Provider" }],
      memberGroups: [{ code: "MP1002", name: "" }],
      totalSamplingClaimsPercentage: 0
    };

    component.availableFilters = availableFilters;
    const payload = [
      { id: "1", name: "Brad Pitt" },
      { id: "2", name: "Archana Sreekmar" },
      { id: "3", name: "Liya Jose" },
      { id: "4", name: "Rinu Jacob" },
      { id: "5", name: "Harris Ameen" },
      { id: "6", name: "Tino Jose" }
    ];
    component.setForm(formData, payload);
    expect(component.HdChecked).toBeTruthy();
  });

  it("onChangeHD", () => {
    component.onChangeHD(true);
    expect(component.HdChecked).toBeTruthy();
    expect(component.formGroup.get("paidAmount").value).toBe(0);
    expect(component.formGroup.get("billedAmount").value).toBe(0);
  });

  it("constructParam", () => {
    component.initializeForm();
    patch(component);
    component.formGroup.patchValue({
      processedFromDate: "2020-05-26 00:00:00",
      processedToDate: "2020-05-26 23:59:59",
      claimType: ["Professional", "Institutional-IP"],
      claimSource: ["EDI", "Paper"],
      paymentStatus: ["Denied", "Check Issued"],
      billedAmount: 0,
      paidAmount: 0,
      processWorkFlows: ["Auto Adjudicated", "Externally Priced"],
      selectedUSerGroups: [{id: 12}],
      selectedClaimExaminers: [{id: 123}],
      selectedLOBs: [{name: 'lob'}],
      selectedPlanTypes: [{name: 'plan'}],
      selectedDiagnosisCodes: ["002.3"],
      selectedProcedureCodes: ["00930ZZ"],
      selectedProviderIds: ["MP1002"],
      selectedMemberGroupCodes: [],
      samplePercentage: 60,
      auditClaimsCount: 4,
      auditQueueCount: 33,
      selectedQueue: [2]
    });
    const param = component.constructParam();
    expect(param.processWorkFlows.length).toBeGreaterThan(0);
  });

  it("saveSettings", () => {
    const spy = spyOn(component, "getFormValidationErrors");
    spy.and.returnValue(1);
    const spy1 = spyOn(component, "listIssues");
    component.saveSettings();
    expect(spy1).toHaveBeenCalled();

    component.initializeForm();
    component.formGroup.patchValue({ samplePercentage: 55 });
    patch(component);
    spy.and.returnValue(0);
    const spy3 = spyOn(service, "saveSamplingSettings").and.returnValue(
      of(true)
    );
    component.saveSettings();
    expect(spy3).toHaveBeenCalled();
    expect(notifierSpy).toHaveBeenCalled();
  });

  it("listIssues", () => {
    component.listIssues();
    expect(notifierSpy).toHaveBeenCalled();
  });

  it("onRefreshClick", () => {
    try {
      const spy = spyOn(component, "getFormValidationErrors");
      const spy1 = spyOn(component, "listIssues");
      component.onRefreshClick();
      component.initializeForm();
      component.formGroup.patchValue({ samplePercentage: 55 });
      patch(component);
      spy.and.returnValue(0);
      const spy3 = spyOn(service, "refreshClaimCount");
      component.onRefreshClick();
      expect(spy3).toHaveBeenCalled();
      expect(notifierSpy).toHaveBeenCalled();
    } catch (error) {
      console.log(error);
    }
  });

  it("onRefreshClick - invalid", () => {
    const spy = spyOn(component, "getFormValidationErrors").and.returnValue(3);
    const spy1 = spyOn(component, "listIssues");
    component.onRefreshClick();
    expect(component).toBeTruthy();
  });

  it("calculatePercentage", () => {
    component.initializeForm();
    patch(component);
    component.formGroup.patchValue({
      totalClaimsCount: 10,
      samplePercentage: 101
    });
    component.calculatePercentage();
    expect(component.formGroup.get("totalClaimsCount").value).toBe(10);
    expect(component.formGroup.get("samplePercentage").value).toBe(100);
    component.formGroup.patchValue({
      totalClaimsCount: 100,
      samplePercentage: 10
    });
    component.calculatePercentage();
    expect(component.formGroup.get("auditClaimsCount").value).toBe(10);
  });

  it("addToAuditQueue", () => {
    const spy = spyOn(component, "getFormValidationErrors");
    spy.and.returnValue(1);
    const spy1 = spyOn(component, "listIssues");
    component.addToAuditQueue('auditorQueue');
    fixture.detectChanges();
    expect(spy1).toHaveBeenCalled();
    const spy2 = spyOn(component, "constructParam");
    spy.and.returnValue(0);
    component.formGroup.patchValue({
      auditClaimsCount: 0,
      samplePercentage: 0,
      totalClaimsCount: 0
    });
    component.addToAuditQueue('generalQueue');
    expect(spy2).toHaveBeenCalled();
    const spy4 = spyOn(service, "getAuditQueueCount").and.returnValue(
      of({ auditQueueCount: 1000 })
    );
    const spyaddToAuditQueue = spyOn(
      service,
      "addToAuditQueue"
    ).and.returnValue(of(true));
    expect(spyaddToAuditQueue).not.toHaveBeenCalled();
    expect(spy4).not.toHaveBeenCalled();
  });

  it("getAuditQueueCount to have been called", () => {
    component.formGroup.patchValue({
      auditClaimsCount: 1,
      samplePercentage: 10,
      totalClaimsCount: 100,
      selectedQueue: "Audit"
    });
    const spy4 = spyOn(service, "addToAuditQueue").and.returnValue(
      of({ auditQueueCount: 1000 })
    );
    fixture.detectChanges();
    component.addToAuditQueue('generalQueue');
    expect(spy4).toHaveBeenCalled();
    component.addToAuditQueue('');
    const confService = fixture.debugElement.injector.get(ConfirmationService);
    const navSpy = spyOn(service, 'navigateToAuditorQue');
    spyOn(confService, 'confirm').and.callFake(e => e.accept());
    component.addToAuditQueue('auditorQueue');
    expect(navSpy).toHaveBeenCalled();
  });

  it("addToAuditQueue - error", () => {
    component.formGroup.patchValue({
      auditClaimsCount: 1,
      samplePercentage: 10,
      totalClaimsCount: 100,
      selectedQueue: "Audit"
    });
    const spy4 = spyOn(service, "addToAuditQueue").and.returnValue(throwError(200));
    fixture.detectChanges();
    component.addToAuditQueue('generalQueue');
    expect(spy4).toHaveBeenCalled();
  });

  it("getAuditQueueCount", () => {
    component.initializeForm();
    const spy = spyOn(service, "getAuditQueueCount").and.returnValue(
      of({ auditQueueCount: 1000 })
    );
    component.getAuditQueueCount();
    expect(component.formGroup.get("auditQueueCount").value).toBe(1000);
  });

  it("getFormValidationErrors", () => {
    component.getFormValidationErrors(true);
    expect(component.errorList).toEqual([]);
    component.initializeForm();

    component.formGroup.controls[`processedToDate`].setErrors({
      incorrect: true
    });
    component.formGroup.controls[`processedFromDate`].setErrors({
      incorrect: true
    });
    component.getFormValidationErrors(false);
    expect(component.errorList.length).toBe(2);

    component.HdChecked = true;
    component.formGroup.patchValue({
      paidAmount: 0,
      billedAmount: 0
    });
    component.formGroup.controls[`processedToDate`].reset();
    component.getFormValidationErrors(false);
    expect(component.errorList.indexOf("Paid amount & Billed amount should not be 0 or less when HD only is checked")).not.toEqual(-1);
  });

  it("setDivId", () => {
    component.formGroup.patchValue({
      selectedUSerGroups: [
        {
          name: 'test'
        }
      ],
      selectedClaimExaminers: [
        {
          name: 'test'
        }
      ],
      selectedPlanTypes: [
        {
          name: 'test'
        }
      ],
      selectedLOBs: [
        {
          name: 'test'
        }
      ]
    });
    component.setDivId(1);
    expect(component.divId).toEqual(1);
  });

  it('loadClaimStatistics no datechanged', () => {
    component.loadClaimStatistics();
    expect(notifierSpy).not.toHaveBeenCalled();
  });

  it("loadClaimStatistics", () => {
    component.formGroup.patchValue({
      processedFromDate: new Date(),
      processedToDate: new Date()
    });
    const spy = spyOn(service, "loadClaimStatistics").and.returnValue(throwError(400));
    component.loadClaimStatistics();
    expect(spy).toHaveBeenCalled();
    expect(notifierSpy).toHaveBeenCalled();
  });

  it("removeFromSource", () => {
    const formData = {
      claimType: ["Professional", "Institutional-IP"],
      claimSource: ["EDI", "Paper"],
      paymentStatus: ["Denied", "Check Issued"],
      billedAmount: 0,
      paidAmount: 0,
      processWorkFlows: ["Auto Adjudicated", "Externally Priced"],
      userGroup: [
        {
          id: "2",
          name: "QAudit-2"
        }
      ],
      claimExaminers: [{ id: "1", name: "Brad Pitt" }],
      lineOfBusiness: [
        {
          id: 1,
          name: "SSS"
        }
      ],
      planTypes: [
        {
          id: 1,
          name: "SSS"
        }
      ],
      diagnosisCodes: [{ id: 1, name: "002.3" }],
      procedureCodes: [{ id: 1, name: "00930ZZ" }],
      providers: [{ code: "MP1002", name: "Mridula Test Provider" }],
      memberGroups: [{ code: "MP1002", name: "" }],
      totalSamplingClaimsPercentage: 0
    };
    component.availableFilters = availableFilters;
    component.setForm(formData, []);
    expect(component.removeFromSource(null, null)).toEqual([]);
  });

  it("onMoveToTarget", () => {
    component.formGroup.patchValue({
      selectedUSerGroups: []
    });
    spyOn(service, 'getAvailableClaimExaminers').and.returnValue(of([]));
    component.onMoveToTarget('');
    expect(component.formGroup.value.selectedClaimExaminers).toEqual([]);
  });

  it("constructParam", () => {
    component.initializeForm();
    patch(component);
    component.formGroup.patchValue({
      processedFromDate: "2020-05-26 00:00:00",
      processedToDate: "2020-05-26 23:59:59",
      claimType: null,
      claimSource: null,
      paymentStatus: null,
      billedAmount: 0,
      paidAmount: 0,
      processWorkFlows: null,
      selectedUSerGroups: null,
      selectedClaimExaminers: null,
      selectedLOBs: null,
      selectedPlanTypes: null,
      selectedDiagnosisCodes: null,
      selectedProcedureCodes: null,
      selectedProviderIds: null,
      selectedMemberIds: null,
      selectedMemberGroupCodes: null,
      samplePercentage: 60,
      auditClaimsCount: 4,
      auditQueueCount: 33,
      selectedQueue: [2]
    });
    const param = component.constructParam();
    component.splitValue('');
    expect(component.splitValue('test,test1').length).toEqual(2);
    expect(param.processWorkFlows.length).toEqual(0);
  });

  it('hdchecked issues', () => {
    component.HdChecked = true;
    component.formGroup.patchValue({
      paidAmount: 1,
      billedAmount: 1
    });
    component.getFormValidationErrors(true);
    expect(component.errorList.length).toEqual(0);
  });
});

function patch(component: ManualSamplingComponent) {
  component.formGroup.patchValue({
    processedFromDate: "2020-05-26T05:35:27.081Z",
    processedToDate: "2020-05-26T05:35:27.081Z",
    claimType: ["Professional", "Institutional-IP"],
    claimSource: ["EDI", "Paper"],
    paymentStatus: ["Denied", "Check Issued"],
    selectedCities: null,
    HDStatus: [],
    billedAmount: 0,
    paidAmount: 0,
    processWorkFlows: ["Auto Adjudicated", "Externally Priced"],
    avalaibelUSerGroups: [
      { id: "1", name: "QAudit-1" },
      { id: "2", name: "QAudit-2" }
    ],
    selectedUSerGroups: [],
    availableClaimExaminers: [],
    selectedClaimExaminers: [],
    availabelPlanTypes: [
      { id: 1, name: "SSS" },
      { id: 2, name: "POS" },
      { id: 3, name: "HMO" },
      { id: 4, name: "PPO" }
    ],
    selectedPlanTypes: [],
    availabeLOBs: [
      { id: 1, name: "SSS" },
      { id: 2, name: "Medicaid" },
      { id: 3, name: "Commercial" },
      { id: 4, name: "Medicare" }
    ],
    selectedLOBs: [],
    selectedDiagnosisCodes: ["002.3"],
    selectedProcedureCodes: ["00930ZZ"],
    selectedProviderIds: ["MP1002"],
    selectedMemberIds: [],
    totalClaimsCount: "0",
    samplePercentage: 0,
    auditClaimsCount: 0,
    auditQueueCount: 25,
    otherClaims: 1,
    checkIssued: 160,
    paper: 16,
    adjusted: 366,
    edi: 574,
    denied: 0,
    professional: 345,
    manuallyAdjudicated: 0,
    autoAdjudicated: 255,
    externallyPriced: 1,
    checkNotIssued: 0,
    institutionalIP: 102,
    institutionalOP: 141,
    totalClaims: 700
  });
}
