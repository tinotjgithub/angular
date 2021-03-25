import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalQueueComponent } from './rebuttal-queue.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from 'src/app/services/review/review.service';
import { of } from 'rxjs';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { TabViewModule } from 'primeng/tabview';

describe('RebuttalQueueComponent', () => {
  let component: RebuttalQueueComponent;
  let fixture: ComponentFixture<RebuttalQueueComponent>;
  let service: ReviewService;
  const data = {
    auditFlowId: 42,
    auditTaskId: 18,
    claimId: "20190603000753",
    claimType: "Institutional (IP)",
    claimStatus: "Final",
    receiptDate: "05/17/2020",
    claimsAge: 25,
    providerName: "Test Supplier1",
    memberGroupName: "Test Account - 01",
    billedAmount: 22000,
    allowedAmount: 22000,
    paidAmount: 21656,
    processedDate: "05/17/2020 03:41",
    queueName: "hcc_super_user",
    examinerName: "Devika Kumari",
    status: "PASSED",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 20,
    auditorComments: "Financailly isse",
    reviewOrRebut: "Rebut",
    endTimer: null, // for pended/saved claims this will have value
    currentLevel: 2,
    resubmitAuditorComments: null, // for pended/saved claims this will have value
    auditorAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 20,
          fileName: "FileUpload1.docx",
        },
      },
    ],
    examinerAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 23,
          fileName: "FileUpload1.docx",
        },
      },
    ],
    leadAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 24,
          fileName: "Audit_Details.xlsx",
        },
      },
    ],
    managerAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 24,
          fileName: "Audit_Details.xlsx",
        },
      },
    ],
    examinerComments: ["rebutting the claim"],
    leadComments: [null, "rebutted-lead", "Reviewed  the claim"],
    managerComments: [
      "rebutted-manager",
      "reviewed-manager",
      null,
      null,
      null,
      "reviewed-manager",
    ],
    auditorSavedAttachmentOne: {
      filePosition: "attachmentTwo",
      fileId: 21,
      fileName: "Audit_Details.xlsx",
    },
    auditorSavedAttachmentTwo: {
      filePosition: "attachmentOne",
      fileId: 22,
      fileName: "FileUpload1.docx",
    },
    auditorSavedAttachmentThree: null,
    prevAuditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 118,
          fileName: "Institutional_OP__Claim_Validation_Rules.docx",
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 117,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx",
        },
      },
      {
        attachmentThree: {
          filePosition: " attachmentThree ",
          fileId: 179,
          fileName: "Institutional_OP__Claim_Validation_Rules.docx",
        },
      },
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 149,
          fileName: "Institutional_OP__Claim_Validation_Rules.docx",
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 148,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx",
        },
      },
    ],
    prevAuditorComments: ["Rebuttal by auditor", "Test"],
  };
  const dataNoFile = {
    auditFlowId: 2,
    auditTaskId: 12,
    claimId: "20190125001215",
    claimType: "Professional",
    claimStatus: "Final",
    receiptDate: "01/25/2019",
    claimsAge: 477,
    providerName: "Demo_Test_Supplier",
    memberGroupName: "South Carolina",
    billedAmount: 100,
    allowedAmount: 70,
    paidAmount: 14,
    processedDate: "07/18/2019",
    queueName: "hcc_super_user",
    examinerName: "Manju Varghese",
    status: "FAILED",
    errorType: "error",
    financialImpact: "abc",
    auditorAmount: null,
    auditorComments: "test review",
    reviewRebut: "Accept",
    reviewRebuttalExaminerComments: "to auditor 12",
    rebuttalLeadComments: null,
    rebuttalManagerComments: null,
    endTimer: null,
    examinerReviewAttachmentDto: null,
    managerReviewAttachmentDto: null,
    leadReviewAttachmentDto: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebuttalQueueComponent ],
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
        TabViewModule
      ],
      providers: [
        AuditorService,
        ReviewService,
        BaseHttpService,
        ConfirmationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalQueueComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ReviewService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should get claim details when navigated with id", () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(
      ActivatedRoute
    );
    service.$timerInfo = of({
      endTimer: null,
      timerColor: null
    });
    spyOn(activatedRoute.snapshot.queryParamMap, "get").and.returnValue("2");
    spyOn(service, "getRebuttalById").and.returnValue(of(null));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should load already loaded claim", () => {
    service.$timerInfo = of({
      endTimer: "00:02:25",
      timerColor: "red"
    });
    service.claimDetail = data;
    service.$claimDetailsListener = of(data);
    component.ngOnInit();
    expect(component.claim).toEqual(data);
  });

  it("should process already loaded claim on get claim click", () => {
    service.claimDetail = dataNoFile;
    component.getClaim();
    expect(component.claim).toEqual(dataNoFile);
  });

  it("should get new when no already loaded claim on get claim click", () => {
    const sypied = spyOn(service, "getClaim").and.callFake(() => {});
    component.getClaim();
    expect(sypied).toHaveBeenCalled();
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

  it("should view particular attachment on vieAttachmwnt click", () => {
    component.managerAttachment = [""];
    component.claim = data;
    component.viewAttachments("test");
    expect(component.showAttachments).toBeTruthy();
    component.claim = null;
    component.viewAttachments("managerAttachment");
    expect(component.showAttachments).toBeFalsy();
    expect(component.attachmentsPopup).toEqual([""]);
  });

  it("should download file", () => {
    spyOn<any>(service, "downloadFile").and.returnValue(of(true));
    component.downloadAttachment(null);
    component.downloadAttachment(data.auditorSavedAttachmentOne);
    const element = document.createElement('a');
    spyOn<any>(document, "createElement").and.returnValue(element);
    spyOnProperty(element, "download").and.returnValue(undefined);
    component.downloadAttachment(data.auditorSavedAttachmentOne);
    expect(component).toBeTruthy();
  });

  it("delete file", () => {
    component.claim = data;
    spyOn(service, "deleteFile").and.returnValue(of(true));
    component.input = [data.auditorSavedAttachmentOne];
    component.deleteFile(0);
    expect(component.input).toEqual([""]);
    component.input = [data.auditorSavedAttachmentOne, data.auditorSavedAttachmentTwo];
    component.deleteFile(0);
    expect(component.input.length).toEqual(1);
  });

  it("delete file with data", () => {
    component.claim = data;
    spyOn(service, "deleteFile").and.returnValue(of([data.auditorSavedAttachmentOne]));
    component.input = [data.auditorSavedAttachmentOne, data.auditorSavedAttachmentOne, {...data.auditorSavedAttachmentOne, local: true}];
    component.deleteFile(0);
    expect(component.input.length).toEqual(2);
  });

  it("should upload file", () => {
    spyOn(service, "uploadFile").and.returnValue(of(true));
    component.claim = data;
    component.input = [
      data.auditorSavedAttachmentOne,
      {
        ...data.auditorSavedAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true,
      },
    ];
    component.uploadFile();
    expect(component).toBeTruthy();
  });

  it("should be able to complete the review", () => {
    spyOn(service, "reviewComplete").and.returnValue(of(true));
    component.claim = data;
    component.reviewComplete();
    expect(component.claim).toBeNull();
  });

  it("on reload", () => {
    component.beforeunloadHandler(new Event('reload'));
    component.claim = data;
    component.beforeunloadHandler(new Event('reload'));
    expect(component).toBeTruthy();
  });

  it("should be able to accept the claim", () => {
    spyOn(service, "acceptClaim").and.returnValue(of(true));
    component.claim = data;
    component.acceptClaim();
    expect(component.claim).toBeNull();
  });

  it("should be able to resubmit the claim", () => {
    spyOn(service, "resubmitClaim").and.returnValue(of(true));
    component.claim = data;
    component.resubmitClaim();
    expect(component.claim).toBeNull();
  });

  it("should be able to save the claim", () => {
    spyOn(service, "saveClaim").and.returnValue(of(true));
    component.claim = data;
    component.saveClaim();
    expect(component.claim).toBeNull();
  });

  it("can Deactivate", () => {
    expect(component.canDeactivate()).toBeTruthy();
    component.claim = data;
    expect(component.canDeactivate()).toBeFalsy();
  });
});
