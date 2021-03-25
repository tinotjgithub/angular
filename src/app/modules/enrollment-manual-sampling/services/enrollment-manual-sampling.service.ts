import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class EnrollmentManualSamplingService extends BaseHttpService {
  auditerQueueList: any[];
  navigationEnabled: any = false;
  auditorReqstParam: any;

  constructor(private http: HttpClient, private router: Router) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getSavedSettings() {
    return this.get("api/enrollment/audit/manual/settings");
  }

  getAvailableilterSettings() {
    return this.get("api/enrollment/audit/manual/filter");
  }

  getAvailableEnrollmentSpecialists(param) {
    return this.post(param, "api/enrollment/audit/manual/specialist");
  }

  refreshClaimCount(param) {
    return this.post(param, "api/enrollment/audit/manual/refresh/count");
  }

  addToAuditQueue(param) {
    return this.post(param, "api/enrollment/general/queue/add");
  }

  addToAuditorsOwnQueue(param) {
    return this.post(param, "api/enrollment/auditor/queue/self-add");
  }

  getAuditQueueCount() {
    return this.get("api/enrollment/assigned/count/user");
  }

  saveSamplingSettings(param) {
    return this.post(param, "api/enrollment/audit/manual/settings/save");
  }

  loadClaimStatistics(param) {
    return this.post(param, "api/enrollment/audit/manual/population/statistics");
  }

  loadAuditerQueueList() {
    return this.post(
      this.auditorReqstParam,
      "api/enrollment/sampling/auditor/queue/list"
    );
  }

  setAuditorQueueList(list) {
    this.auditerQueueList = list;
  }

  navigateToAuditorQue(reqParam) {
    this.navigationEnabled = true;
    this.auditorReqstParam = reqParam;
    this.router.navigate(["enrollment-manual-sampling/add-to-audit-queue-detail"]);
  }

  getAuditorNamesForRouteOut() {
    return this.get("api/enrollment/auditors");
  }

  getAssociatedUserGroupsOfAuditor(id) {
    return this.get(
      "api/enrollment/auditor/details".concat("?auditorUserId=" + id)
    );
  }

  setnavigationEnabled(enabled) {
    this.navigationEnabled = enabled;
  }

  assignSubscriptionsToAuditor(param) {
    return this.post(param, "api/enrollment/sampling/auditor/queue/add");
  }

  removeAssignedSubscriptionsAndReturnAuidtQueue(assigned: any[]) {
    this.auditerQueueList = this.auditerQueueList.filter(item => {
      return !assigned.includes(item.subscriptionId);
    });
    return this.auditerQueueList;
  }

  getUserWorkItemTypes() {
    return this.http.get(`${APP_CONFIG.ENROLLMENT_SERVER_URL}/api/enrollment/active/work-category`);
  }
}
