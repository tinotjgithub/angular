import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { delay } from "rxjs/operators";
// import { BulkUploadComponent } from './rebut-review.component';
import { BulkUploadComponent } from "./bulk-upload.component";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ButtonModule } from "primeng/button";
import { PickListModule } from "primeng/picklist";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { RadioButtonModule } from "primeng/radiobutton";
import { RouterTestingModule } from "@angular/router/testing";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { ConfirmationService } from "primeng/api";
import { ReviewService } from "src/app/services/review/review.service";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, Observable, throwError } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { mockReport } from "src/app/mocks/dashboard-mock-data";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";
import { ManualSamplingService } from "../../auditor/manual-sampling/services/manual-sampling.service";
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

class MockManualSamplingService {
  importDiagnosisOrProcedureCodeFile() {
    return of(mockReport);
  }
}
class MockTaskMgtService {
  uploadFileReasonTemplate() {
    return of(mockReport);
  }
  userUploadTemplate() {
    return of(mockReport);
  }
  userUploadTemplateListner() {
    return of(mockReport);
  }
  userGrpUploadTemplate() {
    return of(mockReport);
  }
  uploadFileReason() {
    return of(mockReport);
  }
  uploadFileUsers() {
    return of(null);
  }
  uploadFileUserGroups() {
    return of(null);
  }
  getUserReportListner() {
    return of(null);
  }
  uploadFileReasonTemplateListner() {
    return of(mockReport);
  }
  getUserGrpReportListner() {
    return of(null);
  }
  getReasonReportListner() {
    return of(mockReport);
  }
  userGrpUploadTemplateListner() {
    return of(mockReport);
  }
  getChecklistReportListner() {
    return of(mockReport);
  }
}

class MockReviewService {
  uploadFileChecklistTemplate() {
    return of(mockReport);
  }
  uploadFileChecklistTemplateListner() {
    return of(mockReport);
  }
  uploadFileChecklist() {
    return of(mockReport);
  }
  getChecklistReportListner() {
    return of(mockReport);
  }
}

class MockNotiferService extends NotifierService {
  throwNotification(notification) {
    this.notifierListener.next({
      type: notification.type,
      message: notification.message
    });
  }
}

describe("BulkUploadComponent", () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let service: ReviewService;
  let manualSamplingService: ManualSamplingService;
  let tskservice: MockTaskMgtService;
  let manualService: MockManualSamplingService;
  let reviewSer: MockReviewService;
  let notifierServices: NotifierService;
  const data = {
    auditTaskId: 19,
    auditFlowId: 47,
    claimId: "20190603000765",
    claimType: "Institutional (IP)",
    claimStatus: "Final",
    receiptDate: "05/17/2020",
    claimsAge: 19,
    providerName: "Test Supplier1",
    memberGroupName: "Test Account - 01",
    billedAmount: 2000,
    allowedAmount: 2000,
    paidAmount: 2000,
    processedDate: "05/17/2020 07:32",
    queueName: "hcc_super_user",
    errorType: null,
    financialImpact: null,
    currentLevel: 3,
    auditorAmount: null,
    auditorComments: ["Rebutted ", "Failed due to financial error"],
    auditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 31,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 30,
          fileName: "frogs.jpg"
        }
      },
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 29,
          fileName: "Audit - 06012020.xlsx"
        }
      }
    ],
    status: "ACCEPTED",
    managerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    examinerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    examinerName: "Brian Blaze",
    auditorName: "Brian Blaze",
    isComplete: true,
    examinerId: 107,
    auditorId: 107,
    examinerComments: ["rebutted"],
    managerComments: ["rebutted"],
    isRebut: false,
    leadComments: "Pended",
    leadAttachmentOne: {
      filePosition: "attachmentOne",
      fileId: 32,
      fileName: "frogs.jpg"
    },
    leadAttachmentTwo: null,
    prevLeadAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 37,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 36,
          fileName: "frogs.jpg"
        }
      }
    ],
    prevLeadComments: ["Rebutted"]
  };
  const dataNoFile = {
    auditTaskId: 19,
    auditFlowId: 47,
    claimId: "20190603000765",
    claimType: "Institutional (IP)",
    claimStatus: "Final",
    receiptDate: "05/17/2020",
    claimsAge: 19,
    providerName: "Test Supplier1",
    memberGroupName: "Test Account - 01",
    billedAmount: 2000,
    allowedAmount: 2000,
    paidAmount: 2000,
    processedDate: "05/17/2020 07:32",
    queueName: "hcc_super_user",
    errorType: null,
    financialImpact: null,
    currentLevel: 3,
    auditorAmount: null,
    auditorComments: ["Rebutted ", "Failed due to financial error"],
    auditorAttachments: null,
    status: "ACCEPTED",
    managerAttachments: null,
    examinerAttachments: null,
    examinerName: "Brian Blaze",
    auditorName: "Brian Blaze",
    isComplete: true,
    examinerId: 107,
    auditorId: 107,
    examinerComments: ["rebutted"],
    managerComments: ["rebutted"],
    isRebut: false,
    leadComments: "Pended",
    leadAttachmentOne: null,
    leadAttachmentTwo: null,
    prevLeadAttachments: null,
    prevLeadComments: ["Rebutted"]
  };

  beforeEach(async(() => {
    tskservice = new MockTaskMgtService();
    manualService = new MockManualSamplingService();
    reviewSer = new MockReviewService();
    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
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
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskmanagementService, useValue: tskservice },
        { provide: ManualSamplingService, useValue: manualService },
        { provide: ReviewService, useClass: MockReviewService  },
        { provide: NotifierService, useClass: MockNotiferService },
        DatePipe,
        ConfirmationService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    manualSamplingService = fixture.debugElement.injector.get(
      ManualSamplingService
    );
    service = fixture.debugElement.injector.get(ReviewService);
    notifierServices = fixture.debugElement.injector.get(NotifierService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should download file", () => {
    spyOn<any>(service, "downloadFile").and.returnValue(of(true));
    component.downloadAttachment(data.leadAttachmentOne);
    component.downloadAttachment(data.leadAttachmentTwo);
    const element = document.createElement("a");
    spyOn<any>(document, "createElement").and.returnValue(element);
    spyOnProperty(element, "download").and.returnValue(undefined);
    component.downloadAttachment(data.leadAttachmentOne);
    expect(component).toBeTruthy();
    spyOnProperty(window, "navigator").and.returnValue({
      msSaveBlob: (bl: any, name) => console.log(bl, name),
      msSaveOrOpenBlob: true
    });
    component.downloadAttachment(data.leadAttachmentOne);
  });

  it("should call upload file user group service", fakeAsync(() => {
    component.showSpinner = true;
    const spy = spyOn(tskservice, "uploadFileUserGroups")
      .and.returnValue(mockReport)
      .and.callThrough();
    const spyList = spyOn(tskservice, "getUserGrpReportListner")
      .and.returnValue(mockReport)
      .and.callThrough();
    fixture.detectChanges();
    component.downloadUserGrpExcel({});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyList).toHaveBeenCalledTimes(1);
  }));

  it("should call upload file user group service and return value null", fakeAsync(() => {
    const spy = spyOn(tskservice, "uploadFileUserGroups").and.callThrough();
    const spyList = spyOn(
      tskservice,
      "getUserGrpReportListner"
    ).and.callThrough();
    fixture.detectChanges();
    component.downloadUserGrpExcel({});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyList).toHaveBeenCalledTimes(1);
  }));

  it("should call upload file user service when value is present", fakeAsync(() => {
    const spy = spyOn(tskservice, "uploadFileUsers")
      .and.returnValue(mockReport)
      .and.callThrough();
    const spyList = spyOn(tskservice, "getUserReportListner")
      .and.returnValue(mockReport)
      .and.callThrough();
    fixture.detectChanges();
    component.ngOnInit();
    const formData = new FormData();
    component.downloadUserExcel(formData);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyList).toHaveBeenCalledTimes(1);
  }));

  it("should call upload file user service when value is null", fakeAsync(() => {
    const spy = spyOn(tskservice, "uploadFileUsers").and.callThrough();
    const spyList = spyOn(tskservice, "getUserReportListner").and.callThrough();
    fixture.detectChanges();
    component.ngOnInit();
    const formData = new FormData();
    component.downloadUserExcel(formData);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyList).toHaveBeenCalledTimes(1);
  }));

  it("should call excel service", () => {
    const formData = new FormData();
    const createFakeFile = (fileName: string = "fileName"): File => {
      const blob: any = new Blob([""], { type: "text/html" });
      blob.header = fileName;
      blob.body = blob;
      return blob as File;
    };
    const servSpy = spyOn(service, "uploadFileChecklist")
      .and.returnValue(null)
      .and.callThrough();
    const listSpy = spyOn(service, "getChecklistReportListner")
      .and.returnValue(null)
      .and.callThrough();
    component.checklistReportDto = createFakeFile;
    fixture.detectChanges();
    component.downloadChecklistExcel(formData);
    expect(listSpy).toHaveBeenCalled();
    expect(servSpy).toHaveBeenCalled();
  });
  it("should call upload reason service", () => {
    const spy = spyOn(tskservice, "uploadFileReason")
      .and.returnValue(mockReport)
      .and.callThrough();
    const spyList = spyOn(tskservice, "getReasonReportListner")
      .and.returnValue(mockReport)
      .and.callThrough();
    component.downloadReasonExcel({});
    expect(spyList).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("should call template user from service", () => {
    component.mode = "user";
    fixture.detectChanges();
    const spyDwnload = spyOn(tskservice, "userUploadTemplate")
      .and.returnValue(mockReport)
      .and.callThrough();
    const spy = spyOn(
      tskservice,
      "userUploadTemplateListner"
    ).and.callThrough();
    component.downloadTemplatUserExcel();
    expect(spyDwnload).toHaveBeenCalledTimes(1);
  });

  it("should call template user group from service", () => {
    component.mode = "userGroup";
    fixture.detectChanges();
    const spyDwnload = spyOn(tskservice, "userGrpUploadTemplate")
      .and.returnValue(mockReport)
      .and.callThrough();
    const spListner = spyOn(tskservice, "userGrpUploadTemplateListner")
      .and.returnValue(mockReport)
      .and.callThrough();
    component.downloadTemplatUserGroupExcel();
    expect(spyDwnload).toHaveBeenCalledTimes(1);
    expect(spListner).toHaveBeenCalledTimes(1);
  });
  it("should call success message from notifier service", () => {
    component.mode = "userGroup";
    fixture.detectChanges();
    const spy = spyOn(notifierServices, "throwNotification");
    component.successMsg();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("should call failure message from notifier service", () => {
    component.mode = "userGroup";
    fixture.detectChanges();
    const spy = spyOn(notifierServices, "throwNotification");
    component.failureMsg();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should call template user checklist from service", () => {
    component.mode = "userCheckist";
    fixture.detectChanges();
    const spyDwnload = spyOn(
      service,
      "uploadFileChecklistTemplate"
    ).and.callThrough();
    const spyList = spyOn(
      service,
      "uploadFileChecklistTemplateListner"
    ).and.callThrough();
    component.downloadTemplatChecklistExcel();
    expect(spyDwnload).toHaveBeenCalledTimes(1);
    expect(spyList).toHaveBeenCalledTimes(1);
  });

  it("should call template reason from service", () => {
    component.mode = "userReason";
    fixture.detectChanges();
    const spyDwnload = spyOn(tskservice, "uploadFileReasonTemplate")
      .and.returnValue(of(mockReport))
      .and.callThrough();
    const spyListner = spyOn(tskservice, "uploadFileReasonTemplateListner")
      .and.returnValue(of(mockReport))
      .and.callThrough();
    component.downloadTemplateReasonExcel();
    expect(spyDwnload).toHaveBeenCalledTimes(1);
    expect(spyListner).toHaveBeenCalled();
  });

  it("should reset Data when called", () => {
    component.resetData();
    expect(component.attachmentTab).toEqual("addAttachment");
  });

  it("should download file in excel format", () => {
    const spyObj = document.createElement("a");
    const blob = new Blob([mockReport.body], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const today = new Date();
    const url = URL.createObjectURL(blob);
    const dateString = component.datePipe.transform(today, "MMddyyyy");
    spyObj.setAttribute("href", url);
    spyObj.setAttribute(
      "download",
      "Claims_Count_By_Status" + dateString + ".xlsx"
    );
    document.body.appendChild(spyObj);
    spyOn(document, "createElement").and.returnValue(spyObj);
    const syy = spyOn(spyObj, "click");
    fixture.detectChanges();
    component.downloadFile(mockReport, "Checklist_Import_Status_");
    // tslint:disable-next-line: deprecation
    expect(document.createElement).toHaveBeenCalledTimes(1);
    // tslint:disable-next-line: deprecation
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(syy).toHaveBeenCalled();
    expect(spyObj.download).toBe(
      "Checklist_Import_Status_" + dateString + ".xlsx"
    );
  });
  it("should not download file", () => {
    const today = new Date();
    const dateString = component.datePipe.transform(today, "MMddyyyy");
    const spyObj = document.createElement("a");
    document.body.appendChild(spyObj);
    const syy = spyOn(spyObj, "click");
    fixture.detectChanges();
    component.downloadFile(mockReport, "Checklist_Import_Status_");
    expect(syy).not.toHaveBeenCalled();
    expect(spyObj.download).not.toBe(
      "Checklist_Import_Status_" + dateString + ".xlsx"
    );
  });
  it("should not download file when download is undefined", () => {
    const today = new Date();
    const dateString = component.datePipe.transform(today, "MMddyyyy");
    const spyObj = document.createElement("u");
    document.body.appendChild(spyObj);
    const syy = spyOn(spyObj, "click");
    fixture.detectChanges();
    component.downloadFile(mockReport, "Checklist_Import_Status_");
    expect(syy).not.toHaveBeenCalled();
  });

  it("should download template file in excel format", () => {
    const spyObj = document.createElement("a");
    const blob = new Blob([mockReport.body], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const today = new Date();
    const url = URL.createObjectURL(blob);
    const dateString = component.datePipe.transform(today, "MMddyyyy");
    spyObj.setAttribute("href", url);
    spyObj.setAttribute("download", "Claims_Count_By_Status" + ".xlsx");
    document.body.appendChild(spyObj);
    spyOn(document, "createElement").and.returnValue(spyObj);
    const syy = spyOn(spyObj, "click");
    fixture.detectChanges();
    component.downloadTemplateFile(mockReport, "Checklist_Import_Template");
    // tslint:disable-next-line: deprecation
    expect(document.createElement).toHaveBeenCalledTimes(1);
    // tslint:disable-next-line: deprecation
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(syy).toHaveBeenCalled();
    expect(spyObj.download).toBe("Checklist_Import_Template" + ".xlsx");
  });
  it("should not download file", () => {
    const today = new Date();
    const dateString = component.datePipe.transform(today, "MMddyyyy");
    const spyObj = document.createElement("a");
    document.body.appendChild(spyObj);
    const syy = spyOn(spyObj, "click");
    fixture.detectChanges();
    component.downloadTemplateFile(mockReport, "Checklist_Import_Template");
    expect(syy).not.toHaveBeenCalled();
    expect(spyObj.download).not.toBe("Checklist_Import_Template" + ".xlsx");
  });
  it("should not download file when download is undefined", () => {
    const today = new Date();
    const dateString = component.datePipe.transform(today, "MMddyyyy");
    const spyObj = document.createElement("u");
    document.body.appendChild(spyObj);
    const syy = spyOn(spyObj, "click");
    fixture.detectChanges();
    component.downloadTemplateFile(mockReport, "Checklist_Import_Template");
    expect(syy).not.toHaveBeenCalled();
  });

  it("should upload file for user checklist", () => {
    const spied = spyOn(component, "downloadChecklistExcel");
    component.mode = "userCheckist";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for user", () => {
    const spied = spyOn(component, "downloadUserExcel");
    component.mode = "user";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for user group", () => {
    const spied = spyOn(component, "downloadUserGrpExcel");
    component.mode = "userGroup";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for user reasons", () => {
    const spied = spyOn(component, "downloadReasonExcel");
    component.mode = "userReasons";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for diagnosis-code when present", () => {
    const spied = spyOn(
      component,
      "importDiagnosisOrProcedureCodeFile"
    ).and.returnValue(mockReport);
    component.mode = "diagnosis-code";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    fixture.detectChanges();
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for procedure-code value is not null", () => {
    const spied = spyOn(
      component,
      "importDiagnosisOrProcedureCodeFile"
    ).and.returnValue(null);

    component.mode = "procedure-code";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    fixture.detectChanges();
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for diagnosis-code when return value is not null", () => {
    const spied = spyOn(component, "importDiagnosisOrProcedureCodeFile");
    component.mode = "diagnosis-code";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    fixture.detectChanges();
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file template for user checklist", () => {
    const spied = spyOn(component, "downloadTemplatChecklistExcel");
    component.mode = "userCheckist";
    component.downloadTemplateExcel();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file template for user", () => {
    const spied = spyOn(component, "downloadTemplatUserExcel");
    component.mode = "user";
    component.downloadTemplateExcel();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file template for user group", () => {
    const spied = spyOn(component, "downloadTemplatUserGroupExcel");
    component.mode = "userGroup";
    component.downloadTemplateExcel();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file template for user reasons", () => {
    const spied = spyOn(component, "downloadTemplateReasonExcel");
    component.mode = "userReasons";
    component.downloadTemplateExcel();
    expect(spied).toHaveBeenCalled();
  });

  it("should import Diagnosis Or Procedure Code File", () => {
    const formData = new FormData();
    const spied = spyOn(
      manualService,
      "importDiagnosisOrProcedureCodeFile"
    ).and.returnValue(of(mockReport));
    fixture.detectChanges();
    component.importDiagnosisOrProcedureCodeFile(formData);
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for user checklist", () => {
    const spied = spyOn(component, "downloadChecklistExcel");
    component.mode = "userCheckist";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for user", () => {
    const spied = spyOn(component, "downloadUserExcel");
    component.mode = "user";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for user group", () => {
    const spied = spyOn(component, "downloadUserGrpExcel");
    component.mode = "userGroup";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for user reasons", () => {
    const spied = spyOn(component, "downloadReasonExcel");
    component.mode = "userReasons";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for diagnosis-code", () => {
    const spied = spyOn(
      component,
      "importDiagnosisOrProcedureCodeFile"
    ).and.returnValue(mockReport);
    component.mode = "diagnosis-code";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file for procedure-code", () => {
    const spied = spyOn(
      component,
      "importDiagnosisOrProcedureCodeFile"
    ).and.returnValue(null);

    component.mode = "procedure-code";
    component.input = [];
    component.uploadFile();
    component.input = [
      data.leadAttachmentOne,
      {
        ...data.leadAttachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file template for user checklist", () => {
    const spied = spyOn(component, "downloadTemplatChecklistExcel");
    component.mode = "userCheckist";
    component.downloadTemplateExcel();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file template for user", () => {
    const spied = spyOn(component, "downloadTemplatUserExcel");
    component.mode = "user";
    component.downloadTemplateExcel();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file template for user group", () => {
    const spied = spyOn(component, "downloadTemplatUserGroupExcel");
    component.mode = "userGroup";
    component.downloadTemplateExcel();
    expect(spied).toHaveBeenCalled();
  });

  it("should upload file template for user reasons", () => {
    const spied = spyOn(component, "downloadTemplateReasonExcel");
    component.mode = "userReasons";
    component.downloadTemplateExcel();
    expect(spied).toHaveBeenCalled();
  });

  it("should import Diagnosis Or Procedure Code File", () => {
    const formData = new FormData();
    const spied = spyOn(
      manualSamplingService,
      "importDiagnosisOrProcedureCodeFile"
    ).and.returnValue(of(true));
    fixture.detectChanges();
    component.importDiagnosisOrProcedureCodeFile(formData);
    expect(spied).toHaveBeenCalled();
  });

  it("On init users should be loaded", fakeAsync(() => {
    const spy = spyOn(
      manualSamplingService,
      "importDiagnosisOrProcedureCodeFile"
    ).and.returnValue(of([{ status: 404 }]).pipe(delay(1)));
    const formData = new FormData();
    const notifierSpy = spyOn(notifierServices, "throwNotification");
    tick(1);
    fixture.detectChanges();
    component.importDiagnosisOrProcedureCodeFile(formData);
    expect(spy).toHaveBeenCalledWith(null);
    expect(notifierSpy).toHaveBeenCalled();
  }));
});
