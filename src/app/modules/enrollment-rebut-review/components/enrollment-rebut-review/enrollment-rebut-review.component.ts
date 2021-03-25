import { ManagerEnrollmentLandingPageService } from "./../../../manager/landing-page/services/manager-enrollment-landing-page.service";
import { EmrollmentLeadLandingPageService } from "./../../../enrollment-ops/enrollment-lead/enrollment-lead-landing-page/services/emrollment-lead-landing-page.service";
import { EnrollmentAuditorService } from "./../../../enrollmet-auditor/services/enrollment-auditor.service";
import { Component, OnInit, HostListener } from "@angular/core";
import { HeaderService } from "src/app/services/header/header.service";
import { NotifierService } from "src/app/services/notifier.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { FILE_POSITION } from "src/app/modules/auditor/model/auditor.model";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { EnrollmentRebutReviewService } from "../../services/enrollment-rebut-review.service";

@Component({
  selector: "app-enrollment-rebut-review",
  templateUrl: "./enrollment-rebut-review.component.html",
  styleUrls: ["./enrollment-rebut-review.component.css"]
})
export class EnrollmentRebutReviewComponent implements OnInit {
  public cols: any[];
  public subscriptionDetails: any[];
  public mainInput: Array<any>;
  public subscription: any;
  public auditorAttachment: any[];
  public specialistAttachment: any[];
  public leadAttachment: any[];
  public attachmentsPopup: any[] = [];
  public showAttachments: boolean;
  public routeTo: boolean;
  public comments: any;
  public num2Str: Array<string> = [
    "Zeroth",
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth"
  ];
  public tab = "enterComments";
  public attachmentTab = "addAttachment";
  public previousAttachments: any;
  private flowId: any;
  public allUserCommentsAttachments = {
    0: [],
    1: [],
    2: [],
    3: []
  };
  public requestType: string;
  public requestTypes: any[];
  public isManager: boolean;
  public reviewRebuttalCount: any[];
  public totalReview: number;
  public type = "";

  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler($event) {
    $event.preventDefault();
    if (this.subscription) {
      $event.returnValue = "Are you sure?";
    }
  }

  constructor(
    private auditorService: EnrollmentAuditorService,
    private headerService: HeaderService,
    private notifierService: NotifierService,
    private taskManagementService: TaskmanagementService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private enrollmentService: EnrollmentManagementService,
    private securedLocalStorage: CryptoService,
    private service: EmrollmentLeadLandingPageService,
    private managerService: ManagerEnrollmentLandingPageService,
    private enrollmentRebutReviewService: EnrollmentRebutReviewService,
    public router: Router
  ) {}

  canDeactivate() {
    if (this.subscription && this.subscription.claimId) {
      this.confirmationService.confirm({
        message:
          "Please Pend/Rebut/Submit the transaction before you navigate to other page",
        acceptLabel: "OK",
        rejectVisible: false
      });
      return false;
    } else {
      return true;
    }
  }

  ngOnInit() {
    const role = this.securedLocalStorage.getItem("roleId");
    this.isManager = role && role === "Manager";
    this.setCols();
    this.getRequestType();
    this.flowId = this.activatedRoute.snapshot.queryParamMap.get("flowId");
    this.type = this.activatedRoute.snapshot.queryParamMap.get("type");
    if (this.flowId) {
      this.getSubscriptionByID();
    }
    this.mainInput = [""];
    this.getStatusCounts();
  }

  getStatusCounts() {
    this.reviewRebuttalCount = [];
    this.totalReview = 0;
    if (this.isManager) {
      this.enrollmentRebutReviewService
        .getEnrollmentManagerStatus()
        .subscribe(res => {
          this.processCountDataManager(res);
        });
    } else {
      this.service.getEnrollmentLeadStatus().subscribe(res => {
        this.processCountData(res);
      });
    }
  }

  private processCountData(res: any) {
    if (res) {
      res.forEach(e => {
        if (String(e.status).indexOf("Rebuttal Review") > -1) {
          this.reviewRebuttalCount = e.workCategoryList || [];
          this.reviewRebuttalCount.forEach(f => {
            this.totalReview = this.totalReview + f.requestCount;
          });
        }
      });
    }
  }

  private processCountDataManager(res: any) {
    if (res) {
      this.reviewRebuttalCount = res || [];
      this.reviewRebuttalCount.forEach(f => {
        this.totalReview = this.totalReview + f.requestCount;
      });
    }
  }

  private setCols() {
    this.cols = [
      { header: "Rebut/Accept", field: "reviewOrRebut", visible: true },
      { header: "Priority", field: "priority", visible: true },
      { header: "Work Category", field: "workCategory", visible: true },
      { header: "PROMT Status", field: "promtStatus", visible: true },
      {
        header: "Enrollment Specialist Name",
        field: "specialistName",
        visible: true
      },
      { header: "Audit Date", field: "auditDate", visible: true },
      { header: "Auditor Name", field: "auditorName", visible: true },
      { header: "Transaction Type", field: "transactionType", visible: true },
      { header: "Transaction Count", field: "transactionCount", visible: true },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true
      },
      { header: "Subscriber Name", field: "subscriberName", visible: true },
      { header: "Member Group Name", field: "memberGroupName", visible: true },
      { header: "Member ID", field: "memberId", visible: true },
      { header: "Member Last Name", field: "memberLastName", visible: true },
      { header: "Member First Name", field: "memberFirstName", visible: true },
      { header: "Member DOB", field: "memberDob", visible: true },
      {
        header: "Relation To Subscriber",
        field: "relationToSubscriber",
        visible: true
      },
      { header: "User Group Name", field: "userGroupName", visible: true }
    ];
  }

  getRequestType() {
    this.requestTypes = [];
    this.enrollmentService.getUserWorkItemTypes().subscribe(res => {
      res.forEach(resp => {
        this.requestTypes = res ? res : [];
      });
    });
  }

  getSubscription() {
    this.subscriptionDetails = [];
    this.auditorService
      .getSubscriptionLeadManager(this.requestType, this.isManager)
      .subscribe(res => {
        this.processSubscription(res);
      });
  }

  getSubscriptionByID() {
    this.subscriptionDetails = [];
    this.auditorService
      .getSubscriptionLeadManagerById(this.flowId, this.isManager)
      .subscribe(res => {
        this.processSubscription(res);
      });
  }
 
  private processSubscription(res: any) {
    this.subscriptionDetails = res ? [res] : [];
    this.subscription = res || null;
    if (this.subscription) {
      this.headerService.updateAuditClaimDetails(this.subscription);
      const attachmentOne = this.isManager
        ? this.subscription.managerAttachmentOne
        : this.subscription.leadAttachmentOne;
      const attachmentTwo = this.isManager
        ? this.subscription.managerAttachmentTwo
        : this.subscription.leadAttachmentTwo;
      const files = [attachmentOne, attachmentTwo].filter(e => e);
      this.mainInput = files.length > 0 ? files : [""];
      this.comments = this.isManager
        ? this.subscription.managerComments
        : this.subscription.leadComments;
      if (
        this.subscription.attachmentsCommentsForAllUsers &&
        this.subscription.attachmentsCommentsForAllUsers.length > 0
      ) {
        this.mapLevelComments();
      }
    }
    // this.reviewService.startTimer(res);
  }

  private mapLevelComments() {
    this.clearAllUserComments();
    this.subscription.attachmentsCommentsForAllUsers
      .filter(d => d)
      .forEach(e => {
        this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
      });
  }

  private clearAllUserComments() {
    this.allUserCommentsAttachments[0] = [];
    this.allUserCommentsAttachments[1] = [];
    this.allUserCommentsAttachments[2] = [];
    this.allUserCommentsAttachments[3] = [];
  }

  justCopy(inputElement) {
    this.copyToClipBoard(inputElement);
    this.notifierService.throwNotification({
      type: "success",
      message: "Claim ID copied"
    });
  }

  copyAndOpenHRP(inputElement) {
    this.copyToClipBoard(inputElement);
    this.openHealthEdgeApp();
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

  openHealthEdgeApp() {
    this.taskManagementService.callHealthEdge().subscribe(res => {
      if (res.status === "Failure") {
        this.notifierService.throwNotification({
          type: "error",
          message: res.message
        });
      }
    });
  }

  viewAttachments(key: string) {
    this.showAttachments = this.subscription ? true : false;
    this.attachmentsPopup = this[key] || [];
    console.log(this.attachmentsPopup);
  }

  downloadAttachment(fileInfo) {
    if (fileInfo) {
      this.auditorService.downloadFile(fileInfo.fileId).subscribe(res => {
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
      this.mainInput.length > 0 &&
      this.mainInput.filter(e => e && e.local).length > 0
    ) {
      const formData = new FormData();
      formData.append("auditFlowId", this.subscription.auditFlowId);
      this.mainInput.forEach((val, i) => {
        if (val && val.local) {
          formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        }
      });
      this.auditorService.uploadFileReview(formData).subscribe(res => {});
    }
  }

  submitOrPend(isPend?, routeTo?) {
    const payload = this.isManager
      ? {
          auditFlowId: this.subscription.auditFlowId,
          comments: this.comments,
          reviewComplete: routeTo === "reviewComplete",
          routeLead: routeTo === "routeLead",
          specialistId: this.subscription.specialistId,
          auditorId: this.subscription.auditorId,
          isPend: isPend ? true : false
        }
      : {
          auditFlowId: this.subscription.auditFlowId,
          comments: this.comments,
          isReviewComplete: routeTo === "reviewComplete",
          isRouteManager: this.routeTo,
          isRouteSpecialist: routeTo === "routeSpecialist",
          specialistId: this.subscription.specialistId,
          auditorId: this.subscription.auditorId,
          isPend: isPend ? true : false
        };
    this.auditorService
      .submitOrPendManagerLead(payload, this.isManager)
      .subscribe(res => {
        this.uploadFile();
        this.headerService.updateAuditClaimDetails(null);
        this.notifierService.throwNotification({
          type: "success",
          message: `Transaction is ${
            isPend ? "pended" : "submitted"
          } successfully.`
        });
        this.resetData();
      });
  }

  rebut() {
    const payload = this.isManager
      ? {
          auditFlowId: this.subscription.auditFlowId,
          comments: this.comments,
          reviewComplete: false,
          routeLead: false,
          specialistId: this.subscription.specialistId,
          auditorId: this.subscription.auditorId,
          isPend: false
        }
      : {
          auditFlowId: this.subscription.auditFlowId,
          comments: this.comments,
          isReviewComplete: false,
          isRouteManager: this.routeTo,
          isRouteSpecialist: false,
          specialistId: this.subscription.specialistId,
          auditorId: this.subscription.auditorId,
          isPend: false
        };
    this.uploadFile();
    this.auditorService
      .rebutManagerLead(payload, this.isManager)
      .subscribe(res => {
        this.headerService.updateAuditClaimDetails(null);
        this.notifierService.throwNotification({
          type: "success",
          message: `Transaction is rebutted successfully.`
        });
        this.resetData();
      });
  }

  deleteFile(index) {
    // const file = this.mainInput[index];
    this.auditorService
      .deleteFileReview(this.subscription.auditFlowId, FILE_POSITION[index + 1])
      .subscribe(res => {
        this.mainInput.splice(index, 1);
        if (index === 0 && this.mainInput.length < 1) {
          this.mainInput.push("");
        }
      });
  }

  private resetData() {
    this.subscriptionDetails = [];
    this.subscription = null;
    this.mainInput = [""];
    this.attachmentsPopup = [];
    this.comments = "";
    this.routeTo = false;
    this.previousAttachments = null;
    this.tab = "enterComments";
    this.attachmentTab = "addAttachment";
    this.getStatusCounts();
  }

  roleChange(val) {
    if (val) {
      this.clearAllUserComments();
      this.subscription.attachmentsCommentsForAllUsers
        .filter(d => d && d.userRole === val)
        .forEach(e => {
          this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
        });
    } else {
      this.mapLevelComments();
    }
  }

  navigateToDetailPage(type) {
    if (!this.isManager) {
      const url = this.isManager
        ? ``
        : `enrollment-lead-detail/rebuttal-review?type=${type}`;
      this.router.navigateByUrl(url);
    } else if (this.isManager) {
      const url = `enrollment-rebut-review/enrollment-rebut-review-detail?type=${type}`;
      this.router.navigateByUrl(url);
    }
  }
}
