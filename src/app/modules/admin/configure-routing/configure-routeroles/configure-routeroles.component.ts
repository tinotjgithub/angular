import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { NotifierService } from "src/app/services/notifier.service";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "./../../../../services/task-management/taskmanagement.service";
import { RouteRole } from "./../../../../services/task-management/models/RouteRole";
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';
import { roueRoleDisabled } from "src/app/shared/constants.js"

@Component({
  selector: "app-configure-routeroles",
  templateUrl: "./configure-routeroles.component.html"
})
export class ConfigureRouterolesComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("routeRoleTable", { static: false }) routeRoleTable: Table;
  cols = [];
  public selectedRoles = Array<any>();
  roleList = [];
  routedRoleList = [];
  private roleSubscription: Subscription = new Subscription();
  private routeRoleSubscription: Subscription = new Subscription();
  public routeRoleGroup: FormGroup;
  public isValid = true;
  public isRouteRolePresent = true;
  public isRouteRoleRendered = false;
  public routeRoleList = Array<RouteRole>();
  public routeFromRoleList = Array<SelectItem>();
  public routeToRoleList = Array<SelectItem>();
  public isEnrollment: boolean;
  constructor(
    private notifierServices: NotifierService,
    private fbRole: FormBuilder,
    private taskManagementService: TaskmanagementService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private enrollmentService: EnrollmentManagementService
  ) {
    this.routeRoleGroup = fbRole.group({
      routeFromRole: ["", Validators.required],
      routeToRole: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.routeRoleGroup.valueChanges.subscribe(val => {
      this.promtInvalid();
    });
    this.isEnrollment = (this.activatedRoute.snapshot.queryParamMap.get('type') === 'enrollment');
    this.getTableColumns();
    this.getRoles();
    this.getRoutedRoles();
  }

  private getService() {
    return this.isEnrollment ? this.enrollmentService : this.taskManagementService;
  }

  checkDuplicates(fromRoleValue, toRoleValue) {
    let isValid = true;
    const found = this.routeRoleList.some(
      val => val.routeFrom === fromRoleValue && val.routeTo === toRoleValue
    );
    if (found) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Seleted Route Roles Already Exists."
      });
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid;
  }

  getRoles() {
    this.selectedRoles = [];
    this.roleList = [];
    const service = this.getService();
    service.getRolesToRoute();
    this.roleList = service.rolesToRouteResponse;
    this.roleSubscription = service
      .getRolesToRouteListner()
      .subscribe(data => {
        this.roleList = data.roles;
        this.mapRoles();
        this.roleSubscription.unsubscribe();
        this.getRoutedRoles();
      });
  }

  getRoutedRoles() {
    this.routedRoleList = [];
    const service = this.getService();
    service.getRoutedRoles();
    this.routedRoleList = service.routedRoleResponse;
    this.routeRoleSubscription = service
      .getRoutedRolesListner()
      .subscribe(data => {
        this.routedRoleList = data.routingOptionDtos;
        this.mapRoutedRoles();
        this.routeRoleSubscription.unsubscribe();
      });
  }

  mapRoutedRoles() {
    this.routeRoleList = [];
    if (this.routedRoleList && this.routedRoleList.length > 0) {
      this.routedRoleList.forEach((s, index) => {
        if (s.routeStatus) {
          this.routeRoleList.push({
            indexNo: index,
            routeFrom: this.getRoleName(s.routeFrom),
            routeTo: this.getRoleName(s.routeTo),
            routeFromId: s.routeFrom.toString(),
            routeToId: s.routeTo.toString(),
            routeStatus: s.routeStatus
          });
        }
      });
    }
    this.isRouteRolePresent = this.routeRoleList.length > 0 ? true : false;
    this.isRouteRoleRendered = this.routeRoleList.length > 0 ? true : false;
  }

  mapRoles() {
    this.routeFromRoleList = [];
    this.routeToRoleList = [];
    if (
      this.roleList &&
      this.roleList !== undefined &&
      this.roleList.length > 0
    ) {
    this.roleList.forEach(s => {
        this.routeFromRoleList.push({
          value: s.id,
          label: s.roleName
        });
        this.routeToRoleList.push({
          value: s.id,
          label: s.roleName
        });
      });
    }
  }

  getTableColumns() {
    this.cols = [
      { field: "routeFrom", header: "From" },
      { field: "routeTo", header: "To" }
    ];
  }

  deleteRow(row) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this Route option?",
      rejectVisible: true,
      acceptLabel: 'Yes',
      accept: ()=>{
        const finalRouteRoleList = {
          routeFrom: row.routeFromId,
          routeTo: row.routeToId,
          routeStatus: false,
        };
        this.getService().saveRouteRole(finalRouteRoleList);
        this.routeRole();
        this.routeRoleTable.reset();
      }
    });
  }

  checkIfEmptyOrNull(role: string) {
    let valid = false;
    if (role && role !== null && role.trim() !== "" && role.length > 0) {
      valid = true;
    }
    return valid;
  }

  checkIfValid(routeFrom, routeTo) {
    let valid = true;
    if (routeFrom === "Claims Examiner" && routeTo === "Manager") {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Claims Examiner to Manager routing not supported!!"
      });
      valid = false;
    } else if (routeFrom === "Claims Lead" && routeTo === "Claims Lead") {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Claims Lead to Claims Lead routing not supported!!"
      });
      valid = false;
    } else if (routeFrom === "Manager" && routeTo === "Manager") {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Manager to Manager routing not supported!!"
      });
      valid = false;
    }
    return valid;
  }

  getRoleName(roleValue) {
    let roleName = "";
    if (
      this.roleList &&
      this.roleList !== undefined &&
      this.roleList.length > 0
    ) {
      this.roleList.forEach(role => {
        if (role.id.toString() === roleValue.toString()) {
          roleName = role.roleName;
        }
      });
      return roleName;
    }
  }

  ngAfterViewInit() {}

  validateRoles(routeFrom, routeTo) {
    let isValid = true;
    if (!this.checkIfEmptyOrNull(routeFrom)) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Please select a route from role."
      });
      isValid = false;
    } else if (!this.checkIfEmptyOrNull(routeTo)) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Please select a route to role."
      });
      isValid = false;
    } else if (
      !this.checkDuplicates(routeFrom, routeTo) ||
      !this.checkIfValid(
        this.getRoleName(this.routeRoleGroup.get("routeFromRole").value),
        this.getRoleName(this.routeRoleGroup.get("routeToRole").value)
      )
    ) {
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid;
  }

  routeRole() {
    this.routedRoleList = [];
    const service = this.getService();
    this.routedRoleList = service.routedRoleResponse;
    this.routeRoleSubscription = service
      .getRoutedRolesListner()
      .subscribe(data => {
        this.routedRoleList = data.routingOptionDtos;
        this.mapRoutedRoles();
        this.routeRoleSubscription.unsubscribe();
      });
  }

  addRouteRole() {
    const fromRol = this.getRoleName(
      this.routeRoleGroup.get("routeFromRole").value
    );
    const toRol = this.getRoleName(
      this.routeRoleGroup.get("routeToRole").value
    );
    const isValid = this.validateRoles(fromRol, toRol);
    if (isValid) {
      const payload = {
        routeFrom: this.routeRoleGroup.get("routeFromRole").value,
        routeStatus: true,
        routeTo: this.routeRoleGroup.get("routeToRole").value
      };
      this.getService().saveRouteRole(payload);
      this.selectedRoles = [];
      this.routeRole();
      this.routeRoleTable.reset();
    }
  }

  ngOnDestroy() {
    this.roleSubscription.unsubscribe();
    this.routeRoleSubscription.unsubscribe();
  }

  promtInvalid() {
    const routeFrom = this.getRoleName(this.routeRoleGroup.get("routeFromRole").value);
    const routeTo = this.getRoleName(this.routeRoleGroup.get("routeToRole").value);
    let valid = true;
    if (routeFrom && routeTo && (roueRoleDisabled[routeFrom].indexOf(routeTo) > -1)) {
      this.confirmationService.confirm({
        message: `${routeFrom} to ${routeTo} routing not supported!!`,
        rejectVisible: false,
        acceptLabel: 'OK',
        accept: () => {
          this.routeRoleGroup.patchValue({
            routeToRole: ''
          });
        }
      });
      valid = false;
    }
    return valid;
  }
}
