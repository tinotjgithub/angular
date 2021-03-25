import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { MessageService } from 'primeng/api';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ADD_USER_MANAGER_ROLE, ADD_USER_USERGROUP_ROLE } from "src/app/shared/constants.js";
import { maxTarget } from "./../../../../shared/constants";

@Component({
  selector: 'app-modify-user-popup',
  templateUrl: './modify-user-popup.component.html'
})
export class ModifyUserPopupComponent implements OnInit, OnChanges {

  public userForm: FormGroup;
  public userRoles: any[];
  private defaultDeactiveDate: Date;
  @Input()
  public editUser: any;
  @Output()
  public updateSuccess: EventEmitter<boolean> = new EventEmitter();
  public editMode: boolean;
  public submitFailMessage: any;
  public failed: boolean;
  public backToEdit: boolean;
  public managers: any[];
  public userGroups: any[];
  public today = new Date();
  private managerField: any[] = ADD_USER_MANAGER_ROLE;
  private usergroupField: any[] = ADD_USER_USERGROUP_ROLE;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private messageService: MessageService,
    private userManagementService: UserManagementService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe) { }

  ngOnInit() {
    console.log('modify user popup..');
    this.activateRoute.queryParams.subscribe((params) => {
      if (params && params.returnEdit) {
        this.backToEdit = true;
      } else {
        this.backToEdit = false;
      }
    });
    this.defaultDeactiveDate = new Date('12/31/9999');
    this.editMode = this.editUser ? true : false;
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      target: [''],
      dob: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      activeDate: ['', [Validators.required]],
      deactiveDate: [/* this.defaultDeactiveDate, [Validators.required] */''],
      // userGroupName: ['', Validators.required],
      ldapUser: ['', [Validators.required]]
    });
    this.userForm.controls.activeDate.valueChanges.subscribe(val => {
      this.userForm.controls.deactiveDate.reset();
    });
    if (this.editUser) {
      this.userForm.patchValue({
        firstName: this.editUser.firstName || '',
        lastName: this.editUser.lastName || '',
        email: this.editUser.communicationEmail || '',
        dob: this.editUser.dateOfBirth ? new Date(this.editUser.dateOfBirth) : '',
        userName: this.editUser.userName || '',
        role: this.editUser.role || '',
        activeDate: this.editUser.activeDate ? new Date(this.editUser.activeDate) : '',
        deactiveDate: this.editUser.deactivateDate ? new Date(this.editUser.deactivateDate) : '',
        ldapUser: String(this.editUser.ldapOrLocal).toLowerCase() === 'ldap' ? 'LDAP' : 'Local',
        target: this.editUser.target
      });
      this.createAdditionalFieldBasedOnRole(this.editUser.role, this.editUser);
    }
    this.getControl('role').valueChanges.subscribe(val => {
      if (val) {
        this.createAdditionalFieldBasedOnRole(val);
        this.removeAdditionalFieldBasedOnRole(val);
      }
    });
    this.getRoles();
    this.getMangers();
    this.getUserGroups();
  }

  preventInput(event) {
    const value = this.userForm.get("target").value;
    if (value > maxTarget) {
      event.preventDefault();
      this.userForm
        .get("target")
        .setValue(parseInt(value.toString().substring(0, 2), 10));
    }
  }

  ngOnChanges(change) {
    if (this.editUser) {
      this.editMode = true;
      this.userForm.patchValue({
        firstName: this.editUser.firstName || '',
        lastName: this.editUser.lastName || '',
        email: this.editUser.communicationEmail || '',
        dob: this.editUser.dateOfBirth ? new Date(this.editUser.dateOfBirth) : '',
        userName: this.editUser.userName || '',
        role: this.editUser.role || '',
        activeDate: this.editUser.activeDate ? new Date(this.editUser.activeDate) : '',
        deactiveDate: this.editUser.deactivateDate ? new Date(this.editUser.deactivateDate) : '',
        ldapUser: String(this.editUser.ldapOrLocal).toLowerCase() === 'ldap' ? 'LDAP' : 'Local',
        target: this.editUser.target
      });
      this.userForm.controls.role.disable();
      this.createAdditionalFieldBasedOnRole(this.editUser.role, this.editUser);
    } else {
      this.editMode = false;
    }
  }

  getRoles() {
    this.authService.getUserRoles();
    this.authService.userRoles.subscribe(roles => {
      this.userRoles = roles;
    });
  }

  private getMangers() {
    this.userManagementService.getManagers().subscribe(res => {
      if (res && res.users) {
        this.managers = [...res.users];
      } else {
        this.managers = [];
      }
    });
  }

  private getUserGroups() {
    this.userManagementService.getManagerUserGroups().subscribe(res => {
      if (res) {
        this.userGroups = [...res];
      } else {
        this.userGroups = [];
      }
    }, err => {
      this.userGroups = [];
    });
  }

  submit() {
    this.failed = false;
    if (this.userForm.invalid) {
      return;
    }
    const formValue = this.userForm.value;
    if (this.editMode) {
      // const userGroup = this.userGroups.filter(group => group.groupId === formValue.userGroupName);
      const roleSelected = this.userRoles.filter(rol => String(rol.roleName).toLowerCase() === String(this.editUser.role).toLowerCase());
      const user = {
        id: this.editUser.id,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        communicationEmail: formValue.email,
        userName: formValue.userName,
        // dateOfBirth: this.datePipe.transform(formValue.dob, "dd/MM/yyyy"),
        // activeDate: this.datePipe.transform(formValue.activeDate, "dd/MM/yyyy"),
        dateOfBirth: this.datePipe.transform(formValue.dob, "yyyy-MM-dd"),
        activeDate: this.datePipe.transform(formValue.activeDate, "yyyy-MM-dd"),
        ldapOrLocal: (formValue.ldapUser === 'LDAP') ? true : false,
        userRoleId: roleSelected[0].id,
        // deactivateDate: formValue.deactiveDate ? this.datePipe.transform(formValue.deactiveDate, "dd/MM/yyyy") : null,
        deactivateDate: formValue.deactiveDate ? this.datePipe.transform(formValue.deactiveDate, "yyyy-MM-dd") : null,
        userGroupId: formValue.userGroupName || null,
        // userGroupName: userGroup.length > 0 ? userGroup[0].groupName : '',
        managerName: formValue.managerName ? formValue.managerName : this.editUser.managerName,
        target: formValue.target || null,
        status: this.editUser.status,
        leadName: this.editUser.leadName
      };
      console.log('update service req body..', user);
      this.userManagementService.updateUser(user).subscribe(() => {
        this.failed = false;
        this.messageService.add({
          key: "successKey",
          severity: "success",
          detail: "User updated successfully!!",
          summary: "SUCCESS"
        });
        this.updateSuccess.emit(true);
      }, err => {
        this.failed = true;
        if (err.error && err.error.message && err.error.message !== "") {
          this.submitFailMessage = err.error.message;
        } else {
          this.submitFailMessage = "Updation failed please try again.";
        }
      });
    } else {
      const user = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        communicationEmail: formValue.email,
        userName: formValue.userName,
        // dateOfBirth: this.datePipe.transform(formValue.dob, "dd/MM/yyyy"),
        // activeDate: this.datePipe.transform(formValue.activeDate, "dd/MM/yyyy"),
        dateOfBirth: this.datePipe.transform(formValue.dob, "yyyy-MM-dd"),
        activeDate: this.datePipe.transform(formValue.activeDate, "yyyy-MM-dd"),
        ldapUser: (formValue.ldapUser === 'LDAP') ? true : false,
        userRoleId: Number(formValue.role),
        // deactiveDate: formValue.deactiveDate ? this.datePipe.transform(formValue.deactiveDate, "dd/MM/yyyy") : null,
        deactivateDate: formValue.deactiveDate ? this.datePipe.transform(formValue.deactiveDate, "yyyy-MM-dd") : null,
        userGroupId: formValue.userGroupName || null,
        managerUserId: formValue.managerName ? Number(formValue.managerName) : null,
        target: formValue.target || null
      };
      const payload = {
        users: [user]
      };
      this.userManagementService.createUser(payload).subscribe(() => {
        this.failed = false;
        this.messageService.add({
          key: "successKey",
          severity: "success",
          detail: "User created successfully!!",
          summary: "SUCCESS"
        });
        this.userForm.reset();
        // this.router.navigateByUrl('/UserConfig/edit-user');
      }, err => {
        this.failed = true;
        if (err.error && err.error.message && err.error.message !== "") {
          this.submitFailMessage = err.error.message;
        } else {
          this.submitFailMessage = "Creation failed please try again.";
        }
      });
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
      const roleObj = this.userRoles.filter(r => {
        return String(r.id) === String(role);
      });
      roleName = roleObj.length > 0 ? roleObj[0].roleName : '';
    }
    if (this.usergroupField.indexOf(roleName.toLowerCase()) > -1 && !this.getControl('userGroupName')) {
      this.userForm.addControl('userGroupName', new FormControl('', [Validators.required]));
      if (userInfo) {
        this.userForm.patchValue({
          userGroupName: userInfo.userGroupId
        });
      }
      this.userForm.removeControl('managerName');
    } else if (this.managerField.indexOf(roleName.toLowerCase()) > -1 && !this.getControl('managerName')) {
      this.userForm.addControl('managerName', new FormControl('', [Validators.required]));
      if (userInfo) {
        this.userForm.patchValue({
          managerName: userInfo.managerName
        });
      }
      this.userForm.removeControl('userGroupName');
    }
  }

  removeAdditionalFieldBasedOnRole(role: string) {
    const roleObj = this.userRoles.filter(r => String(r.id) === String(role));
    const roleName: string = roleObj.length > 0 ? roleObj[0].roleName : '';
    if (this.usergroupField.indexOf(roleName.toLowerCase()) === -1 && this.getControl('userGroupName')) {
      this.userForm.removeControl('userGroupName');
    }
    if (this.managerField.indexOf(roleName.toLowerCase()) === -1 && this.getControl('managerName')) {
      this.userForm.removeControl('managerName');
    }
  }

  minDeactivateDate() {
    const value: Date = this.getControl('activeDate').value;
    return value ? ((value > this.today) ? value : this.today) : this.today;
  }

}
