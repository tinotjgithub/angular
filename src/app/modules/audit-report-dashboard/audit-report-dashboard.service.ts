import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BaseHttpService } from "./../../services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuditReportDashboardService extends BaseHttpService {
  auditDetails: any;
  filters: any;
  auditSumryResponse: any;
  claimsParameterListResponse: any;
  lobResponse: any;
  claimSourceResponse: any;
  planTypeResponse: any;
  auditTypeStatusResponse: any;
  auditTypeStatusFetch = new Subject<any>();
  planTypeFetch = new Subject<any>();
  claimSourceFetch = new Subject<any>();
  lobFetch = new Subject<any>();
  samplingMethodFetch = new Subject<any>();
  samplingMethodResponse: any;
  samplingAdjResponse: any;
  samplingAdjFetch = new Subject<any>();
  samplingErrResponse: any;
  samplingErrFetch = new Subject<any>();
  samplingStsResponse: any;
  samplingStsFetch = new Subject<any>();
  samplingAmtResponse: any;
  auditBilledAmtClaimTypeResponse: any;
  auditBilledAmtClaimTypeFetch = new Subject<any>();
  samplingAmtFetch = new Subject<any>();
  claimsParameterListFetch = new Subject<any>();
  paymentStatusResponse: any;
  getPaymentStatusFetch = new Subject<any>();
  auditSamplingCategoryResponse: any;
  auditSamplingBilledAmtFetch = new Subject<any>();
  auditSamplingBilledAmtResponse: any;
  samplingReportResponse: any;
  statusReportFetch = new Subject<any[]>();
  auditSamplingCategoryFetch = new Subject<any>();
  constructor(private http: HttpClient) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getAuditDates() {
    return this.auditDetails;
  }

  getfilters() {
    return this.filters;
  }

  setfilters(filters) {
    this.auditDetails = {};
    this.auditDetails = { filters };
  }

  setAuditDetails(auditDates) {
    this.auditDetails = {};
    this.auditDetails = { auditDates };
  }
  getAuditSamplingMethodListner() {
    return this.samplingMethodFetch.asObservable();
  }
  getAuditSamplingAdjListner() {
    return this.samplingAdjFetch.asObservable();
  }
  getBilledAmtByClaimTypeListner() {
    return this.auditBilledAmtClaimTypeFetch.asObservable();
  }
  getAuditSamplingErrListner() {
    return this.samplingErrFetch.asObservable();
  }
  getAuditSamplingStsListner() {
    return this.samplingStsFetch.asObservable();
  }
  getAuditSamplingAmtListner() {
    return this.samplingAmtFetch.asObservable();
  }
  getClaimsParameterListListner() {
    return this.claimsParameterListFetch.asObservable();
  }
  getPaymentStatusListner() {
    return this.getPaymentStatusFetch.asObservable();
  }
  getAuditSamplingCategoryListner() {
    return this.auditSamplingCategoryFetch.asObservable();
  }
  getClaimSourceListner() {
    return this.claimSourceFetch.asObservable();
  }

  getLOBListner() {
    return this.lobFetch.asObservable();
  }

  getPlanTypeListner() {
    return this.planTypeFetch.asObservable();
  }

  getAuditSamplingBilledAmtListner() {
    return this.auditSamplingBilledAmtFetch.asObservable();
  }

  getAuditSamplingMethod(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/reports/audit-claims-pie-chart-sampling-type").subscribe(
      data => {
        this.samplingMethodResponse = data;
        this.samplingMethodFetch.next(this.samplingMethodResponse);
      },
      error => {
        this.samplingMethodResponse = [];
        return;
      }
    );
  }

  getAuditSamplingAdj(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/reports/audit-claims-pie-chart-adjudication-type").subscribe(
      data => {
        this.samplingAdjResponse = data;
        this.samplingAdjFetch.next(this.samplingAdjResponse);
      },
      error => {
        this.samplingAdjResponse = [];
        return;
      }
    );
  }

  getAuditSamplingErr(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/reports/audit-claims-pie-chart-error-ype").subscribe(
      data => {
        this.samplingErrResponse = data;
        this.samplingErrFetch.next(this.samplingErrResponse);
      },
      error => {
        this.samplingErrResponse = [];
        return;
      }
    );
  }

  getAuditSamplingBilledAmt(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/reports/audit-claims-pie-chart-billed-amount"
    ).subscribe(
      (data: any) => {
        this.auditSamplingBilledAmtResponse = data;
        this.auditSamplingBilledAmtFetch.next(
          this.auditSamplingBilledAmtResponse
        );
      },
      error => {
        this.auditSamplingBilledAmtResponse = [];
        return;
      }
    );
  }

  getBilledAmtByClaimType(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/reports/audit-claims-pie-chart-billed-amount-claim-type"
    ).subscribe(
      (data: any) => {
        this.auditBilledAmtClaimTypeResponse = data;
        this.auditBilledAmtClaimTypeFetch.next(
          this.auditBilledAmtClaimTypeResponse
        );
      },
      error => {
        this.auditBilledAmtClaimTypeResponse = [];
        return;
      }
    );
  }

  getAuditSamplingSts(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/reports/audit-claims-pie-chart-audit-status").subscribe(
      data => {
        this.samplingStsResponse = data;
        this.samplingStsFetch.next(this.samplingStsResponse);
      },
      error => {
        this.samplingStsResponse = [];
        return;
      }
    );
  }

  getAuditSamplingAmt(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(param, "api/reports/audit-claims-pie-chart-payment-type").subscribe(
      data => {
        this.samplingAmtResponse = data;
        this.samplingAmtFetch.next(this.samplingAmtResponse);
      },
      error => {
        this.samplingAmtResponse = [];
        return;
      }
    );
  }

  getClaimsParameterList() {
    this.get(`api/reports/audit-claims-parameter`).subscribe(
      data => {
        this.claimsParameterListResponse = data;
        this.claimsParameterListFetch.next(this.claimsParameterListResponse);
      },
      error => {
        this.claimsParameterListResponse = [];
        return;
      }
    );
  }

  getSamplingReportListner() {
    return this.statusReportFetch.asObservable();
  }

  getSamplingReport(processedDates) {
    this.getExcel(processedDates, "api/reports/sampling-report").subscribe(
      data => {
        this.samplingReportResponse = data;
        this.statusReportFetch.next(this.samplingReportResponse);
      },
      error => {
        this.samplingReportResponse = [];
        return;
      }
    );
  }

  getAuditSamplingCategory(payload) {
    this.post(payload, "api/reports/audit-claims-bar-chart").subscribe(
      data => {
        this.auditSamplingCategoryResponse = data;
        this.auditSamplingCategoryFetch.next(
          this.auditSamplingCategoryResponse
        );
      },
      error => {
        this.auditSamplingCategoryResponse = [];
        return;
      }
    );
  }
}
