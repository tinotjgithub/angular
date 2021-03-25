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
export class EnrollmentAuditorDashboardService extends BaseHttpService {
  public auditTransFetch = new Subject<any>();
  public auditTransResponse: any;
  enrollAuditorCategoryResponse: any;
  enrollAuditorCategoryFetch = new Subject<any>();
  public enrollmentManagerGridViewResponse: any;
  public enrollmentManagerGridViewFetch = new Subject<any>();
  public auditCountWorkCategoryResponse: any;
  public auditCountWorkCategoryFetch = new Subject<any>();
  public auditRebuttalStatusResponse: any;
  public auditRebuttalStatusFetch = new Subject<any>();
  enrollAuditorUserGroupsResponse: any;
  public hourlyProdResponse: any;
  public auditSamplingAuditMethodResponse: any;
  public auditSamplingAuditMethodFetch = new Subject<any>();
  public auditSamplingWorkCategoryResponse: any;
  public auditSamplingAuditStatusResponse: any;
  public auditBenifitPlanResponse: any;
  public auditBenifitPlanFetch = new Subject<any>();
  public auditSamplingAuditStatusFetch = new Subject<any>();
  auditSamplingWorkCategoryFetch = new Subject<any>();
  public hourlyProdFetch = new Subject<any>();
  enrollAuditorUserGroupsSub = new Subject<any>();
  auditStatusSpecialistFetch = new Subject<any>();
  auditStatusSpecialistResponse: any;
  auditDetails: any;
  processedVsAuditedResponse: any;
  processedVsAuditedFetch = new Subject<any>();
  filters: any;
  public enrollAuditorSpecialistsResponse: any;
  enrollAuditorSpecialistsSub = new Subject<any>();
  constructor(
    private http: HttpClient,
    public baseHTTPService: BaseHttpService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_AUDITOR_SERVER_URL);
  }

  getAuditTransListner() {
    return this.auditTransFetch.asObservable();
  }
  getEnrollAuditorUserGroupsListner() {
    return this.enrollAuditorUserGroupsSub.asObservable();
  }
  getGridViewEnrollmentManagerListner() {
    return this.enrollmentManagerGridViewFetch.asObservable();
  }

  getEnrollAuditorCategoryListner() {
    return this.enrollAuditorCategoryFetch.asObservable();
  }
  getAuditCountWorkCategoryListner() {
    return this.auditCountWorkCategoryFetch.asObservable();
  }

  getEnrollAuditorSpecialistsListner() {
    return this.enrollAuditorSpecialistsSub.asObservable();
  }

  getAuditRebuttalStatusListner() {
    return this.auditRebuttalStatusFetch.asObservable();
  }

  getHourlyProdScoresListner() {
    return this.hourlyProdFetch.asObservable();
  }

  getAuditStatusSpecialistListner() {
    return this.auditStatusSpecialistFetch.asObservable();
  }

  getProcessedVsAuditedListner() {
    return this.processedVsAuditedFetch.asObservable();
  }

  getAuditSamplingWorkCategoryListner() {
    return this.auditSamplingWorkCategoryFetch.asObservable();
  }

  getAuditSamplingAuditMethodListner() {
    return this.auditSamplingAuditMethodFetch.asObservable();
  }

  getAuditSamplingAuditStatusListner() {
    return this.auditSamplingAuditStatusFetch.asObservable();
  }

  getAuditBenifitPlanListner() {
    return this.auditBenifitPlanFetch.asObservable();
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

  getProcessedVsAudited(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/processed-vs-audited"
    ).subscribe(
      data => {
        this.processedVsAuditedResponse = data;
        this.processedVsAuditedFetch.next(this.processedVsAuditedResponse);
      },
      error => {
        this.processedVsAuditedResponse = [];
        return;
      }
    );
  }

  getAuditStatusSpecialist(fromDate, toDate, userGroupId, specialistId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      specialistId
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/audit-status-specialist"
    ).subscribe(
      (data: any) => {
        this.auditStatusSpecialistResponse = data;
        this.auditStatusSpecialistFetch.next(
          this.auditStatusSpecialistResponse
        );
      },
      error => {
        this.auditStatusSpecialistResponse = [];
        return;
      }
    );
  }

  getHourlyProdScores(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/my-hourly-productivity"
    ).subscribe(
      (data: any) => {
        this.hourlyProdResponse = data;
        this.hourlyProdFetch.next(this.hourlyProdResponse);
      },
      error => {
        this.hourlyProdResponse = [];
        return;
      }
    );
  }

  getAuditRebuttalStatus(fromDate, toDate, userGroupId, specialistId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      specialistId
    };
    const url = "api/enrollment/auditor-dashboard/rebuttal-status";
    this.post(param, url).subscribe(
      (data: any) => {
        this.auditRebuttalStatusResponse = data;
        this.auditRebuttalStatusFetch.next(this.auditRebuttalStatusResponse);
      },
      error => {
        this.auditRebuttalStatusResponse = [];
        return;
      }
    );
  }

  getEnrollAuditorCategory() {
    const url = `api/enrollment/auditor-dashboard/active/work-category`;
    this.get(url).subscribe(
      data => {
        this.enrollAuditorCategoryResponse = data;
        this.enrollAuditorCategoryFetch.next(
          this.enrollAuditorCategoryResponse
        );
      },
      error => {
        this.enrollAuditorCategoryResponse = [];
        return;
      }
    );
  }

  getAuditTrans(workCategoryList, fromDate, toDate, frequency) {
    const param = {
      workCategoryList,
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/audit-summary-by-audit-status"
    ).subscribe(
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

  getReportEnrollmentManager(editUser) {
    const type = editUser.type;
    const payload = this.getPayload(editUser);
    let url;
    if (type === "audit-summary-audit-status") {
      url =
        "api/enrollment/auditor-dashboard/audit-summary-by-audit-status/report";
    } else if (type === "audit-count-by-work-category") {
      url =
        "api/enrollment/auditor-dashboard/audit-count-by-work-category/report";
    } else if (type === "rebuttal-status") {
      url = "api/enrollment/auditor-dashboard/rebuttal-status/report";
    } else if (type === "audit-sts-specialist") {
      url = "api/enrollment/auditor-dashboard/audit-status-specialist/report";
    } else if (type === "processed-vs-audited") {
      url = "api/enrollment/auditor-dashboard/processed-vs-audited/report";
    } else if (type === "audit-sampling-work-category") {
      url =
        "api/enrollment/auditor-dashboard/audit-sampling-work-category/report";
    } else if (type === "audit-sampling-audit-method") {
      url = "api/enrollment/auditor-dashboard/audit-sampling-by-audit/report";
    } else if (type === "audit-sampling-audit-status") {
      url =
        "api/enrollment/auditor-dashboard/audit-sampling-by-audit-status/report";
    } else if (type === "audit-sampling-benefit-plan") {
      url =
        "api/enrollment/auditor-dashboard/audit-sampling-by-benefit-plan/report";
    }
    return this.getExcel(payload, url);
  }

  getGridViewEnrollmentManager(editUser) {
    const type = editUser.type;
    const payload = this.getPayload(editUser);
    let url;
    if (type === "audit-summary-audit-status") {
      url =
        "api/enrollment/auditor-dashboard/audit-summary-by-audit-status/details";
    } else if (type === "audit-count-by-work-category") {
      url =
        "api/enrollment/auditor-dashboard/audit-count-by-work-category/details";
    } else if (type === "rebuttal-status") {
      url = "api/enrollment/auditor-dashboard/rebuttal-status/details";
    } else if (type === "audit-sts-specialist") {
      url = "api/enrollment/auditor-dashboard/audit-status-specialist/details";
    } else if (type === "processed-vs-audited") {
      url = "api/enrollment/auditor-dashboard/processed-vs-audited/details";
    } else if (type === "audit-sampling-work-category") {
      url =
        "api/enrollment/auditor-dashboard/audit-sampling-work-category/details";
    } else if (type === "audit-sampling-audit-method") {
      url = "api/enrollment/auditor-dashboard/audit-sampling-by-audit/details";
    } else if (type === "audit-sampling-audit-status") {
      url =
        "api/enrollment/auditor-dashboard/audit-sampling-by-audit-status/details";
    } else if (type === "audit-sampling-benefit-plan") {
      url =
        "api/enrollment/auditor-dashboard/audit-sampling-by-benefit-plan/details";
    }
    this.post(payload, url).subscribe(
      data => {
        this.enrollmentManagerGridViewResponse = data;
        this.enrollmentManagerGridViewFetch.next(
          this.enrollmentManagerGridViewResponse
        );
      },
      error => {
        this.enrollmentManagerGridViewResponse = [];
        return;
      }
    );
  }

  getPayload(editUser) {
    let payload = {};
    if (editUser.type === "audit-summary-audit-status") {
      payload = {
        frequency: editUser.frequency,
        fromDate: editUser.fromDate,
        date: editUser.date,
        workCategoryIds: editUser.workCategoryIds,
        workCategoryNames: editUser.workCategoryNames,
        status: editUser.status
      };
    } else if (editUser.type === "audit-count-by-work-category") {
      payload = {
        userGroupId: editUser.userGroupId,
        specialistId: editUser.specialistId,
        userGroupList: editUser.userGroupName,
        specialistName: editUser.specialistName,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        workCategory: editUser.workCategory
      };
    } else if (editUser.type === "rebuttal-status") {
      payload = {
        userGroupId: editUser.userGroupId,
        specialistId: editUser.specialistId,
        userGroupList: editUser.userGroupName,
        specialistName: editUser.specialistName,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        status: editUser.act
      };
    } else if (editUser.type === "audit-sts-specialist") {
      payload = {
        singleSpecialistName: editUser.specialistName,
        status: editUser.status,
        userGroupId: editUser.userGroupId,
        singleSpecialistId: editUser.specialistId,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (editUser.type === "audit-sampling-benefit-plan") {
      payload = {
        benefitPlanName: editUser.benefitPlanName,
        benefitPlanId: editUser.benefitPlanId,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        frequency: editUser.frequency
      };
    } else if (editUser.type === "processed-vs-audited") {
      payload = {
        frequency: editUser.frequency,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        auditType: editUser.auditType
      };
    } else if (editUser.type === "audit-sampling-work-category") {
      payload = {
        frequency: editUser.frequency,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        workCategory: editUser.workCategory
      };
    } else if (editUser.type === "audit-sampling-audit-method") {
      payload = {
        frequency: editUser.frequency,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        action: editUser.action
      };
    } else if (editUser.type === "audit-sampling-audit-status") {
      payload = {
        frequency: editUser.frequency,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        status: editUser.action
      };
    }
    return payload;
  }

  getAuditCountWorkCategory(fromDate, toDate, userGroupId, specialistId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      specialistId
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/audit-count-work-category"
    ).subscribe(
      (data: any) => {
        this.auditCountWorkCategoryResponse = data;
        this.auditCountWorkCategoryFetch.next(
          this.auditCountWorkCategoryResponse
        );
      },
      error => {
        this.auditCountWorkCategoryResponse = [];
        return;
      }
    );
  }

  getAuditSamplingWorkCategory(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/audit-sampling-work-category"
    ).subscribe(
      (data: any) => {
        this.auditSamplingWorkCategoryResponse = data;
        this.auditSamplingWorkCategoryFetch.next(
          this.auditSamplingWorkCategoryResponse
        );
      },
      error => {
        this.auditSamplingWorkCategoryResponse = [];
        return;
      }
    );
  }

  getAuditSamplingAuditMethod(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/audit-sampling-by-audit"
    ).subscribe(
      (data: any) => {
        this.auditSamplingAuditMethodResponse = data;
        this.auditSamplingAuditMethodFetch.next(
          this.auditSamplingAuditMethodResponse
        );
      },
      error => {
        this.auditSamplingAuditMethodResponse = [];
        return;
      }
    );
  }

  getAuditBenifitPlan(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/audit-sampling-by-benefit-plan"
    ).subscribe(
      (data: any) => {
        this.auditBenifitPlanResponse = data;
        this.auditBenifitPlanFetch.next(this.auditBenifitPlanResponse);
      },
      error => {
        this.auditBenifitPlanResponse = [];
        return;
      }
    );
  }

  getAuditSamplingAuditStatus(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/auditor-dashboard/audit-sampling-by-audit-status"
    ).subscribe(
      (data: any) => {
        this.auditSamplingAuditStatusResponse = data;
        this.auditSamplingAuditStatusFetch.next(
          this.auditSamplingAuditStatusResponse
        );
      },
      error => {
        this.auditSamplingAuditStatusResponse = [];
        return;
      }
    );
  }

  getEnrollAuditorSpecialists(groupId) {
    const params = {
      groupId
    };
    const url = `api/enrollment/auditor-dashboard/user-group/specialists`;
    this.post(params, url).subscribe(
      data => {
        this.enrollAuditorSpecialistsResponse = data;
        this.enrollAuditorSpecialistsSub.next(
          this.enrollAuditorSpecialistsResponse
        );
      },
      error => {
        this.enrollAuditorSpecialistsResponse = [];
        return;
      }
    );
  }

  getEnrollAuditorUserGroups() {
    const url = `api/enrollment/auditor-dashboard/user-group`;
    this.get(url).subscribe(
      data => {
        this.enrollAuditorUserGroupsResponse = data;
        this.enrollAuditorUserGroupsSub.next(
          this.enrollAuditorUserGroupsResponse
        );
      },
      error => {
        this.enrollAuditorUserGroupsResponse = [];
        return;
      }
    );
  }
}
