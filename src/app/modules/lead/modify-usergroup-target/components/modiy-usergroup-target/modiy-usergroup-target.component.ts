import { Component, OnInit } from "@angular/core";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { NotifierService } from "src/app/services/notifier.service";
import { maxTarget } from "./../../../../../shared/constants";

@Component({
  selector: "app-modiy-usergroup-target",
  templateUrl: "./modiy-usergroup-target.component.html"
})
export class ModiyUsergroupTargetComponent implements OnInit {
  userGroupList: any;
  clonedUserGroups: { [s: string]: any } = {};
  cols: any[];
  constructor(
    private service: UserManagementService,
    private messageService: NotifierService
  ) {}

  ngOnInit() {
    this.getUserGroupList();
    this.cols = [
      {field: 'groupName', header: 'User Group Name'},
      {field: 'description', header: 'Description'},
      {field: 'managerName', header: 'Manager Name'},
      {field: 'leadName', header: 'Claims Lead Name'},
      {field: 'queueName', header: 'Queue Name'},
      {field: 'userGroupType', header: 'User Group Type'},
      {field: 'target', header: 'Target Count'},
    ];
  }

  preventInput(event, rowData) {
    const value = rowData.target;
    if (value > maxTarget) {
      event.preventDefault();
      rowData.target = parseInt(value.toString().substring(0, 2), 10);
    }
  }

  getUserGroupList() {
    this.service.getUserGroupTargetList().subscribe(res => {
      this.userGroupList = res;
    });
  }

  editUserGrupTarget(data) {
    this.service.editUserGroupTarget(data).subscribe(res => {
      this.messageService.throwNotification({
        type: "success",
        message: "Target Modified Successfully"
      });
      this.getUserGroupList();
    });
  }

  onRowEditInit(data) {
    this.clonedUserGroups[data.groupId] = { ...data };
  }

  onRowEditCancel(data: any, index: number) {
    this.userGroupList[index] = this.clonedUserGroups[data.groupId];
    delete this.clonedUserGroups[data.groupId];
  }

  onRowEditSave(data: any, index: number) {
    if (!isNaN(data.target)) {
      if (
        (data.target % 1 !== 0) ||
        data.target.toString().includes("e") ||
        data.target.toString().includes("E")
      ) {
        this.messageService.throwNotification({
          type: "error",
          message: "Please enter a whole number as Target"
        });
        this.clearChange(index, data);
        return;
      }
      delete this.clonedUserGroups[data.groupId];
      this.editUserGrupTarget(data);
    } else {
      this.clearChange(index, data);
      this.messageService.throwNotification({
        type: "error",
        message: "Please enter a valid Number"
      });
    }
  }

  private clearChange(index: number, data: any) {
    this.userGroupList[index] = this.clonedUserGroups[data.groupId];
    delete this.clonedUserGroups[data.groupId];
  }
}
