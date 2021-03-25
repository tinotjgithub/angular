import { APP_CONFIG } from "src/app/services/config/config.service";
import { Injectable } from "@angular/core";
import { NotifierService } from "src/app/services/notifier.service";
import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "src/app/services/base-http.service";

@Injectable({
  providedIn: "root",
})
export class EnrollmentManualPrioritizationService extends BaseHttpService {
  constructor(
    public http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  loadSubs(workCategory) {
    return this.get(
      "api/enrollment/manual/prioritization/unassigned?workCategory=" +
        workCategory
    );
  }
  
  getPriorityLevels() {
    return this.get("api/enrollment/manual/prioritization/priority");
  }

  reprioritize(payload){
    return this.post(payload, "api/enrollment/manual/prioritization/general/queue/prioritize");
  }
}
