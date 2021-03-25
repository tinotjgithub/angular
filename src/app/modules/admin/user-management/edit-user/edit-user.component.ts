import { Component, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { DatePipe } from "@angular/common";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html"
})
export class EditUserComponent implements OnInit {
  public col: any[];
  public userList: any[];
  public filteredUserList: any[];
  private selectedUsers: any[] = [];
  public filterType: string;
  public filterValue: string;
  @ViewChild("userAllTable", { static: false })
  private userTable: Table;
  public editMode: boolean;
  public editUser: any;
  public searchDone: boolean;
  public userGroups: any[];
  public userRoleID: string = this.secureLocalStorage.getItem("roleId");
  public addUser: boolean;
  public totalRecords: any;
  public allUserList: any[];
  public rows = 10;
  public currentPage: number;
  public currentRows: any;
  public type = 'Manager';
  public userLoading: boolean;
  public operationTypes: any;
  public operationTypesList: any[];
  public showTabs: {manager: boolean; claims: boolean; enrollment: boolean, tab: boolean};

  constructor(
    private messageSercvice: MessageService,
    private authService: AuthenticationService,
    private router: Router,
    private notifierService: NotifierService,
    private userManagementService: UserManagementService,
    private datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {}

  ngOnInit() {
    this.userLoading = true;
    this.setDefaultTabAndShowTabs();
    this.getOperationTypes();
    this.loadData();
  }

  setDefaultTabAndShowTabs() {
    let userType = '';
    let showManager = false;
    let tabs = false;
    if (this.userRoleID === 'Administrator') {
      showManager = true;
      userType = String(this.authService.adminType).toLowerCase();
      tabs = true;
    } else {
      showManager = false;
      userType = this.authService.managerType;
    }
    const showClaims = userType === 'claims' || userType === 'both';
    const showEnrollment = userType === 'enrollment' || userType === 'both';
    this.showTabs = {
      manager: showManager,
      claims: showClaims,
      enrollment: showEnrollment,
      tab: tabs || (showClaims && showEnrollment)
    };
    this.type = showManager ? 'Manager' : (showClaims ? 'Claims' : 'Enrollment');
  }

  private loadData() {
    this.editMode = false;
    this.initiateTable();
    this.getAllusers();
    // this.type === 'Manager' ? this.getAllManagers() : this.getAllusers(1, 10);
  }

  //Server Side Pagination
  /* public getAllusers(pageNo, rows) {
    const payload = {
      pageNo,
      pageSize: Number(rows),
      userType: this.type.toLowerCase()
    };
    this.allUserList = [];
    this.filteredUserList = [];
    this.userList = [];
    this.currentRows = rows;
    this.userManagementService.getAllUsers(payload).subscribe(res => {
      this.userLoading = false;
      if (res) {
        this.totalRecords = res.totalRecords;
        this.currentPage = pageNo;
        this.mapAllUsers(res.users);
      }
    }, err => {
      this.userLoading = false;
    });
  }
  public getAllManagers() {
    this.allUserList = [];
    this.filteredUserList = [];
    this.userList = [];
    this.userManagementService.getAllManagerUserList().subscribe(res => {
      this.userLoading = false;
      if (res) {
        this.totalRecords = res.length;
        this.mapAllUsers(res);
      }
    }, err => {
      this.userLoading = false;
    });
  } */

  public getAllusers() {
    this.allUserList = [];
    this.filteredUserList = [];
    this.userList = [];
    this.userManagementService.getAllUsers(this.type.toLowerCase()).subscribe(res => {
      this.userLoading = false;
      if (res) {
        this.mapAllUsers(res);
      }
    }, err => {
      this.userLoading = false;
    });
  }

  mapAllUsers(users) {
    users.forEach(users => {
      if (
        this.userRoleID === "Administrator" ||
        this.userRoleID === "Manager"
      ) {
        if (users.isAccountLocked === false) {
          users.isAccountLocked = "Open";
        } else {
          users.isAccountLocked = "Locked";
        }
      }
      this.mapOperationTypeForManager(users);
      this.allUserList.push(users);
      this.filterValue = null;
    });
  }

  // mapAllUsers(users) {
  //   users.forEach(users => {
  //     if (
  //       this.userRoleID === "Administrator" ||
  //       this.userRoleID === "Manager"
  //     ) {
  //       if (users.isAccountLocked === false) {
  //         users.isAccountLocked = "Open";
  //       } else {
  //         users.isAccountLocked = "Locked";
  //       }
  //     }
  //     this.allUserList.push(users);
  //     this.filterValue = null;
  //   });
  // }

  private initiateTable() {
    this.col = [
      { field: "id", header: "id", visible: false },
      { field: "fullName", header: "Full Name", visible: true },
      { field: "userName", header: "User Name", visible: true },
      { field: "role", header: "Role", visible: true, filter: "dropdown" },
      { field: "status", header: "Status", visible: true, filter: "dropdown" },
      { field: "activeDate", header: "Activation Date", visible: true },
      { field: "deactivateDate", header: "Deactivation Date", visible: true },
      { field: "managerName", header: "Manager Name", visible: true },
      { field: "userGroups", header: "User Group", visible: true },
      { field: "isAccountLocked", header: "Account Locked", visible: true }
      // { field: "leadUserId", header: "Claims Lead Name" },
    ];
    if (this.type === 'Manager') {
      this.col = this.col.filter(e => (e.field !== 'managerName')).map(f => {
        return f.field === 'role' ? {
          field: "operationType",
          header: "Operations Type",
          visible: true,
          filter: "dropdown"
        } : f;
      });
    }
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
    this.filteredUserList = this.allUserList;
  }

  /* Server Side Search */
  /* search() {
    if (this.filterType && this.filterValue) {
      // this.filteredUserList = this.userList.filter(u => {
      //   // return u[this.filterType] ? String(u[this.filterType]).toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1 : false;
      //   return String(u.userName).toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1;
      // });
      // if (this.userRoleID === "Administrator") {
        this.userManagementService
          .searchUser(this.filterType, this.filterValue, this.type)
          .subscribe(
            res => {
              this.searchDone = true;
              if (res && res.length > 0) {
                this.userList = [];
                res.forEach(users => {
                  users.isAccountLocked =
                    users.isAccountLocked === false ? "Open" : "Locked";
                  this.mapOperationTypeForManager(users);
                  this.userList.push(users);
                });
              } else {
                this.notifierService.throwNotification({
                  type: 'warning',
                  message: 'No users available.'
                });
                this.userList = [];
              }
            },
            err => {
              this.searchDone = true;
              this.userList = [];
            }
          );
      //  } else if (this.userRoleID === "Manager") {
      //   this.userManagementService
      //     .modifyUserTargetSearchUser(this.filterType, this.filterValue)
      //     .subscribe(
      //       res => {
      //         this.searchDone = true;
      //         if (res) {
      //           this.userList = [];
      //           res.forEach(users => {
      //             users.isAccountLocked =
      //               users.isAccountLocked === false ? "Open" : "Locked";
      //             this.userList.push(users);
      //           });
      //         } else {
      //           this.userList = [];
      //         }
      //       },
      //       err => {
      //         this.searchDone = true;
      //         this.userList = [];
      //       }
      //     );
      // } 
      this.refreshTable(this.userTable);
    } else {
      this.userList = [];
    }
  } */

  search(table: Table = this.userTable) {
    console.log(this.filterType, this.filterValue, table);
    if (this.filterType && this.filterValue) {
      table && table.filter(this.filterValue, this.filterType, 'contains');
    }
  }

  private mapOperationTypeForManager(users: any) {
    if (this.type === 'Manager') {
      const selectedIds: any[] = users.selectedOperationTypeIds || [];
      users.operationType = selectedIds.map(e => this.operationTypes[e]).join(', ');
    }
  }

  /* resetTableData(event) {
    const value = event.target.value;
    if (!value) {
      this.filteredUserList = this.userList;
    }
  } */

  openEdit(user) {
    this.editMode = true;
    this.editUser = user;
  }

  navigateToAdd() {
    this.router.navigateByUrl("/UserConfig/add-user?returnEdit=true");
  }

  onUpdateSucces() {
    this.editMode = false;
    if (!this.filterValue) {
      this.getAllusers();
    } else {
      this.search(this.userTable);
    }
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
        window.navigator.msSaveBlob(
          blob,
          "Users_Report-" + dateString + ".xlsx"
        );
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

  closeEdit() {
    this.editUser = null;
    this.refreshTable(this.userTable);
  }

  refreshTable(table: any) {
    if (table) {
      table.reset();
    }
  }

  /* paginate(details) {
    this.getAllusers(details.page + 1, details.rows);
  } */

  getGoingToDeactivate(dateString, status) {
    if (status === "Inactive") {
      return false;
    }
    const date = new Date(dateString);
    const today = new Date();
    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth()
    ) {
      return (
        date.getDate() - today.getDate() > 0 &&
        date.getDate() - today.getDate() < 8
      );
    }
    return false;
  }

  onRowSelect(rowData) {
    if (rowData.isAccountLocked === "Locked") {
      this.unLockUser(rowData.id);
    }
  }

  unLockUser(id) {
    const userId = id;
    this.userManagementService.unlockUsers(userId).subscribe(
      data => {
        this.notifierService.throwNotification({
          type: "success",
          message: "User unlocked successfully!"
        });
        this.getAllusers();
        this.refreshTable(this.userTable);
      },
      error => {
        this.notifierService.throwNotification({
          type: "error",
          message: "Failed to unlock user!"
        });
        return;
      }
    );
  }

  clearValues() {
    if (!this.filterValue) {
      this.userList = [];
      this.userTable.reset();
    }
  }

  scrollItemToView(id: string) {
    if( this.type !== id) {
      this.userLoading = true;
      this.type = id;
      this.currentPage = 1;
      this.loadData();
    }
  }

  getOperationTypes() {
    this.operationTypes = {};
    this.operationTypesList = [];
    this.authService.getOperationType().subscribe((res) => {
      this.operationTypesList = res;
      this.operationTypesList.forEach(opType => {
        this.operationTypes = {...this.operationTypes, [opType.id]: opType.name};
      });
    });
  }
  
  getOptions(col, list = []) {
    const data: any[] =
      list.length > 0
        ? list
            .map(c => c[col.field])
            .filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }
}
