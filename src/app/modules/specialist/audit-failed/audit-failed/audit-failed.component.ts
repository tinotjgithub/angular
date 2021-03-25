import { EnrollmentAuditorService } from './../../../enrollmet-auditor/services/enrollment-auditor.service';
import { Component, OnInit, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { HttpClient } from "@angular/common/http";
import { ConfirmationService } from "primeng/api";
import { HeaderService } from "src/app/services/header/header.service";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FILE_POSITION } from 'src/app/modules/auditor/model/auditor.model';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';
import { UtilFunctions } from 'src/app/shared/utils';

@Component({
  selector: "app-audit-failed",
  templateUrl: "./audit-failed.component.html"
})
export class AuditFailedComponent implements OnInit {
  public cols: any[];
  public subscriptionDetails: any[];
  public input: Array<any> = new Array(4);
  public currentInput: Array<any>;
  public checkListItem: any[] = [];
  public checkedItem: any[] = [];
  public subscription: any;
  public auditForm: FormGroup;
  public endTimer: string;
  public actualCheckListLength: number;
  public timerColor = "#00bf96";
  public taskId: string;
  public auditorAttachments: any[];
  public managerAttachments: any[];
  public leadAttachments: any[];
  public isRebutEnabled = false;
  public sub: Subscription;
  public auditFlowId = null;
  public examinerAttachments: any[];
  public comments: any;
  public showAttachments: boolean;
  public attachmentsPopup: any[] = [];
  public num2Str: Array<string> = [
    "Zeroth",
    "Others"
  ];
  public Oldinput: Array<any> = new Array(4);
  private interval: any;
  public allUserCommentsAttachments = {
    0: [],
    1: [],
    2: [],
    3: []
  };
  public requestTypes: any[];
  public auditFailedCount: any;
  quickLinkSnapshot: any;
  total: number;

  requestSnapshot: any;
  workCategory: WorkCategory[];
  activeWorkCategories: any[];

  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler($event) {
    $event.preventDefault();
    if (this.subscription) {
      $event.returnValue = "Are you sure?";
    }
  }

  constructor(
    private auditorService: EnrollmentAuditorService,
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private taskManagementService: TaskmanagementService,
    private enrollmentService: EnrollmentManagementService

  ) { }

  ngOnInit() {
    this.setUpTile();
    this.auditFlowId = this.route.snapshot.queryParamMap.get('auditFlowId');
    this.input = [''];
    this.Oldinput = [''];
    this.getRequestType();
    this.initiateForm();
    this.cols = [
      { field: "transactionType", header: "Transaction Type" },
      { field: "transactionCount", header: "Transaction Count" },
      { field: "subscriberName", header: "Subscriber Name" },
      { field: "memberGroupName", header: "Member Group Name" },
      { field: "memberId", header: "Member ID" },
      { field: "memberFirstName", header: "Member First Name" },
      { field: "memberLastName", header: "Member Last Name" },
      { field: "memberDob", header: "Member DOB" },
      { field: "benefitPlanName", header: "Benefit Plan ID/Name" },
      { field: "benefitPlanStartDate", header: "Benefit Plan Start Date" },
      { field: "benefitPlanEndDate", header: "Benefit Plan End Date" },
      { field: "userGroupName", header: "User Group Name" },
      { field: "errorDetails", header: "Error Details", large:true },
    ];
    this.getDataCount();
    if (this.auditFlowId !== null) {
      this.getSubscription(this.auditFlowId);
    }
  }

  displayWorkCategory(workCategory) {
    return (
      this.activeWorkCategories &&
      this.activeWorkCategories.includes(workCategory.toString().toLowerCase())
    );
  }

  setUpTile(){
    const promise = new Promise((resolve, reject) => {
      this.workCategory = [];
      this.enrollmentService.getWorkCategory().subscribe(
        resp => {
          this.workCategory = resp;
          resolve(resp);
        },
        err => {
          reject([]);
        }
      );
    });
    promise.then(resp => {
      this.setActiveWorkCategories(this.workCategory);
      this.enrollmentService
        .getEnrollmentSpecilaitMainLandingPageData()
        .subscribe(res => {
          this.requestSnapshot = res;
        });
    });
  }

  setActiveWorkCategories(workCategories: WorkCategory[] = []) {
    this.activeWorkCategories = workCategories
      .filter(item => {
        return item.workCategoryConfigActive === true;
      })
      .map(item => {
        return item.name.toString().toLowerCase();
      });
  }

  canDeactivate() {
    if (this.subscription && this.subscription.subscriptionId) {
      this.confirmationService.confirm({
        message:
          "Please Save/Submit the transaction before you navigate to other page",
        acceptLabel: "OK",
        rejectVisible: false
      });
      return false;
    } else {
      return true;
    }
  }

  initiateForm() {
    this.auditForm = this.fb.group({
      requestType: ["", []],
      subscriptionId: [{ value: "", disabled: false }, [Validators.required]],
      auditFlowId: [{ value: "", disabled: false }],
      routeToLead: [{ value: false, disabled: false }],
      specialistComment: [
        { value: "", disabled: false },
        [Validators.required]
      ],
      currentLevel: [{ value: "" }],
      transactionCount: [0]
    });
  }

  getRequestType() {
    this.enrollmentService.getUserWorkItemTypes().subscribe(res => {
      this.requestTypes = res ? res : [];
    });
  }

  getSubscription(auditFlowId = null) {
    this.subscriptionDetails = [];
    this.auditorService.getAuditFailedDetails(auditFlowId, this.auditForm.value.requestType).subscribe(res => {
      this.processSubscription(res);
    });
  }

  rebut() {
    if (this.subscription && this.subscription.subscriptionId) {
      this.confirmationService.confirm({
        message:
          "Are you sure you want to Rebut the Transaction?",
        acceptLabel: "Yes",
        rejectLabel: "No",
        accept: () => {
          this.rebutClaim();
        }
      });
    }
  }

  processSubscription(res: any) {
    this.subscriptionDetails = res ? [res] : [];
    this.subscription = res || null;
    if (this.subscription) {
      this.headerService.updateAuditClaimDetails(this.subscription);

      const files = this.subscription.examinerAttachmentDto ? [
        this.subscription.examinerAttachmentDto.attachmentOne,
        this.subscription.examinerAttachmentDto.attachmentTwo,
        this.subscription.examinerAttachmentDto.attachmentThree,
        this.subscription.examinerAttachmentDto.attachmentFour,
        this.subscription.examinerAttachmentDto.attachmentFive
      ].filter(e => e) : [];
      this.input = files.length > 0 ? files : [""];
      if (this.subscription.auditWorkflowAttachmentsAndComments && (this.subscription.auditWorkflowAttachmentsAndComments.length > 0)) {
        this.mapLevelComments();
      }
      this.setFormValues(res);
    }
  }

  private mapLevelComments() {
    this.clearAllUserComments();
    this.subscription.auditWorkflowAttachmentsAndComments.filter(d => d).forEach(e => {
      this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
    });
  }

  private clearAllUserComments() {
    this.allUserCommentsAttachments[0] = [];
    this.allUserCommentsAttachments[1] = [];
    this.allUserCommentsAttachments[2] = [];
    this.allUserCommentsAttachments[3] = [];
  }

  viewAttachments(key: string) {
    this.showAttachments = this.subscription ? true : false;
    this.attachmentsPopup = this[key] || [];
  }

  deleteFile(index) {
    this.auditorService
      .deleteFileReview(this.subscription.auditFlowId, FILE_POSITION[index + 1])
      .subscribe(res => {
        this.input.splice(index, 1);
        if (index === 0 && this.input.length < 1) {
          this.input.push("");
        }
      });
  }

  isNullOrUndefinedArray(array) {
    return array === undefined || array === null ? [] : array;
  }

  setFormValues(subscription) {
    const {
      subscriptionId,
      auditFlowId,
      currentLevel,
      specialistComment,
      transactionCount
    } = subscription;

    this.isRebutEnabled = currentLevel === 2 || currentLevel === 3 ? false : true;
    if (subscription.isTransactionCountMismatch) {
      this.auditForm.get('transactionCount').setValidators([Validators.required]);
      this.auditForm.get('transactionCount').updateValueAndValidity();
    }

    this.auditForm.patchValue({
      subscriptionId,
      auditFlowId,
      specialistComment,
      currentLevel,
      transactionCount
    });
  }

  selectRouteToLead() {
    const currentLevel = this.auditForm.get('currentLevel').value;
    if (currentLevel === 2 || currentLevel === 3) {
      this.isRebutEnabled = this.auditForm.get('routeToLead').value;
    }
  }

  downloadFile(input) {
    if (input) {
      this.auditorService.downloadFile(input.fileId).subscribe(res => {
        const responseBody = res.body;
        const blob = new Blob([responseBody]);
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, input.fileName);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", input.fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
    }
  }

  justCopy(inputElement) {
    if (!this.subscription) {
      return;
    }
    this.copyToClipBoard(inputElement);
    this.notifierService.throwNotification({
      type: "success",
      message: "Subscription ID copied"
    });
  }

  copyToClipBoard(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
    /* const range = document.createRange();
    range.selectNode(document.getElementById(inputElement));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); */
  }

  openClaimInHRP(inputElement) {
    if (!this.subscription && !this.subscription.subscriptionId) {
      return;
    }
    this.copyToClipBoard(inputElement);
    this.taskManagementService.callHealthEdge().subscribe(res => {
      if (res.status === "Failure") {
        this.notifierService.throwNotification({
          type: "error",
          message: res.message
        });
      }
    });
  }

  uploadFile() {
    const formData = new FormData();
    let fileUploaded = false;
    formData.append("auditFlowId", this.auditForm.get("auditFlowId").value);
    this.input.forEach((val, i) => {
      if (val && val.local) {
        formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        fileUploaded = true;
      }
    });

    if (fileUploaded) {
      this.auditorService.uploadFileReview(formData).subscribe(res => {
      });
    }
  }

  accept() {
    if (this.auditForm.invalid) {
      return;
    }
    const {specialistComment, transactionCount, auditFlowId} = this.auditForm.value;
    const paylod = {
      auditFlowId,
      comments: specialistComment,
      transactionCount
    };

    this.auditorService.actionAuditFailedTask(paylod, 'accept').subscribe(res => {
      this.uploadFile();
      this.resetData();
      this.notifierService.throwNotification({
        type: "success",
        message: "Changes Saved Successfully."
      });
    });
    this.headerService.updateAuditClaimDetails(null);
  }

  pend() {
    if (this.auditForm.invalid) {
      return;
    }
    const {specialistComment, transactionCount, auditFlowId} = this.auditForm.value;
    const paylod = {
      auditFlowId,
      comments: specialistComment,
      transactionCount
    };

    this.auditorService.actionAuditFailedTask(paylod, 'pend').subscribe(res => {
      this.uploadFile();
      this.resetData();
      this.notifierService.throwNotification({
        type: "success",
        message: "Changes Saved Successfully."
      });
    });
    this.headerService.updateAuditClaimDetails(null);
  }

  rebutClaim() {
    if (this.auditForm.invalid) {
      return;
    }
    const {specialistComment, transactionCount, auditFlowId, routeToLead} = this.auditForm.value;
    const paylod = {
      auditFlowId,
      comments: specialistComment,
      transactionCount,
      routeToLead
    };

    this.auditorService.actionAuditFailedTask(paylod, 'rebut').subscribe(res => {
      this.uploadFile();
      this.resetData();
      this.notifierService.throwNotification({
        type: "success",
        message: "Changes Saved Successfully."
      });
    });
    this.headerService.updateAuditClaimDetails(null);
  }

  resetData() {
    this.subscriptionDetails = [];
    this.attachmentsPopup = [];
    this.subscription = null;
    this.initiateForm();
    clearInterval(this.interval);
    this.endTimer = "00:00:00";
    this.timerColor = "#00bf96";
    this.input = [""];
    this.Oldinput = [""];
    this.headerService.updateAuditClaimDetails(null);
    this.getDataCount();
  }

  roleChange(val) {
    if (val) {
      this.clearAllUserComments();
      this.subscription.auditWorkflowAttachmentsAndComments.filter(d => d && (d.userRole === val)).forEach(e => {
        this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
      });
    } else {
      this.mapLevelComments();
    }
  }

  getDataCount() {
    this.enrollmentService
      .getEnrollmentSpecilaitMainLandingPageData()
      .subscribe(res => {
        this.auditFailedCount = res ? res.auditFailed : null;
        this.requestSnapshot = UtilFunctions.processWorkCatgoryResp(this.auditFailedCount);
      });
  }
  
  increment(temp) {
    const formGroup = this.auditForm.get(temp);
    const isValid = formGroup && (formGroup.value || formGroup.value > 0) && Number(formGroup.value) !== NaN;
    formGroup.setValue(isValid ? Number(formGroup.value) + 1 : 1);
  }
  
  decrement(temp) {
    const formGroup = this.auditForm.get(temp);
    const isValid = formGroup && formGroup.value && Number(formGroup.value) !== NaN;
    formGroup.setValue(isValid ? (Number(formGroup.value) - 1) > 0 ? (Number(formGroup.value) - 1) : 1 : 1);
  }  

  preventInput(event) {
    const val = event.target.value;
    this.auditForm.patchValue({
      transactionCount: val.replace(/[^0-9]/g, '')
    });
    if (val !== null && val !== '' && val == 0) {
      this.auditForm.patchValue({
        transactionCount: 1
      });
    }
  }
}

class WorkCategory {
  id: number;
  name: string;
  workCategoryConfigActive: boolean;
}