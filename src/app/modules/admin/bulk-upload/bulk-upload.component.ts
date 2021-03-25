import { Component, OnInit, OnDestroy } from "@angular/core";
import { ReviewService } from "src/app/services/review/review.service";
import { FILE_POSITION } from "./../../auditor/model/auditor.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "./../../../services/task-management/taskmanagement.service";
import { NotifierService } from "src/app/services/notifier.service";
import { DatePipe } from "@angular/common";
import { ManualSamplingService } from "../../auditor/manual-sampling/services/manual-sampling.service";
import { timeout, catchError } from "rxjs/operators";

@Component({
  selector: "app-bulk-upload",
  templateUrl: "./bulk-upload.component.html"
})
export class BulkUploadComponent implements OnInit, OnDestroy {
  public editUser: any;
  public bulkSub: Subscription = new Subscription();
  userGrpReportSubscription: Subscription = new Subscription();
  userReportSubscription: Subscription = new Subscription();
  checklistReportSubscription: Subscription = new Subscription();
  reasonReportSubscription: Subscription = new Subscription();
  userGrpReportTemplateSubscription: Subscription = new Subscription();
  userReportTemplateSubscription: Subscription = new Subscription();
  checklistReportTemplateSubscription: Subscription = new Subscription();
  reasonReportTemplateSubscription: Subscription = new Subscription();
  public mode: any;
  userGrpReportDto: any;
  userReportDto: any;
  checklistReportDto: any;
  reasonReportDto: any;

  reasonReportTemplateDto: any;
  userGrpReportTemplateDto: any;
  userReportTemplateDto: any;
  checklistReportTemplateDto: any;
  public cols: any[];
  public claimDetails: any[];
  public input: Array<any> = new Array(1);
  public examinerAttachment: any[] = [];
  showSpinner = false;
  public showAttachments: boolean;
  public attachmentsPopup: any[] = [];
  public attachmentTab = "addAttachment";
  isCodeFile = false;
  constructor(
    private reviewService: ReviewService,
    private notifierServices: NotifierService,
    private route: ActivatedRoute,
    private taskmanagementService: TaskmanagementService,
    private router: Router,
    public datePipe: DatePipe,
    private auditService: ManualSamplingService
  ) {}

  ngOnInit() {
    this.bulkSub = this.route.queryParams.subscribe(params => {
      this.mode = params.mode || "";
      if (this.mode === "diagnosis-code" || this.mode === "procedure-code") {
        this.isCodeFile = true;
      }
    });
  }

  downloadAttachment(fileInfo) {
    if (fileInfo) {
      this.reviewService.downloadFile(fileInfo.fileId).subscribe(res => {
        const responseBody = res.body;
        const blob = new Blob([responseBody]);
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, fileInfo.fileName);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileInfo.fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
    }
  }

  uploadFile() {
    if (
      this.input.length > 0 &&
      this.input.filter(e => e && e.local).length > 0
    ) {
      const formData = new FormData();
      this.input.forEach((val, i) => {
        if (val && val.local) {
          if (
            this.mode === "diagnosis-code" ||
            this.mode === "procedure-code"
          ) {
            formData.append(
              this.mode === "diagnosis-code"
                ? "diagnosisCodeFile"
                : "procedureCodeFile",
              val.value,
              val.name
            );
          } else {
            formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
          }
        }
      });
      this.mode === "userCheckist"
        ? this.downloadChecklistExcel(formData)
        : this.mode === "user"
        ? this.downloadUserExcel(formData)
        : this.mode === "userGroup"
        ? this.downloadUserGrpExcel(formData)
        : this.mode === "diagnosis-code"
        ? this.importDiagnosisOrProcedureCodeFile(formData)
        : this.mode === "procedure-code"
        ? this.importDiagnosisOrProcedureCodeFile(formData)
        : this.downloadReasonExcel(formData);
      this.resetData();
    } else {
      this.notifierServices.throwNotification({
        type: "error",
        message: "No file selected for upload!"
      });
    }
  }

  downloadTemplateExcel() {
    this.mode === "userCheckist"
      ? this.downloadTemplatChecklistExcel()
      : this.mode === "user"
      ? this.downloadTemplatUserExcel()
      : this.mode === "userGroup"
      ? this.downloadTemplatUserGroupExcel()
      : this.downloadTemplateReasonExcel();
    this.resetData();
  }

  importDiagnosisOrProcedureCodeFile(formData) {
    this.showSpinner = true;
    this.auditService
      .importDiagnosisOrProcedureCodeFile(formData)
      .pipe(
        timeout(3600000),
        catchError(e => {
          this.notifierServices.throwNotification({
            type: "error",
            message: "Upload timed out! Please try again."
          });
          this.showSpinner = false;
          return null;
        })
      )
      .subscribe(
        res => {
          if (res === null) {
            this.showSpinner = false;
            this.failureMsg();
            return;
          }
          this.showSpinner = false;
          this.successMsg();
        },
        err => {
          this.showSpinner = false;
          this.notifierServices.throwNotification({
            type: "error",
            message: "Failed to upload!"
          });
        }
      );
  }

  downloadUserGrpExcel(formData) {
    this.taskmanagementService.uploadFileUserGroups(formData);
    this.userGrpReportDto = this.taskmanagementService.userGrpUploadResponse;
    this.showSpinner = true;
    this.userGrpReportSubscription = this.taskmanagementService
      .getUserGrpReportListner()
      .subscribe(data => {
        if (data === null) {
          this.showSpinner = false;
          this.failureMsg();
          this.userGrpReportSubscription.unsubscribe();
          return;
        }
        this.userGrpReportDto = data;
        this.downloadFile(this.userGrpReportDto, "User_Group_Import_");
        this.showSpinner = false;
        this.successMsg();
        this.userGrpReportSubscription.unsubscribe();
      });
  }

  downloadUserExcel(formData) {
    this.taskmanagementService.uploadFileUsers(formData);
    this.userReportDto = this.taskmanagementService.userUploadResponse;
    this.showSpinner = true;
    this.userReportSubscription = this.taskmanagementService
      .getUserReportListner()
      .subscribe(data => {
        if (data === null) {
          this.showSpinner = false;
          this.failureMsg(); 
          this.userReportSubscription.unsubscribe();
          return;
        }
        this.userReportDto = data;
        this.downloadFile(this.userReportDto, "User_Import_Status_");
        this.showSpinner = false;
        this.successMsg();
        this.userReportSubscription.unsubscribe();
      });
  }

  downloadChecklistExcel(formData) {
    this.reviewService.uploadFileChecklist(formData);
    this.checklistReportDto = this.reviewService.checklistUploadResponse;
    this.showSpinner = true;
    this.checklistReportSubscription = this.reviewService
      .getChecklistReportListner()
      .subscribe(data => {
        if (data === null) {
          this.showSpinner = false;
          this.failureMsg();
          this.checklistReportSubscription.unsubscribe();
          return;
        }
        this.checklistReportDto = data;
        this.downloadFile(this.checklistReportDto, "Checklist_Import_Status_");
        this.showSpinner = false;
        this.successMsg();
        this.checklistReportSubscription.unsubscribe();
      });
  }

  downloadReasonExcel(formData) {
    this.taskmanagementService.uploadFileReason(formData);
    this.reasonReportDto = this.taskmanagementService.reasonUploadResponse;
    this.showSpinner = true;
    this.reasonReportSubscription = this.taskmanagementService
      .getReasonReportListner()
      .subscribe(data => {
        if (data === null) {
          this.showSpinner = false;
          this.failureMsg();
          this.reasonReportSubscription.unsubscribe();
          return;
        }
        this.reasonReportDto = data;
        this.downloadFile(this.reasonReportDto, "Reasons_Import_Status_");
        this.showSpinner = false;
        this.successMsg();
        this.reasonReportSubscription.unsubscribe();
      });
  }

  downloadTemplateReasonExcel() {
    this.taskmanagementService.uploadFileReasonTemplate();
    this.reasonReportTemplateDto = this.taskmanagementService.uploadFileReasonTemplateResponse;
    this.reasonReportTemplateSubscription = this.taskmanagementService
      .uploadFileReasonTemplateListner()
      .subscribe(data => {
        this.reasonReportTemplateDto = data;
        this.downloadTemplateFile(
          this.reasonReportTemplateDto,
          "Reasons_Import_Template"
        );
        this.reasonReportTemplateSubscription.unsubscribe();
      });
  }

  downloadTemplatUserGroupExcel() {
    this.taskmanagementService.userGrpUploadTemplate();
    this.reasonReportTemplateDto = this.taskmanagementService.userGrpUploadTemplateResponse;
    this.userGrpReportTemplateSubscription = this.taskmanagementService
      .userGrpUploadTemplateListner()
      .subscribe(data => {
        this.reasonReportTemplateDto = data;
        this.downloadTemplateFile(
          this.reasonReportTemplateDto,
          "User_Group_Import_Template"
        );
        this.userGrpReportTemplateSubscription.unsubscribe();
      });
  }

  downloadTemplatUserExcel() {
    this.taskmanagementService.userUploadTemplate();
    this.reasonReportTemplateDto = this.taskmanagementService.userUploadTemplateResponse;
    this.userReportTemplateSubscription = this.taskmanagementService
      .userUploadTemplateListner()
      .subscribe(data => {
        this.reasonReportTemplateDto = data;
        this.downloadTemplateFile(
          this.reasonReportTemplateDto,
          "User_Import_Template"
        );
        this.userReportTemplateSubscription.unsubscribe();
      });
  }

  downloadTemplatChecklistExcel() {
    this.reviewService.uploadFileChecklistTemplate();
    this.reasonReportTemplateDto = this.reviewService.uploadChecklistTemplateResponse;
    this.checklistReportTemplateSubscription = this.reviewService
      .uploadFileChecklistTemplateListner()
      .subscribe(data => {
        this.reasonReportTemplateDto = data;
        this.downloadTemplateFile(
          this.reasonReportTemplateDto,
          "Checklist_Import_Template"
        );
        this.checklistReportTemplateSubscription.unsubscribe();
      });
  }

  downloadFile(bulkReport: any, excelTitle) {
    const responseBody = bulkReport.body;
    const blob = new Blob([responseBody], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const today = new Date();
    const dateString = this.datePipe.transform(today, "MMddyyyy");
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, excelTitle + dateString + ".xlsx");
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", excelTitle + dateString + ".xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  downloadTemplateFile(response: any, fileName: string) {
    const responseBody = response.body;
    const blob = new Blob([responseBody], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, fileName + ".xlsx");
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName + ".xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  successMsg() {
    this.notifierServices.throwNotification({
      type: "success",
      message: "File uploaded successfully!"
    });
  }

  failureMsg() {
    this.notifierServices.throwNotification({
      type: "error",
      message: "File could not be uploaded! Something went wrong!"
    });
  }

  resetData() {
    this.claimDetails = [];
    this.input = [""];
    this.attachmentTab = "addAttachment";
  }

  ngOnDestroy() {
    this.bulkSub.unsubscribe();
    this.userGrpReportSubscription.unsubscribe();
    this.userReportSubscription.unsubscribe();
    this.checklistReportSubscription.unsubscribe();
    this.reasonReportSubscription.unsubscribe();
  }
}
