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
export class EnrollmentManagerDashboardService extends BaseHttpService {
  enrollManagerUserGroupsFetch = new Subject<any[]>();
  enrollManagerUserGroupsResponse: any;
  enrollManagerAuditorsSub = new Subject<any[]>();
  enrollManagerAuditorsResponse: any;
  managerTeamProdScoreResponse: any;
  auditSamplingWrkCategoryFetch = new Subject<any[]>();
  enrollmentManagerGridViewResponse: any;
  auditSamplingWrkCategoryResponse: any;
  managerTeamProdScoreFetch = new Subject<any[]>();
  enrollmentManagerGridViewFetch = new Subject<any[]>();
  openInventoryByCategoryResponse: any;
  enrollManagerAuditorsListSub = new Subject<any>();
  enrollManagerAuditorsListResponse: any;
  openInventoryByCategoryFetch = new Subject<any[]>();
  openInvVolAgeResponse: any;
  openInvAgeWrkCatResponse: any;
  openInvAgeWrkCatFetch = new Subject<any[]>();
  openInvVolAgeFetch = new Subject<any[]>();
  reqCountStatusFetch = new Subject<any[]>();
  requestCountByCategoryFetch = new Subject<any[]>();
  requestCountByCategoryResponse: any;
  enrollManagerCategoryFetch = new Subject<any[]>();
  reqCountStatusResponse: any;
  enrollManagerQueuesFetch = new Subject<any>();
  enrollManagerQueuesResponse: any;
  transactionsOpenInvSlaFetch = new Subject<any[]>();
  transactionsOpenInvSlaResponse: any;
  managerSpecialistProdTransFetch = new Subject<any[]>();
  auditStatusLeadFetch = new Subject<any[]>();
  auditStatusLeadResponse: any;
  auditStatusSpecialistResponse: any;
  assignedVsAuditedFetch = new Subject<any[]>();
  assignedVsAuditedResponse: any;
  auditStatusSpecialistFetch = new Subject<any[]>();
  managerSpecialistProdTransResponse: any;
  enrollManagerSpecialistsSub = new Subject<any[]>();
  enrollManagerSpecialistsResponse: any;
  enrollManagerLeadsResponse: any;
  auditSamplingByAuditMethodFetch = new Subject<any[]>();
  auditSamplingByAuditMethodResponse: any;
  managerRebuttalFailedVsAcceptedResponse: any;
  managerRebuttalFailedVsAcceptedFetch = new Subject<any[]>();
  managerProcessedVsAuditedResponse: any;
  managerProcessedVsAuditedFetch = new Subject<any[]>();
  enrollManagerLeadsSub = new Subject<any[]>();
  enrollManagerCategoryResponse: any;

  constructor(
    private http: HttpClient,
    public baseHTTPService: BaseHttpService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  getEnrollManagerUserGroupsListner() {
    return this.enrollManagerUserGroupsFetch.asObservable();
  }

  getAuditStatusLeadListner() {
    return this.auditStatusLeadFetch.asObservable();
  }

  requestCountByWorkCategoryListner() {
    return this.requestCountByCategoryFetch.asObservable();
  }

  getManagerTeamProdScoresListner() {
    return this.managerTeamProdScoreFetch.asObservable();
  }

  getAuditSamplingWrkCategoryListner() {
    return this.auditSamplingWrkCategoryFetch.asObservable();
  }

  getManagerProcessedVsAuditedListner() {
    return this.managerProcessedVsAuditedFetch.asObservable();
  }

  getOpenInventoryByWorkCategoryListner() {
    return this.openInventoryByCategoryFetch.asObservable();
  }

  getManagerRebuttalFailedVsAcceptedListner() {
    return this.managerRebuttalFailedVsAcceptedFetch.asObservable();
  }

  getAuditStatusSpecialistListner() {
    return this.auditStatusSpecialistFetch.asObservable();
  }

  reqCountStsListner() {
    return this.reqCountStatusFetch.asObservable();
  }

  getEnrollManagerQueuesListner() {
    return this.enrollManagerQueuesFetch.asObservable();
  }
  getEnrollManagerAuditorsListListner() {
    return this.enrollManagerAuditorsListSub.asObservable();
  }

  getManagerSpecialistProdTransListner() {
    return this.managerSpecialistProdTransFetch.asObservable();
  }

  getGridViewEnrollmentManagerListner() {
    return this.enrollmentManagerGridViewFetch.asObservable();
  }

  getAuditSamplingByAuditMethodListner() {
    return this.auditSamplingByAuditMethodFetch.asObservable();
  }

  getEnrollManagerLeadsListner() {
    return this.enrollManagerLeadsSub.asObservable();
  }

  getEnrollManagerAuditorsListner() {
    return this.enrollManagerAuditorsSub.asObservable();
  }

  getEnrollManagerSpecialistsListner() {
    return this.enrollManagerSpecialistsSub.asObservable();
  }

  getOpenInvVolAgeListner() {
    return this.openInvVolAgeFetch.asObservable();
  }

  getOpenInvAgeWrkCatListner() {
    return this.openInvAgeWrkCatFetch.asObservable();
  }

  getAssignedVsAuditedListner() {
    return this.assignedVsAuditedFetch.asObservable();
  }

  getTransactionsOpenInventorySlaListner() {
    return this.transactionsOpenInvSlaFetch.asObservable();
  }

  getTransactionsOpenInventorySla(workCategoryId, fromDate, toDate) {
    const param = {
      workCategoryId,
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/open-inventory-sla-days"
    ).subscribe(
      data => {
        this.transactionsOpenInvSlaResponse = data;
        this.transactionsOpenInvSlaFetch.next(
          this.transactionsOpenInvSlaResponse
        );
      },
      error => {
        this.transactionsOpenInvSlaResponse = [];
        return;
      }
    );
  }

  getPayload(editUser) {
    let payload = {};
    if (editUser.type === "req-count-by-grp-sts") {
      payload = {
        singleUserGroupName: editUser.singleUserGroupName,
        action: editUser.action,
        queueId: editUser.queueId,
        queueName: editUser.queueName,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (editUser.type === "request-count-wrk-cat") {
      payload = {
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        workCategoryList: editUser.workCategoryList
      };
    } else if (editUser.type === "open-inv-by-WorkCategory") {
      payload = {
        workCategory: editUser.workCategory
      };
    } else if (editUser.type === "open-inv-vol-age") {
      payload = {
        age: editUser.age,
        action: editUser.action
      };
    } else if (editUser.type === "open-inv-age-wrk-cat") {
      payload = {
        age: editUser.age,
        workCategory: editUser.workCategory
      };
    } else if (editUser.type === "open-inventory-sla-days") {
      payload = {
        ageStartDay: editUser.ageStartDay,
        ageEndDay: editUser.ageEndDay,
        ageType: editUser.ageType,
        workCategory: editUser.workCategory,
        workCategoryId: editUser.workCategoryId
      };
    } else if (editUser.type === "transaction-processed-vs-audited") {
      payload = {
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        auditType: editUser.transactionType
      };
    } else if (editUser.type === "audit-sts-lead") {
      payload = {
        singleLeadName: editUser.leadName,
        status: editUser.status,
        singleLeadId: editUser.leadId,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        userGroupId: editUser.userGroupId
      };
    } else if (editUser.type === "audit-sts-specialist") {
      payload = {
        singleSpecialistName: editUser.specialistName,
        status: editUser.status,
        userGroupId: editUser.userGroupId,
        singleSpecialistId: editUser.singleSpecialistId,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (editUser.type === "rebuttal-failed-vs-accepted") {
      payload = {
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        action: editUser.action,
        auditorName: editUser.auditorName,
        auditorIds: editUser.auditorIds
      };
    } else if (editUser.type === "assigned-vs-audited") {
      payload = {
        workCategory: editUser.workCategory,
        auditorIds: editUser.auditorIds,
        auditorNames: editUser.auditorName,
        userGroupId: editUser.userGroupId,
        userGroupName: editUser.userGroupName,
        status: editUser.status,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (editUser.type === "audit-sampling-work-category") {
      payload = {
        workCategory: editUser.workCategory,
        action: editUser.action,
        auditorIds: editUser.auditorIds,
        auditorName: editUser.auditorName,
        userGroupId: editUser.userGroupId,
        userGroupName: editUser.userGroupName,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (editUser.type === "audit-sampling-by-audit") {
      payload = {
        samplingMethod: editUser.samplingMethod,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    }
    return payload;
  }

  getEnrollManagerCategoryListner() {
    return this.enrollManagerCategoryFetch.asObservable();
  }

  getEnrollManagerCategory() {
    const url = `api/enrollment/manager-dashboard/active/work-category`;
    this.get(url).subscribe(
      data => {
        this.enrollManagerCategoryResponse = data;
        this.enrollManagerCategoryFetch.next(
          this.enrollManagerCategoryResponse
        );
      },
      error => {
        this.enrollManagerCategoryResponse = [];
        return;
      }
    );
  }

  requestCountByWorkCategory(fromDate, toDate, workCategory) {
    const param = {
      fromDate,
      toDate,
      workCategoryId: workCategory
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/request-count-by-WorkCategory"
    ).subscribe(
      (data: any) => {
        this.requestCountByCategoryResponse = data;
        this.requestCountByCategoryFetch.next(
          this.requestCountByCategoryResponse
        );
      },
      error => {
        this.requestCountByCategoryResponse = [];
        return;
      }
    );
  }

  getOpenInventoryByWorkCategory(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/open-inv-by-work-category"
    ).subscribe(
      (data: any) => {
        this.openInventoryByCategoryResponse = data;
        this.openInventoryByCategoryFetch.next(
          this.openInventoryByCategoryResponse
        );
      },
      error => {
        this.openInventoryByCategoryResponse = [];
        return;
      }
    );
  }

  getAuditSamplingWrkCategory(fromDate, toDate, auditorId, userGroupId) {
    const param = {
      fromDate,
      toDate,
      auditorId,
      userGroupId
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/audit-sampling-work-category"
    ).subscribe(
      (data: any) => {
        this.auditSamplingWrkCategoryResponse = data;
        this.auditSamplingWrkCategoryFetch.next(
          this.auditSamplingWrkCategoryResponse
        );
      },
      error => {
        this.auditSamplingWrkCategoryResponse = [];
        return;
      }
    );
  }

  getGridViewEnrollmentManager(editUser) {
    const type = editUser.type;
    const payload = this.getPayload(editUser);
    let url;
    if (type === "req-count-by-grp-sts") {
      url =
        "api/enrollment/manager-dashboard/request-count-by-queue-status/details";
    } else if (type === "request-count-wrk-cat") {
      url =
        "api/enrollment/manager-dashboard/request-count-by-WorkCategory/details";
    } else if (type === "open-inv-by-WorkCategory") {
      url =
        "api/enrollment/manager-dashboard/open-inv-by-work-category/details";
    } else if (type === "open-inv-vol-age") {
      url = "api/enrollment/manager-dashboard/open-inv-vol-age/details";
    } else if (type === "open-inv-age-wrk-cat") {
      url = "api/enrollment/manager-dashboard/open-inv-age-wrk-cat/details";
    } else if (type === "transaction-processed-vs-audited") {
      url =
        "api/enrollment/manager-dashboard/transaction-processed-vs-audited/details";
    } else if (type === "audit-sts-lead") {
      url = "api/enrollment/manager-dashboard/audit-status-lead/details";
    } else if (type === "audit-sts-specialist") {
      url = "api/enrollment/manager-dashboard/audit-status-specialist/details";
    } else if (type === "rebuttal-failed-vs-accepted") {
      url =
        "api/enrollment/manager-dashboard/rebuttal-failed-vs-accepted/details";
    } else if (type === "assigned-vs-audited") {
      url = "api/enrollment/manager-dashboard/assigned-vs-audited/details";
    } else if (type === "audit-sampling-work-category") {
      url =
        "api/enrollment/manager-dashboard/audit-sampling-work-category/details";
    } else if (type === "audit-sampling-by-audit") {
      url = "api/enrollment/manager-dashboard/audit-sampling-by-audit/details";
    } else if (type === "open-inventory-sla-days") {
      url = "api/enrollment/manager-dashboard/open-inventory-sla-days/details";
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

  getEnrollManagerUserGroups() {
    const url = `api/enrollment/manager-dashboard/user-group`;
    this.get(url).subscribe(
      data => {
        this.enrollManagerUserGroupsResponse = data;
        this.enrollManagerUserGroupsFetch.next(
          this.enrollManagerUserGroupsResponse
        );
      },
      error => {
        this.enrollManagerUserGroupsResponse = [];
        return;
      }
    );
  }

  getEnrollManagerQueues() {
    const url = `api/enrollment/manager-dashboard/queues`;
    this.get(url).subscribe(
      data => {
        this.enrollManagerQueuesResponse = data;
        this.enrollManagerQueuesFetch.next(this.enrollManagerQueuesResponse);
      },
      error => {
        this.enrollManagerQueuesResponse = [];
        return;
      }
    );
  }

  reqCountSts(fromDate, toDate, queueId, status) {
    const param = {
      fromDate,
      toDate,
      queueId,
      status
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/request-count-by-queue-status"
    ).subscribe(
      (data: any) => {
        this.reqCountStatusResponse = data;
        this.reqCountStatusFetch.next(this.reqCountStatusResponse);
      },
      error => {
        this.reqCountStatusResponse = [];
        return;
      }
    );
  }

  getManagerTeamProdScores(fromDate, toDate, userGroupId, leadId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      leadId
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/team-productivity"
    ).subscribe(
      (data: any) => {
        this.managerTeamProdScoreResponse = data;
        this.managerTeamProdScoreFetch.next(this.managerTeamProdScoreResponse);
      },
      error => {
        this.managerTeamProdScoreResponse = [];
        return;
      }
    );
  }

  getAuditStatusLead(fromDate, toDate, userGroupId, leadId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      leadId
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/audit-status-lead"
    ).subscribe(
      (data: any) => {
        this.auditStatusLeadResponse = data;
        this.auditStatusLeadFetch.next(this.auditStatusLeadResponse);
      },
      error => {
        this.auditStatusLeadResponse = [];
        return;
      }
    );
  }

  getAuditSamplingByAuditMethod(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/audit-sampling-by-audit"
    ).subscribe(
      (data: any) => {
        this.auditSamplingByAuditMethodResponse = data;
        this.auditSamplingByAuditMethodFetch.next(
          this.auditSamplingByAuditMethodResponse
        );
      },
      error => {
        this.auditSamplingByAuditMethodResponse = [];
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
      "api/enrollment/manager-dashboard/audit-status-specialist"
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

  getManagerSpecialistProdTrans(fromDate, toDate, userGroupId, specialistId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      specialistId
    };
    this.post(
      param,
      "api/enrollment/manager-dashboard/specialist-productivity-transaction"
    ).subscribe(
      (data: any) => {
        this.managerSpecialistProdTransResponse = data;
        this.managerSpecialistProdTransFetch.next(
          this.managerSpecialistProdTransResponse
        );
      },
      error => {
        this.managerSpecialistProdTransResponse = [];
        return;
      }
    );
  }

  getManagerRebuttalFailedVsAccepted(fromDate, toDate, auditorId) {
    const param = {
      fromDate,
      toDate,
      auditorId
    };
    const url = "api/enrollment/manager-dashboard/rebuttal-failed-vs-accepted";
    this.post(param, url).subscribe(
      (data: any) => {
        this.managerRebuttalFailedVsAcceptedResponse = data;
        this.managerRebuttalFailedVsAcceptedFetch.next(
          this.managerRebuttalFailedVsAcceptedResponse
        );
      },
      error => {
        this.managerRebuttalFailedVsAcceptedResponse = [];
        return;
      }
    );
  }

  getManagerProcessedVsAudited(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    const url =
      "api/enrollment/manager-dashboard/transaction-processed-vs-audited";
    this.post(param, url).subscribe(
      (data: any) => {
        this.managerProcessedVsAuditedResponse = data;
        this.managerProcessedVsAuditedFetch.next(
          this.managerProcessedVsAuditedResponse
        );
      },
      error => {
        this.managerProcessedVsAuditedResponse = [];
        return;
      }
    );
  }

  getEnrollManagerLeads(groupId) {
    const params = {
      groupId
    };
    const url = `api/enrollment/manager-dashboard/leads`;
    this.post(params, url).subscribe(
      data => {
        this.enrollManagerLeadsResponse = data;
        this.enrollManagerLeadsSub.next(this.enrollManagerLeadsResponse);
      },
      error => {
        this.enrollManagerLeadsResponse = [];
        return;
      }
    );
  }

  getEnrollManagerAuditors(groupId) {
    const params = {
      groupId
    };
    const url = `api/enrollment/manager-dashboard/auditors`;
    this.post(params, url).subscribe(
      data => {
        this.enrollManagerAuditorsResponse = data;
        this.enrollManagerAuditorsSub.next(this.enrollManagerAuditorsResponse);
      },
      error => {
        this.enrollManagerAuditorsResponse = [];
        return;
      }
    );
  }

  getEnrollManagerAuditorsList() {
    const url = `api/enrollment/manager-dashboard/manager/auditors`;
    this.get(url).subscribe(
      data => {
        this.enrollManagerAuditorsListResponse = data;
        this.enrollManagerAuditorsListSub.next(
          this.enrollManagerAuditorsListResponse
        );
      },
      error => {
        this.enrollManagerAuditorsListResponse = [];
        return;
      }
    );
  }

  getEnrollManagerSpecialists(groupId) {
    const params = {
      groupId
    };
    const url = `api/enrollment/manager-dashboard/specialists`;
    this.post(params, url).subscribe(
      data => {
        this.enrollManagerSpecialistsResponse = data;
        this.enrollManagerSpecialistsSub.next(
          this.enrollManagerSpecialistsResponse
        );
      },
      error => {
        this.enrollManagerSpecialistsResponse = [];
        return;
      }
    );
  }

  getReportEnrollmentManager(editUser) {
    const type = editUser.type;
    const payload = this.getPayload(editUser);
    let url;
    if (type === "req-count-by-grp-sts") {
      url =
        "api/enrollment/manager-dashboard/request-count-by-queue-status/report";
    } else if (type === "request-count-wrk-cat") {
      url =
        "api/enrollment/manager-dashboard/request-count-by-WorkCategory/report";
    } else if (type === "open-inv-by-WorkCategory") {
      url = "api/enrollment/manager-dashboard/open-inv-by-work-category/report";
    } else if (type === "open-inv-vol-age") {
      url = "api/enrollment/manager-dashboard/open-inv-vol-age/report";
    } else if (type === "open-inv-age-wrk-cat") {
      url = "api/enrollment/manager-dashboard/open-inv-age-wrk-cat/report";
    } else if (type === "transaction-processed-vs-audited") {
      url =
        "api/enrollment/manager-dashboard/transaction-processed-vs-audited/report";
    } else if (type === "audit-sts-lead") {
      url = "api/enrollment/manager-dashboard/audit-status-lead/report";
    } else if (type === "audit-sts-specialist") {
      url = "api/enrollment/manager-dashboard/audit-status-specialist/report";
    } else if (type === "rebuttal-failed-vs-accepted") {
      url =
        "api/enrollment/manager-dashboard/rebuttal-failed-vs-accepted/report";
    } else if (type === "assigned-vs-audited") {
      url = "api/enrollment/manager-dashboard/assigned-vs-audited/report";
    } else if (type === "audit-sampling-work-category") {
      url =
        "api/enrollment/manager-dashboard/audit-sampling-work-category/report";
    } else if (type === "audit-sampling-by-audit") {
      url = "api/enrollment/manager-dashboard/audit-sampling-by-audit/report";
    } else if (type === "open-inventory-sla-days") {
      url = "api/enrollment/manager-dashboard/open-inventory-sla-days/report";
    }
    return this.getExcel(payload, url);
  }

  getOpenInvVolAge(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    const apiUrl = "api/enrollment/manager-dashboard/open-inv-vol-age";
    this.post(param, apiUrl).subscribe(
      (data: any) => {
        this.openInvVolAgeResponse = data;
        this.openInvVolAgeFetch.next(this.openInvVolAgeResponse);
      },
      error => {
        this.openInvVolAgeResponse = [];
        return;
      }
    );
  }

  getOpenInvAgeWrkCat(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    const apiUrl = "api/enrollment/manager-dashboard/open-inv-age-wrk-cat";
    this.post(param, apiUrl).subscribe(
      (data: any) => {
        this.openInvAgeWrkCatResponse = data;
        this.openInvAgeWrkCatFetch.next(this.openInvAgeWrkCatResponse);
      },
      error => {
        this.openInvAgeWrkCatResponse = [];
        return;
      }
    );
  }

  getAssignedVsAudited(fromDate, toDate, userGroupId, auditorId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      auditorId
    };
    const apiUrl = "api/enrollment/manager-dashboard/assigned-vs-audited";
    this.post(param, apiUrl).subscribe(
      (data: any) => {
        this.assignedVsAuditedResponse = data;
        this.assignedVsAuditedFetch.next(this.assignedVsAuditedResponse);
      },
      error => {
        this.assignedVsAuditedResponse = [];
        return;
      }
    );
  }
}
