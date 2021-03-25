import { Component, OnInit, HostListener } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "src/app/services/notifier.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DrawClaim } from "src/app/services/task-management/models/DrawClaim";
import {
  ConfirmationService,
  MessageService
} from "primeng/components/common/api";
import { UserDashboard } from "../../services/task-management/models/UserDashboard";
import { HttpClient } from "@angular/common/http";
import { AuditorService } from "src/app/services/auditor/auditor.service";

@Component({
  selector: "app-draw-mode",
  templateUrl: "./draw-mode.component.html",
  providers: [ConfirmationService]
})
export class DrawModeComponent implements OnInit {
  private taskTimerSubscription: Subscription;
  action: any;
  routeRoleOptions: any;
  routeToOptions: any;
  pendReasonOptions: any;
  routeReasonOptions: any;
  isSelected = true;
  isPend = false;
  dialogHeader = "";
  isRoute = false;
  roleSelected = false;
  display = false;
  displayFinalizeDialog = false;
  displayDenyDialog = false;
  pendReasonList = Array<{ pendReasonCode: number; pendReason: string }>();
  routeRoleList = Array<{ routeRoleId: number; routeRoleName: string }>();
  toggleStateClaimDetails = false;
  routeReasonList = Array<{ routeReasonCode: number; routeReason: string }>();
  routeToList = Array<{ routeUserId: number; routeUserName: string }>();
  form = new FormGroup({
    pendReason: new FormControl(""),
    pendComments: new FormControl(""),
    routeComments: new FormControl(""),
    routeRole: new FormControl(""),
    routeTo: new FormControl(""),
    routeReason: new FormControl(""),
    remarks: new FormControl("")
  });

  sub: Subscription;
  selectedTaskId: number;
  FilterBy: string;
  selectedClaimStatus: string;
  auditFailedCount: any;
  reviewRebuttalCount = 0;
  public isCompleteRoute: boolean;

  constructor(
    private taskManagementService: TaskmanagementService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private toastService: NotifierService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private auditService: AuditorService
  ) {}
  // These are important variables
  pause = false;
  userDashboardValues: UserDashboard;
  timer = "00:00:00";
  timerColor = "#00bf96";
  timerFadeColor = "#00816a";
  claimDetails: DrawClaim;
  showCompleteClaimModal = false;
  private claimDetailsSubscription: Subscription;

  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(event) {
    return false;
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.selectedTaskId = params.taskId || null;
      this.selectedClaimStatus = params.status || null;
    });

    this.getPendReasons();
    this.getRouteReasons();
    this.getRouteRole();
    this.getTaskData();
    this.getAuditFailedCount();
    this.gerReviewRebutCount();
    this.pause = this.taskManagementService.pauseValue;
    this.timer = this.taskManagementService.timerValue;
    this.timerColor = this.taskManagementService.timerColorValue;
    this.timerFadeColor = this.taskManagementService.timerFadeColorValue;
    this.claimDetails = this.taskManagementService.claimDetails;

    if (this.selectedTaskId !== null && this.selectedClaimStatus !== null) {
        this.taskManagementService.getClaim(
          this.selectedTaskId,
          this.selectedClaimStatus
        );
    }

    // tslint:disable-next-line: no-angle-bracket-type-assertion
    // (<any>$("[data-toggle=tooltip")).tooltip();
    this.taskTimerSubscription = this.taskManagementService
      .getTaskTimerListener()
      .subscribe(
        (timerDetails: {
          timer: string;
          timerColor: string;
          timerFadeColor: string;
        }) => {
          this.timer = timerDetails.timer;
          this.timerColor = timerDetails.timerColor;
          this.timerFadeColor = timerDetails.timerFadeColor;
        }
      );

    this.claimDetails = this.taskManagementService.claimDetails;
    this.selectedTaskId = this.claimDetails ? this.claimDetails.taskId : null;
    // Getting Claim Details
    this.claimDetailsSubscription = this.taskManagementService
      .getClaimDetailsListener()
      .subscribe((claimDetails: DrawClaim) => {
        this.getTaskData();
        this.claimDetails = claimDetails;
        this.toggleStateClaimDetails = false;
        this.selectedTaskId = claimDetails.taskId;
      });
  }

  getTaskData() {
    this.taskManagementService.getDashboardData();
    this.userDashboardValues = this.taskManagementService.dashboardData;
    this.taskManagementService
      .updateUserInfoListener()
      .subscribe((userDashboardValues: UserDashboard) => {
        this.userDashboardValues = userDashboardValues;
      });
  }

  getAuditFailedCount() {
    this.auditService.getAuditFailedCount().subscribe(res => {
      this.auditFailedCount = res.auditFailed;
    });
  }
  gerReviewRebutCount() {
    this.auditService.gerReviewRebutCount().subscribe(res => {
      this.reviewRebuttalCount = res.reviewRebut;
    });
  }

  targetClick(FilterBy) {
    this.router.navigate(["/MyClaims"], {
      queryParams: { FilterBy },
      skipLocationChange: true
    });
  }

  enlargeComment() {
    this.popupMessage(this.claimDetails.comments);
  }

  popupMessage(val) {
    this.confirmationService.confirm({
      message: val,
      header: "Comments",
      icon: "pi pi-exclamation-triangle",
      acceptVisible: false,
      rejectLabel: "Close"
    });
  }

  onSelectRole() {
    const role = this.form.get("routeRole").value;
    this.getRouteTo(role.value, this.selectedTaskId);
  }

  showDialog() {
    this.display = true;
  }

  confirm(action) {
    this.confirmationService.confirm({
      accept: () => {
        this.triggerClaimCompletion(action);
      }
    });
  }

  get updatedComments() {
    let comments: any;
    if (this.isRoute) {
      const routeReason = this.form.get("routeReason").value;
      comments = {
        routeReason: routeReason.value,
        routeComments: this.form.get("routeComments").value
      };
    } else {
      const pendReason = this.form.get("pendReason").value;
      comments = {
        pendReason: pendReason.value,
        pendComments: this.form.get("pendComments").value
      };
    }
    return comments;
  }

  toggleClaimDetails() {
    this.toggleStateClaimDetails = !this.toggleStateClaimDetails;
  }

  getPendReasons() {
    this.pendReasonOptions = [];
    this.pendReasonList = [];
    this.taskManagementService.getPendReasons();
    this.pendReasonList = this.taskManagementService.pendReasonResponse;
    this.taskManagementService.getPendReasonsListner().subscribe(data => {
      this.pendReasonList = data;
      this.pendReasonList.forEach(s => {
        this.pendReasonOptions.push({
          name: s.pendReason,
          value: s.pendReasonCode
        });
      });
    });
  }

  getRouteReasons() {
    this.routeReasonOptions = [];
    this.routeReasonList = [];
    this.taskManagementService.getRouteReasons();
    this.routeReasonList = this.taskManagementService.routeReasonResponse;
    this.taskManagementService.getRouteReasonsListner().subscribe(data => {
      this.routeReasonList = data;
      this.routeReasonList.forEach(s => {
        this.routeReasonOptions.push({
          name: s.routeReason,
          value: s.routeReasonCode
        });
      });
    });
  }

  getRouteTo(roleId, taskId) {
    this.taskManagementService.getRouteUser(roleId, taskId);
    this.routeToList = this.taskManagementService.routeUserResponse;
    this.taskManagementService.getRouteUserListener().subscribe(data => {
      this.routeToList = [];
      this.routeToList = data;
      this.routeToOptions = [];
      this.roleSelected = false;
      this.routeToList.forEach(s => {
        this.routeToOptions.push({
          name: s.routeUserName,
          value: s.routeUserId
        });
      });
      this.roleSelected = this.routeToOptions.length > 0 ? true : false;
    });
  }

  getRouteRole() {
    this.routeRoleOptions = [];
    this.routeRoleList = [];
    this.taskManagementService.getRouteRoles();
    this.routeRoleList = this.taskManagementService.routeRoleResponse;
    this.taskManagementService.getRouteRolesListner().subscribe(data => {
      this.routeRoleList = data;
      this.routeRoleList.forEach(s => {
        this.routeRoleOptions.push({
          name: s.routeRoleName,
          value: s.routeRoleId
        });
      });
    });
  }

  setPause() {
    this.pause = !this.pause;
    if (this.pause) {
      this.taskManagementService.pauseTimer();
    } else {
      this.taskManagementService.startTimer();
      this.taskTimerSubscription.add();
    }
  }

  reset() {
    this.isSelected = true;
    this.form.patchValue({
      pendComments: "",
      routeComments: "",
      pendReason: "",
      remarks: ""
    });
  }

  setRequiredFieldvalidators(value) {
    this.form.controls[`remarks`].setValidators(null);
    if (value === "PENDED") {
      this.form.controls[`pendReason`].setValidators([Validators.required]);
      this.form.controls[`routeReason`].setValidators(null);
      this.form.controls[`routeRole`].setValidators(null);
      this.form.controls[`routeTo`].setValidators(null);
    } else if (value === `ROUTED`) {
      this.form.controls[`routeReason`].setValidators([Validators.required]);
      this.form.controls[`routeRole`].setValidators([Validators.required]);
      this.form.controls[`routeTo`].setValidators([Validators.required]);
      this.form.controls[`pendReason`].setValidators(null);
    } else if (value === `COMPLETANDROUTE`) {
      this.form.controls[`pendReason`].setValidators(null);
      this.form.controls[`routeReason`].setValidators([Validators.required]);
      this.form.controls[`routeRole`].setValidators(null);
      this.form.controls[`routeTo`].setValidators(null);
      this.form.controls[`remarks`].setValidators([Validators.required]);
    } else {
      this.form.controls[`pendReason`].setValidators(null);
      this.form.controls[`routeReason`].setValidators(null);
      this.form.controls[`routeRole`].setValidators(null);
      this.form.controls[`routeTo`].setValidators(null);
    }
    this.form.controls[`pendReason`].updateValueAndValidity();
    this.form.controls[`routeReason`].updateValueAndValidity();
    this.form.controls[`routeRole`].updateValueAndValidity();
    this.form.controls[`routeTo`].updateValueAndValidity();
  }

  setAction(value) {
    this.form.reset();
    this.reset();
    this.roleSelected = false;
    this.setRequiredFieldvalidators(value);
    if (value === "PENDED") {
      this.isPend = true;
      this.dialogHeader = "Pend My Task?";
      this.isRoute = false;
      this.isCompleteRoute = false;
      this.showDialog();
    } else if (value === "ROUTED") {
      this.isRoute = true;
      this.dialogHeader = "Route My Task?";
      this.isPend = false;
      this.isCompleteRoute = false;
      this.showDialog();
    } else if (value === "COMPLETANDROUTE") {
      this.isRoute = false;
      this.dialogHeader = "Complete & Route My Task?";
      this.isPend = false;
      this.isCompleteRoute = true;
    } else {
      this.isCompleteRoute = false;
      this.isRoute = false;
      this.isPend = false;
    }
    if (this.pause) {
      this.toastService.throwNotification({
        type: "warning",
        message: "Please resume your Task first"
      });
      return;
    }
    this.action = value;
    this.displayFinalizeDialog =
      this.action === "COMPLETED" && !this.pause ? true : false;
  }

  justCopy(inputElement) {
    this.copyToClipBoard(inputElement);
    this.displayCopySuccess();
  }

  copyAndOpenHRP(inputElement) {
    this.copyToClipBoard(inputElement);
    this.openHealthEdgeApp();
  }

  copyToClipBoard(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
    /* const range = document.createRange();
    range.selectNode(document.getElementById(inputElement));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); */
  }

  displayCopySuccess() {
    this.toastService.throwNotification({
      type: "success",
      message: "Claim ID copied"
    });
    /* this.http
      .get(environment.HEALTH_EDGEURL + "/" + "status")
      .subscribe(res => { }); */
  }

  openHealthEdgeApp() {
    this.taskManagementService.callHealthEdge().subscribe(res => {
      if (res.status === "Failure") {
        this.toastService.throwNotification({
          type: "error",
          message: res.message
        });
      }
    });
  }

  triggerClaimCompletion(action) {
    this.display = false;
    this.taskManagementService
      .saveAndNavigateToNextClaim(action, this.form.value)
      .then(() => {
        this.form.reset();
        this.reset();
        /* this.app.showSuccess(
          "Claim(s) moved to " + action + " status successfully!!",
          "SUCCESS"
        ); */
        this.messageService.add({
          key: "successKey",
          severity: "success",
          summary: "SUCCESS",
          detail: "Claim(s) moved to " + action + " status successfully!!"
        });
        this.hideFinalizeDialog();
      })
      .catch(e => {
        /* this.app.showFailure(
          "Claim(s) falied moving to " + action + " status!!",
          "WARNING"
        ); */
        this.messageService.add({
          key: "custom",
          severity: "warn",
          summary: "WARNING",
          detail: "Claim(s) falied moving to " + action + " status!!"
        });
      });
  }

  getNextClaim() {
    if (this.claimDetails.claimId === null) {
      this.taskManagementService.getClaim();
    } else {
      this.toastService.throwNotification({
        type: "warning",
        message: "Claim is already loaded"
      });
    }
  }

  hideFinalizeDialog() {
    this.displayFinalizeDialog = false;
    this.isCompleteRoute = false;
  }

  hideDenyDialog() {
    this.displayDenyDialog = false;
  }

  completeRoute() {
    this.display = false;
    this.taskManagementService
      .completeRouteClaim(this.form.value)
      .then(() => {
        this.form.reset();
        this.reset();
        this.messageService.add({
          key: "successKey",
          severity: "success",
          summary: "SUCCESS",
          detail: "Claim(s) moved to Complete & Routed status successfully!!"
        });
        this.hideFinalizeDialog();
      })
      .catch(err => {
        this.messageService.add({
          key: "custom",
          severity: "warn",
          summary: "WARNING",
          detail: "Claim(s) falied moving to Complete & Routed status!!"
        });
      });
  }
}

class BreakReasons {
  value: number;
  label: string;
}
