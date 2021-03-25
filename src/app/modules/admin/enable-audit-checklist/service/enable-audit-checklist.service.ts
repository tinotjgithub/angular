import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class EnableAuditChecklistService extends BaseHttpService {
  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getEnableFlag() {
    return this.get(
      "api/enrollment/audit/configuration/checklist/get-enable-flag"
    );
  }

  updateFlag(param) {
    return this.post(
      param,
      "api/enrollment/audit/configuration/checklist/update-flag"
    );
  }
}
