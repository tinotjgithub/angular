import { Component, OnInit, HostListener } from '@angular/core';
import { ReviewService } from 'src/app/services/review/review.service';
import { HeaderService } from 'src/app/services/header/header.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { FILE_POSITION } from 'src/app/modules/auditor/model/auditor.model';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CanComponentDeactivate } from 'src/app/guards/route.guard/can-deactivate.gaurd';

@Component({
  selector: "app-rebut-review",
  templateUrl: "./rebut-review.component.html"
})
export class RebutReviewComponent implements OnInit, CanComponentDeactivate {
  public cols: any[];
  public claimDetails: any[];
  public input: Array<any>;
  public claim: any;
  public auditorAttachment: any[];
  public examinerAttachment: any[];
  public managerAttachment: any[];
  public attachmentsPopup: any[] = [];
  public showAttachments: boolean;
  public routeTo: string;
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
    "Tenth",
  ];
  public flowId: any;
  public tab = "enterComments";
  public attachmentTab = "addAttachment";
  public previousAttachments: any;
  public allUserCommentsAttachments = {
    0: [],
    1: [],
    2: [],
    3: []
  };

  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler($event) {
    $event.preventDefault();
    if (this.claim) {
      $event.returnValue = "Are you sure?";
    }
  }

  constructor(
    private reviewService: ReviewService,
    private headerService: HeaderService,
    private notifierService: NotifierService,
    private taskManagementService: TaskmanagementService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {}

  canDeactivate() {
    if (this.claim && this.claim.claimId) {
      this.confirmationService.confirm({
        message: "Please Pend/Rebut/Submit the claim before you navigate to other page",
        acceptLabel: "OK",
        rejectVisible: false
      });
      return false;
    } else {
      return true;
    }
  }

  ngOnInit() {
    this.cols = [
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "claimsAge", header: "Claim Age (in Days)" },
      { field: "providerName", header: "Provider Name" },
      { field: "memberGroupName", header: "Group Name" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "allowedAmount", header: "Allowed Amount ($)" },
      { field: "paidAmount", header: "Paid Amount ($)" },
      { field: "processedDate", header: "Processed Date" },
      { field: "examinerName", header: "Examiner Name" },
      { field: "queueName", header: "Queue Name" },
    ];
    this.flowId = this.activatedRoute.snapshot.queryParamMap.get('flowId');
    if (this.flowId) {
      this.getClaimByTaskId();
    } else {
      this.claim = this.reviewService.claimDetail;
      this.claimDetails = this.claim ? [this.claim] : [];
      this.reviewService.$claimDetailsListener.subscribe(val => this.processClaim(val));
    }
    this.input = [""];
  }

  getClaimByTaskId() {
    this.claimDetails = [];
    this.reviewService.getLeadClaimById(this.flowId).subscribe((res) => {
      this.processClaim(res);
    });
  }

  getClaim() {
    this.claimDetails = [];
    const claimDetail = this.reviewService.claimDetail;
    if (!claimDetail) {
      this.reviewService.getClaim();
    } else {
      this.processClaim(claimDetail);
    }
  }

  private processClaim(res: any) {
    this.claimDetails = res ? [res] : [];
    this.claim = res || null;
    if (this.claim) {
      this.headerService.updateAuditClaimDetails(this.claim);
      const auditorFiles = this.getAttachments(this.claim.auditorAttachments);
      const examinerFiles = this.getAttachments(this.claim.examinerAttachments);
      const managerFiles = this.getAttachments(this.claim.managerAttachments);
      const previousFiles = this.getAttachments(this.claim.prevLeadAttachments);
      this.examinerAttachment = examinerFiles.length > 0 ? examinerFiles : [""];
      this.auditorAttachment = auditorFiles.length > 0 ? auditorFiles : [""];
      this.managerAttachment = managerFiles.length > 0 ? managerFiles : [""];
      this.previousAttachments = previousFiles;

      const files = [
        this.claim.leadAttachmentOne,
        this.claim.leadAttachmentTwo
      ].filter(e => e);
      this.input = files.length > 0 ? files : [""];
      this.comments = this.claim.leadComments;
      if (this.claim.attachmentsCommentsForAllUsers && (this.claim.attachmentsCommentsForAllUsers.length > 0)) {
        this.mapLevelComments();
      }
    }
    // this.reviewService.startTimer(res);
  }

  private mapLevelComments() {
    this.clearAllUserComments();
    this.claim.attachmentsCommentsForAllUsers.filter(d => d).forEach(e => {
      this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
    });
  }

  private clearAllUserComments() {
    this.allUserCommentsAttachments[0] = [];
    this.allUserCommentsAttachments[1] = [];
    this.allUserCommentsAttachments[2] = [];
    this.allUserCommentsAttachments[3] = [];
  }

  getAttachments(attachments: any[]) {
    let returnAttachments = [];
    if (attachments) {
      if (attachments.length > 1) {
        returnAttachments = [
          Object.values(attachments[0]).filter(e => e)
        ];
        let otherAttachments = [];
        attachments.filter((f, index) => index > 0).forEach(e => {
          otherAttachments = [...otherAttachments, ...(Object.values(e).filter(val => val))];
        });
        returnAttachments.push(otherAttachments);
      } else {
        returnAttachments = attachments
          .map((e) => Object.values(e).filter((f) => f))
          .filter((e) => e);
      }
    }
    return returnAttachments;
  }

  justCopy(inputElement) {
    this.copyToClipBoard(inputElement);
    this.notifierService.throwNotification({
      type: "success",
      message: "Claim ID copied",
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
  }

  openHealthEdgeApp() {
    this.taskManagementService.callHealthEdge().subscribe((res) => {
      if (res.status === "Failure") {
        this.notifierService.throwNotification({
          type: "error",
          message: res.message,
        });
      }
    });
  }

  viewAttachments(key: string) {
    this.showAttachments = this.claim ? true : false;
    this.attachmentsPopup = this[key] || [];
    console.log(this.attachmentsPopup);
  }

  downloadAttachment(fileInfo) {
    if (fileInfo) {
      this.reviewService.downloadFile(fileInfo.fileId).subscribe((res) => {
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
    if (this.input.length > 0 && this.input.filter(e => e && e.local).length > 0) {
      const formData = new FormData();
      formData.append("auditFlowId", this.claim.auditFlowId);
      this.input.forEach((val, i) => {
        if (val && val.local) {
          formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        }
      });
      this.reviewService.uploadFile(formData).subscribe((res) => {});
    }
  }

  submitOrPend(isPend?, routeTo?) {
    const payload = {
      auditFlowId: this.claim.auditFlowId,
      comments: this.comments,
      isReviewComplete: routeTo && (routeTo === "reviewComplete"),
      isRouteExaminer: routeTo && (routeTo === "routeExaminer"),
      examinerId: this.claim.examinerId,
      auditorId: this.claim.auditorId,
      isPend: isPend ? true : false,
    };
    /* if (this.input.length > 0 && this.input.filter(e => e.local).length > 0) {
      this.uploadFile();
    } */
    this.reviewService.submitOrPend(payload).subscribe((res) => {
      this.uploadFile();
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: "success",
        message: `Claim is ${isPend ? 'pended' : 'submitted'} successfully.`,
      });
      this.resetData();
    });
  }

  rebut() {
    const payload = {
      auditFlowId: this.claim.auditFlowId,
      comments: this.comments,
      isRouteManager: this.routeTo,
      examinerId: this.claim.examinerId,
      auditorId: this.claim.auditorId,
    };
    this.reviewService.rebut(payload).subscribe((res) => {
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: "success",
        message: `Claim is rebutted successfully.`,
      });
      this.uploadFile();
      this.resetData();
    });
  }

  deleteFile(index) {
    this.reviewService.deleteFile(this.claim.auditFlowId, FILE_POSITION[index + 1]).subscribe(res => {
      this.input.splice(index, 1);
      /* if (res && res.length > 0) {
        const resPosition = res.map(e => e.filePosition);
        this.input.forEach((e, i) => {
          if (!e.local && resPosition.indexOf(FILE_POSITION[i + 1])) {
            const resFile = res.filter(f => f.filePosition === e.filePosition)[0];
            e.fileId = resFile.fileId;
            e.fileName = resFile.fileName;
          }
        });
      } */
      if (index === 0 && this.input.length < 1) {
        this.input.push('');
      }
    });
  }

  private resetData() {
    this.claimDetails = [];
    this.claim = null;
    this.reviewService.stopTimer();
    this.input = [""];
    this.attachmentsPopup = [];
    this.comments = "";
    this.routeTo = "";
    this.previousAttachments = null;
    this.tab = "enterComments";
    this.attachmentTab = "addAttachment";
  }

  roleChange(val) {
    if (val) {
      this.clearAllUserComments();
      this.claim.attachmentsCommentsForAllUsers.filter(d => d && (d.userRole === val)).forEach(e => {
        this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
      });
    } else {
      this.mapLevelComments();
    }
  }
}
