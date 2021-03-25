import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "src/app/services/base-http.service";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class EnrollmentRebutReviewService extends BaseHttpService {
  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getDetailList(workCategory) {
    return this.get(
      "api/enrollment/manager/landing/rebuttal-review/details?workCategory=" +
        workCategory
    );
  }

  getEnrollmentManagerStatus() {
    return this.get("api/enrollment/manager/landing/rebuttal-review/count");
  }
}
