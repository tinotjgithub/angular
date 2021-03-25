import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AutoSamplingService extends BaseHttpService {
  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getSaved() {
    return this.get("api/audit/auto/settings");
  }

  getAvailablFilters() {
    return this.get("api/audit/auto/filter");
  }

  saveSettings(param) {
    return this.post(param, "api/audit/auto/settings/save");
  }
}
