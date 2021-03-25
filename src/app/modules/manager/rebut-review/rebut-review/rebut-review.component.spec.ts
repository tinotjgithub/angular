import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebutReviewComponent } from './rebut-review.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { ConfirmationService } from 'primeng/api';
import { ReviewService } from 'src/app/services/review/review.service';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';

describe('RebutReviewComponent', () => {
  let component: RebutReviewComponent;
  let fixture: ComponentFixture<RebutReviewComponent>;
  let service: ReviewService;
  const data = {
    auditTaskId: 14,
    auditFlowId: 23,
    claimId: "20190722001261",
    claimType: "Institutional (OP)",
    claimStatus: "Denied",
    receiptDate: "05/17/2020",
    claimsAge: 22,
    providerName: "Test Supplier1",
    memberGroupName: "Greenville",
    billedAmount: 500,
    currentLevel: 3,
    allowedAmount: 0,
    paidAmount: 0,
    processedDate: "05/17/2020 07:15",
    queueName: "hcc_super_user",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 20,
    auditorComments: ["Financial error, please verify"],
    auditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 31,
          fileName: "unnamed.jpg",
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 30,
          fileName: "frogs.jpg",
        },
      },
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 29,
          fileName: "Audit - 06012020.xlsx",
        },
      },
    ],
    status: "ACCEPT",
    examinerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg",
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg",
        },
      },
    ],
    leadAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg",
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg",
        },
      },
    ],
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    examinerId: 7,
    auditorId: 107,
    examinerComments: ["Financial error, please verify"],
    leadComments: ["Failed"],
    managerComments: "Pended",
    managerAttachmentOne: {
      filePosition: "attachmentOne",
      fileId: 32,
      fileName: "frogs.jpg",
    },
    managerAttachmentTwo: null,
    managerPreviousAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 19,
          fileName: "Test Audit Upload Details.docx",
        },
      },
    ],
    managerPreviousComments: ["Failed"],
    isComplete: false,
  };
  const dataNoFile = {
    auditTaskId: 14,
    auditFlowId: 23,
    claimId: "20190722001261",
    claimType: "Institutional (OP)",
    claimStatus: "Denied",
    receiptDate: "05/17/2020",
    claimsAge: 22,
    providerName: "Test Supplier1",
    memberGroupName: "Greenville",
    billedAmount: 500,
    currentLevel: 3,
    allowedAmount: 0,
    paidAmount: 0,
    processedDate: "05/17/2020 07:15",
    queueName: "hcc_super_user",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 20,
    auditorComments: ["Financial error, please verify"],
    auditorAttachments: null,
    status: "ACCEPT",
    examinerAttachments: null,
    leadAttachments: null,
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    examinerId: 7,
    auditorId: 107,
    examinerComments: ["Financial error, please verify"],
    leadComments: ["Failed"],
    managerComments: "Pended",
    managerAttachmentOne: null,
    managerAttachmentTwo: null,
    managerPreviousAttachments: null,
    managerPreviousComments: ["Failed"],
    isComplete: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebutReviewComponent ],
      imports: [
        CommonModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        ComponentsModule,
        ButtonModule,
        PickListModule,
        ConfirmDialogModule,
        DialogModule,
        RadioButtonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TabViewModule,
      ],
      providers: [
        TaskmanagementService,
        ConfirmationService,
        ReviewService,
        BaseHttpService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebutReviewComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ReviewService);
    fixture.detectChanges();
  });

  it('should create', () => {
    service.$claimDetailsListener = of(false);
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should load already loaded claim", () => {
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
    component.examinerAttachment = [""];
    component.claim = data;
    component.viewAttachments("test");
    expect(component.showAttachments).toBeTruthy();
    component.claim = null;
    component.viewAttachments("examinerAttachment");
    expect(component.showAttachments).toBeFalsy();
    expect(component.attachmentsPopup).toEqual([""]);
  });

  it("should download file", () => {
    spyOn<any>(service, "downloadFile").and.returnValue(of(true));
    component.downloadAttachment(data.managerAttachmentOne);
    component.downloadAttachment(data.managerAttachmentTwo);
    const element = document.createElement('a');
    spyOn<any>(document, "createElement").and.returnValue(element);
    spyOnProperty(element, "download").and.returnValue(undefined);
    component.downloadAttachment(data.managerAttachmentOne);
    spyOnProperty(window, 'navigator').and.returnValue( {
      msSaveBlob: (bl: any, name) => console.log(bl, name),
      msSaveOrOpenBlob: true
    });
    component.downloadAttachment(data.managerAttachmentOne);
    expect(component).toBeTruthy();
  });

  it("should upload file", () => {
    const spied = spyOn(service, "uploadFile").and.returnValue(of(true));
    component.claim = data;
    component.mainInput = [];
    component.uploadFile();
    component.mainInput = [
      data.managerAttachmentOne,
      {
        ...data.managerAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true,
      },
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should submit and pend", () => {
    const spied = spyOn(service, "submitOrPend").and.returnValue(of(true));
    component.claim = data;
    component.mainInput = [];
    component.submitOrPend();
    expect(component.claim).toBeNull();
    component.claim = data;
    component.mainInput = [];
    component.submitOrPend(true);
    expect(component.claim).toBeNull();
  });

  it("on reload", () => {
    component.beforeunloadHandler(new Event('reload'));
    component.claim = data;
    component.beforeunloadHandler(new Event('reload'));
    expect(component).toBeTruthy();
  });

  /* it("should get claim by flow id", () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute)
    spyOn(activatedRoute.snapshot.queryParamMap, "get").and.returnValue("2");
    spyOn(service, "getLeadClaimById").and.returnValue(of(data));
    component.ngOnInit();
    expect(component.claim).toEqual(data);
  }); */

  it("should rebut", () => {
    const spied = spyOn(service, "rebut").and.returnValue(of(true));
    component.claim = data;
    component.mainInput = [];
    component.rebut();
    expect(component.claim).toBeNull();
  });

  it("should delete file", () => {
    const spied = spyOn(service, "deleteFile").and.returnValue(of(true));
    component.claim = data;
    component.mainInput = [
      data.managerAttachmentOne
    ];
    component.deleteFile(0);
    expect(component.mainInput).toEqual([""]);
    component.mainInput = [
      data.managerAttachmentOne,
      data.managerAttachmentOne
    ];
    component.deleteFile(0);
    expect(component.mainInput).toEqual([data.managerAttachmentOne]);
  });

  it("can Deactivate", () => {
    expect(component.canDeactivate()).toBeTruthy();
    component.claim = data;
    expect(component.canDeactivate()).toBeFalsy();
  });

  it('role change', () => {
    component.claim = {
      claimId: 12,
      attachmentsCommentsForAllUsers: [
        {
          userRole: 'Manager',
          rebuttalLevel: 1
        }
      ]
    };
    component.roleChange('');
    component.roleChange('Manager');
    expect(component.allUserCommentsAttachments[1].length).toEqual(1);
  });

  it("should get claim by id", () => {
    const route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, 'get').and.returnValue("12");
    spyOn(service, 'getManagerClaimById').and.returnValue(of({...data, attachmentsCommentsForAllUsers: [
      {
        userRole: 'Manager',
        comment: 'test',
        attachments: [],
        timestamp: '',
        rebuttalLevel: 1
      }
    ]}));
    component.ngOnInit();
    expect(component.claim.claimId).toEqual("20190722001261");
  });
});
