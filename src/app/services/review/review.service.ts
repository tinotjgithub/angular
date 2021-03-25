import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { CryptoService } from "../crypto-service/crypto.service";
import { APP_CONFIG } from '../config/config.service';

@Injectable({
  providedIn: "root"
})
export class ReviewService extends BaseHttpService {
  public endTimer = "00:00:00";
  private interval: any;
  public timerColor = "#00bf96";
  private timerRedColor = "#bf0000";
  private timerAmberColor = "#FFBF00";
  private timerInfo: Subject<any> = new Subject();
  public $timerInfo = this.timerInfo.asObservable();
  public claimDetail: any;
  private claimDetailsListener: Subject<any> = new Subject();
  public $claimDetailsListener = this.claimDetailsListener.asObservable();
  private keys = {
    Manager: "manager",
    "Claims Lead": "lead",
    "Enrollment Lead": "manager"
  };
  uploadChecklistTemplateResponse: any;
  uploadChecklistTemplateFetch = new Subject<any[]>();
  checklistUploadResponse: any;
  checklistReportFetch = new Subject<any[]>();
  constructor(
    private http: HttpClient,
    private secureLocalStorage: CryptoService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getClaim() {
    const apiUrl = this.isAuditor()
      ? "api/audit/auditor/review-rebut/claim"
      : `api/${this.keys[this.getRole()]}/review/get-claim`;
    this.get(apiUrl).subscribe(res => {
      this.claimDetail = res;
      this.claimDetailsListener.next(res);
    });
  }

  getChecklistReportListner() {
    return this.checklistReportFetch.asObservable();
  }

  uploadFileChecklistTemplateListner() {
    return this.uploadChecklistTemplateFetch.asObservable();
  }

  downloadFile(fileId) {
    return this.getBlob(
      `api/file/management/download/attachment?fileId=${fileId}`
    );
  }

  uploadFile(formData: FormData) {
    return this.post(
      formData,
      `api/file/management/upload/audit/flow/attachments`
    );
  }

  uploadFileChecklist(formData: FormData) {
    return this.getExcel(formData, `api/audit/checklist/import`).subscribe(
      data => {
        this.checklistUploadResponse = data;
        this.checklistReportFetch.next(this.checklistUploadResponse);
      },
      error => {
        this.checklistUploadResponse = [];
        this.checklistReportFetch.next(null);
        return;
      }
    );
  }

  uploadFileChecklistTemplate() {
    return this.getBlob(`api/audit/checklist/import/template`).subscribe(
      data => {
        this.uploadChecklistTemplateResponse = data;
        this.uploadChecklistTemplateFetch.next(
          this.uploadChecklistTemplateResponse
        );
      },
      error => {
        this.uploadChecklistTemplateResponse = [];
        this.uploadChecklistTemplateFetch.next(null);
        return;
      }
    );
  }

  submitOrPend(payload) {
    return this.post(
      payload,
      `api/${this.keys[this.getRole()]}/review/submit/pend`
    );
  }

  rebut(payload) {
    return this.post(payload, `api/${this.keys[this.getRole()]}/review/rebut`);
  }

  reviewComplete(payload) {
    return this.post(payload, "api/audit/auditor/review-rebut/complete");
  }

  acceptClaim(payload) {
    return this.post(payload, "api/audit/auditor/review-rebut/accept");
  }

  resubmitClaim(payload, isAccept) {
    return this.post(payload, `api/audit/auditor/review-rebut/resubmit${isAccept ? '-accept' : ''}`);
  }

  saveClaim(payload) {
    return this.post(payload, "api/audit/auditor/review-rebut/pend");
  }

  deleteFile(flowId, position) {
    return this.get(
      `api/file/management/delete/audit/flow/attachment?auditFlowId=${flowId}&position=${position}`
    );
  }

  startTimer(val) {
    this.endTimer = (val && val.endTimer) || "00:00:00";
    if (val) {
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
          : sec > 60
          ? secFn(sec)
          : (seconds = String(sec));
        const min = Number(minutes);
        if (min < 10) {
          minutes = `0${min}`;
        } else if (min > 60) {
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
        this.timerInfo.next({
          endTimer: this.endTimer,
          timerColor: this.timerColor
        });
      }, 1000);
    }
  }

  stopTimer() {
    this.claimDetail = null;
    this.claimDetailsListener.next(null);
    clearInterval(this.interval);
    this.endTimer = "00:00:00";
    this.timerColor = "#00bf96";
    this.timerInfo.next({
      endTimer: this.endTimer,
      timerColor: this.timerColor
    });
  }

  private isAuditor() {
    return (
      this.secureLocalStorage.getItem("roleId") &&
      this.secureLocalStorage.getItem("roleId") === "Claims Auditor"
    );
  }

  getRebuttalList() {
    return this.get("api/audit/home/dashboard/review/detail");
  }

  getRebuttalById(taskId) {
    return this.get(
      `api/audit/auditor/review-rebut/claim/detail?auditTaskId=${taskId}`
    );
  }

  getRole() {
    return this.secureLocalStorage.getItem("roleId");
  }

  getLeadReviewList() {
    return this.get("api/lead/review/get-claim-review-list");
  }

  getManagerReviewList() {
    return this.get("api/manager/review/get-claim-review-list");
  }

  getLeadClaimById(flowId) {
    return this.get(`api/lead/review/load-claim-review?auditFlowId=${flowId}`);
  }

  getManagerClaimById(flowId) {
    return this.get(
      `api/manager/review/manager-claim-review-rebuttal?auditFlowId=${flowId}`
    );
  }

  getTouchedExaminer(id) {
    return this.get(
      `api/audit/auditor/queue/examiner/list?auditTaskId=${id}`
    );
  }

  assignClaim(payload) {
    return this.post(payload, "api/audit/auditor/review-rebut/assign");
  }
}
