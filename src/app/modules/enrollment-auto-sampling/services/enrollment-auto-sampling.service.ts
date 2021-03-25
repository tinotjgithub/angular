import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "src/app/services/base-http.service";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class EnrollmentAutoSamplingService extends BaseHttpService {
  constructor(private http: HttpClient, private router: Router) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getAvailableilterSettings() {
    return this.get("api/enrollment/audit/auto/filter");
  }

  getSavedSettings() {
    return this.get("api/enrollment/audit/auto/settings");
  }

  saveSamplingSettings(param) {
    return this.post(param, "api/enrollment/audit/auto/settings/save");
  }

  getAvailableEnrollmentSpecialists(param) {
    return this.post(param, "api/enrollment/audit/manual/specialist");
  }
}
