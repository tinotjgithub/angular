import { Component, OnInit, HostListener } from '@angular/core';
import { ReviewService } from 'src/app/services/review/review.service';
import { HeaderService } from 'src/app/services/header/header.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { ActivatedRoute } from '@angular/router';
import { FILE_POSITION } from '../../model/auditor.model';
import { ConfirmationService } from 'primeng/api';
import { CanComponentDeactivate } from 'src/app/guards/route.guard/can-deactivate.gaurd';

@Component({
  selector: 'app-rebuttal-queue',
  templateUrl: './rebuttal-queue.component.html'
})
export class RebuttalQueueComponent implements OnInit, CanComponentDeactivate {

  public cols: any[];
  public claimDetails: any [];
  public input: Array<any> = new Array(3);
  public auditorCommnets: any;
  public claim: any;
  public endTimer: any = '00:00:00';
  public timerColor: any = "#00bf96";
  public examinerAttachment: any[] = [];
  public leadAttachment: any[] = [];
  public managerAttachment: any[] = [];
  public showAttachments: boolean;
  public attachmentsPopup: any[] = [];
  private taskId: any;
  public tab = "enterComments";
  public attachmentTab = "addAttachment";
  public previousAttachments: any;
  public auditorAttachment: any;
  public allUserCommentsAttachments = {
    0: [],
    1: [],
    2: [],
    3: []
  };
  public showAssign: boolean;
  public examinerSelected: any;
  public examinerDetails: any[];
  public isAssignExaminer: boolean;

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
  ) { }

  canDeactivate() {
    if (this.claim && this.claim.claimId) {
      this.confirmationService.confirm({
        message: "Please Save/Submit/Complete/Accept the claim before you navigate to other page",
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
      { field: "claimsAge", header: "Claim Age (In Days)" },
      { field: "providerName", header: "Provider Name" },
      { field: "memberGroupName", header: "Group Name" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "allowedAmount", header: "Allowed Amount ($)" },
      { field: "paidAmount", header: "Paid Amount ($)" },
      { field: "processedDate", header: "Processed Date" },
      { field: "examinerName", header: "Examiner Name" },
      { field: "queueName", header: "Queue Name" },
    ];
    this.reviewService.$timerInfo.subscribe(timeInfo => {
      this.endTimer = timeInfo.endTimer || '00:00:00';
      this.timerColor = timeInfo.timerColor || "#00bf96";
    });
    this.input = [''];
    this.taskId = this.activatedRoute.snapshot.queryParamMap.get('taskId');
    if (this.taskId) {
      this.getClaimByTaskId();
    } else {
      this.claim = this.reviewService.claimDetail;
      this.claimDetails = this.claim ? [this.claim] : [];
      this.reviewService.$claimDetailsListener.subscribe(val => this.processClaim(val));
    }
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

  getClaimByTaskId() {
    this.claimDetails = [];
    this.reviewService.getRebuttalById(this.taskId).subscribe((res) => {
      this.processClaim(res);
    });
  }

  private processClaim(res) {
    this.claimDetails = res ? [res] : [];
    this.claim = res || null;
    if (this.claim) {
      if (this.claim.reviewOrRebut === "In Progress") {
        this.getTouchedExaminer();
      }
      this.headerService.updateAuditClaimDetails(this.claim);
      const leadFiles = this.getAttachments(this.claim.leadAttachments);
      const examinerFiles = this.getAttachments(this.claim.examinerAttachments);
      const managerFiles = this.getAttachments(this.claim.managerAttachments);
      const previousFiles = this.getAttachments(this.claim.prevAuditorAttachments);
      const auditorFiles = this.getAttachments(this.claim.auditorAttachments);
      this.examinerAttachment = examinerFiles.length > 0 ? examinerFiles : [''] ;
      this.leadAttachment = leadFiles.length > 0 ? leadFiles : [''] ;
      this.managerAttachment = managerFiles.length > 0 ? managerFiles : [''] ;
      this.auditorAttachment = auditorFiles.length > 0 ? auditorFiles : [''] ;
      this.previousAttachments = previousFiles;
      const files = [
        this.claim.auditorSavedAttachmentOne,
        this.claim.auditorSavedAttachmentTwo,
        this.claim.auditorSavedAttachmentThree,
      ].filter(e => e);
      this.input = files.length > 0 ? files : [""];
      this.auditorCommnets = this.claim.resubmitAuditorComments;
      if (this.claim.attachmentsCommentsForAllUsers && (this.claim.attachmentsCommentsForAllUsers.length > 0)) {
        this.mapLevelComments();
      }
    }
    this.reviewService.startTimer(res);
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
    this.showAttachments = this.claim ? true : false;
    this.attachmentsPopup = this[key] ? this[key] : [];
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

  deleteFile(index) {
    this.reviewService.deleteFile(this.claim.auditFlowId, FILE_POSITION[index + 1]).subscribe(res => {
      this.input.splice(index, 1);
      if (res && res.length > 0) {
        const localArray = this.input.filter(e => e.local);
        this.input = [...res, ...localArray];
      }
      if (index === 0 && this.input.length < 1) {
        this.input.push('');
      }
    });
  }

  uploadFile() {
    if (/* this.claim.reviewOrRebut !== 'Accept' &&  */this.input.length > 0 && this.input.filter(e => e && e.local).length > 0) {
      const formData = new FormData();
      formData.append("auditFlowId", this.claim.auditFlowId);
      this.input.forEach((val, i) => {
        if (val && val.local) {
          console.log(val);
          formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        }
      });
      this.reviewService.uploadFile(formData).subscribe(res => {});
    }
  }

  reviewComplete() {
    const payload = {
      auditFlowId: this.claim.auditFlowId,
      auditTaskId: this.claim.auditTaskId,
      endTimer: this.endTimer,
    };
    this.reviewService.reviewComplete(payload).subscribe(res => {
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claim is submitted successfully.'
      });
      this.resetData();
    });
  }

  acceptClaim() {
    const payload = {
      auditFlowId: this.claim.auditFlowId,
      auditTaskId: this.claim.auditTaskId,
      endTimer: this.endTimer,
    };
    this.reviewService.acceptClaim(payload).subscribe(res => {
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claim is accepted successfully.'
      });
      this.resetData();
    });
  }

  resubmitClaim(status) {
    const payload = {
      auditFlowId: this.claim.auditFlowId,
      auditTaskId: this.claim.auditTaskId,
      endTimer: this.endTimer,
      resubmitAuditorComments: this.auditorCommnets
    };
    const isAccept = status && (status === 'Accept');
    this.reviewService.resubmitClaim(payload, isAccept).subscribe(res => {
      this.uploadFile();
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claim is re-submitted successfully.'
      });
      this.resetData();
    });
  }

  saveClaim() {
    const payload = {
      auditFlowId: this.claim.auditFlowId,
      auditTaskId: this.claim.auditTaskId,
      endTimer: this.endTimer,
      resubmitAuditorComments: this.auditorCommnets
    };
    this.reviewService.saveClaim(payload).subscribe(res => {
      this.uploadFile();
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claim is saved successfully.'
      });
      this.resetData();
    });
  }

  private resetData() {
    this.claimDetails = [];
    this.claim = null;
    this.showAssign = false;
    this.reviewService.stopTimer();
    this.input = [''];
    this.auditorCommnets = "";
    this.endTimer = '00:00:00';
    this.timerColor = "#00bf96";
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

  getTouchedExaminer() {
    this.examinerDetails = [];
    this.isAssignExaminer = false;
    this.reviewService.getTouchedExaminer(this.claim.auditTaskId).subscribe(res => {
      this.examinerDetails = res || [];
      this.isAssignExaminer = this.examinerDetails.length > 1;
    });
  }

  assignClaim() {
    const payload = {
      auditFlowId: this.claim.auditFlowId,
      auditTaskId: this.claim.auditTaskId,
      examinerId: Number(this.examinerSelected),
    };
    this.reviewService.assignClaim(payload).subscribe(res => {
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claim is assigned successfully.'
      });
      this.resetData();
    });
  }

}
