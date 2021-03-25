import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { NotifierService } from "./../../../services/notifier.service";
import { BaseHttpService } from "./../../../services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuditorReportService extends BaseHttpService {
  auditReportSub = new Subject<any>();
  auditBacklogReportSub = new Subject<any>();
  auditRebuttalReportSub = new Subject<any>();

  auditReportResponse: any;
  public auditBacklogReportResponse: any;
  public auditRebuttalReportResponse: any;

  constructor(
    private http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getAuditReportListner() {
    return this.auditReportSub.asObservable();
  }

  getAuditRebuttalReportListner() {
    return this.auditRebuttalReportSub.asObservable();
  }

  getAuditBacklogReportListner() {
    return this.auditBacklogReportSub.asObservable();
  }

  getAuditReport(param) {
    this.post(param, "api/reports/auditor/audit-list-grid-view").subscribe(
      (data: any) => {
        this.messageService.throwNotification({
          type: "success",
          message: data.message ? data.message : "Report fetched successfully!"
        });
        this.auditReportResponse = data;
        this.auditReportSub.next(this.auditReportResponse);
      },
      error => {
        this.auditReportResponse = [];
        return;
      }
    );
  }

  getAuditReports(payload) {
    return this.getExcel(payload, "api/reports/auditor/audit-list-report");
  }

  getAuditRebuttalReport(param) {
    this.post(
      param,
      "api/reports/auditor/audit-rebuttal-list-grid-view"
    ).subscribe(
      (data: any) => {
        this.messageService.throwNotification({
          type: "success",
          message: data.message ? data.message : "Report fetched successfully!"
        });
        this.auditRebuttalReportResponse = data;
        this.auditRebuttalReportSub.next(this.auditRebuttalReportResponse);
      },
      error => {
        this.auditRebuttalReportResponse = [];
        return;
      }
    );
  }

  getAuditRebuttalReports(payload) {
    return this.getExcel(
      payload,
      "api/reports/auditor/audit-rebuttal-list-report"
    );
  }

  getAuditBacklogReport(param) {
    this.post(
      param,
      "api/reports/auditor/audit-backlog-list-grid-view"
    ).subscribe(
      (data: any) => {
        this.messageService.throwNotification({
          type: "success",
          message: data.message ? data.message : "Report fetched successfully!"
        });
        this.auditBacklogReportResponse = data;
        this.auditBacklogReportSub.next(this.auditBacklogReportResponse);
      },
      error => {
        this.auditBacklogReportResponse = [];
        return;
      }
    );
  }

  getAuditBacklogReportReports(payload) {
    return this.getExcel(
      payload,
      "api/reports/auditor/audit-backlog-list-report"
    );
  }
}
