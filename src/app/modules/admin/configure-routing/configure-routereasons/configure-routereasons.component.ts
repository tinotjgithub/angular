import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
import { Table } from "primeng/table";
import { NotifierService } from "src/app/services/notifier.service";
import { Subscription, Subject } from "rxjs";
import { TaskmanagementService } from "./../../../../services/task-management/taskmanagement.service";
import { RouteReason } from "./../../../../services/task-management/models/RouteReason";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ActivatedRoute } from "@angular/router";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { ConfirmationService } from "primeng/api";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ROLES } from "src/app/shared/constants.js";
@Component({
  selector: "app-configure-routereasons",
  templateUrl: "./configure-routereasons.component.html"
})
export class ConfigureRoutereasonsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("routeReasonTable", { static: false }) routeReasonTable: Table;
  cols = [];
  addedCount: number;
  routeReasonListCopy = Array<RouteReason>();
  reasonCopy = Array<RouteReason>();
  routeReasonArray: { [s: string]: RouteReason } = {};
  routeList = [];
  private finalArray = { routeReasonDtos: Array<RouteReason>() };
  private routeSubscription: Subscription = new Subscription();
  public routeReasonGroup: FormGroup;
  public isValid = true;
  public isUpdated = false;
  public isRouteReasonPresent = true;
  public isRouteReasonRendered = false;
  routeReasonList = Array<RouteReason>();
  public deletedItems = Array<RouteReason>();
  public currentRole: string;
  public isEnrollment: boolean;
  public roleList: any[];
  public managerType$: Subject<any>;
  public managrType = "";
  constructor(
    private authService: AuthenticationService,
    private notifierServices: NotifierService,
    private fbReason: FormBuilder,
    private taskManagementService: TaskmanagementService,
    private secureLocalStorage: CryptoService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private enrollmentService: EnrollmentManagementService
  ) {
    this.routeReasonGroup = fbReason.group({
      role: ["", Validators.required],
      routeReason: ["", this.checkIfEmptyOrNullValidator]
    });
  }

  ngOnInit() {
    this.currentRole = this.secureLocalStorage.getItem("roleId");
    if (this.currentRole === ROLES.manager) {
      this.managrType = this.authService.managerType;
      this.setData();
      this.getManagerValues();
    } else {
      this.managrType = null;
      this.isEnrollment =
        this.activatedRoute.snapshot.queryParamMap.get("type") === "enrollment";
      this.setData();
    }
  }

  private getService() {
    return this.currentRole === ROLES.manager
      ? this.managrType === "enrollment"
        ? this.enrollmentService
        : this.taskManagementService
      : this.isEnrollment
      ? this.enrollmentService
      : this.taskManagementService;
  }

  /* setManagerRole() {
    this.getService() =
      this.managrType === "enrollment"
        ? this.enrollmentService
        : this.taskManagementService;
    this.setData();
  }

  setService() {
    this.isEnrollment =
      this.activatedRoute.snapshot.queryParamMap.get("type") === "enrollment";
    this.setData();
  } */

  setData() {
    this.getTableColumns();
    this.getRoles();
    this.getRouteReasons();
  }

  getManagerValues() {
    this.managerType$ = this.authService.managerTypeSubject;
    this.managerType$.subscribe(val => {
      this.managrType = val;
      this.setData();
    });
  }

  getRoles() {
    this.roleList = [];
    const service = this.getService();
    service.getRolesToRoute();
    this.routeList = service.rolesToRouteResponse
      ? service.rolesToRouteResponse.roles
      : [];
    service.getRolesToRouteListner().subscribe(data => {
      this.roleList = data ? data.roles : [];
    });
  }

  checkIfEmptyOrNullValidator(control: AbstractControl) {
    const value = control.value;
    if (value && value !== null && value.trim() !== "" && value.length > 0) {
      return null;
    } else {
      return {
        emptyOrNull: true
      };
    }
  }

  checkDuplicates(reason, role) {
    let isValid = true;
    const found = this.routeList.some(val => {
      return (
        String(val.routeRoleDetails.id) === String(role) &&
        val.routeReason.trim().toUpperCase() === reason.trim().toUpperCase()
      );
    });
    if (found) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Route Reason Already Exists."
      });
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid;
  }

  addRouteReason() {
    const reasonValue = this.routeReasonGroup.value;
    if (
      this.checkIfEmptyOrNull(reasonValue.routeReason) &&
      this.checkDuplicates(reasonValue.routeReason, reasonValue.role)
    ) {
      const payload = {
        routeReason: reasonValue.routeReason,
        routeRoleDetails: {
          id: Number(reasonValue.role)
        }
      };
      this.getService().addRouteReason(payload).subscribe(res => {
        this.routeReasonGroup.reset();
        this.notifierServices.throwNotification({
          type: "info",
          message: "Route Reason Added."
        });
        this.getRouteReasons();
      });
    }
  }

  getRouteReasons() {
    this.deletedItems = [];
    this.addedCount = 0;
    this.routeReasonList = [];
    this.routeList = [];
    const service = this.getService();
    service.getRouteReasonsConfig();
    this.routeList = service.routeReasonConfigResponse;
    this.routeSubscription = service
      .getRouteReasonsConfigListner()
      .subscribe(data => {
        this.routeList = data;
        this.mapRouteReasons();
        this.routeSubscription.unsubscribe();
      });
  }
  mapRouteReasons() {
    this.routeReasonList = [];
    this.routeReasonListCopy = [];
    this.reasonCopy = [];
    if (this.routeList && this.routeList.length > 0) {
      // const reasonList = this.routeList.filter(s => s.routeStatus === true);
      this.routeList.forEach(s => {
        this.routeReasonList.push({
          routeReason: s.routeReason.toString(),
          routeReasonCode: s.routeReasonCode.toString(),
          routeRoleDetails: s.routeRoleDetails
        });
      });
      this.isRouteReasonPresent = true;
      this.isRouteReasonRendered = true;
    } else {
      this.isRouteReasonPresent = false;
      this.isRouteReasonRendered = false;
    }
    this.routeReasonListCopy = this.routeReasonList.map(x =>
      Object.assign({}, x)
    );
    this.reasonCopy = this.routeReasonList.map(x => Object.assign({}, x));
  }

  ngAfterViewInit() {}

  getTableColumns() {
    this.cols = [
      { field: "routeReason", header: "Route Reason" },
      { field: "role", header: "Role" }
    ];
  }

  deleteRow(rowIndex: number) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete?",
      accept: () => {
        this.getService()
          .deleteRouteReason(this.routeReasonList[rowIndex].routeReasonCode)
          .subscribe(res => {
            this.notifierServices.throwNotification({
              type: "info",
              message: "Route reason deleted."
            });
            this.getRouteReasons();
          });
      }
    });
  }

  onRowEditInit(routeReason: RouteReason, rowIndex: number) {
    this.routeReasonArray[rowIndex] = {
      routeReason: routeReason.routeReason,
      routeReasonCode: routeReason.routeReasonCode,
      routeRoleDetails: { ...routeReason.routeRoleDetails }
    };
  }

  checkIfEmptyOrNull(routeReason: string) {
    let valid = false;
    if (
      routeReason &&
      routeReason !== null &&
      routeReason.trim() !== "" &&
      routeReason.length > 0
    ) {
      valid = true;
    }
    return valid;
  }

  checkDuplication(routeReason: RouteReason, rowIndex: number) {
    let routeList = [];
    let isValid = true;
    routeList = this.reasonCopy.filter(
      (item, i) => item.routeReasonCode !== routeReason.routeReasonCode
    );
    const found = routeList.some(val => {
      return (
        String(val.routeRoleDetails.id) ===
          String(routeReason.routeRoleDetails.id) &&
        val.routeReason.trim().toUpperCase() ===
          routeReason.routeReason.trim().toUpperCase()
      );
    });
    if (found) {
      isValid = false;
      routeReason.routeReason = this.routeReasonListCopy[rowIndex].routeReason;
      routeReason.routeRoleDetails = this.routeReasonListCopy[
        rowIndex
      ].routeRoleDetails;
    }
    return isValid;
  }

  onRowEditSave(routeReason: RouteReason, rowIndex: number) {
    if (
      !routeReason.routeReason ||
      !this.checkIfEmptyOrNull(routeReason.routeReason)
    ) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Route Reason Cannot Be Empty."
      });
    } else if (!this.checkDuplication(routeReason, rowIndex)) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Route Reason Already Exists."
      });
    } else {
      const reasonItem = this.routeReasonList[rowIndex];
      const currentRouteReasonCode = this.routeReasonArray[rowIndex]
        .routeReasonCode;
      const currentRouteReason = this.routeReasonArray[rowIndex].routeReason;
      const currentRouteRole = this.routeReasonArray[rowIndex].routeRoleDetails;
      if (
        reasonItem.routeReason !== currentRouteReason ||
        String(reasonItem.routeRoleDetails.id) !== String(currentRouteRole.id)
      ) {
        this.getService()
          .updateRouteReason(
            reasonItem.routeReasonCode,
            reasonItem.routeReason,
            reasonItem.routeRoleDetails
          )
          .subscribe(
            res => {
              this.notifierServices.throwNotification({
                type: "info",
                message: "Route reason modified."
              });
              this.getRouteReasons();
            },
            err => {
              this.routeReasonList[rowIndex].routeReason = currentRouteReason;
              this.routeReasonList[
                rowIndex
              ].routeReasonCode = currentRouteReasonCode;
              this.routeReasonList[
                rowIndex
              ].routeRoleDetails = currentRouteRole;
            }
          );
      }
    }
  }

  onRowEditCancel(rowIndex: number) {
    const currentRouteReason = this.routeReasonArray[rowIndex];
    this.routeReasonList[rowIndex].routeReason = currentRouteReason.routeReason;
    this.routeReasonList[rowIndex].routeReasonCode =
      currentRouteReason.routeReasonCode;
    this.routeReasonList[rowIndex].routeRoleDetails =
      currentRouteReason.routeRoleDetails;
  }

  checkIfReverted() {
    let objectsAreSame = true;
    if (this.routeReasonListCopy.length !== this.routeReasonList.length) {
      objectsAreSame = false;
    } else {
      for (const obj in this.routeReasonListCopy) {
        if (
          this.routeReasonListCopy[obj].routeReason !==
          this.routeReasonList[obj].routeReason
        ) {
          objectsAreSame = false;
          break;
        }
      }
    }
    if (objectsAreSame) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "No Changes Made"
      });
      this.isValid = false;
      this.routeReasonGroup.get("routeReason").setValue("");
    }
    return objectsAreSame;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
