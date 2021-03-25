import { APP_CONFIG } from 'src/app/services/config/config.service';
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BaseHttpService } from "./../../../../../../services/base-http.service";

import { HttpClient } from "@angular/common/http";
import { NotifierService } from 'src/app/services/notifier.service';
@Injectable({
  providedIn: "root"
})
export class EnrollmentManualAssigmentService extends BaseHttpService {
  constructor(
    public http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getSubscription(payload) {
    return this.post(payload, 'api/enrollment/manual-assignment/unassigned-transaction');
  }

  getAuditorNames() {
    return this.get('api/enrollment/manual-assignment/auditor-details');
  }

  assignToAuditor(payload) {
    return this.post(payload, 'api/enrollment/manual-assignment/assign-to-auditor');
  }

  assignToGeneral(payload) {
    return this.post(payload, 'api/enrollment/manual-assignment/audit-queue');
  }

}
