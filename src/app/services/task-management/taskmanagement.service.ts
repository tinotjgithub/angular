import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BaseHttpService } from "../base-http.service";
import AuditClaim from "./models/AuditClaim";
import AssignAuditTask from "./models/AuditAssingTask";
import { DrawClaim } from "./models/DrawClaim";
import { UserDashboard } from "./models/UserDashboard";
import { StatusDate } from "./models/StatusDate";
import { NotifierService } from "../notifier.service";
import { ProductivitySchedule } from "./models/ProductivitySchedule";
import { ProceduralScore } from "./models/ProceduralScore";
import { FinancialScore } from "./models/FinancialScore";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "../header/header.service";
@Injectable({
  providedIn: "root"
})
export class TaskmanagementService {
  public static userDashBoardVal: any;
  managerProcScoreResponse: any;
  leadTeamProdScoreResponse: any;
  private taskUpdatedSub = new Subject<any[]>();
  private prodScoresFetch = new Subject<any[]>();
  myProdScoresFetch = new Subject<ProductivitySchedule>();
  myTeamProdScoreResponse: any;
  lowPerExaminersResponse: any;
  claimsOpenInvResponse: any;
  claimsThreasholdResponse: any;
  claimsThreasholdFetch = new Subject<any[]>();
  slaConfigResponse: any;
  inventoryClaimsResponse: any;
  uploadFileReasonTemplateResponse: any;
  uploadFileReasonTemplateFetch = new Subject<any[]>();
  userGrpUploadResponse: any;
  userGrpUploadFetch = new Subject<any[]>();
  userUploadResponse: any;
  userUploadUploadFetch = new Subject<any[]>();
  inventoryClaimsFetch = new Subject<any[]>();
  slaConfigFetch = new Subject<any[]>();
  lowPerExaminersFetch = new Subject<any[]>();
  highPerExaminersResponse: any;
  highPerExaminersFetch = new Subject<any[]>();
  myTeamProdScoresFetch = new Subject<ProductivitySchedule>();
  leadTeamProdScoreFetch = new Subject<ProductivitySchedule>();
  myFinScoresFetch = new Subject<FinancialScore>();
  myProcScoresFetch = new Subject<ProceduralScore>();
  financeReportFetch = new Subject<any[]>();
  private claimListFetch = new Subject<any[]>();
  private myProdFetch = new Subject<any[]>();
  private availableVsProdScoresFetch = new Subject<any[]>();
  private statusActInScoresFetch = new Subject<any[]>();
  statusScoresFetch = new Subject<StatusDate>();
  leadExaminerPassFailScoreFetch = new Subject<StatusDate>();
  processedScoresFetch = new Subject<StatusDate>();
  statusReportFetch = new Subject<any[]>();
  rebuttalStatusReportFetch = new Subject<any[]>();
  rebuttalStatusReportResponse: any;
  userReportFetch = new Subject<any[]>();
  userGrpReportFetch = new Subject<any[]>();
  reasonReportFetch = new Subject<any[]>();
  auditReportFetch = new Subject<any[]>();
  procReportFetch = new Subject<any[]>();
  private claimDetailsSub = new Subject<any>();
  private conScoresFetch = new Subject<any>();
  examinerCountFetch = new Subject();
  claimsOpenInvFetch = new Subject();
  auditScoresFetch = new Subject<any>();
  leadUserGroupsSub = new Subject<any>();
  private routeRolesSub = new Subject<any>();
  routedRolesSub = new Subject<any>();
  private userRolesSub = new Subject<any>();
  pendReasonsConfigSub = new Subject<any>();
  routeReasonsConfigSub = new Subject<any>();
  rolesToRouteSub = new Subject<any>();
  managerQueueNamesSub = new Subject<any>();
  managerClaimsExaminersSub = new Subject<any>();
  managerUserGroupsSub = new Subject<any>();
  leadQueueNamesSub = new Subject<any>();
  leadClaimsExaminersSub = new Subject<any>();
  statusSub = new Subject<any>();
  leadStatusesSub = new Subject<any>();
  leadNamesSub = new Subject<any>();
  queueNamesSub = new Subject<any>();
  routeReasonsSub = new Subject<any>();
  private pendReasonsSub = new Subject<any>();
  private routeUserSub = new Subject<any>();
  private routeLeadSub = new Subject<any>();
  productivityReportFetch = new Subject<any>();
  private auditClaimDetailsSub = new Subject<AuditClaim>();
  private updateUserInfo = new Subject<UserDashboard>();
  private saveFinTargetScoreSub = new Subject<any>();
  private saveTargetSettingsSub = new Subject<any>();
  private saveTargetSettingsFetchSub = new Subject<any>();
  private modifyUserTargetSub = new Subject<any>();
  managerStatusScoresFetch = new Subject<any>();
  managerAgeScoresFetch = new Subject<any>();
  leadAgeScoresFetch = new Subject<any>();
  reassignedRouteReasonsSub = new Subject<any>();
  userTargetSub = new Subject<any>();
  userGrpUploadTemplateFetch = new Subject<any>();
  userGrpUploadTemplateResponse: any;
  userUploadTemplateFetch = new Subject<any>();
  userUploadTemplateResponse: any;
  leadStatusScoresFetch = new Subject<any>();
  managerFinScoresFetch = new Subject<any>();
  managerProcScoresFetch = new Subject<any>();
  managerAuditScoresFetch = new Subject<any>();
  auditFailedRebuttalAcceptedFetch = new Subject<any>();
  auditFailedRebuttalAcceptedResponse: any;
  leadUserGroupsResponse: any;
  private loggedInUserEmail = "admin@promt.com";
  private taskTimerSub = new Subject<{
    timer: string;
    timerColor: string;
    timerFadeColor: string;
  }>();
  private refreshClaimWorkBasketSub = new Subject<any>();
  private leadModifyUserUpdateSub = new Subject<any>();
  private getQueueNamesSub = new Subject<any>();
  managerUserGroupsResponse: any;
  managerClaimsExaminersResponse: any;
  leadClaimsExaminersResponse: any;
  leadExaminerPassFailScoreResponse: any;
  interval;
  timeLeft = 0;
  pause = false;
  refreshValue = false;
  timer = "00:00:00";
  minutes = 0;
  hours = 0;

  timerRedColor = "#FF0000";
  timerRedFadeColor = "#00b0b621";
  timerAmberColor = "#FFBF00";
  timerAmberFadeColor = "#00b0b621";

  // This will be passed to component
  timerColor = "#00bf96";
  timerFadeColor = "#00816a";
  timerStarted = false;
  claimListResponse: any;

  claimDetails: DrawClaim = {
    claimId: null,
    claimFactKey: 0,
    taskId: 0,
    claimReceivedDate: null,
    age: 0,
    status: "",
    queueName: "",
    endTimer: "00:00:00",
    pendReason: "",
    comments: "",
    routeReason: "",
    firstPendDate: null,
    lastPendDate: null
  };

  prodScoreResponse: any;
  myprodScoreResponse: any;
  productivityReportResponse: any;
  financeReportResponse: any;
  userTargetResponse: any;

  myprodResponse: any;
  pendReasonConfigResponse: any;
  routeReasonConfigResponse: any;
  myfinScoreResponse: any;
  myprocScoreResponse: any;

  // draw-score --e
  auditScoreResponse: any;
  managerAuditScoreResponse: any;
  availableVsProdScoreResponse: any;
  routeRoleResponse: any;
  roleResponse: any;
  rolesToRouteResponse: any;
  leadStatusesResponse: any;
  managerQueueNamesResponse: any;
  leadQueueNamesResponse: any;
  leadNamesResponse: any;
  queueNamesResponse: any;
  statusResponse: any;
  routedRoleResponse: any;
  routeReasonResponse: any;
  reassignedRouteReasonResponse: any;
  pendReasonResponse: any;
  routeUserResponse: any;
  assignTaskResponse: any;
  statusScoreResponse: any;
  processedScoreResponse: any;
  managerFinScoreResponse: any;
  managerStatusScoreResponse: any;
  leadStatusScoreResponse: any;
  managerAgeScoreResponse: any;
  leadAgeScoreResponse: any;
  statusReportResponse: any;
  reasonUploadResponse: any;
  statusActInResponse: any;
  auditReportResponse: any;
  procReportResponse: any;
  conScoreResponse: any;
  seconds: number;
  auditClaimDetails: AuditClaim;
  assignAuditTaskResponse: AssignAuditTask;
  dashboardData: UserDashboard;
  targetSettingsFetchDetailsResponse: any;
  modifyUserTargetResponse: any;
  examinerCountResponse: any[];

  constructor(
    public baseHTTPService: BaseHttpService,
    private messageService: NotifierService,
    private httpClient: HttpClient,
    private headerService: HeaderService
  ) {}

  /* getTaskListener() {
    return this.taskUpdatedSub.asObservable();
  } */

  /* getProdScoresListner() {
    return this.prodScoresFetch.asObservable();
  } */

  getReAssignedRouteReasonsListner() {
    return this.reassignedRouteReasonsSub.asObservable();
  }

  getMyProdScoresListner() {
    return this.myProdScoresFetch.asObservable();
  }

  getMyTeamProdScoresListner() {
    return this.myTeamProdScoresFetch.asObservable();
  }

  uploadFileReasonTemplateListner() {
    return this.uploadFileReasonTemplateFetch.asObservable();
  }

  userGrpUploadTemplateListner() {
    return this.userGrpUploadTemplateFetch.asObservable();
  }

  userUploadTemplateListner() {
    return this.userUploadTemplateFetch.asObservable();
  }

  getLeadTeamProdScoresListner() {
    return this.leadTeamProdScoreFetch.asObservable();
  }

  getMyFinScoresListner() {
    return this.myFinScoresFetch.asObservable();
  }

  getUserTargetListner() {
    return this.userTargetSub.asObservable();
  }

  getSLAConfigListner() {
    return this.slaConfigFetch.asObservable();
  }

  getInventoryClaimsListner() {
    return this.inventoryClaimsFetch.asObservable();
  }

  getMyProcScoresListner() {
    return this.myProcScoresFetch.asObservable();
  }

  getClaimListListner() {
    return this.claimListFetch.asObservable();
  }

  /* getMyProdListner() {
    return this.myProdFetch.asObservable();
  } */

  getAuditScoresListner() {
    return this.auditScoresFetch.asObservable();
  }

  getManagerAuditScoresListner() {
    return this.managerAuditScoresFetch.asObservable();
  }

  /* getAvailableVsProdScoresListner() {
    return this.availableVsProdScoresFetch.asObservable();
  } */

  getStatusScoresListner() {
    return this.statusScoresFetch.asObservable();
  }

  getManagerProcessedScoresListner() {
    return this.processedScoresFetch.asObservable();
  }

  getManagerFinScoresListner() {
    return this.managerFinScoresFetch.asObservable();
  }

  getManagerProcScoresListner() {
    return this.managerProcScoresFetch.asObservable();
  }
  /* getActiveInactiveStatusListner() {
    return this.statusActInScoresFetch.asObservable();
  } */

  getManagerStatusScoresListner() {
    return this.managerStatusScoresFetch.asObservable();
  }

  getLeadStatusScoresListner() {
    return this.leadStatusScoresFetch.asObservable();
  }

  getLeadExaminerPassFailScoresListner() {
    return this.leadExaminerPassFailScoreFetch.asObservable();
  }

  getManagerAgeScoresListner() {
    return this.managerAgeScoresFetch.asObservable();
  }

  getLeadAgeScoresListner() {
    return this.leadAgeScoresFetch.asObservable();
  }

  getLowPerExaminersListner() {
    return this.lowPerExaminersFetch.asObservable();
  }

  getHighPerExaminersListner() {
    return this.highPerExaminersFetch.asObservable();
  }

  getStatusReportListner() {
    return this.statusReportFetch.asObservable();
  }
  getAuditFailedRebuttalReportListner() {
    return this.rebuttalStatusReportFetch.asObservable();
  }

  getUserReportListner() {
    return this.userReportFetch.asObservable();
  }
  getUserGrpReportListner() {
    return this.userGrpReportFetch.asObservable();
  }

  getReasonReportListner() {
    return this.reasonReportFetch.asObservable();
  }

  getAuditReportListner() {
    return this.auditReportFetch.asObservable();
  }

  getProcReportListner() {
    return this.procReportFetch.asObservable();
  }

  getProductivityReportListner() {
    return this.productivityReportFetch.asObservable();
  }

  getFinanceReportListner() {
    return this.financeReportFetch.asObservable();
  }

  getConScoresListner() {
    return this.conScoresFetch.asObservable();
  }

  getTaskTimerListener() {
    return this.taskTimerSub.asObservable();
  }

  getClaimDetailsListener() {
    return this.claimDetailsSub.asObservable();
  }

  getRouteRolesListner() {
    return this.routeRolesSub.asObservable();
  }

  getUserRolesListner() {
    return this.userRolesSub.asObservable();
  }

  getRoutedRolesListner() {
    return this.routedRolesSub.asObservable();
  }

  getRolesToRouteListner() {
    return this.rolesToRouteSub.asObservable();
  }

  getManagerQueueNamesListner() {
    return this.managerQueueNamesSub.asObservable();
  }

  getManagerClaimsExaminersListner() {
    return this.managerClaimsExaminersSub.asObservable();
  }

  getLeadClaimsExaminersListner() {
    return this.leadClaimsExaminersSub.asObservable();
  }

  getManagerUserGroupsListner() {
    return this.managerUserGroupsSub.asObservable();
  }

  getLeadQueueNamesListner() {
    return this.leadQueueNamesSub.asObservable();
  }

  getLeadUserGroupsListner() {
    return this.leadUserGroupsSub.asObservable();
  }

  getLeadStatusesListner() {
    return this.leadStatusesSub.asObservable();
  }

  getStatusListner() {
    return this.statusSub.asObservable();
  }

  getLeadNamesListner() {
    return this.leadNamesSub.asObservable();
  }

  getManagerQueuesListner() {
    return this.queueNamesSub.asObservable();
  }

  getRouteReasonsListner() {
    return this.routeReasonsSub.asObservable();
  }

  getPendReasonsListner() {
    return this.pendReasonsSub.asObservable();
  }

  getPendReasonsConfigListner() {
    return this.pendReasonsConfigSub.asObservable();
  }

  getRouteReasonsConfigListner() {
    return this.routeReasonsConfigSub.asObservable();
  }

  getRouteUserListener() {
    return this.routeUserSub.asObservable();
  }

  getLeadRouteUserListener() {
    return this.routeLeadSub.asObservable();
  }

  updateUserInfoListener() {
    return this.updateUserInfo.asObservable();
  }

  getAuditClaimDetailsListener() {
    return this.auditClaimDetailsSub.asObservable();
  }

  saveFinancialTargetScoreListener() {
    return this.saveFinTargetScoreSub.asObservable();
  }

  /* saveTargetSettingsListener() {
    return this.saveTargetSettingsSub.asObservable();
  } */

  /* saveTargetSettingsFetchListener() {
    return this.saveTargetSettingsFetchSub.asObservable();
  } */

  getExaminerCountListner() {
    return this.examinerCountFetch.asObservable();
  }

  getClaimsOpenInventoryListner() {
    return this.claimsOpenInvFetch.asObservable();
  }

  getClaimsThreasholdListner() {
    return this.claimsThreasholdFetch.asObservable();
  }

  getUserInfo() {
    return TaskmanagementService.userDashBoardVal;
  }

  /* modifyUserTargetListener() {
    return this.modifyUserTargetSub.asObservable();
  } */

  /* refreshClaimWorkBasketListener() {
    return this.refreshClaimWorkBasketSub.asObservable();
  } */

  /* leadModifyUserUpdateListener() {
    return this.leadModifyUserUpdateSub.asObservable();
  } */

  /* getQueueNamesListener() {
    return this.getQueueNamesSub.asObservable();
  } */

  resetTaskTimer() {
    this.timeLeft = this.splitTimer("00:00:00");
    this.hours = Math.floor(this.timeLeft / 3600);
    this.minutes = Math.floor((this.timeLeft % 3600) / 60);
    this.seconds = Math.floor((this.timeLeft % 3600) % 60);
    this.timer = this.getForamattedTimeStamp(
      this.hours,
      this.minutes,
      this.seconds
    );
    this.setTimerColor();
    this.taskTimerSub.next({
      timer: this.timer,
      timerColor: this.timerColor,
      timerFadeColor: this.timerFadeColor
    });
  }

  startTimer() {
    clearInterval(this.interval);
    this.resetTaskTimer();
    this.pause = false;
    this.timeLeft = this.splitTimer(this.claimDetails.endTimer);
    this.interval = setInterval(() => {
      this.timerStarted = true;
      this.timeLeft++;
      this.hours = Math.floor(this.timeLeft / 3600);
      this.minutes = Math.floor((this.timeLeft % 3600) / 60);
      this.seconds = Math.floor((this.timeLeft % 3600) % 60);
      this.timer = this.getForamattedTimeStamp(
        this.hours,
        this.minutes,
        this.seconds
      );
      this.setTimerColor();
      this.taskTimerSub.next({
        timer: this.timer,
        timerColor: this.timerColor,
        timerFadeColor: this.timerFadeColor
      });
    }, 1000);
  }

  getForamattedTimeStamp(h, m, s) {
    const hours = h < 10 ? "0" + h : h;
    const minutes = m < 10 ? "0" + m : m;
    const seconds = s < 10 ? "0" + s : s;
    return hours + ":" + minutes + ":" + seconds;
  }

  splitTimer(endTimer): number {
    if (endTimer === undefined || endTimer === null || endTimer === "") {
      endTimer = "00:00:00";
    }
    const splitArray = endTimer.split(":");
    const seconds =
      +splitArray[0] * 60 * 60 + +splitArray[1] * 60 + +splitArray[2];
    return seconds;
  }

  get timerValue() {
    return this.timer;
  }

  get timerColorValue() {
    return this.timerColor;
  }

  get timerFadeColorValue() {
    return this.timerFadeColor;
  }

  get pauseValue() {
    return this.pause;
  }

  pauseTimer() {
    this.pause = true;
    clearInterval(this.interval);
  }

  private setTimerColor() {
    if (this.hours >= 1 || this.minutes >= 1 || this.seconds >= 30) {
      this.timerColor = this.timerRedColor;
      this.timerFadeColor = this.timerRedFadeColor;
    } else if (this.seconds >= 20 && this.seconds < 30) {
      this.timerColor = this.timerAmberColor;
      this.timerFadeColor = this.timerAmberFadeColor;
    } else {
      this.timerColor = "#00bf96";
      this.timerFadeColor = "#00816a";
    }
  }

  getDiffDays(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getClaim(taskId = null, selectedClaimStatus = null) {
    const urlSegment =
      selectedClaimStatus === "Pended"
        ? "api/claim/pended"
        : selectedClaimStatus === "Assigned"
        ? "api/claim/assigned"
        : "api/claim/routedIn";
    if (taskId) {
      this.baseHTTPService
        .get(urlSegment + "?taskId=" + taskId)
        .subscribe(claim => {
          this.claimDetails = claim;
          this.claimDetailsSub.next(this.claimDetails);
          this.headerService.updateClaimDetails(this.claimDetails);
          if (this.isClaimAvailable(claim)) {
            this.startTimer();
            this.messageService.throwNotification({
              type: "success",
              message: "Claim loaded successfully"
            });
          }
        });
    } else {
      this.baseHTTPService.get("api/claim").subscribe(claim => {
        this.claimDetails = claim;
        this.claimDetailsSub.next(this.claimDetails);
        this.headerService.updateClaimDetails(this.claimDetails);
        if (this.isClaimAvailable(claim)) {
          this.startTimer();
          this.messageService.throwNotification({
            type: "success",
            message: "Claim loaded successfully"
          });
        }
      });
    }
  }

  isClaimAvailable(claimDetails) {
    if (claimDetails.claimId === null || claimDetails.claimId === undefined) {
      this.messageService.throwNotification({
        type: "warning",
        message: "There are no Claims available to load"
      });
      return false;
    } else {
      return true;
    }
  }

  getRouteRoles() {
    this.baseHTTPService.get("api/claim/route/roles").subscribe(
      data => {
        this.routeRoleResponse = data;
        this.routeRolesSub.next(this.routeRoleResponse);
      },
      error => {
        this.routeRoleResponse = [];
        return;
      }
    );
  }

  getRolesToRoute() {
    this.baseHTTPService.get("api/configuration/roles").subscribe(
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

  getUserTarget() {
    this.baseHTTPService
      .get("api/target-settings/getAllTargetSettings")
      .subscribe(
        data => {
          this.userTargetResponse = data;
          this.userTargetSub.next(this.userTargetResponse);
        },
        error => {
          this.userTargetResponse = [];
          return;
        }
      );
  }

  getSLAConfig() {
    this.baseHTTPService
      .get("api/manager/configuration/claims-sla-list")
      .subscribe(
        data => {
          this.slaConfigResponse = data;
          this.slaConfigFetch.next(this.slaConfigResponse);
        },
        error => {
          this.slaConfigResponse = [];
          return;
        }
      );
  }

  getInventoryClaims(editUser, type) {
    const url =
      type === "threshold-sla"
        ? "api/resource-dashboard/claims-nearing-sla-threshold/grid"
        : "api/resource-dashboard/claims-nearing-sla/grid";
    this.baseHTTPService.post(editUser, url).subscribe(
      data => {
        this.inventoryClaimsResponse = data;
        this.inventoryClaimsFetch.next(this.inventoryClaimsResponse);
      },
      error => {
        this.inventoryClaimsResponse = [];
        return;
      }
    );
  }

  getManagerQueueNames(userId) {
    this.baseHTTPService
      .get(`api/resource-dashboard/queue-name/${userId}`)
      .subscribe(
        data => {
          this.managerQueueNamesResponse = data;
          this.managerQueueNamesSub.next(this.managerQueueNamesResponse);
        },
        error => {
          this.managerQueueNamesResponse = [];
          return;
        }
      );
  }

  getManagerClaimsExaminers(role) {
    const url =
      role === "Claims Lead"
        ? `api/resource-dashboard/lead/examiners`
        : `api/resource-dashboard/manager/examiners`;
    this.baseHTTPService.get(url).subscribe(
      data => {
        this.managerClaimsExaminersResponse = data;
        this.managerClaimsExaminersSub.next(
          this.managerClaimsExaminersResponse
        );
      },
      error => {
        this.managerClaimsExaminersResponse = [];
        return;
      }
    );
  }

  getLeadClaimsExaminers(groupId) {
    const params = {
      groupId
    };
    const url = `api/resource-dashboard/user-group/examiners`;
    this.baseHTTPService.post(params, url).subscribe(
      data => {
        this.leadClaimsExaminersResponse = data;
        this.leadClaimsExaminersSub.next(this.leadClaimsExaminersResponse);
      },
      error => {
        this.leadClaimsExaminersResponse = [];
        return;
      }
    );
  }

  getManagerUserGroups(role) {
    const url = `api/resource-dashboard/user-group`;
    this.baseHTTPService.get(url).subscribe(
      data => {
        this.managerUserGroupsResponse = data;
        this.managerUserGroupsSub.next(this.managerUserGroupsResponse);
      },
      error => {
        this.managerUserGroupsResponse = [];
        return;
      }
    );
  }

  getLeadQueueNames(userId) {
    this.baseHTTPService
      .get(`api/resource-dashboard/queue-name-lead/${userId}`)
      .subscribe(
        data => {
          this.leadQueueNamesResponse = data;
          this.leadQueueNamesSub.next(this.leadQueueNamesResponse);
        },
        error => {
          this.leadQueueNamesResponse = [];
          return;
        }
      );
  }

  getLeadUserGroups(role) {
    const url = `api/resource-dashboard/lead/user-group/${role}`;
    this.baseHTTPService.get(url).subscribe(
      data => {
        this.leadUserGroupsResponse = data;
        this.leadUserGroupsSub.next(this.leadUserGroupsResponse);
      },
      error => {
        this.leadUserGroupsResponse = [];
        return;
      }
    );
  }

  getLeadStatuses(userId) {
    this.baseHTTPService
      .get(`api/resource-dashboard/claim-status-lead/${userId}`)
      .subscribe(
        data => {
          this.leadStatusesResponse = data;
          this.leadStatusesSub.next(this.leadStatusesResponse);
        },
        error => {
          this.leadStatusesResponse = [];
          return;
        }
      );
  }

  getManagerQueues() {
    const urlSegment = "api/resource-dashboard/getQueueNames";
    this.baseHTTPService.get(urlSegment).subscribe(
      data => {
        this.queueNamesResponse = data;
        this.queueNamesSub.next(this.queueNamesResponse);
      },
      error => {}
    );
  }

  getLeadNames(managerId, typeId) {
    const urlSegment = "api/userGroup/lead-names";
    this.baseHTTPService.post({managerId, typeId}, urlSegment).subscribe(
      data => {
        this.leadNamesResponse = data;
        this.leadNamesSub.next(this.leadNamesResponse);
      },
      error => {}
    );
  }

  getStatus() {
    this.baseHTTPService.get("api/resource-dashboard/getClaimStatus").subscribe(
      data => {
        this.statusResponse = data;
        this.statusSub.next(this.statusResponse);
      },
      error => {
        this.statusResponse = [];
        return;
      }
    );
  }

  getRoutedRoles() {
    this.baseHTTPService.get("api/configuration/route/options").subscribe(
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

  getRouteReasons() {
    this.baseHTTPService.get("api/claim/route/reasons").subscribe(
      data => {
        this.routeReasonResponse = data;
        this.routeReasonsSub.next(this.routeReasonResponse);
      },
      error => {
        this.routeReasonResponse = [];
        return;
      }
    );
  }

  getReAssignedRouteReasons() {
    this.baseHTTPService.get("api/claim/route/reassign/reasons").subscribe(
      data => {
        this.reassignedRouteReasonResponse = data;
        this.reassignedRouteReasonsSub.next(this.reassignedRouteReasonResponse);
      },
      error => {
        this.reassignedRouteReasonResponse = [];
        return;
      }
    );
  }

  getRouteUser(roleId, taskId) {
    this.baseHTTPService
      .post(
        {
          taskId,
          toRoleId: roleId
        },
        "api/claim/route/to-user"
      )
      .subscribe(
        data => {
          this.routeUserResponse = data;
          this.routeUserSub.next(this.routeUserResponse);
        },
        error => {
          this.routeUserResponse = [];
          return;
        }
      );
  }

  getLeadRouteUser(payload) {
    this.baseHTTPService
      .post(payload, "api/claim/lead/route/to-examiner")
      .subscribe(
        data => {
          this.routeUserResponse = data;
          this.routeLeadSub.next(this.routeUserResponse);
        },
        error => {
          this.routeUserResponse = [];
          return;
        }
      );
  }

  getPendReasons() {
    this.baseHTTPService.get("api/claim/pend/reasons").subscribe(
      data => {
        this.pendReasonResponse = data;
        this.pendReasonsSub.next(this.pendReasonResponse);
      },
      error => {
        this.pendReasonResponse = [];
        return;
      }
    );
  }

  getPendReasonsConfig() {
    this.baseHTTPService.get("api/configuration/pend/details").subscribe(
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

  addPendReason(reason) {
    const payload = {
      pendReason: reason
    };
    return this.baseHTTPService.post(payload, "api/configuration/pend/create");
  }

  updatePendReason(code, reason) {
    const payload = {
      pendReasonCode: code,
      pendReason: reason
    };
    return this.baseHTTPService.post(payload, "api/configuration/pend/update");
  }

  deletePendReason(code) {
    return this.baseHTTPService.get(
      `api/configuration/pend/delete?pendReasonCode=${code}`
    );
  }

  getRouteReasonsConfig() {
    this.baseHTTPService.get("api/configuration/route/details").subscribe(
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

  addRouteReason(reason) {
    return this.baseHTTPService.post(reason, "api/configuration/route/create");
  }

  updateRouteReason(code, reason, routeRoleDetails) {
    const payload = {
      routeReasonCode: Number(code),
      routeReason: reason,
      routeRoleDetails: {
        id: Number(routeRoleDetails.id)
      }
    };
    return this.baseHTTPService.post(payload, "api/configuration/route/update");
  }

  deleteRouteReason(code) {
    return this.baseHTTPService.get(
      `api/configuration/route/delete?routeReasonCode=${code}`
    );
  }

  getClaimList(filter) {
    const url = "api/claim/".concat(filter).concat("/list");
    return this.baseHTTPService.get(url);
  }

  getMyProdScores(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/productivity-per-user")
      .subscribe(
        (data: ProductivitySchedule) => {
          this.myprodScoreResponse = data;
          this.myProdScoresFetch.next(this.myprodScoreResponse);
        },
        error => {
          this.myprodScoreResponse = [];
          return;
        }
      );
  }

  getMyTeamProdScores(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/manager/productivity")
      .subscribe(
        (data: any) => {
          this.myTeamProdScoreResponse = data;
          this.myTeamProdScoresFetch.next(this.myTeamProdScoreResponse);
        },
        error => {
          this.myTeamProdScoreResponse = [];
          return;
        }
      );
  }

  getLeadTeamProdScores(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/lead/productivity")
      .subscribe(
        (data: any) => {
          this.leadTeamProdScoreResponse = data;
          this.leadTeamProdScoreFetch.next(this.leadTeamProdScoreResponse);
        },
        error => {
          this.leadTeamProdScoreResponse = [];
          return;
        }
      );
  }

  getMyFinScores(fromDate: string, toDate: string) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/financial-accuracy/user")
      .subscribe(
        (data: FinancialScore) => {
          this.myfinScoreResponse = data;
          this.myFinScoresFetch.next(this.myfinScoreResponse);
        },
        error => {
          this.myfinScoreResponse = [];
          return;
        }
      );
  }

  getMyProcScores(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/procedural-accuracy-per-user")
      .subscribe(
        (data: ProceduralScore) => {
          this.myprocScoreResponse = data;
          this.myProcScoresFetch.next(this.myprocScoreResponse);
        },
        error => {
          this.myprocScoreResponse = [];
          return;
        }
      );
    // For Demo Hard Coding the Data
    // return this.httpClient.get("assets/procedural_data.json");
  }

  getAuditScores(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/my-quality-score")
      .subscribe(
        data => {
          this.auditScoreResponse = data;
          this.auditScoresFetch.next(this.auditScoreResponse);
        },
        error => {
          this.auditScoreResponse = [];
          return;
        }
      );
  }

  getManagerAuditScores(fromDate, toDate, userGroupArray) {
    const param = {
      fromDate,
      toDate,
      userGroupArray
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/manager/audit-graph")
      .subscribe(
        data => {
          this.managerAuditScoreResponse = data;
          this.managerAuditScoresFetch.next(this.managerAuditScoreResponse);
        },
        error => {
          this.managerAuditScoreResponse = [];
          return;
        }
      );
  }

  getStatusScores(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/claims-status-per-user")
      .subscribe(
        (data: StatusDate) => {
          this.statusScoreResponse = data;
          this.statusScoresFetch.next(this.statusScoreResponse);
        },
        error => {
          this.statusScoreResponse = [];
          return;
        }
      );
  }

  getManagerProcessedScores(fromDate, toDate, role) {
    const param = {
      fromDate,
      toDate
    };
    const url =
      role === "Manager"
        ? "api/resource-dashboard/manager/claims-processed-vs-audited"
        : "api/resource-dashboard/lead/claims-processed-vs-audited";
    this.baseHTTPService.post(param, url).subscribe(
      (data: any) => {
        this.processedScoreResponse = data;
        this.processedScoresFetch.next(this.processedScoreResponse);
      },
      error => {
        this.processedScoreResponse = [];
        return;
      }
    );
  }

  getManagerFinScores(fromDate, toDate, examinerId, role) {
    const param = {
      fromDate,
      toDate,
      examinerId,
      role
    };
    const url =
      role === "Manager"
        ? "api/resource-dashboard/manager/financial-score"
        : "api/resource-dashboard/lead/financial-score";
    this.baseHTTPService.post(param, url).subscribe(
      (data: any) => {
        this.managerFinScoreResponse = data;
        this.managerFinScoresFetch.next(this.managerFinScoreResponse);
      },
      error => {
        this.managerFinScoreResponse = [];
        return;
      }
    );
  }

  getManagerProcScores(fromDate, toDate, examinerId, role) {
    const param = {
      fromDate,
      toDate,
      examinerId,
      role
    };
    const url =
      role === "Manager"
        ? "api/resource-dashboard/manager/procedural-score"
        : "api/resource-dashboard/lead/procedural-score";
    this.baseHTTPService.post(param, url).subscribe(
      (data: any) => {
        this.managerProcScoreResponse = data;
        this.managerProcScoresFetch.next(this.managerProcScoreResponse);
      },
      error => {
        this.managerProcScoreResponse = [];
        return;
      }
    );
  }

  getExaminerCount(fromDate, toDate, status) {
    const param = {
      fromDate,
      toDate,
      status
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/lead-count-manager")
      .subscribe(
        data => {
          this.examinerCountResponse = data;
          this.examinerCountFetch.next(this.examinerCountResponse);
        },
        error => {
          this.examinerCountResponse = [];
          return;
        }
      );
  }

  getClaimsOpenInventory(days) {
    const param = {
      days
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/claims-nearing-sla")
      .subscribe(
        data => {
          this.claimsOpenInvResponse = data;
          this.claimsOpenInvFetch.next(this.claimsOpenInvResponse);
        },
        error => {
          this.claimsOpenInvResponse = [];
          return;
        }
      );
  }

  getClaimsThreashold(days) {
    const param = {
      days
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/claims-nearing-sla-threshold")
      .subscribe(
        data => {
          this.claimsThreasholdResponse = data;
          this.claimsThreasholdFetch.next(this.claimsThreasholdResponse);
        },
        error => {
          this.claimsThreasholdResponse = [];
          return;
        }
      );
  }

  getManagerStatusScores(fromDate, toDate, queueName) {
    const param = {
      fromDate,
      toDate,
      queueName
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/claim-queue-count")
      .subscribe(
        (data: any) => {
          this.managerStatusScoreResponse = data;
          this.managerStatusScoresFetch.next(this.managerStatusScoreResponse);
        },
        error => {
          this.managerStatusScoreResponse = [];
          return;
        }
      );
  }

  getLeadStatusScores(fromDate, toDate, queueName) {
    const param = {
      fromDate,
      toDate,
      queueName
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/claim-queue-count-lead")
      .subscribe(
        (data: StatusDate) => {
          this.leadStatusScoreResponse = data;
          this.leadStatusScoresFetch.next(this.leadStatusScoreResponse);
        },
        error => {
          this.leadStatusScoreResponse = [];
          return;
        }
      );
  }

  getLeadExaminerPassFailScores(fromDate, toDate, userGroupId, examinerId) {
    const param = {
      fromDate,
      toDate,
      userGroupId,
      examinerId
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/lead/audit-graph")
      .subscribe(
        (data: StatusDate) => {
          this.leadExaminerPassFailScoreResponse = data;
          this.leadExaminerPassFailScoreFetch.next(
            this.leadExaminerPassFailScoreResponse
          );
        },
        error => {
          this.leadExaminerPassFailScoreResponse = [];
          return;
        }
      );
  }

  getManagerAgeScores(fromDate, toDate, queueNames, status) {
    const param = {
      fromDate,
      toDate,
      queueNames,
      status
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/getClaimsBasedOnAge")
      .subscribe(
        (data: any) => {
          this.managerAgeScoreResponse = data;
          this.managerAgeScoresFetch.next(this.managerAgeScoreResponse);
        },
        error => {
          this.managerAgeScoreResponse = [];
          return;
        }
      );
    // this.managerAgeScoreResponse = [];
  }

  getLeadAgeScores(fromDate, toDate, queueName, status) {
    const param = {
      fromDate,
      toDate,
      queueName,
      status
    };
    this.baseHTTPService
      .post(param, "api/resource-dashboard/claim-age-lead")
      .subscribe(
        (data: StatusDate) => {
          this.leadAgeScoreResponse = data;
          this.leadAgeScoresFetch.next(this.leadAgeScoreResponse);
        },
        error => {
          this.leadAgeScoreResponse = [];
          return;
        }
      );
  }

  getStatusReport(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .getExcel(param, "api/reports/claims-status-report")
      .subscribe(
        data => {
          this.statusReportResponse = data;
          this.statusReportFetch.next(this.statusReportResponse);
        },
        error => {
          this.statusReportResponse = [];
          return;
        }
      );
  }

  getAuditFailedRebuttalReport(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .getExcel(param, "api/reports/rebuttal-status-report")
      .subscribe(
        data => {
          this.rebuttalStatusReportResponse = data;
          this.rebuttalStatusReportFetch.next(
            this.rebuttalStatusReportResponse
          );
        },
        error => {
          this.rebuttalStatusReportResponse = [];
          return;
        }
      );
  }

  getOpenInvReport(payload, type) {
    const url =
      type === "threshold-sla"
        ? "api/resource-dashboard/claims-nearing-sla-threshold/report"
        : "api/resource-dashboard/claims-nearing-sla/report";
    return this.baseHTTPService.getExcel(payload, url);
  }

  getProductivityReport(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .getExcel(param, "api/reports/productivity-report")
      .subscribe(
        data => {
          this.productivityReportResponse = data;
          this.productivityReportFetch.next(this.productivityReportResponse);
        },
        error => {
          this.productivityReportResponse = [];
          return;
        }
      );
  }

  getFinanceReport(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .getExcel(param, "api/reports/financial-score-report")
      .subscribe(
        data => {
          this.financeReportResponse = data;
          this.financeReportFetch.next(this.financeReportResponse);
        },
        error => {
          this.financeReportResponse = [];
          return;
        }
      );
  }

  getAuditReport(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .getExcel(param, "api/reports/quality-score-report")
      .subscribe(
        data => {
          this.auditReportResponse = data;
          this.auditReportFetch.next(this.auditReportResponse);
        },
        error => {
          this.auditReportResponse = [];
          return;
        }
      );
  }

  getProcReport(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    this.baseHTTPService
      .getExcel(param, "api/reports/procedural-score-report")
      .subscribe(
        data => {
          this.procReportResponse = data;
          this.procReportFetch.next(this.procReportResponse);
        },
        error => {
          this.procReportResponse = [];
          return;
        }
      );
  }

  saveAndNavigateToNextClaim(action, routeOrPendDetails) {
    const promise = new Promise((resolve, reject) => {
      let param = {};
      let urlSegment = "";
      if (action === "PENDED") {
        urlSegment = "api/claim/pend";
        param = {
          taskId: this.claimDetails.taskId,
          action,
          pendComments: routeOrPendDetails.pendComments,
          pendReasonCode: routeOrPendDetails.pendReason.value,
          endTimer: this.timer
        };
      }
      if (action === "ROUTED") {
        urlSegment = "api/claim/route";
        param = {
          taskId: this.claimDetails.taskId,
          action,
          routeReasonCode: routeOrPendDetails.routeReason.value,
          routeComments: routeOrPendDetails.routeComments,
          routeUserId: routeOrPendDetails.routeTo.value,
          endTimer: this.timer
        };
      }
      if (action === "COMPLETED") {
        urlSegment = "api/claim/complete";
        param = {
          taskId: this.claimDetails.taskId,
          action,
          endTimer: this.timer
        };
      }
      this.baseHTTPService
        .post(param, urlSegment)
        .toPromise()
        .then(() => {
          this.resetClaimQueue();
          this.getDashboardData();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  resetClaimQueue() {
    clearInterval(this.interval);
    this.resetTaskTimer();
    this.claimDetails = {
      claimId: null,
      claimFactKey: 0,
      taskId: 0,
      claimReceivedDate: null,
      age: 0,
      status: "",
      queueName: "",
      endTimer: "",
      pendReason: "",
      routeReason: "",
      comments: "",
      firstPendDate: null,
      lastPendDate: null
    };
    this.claimDetailsSub.next(this.claimDetails);
    this.headerService.updateClaimDetails(this.claimDetails);
  }

  get currentClaimDetails() {
    return this.claimDetails;
  }

  getAuditClaim() {
    this.baseHTTPService.get("api/audit-mode/audit-claim").subscribe(claim => {
      this.auditClaimDetails = claim;
      this.auditClaimDetailsSub.next(this.auditClaimDetails);
      this.assignAuditTask();
    });
  }

  assignAuditTask() {
    const param = {
      taskAssignmentId: this.auditClaimDetails.taskAssignmentId,
      auditorPrimaryEmail: this.loggedInUserEmail
    };

    this.baseHTTPService
      .post(param, "api/audit-mode/assign-task")
      .subscribe(data => {
        this.assignAuditTaskResponse = data;
      });
  }

  saveAndNavigateToNextAuditClaim(action, timeStamp, comments) {
    const promise = new Promise((resolve, reject) => {
      this.assignAuditTaskResponse[`auditorComments`] = comments;
      this.assignAuditTaskResponse[`auditorAction`] = action;
      this.assignAuditTaskResponse[
        `auditorPrimaryEmail`
      ] = this.loggedInUserEmail;
      this.assignAuditTaskResponse[
        `processorPrimaryEmail`
      ] = this.auditClaimDetails.finalizedBy;
      this.baseHTTPService
        .post(
          this.assignAuditTaskResponse,
          "api/audit-mode/update-auditor-task"
        )
        .toPromise()
        .then(data => {
          this.getAuditClaim();
          this.getDashboardData();
          resolve();
        })
        .catch(err => {
          alert("Something went wrong!");
        });
    });
    return promise;
  }

  savePendReason(pendReason) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(pendReason, "api/configuration/pend/create")
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Pend Reasons Saved Successfully!"
          });
          this.getPendReasonsConfig();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  saveRouteReason(routeReason) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(routeReason, "api/configuration/route/create")
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Route Reasons Saved Successfully!"
          });
          this.getRouteReasonsConfig();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  saveRouteRole(roles) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(roles, "api/configuration/route/options/create")
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

  saveFinancialTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(
          TargetSettingsDetails,
          "api/target-settings/saveFinancialSettings"
        )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getUserTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }
  saveSlaConfig(TargetDetails) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(TargetDetails, "api/manager/configuration/save-claims-sla")
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "SLA target saved successfully!"
          });
          this.getSLAConfig();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateFinancialTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(
          TargetSettingsDetails,
          "api/target-settings/updateFinancialSettings"
        )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target updated successfully!"
          });
          this.getUserTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateSlaConfig(TargetDetails) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(TargetDetails, "api/manager/configuration/update-claims-sla")
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "SLA Target updated successfully!"
          });
          this.getSLAConfig();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  saveProceduralTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(
          TargetSettingsDetails,
          "api/target-settings/saveProceduralSettings"
        )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getUserTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateProceduralTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(
          TargetSettingsDetails,
          "api/target-settings/updateProceduralSettings"
        )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target updated successfully!"
          });
          this.getUserTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  saveProductivityTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(
          TargetSettingsDetails,
          "api/target-settings/saveProductivitySettings"
        )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getUserTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateProductivityTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.baseHTTPService
        .post(
          TargetSettingsDetails,
          "api/target-settings/updateProductivitySettings"
        )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target updated successfully!"
          });
          this.getUserTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  saveTargetSettingsFetch() {
    return this.baseHTTPService.get(`api/userGroup/fetchTargetSettings`);
  }

  getQueueNamesManager(userID) {
    return this.baseHTTPService.get(
      `api/resource-dashboard/queue-name/${userID}`
    );
  }

  getQueueNamesLead(userID) {
    return this.baseHTTPService.get(
      `api/resource-dashboard/queue-name-lead/${userID}`
    );
  }

  modifyUserTarget(searchField: string, searchValue: string) {
    return this.baseHTTPService.get(
      `api/user-management/target/user/details/${searchField}=${searchValue}`
    );
  }

  refreshClaimWorkBasket() {
    return this.baseHTTPService.post({}, "api/data-load/claims");
  }

  getQueueNotification() {
    this.baseHTTPService
      .post({}, "api/data-load/claim-queues")
      .subscribe(() => {
        this.messageService.throwNotification({
          type: "success",
          message: "Claim Queue Notification fetched Successfully!"
        });
      });
  }

  leadModifyUserUpdate(updateRequestBody) {
    return this.baseHTTPService.post(
      { ...updateRequestBody },
      `api/user-management/user/modify/target`
    );
  }

  getDashboardData() {
    this.baseHTTPService.get("api/claim/dashboard").subscribe(data => {
      this.dashboardData = data;
      this.updateUserInfo.next(this.dashboardData);
      return this.dashboardData;
    });
  }

  getReprioritizeClaims() {
    return this.baseHTTPService.get("api/tableData");
  }

  getReprioritizeSearchFields() {
    return [
      { label: "Claim ID", value: "claimId" },
      { label: "Member Name", value: "memberName" },
      { label: "Member ID", value: "memberId" },
      { label: "Provider Name", value: "providerName" },
      { label: "Tax ID", value: "taxId" },
      { label: "Member Group Name", value: "groupName" }
    ];
  }

  getAuditFailedRebuttalAcceptedListner() {
    return this.auditFailedRebuttalAcceptedFetch.asObservable();
  }

  getUnassignedReprioritizeList() {
    return this.baseHTTPService.get("api/claims/unassigned");
  }

  getPriorityListBySearch(param) {
    return this.baseHTTPService.post(param, "api/claims/search/details");
  }

  reprioritizeClaims(param) {
    return this.baseHTTPService.post(param, "api/claims/save/details/priority");
  }

  getManagerClaimsStatus() {
    return this.baseHTTPService.get("api/managerlanding/claimQueue/detail");
  }

  callHealthEdge() {
    return this.baseHTTPService.callHealthEdge("openClaim");
  }

  getReassignmentReasons() {
    return this.baseHTTPService.get("api/configuration/reassignment-reasons");
  }

  addReassignmentReason(reason) {
    const payload = {
      reassignmentReason: reason
    };
    return this.baseHTTPService.post(
      payload,
      "api/configuration/reassignment-reason/create"
    );
  }

  updateReassignmentReason(code, reason) {
    const payload = {
      reassignmentReasonCode: code,
      reassignmentReason: reason
    };
    return this.baseHTTPService.post(
      payload,
      "api/configuration/reassignment-reason/update"
    );
  }

  deleteReassignmentReason(code) {
    return this.baseHTTPService.get(
      `api/configuration/reassignment-reason/delete?reassignmentReasonCode=${code}`
    );
  }

  saveReassignmentReasons(payload) {
    return this.baseHTTPService.post(
      payload,
      "api/configuration/save-reassignment-reasons"
    );
  }

  getAuditFailedRebuttalAccepted(fromDate, toDate) {
    const param = {
      fromDate,
      toDate
    };
    return this.baseHTTPService
      .post(param, "api/resource-dashboard/rebuttal-failed-accepted")
      .subscribe(
        (data: any) => {
          this.auditFailedRebuttalAcceptedResponse = data;
          this.auditFailedRebuttalAcceptedFetch.next(
            this.auditFailedRebuttalAcceptedResponse
          );
        },
        error => {
          this.auditFailedRebuttalAcceptedResponse = [];
          return;
        }
      );
  }

  // refreshMatView() {
  //   this.baseHTTPService
  //     .get("api/refresh/materialized-view")
  //     .subscribe(res => {});
  // }

  uploadFileUserGroups(formData: FormData) {
    return this.baseHTTPService
      .getExcel(formData, `api/imports/import-user-groups`)
      .subscribe(
        data => {
          this.userGrpUploadResponse = data;
          this.userGrpReportFetch.next(this.userGrpUploadResponse);
        },
        error => {
          this.userGrpUploadResponse = [];
          this.userGrpReportFetch.next(null);
          return;
        }
      );
  }

  uploadFileReason(formData: FormData) {
    return this.baseHTTPService
      .getExcel(formData, `api/imports/import-reasons`)
      .subscribe(
        data => {
          this.reasonUploadResponse = data;
          this.reasonReportFetch.next(this.reasonUploadResponse);
        },
        error => {
          this.reasonUploadResponse = [];
          this.reasonReportFetch.next(null);
          return;
        }
      );
  }

  uploadFileReasonTemplate() {
    return this.baseHTTPService
      .getBlob(`api/imports/import-reasons/template`)
      .subscribe(
        data => {
          this.uploadFileReasonTemplateResponse = data;
          this.uploadFileReasonTemplateFetch.next(
            this.uploadFileReasonTemplateResponse
          );
        },
        error => {
          this.uploadFileReasonTemplateResponse = [];
          this.reasonReportFetch.next(null);
          return;
        }
      );
  }

  userGrpUploadTemplate() {
    return this.baseHTTPService
      .getBlob(`api/imports/import-user-groups/template`)
      .subscribe(
        data => {
          this.userGrpUploadTemplateResponse = data;
          this.userGrpUploadTemplateFetch.next(
            this.userGrpUploadTemplateResponse
          );
        },
        error => {
          this.userGrpUploadTemplateResponse = [];
          this.userGrpUploadTemplateFetch.next(null);
          return;
        }
      );
  }

  userUploadTemplate() {
    return this.baseHTTPService
      .getBlob(`api/imports/import-users/template`)
      .subscribe(
        data => {
          this.userUploadTemplateResponse = data;
          this.userUploadTemplateFetch.next(this.userUploadTemplateResponse);
        },
        error => {
          this.userUploadTemplateResponse = [];
          this.userUploadTemplateFetch.next(null);
          return;
        }
      );
  }

  uploadFileUsers(formData: FormData) {
    return this.baseHTTPService
      .getExcel(formData, `api/imports/import-users`)
      .subscribe(
        data => {
          this.userUploadResponse = data;
          this.userReportFetch.next(this.userUploadResponse);
        },
        error => {
          this.userUploadResponse = [];
          this.userReportFetch.next(null);
          return;
        }
      );
  }

  getLowPerExaminers(fromDate, toDate, role) {
    const param = {
      fromDate,
      toDate
    };
    const url =
      role === "Manager"
        ? "api/resource-dashboard/low-performing-examiners-under-manager"
        : "api/resource-dashboard/low-performing-examiners-under-lead";

    this.baseHTTPService.post(param, url).subscribe(
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
    const url =
      role === "Manager"
        ? "api/resource-dashboard/high-performing-examiners-under-manager"
        : "api/resource-dashboard/high-performing-examiners-under-lead";

    this.baseHTTPService.post(param, url).subscribe(
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

  getAssignedDetails() {
    return this.baseHTTPService.get("api/claim/assigned/list");
  }

  repioritizeAssign(payload, reprioritize: boolean) {
    return this.baseHTTPService.post(
      payload,
      `api/claims/${reprioritize ? "prioritize/" : ""}assign`
    );
  }

  completeRouteClaim(formValue) {
    const promise = new Promise((resolve, reject) => {
      const param = {
        taskId: this.claimDetails.taskId,
        action: "COMPLETE_AND_ROUTE",
        routeComments: formValue.remarks,
        routeReasonCode: Number(formValue.routeReason),
        endTimer: this.timer
      };
      this.baseHTTPService
        .post(param, "api/claim/complete-route")
        .toPromise()
        .then(() => {
          this.resetClaimQueue();
          this.getDashboardData();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  clientVendorQueue() {
    return this.baseHTTPService.get(
      "api/claim/lead/client-vendor-queue/detail"
    );
  }

  getAllSendBackReasons() {
    return this.baseHTTPService.get("api/configuration/send-back-reasons");
  }

  addSendBackReason(reason) {
    const payload = {
      sendBackReason: reason
    };
    return this.baseHTTPService.post(
      payload,
      "api/configuration/send-back-reason/create"
    );
  }

  deleteSendBackReason(id) {
    return this.baseHTTPService.get(
      `api/configuration/send-back-reason/delete?sendBackReasonCode=${id}`
    );
  }

  updateSendBackReason(reason, code) {
    const payload = {
      sendBackReasonCode: code,
      sendBackReason: reason
    };
    return this.baseHTTPService.post(
      payload,
      "api/configuration/send-back-reason/create"
    );
  }
}
