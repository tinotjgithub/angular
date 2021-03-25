import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {StepsModule} from 'primeng/steps';
import { AuditorQueueComponent } from "./auditor-queue.component";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { PickListModule } from "primeng/picklist";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { RouterTestingModule } from "@angular/router/testing";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { ConfirmationService } from "primeng/api";
import { of, Subject, throwError } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { TabViewModule } from 'primeng/tabview';
import { HeaderService } from 'src/app/services/header/header.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { NotifierService } from 'src/app/services/notifier.service';

export class MockAuditorService {
  workFlowRoleSub = new Subject<any>();
  auditorAuditResponse: any;
  auditorQualityResponse: any;
  public auditorClaimsAuditedFetch = new Subject<any>();
  auditorFinScoreResponse: any;
  auditorCategoryResponse: any;
  auditorAuditStatusFetch = new Subject<any>();
  auditorQualityScoreFetch = new Subject<any>();
  auditorCategoryFetch = new Subject<any>();
  workFlowRoleResponse: any;
  constructor() {}

  getAuditorClaimsAuditedListner() {
    return this.auditorClaimsAuditedFetch.asObservable();
  }

  getWorkFlowRolesListner() {
    return this.workFlowRoleSub.asObservable();
  }

  getAuditorAuditStatusListner() {
    return this.auditorAuditStatusFetch.asObservable();
  }

  getAuditorQualityScoreListner() {
    return this.auditorQualityScoreFetch.asObservable();
  }

  getAuditorClaimsAuditedCategoryListner() {
    return this.auditorCategoryFetch.asObservable();
  }

  getQueueSummary() {
    return of('');
  }

  getAuditStatus() {
    return of('');
  }

  getProcessedClaimsInventoryStatus() {
    return of('');
  }

  getClaimCountDetails(payload) {
    return of('');
  }

  addClaimCountDetails(payload) {
    return of('');
  }

  getQueueDetails(type) {
    return of('');
  }

  deleteQueueDetails(payload) {
    return of('');
  }

  getClaimForAuditorQueue() {
    return of('');
  }

  getClaimForAuditorQueueById(taskId) {
    return of('');
  }

  getInitializedClaimForAuditorQueue() {
    return of('');
  }

  getChecklist() {
    return of('');
  }

  addChecklist(payload) {
    return of('');
  }

  removeChecklist(payload) {
    return of('');
  }

  uploadFile(formData: FormData) {
    return of('');
  }

  uploadFileExaminerFile(formData: FormData) {
    return of('');
  }

  acceptAuditFailedTask(param) {
    return of('');
  }

  pendAuditFailedTask(param) {
    return of('');
  }

  getAuditorAuditStatus() {
    this.auditorAuditResponse = '';
    this.auditorAuditStatusFetch.next(this.auditorAuditResponse);
  }

  getAuditorQualityScore() {
    this.auditorQualityResponse = '';
    this.auditorQualityScoreFetch.next(this.auditorQualityResponse);
  }

  getAuditorClaimsAuditedCategory() {
    this.auditorCategoryResponse = '';
    this.auditorCategoryFetch.next(this.auditorCategoryResponse);
  }

  rebutAuditFailedTask(param) {
    return of('');
  }

  saveAuditQueueClaim(payload) {
    return of('');
  }

  downloadFile(fileId: string) {
    return of('');
  }

  submitAuditClaim(payload) {
    return of('');
  }

  getAuditFailedCount() {
    return of('');
  }

  gerReviewRebutCount() {
    return of('');
  }

  getAuditailedDetails() {
    return of('');
  }

  getReviewRebuttalList() {
    return of('');
  }

  deleteFile(taskId, position) {
    return of('');
  }

  deleteAuditFailedFile(taskId, position) {
    return of('');
  }

  getAuditFailedDetails(auditFlowId, reviewRebut) {
    return of('');
  }

  getAuditReviewCount() {
    return of('');
  }

  getWorkFlowRoles() {
    this.workFlowRoleResponse = '';
    this.workFlowRoleSub.next(this.workFlowRoleResponse);
  }

  saveWorkFlowRoles(payload) {
    return of('');
  }

  getAuditorClaimsAudited() {
    this.auditorFinScoreResponse = '';
    this.auditorClaimsAuditedFetch.next(this.auditorFinScoreResponse);
  }

  getAuditQueueDetails(type) {
    return of('');
  }

  getClaimsForManualSelection(payload) {
    return of('');
  }

  addToTodaysQueue(payload, role) {
    return of('');
  }

  getQueueSummaryLeadManager(role) {
    return of('');
  }

  getAuditStatusLeadManager() {
    return of('');
  }

  getProcessedClaimsInventoryStatusLeadManager() {
    return of('');
  }

  getQueueDetailsLeadManager(type, role) {
    return of('');
  }

  auditorRouteClaim(payload) {
    return of('');
  }

  deleteClaimLeadManager(payload) {
    return of('');
  }

  getAuditorClaimsLeadManager(auditorId, type) {
    return of('');
  }

  getUnassignedClaimsCountAndAuditorsLeadManager(type) {
    return of('');
  }

  assignClaims(payload) {
    return of('');
  }

  getRebuttalList(type) {
    return of('');
  }

  getRebuttalCounts() {
    return of('');
  }

  getAuditorCounts(fromDate, toDate) {
    return of('');
  }

  auditSummaryByAuditorDetails(payload) {
    return of('');
  }

  auditSummaryByAuditorExcel(payload) {
    return of('');
  }

  getTouchedClaimsExaminer(taskId) {
    return of('');
  }

  getAuditorDetailsForManualAssignment() {
    return of('');
  }

  addToAuditorQueue(payload) {
    return of('');
  }

  sendBack(payload) {
    return of('');
  }
}

describe("AuditorQueueComponent", () => {
  let component: AuditorQueueComponent;
  let fixture: ComponentFixture<AuditorQueueComponent>;
  let service: AuditorService;
  const intervalIds = [];
  const windowSetInterval = window.setInterval;
  window.setInterval = function testSetInterval() {
    arguments[0]();
    const id = windowSetInterval.apply(this, arguments);
    intervalIds.push(id);
    return id;
  };
  const removeInterval = () => {
    intervalIds.forEach((id) => {
      clearInterval(id);
    });
  };
  const data = {
    auditTaskId: 32,
    claimId: "20190422000625",
    claimType: "Institutional-IP",
    receiptDate: "04/22/2019",
    claimsAge: 386,
    providerName: "Mridula Test Provider",
    memberGroupName: "Carmel-Sub-1",
    billedAmount: 13000,
    allowedAmount: 3000600,
    paidAmount: 2999680,
    processedDate: "01/29/2020",
    queueName: "hcc_super_user",
    examinerName: null,
    savedForLater: false,
    errorType: null,
    financialImpact: null,
    auditorAmount: null,
    auditorComments: null,
    endTimer: "00:60:62",
    attachmentOne: null,
    attachmentTwo: null,
    attachmentThree: null,
    attachmentFour: null,
    attachmentFive: null,
    attachmentSix: null,
    checkListItems: [
      {
        id: "check3",
        name: "check3",
      },
      {
        id: "check1",
        name: "check1",
      },
      {
        id: "check2",
        name: "check2",
      },
    ],
    savedCheckListItems: null,
  };
  const dataSaved = {
    auditTaskId: 32,
    claimId: "20190422000625",
    claimType: "Institutional-IP",
    receiptDate: "04/22/2019",
    claimsAge: 386,
    providerName: "Mridula Test Provider",
    memberGroupName: "Carmel-Sub-1",
    billedAmount: 13000,
    allowedAmount: 3000600,
    paidAmount: 2999680,
    processedDate: "01/29/2020",
    queueName: "hcc_super_user",
    examinerName: null,
    savedForLater: "FAILED",
    savedForLaterStatus: true,
    errorType: null,
    financialImpact: null,
    auditorAmount: null,
    auditorComments: null,
    endTimer: "00:00:21",
    attachmentOne: {
      filePosition: "attachmentOne",
      fileId: 37,
      fileName: "Audit_Details.xlsx",
    },
    attachmentTwo: null,
    attachmentThree: null,
    attachmentFour: null,
    attachmentFive: null,
    attachmentSix: null,
    checkListItems: [
      {
        id: "check1",
        name: "check1",
      },
      {
        id: "check2",
        name: "check2",
      },
    ],
    savedCheckListItems: [
      {
        id: "check3",
        name: "check3",
      },
    ],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditorQueueComponent],
      imports: [
        CommonModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        ComponentsModule,
        DialogModule,
        ButtonModule,
        PickListModule,
        ConfirmDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TabViewModule,
        StepsModule
      ],
      providers: [
        { provide: AuditorService, useClass: MockAuditorService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        ConfirmationService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorQueueComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditorService);
    const header = fixture.debugElement.injector.get(HeaderService);
    spyOn(header, 'updateAuditClaimDetails').and.callFake((val) => {});
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get claim details when navigated with id", () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(
      ActivatedRoute
    );
    spyOn(activatedRoute.snapshot.queryParamMap, "get").and.returnValue("2");
    spyOn(service, "getClaimForAuditorQueueById").and.returnValue(of(null));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should get claim - no claim initialized", () => {
    spyOn(service, "getInitializedClaimForAuditorQueue").and.returnValue(
      of(null)
    );
    spyOn(service, "getClaimForAuditorQueue").and.returnValue(of(data));
    component.getClaim();
    expect(component.claim).toBeDefined();
    removeInterval();
  });

  it("should get claim - with claim initialized", () => {
    spyOn(service, "getInitializedClaimForAuditorQueue").and.returnValue(
      of(dataSaved)
    );
    component.getClaim();
    expect(component.claim).toBeDefined();
    removeInterval();
  });

  it("should enable/disable the fields on status chnage", () => {
    component.auditForm.patchValue({
      status: "FAILED",
    });
    component.auditForm.updateValueAndValidity();
    expect(component.auditForm.controls.errorType.enabled).toBeTruthy();
    component.auditForm.patchValue({
      status: "PASSED",
    });
    component.auditForm.updateValueAndValidity();
    expect(component.auditForm.controls.reviewComments.enabled).toBeTruthy();
  });

  it("should enable/disable the fields on errorType chnage", () => {
    component.auditForm.patchValue({
      errorType: "Financial",
    });
    component.auditForm.updateValueAndValidity();
    expect(component.auditForm.controls.financialImpact.enabled).toBeTruthy();
  });

  it("should enable/disable the fields on financialImpact chnage", () => {
    component.auditForm.patchValue({
      errorType: "Financial",
    });
    component.auditForm.updateValueAndValidity();
    component.auditForm.patchValue({
      financialImpact: 'Over Paid',
    });
    component.auditForm.updateValueAndValidity();
    expect(component.auditForm.controls.amount.enabled).toBeTruthy();
    component.auditForm.patchValue({
      financialImpact: '',
    });
    component.auditForm.updateValueAndValidity();
    expect(component.auditForm.controls.amount.disabled).toBeTruthy();
  });

  it("start timer", () => {
    component.startTimer(data);
    expect(component).toBeTruthy();
    removeInterval();
    component.startTimer({ endTimer: null, claimId: 1233 });
    expect(component).toBeTruthy();
    removeInterval();
  });

  it("should download file", () => {
    spyOn<any>(service, "downloadFile").and.returnValue(of(true));
    component.downloadFile(dataSaved.attachmentTwo);
    component.downloadFile(dataSaved.attachmentOne);
    const element = document.createElement("a");
    spyOn<any>(document, "createElement").and.returnValue(element);
    spyOnProperty(element, "download").and.returnValue(undefined);
    component.downloadFile(dataSaved.attachmentOne);
    expect(component).toBeTruthy();
  });

  it("should copy and open health Edge", () => {
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    const spied = spyOn(taskService, "callHealthEdge").and.returnValue(
      of(true)
    );
    component.copyAndOpenHRP(document.createElement("input"));
    component.justCopy(document.createElement("input"));
    expect(spied).toHaveBeenCalled();
  });

  it("should copy and open health Edge -failure", () => {
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    const spied = spyOn(taskService, "callHealthEdge").and.returnValue(
      of({ status: "Failure" })
    );
    component.copyAndOpenHRP(document.createElement("input"));
    expect(spied).toHaveBeenCalled();
  });

  it("delete file", () => {
    component.claim = data;
    spyOn(service, "deleteFile").and.returnValue(of(true));
    component.input = [dataSaved.attachmentOne];
    component.deleteFile(0);
    expect(component.input).toEqual([""]);
    component.input = [dataSaved.attachmentOne, dataSaved.attachmentOne];
    component.deleteFile(0);
    expect(component.input.length).toEqual(1);
  });

  it("delete file with data", () => {
    component.claim = data;
    spyOn(service, "deleteFile").and.returnValue(of([dataSaved.attachmentOne]));
    component.input = [dataSaved.attachmentOne, dataSaved.attachmentOne, {...dataSaved.attachmentOne, local: true}];
    component.deleteFile(0);
    expect(component.input.length).toEqual(2);
  });

  it("should upload file", () => {
    spyOn(service, "uploadFile").and.returnValue(of(true));
    component.claim = data;
    component.input = [
      dataSaved.attachmentOne,
      {
        ...dataSaved.attachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true,
      },
    ];
    component.uploadFile();
    expect(component).toBeTruthy();
  });

  it("should be able to save for later", () => {
    spyOn(service, "submitAuditClaim").and.returnValue(of(true));
    spyOn(service, "uploadFile").and.returnValue(of(true));
    component.claim = data;
    component.auditForm.patchValue({
      status: "PASSED",
      reviewComments: "Test",
    });
    component.input = [dataSaved.attachmentOne];
    component.checkedItem = [{name: 'test'}];
    component.saveForLater(true);
    expect(component.claimDetails).toEqual([]);
  });

  it("should be able to submit", () => {
    spyOn(service, "saveAuditQueueClaim").and.returnValue(of(true));
    spyOn(service, "uploadFile").and.returnValue(of(true));
    component.claim = data;
    component.auditForm.patchValue({
      status: "PASSED",
      reviewComments: "Test",
    });
    component.input = [dataSaved.attachmentOne];
    component.checkedItem = ['test'];
    component.saveForLater();
    expect(component.claim).toBeNull();
  });

  it("should prevent save/submit invalid form", () => {
    spyOnProperty(component.auditForm, "invalid").and.returnValue(true);
    component.claim = data;
    component.claimDetails = [""];
    component.saveForLater();
    expect(component.claim).toBeDefined();
  });

  it("can activate", () => {
    expect(component.canDeactivate()).toBeTruthy();
    component.claim = dataSaved;
    expect(component.canDeactivate()).toBeFalsy();
  });

  it("on reload", () => {
    component.beforeunloadHandler(new Event('reload'));
    component.claim = dataSaved;
    component.beforeunloadHandler(new Event('reload'));
    expect(component).toBeTruthy();
  });

  it("should route claim", () => {
    spyOn(service, 'auditorRouteClaim').and.returnValue(of(''));
    component.claim = {
      auditTaskId: 1
    };
    component.routeForm.patchValue({
      leadManagerName: {
        id: 1
      },
      reason: {
        id: 1
      }
    });
    component.routeClaim();
    expect(component.claim).toBeFalsy();
  });

  it("should be able to submit - isCompleteRouteClaim, error", () => {
    spyOn(service, "submitAuditClaim").and.returnValue(throwError(null));
    spyOn(service, "uploadFile").and.returnValue(of(true));
    component.claim = data;
    component.isCompleteRouteClaim = true;
    component.auditForm.patchValue({
      status: "PASSED",
      reviewComments: "Test",
    });
    component.input = [dataSaved.attachmentOne];
    component.checkedItem = ['test'];
    component.saveForLater(true);
    expect(component.claim).not.toBeNull();
  });


  it("should be able to submit - isCompleteRouteClaim, error no examiner", () => {
    spyOn(service, "submitAuditClaim").and.returnValue(throwError({status: 307}));
    const notifierService: NotifierService = fixture.debugElement.injector.get(NotifierService);
    spyOn(service, "uploadFile").and.returnValue(of(true));
    spyOn(notifierService, 'throwNotification');
    component.claim = data;
    component.isCompleteRouteClaim = true;
    component.auditForm.controls.examiner.enable();
    component.auditForm.patchValue({
      status: "PASSED",
      reviewComments: "Test",
      examiner: {value: 1}
    });
    component.input = [dataSaved.attachmentOne];
    component.checkedItem = ['test'];
    component.saveForLater(true);
    expect(component.claim).toBeNull();
  });

  it("check checkIsCompleteRouteClaim - else", () => {
    component.claim = {data, claimStatus: 'Final'};
    component.checkIsCompleteRouteClaim();
    expect(component.isCompleteRouteClaim).toBeFalsy();
    component.claim = null;
    component.stepChange(1);
    expect(component.step).toBe(1);
  });
});
