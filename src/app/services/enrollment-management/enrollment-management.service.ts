import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { HttpClient } from "@angular/common/http";
import { specialistStatusType } from "../../shared/constants.js";
import { Subject, Observable } from "rxjs";
import { NotifierService } from "../notifier.service";
import { APP_CONFIG } from "../config/config.service";
import { map } from "rxjs/operators";
import { WorkCategory } from "src/app/modules/admin/configuration/modal";

@Injectable({
  providedIn: "root"
})
export class EnrollmentManagementService extends BaseHttpService {
  public routeReasonConfigResponse: any;
  private routeReasonsConfigSub = new Subject<any>();
  public rolesToRouteResponse: any;
  private rolesToRouteSub = new Subject<any>();
  public routedRoleResponse: any;
  public openInvReqFetch = new Subject<any>();
  public openInvReqResponse: any;
  gridViewResponse: any;
  workCategoryPendedDetailsDataResponse: any;
  workCategoryPendedDetailsDataFetch = new Subject<any>();
  workCategoryDetailsDataFetch = new Subject<any>();
  workCategoryDetailsDataResponse: any;
  gridViewFetch = new Subject<any>();
  rebuttalStatusReqResponse: any;
  public auditTransResponse: any;
  workCategoryRoutedDetailsDataResponse: any;
  workCategoryRoutedDetailsDataFetch = new Subject<any>();
  public auditTransFetch = new Subject<any>();
  rebuttalStatusReqFetch = new Subject<any>();
  private routedRolesSub = new Subject<any>();
  public pendReasonConfigResponse: any;
  public myQualityResponse: any;
  public myQualityFetch = new Subject<any>();
  private pendReasonsConfigSub = new Subject<any>();
  public subscriptionDetails = {
    taskId: null
  };

  constructor(
    public http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  getGridViewListner() {
    return this.gridViewFetch.asObservable();
  }

  getWorkCategoryRoutedDetailsDataListner() {
    return this.workCategoryRoutedDetailsDataFetch.asObservable();
  }

  getSpecialistStatusCount(requestType: string) {
    return this.post(
      { requestType: String(requestType).toUpperCase() },
      "api/specialist-dashboard/quicklinks/secondary-count"
    );
  }

  getSpecialistListDetailsPage(type: string) {
    return this.get(
      `api/enrollment-specialist/subscription/${specialistStatusType[type]}`
    );
  }

  getWorkCategoryDetailsDataListner() {
    return this.workCategoryDetailsDataFetch.asObservable();
  }

  getWorkCategoryPendedDetailsDataListner() {
    return this.workCategoryPendedDetailsDataFetch.asObservable();
  }

  getRolesToRoute() {
    this.get("api/configuration/roles").subscribe(
      data => {
        this.rolesToRouteResponse = data;
        this.rolesToRouteSub.next(this.rolesToRouteResponse);
      },
      error => {
        this.rolesToRouteResponse = [];
        return;
      }
    );
  }

  getWorkCategoryDetailsData(type, action) {
    const payload = {
      action,
      requestType: type.toUpperCase()
    };
    this.post(payload, "api/specialist-dashboard/specialist-details").subscribe(
      data => {
        this.workCategoryDetailsDataResponse = data;
        this.workCategoryDetailsDataFetch.next(
          this.workCategoryDetailsDataResponse
        );
      },
      error => {
        this.workCategoryDetailsDataResponse = [];
        return;
      }
    );
  }

  getWorkCategoryPendedDetailsData(type, action) {
    const payload = {
      action,
      requestType: type.toUpperCase()
    };
    this.post(payload, "api/specialist-dashboard/pended/list").subscribe(
      data => {
        this.workCategoryPendedDetailsDataResponse = data;
        this.workCategoryPendedDetailsDataFetch.next(
          this.workCategoryPendedDetailsDataResponse
        );
      },
      error => {
        this.workCategoryPendedDetailsDataResponse = [];
        return;
      }
    );
  }

  getWorkCategoryRoutedDetailsData(type, action) {
    const payload = {
      action,
      requestType: type.toUpperCase()
    };
    this.post(
      payload,
      "api/specialist-dashboard/specialist-details/route-out"
    ).subscribe(
      data => {
        this.workCategoryRoutedDetailsDataResponse = data;
        this.workCategoryRoutedDetailsDataFetch.next(
          this.workCategoryRoutedDetailsDataResponse
        );
      },
      error => {
        this.workCategoryRoutedDetailsDataResponse = [];
        return;
      }
    );
  }

  getRolesToRouteListner() {
    return this.rolesToRouteSub.asObservable();
  }

  getRouteReasonsConfig() {
    this.get("api/configuration/route/details").subscribe(
      data => {
        this.routeReasonConfigResponse = data;
        this.routeReasonsConfigSub.next(this.routeReasonConfigResponse);
      },
      error => {
        this.routeReasonConfigResponse = [];
        return;
      }
    );
  }

  getRouteReasonsConfigListner() {
    return this.routeReasonsConfigSub.asObservable();
  }

  addRouteReason(reason) {
    return this.post(reason, "api/configuration/route/create");
  }

  updateRouteReason(code, reason, routeRoleDetails) {
    const payload = {
      routeReasonCode: Number(code),
      routeReason: reason,
      routeRoleDetails: {
        id: Number(routeRoleDetails.id)
      }
    };
    return this.post(payload, "api/configuration/route/update");
  }

  deleteRouteReason(code) {
    return this.get(`api/configuration/route/delete?routeReasonCode=${code}`);
  }

  getRoutedRoles() {
    this.get("api/configuration/route/options").subscribe(
      data => {
        this.routedRoleResponse = data;
        this.routedRolesSub.next(this.routedRoleResponse);
      },
      error => {
        this.routedRoleResponse = [];
        return;
      }
    );
  }

  saveRouteRole(roles) {
    const promise = new Promise((resolve, reject) => {
      this.post(roles, "api/configuration/route/options/create")
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Roles Configured Successfully!"
          });
          this.getRoutedRoles();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  getRoutedRolesListner() {
    return this.routedRolesSub.asObservable();
  }

  auditQualitScoreListner() {
    return this.myQualityFetch.asObservable();
  }

  getPendReasonsConfig() {
    this.get("api/configuration/pend/details").subscribe(
      data => {
        this.pendReasonConfigResponse = data;
        this.pendReasonsConfigSub.next(this.pendReasonConfigResponse);
      },
      error => {
        this.pendReasonConfigResponse = [];
        return;
      }
    );
  }

  getOpenInvReqListner() {
    return this.openInvReqFetch.asObservable();
  }

  getRebuttalStatusListner() {
    return this.rebuttalStatusReqFetch.asObservable();
  }

  getAuditTransListner() {
    return this.auditTransFetch.asObservable();
  }

  getPendReasonsConfigListner() {
    return this.pendReasonsConfigSub.asObservable();
  }

  deletePendReason(code) {
    return this.get(`api/configuration/pend/delete?pendReasonCode=${code}`);
  }

  updatePendReason(code, reason) {
    const payload = {
      pendReasonCode: code,
      pendReason: reason
    };
    return this.post(payload, "api/configuration/pend/update");
  }

  addPendReason(reason) {
    const payload = {
      pendReason: reason
    };
    return this.post(payload, "api/configuration/pend/create");
  }

  addReassignmentReason(reason) {
    const payload = {
      reassignmentReason: reason
    };
    return this.post(payload, "api/configuration/reassignment-reason/create");
  }

  getReassignmentReasons() {
    return this.get("api/configuration/reassignment-reasons");
  }

  updateReassignmentReason(code, reason) {
    const payload = {
      reassignmentReasonCode: code,
      reassignmentReason: reason
    };
    return this.post(payload, "api/configuration/reassignment-reason/update");
  }

  deleteReassignmentReason(code) {
    return this.get(
      `api/configuration/reassignment-reason/delete?reassignmentReasonCode=${code}`
    );
  }

  addTransactionCategory(category) {
    const payload = {
      category
    };
    return this.post(payload, "api/configuration/transaction-category/create");
  }

  getTransactionCategory() {
    return this.get("api/configuration/transaction-category");
  }

  updateTransactionCategory(code, category) {
    const payload = {
      transactionCategoryCode: code,
      category
    };
    return this.post(payload, "api/configuration/transaction-category/update");
  }

  deleteTransactionCategory(code) {
    return this.get(
      `api/configuration/transaction-category/delete?transactionCategoryCode=${code}`
    );
  }

  specialistRequestByStatus(payload) {
    return this.post(
      payload,
      "api/enrollment/specialist-dashboard/inventory-by-status"
    );
  }

  specialistRequestByCategory(payload) {
    return this.post(
      payload,
      "api/enrollment/specialist-dashboard/production-count-by-TransactionCategory"
    );
  }

  auditQualitScore(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/specialist-dashboard/audit-quality-score"
    ).subscribe(
      data => {
        this.myQualityResponse = data;
        this.myQualityFetch.next(this.myQualityResponse);
      },
      error => {
        this.myQualityResponse = [];
        return;
      }
    );
  }

  specialistPendReqAge(payload) {
    return this.post(
      payload,
      "api/enrollment/specialist-dashboard/pended-transaction-age"
    );
  }

  specialistProductivityByTransaction(payload) {
    return this.post(
      payload,
      "api/enrollment/specialist-dashboard/productivity-by-transaction"
    );
  }

  getUserWorkItemTypes() {
    return this.get("api/enrollment/active/work-category");
  }

  getTransactionCategories() {
    return this.get("api/enrollment/specialist/transaction-category");
  }

  getPendReasons() {
    return this.get("api/enrollment/specialist/pend/details");
  }

  getRouteReasons() {
    return this.get("api/enrollment/specialist/route/details");
  }

  specialistCompleteTask(payload) {
    return this.post(payload, "api/enrollment/specialist/complete");
  }

  specialistPendTask(payload) {
    return this.post(payload, "api/enrollment/specialist/pend");
  }

  specialistRouteTask(payload) {
    return this.post(payload, "api/enrollment/specialist/route");
  }

  getMemberDetails(requestType) {
    return this.post(
      {
        requestType: String(requestType).toUpperCase()
      },
      `api/enrollment/specialist/transaction`
    );
  }

  getMemberDetailsById(taskId) {
    return this.get(
      `api/enrollment/specialist/transaction-detail?taskId=${taskId}`
    );
  }

  getUserNames(payload) {
    return this.post(payload, "api/enrollment/specialist/route/to-user-name");
  }

  specialistRequestByTransaction(payload) {
    return this.post(
      payload,
      "api/enrollment/specialist-dashboard/production-vol-by-transaction"
    );
  }

  specialistRequestByType(payload) {
    return this.post(
      payload,
      "api/enrollment/specialist-dashboard/production-count-by-enrollmentWorkCategory"
    );
  }

  getRouteRoleList() {
    return this.get("api/enrollment/specialist/route/roles");
  }

  getOpenInvReq(fromDate, toDate, status) {
    const param = {
      fromDate,
      toDate,
      status
    };
    this.post(
      param,
      "api/enrollment/specialist-dashboard/open-inventory-by-category"
    ).subscribe(
      data => {
        this.openInvReqResponse = data;
        this.openInvReqFetch.next(this.openInvReqResponse);
      },
      error => {
        this.openInvReqResponse = [];
        return;
      }
    );
  }
  getRebuttalStatus(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.post(
      param,
      "api/enrollment/specialist-dashboard/rebuttal-sts"
    ).subscribe(
      data => {
        this.rebuttalStatusReqResponse = data;
        this.rebuttalStatusReqFetch.next(this.rebuttalStatusReqResponse);
      },
      error => {
        this.rebuttalStatusReqResponse = [];
        return;
      }
    );
  }

  getAuditTrans(fromDate, toDate, frequency) {
    const param = {
      fromDate,
      toDate,
      frequency
    };
    this.post(
      param,
      "api/enrollment/specialist-dashboard/audit-transaction-trend"
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

  getPayload(type, editUser) {
    let payload = {};
    if (type === "open-inventory-by-cat") {
      payload = {
        workCategory: editUser.workCategory.toUpperCase(),
        status: editUser.status,
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "pend-req-age-lead") {
      payload = {
        userGroupId: editUser.userGroupId,
        specialistId: editUser.specialistId,
        age: editUser.age
      };
    } else if (type === "inventory-status") {
      payload = {
        status: editUser.status.toUpperCase(),
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "production-volume-trans") {
      payload = {
        status: editUser.status.toUpperCase(),
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "production-count-by-work-category") {
      payload = {
        category: editUser.status.toUpperCase(),
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "rebuttal-status") {
      payload = {
        status: editUser.status.toUpperCase(),
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "quality-score-trend") {
      payload = {
        status: editUser.status.toUpperCase(),
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "pend-request-age-lead") {
      payload = {
        status: editUser.status.toUpperCase(),
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "pend-request-age-specialist") {
      payload = {
        status: editUser.status.toUpperCase(),
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "prod-count-trans-cat") {
      payload = {
        category: editUser.workCategory.toUpperCase(),
        fromDate: editUser.fromDate,
        toDate: editUser.toDate
      };
    } else if (type === "prod-count-trans-cat-lead") {
      payload = {
        fromDate: editUser.fromDate,
        toDate: editUser.toDate,
        groupId: editUser.groupId,
        specialistId: editUser.specialistId
      };
    } else if (type === "audit-transaction-trend") {
      payload = {
        status: editUser.status.toUpperCase(),
        date: editUser.date,
        frequency: editUser.frequency
      };
    } else if (type === "my-quality-score") {
      payload = {
        status: editUser.status.toUpperCase(),
        date: editUser.date
      };
    } 
    return payload;
  }

  getGridView(editUser) {
    const type = editUser.type;
    let url;
    const payload = this.getPayload(type, editUser);
    if (type === "open-inventory-by-cat") {
      url = "api/enrollment/specialist-dashboard-reports/open-inventory-grid";
    } else if (type === "inventory-status") {
      url =
        "api/enrollment/specialist-dashboard-reports/inventory-by-status-grid";
    } else if (type === "production-volume-trans") {
      url = "api/enrollment/specialist/enrollment/volume-trans/grid-view";
    } else if (type === "production-count-by-work-category") {
      url =
        "api/enrollment/specialist-dashboard-reports/production-count-enrollmentWorkCategory-grid";
    }  else if (type === "quality-score-trend") {
      url =
        "api/enrollment/specialist/enrollment/quality-score-trend/grid-view";
    } else if (type === "prod-count-trans-cat") {
      url =
        "api/enrollment/specialist-dashboard-reports/production-count-transactionCategory-grid";
    } else if (type === "prod-count-trans-cat-lead") {
      url =
        "api/enrollment/lead-dashboard/production-count-by-category/details";
    } else if (type === "pend-req-age-lead") {
      url = "api/enrollment/lead-dashboard/pended-record-age/details";
    } else if (type === "audit-transaction-trend") {
      url =
        "api/enrollment/specialist-dashboard-reports/audit-transaction-trend/grid";
    } else if (type === "my-quality-score") {
      url = "api/enrollment/specialist/enrollment/my-quality-score/grid-view";
    } else if (type === "rebuttal-status") {
      url = "api/enrollment/specialist-dashboard-reports/rebuttal-status/grid-view";
    }
    this.post(payload, url).subscribe(
      data => {
        this.gridViewResponse = data;
        this.gridViewFetch.next(this.gridViewResponse);
      },
      error => {
        this.gridViewResponse = [];
        return;
      }
    );
  }

  getOpenInvReport(editUser) {
    const type = editUser.type;
    const payload = this.getPayload(type, editUser);
    let url;
    if (type === "open-inventory-by-cat") {
      url = "api/enrollment/specialist-dashboard-reports/open-inventory-report";
    } else if (type === "inventory-status") {
      url =
        "api/enrollment/specialist-dashboard-reports/inventory-by-status-report";
    } else if (type === "production-volume-trans") {
      url = "api/enrollment/specialist/enrollment/volume-trans/report";
    } else if (type === "production-count-by-work-category") {
      url =
        "api/enrollment/specialist-dashboard-reports/production-count-enrollmentWorkCategory-report";
    } else if (type === "rebuttal-status") {
      url = "api/enrollment/specialist-dashboard-reports/rebuttal-status/report";
    } else if (type === "pend-req-age-lead") {
      url = "api/enrollment/lead-dashboard/pended-record-age-report";
    } else if (type === "quality-score-trend") {
      url = "api/enrollment/specialist/enrollment/quality-score-trend/report";
    } else if (type === "prod-count-trans-cat-lead") {
      url =
        "api/enrollment/lead-dashboard/production-count-by-specialist/report";
    } else if (type === "prod-count-trans-cat") {
      url =
        "api/enrollment/specialist-dashboard-reports/production-count-transactionCategory-report";
    } else if (type === "audit-transaction-trend") {
      url =
        "api/enrollment/specialist-dashboard-reports/audit-transaction-trend/report";
    } else if (type === "my-quality-score") {
      url = "api/enrollment/specialist/enrollment/my-quality-score/report";
    } 
    return this.getExcel(payload, url);
  }

  getWorkCategory() {
    return this.get("api/configuration/enrollment-req-type").pipe(
      map(data => {
        const resp: WorkCategory[] = data || [];
        return resp.sort((a, b) => a.id - b.id);
      })
    );
  }

  updateWorkCategory(id: number, status: boolean) {
    const payload = {
      id,
      workCategoryConfigActive: status
    };
    return this.post(payload, "api/configuration/enrollment-req-type/update");
  }

  getEnrollmentSpecilaitMainLandingPageData() {
    return this.get("api/specialist-dashboard/dashboard-queue");
  }
  getEnrollmentSpecialistMainLandingPageQuickLinkData() {
    return this.get("api/specialist-dashboard/quick-link");
  }

  ExaminerProductivitiyConfig(payload) {
    return this.post(
      payload,
      `api/configuration/routed-out-enrollment/transaction/update`
    );
  }

  getExaminerProductivitiyConfig() {
    return this.get(`api/configuration/routed-out-enrollment/transaction`);
  }

  getRouteReasonLead() {
    return this.get("api/enrollment/lead-route/route/reasons");
  }

  getTransactionTypes() {
    return this.get("api/enrollment/specialist/transaction-type");
  }

  getSLAConfig() {
    return this.get("api/enrollment/manager/configuration/enrollment-sla-list");
  }

  saveSlaConfig(payload) {
    return this.post(
      payload,
      "api/enrollment/manager/configuration/save-enrollment-sla"
    );
  }

  updateSlaConfig(payload) {
    return this.post(
      payload,
      "api/enrollment/manager/configuration/update-enrollment-sla"
    );
  }

  getWorkCategorySLAs(workCategoryId: number) {
    return this.post({workCategoryId}, 'api/enrollment/manager/configuration/workcategory-enrollment-sla-list');
  }

  deleteWorkCategorySLA(id) {
    return this.post({id}, 'api/enrollment/manager/configuration/delete-enrollment-sla');
  }
}

const a = { workbasket: 10, reconciliation: 20, fallout: 30 };
