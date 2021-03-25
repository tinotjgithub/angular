import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "src/app/services/base-http.service";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class ManagerEnrollmentLandingPageService extends BaseHttpService {
  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  enrollmentActiveUserSnapShotDetails() {
    return this.get("api/enrollment/manager/operations/user/snapshot");
  }

  getEnrollmentManagerStatus(){
    return this.get("api/enrollment/manager/landing/task-status");
  }

  refreshEnrollmentWorkBasket() {
    return this.post({}, "api/data-load/enrollment");
  }

  getAuditStatusEnrollmentLeadManager() {
    return this.get("api/enrollment-audit/my-queue-summary");
  }

  getManagerEnrllmentStatus() {
    return this.get("api/managerlanding/claimQueue/detail");
  }

  getManagerEnrollmenttaskStatus() {
    return this.get("api/enrollment/manager/landing/enrollment-task-status");
  }
}
