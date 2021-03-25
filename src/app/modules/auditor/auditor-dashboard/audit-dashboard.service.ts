import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BaseHttpService } from "./../../../services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuditDashboardService extends BaseHttpService {
  auditDetails: any;
  auditSumryResponse: any;
  claimSourceResponse: any;
  auditTypeStatusResponse: any;
  auditClaimsDetailsResponse: any;
  auditClaimsDetailsFetch = new Subject<any>();
  auditStatusDetailsResponse: any;
  auditStatusDetailsFetch = new Subject<any>();
  auditQualityDetailsResponse: any;
  auditQualityDetailsFetch = new Subject<any>();
  auditTypeStatusFetch = new Subject<any>();
  myProdScoresFetch = new Subject<any>();
  auditSumryFetch = new Subject<any>();
  auditorAuditedDetailsResponse: any;
  auditorAuditedDetailsFetch = new Subject<any>();
  auditQueueResponse: any;
  myprodScoreResponse: any;
  auditorClaimsExaminersResponse: any;
  auditorUserGroupsResponse: any;
  auditorProcScoreResponse: any;
  auditorFinScoreResponse: any;
  lowPerExaminersResponse: any;
  highPerExaminersResponse: any;
  auditQueueFetch = new Subject<any>();
  auditorFinScoresFetch = new Subject<any>();
  auditorProcScoresFetch = new Subject<any>();
  auditorUserGroupsSub = new Subject<any>();
  lowPerExaminersFetch = new Subject<any>();
  highPerExaminersFetch = new Subject<any>();
  auditorClaimsExaminersSub = new Subject<any>();
  paymentStatusResponse: any;
  claimsProcessedAditedResponse: any;
  claimsProcessedAditedFetch = new Subject<any>();
  claimsAuditedCategoryDetailsFetch = new Subject<any>();
  claimsAuditedCategoryDetailsResponse: any;
  claimsAuditedCategoryReportFetch = new Subject<any>();
  claimsAuditedCategoryReportResponse: any;

  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getAuditDates() {
    return this.auditDetails;
  }

  setAuditDetails(auditDates) {
    this.auditDetails = {};
    this.auditDetails = { auditDates };
  }
  auditQualityDetailsListner() {
    return this.auditQualityDetailsFetch.asObservable();
  }

  auditClaimsDetailsListner() {
    return this.auditClaimsDetailsFetch.asObservable();
  }

  claimsAuditedCategoryDetailsListner() {
    return this.claimsAuditedCategoryDetailsFetch.asObservable();
  }

  auditStatusDetailsListner() {
    return this.auditStatusDetailsFetch.asObservable();
  }

  auditorAuditedDetailsListner() {
    return this.auditorAuditedDetailsFetch.asObservable();
  }

  getAuditSumryListner() {
    return this.auditSumryFetch.asObservable();
  }

  getMyAuditProdScoresListner() {
    return this.myProdScoresFetch.asObservable();
  }

  getClaimsProcessedAditedListner() {
    return this.claimsProcessedAditedFetch.asObservable();
  }

  getAuditTypeStatusListner() {
    return this.auditTypeStatusFetch.asObservable();
  }

  getAuditQueueListner() {
    return this.auditQueueFetch.asObservable();
  }

  getLowPerExaminersListner() {
    return this.lowPerExaminersFetch.asObservable();
  }

  getHighPerExaminersListner() {
    return this.highPerExaminersFetch.asObservable();
  }

  getAuditorClaimsExaminersListner() {
    return this.auditorClaimsExaminersSub.asObservable();
  }

  getAuditorFinScoresListner() {
    return this.auditorFinScoresFetch.asObservable();
  }

  getAuditorProcScoresListner() {
    return this.auditorProcScoresFetch.asObservable();
  }

  getAuditSumry(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(param, "api/audit-dashboard/claims-audit-summary").subscribe(
      data => {
        this.auditSumryResponse = data;
        this.auditSumryFetch.next(this.auditSumryResponse);
      },
      error => {
        this.auditSumryResponse = [];
        return;
      }
    );
  }

  getAuditQueue(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/audit-dashboard/claims-audited-by-queue").subscribe(
      data => {
        this.auditQueueResponse = data;
        this.auditQueueFetch.next(this.auditQueueResponse);
      },
      error => {
        this.auditQueueResponse = [];
        return;
      }
    );
  }

  getMyAuditProdScores(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/audit-dashboard/productivity").subscribe(
      (data: any) => {
        this.myprodScoreResponse = data;
        this.myProdScoresFetch.next(this.myprodScoreResponse);
      },
      error => {
        this.myprodScoreResponse = [];
        return;
      }
    );
  }

  getAuditTypeStatus(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/audit-dashboard/claims-audited-by-type-status"
    ).subscribe(
      data => {
        this.auditTypeStatusResponse = data;
        this.auditTypeStatusFetch.next(this.auditTypeStatusResponse);
      },
      error => {
        this.auditTypeStatusResponse = [];
        return;
      }
    );
  }

  getClaimsProcessedAdited(fromDate, toDate, schedule) {
    const param = {
      fromDate,
      toDate,
      schedule
    };
    this.post(
      param,
      "api/audit-dashboard/claims-processed-vs-audited"
    ).subscribe(
      data => {
        this.claimsProcessedAditedResponse = data;
        this.claimsProcessedAditedFetch.next(
          this.claimsProcessedAditedResponse
        );
      },
      error => {
        this.claimsProcessedAditedResponse = [];
        return;
      }
    );
  }

  getLowPerExaminers(fromDate, toDate, role) {
    const param = {
      fromDate,
      toDate
    };
    const url = "api/audit-dashboard/low-performing-examiners";

    this.post(param, url).subscribe(
      data => {
        this.lowPerExaminersResponse = data;
        this.lowPerExaminersFetch.next(this.lowPerExaminersResponse);
      },
      error => {
        this.lowPerExaminersResponse = [];
        return;
      }
    );
  }

  getHighPerExaminers(fromDate, toDate, role) {
    const param = {
      fromDate,
      toDate
    };
    const url = "api/audit-dashboard/high-performing-examiners";

    this.post(param, url).subscribe(
      data => {
        this.highPerExaminersResponse = data;
        this.highPerExaminersFetch.next(this.highPerExaminersResponse);
      },
      error => {
        this.highPerExaminersResponse = [];
        return;
      }
    );
  }

  getAuditorFinScores(fromDate, toDate, examinerId, role) {
    const param = {
      fromDate,
      toDate,
      examinerId,
      role
    };
    const url = "api/audit-dashboard/financial-score";
    this.post(param, url).subscribe(
      (data: any) => {
        this.auditorFinScoreResponse = data;
        this.auditorFinScoresFetch.next(this.auditorFinScoreResponse);
      },
      error => {
        this.auditorFinScoreResponse = [];
        return;
      }
    );
  }

  getAuditorProcScores(fromDate, toDate, examinerId, role) {
    const param = {
      fromDate,
      toDate,
      examinerId,
      role
    };
    const url = "api/audit-dashboard/procedural-score";
    this.post(param, url).subscribe(
      (data: any) => {
        this.auditorProcScoreResponse = data;
        this.auditorProcScoresFetch.next(this.auditorProcScoreResponse);
      },
      error => {
        this.auditorProcScoreResponse = [];
        return;
      }
    );
  }
  getAuditorClaimsExaminers(role) {
    const url = `api/audit-dashboard/examiners`;
    this.get(url).subscribe(
      data => {
        this.auditorClaimsExaminersResponse = data;
        this.auditorClaimsExaminersSub.next(
          this.auditorClaimsExaminersResponse
        );
      },
      error => {
        this.auditorClaimsExaminersResponse = [];
        return;
      }
    );
  }

  auditClaimsDetails(type, payload) {
    let url;
    if (type === "audit-claims-summary") {
      url = "api/auditor/audit-claims-summary/grid-view";
    } else if (type === "claims-audited-queue") {
      url = "api/audit-dashboard/claims-audited-by-queue/grid";
    } else {
      url = "api/audit-dashboard/claims-audited-by-type-status/grid";
    }
    this.post(payload, url).subscribe(
      data => {
        this.auditClaimsDetailsResponse = data;
        this.auditClaimsDetailsFetch.next(this.auditClaimsDetailsResponse);
      },
      error => {
        this.auditClaimsDetailsResponse = [];
        return;
      }
    );
  }

  auditStatusDetails(payload) {
    let url =
      payload.auditStatus === "AuditSuccess"
        ? "api/auditor/graph/success/details"
        : payload.auditStatus === "AuditFailed"
        ? "api/auditor/graph/failed/details"
        : "api/auditor/graph/rebutted/details";
    this.get(url).subscribe(
      data => {
        this.auditStatusDetailsResponse = data;
        this.auditStatusDetailsFetch.next(this.auditStatusDetailsResponse);
      },
      error => {
        this.auditStatusDetailsResponse = [];
        return;
      }
    );
  }

  auditorAuditedDetails(payload) {
    let url;
    url = "api/audit/home/dashboard/audited-backlog-claims/grid";
    this.post(payload, url).subscribe(
      data => {
        this.auditorAuditedDetailsResponse = data;
        this.auditorAuditedDetailsFetch.next(
          this.auditorAuditedDetailsResponse
        );
      },
      error => {
        this.auditorAuditedDetailsResponse = [];
        return;
      }
    );
  }

  auditorAuditedDetailsReport(payload) {
    let url;
    url = "api/audit/home/dashboard/audited-backlog-claims/report";
    return this.getExcel(payload, url);
  }

  auditStatusDetailsReport(payload) {
    let url;
    url = "api/auditor/graph/audit-status/report";
    return this.getExcel(payload, url);
  }

  auditQualityDetails(payload) {
    let url;
    url = "api/audit/home/dashboard/quality-graph/grid";
    this.post(payload, url).subscribe(
      data => {
        this.auditQualityDetailsResponse = data;
        this.auditQualityDetailsFetch.next(this.auditQualityDetailsResponse);
      },
      error => {
        this.auditQualityDetailsResponse = [];
        return;
      }
    );
  }

  auditQualityDetailsReport(payload) {
    let url;
    url = "api/audit/home/dashboard/quality-graph/report";
    return this.getExcel(payload, url);
  }

  auditClaimsDetailsReport(type, payload) {
    let url;
    if (type === "audit-claims-summary") {
      url = "api/auditor/audit-claims-summary/report";
    } else if (type === "claims-audited-queue") {
      url = "api/audit-dashboard/claims-audited-by-queue/report";
    } else {
      url = "api/audit-dashboard/claims-audited-by-type-status/report";
    }
    return this.getExcel(payload, url);
  }

  claimsAuditedCategoryDetails(type, payload) {
    const url = "api/audit/home/dashboard/audited-by-category/grid";
    this.post(payload, url).subscribe(
      data => {
        this.claimsAuditedCategoryDetailsResponse = data;
        this.claimsAuditedCategoryDetailsFetch.next(
          this.claimsAuditedCategoryDetailsResponse
        );
      },
      error => {
        this.claimsAuditedCategoryDetailsResponse = [];
        return;
      }
    );
  }

  claimsAuditedCategoryReport(type, payload) {
    const url = "api/audit/home/dashboard/audited-by-category/report";
    return this.getExcel(payload, url);
  }

  lowPerformingDetails(payload) {
    return this.post(
      payload,
      "api/audit-dashboard/low-performing-examiners-grid"
    );
  }

  lowPerformingExcel(payload) {
    return this.getExcel(
      payload,
      "api/audit-dashboard/low-performing-examiners-report"
    );
  }

  auditedClaimsDetails(payload) {
    return this.post(payload, "api/audit-dashboard/claims-audit-summary-grid");
  }

  auditedClaimsExcel(payload) {
    return this.getExcel(
      payload,
      "api/audit-dashboard/claims-audit-summary-report"
    );
  }
}
