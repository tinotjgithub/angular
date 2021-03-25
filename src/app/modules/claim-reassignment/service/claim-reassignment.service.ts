import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { Subject } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";

@Injectable({
  providedIn: "root"
})
export class ClaimReassignmentService {
  private auditedClaimsReportReportsSub = new Subject<any>();
  public reassignmentReportSub = new Subject<any>();
  public reassignmentBySub = new Subject<any>();
  public reassignmentByResponse: any;
  public reassignmentResponse: any;
  constructor(
    private http: BaseHttpService,
    private messageService: NotifierService
  ) {}

  getReassignedByListner() {
    return this.reassignmentBySub.asObservable();
  }

  getAuditedClaimsReportListner() {
    return this.reassignmentReportSub.asObservable();
  }

  getFromRoles() {
    return this.http.get("api/reassign/get-roles");
  }

  getToRoles(param) {
    return this.http.post(param, "api/reassign/get-assign-to-roles");
  }

  getAssignToStatus(param) {
    return this.http.post(param, "api/reassign/claim-status-reassign");
  }

  listClaims(param) {
    return this.http.post(param, "api/reassign/list-claims");
  }

  getAssignFromUsersList(param) {
    return this.http.post(param, "api/reassign/get-users-list");
  }

  getReassignmentReasonList() {
    return this.http.get("api/configuration/reassignment-reasons");
  }

  getAssignToUsersList(param) {
    return this.http.post(param, "api/reassign/users-per-user-group");
  }

  refreshClaims(param) {
    return this.http.post(param, "api/reassign/refresh-claims");
  }

  reAssignClaims(param) {
    return this.http.post(param, "api/reassign/reassign-claims");
  }

  loadUserGroups(param) {
    return this.http.post(param, "api/reassign/get-user-groups");
  }

  loadClaimStatusCount(param) {
    return this.http.post(param, "api/reassign/get-claims-count-per-user");
  }

  loadClaimStatusCountAndList(param) {
    return this.http.post(param, "api/reassign/get-claims-count-details");
  }

  getReassignmentReport(param) {
    this.http.post(param, "api/reports/reassign").subscribe(
      (data: any) => {
        this.reassignmentResponse = data;
        this.reassignmentReportSub.next(this.reassignmentResponse);
      },
      error => {
        this.reassignmentResponse = [];
        return;
      }
    );
  }

  getReassignmentReportExcel(payload) {
    return this.http.getExcel(payload, "api/reports/reassign-excel-download");
  }

  getReassignedBy() {
    const url = `api/reports/reassigned-by-names`;
    this.http.get(url).subscribe(
      data => {
        this.reassignmentByResponse = data;
        this.reassignmentBySub.next(this.reassignmentByResponse);
      },
      error => {
        this.reassignmentByResponse = [];
        return;
      }
    );
  }

  autoReAssignClaims(param) {
    return this.http.post(param, "api/reassign/auto-reassign-claims");
  }
}
