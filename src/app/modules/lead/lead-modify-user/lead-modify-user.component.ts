import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { Table } from "primeng/table";
import { MessageService } from "primeng/api";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { maxTarget } from "./../../../shared/constants";
import { isNullOrUndefined } from "util";
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

@Component({
  selector: "app-lead-modify-user",
  templateUrl: "./lead-modify-user.component.html"
})
export class LeadModifyUserComponent implements OnInit {
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
  public searchDone: boolean;
  public userGroups: any[];
  public userRoleID: string = this.secureLocalStorage.getItem("roleId");
  public failed: boolean;
  @Output()
  public updateSuccess: EventEmitter<boolean> = new EventEmitter();
  public submitFailMessage: any;
  public leadTarget: Map<string, number> = new Map();
  public totalRecords: any;
  public currentPage: any;
  public allUserList: any[];
  public rows = 10;

  constructor(
    private messageService: MessageService,
    private userManagementService: UserManagementService,
    private taskManagementService: TaskmanagementService,
    private secureLocalStorage: CryptoService
  ) {}

  ngOnInit() {
    this.editMode = false;
    this.initiateTable();
    this.getAllusers(1, 10);
  }

  preventInput(event, rowData) {
    const value = rowData.target;
    if (value > maxTarget) {
      event.preventDefault();
      rowData.target = parseInt(value.toString().substring(0, 2), 10);
    }
  }

  public getAllusers(pageNo, rows) {
    const payload = {
      pageNo,
      pageSize: Number(rows)
    };
    this.userManagementService.getAllUsers(payload).subscribe(res => {
      if (res) {
        this.totalRecords = res.totalRecords;
        this.currentPage = pageNo;
        this.allUserList = res.users;
      }
    });
  }

  private initiateTable() {
    this.col = [
      { field: "fullName", header: "Full Name" },
      { field: "userName", header: "User Name" },
      { field: "role", header: "Role" },
      { field: "status", header: "Status" },
      { field: "activeDate", header: "Active Date" },
      { field: "deactivateDate", header: "Deactivate Date" },
      { field: "userGroups", header: "User Group" },
      { field: "target", header: "Target Count" },
      { field: "managerName", header: "Manager Name" },
    ];
    this.filterType = "user-name";
  }

  filterChange() {
    this.filterValue = "";
    this.filteredUserList = this.userList;
  }

  search() {
    if (this.filterType && this.filterValue) {
      this.userManagementService
        .leadModifyUserSearch(this.filterType, this.filterValue)
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
      this.resetTable(this.userTable);
    } else {
      this.userList = [];
    }
  }

  resetTable(table) {
    if (table) {
      table.reset();
    }
  }

  onRowEditInit(rowData: any, rowIndex: number, all?) {
    this.leadTarget.set(all ? `all${rowIndex}` : `${rowIndex}`, rowData.target);
  }

  onRowEditSave(rowData: any, rowIndex: number, all?) {
    if (isNullOrUndefined(rowData.target) || rowData.target === "") {
      this.messageService.add({
        key: "warnKey",
        severity: "warn",
        detail: "Please enter a valid numeric value!!",
        summary: "WARNING"
      });
      return;
    }
    const updateRequestBody = {
      userId: rowData.id,
      target: Number(rowData.target)
    };
    this.taskManagementService
      .leadModifyUserUpdate(updateRequestBody)
      .subscribe(
        () => {
          this.leadTarget.delete(all ? `all${rowIndex}` : `${rowIndex}`);
          this.failed = false;
          this.messageService.add({
            key: "successKey",
            severity: "success",
            detail: "User updated successfully!!",
            summary: "SUCCESS"
          });
          this.updateSuccess.emit(true);
        },
        err => {
          this.failed = true;
          const array = all ? this.allUserList : this.userList;
          array[rowIndex].target = this.leadTarget.get(all ? `all${rowIndex}` : `${rowIndex}`);
          this.leadTarget.delete(all ? `all${rowIndex}` : `${rowIndex}`);
          if (err.error && err.error.message && err.error.message !== "") {
            this.submitFailMessage = err.error.message;
          } else {
            this.submitFailMessage = "Updation failed please try again.";
          }
        }
      );
  }

  onRowEditCancel(rowData: any, rowIndex: number, all?) {
    const array = all ? this.allUserList : this.userList;
    array[rowIndex].target = this.leadTarget.get(all ? `all${rowIndex}` : `${rowIndex}`);
  }

  paginate(details) {
    this.getAllusers(details.page + 1, details.rows);
  }
}
