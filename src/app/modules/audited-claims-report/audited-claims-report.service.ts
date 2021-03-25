import { Injectable } from "@angular/core";
import { BaseHttpService } from "./../../services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { NotifierService } from "./../../services/notifier.service";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuditedClaimsReportService extends BaseHttpService {
  auditedClaimsReportResponse: any;
  auditedClaimsReportReportsSub = new Subject<any>();
  auditedClaimsReportSub = new Subject<any>();
  constructor(
    private http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getAuditedClaimsReportReportsListner() {
    return this.auditedClaimsReportReportsSub.asObservable();
  }

  getAuditedClaimsReportListner() {
    return this.auditedClaimsReportSub.asObservable();
  }

  getAuditedClaimsReport(param) {
    this.post(param, "api/reports/audit-claims-list-grid-view").subscribe(
      (data: any) => {
        this.messageService.throwNotification({
          type: "success",
          message: data.message ? data.message : "Report fetched successfully!"
        });
        this.auditedClaimsReportResponse = data;
        this.auditedClaimsReportSub.next(this.auditedClaimsReportResponse);
      },
      error => {
        this.auditedClaimsReportResponse = [];
        return;
      }
    );
  }

  getAuditedClaimsReportReports(payload) {
    return this.getExcel(
      payload,
      "api/reports/audit-claims-list-report-template"
    );
  }
}
