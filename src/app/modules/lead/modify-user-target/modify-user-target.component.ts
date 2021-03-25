import { Component, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { DatePipe } from "@angular/common";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { Subscription } from "rxjs";
import { ModifyUserTargetModel } from 'src/app/services/task-management/models/modifyUserTargetModel';

@Component({
  selector: "app-modify-user-target",
  templateUrl: "./modify-user-target.component.html",
  styleUrls: ["./modify-user-target.component.css"]
})
export class ModifyUserTargetComponent implements OnInit {
  public col: any[];
  public userList: any[];
  public filteredUserList: any[];
  private selectedUsers: any[] = [];
  public filterType: string;
  public filterValue: string;
  @ViewChild("userTable", { static: false })
  private userTable: Table;
  public editMode: boolean;
  public editUser: any;
  private rolesList: any[] = [];
  private managers: any[] = [];
  public searchDone: boolean;
  public userGroups: any[];
  private modifyUserTargetSubscription: Subscription;
  modifUserTargetModel: ModifyUserTargetModel;

  constructor(
    private messageSercvice: MessageService,
    private authService: AuthenticationService,
    private router: Router,
    private userManagementService: UserManagementService,
    private datePipe: DatePipe,
    private taskmanagementService: TaskmanagementService
  ) {}

  ngOnInit() {
    this.editMode = false;
    this.initiateTable();
  }

  private initiateTable() {
    this.col = [
      { field: "firstName", header: "First Name" },
      { field: "lastName", header: "Last Name" },
      // { field: "communicationEmail", header: "Email" },
      { field: "dateOfBirth", header: "Date of Birth" },
      { field: "userName", header: "User Name" },
      { field: "role", header: "Role" },
      { field: "status", header: "Status" },
      { field: "activeDate", header: "Active Date" },
      { field: "deactivateDate", header: "Deactive Date" },
      { field: "ldapOrLocal", header: "LDAP/Local" },
      { field: "userGroupName", header: "User Group" },
      { field: "target", header: "Target Count" },
      // { field: "userTarget", header: "User Target" },
      // { field: "Edit", header: "Edit" }
      // { field: "leadUserId", header: "Claims Lead Name" },
      // { field: "managerName", header: "Manager Name" },
    ];
    this.filterType = "userName";
  }

  selectUser(event, user) {
    if (event.target.checked) {
      this.selectedUsers = [...this.selectedUsers, user];
    } else {
      this.selectedUsers = [
        ...this.selectedUsers.filter(u => {
          return u.userName !== user.userName;
        })
      ];
    }
    console.log(this.selectedUsers);
  }

  isSelected(user) {
    if (this.selectedUsers.length > 0) {
      const filtered = this.selectedUsers.filter(
        u => u.userName === user.userName
      );
      return filtered.length > 0;
    }
    return false;
  }

  filterChange() {
    this.filterValue = "";
    this.filteredUserList = this.userList;
  }

  search() {
    if (this.filterType && this.filterValue) {
      this.modifyUserTargetSubscription = this.taskmanagementService
        .modifyUserTarget(this.filterType, this.filterValue)
        .subscribe(
          res => {
            this.searchDone = true;
            if (res) {
              this.userList = [...res];
            } else {
              this.userList = [];
            }
          },
          err => {
            this.searchDone = true;
            this.userList = [];
          }
        );
      this.userTable.reset();
    } else {
      this.userList = [];
    }
  }

  openEdit(user) {
    this.editMode = true;
    this.editUser = user;
  }

  /* getRoleName(roleId: number) {
    const roleObj = this.rolesList.filter(r => {
      return String(r.id) === String(roleId);
    });
    const roleName = roleObj.length > 0 ? roleObj[0].roleName : "";
    return roleName || roleId;
  }

  getManagerName(managerId: number) {
    const managerObj = this.managers.filter(r => {
      return String(r.id) === String(managerId);
    });
    const managerName =
      managerObj.length > 0
        ? `${managerObj[0].firstName} ${managerObj[0].lastName}`
        : "";
    return managerName || managerId;
  }

  getUserGroupName(userGroupId: number) {
    const userGroupObj = this.userGroups.filter(r => {
      return String(r.groupId) === String(userGroupId);
    });
    const userGroupName =
      userGroupObj.length > 0 ? userGroupObj[0].groupName : "";
    return userGroupName || userGroupId;
  } */

  navigateToAdd() {
    this.router.navigateByUrl("/UserConfig/add-user?returnEdit=true");
  }

  onUpdateSucces() {
    this.editMode = false;
    this.search();
  }

  downloadReport() {
    this.userManagementService.downloadReport().subscribe(res => {
      const responseBody = res.body;
      const blob = new Blob([responseBody], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const today = new Date();
      const dateString = this.datePipe.transform(today, "MMddyyyy");
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, "Users_Report-" + dateString + ".xlsx");
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "Users_Report-" + dateString + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }

  onRowEditInit(columnName: ModifyUserTargetModel, rowIndex: number) {
    this.userList[rowIndex] = { ...columnName };
  }

  closeEdit() {
    this.editUser = null;
  }
}
