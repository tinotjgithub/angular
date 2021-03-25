import {
  ADD_USER_MANAGER_ROLE,
  ADD_USER_USERGROUP_ROLE,
  ADD_USER_USERGROUP_REQUIRED
} from "src/app/shared/constants.js";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { MessageService } from "primeng/api";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { maxTarget } from "./../../../../shared/constants";
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';
import { GlobalValidators } from 'src/app/shared/validators';

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
})
export class AddUserComponent implements OnInit, OnChanges {
  public userForm: FormGroup;
  public userRoles: any[];
  private defaultDeactiveDate: Date;
  @Input()
  public editUser: any;
  @Output()
  public updateSuccess: EventEmitter<boolean> = new EventEmitter();
  @Output()
  public cancelProcess: EventEmitter<boolean> = new EventEmitter();
  public editMode: boolean;
  public submitFailMessage: any;
  public failed: boolean;
  public backToEdit: boolean;
  public managers: any[];
  public userGroups: any[];
  public today = new Date();
  private managerField: any[] = ADD_USER_MANAGER_ROLE;
  private usergroupField: any[] = ADD_USER_USERGROUP_ROLE;
  private usergroupRequiredField: any[] = ADD_USER_USERGROUP_REQUIRED;
  public isUserGroupRequired: boolean;
  public operationTypes: any[];
  public submitting: boolean;
  public isSystemUser: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private messageService: MessageService,
    private userManagementService: UserManagementService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {}

  ngOnInit() {
    this.authService.getUserDetails().subscribe((res) => {
      this.isSystemUser = res && res.systemUser;
    });
    this.activateRoute.queryParams.subscribe((params) => {
      if (params && params.returnEdit) {
        this.backToEdit = true;
      } else {
        this.backToEdit = false;
      }
    });
    this.defaultDeactiveDate = new Date("12/31/9999");
    this.editMode = this.editUser ? true : false;
    this.getRoles();
    this.getOperationTypes();
    const role = this.secureLocalStorage.getItem("roleId");
    const userDetails = this.authService.currentUserDetails;
    this.userForm = this.fb.group(
      {
        firstName: ["", [Validators.required, GlobalValidators.nameControl]],
        lastName: ["", [Validators.required, GlobalValidators.nameControl]],
        email: ["", [Validators.required, GlobalValidators.emailValidation]],
        target: [""],
        dob: ["", [Validators.required]],
        userName: ["", [Validators.required]],
        role: ["", [Validators.required]],
        activeDate: ["", [Validators.required]],
        deactiveDate: [
          /* this.defaultDeactiveDate, [Validators.required] */ "",
          [this.minDeactivateValidator],
        ],
        // userGroupName: ['', Validators.required],
        operationType: [""],
      },
      {
        validators: [this.deactivateDateValidator],
      }
    );
    /* this.userForm.controls.activeDate.valueChanges.subscribe(val => {
      this.userForm.controls.deactiveDate.reset();
    }); */
    this.removeAllAdditionalField();
    if (this.editUser) {
      this.userForm.patchValue({
        firstName: this.editUser.firstName || "",
        lastName: this.editUser.lastName || "",
        dob: this.editUser.dateOfBirth
          ? new Date(this.editUser.dateOfBirth)
          : "",
        email: this.editUser.communicationEmail || "",
        userName: this.editUser.userName || "",
        role: this.editUser.role || "",
        activeDate: this.editUser.activeDate
          ? new Date(this.editUser.activeDate)
          : "",
        deactiveDate: this.editUser.deactivateDate
          ? new Date(this.editUser.deactivateDate)
          : "",
        target: this.editUser.target,
        operationType: this.setEditValueForOperationType(),
      });
      if (this.editUser.status === "Inactive") {
        try {
          this.userForm.disable();
        } catch (e) {}
        this.userForm.controls.deactiveDate.enable();
      } else {
        this.userForm.enable();
      }
      const currentRole = this.secureLocalStorage.getItem("roleId");
      const managerId =
        currentRole && currentRole === "Manager" && userDetails
          ? userDetails.id
          : this.editUser.managerUserId;
      managerId &&
      this.usergroupField.indexOf(String(this.editUser.role).toLowerCase()) > -1
        ? this.getUserGroups(managerId)
        : this.doNothing();
      this.createAdditionalFieldBasedOnRole(this.editUser.role, this.editUser);
    }
    this.getControl("role").valueChanges.subscribe((val) => {
      if (val) {
        this.removeAllAdditionalField();
        this.createAdditionalFieldBasedOnRole(val);
      }
    });
  }

  private setEditValueForOperationType(): any {
    return this.editUser.selectedOperationTypeIds
      ? (this.editUser.selectedOperationTypeIds.length > 0
        ? (this.editUser.selectedOperationTypeIds.length > 1
          ? "both"
          : this.editUser.selectedOperationTypeIds[0])
        : "")
      : "";
  }

  preventInput(event) {
    const value = this.userForm.get("target").value;
    if (value < 0 || (String(value).indexOf('-') > -1)) {
      event.preventDefault();
      this.userForm.get("target").setValue(0);
    }
    if (value > maxTarget) {
      event.preventDefault();
      this.userForm
        .get("target")
        .setValue(parseInt(value.toString().substring(0, 2), 10));
    }
  }

  ngOnChanges(change) {
    if (this.userForm) {
      this.removeAllAdditionalField();
    }
    if (this.editUser) {
      this.editMode = true;
      this.userForm.patchValue({
        firstName: this.editUser.firstName || "",
        lastName: this.editUser.lastName || "",
        dob: this.editUser.dateOfBirth
          ? new Date(this.editUser.dateOfBirth)
          : "",
        email: this.editUser.communicationEmail || "",
        userName: this.editUser.userName || "",
        role: this.editUser.role || "",
        activeDate: this.editUser.activeDate
          ? new Date(this.editUser.activeDate)
          : "",
        deactiveDate: this.editUser.deactivateDate
          ? new Date(this.editUser.deactivateDate)
          : "",
        target: this.editUser.target,
        operationType: this.setEditValueForOperationType(),
      });
      this.userForm.controls.role.disable();
      if (this.editUser.status === "Inactive") {
        try {
          this.userForm.disable();
        } catch (e) {}
        this.userForm.controls.deactiveDate.enable();
      } else {
        this.userForm.enable();
      }
      const currentRole = this.secureLocalStorage.getItem("roleId");
      const userDetails = this.authService.currentUserDetails;
      const managerId =
        currentRole && currentRole === "Manager" && userDetails
          ? userDetails.id
          : this.editUser.managerUserId;
      managerId &&
      this.usergroupField.indexOf(String(this.editUser.role).toLowerCase()) > -1
        ? this.getUserGroups(managerId)
        : this.doNothing();
      this.createAdditionalFieldBasedOnRole(this.editUser.role, this.editUser);
    } else {
      this.editMode = false;
    }
  }

  minDeactivateValidator(control: FormControl) {
    const value = control.value;
    const tdy = new Date();
    const date = new Date(value);
    const selectedDate = new Date(
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    );
    const today = new Date(
      `${tdy.getFullYear()}-${tdy.getMonth()}-${tdy.getDate()}`
    );
    if (value && selectedDate < today) {
      return { deactivateDate: true };
    }
    return null;
  }

  deactivateDateValidator(form: FormGroup) {
    const formValue = form.value;
    if (formValue.activeDate && formValue.deactiveDate) {
      return formValue.activeDate > formValue.deactiveDate
        ? { deactivateDate: true }
        : null;
    } else {
      return null;
    }
  }

  getRoles() {
    this.authService.getUserRolesByLogin().subscribe((roleRes) => {
      this.userRoles = roleRes ? roleRes.roles : [];
    });
  }

  private getMangers() {
    const role = this.getControl("role").value;
    const roleObj = this.userRoles.filter((r) => String(r.id) === String(role));
    const roleWorkItemTypeId = roleObj[0] ? roleObj[0].roleWorkItemTypeId : 0;
    this.userManagementService
      .getManagers(roleWorkItemTypeId)
      .subscribe((res) => {
        if (res && res.users) {
          this.managers = [...res.users];
        } else {
          this.managers = [];
        }
      });
  }

  private getUserGroups(id) {
    const role = this.getControl("role").value;
    const roleObj = this.userRoles.filter((r) => {
      return this.editUser
        ? String(r.roleName).toLowerCase() === String(role).toLowerCase()
        : String(r.id) === String(role);
    });
    const roleWorkItemTypeId = roleObj[0] ? roleObj[0].roleWorkItemTypeId : 0;
    this.userManagementService.getUserGroups(id, roleWorkItemTypeId).subscribe(
      (res) => {
        if (res) {
          this.userGroups = [...res.userGroups];
        } else {
          this.userGroups = [];
        }
      },
      (err) => {
        this.userGroups = [];
      }
    );
  }

  submit() {
    this.failed = false;
    if (this.userForm.invalid) {
      return;
    }
    const formValue = this.userForm.value;
    this.submitting = true;
    if (this.editMode) {
      // const userGroup = this.userGroups.filter(group => group.groupId === formValue.userGroupName);
      const roleSelected = this.userRoles.filter(
        (rol) =>
          String(rol.roleName).toLowerCase() ===
          String(this.editUser.role).toLowerCase()
      );
      let user: any = {
        id: this.editUser.id,
        firstName:
          this.editUser.status === "Inactive"
            ? this.editUser.firstName
            : formValue.firstName,
        lastName:
          this.editUser.status === "Inactive"
            ? this.editUser.lastName
            : formValue.lastName,
        userName:
          this.editUser.status === "Inactive"
            ? this.editUser.userName
            : formValue.userName,
        dateOfBirth:
          this.editUser.status === "Inactive"
            ? this.editUser.dateOfBirth
            : this.datePipe.transform(formValue.dob, "yyyy-MM-dd"),
        communicationEmail:
          this.editUser.status === "Inactive"
            ? this.editUser.communicationEmail
            : formValue.email,
        activeDate:
          this.editUser.status === "Inactive"
            ? this.editUser.activeDate
            : this.datePipe.transform(formValue.activeDate, "yyyy-MM-dd"),
        externalUser: !this.isSystemUser,
        userRoleId: roleSelected[0].id,
        deactivateDate: formValue.deactiveDate
          ? this.datePipe.transform(formValue.deactiveDate, "yyyy-MM-dd")
          : null,
        userGroupIds:
          this.editUser.status === "Inactive"
            ? this.editUser.userGroups
              ? this.editUser.userGroups.map((e) => e.groupId)
              : null
            : formValue.userGroupName
            ? formValue.userGroupName.map((e) => e.groupId)
            : null,
        // userGroupName: userGroup.length > 0 ? userGroup[0].groupName : '',
        managerName: formValue.managerName
          ? formValue.managerName
          : this.editUser.managerName,
        managerUserId: null,
        target:
          this.editUser.status === "Inactive"
            ? this.editUser.target
            : formValue.target || null,
        status: this.editUser.status,
        leadName: this.editUser.leadName,
      };
      if (roleSelected[0].roleName === "Manager") {
        user = {
          ...user,
          userOperationTypeIds:
            this.editUser.status === "Inactive"
              ? this.editUser.selectedOperationTypeIds
              : formValue.operationType
              ? formValue.operationType === 'both'
              ? this.operationTypes.map((e) => e.id)
              : [Number(formValue.operationType)]
              : [],
        };
      }
      this.userManagementService.updateUser(user).subscribe(
        () => {
          this.failed = false;
          this.submitting = false;
          this.messageService.add({
            key: "successKey",
            severity: "success",
            detail: "User updated successfully!!",
            summary: "SUCCESS",
          });
          this.updateSuccess.emit(true);
        },
        (err) => {
          this.submitting = false;
          this.failed = true;
          if (err.error && err.error.message && err.error.message !== "") {
            this.submitFailMessage = err.error.message;
          } else {
            this.submitFailMessage = "Updation failed please try again.";
          }
        }
      );
    } else {
      const roleSelected = this.userRoles.filter(
        (rol) => String(rol.id) === String(formValue.role)
      );
      let user: any = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        userName: formValue.userName,
        dateOfBirth: this.datePipe.transform(formValue.dob, "yyyy-MM-dd"),
        communicationEmail: formValue.email,
        activeDate: this.datePipe.transform(formValue.activeDate, "yyyy-MM-dd"),
        externalUser: !this.isSystemUser,
        userRoleId: Number(formValue.role),
        deactivateDate: formValue.deactiveDate
          ? this.datePipe.transform(formValue.deactiveDate, "yyyy-MM-dd")
          : null,
        userGroupIds: formValue.userGroupName
          ? formValue.userGroupName.map((e) => e.groupId)
          : null,
        managerUserId: formValue.managerName
          ? Number(formValue.managerName)
          : null,
        target: formValue.target || null,
      };
      if (roleSelected[0].roleName === "Manager") {
        this.operationTypes.map((e) => e.id);
        user = {
          ...user,
          userOperationTypeIds: formValue.operationType
            ? formValue.operationType === "both"
              ? this.operationTypes.map((e) => e.id)
              : [Number(formValue.operationType)]
            : [],
        };
      }
      const payload = {
        users: [user],
      };
      this.userManagementService.createUser(payload).subscribe(
        () => {
          this.failed = false;
          this.submitting = false;
          this.messageService.add({
            key: "successKey",
            severity: "success",
            detail: "User created successfully!!",
            summary: "SUCCESS",
          });
          this.clearForm();
          // this.router.navigateByUrl('/UserConfig/edit-user');
        },
        (err) => {
          this.failed = true;
          this.submitting = false;
          if (err.error && err.error.message && err.error.message !== "") {
            this.submitFailMessage = err.error.message;
          } else {
            this.submitFailMessage = "Creation failed please try again.";
          }
        }
      );
    }
    /* this.userForm.patchValue({
      deactiveDate: this.defaultDeactiveDate
    }); */
  }

  getControl(controlName: string) {
    return this.userForm.get(controlName);
  }

  createAdditionalFieldBasedOnRole(role: string, userInfo?) {
    let roleName: string;
    if (userInfo) {
      roleName = role;
    } else {
      const roleObj = this.userRoles
        ? this.userRoles.filter((r) => {
            return String(r.id) === String(role);
          })
        : [];
      roleName = roleObj.length > 0 ? roleObj[0].roleName : "";
    }
    this.isUserGroupRequired =
      this.usergroupRequiredField.indexOf(roleName.toLowerCase()) > -1;
    if (roleName === "Manager") {
      this.getControl("operationType").setValidators([Validators.required]);
      this.getControl("operationType").updateValueAndValidity();
    } else {
      this.getControl("operationType").setValidators([]);
      this.getControl("operationType").updateValueAndValidity();
    }
    if (
      this.usergroupField.indexOf(roleName.toLowerCase()) > -1 &&
      !this.getControl("userGroupName")
    ) {
      this.userForm.addControl(
        "userGroupName",
        new FormControl(
          "",
          this.isUserGroupRequired ? [Validators.required] : []
        )
      );
      if (userInfo) {
        this.userForm.patchValue({
          userGroupName: userInfo.userGroups ? userInfo.userGroups : null,
        });
        userInfo.status === "Inactive"
          ? this.userForm.controls.userGroupName.disable()
          : this.doNothing();
      }
      /* if (this.managerField.indexOf(roleName.toLowerCase()) === -1) {
        this.userForm.removeControl('managerName');
      } */
    }
    if (
      this.managerField.indexOf(roleName.toLowerCase()) > -1 &&
      !this.getControl("managerName")
    ) {
      if (!userInfo) {
        this.getMangers();
      }
      this.userForm.addControl(
        "managerName",
        new FormControl("", [Validators.required])
      );
      const currentRole = this.secureLocalStorage.getItem("roleId");
      const userDetails = this.authService.currentUserDetails;
      if (userInfo) {
        this.userForm.patchValue({
          managerName: userInfo.managerName,
        });
        userInfo.status === "Inactive"
          ? this.userForm.controls.managerName.disable()
          : this.doNothing();
      } else if (currentRole === "Manager") {
        this.userForm.patchValue({
          managerName: userDetails ? userDetails.id : null,
        });
        // tslint:disable-next-line: no-unused-expression
        this.userForm.value.managerName
          ? this.onManagerChange(this.userForm.value.managerName)
          : null;
      }
      if (this.usergroupField.indexOf(roleName.toLowerCase()) === -1) {
        this.userForm.removeControl("userGroupName");
      }
    }
  }

  removeAdditionalFieldBasedOnRole(role: string) {
    const roleObj = this.userRoles.filter((r) => String(r.id) === String(role));
    const roleName: string = roleObj.length > 0 ? roleObj[0].roleName : "";
    if (
      this.usergroupField.indexOf(roleName.toLowerCase()) === -1 &&
      this.getControl("userGroupName")
    ) {
      this.userForm.removeControl("userGroupName");
    }
    if (
      this.managerField.indexOf(roleName.toLowerCase()) === -1 &&
      this.getControl("managerName")
    ) {
      this.userForm.removeControl("managerName");
    }
  }

  removeAllAdditionalField() {
    if (this.getControl("userGroupName")) {
      this.userForm.removeControl("userGroupName");
    }
    if (this.getControl("managerName")) {
      this.userForm.removeControl("managerName");
    }
  }

  minDeactivateDate() {
    const value: Date = this.getControl("activeDate").value;
    return value ? (value > this.today ? value : this.today) : this.today;
  }

  doNothing() {
    return null;
  }

  onManagerChange(id) {
    const roleId = this.userForm.controls.role.value;
    const roleObj = this.userRoles.filter(
      (r) => String(r.id) === String(roleId)
    );
    const roleName: string = roleObj.length > 0 ? roleObj[0].roleName : "";
    if (roleName && this.usergroupField.indexOf(roleName.toLowerCase()) > -1) {
      this.getUserGroups(id);
    }
  }

  cancel() {
    this.cancelProcess.next(false);
  }

  clearForm() {
    this.userForm.reset();
    this.removeAllAdditionalField();
  }

  getRoleName() {
    if (this.editUser) {
      return this.editUser.role;
    } else {
      const role = this.userForm.value.role;
      const roleObj = this.userRoles
        ? this.userRoles.filter((r) => {
            return String(r.id) === String(role);
          })
        : [];
      return roleObj.length > 0 ? roleObj[0].roleName : "";
    }
  }

  getOperationTypes() {
    this.authService.getOperationType().subscribe((res) => {
      this.operationTypes = res || [];
    });
  }
}
