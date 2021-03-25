import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { SelectItem, ConfirmationService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { ClaimRoutingService } from "../claim-routing.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-route-claim-overlay",
  templateUrl: "./route-claim-overlay.component.html"
})
export class RouteClaimOverlayComponent implements OnInit, OnChanges {
  routeRoleOptions: any;
  claimRouteForm: FormGroup;
  routeRoles: SelectItem[];
  roleSelected: any;
  routeToList: SelectItem[];
  routeReasons: SelectItem[];
  @Output()
  processComplete: EventEmitter<boolean> = new EventEmitter(false);
  @Input()
  claimDetails: any;
  @Input()
  isClient: boolean;
  constructor(
    private fb: FormBuilder,
    private taskManagementService: TaskmanagementService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private claimRouteService: ClaimRoutingService,
    private messageService: NotifierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.claimDetails = { ...params };
      // Initialize form
      if (this.claimDetails && this.claimDetails.params) {
        this.initializeForm(this.claimDetails.params);
      }
    });
    if (this.claimDetails) {
      this.initializeForm(this.claimDetails);
    }
    // Drop Dwons
    this.getRouteRoles();
    this.getRouteReasons();
  }

  ngOnChanges() {
    if (this.claimDetails && this.claimDetails.claimId) {
      this.initializeForm(this.claimDetails);
    }
  }

  getRouteRoles() {
    this.taskManagementService.getRouteRoles();
    this.routeRoles = this.mapRouteRoles(
      this.taskManagementService.routeRoleResponse
    );
    this.taskManagementService.getRouteRolesListner().subscribe(data => {
      this.routeRoles = this.mapRouteRoles(data);
    });
  }

  mapRouteRoles(data: any = []) {
    const routeRoles: SelectItem[] = [];
    data.forEach(element => {
      const { routeRoleId, routeRoleName } = element;
      routeRoles.push({ value: routeRoleId, label: routeRoleName });
    });
    return routeRoles;
  }

  mapRouteToOptions(data: any = []) {
    const routeTo: SelectItem[] = [];
    data.forEach(element => {
      const { routeUserId, routeUserName } = element;
      routeTo.push({ value: routeUserId, label: routeUserName });
    });
    return routeTo;
  }

  mapRouteReasons(data: any = []) {
    const routeTo: SelectItem[] = [];
    data.forEach(element => {
      const { routeReason, routeReasonCode } = element;
      routeTo.push({ value: routeReasonCode, label: routeReason });
    });
    return routeTo;
  }

  initializeForm(claimDetails) {
    const {
      claimId,
      age,
      queueName,
      routeFrom,
      routeDate,
      routeReason,
      taskId,
      endTimer,
      comments
    } = claimDetails;
    let groupInfo: any = {
      taskId: [taskId, Validators.required],
      claimID: [claimId, Validators.required],
      claimAge: [age, Validators.required],
      queueName: [queueName, Validators.required],
      routeFrom: [routeFrom, Validators.required],
      routeDate: [routeDate, Validators.required],
      endTimer: [endTimer],
      routedReason: [routeReason, Validators.required],
      previousComments: [comments],
      routeReason: ["", Validators.required],
      routeComments: ["", Validators.required]
    };
    if (!this.isClient) {
      groupInfo = {
        ...groupInfo,
        routeRole: ["", Validators.required],
        routeTo: ["", Validators.required],
      };
    }
    this.claimRouteForm = this.fb.group(groupInfo);
  }

  setRoleSelected(val) {
    this.roleSelected = val;
    this.getRouteTo(val);
  }

  getRouteTo(roleId) {
    const { taskId } = this.claimDetails.claimId ? this.claimDetails : this.claimDetails.params;
    const payload = {
      toRoleId: roleId,
      taskId
    };
    this.taskManagementService.getLeadRouteUser(payload);
    this.routeToList = this.mapRouteToOptions(
      this.taskManagementService.routeUserResponse
    );
    this.taskManagementService.getLeadRouteUserListener().subscribe(data => {
      this.routeToList = this.mapRouteToOptions(data);
    });
  }

  getRouteReasons() {
    this.claimRouteService.getRouteReasons().subscribe(res => {
      this.routeReasons = this.mapRouteReasons(res);
    });
  }

  submit() {
    let param: any = {
      taskId: this.claimRouteForm.value.taskId,
      action: "ROUTED",
      routeReasonCode: this.claimRouteForm.value.routeReason,
      routeComments: this.claimRouteForm.value.routeComments
    };
    if (!this.isClient) {
      param = {
        ...param,
        routeUserId: this.claimRouteForm.value.routeTo
      };
    }
    this.claimRouteService
      .route(param, this.isClient)
      .then(() => {
        this.messageService.throwNotification({
          type: "success",
          message: `Claim ${this.isClient ? 'Routed to Client/Vendor Queue' : 'Routed'} Successfully`
        });
        this.processComplete.emit(true);
        if (!this.claimDetails.claimId) {
          this.router.navigateByUrl("/ClaimRouting");
        }
      })
      .catch(() => {
        if (!this.claimDetails.claimId) {
          this.router.navigateByUrl("/ClaimRouting");
        }
      });
  }

  confirmCancel() {
    if (!this.claimDetails.claimId) {
      this.confirmationService.confirm({
        message: "Are you sure that you want to cancel changes?",
        accept: () => {
          this.cancelChanges();
        }
      });
    } else {
      this.cancelChanges();
    }
  }

  cancelChanges() {
    this.initializeForm(this.claimDetails);
    this.processComplete.emit(false);
  }

  getFormControl(controlName) {
    return this.claimRouteForm.get(controlName);
  }
}
