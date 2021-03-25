import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class WorkCategoryService extends BaseHttpService {
  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getWorkCategoryDetailsData(workCategory) {
    return this.get(
      "api/enrollment/audit/specialist/queue/audit-failed/details?workCategory=" +
        workCategory
    );
  }
}
