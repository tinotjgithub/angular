import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { ReportService } from "src/app/services/report/report.service";
import { DatePipe } from "@angular/common";
import { AuthenticationService } from "../../authentication/services/authentication.service";
import { UserReportAdminUserDropdownRoles } from "src/app/shared/constants.js";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-promt-user-list",
  templateUrl: "./promt-user-list.component.html"
})
export class PromtUserListComponent implements OnInit, AfterViewInit {
  @ViewChild("usersSelect", { static: false }) usersSelect: MultiSelect;
  public role = this.secureLocalStorage.getItem("roleId");
  public userListForm: FormGroup;
  public today = new Date();
  public columns: any[];
  public reportLoaded: boolean;
  public reportData: any[];
  public roleList: any[];
  public nameList: any[];
  public showDropdown: boolean;
  @Input()
  public fromTab: boolean;
  status = "Active";
  private adminPreColumns: any[] = [
    { field: "firstName", header: "First Name" },
    { field: "lastName", header: "Last Name" },
    { field: "userName", header: "User Name" },
    { field: "role", header: "Role" },
  ];
  private adminSufColumns: any[] = [
    { field: "activeDate", header: "Active Date" },
    { field: "deactivateDate", header: "Deactivate Date" },
    { field: "status", header: "Current Status" },
    { field: "leadName", header: "Lead Name" },
    { field: "managerName", header: "Manager Name" },
    // { field: "proficiency", header: "Proficiency" },
    { field: "ldapOrLocal", header: "External/Local" }
  ];
  public leadCount: any;
  public examinerCount: any;
  public showLeadCountManager: boolean;
  public showCountLead: boolean;
  public allRole = {
    id: null,
    roleName: "All",
    isRoutingEnabled: null
  };
  public operationTypes: any;
  public isEnrollment: boolean;
  public specialistCount: any;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private reportService: ReportService,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private userManagementService: UserManagementService,
    private secureLocalStorage: CryptoService,
    private taskmanagementService: TaskmanagementService
  ) {}

  ngOnInit() {
    this.isEnrollment = true;
    const defaultFrom = new Date("01-01-1970");
    this.userListForm = this.fb.group({
      activeFrom: [defaultFrom, [Validators.required]],
      activeTo: [this.today, [Validators.required]],
      status: ["All", [Validators.required]],
    });
    if (this.role === "Administrator") {
      this.userListForm.addControl(
        "role",
        this.fb.control(this.allRole, [Validators.required])
      );
      this.userListForm.addControl("name", this.fb.control(""));
      if (this.isEnrollment) {
        this.userListForm.addControl("operationType", this.fb.control("both"));
        this.getOperationTypes();
      }
      this.authService.getUserRolesByLogin().subscribe(data => {
        this.roleList = data ? data.roles : [];
      });
      this.rolevalueChange();
    }
    this.columns =
      this.role === "Claims Lead"
        ? [
            { field: "firstName", header: "First Name" },
            { field: "lastName", header: "Last Name" },
            { field: "userName", header: "User Name" },
            { field: "role", header: "Role" },
            { field: "activeDate", header: "Role Start Date" },
            { field: "deactivateDate", header: "Deactivate Date" },
            { field: "status", header: "Current Status" },
            { field: "ldapOrLocal", header: "External/Local" },
            { field: "leadName", header: "Claims Lead Name" },
            { field: "managerName", header: "Manager Name" },
            { field: "userGroup", header: "User Group" },
            { field: "userGroupTypes", header: "User Group Type" }
          ]
        : [...this.adminPreColumns, ...this.adminSufColumns];
  }

  rolevalueChange() {
    this.getRole.valueChanges.subscribe(val => {
      this.nameList = [];
      if (val && val.roleName === 'Manager' && this.isEnrollment) {
        this.getOpType.setValidators([Validators.required]);
        this.getOpType.setValue('both');
        this.getOpType.updateValueAndValidity();
        this.showDropdown = true;
        this.onOpChange();
      } else if (val && UserReportAdminUserDropdownRoles.indexOf(val.roleName) > -1 && (this.isEnrollment ? val.roleName !== 'Manager' : true)) {
        this.showDropdown = true;
        this.getNameList(val.roleWorkItemTypeId, val.roleName);
        this.userListForm.controls.name.reset();
      } else {
        this.getName.reset();
        this.showDropdown = false;
      }
    });
  }

  onChangeRoles() {
    this.userListForm.controls.name.reset();
    this.isEnrollment && this.getOpType.reset();
    this.rolevalueChange();
  }

  onOpChange() {
    const value = this.getOpType.value;
    this.showDropdown = true;
    this.getNameList(value === 'both' ? -1 : value, this.getRole.value.roleName);
    this.userListForm.controls.name.reset();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  get getActiveFrom() {
    return this.userListForm.controls.activeFrom;
  }

  get getActiveTo() {
    return this.userListForm.controls.activeTo;
  }

  get getStatus() {
    return this.userListForm.controls.status;
  }

  get getRole() {
    return this.userListForm.controls.role;
  }

  get getName() {
    return this.userListForm.controls.name;
  }

  get getOpType() {
    return this.userListForm.controls.operationType;
  }

  checkToDate() {
    if (
      this.getActiveTo.value &&
      this.getActiveTo.value < this.getActiveFrom.value
    ) {
      this.getActiveTo.reset();
    }
  }

  onChangeNames() {
    this.updateMultiSelectLabels();
  }

  updateMultiSelectLabels() {
    if (this.usersSelect) {
      this.usersSelect.updateLabel = function() {
        if (this.value && this.value !== undefined && this.value !== null) {
          const statusLabel = this.value.length.toString() + " Users Selected";
          this.valuesAsString = statusLabel;
        } else {
          const statusLabel = "Select User(s)";
          this.valuesAsString = statusLabel;
        }
      };
    }
  }

  submit() {
    if (this.userListForm.invalid) {
      return;
    }
    const { activeFrom, activeTo, status } = this.userListForm.value;
    let payload: any = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      status:
        this.role === "Manager" || this.role === "Claims Lead"
          ? status === "Active"
            ? true
            : status === "All"
            ? "All"
            : false
          : status
    };
    this.status = this.userListForm.get("status").value;
    if (this.role === "Administrator") {
      payload = {
        ...payload,
        roleId: this.getRole.value ? this.getRole.value.id : null,
        selectedUsedId:
          this.getName.value && this.getName.value.length > 0
            ? this.getName.value.map(val => val.id)
            : []
      };
      if (this.getRole.value && this.getRole.value.roleName === 'Manager' && this.isEnrollment) {
        payload = {
          ...payload,
          operationsType: this.getOpType.value === 'both' ? this.getOpType.value : this.getOpTypeName(this.getOpType.value)
        };
      }
      this.updateColumns(this.getRole.value, this.getName.value);
      this.showCountLead =
        this.getRole.value.roleName &&
        String(this.getRole.value.roleName).indexOf('Lead') > -1;
      this.showLeadCountManager =
        this.getRole.value.roleName &&
        this.getRole.value.roleName === "Manager";
    }
    this.leadCount = null;
    this.examinerCount = null;
    this.specialistCount = null;
    this.reportService.getUserListReportData(payload).subscribe(
      res => {
        this.reportLoaded = true;
        if (res) {
          if (Array.isArray(res)) {
            this.reportData = res;
          } else {
            this.leadCount = res.leadCount;
            this.examinerCount = res.examinerCount;
            this.reportData = res.userListDtoList;
            this.specialistCount = res.specialistCount;
          }
        } else {
          this.reportData = [];
        }
      },
      err => {
        this.reportLoaded = false;
        this.reportData = [];
      }
    );
  }

  getFormattedDate(date, twisted = false) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return twisted
      ? year + "-" + month + "-" + day
      : month + "/" + day + "/" + year;
  }

  downloadExcel() {
    const { activeFrom, activeTo, status } = this.userListForm.value;
    let payload: any = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      status:
        this.role === "Manager" || this.role === "Claims Lead"
          ? status === "Active"
            ? true
            : status === "All"
            ? "All"
            : false
          : status
    };
    if (this.role === "Administrator") {
      payload = {
        ...payload,
        roleId: this.getRole.value ? this.getRole.value.id : null,
        selectedUsedId:
          this.getName.value && this.getName.value.length > 0
            ? this.getName.value.map(val => val.id)
            : []
      };
    }
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    this.reportService.getUserListReports(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: "success",
        message: "Report is generated."
      });
      const responseBody = res.body;
      const blob = new Blob([responseBody], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const today = new Date();
      const dateString = this.datePipe.transform(today, "MMddyyyy");
      const fileName = this.getFileName(dateString);
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }

  getNameList(roleWorkItemType: string, roleName: string) {
    this.userManagementService
      .getUserNameList(roleName, roleWorkItemType)
      .subscribe(res => {
        if (res) {
          const userList: any[] = res.users;
          userList.forEach(user => {
            this.nameList.push({
              label: `${user.firstName} ${user.lastName}`,
              value: user
            });
          });
          const selectedScopes = [];
          this.nameList.forEach(item => selectedScopes.push(item.value));
          this.userListForm.get("name").setValue(selectedScopes);
          this.updateMultiSelectLabels();
        } else {
          this.nameList = [];
        }
      });
  }

  getFileName(dateString: string) {
    let fileName = "";
    if (this.role !== "Administrator") {
      fileName =
        this.status === "Active"
          ? "Active-" + dateString + ".xlsx"
          : this.status === "All"
          ? "All-" + dateString + ".xlsx"
          : "Inactive-" + dateString + ".xlsx";
      return fileName;
    }
    const roleSelected = this.getRole.value;
    const nameList = this.getName.value || [];
    return roleSelected && roleSelected.roleName !== "All"
      ? nameList.length > 0
        ? `Associates Under ${roleSelected.roleName}-${dateString}.xlsx`
        : `${roleSelected.roleName} Users List-${dateString}.xlsx`
      : `All Users Report-${dateString}.xlsx`;
  }

  updateColumns(val, users?) {
    const filteredColumns = [...this.adminPreColumns.filter(col => col.field !== "role"), ...this.adminSufColumns];
    if (val) {
      if (users && users.length > 0) {
        switch (val.roleName) {
          case "Claims Lead":
            this.columns = [
              ...this.adminPreColumns, ...this.adminSufColumns,
              { field: "proficiency", header: "Proficiency" }
            ];
            break;
          case "Claims Examiner":
            this.columns = [
              ...this.adminPreColumns, ...this.adminSufColumns,
              { field: "userGroup", header: "User Group Type" }
            ];
            break;
          case "Enrollment Lead":
            this.columns = [
              ...this.adminPreColumns, ...this.adminSufColumns,
              { field: "proficiency", header: "Proficiency" }
            ];
            break;
          case "Enrollment Specialist":
            this.columns = [
              ...this.adminPreColumns, ...this.adminSufColumns,
              { field: "userGroup", header: "User Group Type" }
            ];
            break;
          case "Manager":
            this.columns = [...this.adminPreColumns, {field:"operationsType", header: "Operations Type"}, ...this.adminSufColumns];
            break;
          default:
            this.columns = [
              ...this.adminPreColumns, ...this.adminSufColumns
            ];
            break;
        }
      } else {
        switch (val.roleName) {
          case "Claims Lead":
            this.columns = [...filteredColumns];
            break;
          case "Claims Examiner":
            this.columns = [...filteredColumns];
            break;
          case "All":
            this.columns = [...this.adminPreColumns, ...this.adminSufColumns];
            break;
          case "Manager":
            this.columns = [...this.adminPreColumns, {field:"operationsType", header: "Operations Type"}, ...this.adminSufColumns];
            break;
          default:
            this.columns = [...filteredColumns];
            break;
        }
      }
    } else {
      this.columns = [...this.adminPreColumns, ...this.adminSufColumns];
    }
  }

  getOperationTypes() {
    this.authService.getOperationType().subscribe((res) => {
      this.operationTypes = res || [];
    });
  }

  getOpTypeName(id) {
    const filtered = this.operationTypes.filter(e => String(e.id) === String(id));
    return filtered[0] ? filtered[0].name : '';
  }
}
