import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class ManualSamplingService extends BaseHttpService {
  auditerQueueList: any[];
  navigationEnabled: any = false;
  auditorReqstParam: any;

  constructor(private http: HttpClient, private router: Router) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  importDiagnosisOrProcedureCodeFile(formData) {
    return this.getExcel(formData, "api/audit/medical/code");
  }

  getSavedSettings() {
    return this.get("api/audit/manual/settings");
  }

  getAvailableilterSettings() {
    return this.get("api/audit/manual/filter");
  }

  getDiagnosisDescriptions(query: any) {
    return this.get(
      "api/audit/manual/diagnosis/search" + "?code=" + query
    );
  }

  getProcedureDescriptions(query: any) {
    return this.get("api/audit/manual/procedure/search" + "?code=" + query);
  }

  getAvailableClaimExaminers(param) {
    return this.post(param, "api/audit/manual/examiner");
  }

  refreshClaimCount(param) {
    return this.post(param, "api/audit/manual/refresh/count");
  }

  addToAuditQueue(param) {
    return this.post(param, "api/audit/manual/general/queue/add");
  }

  addToAuditorsOwnQueue(param) {
    return this.post(param, "api/audit/manual/auditor/queue/self-add");
  }

  getAuditQueueCount() {
    return this.get("api/audit/manual/assigned/count/user");
  }

  saveSamplingSettings(param) {
    return this.post(param, "api/audit/manual/settings/save");
  }

  loadClaimStatistics(param) {
    return this.post(param, "api/audit/manual/population/statistics");
  }

  loadAuditerQueueList() {
    return this.post(
      this.auditorReqstParam,
      "api/audit/manual/sampling/auditor/queue/list"
    );
  }

  setAuditorQueueList(list) {
    this.auditerQueueList = list;
  }

  navigateToAuditorQue(reqParam) {
    this.navigationEnabled = true;
    this.auditorReqstParam = reqParam;
    this.router.navigate(["manual-sampling/add-to-audit-queue-detail"]);
  }

  getAuditorNamesForRouteOut() {
    return this.get("api/audit/manual/auditors");
  }

  getAssociatedUserGroupsOfAuditor(id) {
    return this.get(
      "api/audit/manual/auditor/details".concat("?auditorUserId=" + id)
    );
  }

  setnavigationEnabled(enabled) {
    this.navigationEnabled = enabled;
  }

  assignClaimsToAuditor(param) {
    return this.post(param, "api/audit/manual/sampling/auditor/queue/add");
  }

  removeAssignedClaimsAndReturnAuidtQueue(assigned: any[]) {
    this.auditerQueueList = this.auditerQueueList.filter(item => {
      return !assigned.includes(item.claimId);
    });
    return this.auditerQueueList;
  }
}
