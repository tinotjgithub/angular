import { Injectable } from "@angular/core";
import { Subject, iif } from "rxjs";
import { BaseHttpService } from "./../../../../services/base-http.service";
import { NotifierService } from "./../../../../services/notifier.service";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "./../../../../services/header/header.service";
import { APP_CONFIG } from "src/app/services/config/config.service";
@Injectable({
  providedIn: "root"
})
export class EnrollmentLeadDashboardService extends BaseHttpService {
  prodVolFetch = new Subject<any[]>();
  pendedRecordsAgeFetch = new Subject<any[]>();
  completedReqCatFetch = new Subject<any[]>();
  auditTransCatFetch = new Subject<any[]>();
  auditSummaryResponse: any;
  auditSummaryFetch = new Subject<any[]>();
  prodVolSplFetch = new Subject<any[]>();
  enrollLeadUserGroupsSub = new Subject<any[]>();
  enrollLeadSpecialistsSub = new Subject<any[]>();
  specialistProdScoresFetch = new Subject<any[]>();
  enrollmentTransactionFetch = new Subject<any[]>();
  enrollmentRequestFetch = new Subject<any[]>();
  enrollLeadCategoryFetch = new Subject<any[]>();
  leadRebuttalStatusFetch = new Subject<any[]>();
  auditorWorkingClaimsFetch = new Subject<any[]>();
  pendedTransactionFetch = new Subject<any[]>();
  productionVolStatusResponse: any;
  pendedTransactionResponse: any;
  rebuttalStsResponse: any;
  enrollmentLeadGridViewResponse: any;
  enrollmentLeadGridViewFetch = new Subject<any[]>();
  enrollAuditorResponse: any;
  enrollAuditorFetch = new Subject<any[]>();
  rebuttalStsFetch = new Subject<any[]>();
  productionVolStatusFetch = new Subject<any[]>();
  auditorWorkingClaimsResponse: any;
  leadRebuttalStatusResponse: any;
  enrollLeadCategoryResponse: any;
  auditByRequestTypeResponse: any;
  auditByRequestTypeFetch = new Subject<any[]>();
  pendedRecordsAgeResponse: any;
  enrollmentTransactionResponse: any;
  specialistWorkingResponse: any;
  specialistWorkingFetch = new Subject<any[]>();
  auditRequestFetch = new Subject<any[]>();
  auditTransFetch = new Subject<any[]>();
  auditRequestResponse: any;
  enrollLeadUserGroupsResponse: any;
  auditTransResponse: any;
  enrollmentRequestResponse: any;
  prodVolResponse: any;
  completedReqCatResponse: any;
  auditTransCatResponse: any;
  productionCountCatClaimsResponse: any;
  productionCountCatClaimsFetch = new Subject<any[]>();
  enrollLeadSpecialistsResponse: any;
  prodVolSplResponse: any;
  specialistProdScoresResponse: any;

  constructor(
    private http: HttpClient,
    public baseHTTPService: BaseHttpService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  getProductionVolClaimsListner() {
    return this.productionVolStatusFetch.asObservable();
  }
  getRebuttalStatusClaimsListner() {
    return this.rebuttalStsFetch.asObservable();
  }
  getAuditRequestClaimsListner() {
    return this.auditRequestFetch.asObservable();
  }
  getSpecialistWorkingClaimsListner() {
    return this.specialistWorkingFetch.asObservable();
  }
  getAuditorWorkingClaimsListner() {
    return this.auditorWorkingClaimsFetch.asObservable();
  }
  getAuditorWorkingListner() {
    return this.auditorWorkingClaimsFetch.asObservable();
  }

  productionVolListner() {
    return this.prodVolFetch.asObservable();
  }

  getAuditTransClaimsListner() {
    return this.auditTransFetch.asObservable();
  }

  completedReqCatListner() {
    return this.completedReqCatFetch.asObservable();
  }

  auditTransCatListner() {
    return this.auditTransCatFetch.asObservable();
  }

  getGridViewEnrollmentLeadListner() {
    return this.enrollmentLeadGridViewFetch.asObservable();
  }

  getEnrollAuditorsListner() {
    return this.enrollAuditorFetch.asObservable();
  }

  getAuditByRequestTypeListner() {
    return this.auditByRequestTypeFetch.asObservable();
  }
  getLeadRebuttalStatusListner() {
    return this.leadRebuttalStatusFetch.asObservable();
  }

  prodVolSplListner() {
    return this.prodVolSplFetch.asObservable();
  }

  auditSummaryListner() {
    return this.auditSummaryFetch.asObservable();
  }

  getPendedTransactionReportListner() {
    return this.pendedTransactionFetch.asObservable();
  }

  getEnrollLeadUserGroupsListner() {
    return this.enrollLeadUserGroupsSub.asObservable();
  }

  getEnrollLeadSpecialistsListner() {
    return this.enrollLeadSpecialistsSub.asObservable();
  }

  getEnrollLeadCategoryListner() {
    return this.enrollLeadCategoryFetch.asObservable();
  }

  getSpecialistProdScoresListner() {
    return this.specialistProdScoresFetch.asObservable();
  }

  getEnrollmentTransactionTrendListner() {
    return this.enrollmentTransactionFetch.asObservable();
  }

  getEnrollmentRequestTrendListner() {
    return this.enrollmentRequestFetch.asObservable();
  }

  getPendedRecordsAgeListner() {
    return this.pendedRecordsAgeFetch.asObservable();
  }

  getEnrollLeadUserGroups() {
    const url = `api/enrollment/lead-dashboard/user-group`;
    this.get(url).subscribe(
      data => {
        this.enrollLeadUserGroupsResponse = data;
        this.enrollLeadUserGroupsSub.next(this.enrollLeadUserGroupsResponse);
      },
      error => {
        this.enrollLeadUserGroupsResponse = [];
        return;
      }
    );
  }

  getEnrollAuditors(groupId) {
    const params = {
      groupId
    };
    const url = `api/enrollment/lead-dashboard/user-group/auditors`;
    this.post(params, url).subscribe(
      data => {
        this.enrollAuditorResponse = data;
        this.enrollAuditorFetch.next(this.enrollAuditorResponse);
      },
      error => {
        this.enrollAuditorResponse = [];
        return;
      }
    );
  }

  getEnrollLeadSpecialists(groupId) {
    const params = {
      groupId
    };
    const url = `api/enrollment/lead-dashboard/user-group/specialists`;
    this.post(params, url).subscribe(
      data => {
        this.enrollLeadSpecialistsResponse = data;
        this.enrollLeadSpecialistsSub.next(this.enrollLeadSpecialistsResponse);
      },
      error => {
        this.enrollLeadSpecialistsResponse = [];
        return;
      }
    );
  }

  getPendedTransactionReport(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.getExcel(
      param,
      "api/enrollment/specialist-dashboard-reports/pended-report"
    ).subscribe(
      data => {
        this.pendedTransactionResponse = data;
        this.pendedTransactionFetch.next(this.pendedTransactionResponse);
      },
      error => {
        this.pendedTransactionResponse = [];
        return;
      }
    );
  }

  getEnrollLeadCategory(role) {
    const url =
      role === "Enrollment Lead"
        ? `api/lead-dashboard/category`
        : `api/enrollment/specialist-dashboard/category`;
    this.get(url).subscribe(
      data => {
        this.enrollLeadCategoryResponse = data;
        this.enrollLeadCategoryFetch.next(this.enrollLeadCategoryResponse);
      },
      error => {
        this.enrollLeadCategoryResponse = [];
        return;
      }
    );
  }

  productionVol(fromDate, toDate, userGroupId, specialistId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      specialistId
    };
    this.post(
      param,
      "api/enrollment/lead-dashboard/production-vol-by-status"
    ).subscribe(
      (data: any) => {
        this.prodVolResponse = data;
        this.prodVolFetch.next(this.prodVolResponse);
      },
      error => {
        this.prodVolResponse = [];
        return;
      }
    );
  }

  prodVolSpl(fromDate, toDate, userGroupId, specialistId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      specialistId
    };
    this.post(
      param,
      "api/enrollment/lead-dashboard/production-vol-by-specialist"
    ).subscribe(
      (data: any) => {
        this.prodVolSplResponse = data;
        this.prodVolSplFetch.next(this.prodVolSplResponse);
      },
      error => {
        this.prodVolSplResponse = [];
        return;
      }
    );
  }
  auditSummary(fromDate, toDate, userGroupId, auditorId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      auditorId
    };
    this.post(
      param,
      "api/enrollment/lead-dashboard/audit-summary-by-auditor"
    ).subscribe(
      (data: any) => {
        this.auditSummaryResponse = data;
        this.auditSummaryFetch.next(this.auditSummaryResponse);
      },
      error => {
        this.auditSummaryResponse = [];
        return;
      }
    );
  }

  completedReqCat(fromDate, toDate, category, specialistId, userGroupId, role) {
    const param =
      role === "Enrollment Lead"
        ? {
            fromDate,
            toDate,
            specialistId,
            userGroupId
          }
        : {
            fromDate,
            toDate,
            category
          };
    const url =
      // role === "Enrollment Specialist"
      //   ?
        "api/enrollment/specialist-dashboard/production-count-by-TransactionCategory"
        // : "api/enrollment/lead-dashboard/completed-by-category";
    this.post(param, url).subscribe(
      (data: any) => {
        this.completedReqCatResponse = data;
        this.completedReqCatFetch.next(this.completedReqCatResponse);
      },
      error => {
        this.completedReqCatResponse = [];
        return;
      }
    );
  }

  auditTransCat(fromDate, toDate, auditorId, userGroupId) {
    const param = {
      fromDate,
      toDate,
      auditorId,
      userGroupId
    };
    this.post(
      param,
      "api/enrollment/lead-dashboard/audit-trans-category"
    ).subscribe(
      (data: any) => {
        this.auditTransCatResponse = data;
        this.auditTransCatFetch.next(this.auditTransCatResponse);
      },
      error => {
        this.auditTransCatResponse = [];
        return;
      }
    );
  }

  getAuditByRequestType(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/resource-dashboard/audit-request-type").subscribe(
      (data: any) => {
        this.auditByRequestTypeResponse = data;
        this.auditByRequestTypeFetch.next(this.auditByRequestTypeResponse);
      },
      error => {
        this.auditByRequestTypeResponse = [];
        return;
      }
    );
  }

  getLeadRebuttalStatus(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/enrollment/lead-dashboard/lead-rebuttal-status"
    ).subscribe(
      (data: any) => {
        this.leadRebuttalStatusResponse = data;
        this.leadRebuttalStatusFetch.next(this.leadRebuttalStatusResponse);
      },
      error => {
        this.leadRebuttalStatusResponse = [];
        return;
      }
    );
  }

  getSpecialistProdScores(fromDate, toDate, userGroupId, specialistId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      specialistId
    };
    this.post(
      param,
      "api/enrollment/lead-dashboard/productivity-by-specialist"
    ).subscribe(
      (data: any) => {
        this.specialistProdScoresResponse = data;
        this.specialistProdScoresFetch.next(this.specialistProdScoresResponse);
      },
      error => {
        this.specialistProdScoresResponse = [];
        return;
      }
    );
  }

  getEnrollmentTransactionTrend(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/enrollment/lead-dashboard/transaction-trend"
    ).subscribe(
      (data: any) => {
        this.enrollmentTransactionResponse = data;
        this.enrollmentTransactionFetch.next(
          this.enrollmentTransactionResponse
        );
      },
      error => {
        this.enrollmentTransactionResponse = [];
        return;
      }
    );
  }

  getEnrollmentRequestTrend(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/enrollment/lead-dashboard/request-trend").subscribe(
      (data: any) => {
        this.enrollmentRequestResponse = data;
        this.enrollmentRequestFetch.next(this.enrollmentRequestResponse);
      },
      error => {
        this.enrollmentRequestResponse = [];
        return;
      }
    );
  }

  getPendedRecordsAge(fromDate, toDate, userGroupId, specialistId, role) {
    const param =
      role === "Enrollment Lead"
        ? {
            fromDate,
            toDate,
            userGroupId,
            specialistId
          }
        : {
            fromDate,
            toDate
          };
    const apiUrl =
      role === "Enrollment Lead"
        ? "api/enrollment/lead-dashboard/pended-count-by-age"
        : "api/enrollment/specialist-dashboard/pended-transaction-age";
    this.post(param, apiUrl).subscribe(
      (data: any) => {
        this.pendedRecordsAgeResponse = data;
        this.pendedRecordsAgeFetch.next(this.pendedRecordsAgeResponse);
      },
      error => {
        this.pendedRecordsAgeResponse = [];
        return;
      }
    );
  }

  getSpecialistWorkingClaims(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(param, "api/audit-dashboard/specialist-working-claims").subscribe(
      data => {
        this.specialistWorkingResponse = data;
        this.specialistWorkingFetch.next(this.specialistWorkingResponse);
      },
      error => {
        this.specialistWorkingResponse = [];
        return;
      }
    );
  }

  getAuditorWorkingClaims(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(param, "api/audit-dashboard/auditor-working-claims").subscribe(
      data => {
        this.auditorWorkingClaimsResponse = data;
        this.auditorWorkingClaimsFetch.next(this.auditorWorkingClaimsResponse);
      },
      error => {
        this.auditorWorkingClaimsResponse = [];
        return;
      }
    );
  }

  getProductionVolClaims(editUser) {
    this.post(editUser, "api/manager/configuration/prod-vol-claims").subscribe(
      data => {
        this.productionVolStatusResponse = data;
        this.productionVolStatusFetch.next(this.productionVolStatusResponse);
      },
      error => {
        this.productionVolStatusResponse = [];
        return;
      }
    );
  }
  getAuditTransClaims(editUser) {
    this.post(editUser, "api/resource-dashboard/audit-trans-claims").subscribe(
      data => {
        this.auditTransResponse = data;
        this.auditTransFetch.next(this.auditTransResponse);
      },
      error => {
        this.auditTransResponse = [];
        return;
      }
    );
  }
  getAuditRequestClaims(editUser) {
    this.post(editUser, "api/resource-dashboard/audit-req-claims").subscribe(
      data => {
        this.auditRequestResponse = data;
        this.auditRequestFetch.next(this.auditRequestResponse);
      },
      error => {
        this.auditRequestResponse = [];
        return;
      }
    );
  }

  getRebuttalStatusClaims(editUser) {
    this.post(
      editUser,
      "api/enrollment/specialist-dashboard/rebuttal-sts-claims"
    ).subscribe(
      data => {
        this.rebuttalStsResponse = data;
        this.rebuttalStsFetch.next(this.rebuttalStsResponse);
      },
      error => {
        this.rebuttalStsResponse = [];
        return;
      }
    );
  }

  getGridViewEnrollmentLead(editUser) {
    const type = editUser.type;
    const payload = this.getPayload(editUser);
    let url;
    if (type === "prod-count-sts") {
      url = "api/enrollment/lead-dashboard/production-vol-by-status/details";
    } else if (type === "prod-count-spl") {
      url =
        "api/enrollment/lead-dashboard/production-count-by-specialist/details";
    } else if (type === "audit-by-work-cat") {
      url = "api/enrollment/lead-dashboard/audit-by-workcategory/details";
    } else if (type === "enr-audit-summary") {
      url = "api/enrollment/lead-dashboard/audit-summary-by-auditor/details";
    } else if (type === "rebuttal-status") {
      url = "api/enrollment/lead-dashboard/rebuttal-status/details";
    }

    this.post(payload, url).subscribe(
      data => {
        this.enrollmentLeadGridViewResponse = data;
        this.enrollmentLeadGridViewFetch.next(
          this.enrollmentLeadGridViewResponse
        );
      },
      error => {
        this.enrollmentLeadGridViewResponse = [];
        return;
      }
    );
  }

  getPayload(editUser) {
    let payload = {};
    if (editUser.type === "prod-count-sts") {
      payload = {
        action: editUser.action,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        userGroupId: editUser.userGroupId,
        specialistId: editUser.specialistId
      };
    } else if (editUser.type === "prod-count-spl") {
      payload = {
        specialistName: editUser.specialistName,
        action: editUser.action,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        userGroupId: editUser.userGroupId,
        singleSpecialistId: editUser.specialistId
      };
    } else if (editUser.type === "audit-by-work-cat") {
      payload = {
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        userGroupId: editUser.userGroupId,
        auditorId: editUser.auditorId,
        workCategory: editUser.workCategory
      };
    } else if (editUser.type === "enr-audit-summary") {
      payload = {
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        singleAuditorId: editUser.auditorId,
        action: editUser.action,
        userGroupId: editUser.userGroupId,
        singleAuditorName: editUser.auditorName
      };
    } else if (editUser.type === "rebuttal-status") {
      payload = {
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        status: editUser.status
      };
    }
    return payload;
  }

  getReportEnrollmentLead(editUser) {
    const type = editUser.type;
    const payload = this.getPayload(editUser);
    let url;
    if (type === "prod-count-sts") {
      url = "api/enrollment/lead-dashboard/production-vol-by-status/report";
    } else if (type === "prod-count-spl") {
      url =
        "api/enrollment/lead-dashboard/production-count-by-specialist/report ";
    } else if (type === "audit-by-work-cat") {
      url = "api/enrollment/lead-dashboard/audit-by-workcategory/report";
    } else if (type === "enr-audit-summary") {
      url = "api/enrollment/lead-dashboard/audit-summary-by-auditor/report";
    } else if (type === "rebuttal-status") {
      url = "api/enrollment/lead-dashboard/rebuttal-status/report";
    }
    return this.getExcel(payload, url);
  }
}
