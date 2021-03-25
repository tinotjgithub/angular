import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuditRebuttalWorkflowService extends BaseHttpService {
  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getSavedWorkFlowConfig() {
    return this.get("api/rebuttal/configuration/workflow");
  }

  saveWorkFlowConfig(param) {
    return this.post(param, "api/rebuttal/configuration/save");
  }
}
