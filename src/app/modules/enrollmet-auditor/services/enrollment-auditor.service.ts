import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "src/app/services/base-http.service";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class EnrollmentAuditorService extends BaseHttpService {

  constructor(
    private http: HttpClient,
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getClaimCountDetails(payload) {
    return this.post(payload, "api/audit/home/sampling/count");
  }

  getLandingPageCount() {
    return this.get('api/enrollment/auditor/landing/task-status')
  }

  getTotalConfiguredItems(){
    return this.http.get(`${APP_CONFIG.ENROLLMENT_SERVER_URL}/api/enrollment/lead-landing/active-workCategory`);
  }

  getWorkCategoryForAuditor() {
    return this.http.get(`${APP_CONFIG.ENROLLMENT_SERVER_URL}/api/enrollment/active/work-category`);
  }

  getSubscriptionAuditor(requestType) {
    return this.get(`api/enrollment/auditor/queue/transaction?workCategory=${requestType}`);
  }

  getSubscriptionAuditorByTaskID(taskId) {
    return this.get(`api/enrollment/auditor/queue/load/transaction?auditTaskId=${taskId}`);
  }

  getRolesAndReasons(auditTaskId) {
    return this.get(`api/enrollment/auditor/queue/route/config/details?auditTaskId=${auditTaskId}`);
  }

  getManagerLeadNames(auditTaskId, roleId) {
    return this.get(`api/enrollment/auditor/queue/route/user/details?auditTaskId=${auditTaskId}&roleId=${roleId}`);
  }

  routeSubscription(payload) {
    return this.post(payload, 'api/enrollment/auditor/queue/route');
  }

  saveOrSubmitSubscription(payload, submit = false) {
    return this.post(payload, `api/enrollment/auditor/queue/${submit? 'submit' : 'save'}`);
  }

  downloadFile(fileId: string) {
    return this.getBlob(
      `api/enrollment/file/management/download/attachment?fileId=${fileId}`
    );
  }

  deleteFile(taskId, position) {
    return this.get(
      `api/enrollment/file/management/delete/audit/task/attachmen?auditTaskId=${taskId}&position=${position}`
    );
  }

  deleteFileReview(flowId, position) {
    return this.get(
      `api/enrollment/file/management/delete/audit/flow/attachments?auditFlowId=${flowId}&position=${position}`
    );
  }

  uploadFile(formData: FormData) {
    return this.http.post(
      `${APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL}/api/enrollment/file/management/upload/audit/task/attachments`,
      formData
    );
  }

  uploadFileReview(formData: FormData) {
    return this.http.post(
      `${APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL}/api/enrollment/file/management/upload/audit/flow/attachments`,
      formData
    );
  }

  getDeatilsList(type: string, category: string) {
    return this.get(`api/enrollment/auditor/landing/${type}/details?workCategory=${category}`);
  }

  getAuditFailedDetails(auditFlowId, requestType) {
    let url = "";
    if (auditFlowId) {
      url = `api/enrollment/audit/specialist/queue/getFromDetail-transaction?auditFlowId=${auditFlowId}`;
    } else {
      url = `api/enrollment/audit/specialist/queue/get-transaction?workCategory=${requestType}`;
    }
    return this.get(url);
  }

  deleteTransaction(payload) {
    return this.post(payload, 'api/enrollment/auditor/landing/backlog/delete-transaction');
  }

  getSubscriptionAuditorReview(requestType) {
    return this.get(`api/enrollment/auditor/review-rebut/transaction?workCategory=${requestType}`);
  }
  
  reviewComplete(payload) {
    return this.post(payload, 'api/enrollment/auditor/review-rebut/complete');
  }

  acceptClaim(payload) {
    return this.post(payload, 'api/enrollment/auditor/review-rebut/accept');
  }

  resubmitClaim(payload, isAccept: boolean) {
    return this.post(payload, `api/enrollment/auditor/review-rebut/resubmit${isAccept ? '-accept' : ''}`);
  }

  saveClaim(payload) {
    return this.post(payload, 'api/enrollment/auditor/review-rebut/pend');
  }

  actionAuditFailedTask(payload, action) {
    return this.post(payload, `api/enrollment/audit/specialist/queue/transaction/${action}`);
  }

  getSubscriptionLeadManager(requestType: string = "", isManager) {
    return this.get(`api/enrollment/${isManager ? 'manager' : 'lead'}/review-rebut/get-transactions?workCategory=${requestType.toUpperCase()}`);
  }

  submitOrPendManagerLead(payload, isManager) {
    return this.post(payload,`api/enrollment/${isManager ? 'manager' : 'lead'}/review-rebut/submit/pend`);
  }

  rebutManagerLead(payload, isManager) {
    return this.post(payload,`api/enrollment/${isManager ? 'manager' : 'lead'}/review-rebut/rebut`);
  }

  getSubscriptionLeadManagerById(flowId, isManager) {
    return this.get(`api/enrollment/${isManager ? 'manager' : 'lead'}/review-rebut/getFromDetail-transactions?auditFlowId=${flowId}`);
  }

  getSubscriptionAuditorReviewById(flowId) {
    return this.get(`api/enrollment/auditor/review-rebut/fromDetail/transaction?auditFlowId=${flowId}`);
  }
}
