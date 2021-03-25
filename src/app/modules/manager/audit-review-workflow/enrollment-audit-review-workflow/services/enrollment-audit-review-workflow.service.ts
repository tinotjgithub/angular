import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MessageService } from "primeng/api";
import { NotifierService } from "src/app/services/notifier.service";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class EnrollmentAuditReviewWorkflowService extends BaseHttpService {
  constructor(
    private http: HttpClient,
    private notifierService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getEnrollmentReviewWorklowRoles() {
    return this.get("api/enrollment/configuration/review-roles");
  }

  saveEnrollmentWorkFlowRoles(payload) {
    return this.post(
      payload,
      "api/enrollment/configuration/create/review-roles"
    );
  }
}
