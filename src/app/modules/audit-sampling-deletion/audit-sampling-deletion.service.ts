import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";
import { BaseHttpService } from "./../../services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuditSamplingDeletionService extends BaseHttpService {
  private auditedClaimsReportReportsSub = new Subject<any>();
  public samplingDeletionReportSub = new Subject<any>();
  private reassignmentBySub = new Subject<any>();
  public deletedByNamesSub = new Subject<any>();
  public deletedByRolesSub = new Subject<any>();
  public deletedByNamesResponse: any;
  public deletedByRolesResponse: any;
  public reassignmentByResponse: any;
  public samplingDeletionReportResponse: any;
  constructor(
    private http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  samplingDeletionReportListner() {
    return this.samplingDeletionReportSub.asObservable();
  }

  getUserRolesListner() {
    return this.deletedByRolesSub.asObservable();
  }

  getDeletedByNamesListner() {
    return this.deletedByNamesSub.asObservable();
  }

  samplingDeletionReport(param) {
    this.post(param, "api/deletion/reports").subscribe(
      (data: any) => {
        this.messageService.throwNotification({
          type: "success",
          message: data.message ? data.message : "Report fetched successfully!"
        });
        this.samplingDeletionReportResponse = data;
        this.samplingDeletionReportSub.next(
          this.samplingDeletionReportResponse
        );
      },
      error => {
        this.samplingDeletionReportResponse = [];
        return;
      }
    );
  }

  getDeletedByNames(rolArray) {
    this.post(rolArray, "api/deletion/deleted-by-names").subscribe(
      data => {
        this.deletedByNamesResponse = data;
        this.deletedByNamesSub.next(this.deletedByNamesResponse);
      },
      error => {
        this.deletedByNamesResponse = [];
        return;
      }
    );
  }

  getUserRoles() {
    this.get("api/deletion/deleted-by-roles").subscribe(
      data => {
        this.deletedByRolesResponse = data;
        this.deletedByRolesSub.next(this.deletedByRolesResponse);
      },
      error => {
        this.deletedByRolesResponse = [];
        return;
      }
    );
  }

  samplingDeletionReportExcel(payload) {
    return this.getExcel(payload, "api/deletion/reports-excel");
  }
}
