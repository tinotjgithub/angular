import { Component, OnInit, ViewChild } from "@angular/core";
import { NotifierService } from "src/app/services/notifier.service";
import { SelectItem, FilterUtils } from "primeng/api";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { ConfirmationService } from "primeng/api";
import { Table } from "primeng/table";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
@Component({
  selector: "app-reprioritize",
  templateUrl: "./reprioritize.component.html",
  providers: [ConfirmationService]
})
export class ReprioritizeComponent implements OnInit {
  @ViewChild("dt", { static: false }) dt: Table;
  searchFields: SelectItem[];
  searchValue: string;
  gridData: any;
  selectedValues: any[] = [];
  cols: { field: string; header: string }[];
  searchField: SelectItem;
  public allCheckbox: boolean;
  public assign: boolean;
  public userGroups: any[];
  public examiners: any[];
  public selectedUserGroups: any[];
  public selectedExaminers: any[];
  public assignableClaims: any[];
  public prioritizeAndAssign: boolean;

  constructor(
    private messageService: NotifierService,
    private taskManagementService: TaskmanagementService,
    private confirmationService: ConfirmationService,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit() {
    this.searchFields = this.taskManagementService.getReprioritizeSearchFields();
    this.setCols();
    this.initializePage();
    this.setFilterConfig();
  }

  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "userGroupName", header: "User Group Name" },
      { field: "memberId", header: "Member Id" },
      { field: "memberName", header: "Member Name" },
      { field: "providerName", header: "Provider Name" },
      { field: "taxId", header: "Tax Id" },
      { field: "memberGroupName", header: "Member Group Name" },
      { field: "taskStatus", header: "Status" }
    ];
  }

  setFilterConfig() {
    FilterUtils[`custom`] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === "") {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return Number(filter) > value;
    };
  }

  initializePage() {
    this.selectedValues = [];
    this.searchValue = "";
    this.searchField = { label: "Claim Id", value: "claimId" };
    this.getUnassignedReprioritizeList();
  }

  getUnassignedReprioritizeList() {
    this.taskManagementService
      .getUnassignedReprioritizeList()
      .subscribe(res => {
        this.gridData = res.claimDetails;
      });
  }

  setSearchField(value) {
    this.searchValue = "";
    this.searchField = this.searchFields.filter(item => {
      return item.value === value;
    })[0];
  }

  checkEmpty() {
    if (this.searchValue === "") {
      this.getUnassignedReprioritizeList();
    }
  }

  prepareParams(selectedValues: any[]) {
    const claimsArray: any[] = [];
    selectedValues.forEach(element => {
      const { id } = element;
      claimsArray.push({
        id,
        status: true
      });
    });
    return claimsArray;
  }

  submitSearch() {
    if (this.searchValue === "") {
      this.messageService.throwNotification({
        type: "warning",
        message: "Please put in a value to search!"
      });
    } else {
      const param = {
        claimId: this.searchField.value === "claimId" ? this.searchValue : null,
        groupName:
          this.searchField.value === "groupName" ? this.searchValue : null,
        memberId:
          this.searchField.value === "memberId" ? this.searchValue : null,
        memberName:
          this.searchField.value === "memberName" ? this.searchValue : null,
        providerName:
          this.searchField.value === "providerName" ? this.searchValue : null,
        taxId: this.searchField.value === "taxId" ? this.searchValue : null,
        status: this.searchField.value === "status" ? this.searchValue : null
      };
      this.taskManagementService
        .getPriorityListBySearch(param)
        .subscribe(res => {
          this.gridData = res.claimDetails;
        });
    }
  }

  reprioritize() {
    if (this.selectedValues.length === 0) {
      this.messageService.throwNotification({
        type: "warning",
        message: "Please select Claim ID's to Prioritize"
      });
      return;
    }
    const filtered = this.selectedValues.filter(e => e.claimPriorityStatus);
    if (filtered.length > 0) {
      this.confirmationService.confirm({
        message: "Please select only un-prioritized claims for prioritization.",
        acceptVisible: false,
        rejectLabel: "OK"
      });
    } else {
      this.confirmationService.confirm({
        message:
          "Are you sure that you want to Prioritize the selected Claim Ids?",
        accept: () => {
          this.doReprioritize();
        },
        acceptVisible: true,
        rejectLabel: "No"
      });
    }
  }

  doReprioritize() {
    const param = this.prepareParams(this.selectedValues);
    this.taskManagementService.reprioritizeClaims(param).subscribe(res => {
      this.allCheckbox = false;
      this.messageService.throwNotification({
        type: "success",
        message: "Claims Prioritized Successfully."
      });
      this.resetTable(this.dt);
      this.initializePage();
    });
  }

  resetTable(table) {
    if (table) {
      table.reset();
    }
  }

  getReprioritizableClaims(array: any[]) {
    return array
      ? array.filter(e => {
          return (
            e &&
            e.taskStatus !== "COMPLETED" &&
            e.taskStatus !== "PENDED" &&
            e.taskStatus !== "ROUTED" &&
            e.taskStatus !== "ASSIGNED"
          );
        })
      : [];
  }

  selectReprioritizableClaims(array, val) {
    if (val) {
      this.selectedValues = this.getReprioritizableClaims(array);
      this.allCheckbox = true;
    } else {
      this.selectedValues = [];
      this.allCheckbox = false;
    }
  }

  checkAll(array: any[]) {
    if (
      this.selectedValues.length === this.getReprioritizableClaims(array).length
    ) {
      this.allCheckbox = true;
    } else {
      this.allCheckbox = false;
    }
  }

  assignClaims() {
    this.assignableClaims = this.selectedValues;
    this.getUsergroups();
    this.assign = true;
  }

  getUsergroups() {
    const claimIds = this.assignableClaims.map(e => e.id);
    this.userGroups = [];
    this.selectedUserGroups = [];
    this.userManagementService
      .getUsergroupsPrioritize(claimIds)
      .subscribe(res => {
        this.userGroups = res || [];
        this.selectedUserGroups = this.userGroups;
        this.getExaminers();
      });
  }

  getExaminers() {
    const userGroupIds = this.selectedUserGroups.map(e => e.userGroupId);
    this.examiners = [];
    this.selectedExaminers = [];
    this.userManagementService
      .getExaminerPrioritize(userGroupIds)
      .subscribe(res => {
        const vals: any[] = res || [];
        this.examiners = vals.map(e => {
          return {
            label: e.examinerName,
            value: e
          };
        });
        this.selectedExaminers = vals;
      });
  }

  // assignClaimsToQueue() {
  //   const payload = {
  //     assignClaimsDtos: [...this.assignableClaims],
  //     examinerUserGroupDtos: [...this.selectedExaminers],
  //     userGroupDtos: [...this.selectedUserGroups],
  //   };
  //   this.taskManagementService.repioritizeAssign(payload, this.prioritizeAndAssign).subscribe(res => {
  //     this.messageService.throwNotification({
  //       type: "success",
  //       message: `Claim ${this.prioritizeAndAssign ? 'Prioritized &' : ''} Assigned to the User(s).`,
  //     });
  //     if (res && res.length > 0) {
  //       this.selectedValues = [];
  //       this.assignableClaims = res;
  //       this.getUsergroups();
  //     } else {
  //       this.assignableClaims = [];
  //       this.assign = false;
  //       this.prioritizeAndAssign = false;
  //       this.initializePage();
  //     }
  //   });
  // }

  assignClaimsToQueue() {
    const payload = {
      assignClaimsDtos: [...this.assignableClaims],
      examinerUserGroupDtos: [...this.selectedExaminers],
      userGroupDtos: [...this.selectedUserGroups]
    };
    this.taskManagementService
      .repioritizeAssign(payload, this.prioritizeAndAssign)
      .subscribe(res => {
        this.messageService.throwNotification({
          type: "success",
          message: `Claim ${
            this.prioritizeAndAssign ? "Prioritized &" : ""
          } Assigned to the User(s).`
        });
        if (res && res.length > 0) {
          this.selectedValues = [];
          this.assignableClaims = res;
          this.getUsergroups();
        } else {
          this.assignableClaims = [];
          this.assign = false;
          this.initializePage();
        }
      });
  }
}
