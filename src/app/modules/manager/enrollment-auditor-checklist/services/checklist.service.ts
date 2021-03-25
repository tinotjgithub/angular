import { Injectable } from "@angular/core";
import { APP_CONFIG } from "src/app/services/config/config.service";
import { HttpClient } from "@angular/common/http";
import { NotifierService } from "src/app/services/notifier.service";
import { BaseHttpService } from "src/app/services/base-http.service";

@Injectable({
  providedIn: "root"
})
export class ChecklistService extends BaseHttpService {
  constructor(
    private http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getChecklist() {
    return this.get("api/enrollment/audit/configuration/checklist");
  }

  addChecklist(payload) {
    return this.post(
      payload,
      "api/enrollment/audit/configuration/checklist/add"
    );
  }

  removeChecklist(payload) {
    return this.post(
      payload,
      "api/enrollment/audit/configuration/checklist/remove"
    );
  }

  editChecklist(payload) {
    return this.post(
      payload,
      "api/enrollment/audit/configuration/checklist/update"
    );
  }

  getWorkCategories() {
    return this.get("api/enrollment/active/work-category");
  }
}
