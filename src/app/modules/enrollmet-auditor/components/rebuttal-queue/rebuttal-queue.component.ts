import { FILE_POSITION } from 'src/app/modules/auditor/model/auditor.model';
import { CanComponentDeactivate } from 'src/app/guards/route.guard/can-deactivate.gaurd';
import { ConfirmationService } from 'primeng/api';
import { HeaderService } from 'src/app/services/header/header.service';
import { EnrollmentAuditorService } from './../../services/enrollment-auditor.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rebuttal-queue',
  templateUrl: './rebuttal-queue.component.html',
  styleUrls: ['./rebuttal-queue.component.css']
})
export class RebuttalQueueComponent implements OnInit, CanComponentDeactivate {
  public subscription: any;
  public cols: any[];
  public requestType: string;
  public requestTypes: any[];
  public reviewData: any[];
  public totalData: number;
  private interval: any;
  public endTimer: string;
  private timerRedColor = "#bf0000";
  private timerAmberColor = "#FFBF00";
  public timerColor = "#00bf96";
  public previousAttachments: any;
  public auditorAttachment: any;
  public allUserCommentsAttachments = {
    0: [],
    1: [],
    2: [],
    3: []
  };
  public examinerAttachment: any[] = [];
  public leadAttachment: any[] = [];
  public managerAttachment: any[] = [];
  public showAttachments: boolean;
  public attachmentsPopup: any[] = [];
  public input: Array<any> = new Array(2);
  public auditorCommnets: any;
  flowId: any;

  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler($event) {
    $event.preventDefault();
    if (this.subscription) {
      $event.returnValue = "Are you sure?";
    }
  }

  constructor(
    private fb: FormBuilder,
    private auditorService: EnrollmentAuditorService,
    private notifierService: NotifierService,
    private headerService: HeaderService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  canDeactivate() {
    if (this.subscription && this.subscription.subscriptionId) {
      this.confirmationService.confirm({
        message: "Please Save/Submit the transaction before you navigate to other page",
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
      { header: "Priority", field: "priority", visible: true },
      { header: "Rebut/Accept", field: "reviewOrRebut", visible: true },
      { header: "Work Category", field: "workCategory", visible: true },
      { header: "PROMT Status", field: "promtStatus", visible: true },
      { header: "Audit Date", field: "auditDate", visible: true },
      { header: "Auditor Name", field: "auditorName", visible: true },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true,
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
        visible: true,
      },
      { header: "User Group Name", field: "userGroupName", visible: true },
      {
        header: "Enrollment Specialist Name",
        field: "specialistName",
        visible: true,
      },
      { header: "Transaction Type", field: "transactionType", visible: true },
      { header: "Transaction Count", field: "transactionCount", visible: true },
      { header: "Error Details", field: "errorDetails", visible: true, large: true },
    ];
    this.flowId = this.activatedRoute.snapshot.queryParamMap.get("flowId");
    if (this.flowId) {
      this.getSubscriptionByID();
    }
    this.getStatusCount();
    this.getRequestTypes();
  }

  navigateToDetail(status: string, requestType) {
    const statusRoute = status.replace(/\s/g, '').toLowerCase();
    this.router.navigateByUrl(`/enrollment-auditor/${statusRoute}-queue?type=${requestType}`);
  }

  getStatusCount() {
    this.reviewData = [];
    this.auditorService.getLandingPageCount().subscribe(res => {
      const array = res || [];
      array.forEach(e => {
        if (String(e.status).indexOf('Review') > -1) {
          this.reviewData = e.workCategoryList;
          this.totalData = (e.workCategoryList as any[]).map(e => e.requestCount).reduce((prev, current) => {
            return prev + current
          });
        }
      });
    })
  }

  getRequestTypes() {
    this.requestTypes = [];
    this.auditorService.getWorkCategoryForAuditor().subscribe((res: any) => {
      this.requestTypes = res;
    });
  }

  getSubscription() {
    if (this.requestType) {
      this.subscription = null;
      this.auditorService.getSubscriptionAuditorReview(this.requestType.toLowerCase()).subscribe(res => {
        this.procesSubscription(res);
      });
    }
  }

  getSubscriptionByID() {
    this.subscription = null;
    this.auditorService.getSubscriptionAuditorReviewById(this.flowId).subscribe((res) => {
      this.procesSubscription(res);
    });
  }

  private procesSubscription(res: any) {
    this.subscription = res;
    if (this.subscription) {
      this.headerService.updateAuditClaimDetails(this.subscription);
      const files = [
        this.subscription.auditorSavedAttachmentOne,
        this.subscription.auditorSavedAttachmentTwo,
      ].filter(e => e);
      this.input = files.length > 0 ? files : [""];
      this.auditorCommnets = this.subscription.resubmitAuditorComments;
      if (this.subscription.attachmentsCommentsForAllUsers && (this.subscription.attachmentsCommentsForAllUsers.length > 0)) {
        this.mapLevelComments();
      }
      this.startTimer(this.subscription);
    }
  }

  private mapLevelComments() {
    this.clearAllUserComments();
    this.subscription.attachmentsCommentsForAllUsers.filter(d => d).forEach(e => {
      this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
    });
  }

  private clearAllUserComments() {
    this.allUserCommentsAttachments[0] = [];
    this.allUserCommentsAttachments[1] = [];
    this.allUserCommentsAttachments[2] = [];
    this.allUserCommentsAttachments[3] = [];
  }

  startTimer(val) {
    this.endTimer = (val && val.endTimer) || "00:00:00";
    if (val && val.subscriptionId) {
      const timeValues = this.endTimer.split(":");
      let seconds = timeValues[2];
      let minutes = timeValues[1];
      let hours = timeValues[0];
      const secFn = e => {
        seconds = `0${e - 60}`;
        minutes = String(Number(minutes) + 1);
      };
      const minFn = e => {
        minutes = `0${e - 60}`;
        hours = String(Number(hours) + 1);
      };
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        const sec = Number(seconds) + 1;
        sec < 10
          ? (seconds = `0${sec}`)
          : sec > 59
          ? secFn(sec)
          : (seconds = String(sec));
        const min = Number(minutes);
        if (min < 10) {
          minutes = `0${min}`;
        } else if (min > 59) {
          minFn(min);
        }
        this.endTimer = `${hours}:${minutes}:${seconds}`;
        if (
          Number(hours) >= 1 ||
          Number(minutes) >= 1 ||
          Number(seconds) >= 30
        ) {
          this.timerColor = this.timerRedColor;
        } else if (Number(seconds) >= 20 && Number(seconds) < 30) {
          this.timerColor = this.timerAmberColor;
        } else {
          this.timerColor = "#00bf96";
        }
      }, 1000);
    }
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
    /* this.taskManagementService.callHealthEdge().subscribe(res => {
      if (res.status === "Failure") {
        this.notifierService.throwNotification({
          type: "error",
          message: res.message
        });
      }
    }); */
  }
  
  viewAttachments(key: string) {
    this.showAttachments = this.subscription ? true : false;
    this.attachmentsPopup = this[key] ? this[key] : [];
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

  deleteFile(index) {
    this.auditorService.deleteFileReview(this.subscription.auditFlowId, FILE_POSITION[index + 1]).subscribe(res => {
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
    if (/* this.subscription.reviewOrRebut !== 'Accept' &&  */this.input.length > 0 && this.input.filter(e => e && e.local).length > 0) {
      const formData = new FormData();
      formData.append("auditFlowId", this.subscription.auditFlowId);
      this.input.forEach((val, i) => {
        if (val && val.local) {
          console.log(val);
          formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        }
      });
      this.auditorService.uploadFileReview(formData).subscribe(res => {});
    }
  }

  reviewComplete() {
    const payload = {
      auditFlowId: this.subscription.auditFlowId,
      auditTaskId: this.subscription.auditTaskId,
      endTimer: this.endTimer,
      resubmitAuditorComments: this.auditorCommnets
    };
    this.auditorService.reviewComplete(payload).subscribe(res => {
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Transaction is submitted successfully.'
      });
      this.resetData();
    });
  }

  acceptClaim() {
    const payload = {
      auditFlowId: this.subscription.auditFlowId,
      auditTaskId: this.subscription.auditTaskId,
      endTimer: this.endTimer,
      resubmitAuditorComments: this.auditorCommnets
    };
    this.auditorService.acceptClaim(payload).subscribe(res => {
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Transaction is accepted successfully.'
      });
      this.resetData();
    });
  }

  resubmitClaim(status) {
    const payload = {
      auditFlowId: this.subscription.auditFlowId,
      auditTaskId: this.subscription.auditTaskId,
      endTimer: this.endTimer,
      resubmitAuditorComments: this.auditorCommnets
    };
    const isAccept = status && (status === 'Accept');
    this.auditorService.resubmitClaim(payload, isAccept).subscribe(res => {
      this.uploadFile();
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Transaction is re-submitted successfully.'
      });
      this.resetData();
    });
  }

  saveClaim() {
    const payload = {
      auditFlowId: this.subscription.auditFlowId,
      auditTaskId: this.subscription.auditTaskId,
      endTimer: this.endTimer,
      resubmitAuditorComments: this.auditorCommnets
    };
    this.auditorService.saveClaim(payload).subscribe(res => {
      this.uploadFile();
      this.headerService.updateAuditClaimDetails(null);
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Transaction is saved successfully.'
      });
      this.resetData();
    });
  }

  private resetData() {
    this.subscription = null;
    this.input = [''];
    this.auditorCommnets = "";
    this.endTimer = '00:00:00';
    this.timerColor = "#00bf96";
    this.previousAttachments = null;
    this.clearAllUserComments();
    this.headerService.updateAuditClaimDetails(null);
    this.getStatusCount();
  }

  roleChange(val) {
    if (val) {
      this.clearAllUserComments();
      this.subscription.attachmentsCommentsForAllUsers.filter(d => d && (d.userRole === val)).forEach(e => {
        this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
      });
    } else {
      this.mapLevelComments();
    }
  }

}
