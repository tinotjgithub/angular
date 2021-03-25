import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { NotifierService } from "../notifier.service";
import { APP_CONFIG } from '../config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuditorService extends BaseHttpService {
  workFlowRoleSub = new Subject<any>();
  auditorAuditResponse: any;
  auditorQualityResponse: any;
  public auditorClaimsAuditedFetch = new Subject<any>();
  auditorFinScoreResponse: any;
  auditorCategoryResponse: any;
  auditorAuditStatusFetch = new Subject<any>();
  auditorQualityScoreFetch = new Subject<any>();
  auditorCategoryFetch = new Subject<any>();
  workFlowRoleResponse: any;
  constructor(
    private http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getAuditorClaimsAuditedListner() {
    return this.auditorClaimsAuditedFetch.asObservable();
  }

  getWorkFlowRolesListner() {
    return this.workFlowRoleSub.asObservable();
  }

  getAuditorAuditStatusListner() {
    return this.auditorAuditStatusFetch.asObservable();
  }

  getAuditorQualityScoreListner() {
    return this.auditorQualityScoreFetch.asObservable();
  }

  getAuditorClaimsAuditedCategoryListner() {
    return this.auditorCategoryFetch.asObservable();
  }

  getQueueSummary() {
    return this.get("api/audit/home/dashboard/queue/summary");
  }

  getAuditStatus() {
    return this.get("api/audit/home/dashboard/status");
  }

  getProcessedClaimsInventoryStatus() {
    return this.get("api/audit/home/dashboard/processed-claims-inventory");
  }

  getClaimCountDetails(payload) {
    return this.post(payload, "api/audit/home/sampling/count");
  }

  addClaimCountDetails(payload) {
    return this.post(payload, "api/audit/home/sampling/queue/add");
  }

  getQueueDetails(type) {
    return this.get(
      `api/audit/home/dashboard/${
        type === "backlog" ? "backlog" : "queue"
      }/detail`
    );
  }

  deleteQueueDetails(payload) {
    return this.post(payload, `api/audit/home/dashboard/queue/remove`);
  }

  getClaimForAuditorQueue() {
    return this.get(`api/audit/auditor/queue/get-claim`);
  }

  getClaimForAuditorQueueById(taskId) {
    return this.get(
      `api/audit/home/dashboard/queue/get-claim?auditTaskId=${taskId}`
    );
  }

  getInitializedClaimForAuditorQueue() {
    return this.get(`api/audit/auditor/queue/get-claim/initialized`);
  }

  getChecklist() {
    return this.get("api/audit/configuration/checklist");
  }

  addChecklist(payload) {
    return this.post(payload, "api/audit/configuration/checklist/add");
  }

  removeChecklist(payload) {
    return this.post(payload, "api/audit/configuration/checklist/remove");
  }

  uploadFile(formData: FormData) {
    return this.http.post(
      `${APP_CONFIG.AUDITOR_SERVER_URL}/api/file/management/upload/audit/task/attachments`,
      formData
    );
  }

  uploadFileExaminerFile(formData: FormData) {
    return this.http.post(
      `${APP_CONFIG.AUDITOR_SERVER_URL}/api/file/management/upload/audit/flow/attachments`,
      formData
    );
  }

  acceptAuditFailedTask(param) {
    return this.post(param, "api/audit/examiner/queue/claim/accept");
  }

  pendAuditFailedTask(param) {
    return this.post(param, `api/audit/examiner/queue/claim/pend`);
  }

  getAuditorAuditStatus() {
    this.get("api/audit/home/dashboard/audit-status").subscribe(
      (data: any) => {
        this.auditorAuditResponse = data;
        this.auditorAuditStatusFetch.next(this.auditorAuditResponse);
      },
      error => {
        this.auditorAuditResponse = [];
        return;
      }
    );
  }

  getAuditorQualityScore() {
    this.get("api/audit/home/dashboard/quality-graph").subscribe(
      (data: any) => {
        this.auditorQualityResponse = data;
        this.auditorQualityScoreFetch.next(this.auditorQualityResponse);
      },
      error => {
        this.auditorQualityResponse = [];
        return;
      }
    );
  }

  getAuditorClaimsAuditedCategory() {
    this.get("api/audit/home/dashboard/audited-by-category").subscribe(
      (data: any) => {
        this.auditorCategoryResponse = data;
        this.auditorCategoryFetch.next(this.auditorCategoryResponse);
      },
      error => {
        this.auditorCategoryResponse = [];
        return;
      }
    );
  }

  rebutAuditFailedTask(param) {
    return this.post(param, `api/audit/examiner/queue/claim/rebut`);
  }

  saveAuditQueueClaim(payload) {
    return this.post(payload, "api/audit/auditor/queue/save-for-later");
  }

  downloadFile(fileId: string) {
    return this.getBlob(
      `api/file/management/download/attachment?fileId=${fileId}`
    );
  }

  submitAuditClaim(payload) {
    return this.post(payload, "api/audit/auditor/queue/claim/final/submit");
  }

  getAuditFailedCount() {
    return this.get("api/get-audit-failed-count");
  }

  gerReviewRebutCount() {
    return this.get("api/examiner/review-rebut-count");
  }

  getAuditailedDetails() {
    return this.get("api/get-audit-failed-list");
  }

  getReviewRebuttalList() {
    return this.get("api/examiner/review-rebut-list");
  }

  deleteFile(taskId, position) {
    return this.get(
      `api/file/management/delete/audit/task/attachment?auditTaskId=${taskId}&position=${position}`
    );
  }

  deleteAuditFailedFile(taskId, position) {
    return this.get(
      `api/file/management/delete/audit/flow/attachment?auditFlowId=${taskId}&position=${position}`
    );
  }

  getAuditFailedDetails(auditFlowId, reviewRebut) {
    let url = "";
    if (auditFlowId) {
      url = (reviewRebut === true
        ? "api/examiner/review-rebut/get-claim"
        : "api/landing/audit/examiner/queue/get-claim"
      ).concat("?auditFlowId=" + auditFlowId);
    } else {
      url = "api/audit/examiner/queue/get-claim";
    }
    return this.get(url);
  }

  getAuditReviewCount() {
    return this.get("api/lead/review/get-claim-count-review");
  }

  getWorkFlowRoles() {
    this.get("api/configuration/review-roles").subscribe(
      data => {
        this.workFlowRoleResponse = data;
        this.workFlowRoleSub.next(this.workFlowRoleResponse);
      },
      error => {
        this.workFlowRoleResponse = [];
        return;
      }
    );
  }

  saveWorkFlowRoles(payload) {
    return this.post(
      payload,
      "api/configuration/create/review-roles"
    ).subscribe(data => {
      this.messageService.throwNotification({
        type: "success",
        message: "Workflow Updated Successfully!"
        
      });
    });
  }

  getAuditorClaimsAudited() {
    this.get("api/audit/home/dashboard/audited-backlog-claims").subscribe(
      (data: any) => {
        this.auditorFinScoreResponse = data;
        this.auditorClaimsAuditedFetch.next(this.auditorFinScoreResponse);
      },
      error => {
        this.auditorFinScoreResponse = [];
        return;
      }
    );
  }

  getAuditQueueDetails(type) {
    return this.get(`api/audit/home/dashboard/${type}/detail`);
  }

  getClaimsForManualSelection(payload) {
    return this.post(payload, `api/audit/manual-selection/unassigned-claim`);
  }

  addToTodaysQueue(payload, role) {
    return this.post(
      payload,
      `api/audit/manual-selection/${
        role === "Claims Auditor"
          ? "auditor/add-to-queue"
          : "lead-manager/add-to-general-queue"
      }`
    );
  }

  getQueueSummaryLeadManager(role) {
    return this.get(
      `api/audit/dashboard/${
        role === "Claims Lead" ? "lead" : "manager"
      }/queue/summary`
    );
  }

  getAuditStatusLeadManager() {
    return this.get("api/claims-audit/my-queue-summary");
  }

  getProcessedClaimsInventoryStatusLeadManager() {
    return this.get("api/claims-audit/processed-claims-inventory");
  }

  getQueueDetailsLeadManager(type, role) {
    return this.get(
      `api/audit/dashboard/${role === "Claims Lead" ? "lead" : "manager"}/${
        type === "backlog" ? "backlog" : "queue"
      }/detail`
    );
  }

  auditorRouteClaim(payload) {
    return this.post(payload, "api/audit/auditor/queue/claim/route");
  }

  deleteClaimLeadManager(payload) {
    return this.post(payload, "api/audit/dashboard/remove/claims");
  }

  getAuditorClaimsLeadManager(auditorId, type) {
    return this.get(
      `api/audit/dashboard/${
        type === "backlog" ? "backlog" : "todays"
      }/unassigned/claims?auditorId=${auditorId}`
    );
  }

  getUnassignedClaimsCountAndAuditorsLeadManager(type) {
    return this.get(
      `api/audit/dashboard/audit/${
        type === "backlog" ? "backlog" : "queue"
      }/status`
    );
  }

  assignClaims(payload) {
    return this.post(payload, `api/audit/dashboard/assign/claims`);
  }

  getRebuttalList(type) {
    return this.get(`api/audit/home/dashboard/review-rebuttal/${type}`);
  }

  getRebuttalCounts() {
    return this.get(`api/audit/home/dashboard/review-rebuttal/status`);
  }

  getAuditorCounts(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    return this.post(param, `api/audit/dashboard/auditor/assigned/claims`);
  }

  auditSummaryByAuditorDetails(payload) {
    return this.post(
      payload,
      "api/audit/dashboard/auditor/assigned/claims/grid"
    );
  }

  auditSummaryByAuditorExcel(payload) {
    return this.getExcel(
      payload,
      "api/audit/dashboard/auditor/assigned/claims/report"
    );
  }

  getTouchedClaimsExaminer(taskId) {
    return this.get(
      `api/audit/auditor/queue/examiner/list?auditTaskId=${taskId}`
    );
  }

  getAuditorDetailsForManualAssignment() {
    return this.get("api/audit/manual-selection/auditor-details");
  }

  addToAuditorQueue(payload) {
    return this.post(
      payload,
      `api/audit/manual-selection/lead-manager/add-to-auditor-queue`
    );
  }

  sendBack(payload) {
    return this.post(payload, `api/audit/examiner/queue/claim/send-back`);
  }
}
