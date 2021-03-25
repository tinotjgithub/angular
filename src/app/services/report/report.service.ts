import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BaseHttpService } from "../base-http.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { NotifierService } from "../notifier.service";
import { CryptoService } from "../crypto-service/crypto.service";
import { ROLES } from "src/app/shared/constants.js";

@Injectable({
  providedIn: "root"
})
export class ReportService {
  private reportExistSub = new Subject<boolean>();
  private currentReportFiltersSubject = new Subject<any>();
  private managerUsergroupSubject = new Subject<any>();
  private myReportsIdsSub = new Subject<any>();
  private myUsersSub = new Subject<any>();

  public currentReportId: any;
  public myReportsList: any[];
  public myReportIds: number[];
  public currentReportFilters: any;
  public myUsersResponse: any;

  constructor(
    private http: BaseHttpService,
    private messageService: NotifierService,
    private authService: AuthenticationService,
    private secureLocalStorage: CryptoService
  ) {}

  getCurrentReportFilterListener() {
    return this.currentReportFiltersSubject.asObservable();
  }

  getMyUserReportListner() {
    return this.myUsersSub.asObservable();
  }

  /* getManagerUserGroupsListner() {
    return this.managerUsergroupSubject.asObservable();
  } */

  myReportIdListener() {
    return this.myReportsIdsSub.asObservable();
  }

  /*  reportExistListener() {
    return this.reportExistSub.asObservable();
  } */

  setReport(id: any) {
    this.currentReportId = id;

    if (this.reportExistForCurrentTab()) {
      this.currentReportFiltersSubject.next(this.getCurrentReportFilter(id));
    } else {
      this.currentReportFiltersSubject.next({});
    }
  }

  getMyReportIds() {
    this.myReportIds = [];
    this.myReportsList.forEach(item => {
      this.myReportIds.push(item.reportId);
    });
    this.myReportsIdsSub.next(this.myReportIds);
  }

  saveReport(report) {
    this.deleteExistingSavedItem();
    this.myReportsList.push({
      reportFilter: report,
      reportId: this.currentReportId
    });
    this.myReportIds.push(this.currentReportId);
  }

  private deleteExistingSavedItem() {
    if (this.myReportsList !== undefined && this.myReportsList.length > -1) {
      let index = -1;
      this.myReportsList.forEach((item, i) => {
        if (item.reportId === this.currentReportId) {
          index = i;
        }
      });
      if (index > -1) {
        this.myReportsList.splice(index, 1);
      }
    }
  }

  reportExistForCurrentTab() {
    let index = -1;
    this.myReportIds.forEach((item, i) => {
      if (item === this.currentReportId) {
        index = i;
      }
    });
    return index !== -1;
  }

  getCurrentReportFilter(id) {
    const item = this.myReportsList.filter(report => {
      if (report.reportId === id) {
        return report.reportFilter;
      }
    });
    console.log(item[0].reportFilter);
    return item[0].reportFilter;
  }

  getUserReports() {
    const params = { userId: "abc@abc.com" };
    this.http.get("api/report/get-reports", params).subscribe(reports => {
      this.myReportsList = reports;
      this.getMyReportIds();
    });
  }

  getClaimCompletionReportGrid(param) {
    const url =
      this.authService.roleId === ROLES.lead
        ? "api/reports/leads/claims-completion-grid-view"
        : "api/reports/completed-claim-grid";
    return this.http.post(param, url);
  }

  getClaimCompletionReportExcel(param) {
    const url =
      this.authService.roleId === ROLES.lead
        ? "api/reports/leads/claims-completion-report"
        : "api/reports/completed-claim-report";
    return this.http.getExcel(param, url);
  }

  getMyUserReport(param) {
    this.http
      .post(param, "api/reports/users-list-report-manager-view")
      .subscribe(
        (data: any) => {
          this.messageService.throwNotification({
            type: "success",
            message: data.message
              ? data.message
              : "Report fetched successfully!"
          });
          this.myUsersResponse = data;
          this.myUsersSub.next(this.myUsersResponse);
        },
        error => {
          this.myUsersResponse = [];
          return;
        }
      );
  }

  getManagerUserGroups() {
    return this.http.get("api/userGroup/getUserGroupsForManager");
  }

  getLeadUserGroups() {
    return this.http.get("api/userGroup/getAllUserGroupsForLead");
  }

  getUserGrps() {
    if (this.authService.roleId === ROLES.lead) {
      return this.getLeadUserGroups();
    } else if (this.authService.roleId === ROLES.manager) {
      return this.getManagerUserGroups();
    }
  }

  getExaminerListAgainstUserGrp(userGroup) {
    return this.http.post(
      userGroup,
      "api/resource-dashboard/user-group/examiners"
    );
  }

  getUserListReports(payload) {
    const role = this.secureLocalStorage.getItem("roleId");
    const apiUrl =
      role === "Manager"
        ? "api/reports/manger-user-list-report"
        : role === "Claims Lead"
        ? "api/reports/leads/user-list-report"
        : "api/admin/reports/users-list-report";
    return this.http.getExcel(payload, apiUrl);
  }

  getUserListReportData(payload) {
    const role = this.secureLocalStorage.getItem("roleId");
    const apiUrl =
      role === "Claims Lead"
        ? "api/reports/leads/users-list-report-Lead-view"
        : "api/admin/reports/users-list-grid";
    return this.http.post(payload, apiUrl);
  }

  getClaimsStatusByPendeOrRoutedReport(payload, reportType) {
    const apiUrl =
      reportType === "Pended"
        ? "api/reports/leads/claims-status-pended-report"
        : "api/reports/leads/claims-status-routedin-report";
    return this.http.getExcel(payload, apiUrl);
  }

  getClaimsStatusByPendeOrRoutedData(payload, reportType) {
    const apiUrl =
      reportType === "Pended"
        ? "api/reports/leads/claims-status-pended-grid-view"
        : "api/reports/leads/claims-status-routedin-grid-view";
    return this.http.post(payload, apiUrl);
  }

  generateClaimQuality(param) {
    const segment =
      this.authService.roleId === "Claims Lead"
        ? "api/reports/leads/claim-examiners-quality-report"
        : "api/reports/claim-examiners-quality-report";
    return this.http.getExcel(param, segment);
  }

  getClaimQualityData(param) {
    const segment =
      this.authService.roleId === "Claims Lead"
        ? "api/reports/leads/claim-examiners-quality-grid-view"
        : "api/reports/audit-grid-view";
    return this.http.post(param, segment);
  }

  getClaimAgeRange() {
    return this.http.get("api/reports/leads/getClaimAgeRange");
  }

  downloadAttachment() {
    return this.http.getBlob("api/file/download/attachment");
  }
}
interface Report {
  reportId: number;
  report: any;
}
