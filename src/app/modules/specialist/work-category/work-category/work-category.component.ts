import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { Router, ActivatedRoute } from "@angular/router";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { HeaderService } from "src/app/services/header/header.service";
import { WorkCategory } from "src/app/modules/admin/configuration/modal";
import { ConfirmationService } from "primeng/api";
import { CanComponentDeactivate } from "src/app/guards/route.guard/can-deactivate.gaurd";
import { Subscription } from "rxjs";

@Component({
  selector: "app-work-category",
  templateUrl: "./work-category.component.html",
  styleUrls: ["./work-category.component.css"]
})
export class WorkCategoryComponent implements OnInit, CanComponentDeactivate, OnDestroy {
  public ticketDetails: any;
  public requestType: number;
  public requestTypeSub: Subscription;
  public cols: any[];
  public isComplete: boolean;
  public isRoute: boolean;
  public taskId = null;
  public isPend: boolean;
  public statusCount: any;
  public requestTypes: any[];
  public routeReasons: any[];
  public pendReasons: any[];
  public endTimer: string;
  private interval: NodeJS.Timer;
  private timerRedColor = "#bf0000";
  private timerAmberColor = "#FFBF00";
  public timerColor = "#00bf96";
  public type = "";
  public completeForm: FormGroup;
  public pendForm: FormGroup;
  public routeForm: FormGroup;
  public transactionCategories: any;
  public actionPerforming: boolean;
  public leadNames: any;
  public routeRoles: any[];
  public transactionTypes: any;

  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler($event) {
    $event.preventDefault();
    if (this.ticketDetails) {
      $event.returnValue = "Are you sure?";
    }
  }

  constructor(
    private toastService: NotifierService,
    private taskManagementService: TaskmanagementService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private enrollmentService: EnrollmentManagementService,
    private headerService: HeaderService,
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private activatedRouter: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {}

  canDeactivate() {
    if (this.ticketDetails && this.ticketDetails.taskAssignmentId) {
      this.confirmationService.confirm({
        message: "Please Complete/Pend/Route the task before you proceed",
        acceptLabel: "OK",
        rejectVisible: false
      });
      return false;
    } else {
      return true;
    }
  }

  ngOnInit() {
    // this.requestType = this.activatedRouter.snapshot.queryParamMap.get('type') || "";
    this.requestTypeSub = this.activatedRouter.queryParams.subscribe(params => {
      this.taskId = params.taskId || null;
      this.type = params.type || "";
    });
    this.initiateCategory();

    if (this.taskId && this.type !== "") {
      this.getMemberDetailsById();
    }
  }

  private initiateCategory() {
    this.setCols();
    this.getStatusCount();
    this.getRequestType();
    this.getDropdownValues();
    this.setupForms();
  }

  setCols() {
    this.cols = [
      { header: "Subscriber Name", field: "subscriberName" },
      { header: "Member Group Name/ID", field: "memberGroup" },
      { header: "Member Last Name", field: "memberLastName" },
      { header: "Member First Name", field: "memberFirstName" },
      { header: "Member DOB", field: "memberDob" },
      { header: "Relation To Subsriber", field: "subscriberRelationship" },
      { header: "Report Date", field: "reportDate" },
      { header: "Record Age (In Days)", field: "workBasketDays" },
      { header: "Error Details", field: "errorDescription" }
    ];
    // if (this.requestType.type === "Workbasket") {
    if (this.type === "Workbasket") {
      this.cols = [
        { header: "Transaction Type", field: "transactionType" },
        ...this.cols
      ];
    } else {
      this.cols = [{ header: "Priority", field: "priority" }, ...this.cols];
    }
  }

  setupForms() {
    this.completeForm = this.fb.group({
      transactionTypeCode: ["", [Validators.required]],
      transactionCategoryCode: ["", [Validators.required]],
      transactionCount: [1, [Validators.required]],
      comment: ["", [Validators.required]]
    });
    this.pendForm = this.fb.group({
      pendReasonCode: ["", [Validators.required]],
      pendComment: ["", [Validators.required]]
    });
    this.initiateRouteForm();
  }

  initiateRouteForm() {
    this.routeForm = this.fb.group({
      action: ["ROUTED"],
      toRoleId: ["", [Validators.required]],
      routeUserId: ["", [Validators.required]],
      routeReasonCode: ["", [Validators.required]],
      routeComments: ["", [Validators.required]]
    });
  }

  getStatusCount() {
    this.enrollmentService
      .getSpecialistStatusCount(this.type)
      .subscribe(res => {
        this.statusCount = res;
      });
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
  }

  displayCopySuccess() {
    this.toastService.throwNotification({
      type: "success",
      message: "Subscription ID Copied"
    });
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

  targetClick(url) {
    this.router.navigate([url], {
      queryParams: { type: this.type }
    });
  }

  getRequestType() {
    this.enrollmentService.getUserWorkItemTypes().subscribe(res => {
      this.requestTypes = res ? res : [];
      if (this.type) {
        const filtered = this.requestTypes.filter(
          e => String(e.name).indexOf(this.type) > -1
        );
        this.requestType = filtered.length > 0 ? filtered[0].id : 0;
      }
    });
  }

  getDropdownValues() {
    this.enrollmentService.getPendReasons().subscribe(res => {
      this.pendReasons = res || [];
    });
    this.enrollmentService.getRouteReasons().subscribe(res => {
      this.routeReasons = res || [];
    });
    this.enrollmentService.getTransactionCategories().subscribe(res => {
      this.transactionCategories = res || [];
    });
    this.enrollmentService.getTransactionTypes().subscribe(res => {
      this.transactionTypes = res || [];
    });
    this.enrollmentService.getRouteRoleList().subscribe(res => {
      this.routeRoles = res || [];
    });
  }

  getMemberDetails() {
    this.ticketDetails = null;
    this.enrollmentService.getMemberDetails(this.type).subscribe(res => {
      if (res) {
        this.getStatusCount();
        this.ticketDetails = res;
        this.startTimer(res);
        this.headerService.updateClaimDetails(this.ticketDetails);
      }
    });
  }

  getMemberDetailsById() {
    this.ticketDetails = null;
    this.enrollmentService.getMemberDetailsById(this.taskId).subscribe(res => {
      if (res) {
        this.getStatusCount();
        this.ticketDetails = res;
        this.startTimer(res);
        this.headerService.updateClaimDetails(this.ticketDetails);
      }
    });
  }

  getLeadNames() {
    const formValue = this.routeForm.value;
    const payload = {
      taskId: this.ticketDetails.taskAssignmentId,
      toRoleId: Number(formValue.toRoleId)
    };
    this.leadNames = [];
    this.enrollmentService.getUserNames(payload).subscribe(res => {
      this.leadNames = res || [];
    });
  }

  startTimer(val) {
    this.endTimer = (val && val.endTimer) || "00:00:00";
    if (val && val.taskAssignmentId) {
      const timeValues = this.endTimer.split(":");
      let seconds = timeValues[2];
      let minutes = timeValues[1];
      let hours = timeValues[0];
      const secFn = e => {
        seconds = `0${e - 60}`;
        minutes = String(Number(minutes) + 1);
      };
      const minFn = e => {
        minutes = `0${e - 60}`;
        hours = String(Number(hours) + 1);
      };
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        const sec = Number(seconds) + 1;
        sec < 10
          ? (seconds = `0${sec}`)
          : sec > 59
          ? secFn(sec)
          : (seconds = String(sec));
        const min = Number(minutes);
        if (min < 10) {
          minutes = `0${min}`;
        } else if (min > 59) {
          minFn(min);
        }
        this.endTimer = `${hours}:${minutes}:${seconds}`;
        if (
          Number(hours) >= 1 ||
          Number(minutes) >= 1 ||
          Number(seconds) >= 30
        ) {
          this.timerColor = this.timerRedColor;
        } else if (Number(seconds) >= 20 && Number(seconds) < 30) {
          this.timerColor = this.timerAmberColor;
        } else {
          this.timerColor = "#00bf96";
        }
      }, 1000);
    }
  }

  private resetData() {
    this.ticketDetails = null;
    this.isComplete = false;
    this.isPend = false;
    this.isRoute = false;
    this.headerService.updateClaimDetails(null);
    this.routeForm.reset();
    this.initiateRouteForm();
    this.completFormClear();
    clearInterval(this.interval);
    this.endTimer = "00:00:00";
    this.timerColor = "#00bf96";
  }

  public completFormClear() {
    this.completeForm.reset();
    this.completeForm.patchValue({
      transactionCount: 1
    });
  }

  getCompleteControl(contolName) {
    return this.completeForm.get(contolName);
  }

  getPendControl(contolName) {
    return this.pendForm.get(contolName);
  }

  getRouteControl(contolName) {
    return this.routeForm.get(contolName);
  }

  performAction(action: string) {
    const verbForm = action.toLowerCase();
    const form: FormGroup = this[`${verbForm}Form`];
    if (form.invalid) {
      return;
    }
    const payload = {
      [verbForm === "route" ? "taskId" : "taskAssignmentId"]: this.ticketDetails
        .taskAssignmentId,
      ...form.value,
      endTimer: this.endTimer
    };
    this.actionPerforming = true;
    this.enrollmentService[`specialist${action}Task`](payload).subscribe(
      res => {
        this.actionPerforming = false;
        this.notifierService.throwNotification({
          type: "success",
          message: `Task ${verbForm}${
            verbForm === "pend" ? "ed" : "d"
          } successfully.`
        });
        this.resetData();
        this.getStatusCount();
      },
      err => {
        this.actionPerforming = false;
      }
    );
  }

  updateType() {
    const filtered = this.requestTypes.filter(
      e => e.id === Number(this.requestType)
    );
    this.type = filtered[0].name;
    if (this.canDeactivate()) {
      this.initiateCategory();
    }
  }

  ngOnDestroy() {
    this.resetData();
  } 

  preventInput(event) {
    const val = event.target.value;
    this.completeForm.patchValue({
      transactionCount: val.replace(/[^0-9]/g, '')
    });
    if (val !== null && val !== '' && (val == 0 || Number(val) < 1)) {
      this.completeForm.patchValue({
        transactionCount: 1
      });
    }
  }
}
