import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class EmrollmentLeadLandingPageService extends BaseHttpService {
  teamStatus: any;

  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  setStatus(val: any) {
    this.teamStatus = val;
  }

  getDeatils(status: any) {
    const url = `api/enrollment-lead/`.concat(status).concat(`/details`);
    return this.get(url);
  }

  getMyTeamStatus() {
    return this.get("api/enrollment-lead/my-team-status");
  }

  getMyWorkStatus() {
    return this.get("api/enrollment-lead/my-status");
  }

  getInventoryQueue() {
    return this.get("api/enrollment-lead/open-inventory");
  }

  get myTeamStatus() {
    return this.teamStatus;
  }

  getRoutedInDetails() {
    return this.get("api/enrollment-lead/routed-in/details");
  }

  getEnrollmentLeadStatus() {
    return this.get("api/enrollment/lead-landing/task-status");
  }

  getEnrollmentManagerStatus() {
    return this.get("api/enrollment/manager/landing/rebuttal-review/count");
  }

  getEnrollmentLeadSpecialistCount() {
    return this.get("api/enrollment/lead-landing/specialist/count");
  }

  getTotalConfiguredItems() {
    return this.get("api/enrollment/lead-landing/active-workCategory");
  }

  getEnrollmentLeadPendingCount() {
    return this.get("api/enrollment/pend/reassignment/user/count");
  }

  getDeatilsSpecialist() {
    return this.get("api/enrollment/lead-landing/specialist/details");
  }

  getDeatilsList(status, type) {
    return this.get(
      `api/enrollment/lead-landing/${status}/details?workCategory=${type}`
    );
  }

  getPendingAssignmentDetails() {
    return this.get("api/enrollment/pend/reassignment/user/detail");
  }
}
