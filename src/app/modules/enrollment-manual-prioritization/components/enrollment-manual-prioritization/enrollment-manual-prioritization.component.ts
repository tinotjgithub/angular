import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { ViewChild, OnChanges } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { NotifierService } from "src/app/services/notifier.service";
import { SelectItem, FilterUtils } from "primeng/api";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { ConfirmationService } from "primeng/api";
import { Table } from "primeng/table";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { FalloutReconAssignmentService } from "src/app/modules/enrollment-ops/enrollment-lead/fallout-recon-assignment/services/fallout-recon-assignment.service";
import { EnrollmentManualPrioritizationService } from "../../services/enrollment-manual-prioritization.service";

@Component({
  selector: "app-enrollment-manual-prioritization",
  templateUrl: "./enrollment-manual-prioritization.component.html",
  styleUrls: ["./enrollment-manual-prioritization.component.css"]
})
export class EnrollmentManualPrioritizationComponent
  implements OnInit, OnChanges {
  @ViewChild("dt", { static: false }) dt: Table;
  selectedValues: any[] = [];
  public cols: {
    field: string;
    header: string;
    visible?: boolean;
    filter?: string;
    link?: boolean;
  }[];
  searchField: SelectItem;
  public allCheckbox: boolean;
  public assign: boolean;
  public userGroups: any[];
  public selectedUserGroups: any[];
  public selectedExaminers: any[];
  public assignableClaims: any[];
  public prioritizeAndAssign: boolean;
  workCategories: any = [];
  selectedWorkCategory: { id: string; name: string };
  showLoading = false;
  addUserGroup: any;
  public dialogForm: FormGroup;
  public reprioritizeForm: FormGroup;
  checkedMessage: any;
  userGroupResponseDto: any;
  specialistList: {
    label: any;
    assignedCount: any;
    pendedCount: any;
    value: any;
  }[];
  priorityLevels: any[];
  prioritize = false;
  public userGroupList = [];
  selectedAll: boolean;
  unAssignedSubscriptions = [];
  showFilter: boolean;
  examiners: any[];
  constructor(
    private messageService: NotifierService,
    private taskManagementService: TaskmanagementService,
    private userManagementService: UserManagementService,
    private enrollmentManagementService: EnrollmentManagementService,
    private falloutReconAssignmentService: FalloutReconAssignmentService,
    private fb2: FormBuilder,
    private enrollmentManualPrioritizationService: EnrollmentManualPrioritizationService
  ) {}

  ngOnInit() {
    this.setCols();
    this.initilaizeForm();
    this.setFilterConfig();
    this.getWorkCategories();
  }

  ngOnChanges() {
    this.showFilter = this.cols && this.cols.some(e => e.filter);
  }

  getOptions(col, tableData) {
    const data: any[] =
      tableData && tableData.length > 0
        ? tableData
            .map(c => c[col.field])
            .filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }

  select(event) {
    const subscriptionId = event.data.subscriptionId;
    const claims = [...this.unAssignedSubscriptions].filter(item => {
      return item.subscriptionId === subscriptionId && item.assigned !== "Yes";
    });
    this.selectedValues.push(...claims);
    this.selectedValues = [...new Set(this.selectedValues)];
    this.selectedAll = this.isAllSelected();
  }

  unSelect(event) {
    const subscriptionId = event.data.subscriptionId;
    this.selectedValues = this.selectedValues.filter(item => {
      return item.subscriptionId !== subscriptionId;
    });
    this.selectedAll = this.isAllSelected();
  }

  selectRow(checkValue) {
    if (checkValue) {
      this.selectedValues = [...this.unAssignedSubscriptions];
    } else {
      this.selectedValues = [];
    }
    this.selectedAll = this.isAllSelected();
  }

  isAllSelected() {
    const all = this.unAssignedSubscriptions.length;
    const selected = this.selectedValues.length;
    return all === selected;
  }

  assignSubs() {
    const stagingIds =
      this.selectedValues && this.selectedValues.length > 0
        ? this.selectedValues.map(item => {
            return item.stagingId;
          })
        : [];

    const {
      userGroup,
      specialistName,
      priority,
      comments
    } = this.dialogForm.value;

    // CREATE REQ
    const payload = {
      stagingIds,
      userGroupIds: userGroup ? userGroup.map(el => el.id) : [],
      specialists: specialistName ? specialistName.map(el => el.id) : [],
      priorityLevel: priority,
      comments
    };

    this.falloutReconAssignmentService.saveDetails(payload).subscribe(res => {
      this.addUserGroup = false;
      this.selectedAll = false;
      this.selectedValues = [];
      if (res) {
        this.loadSubs();
      }
      this.messageService.throwNotification({
        type: "success",
        message: "Subscriptions Assigned Successully."
      });
    });
  }

  doReprioritize() {
    const stagingIds =
      this.selectedValues && this.selectedValues.length > 0
        ? this.selectedValues.map(item => {
            return item.stagingId;
          })
        : [];

    const { priority, comments } = this.reprioritizeForm.value;

    // CREATE REQ
    const payload = {
      stagingIds,
      priorityLevel: priority,
      comments
    };

    this.enrollmentManualPrioritizationService
      .reprioritize(payload)
      .subscribe(res => {
        this.prioritize = false;
        this.selectedAll = false;
        this.selectedValues = [];
        this.messageService.throwNotification({
          type: "success",
          message: "Subscriptions Assigned Successully."
        });

        this.loadSubs();
      });
  }

  initilaizeForm() {
    this.dialogForm = this.fb2.group({
      userGroup: ["", [Validators.required]],
      specialistName: [[], [Validators.required]],
      priority: ["Low", [Validators.required]],
      comments: [""]
    });
    this.reprioritizeForm = this.fb2.group({
      priority: ["Low", [Validators.required]],
      comments: [""]
    });
  }

  assignClick() {
    if (this.selectedValues.length > 0) {
      const stagingIds = this.selectedValues.map(el => {
        return el.stagingId;
      });
      this.falloutReconAssignmentService
        .getUsergrpAndItsSpecialists(stagingIds)
        .subscribe(res => {
          this.userGroupResponseDto = res.userGroupResponseDtos;
          this.userGroupList = res.userGroupResponseDtos
            ? this.mapUserGroups(res.userGroupResponseDtos)
            : [];
        });
      this.addUserGroup = true;
      this.dialogForm.patchValue({
        priority: "Low"
      });
      this.enrollmentManualPrioritizationService
        .getPriorityLevels()
        .subscribe(res => {
          this.priorityLevels = res;
        });
    } else {
      this.messageService.throwNotification({
        type: "warning",
        message: "No subscriptions selected"
      });
    }
  }

  mapUserGroups(userGrps = []) {
    return userGrps.map(el => {
      return { id: el.id, name: el.name };
    });
  }

  cancelChanges() {
    this.dialogForm.reset();
    this.addUserGroup = false;
  }

  cancelPrioritization() {
    this.reprioritizeForm.reset();
    this.prioritize = false;
  }

  onChangeUserGrp() {
    const usergrpVal: any[] = this.dialogForm.get("userGroup").value.map(el => {
      return el.id;
    });
    const currentUserGrpDetails =
      this.userGroupResponseDto && this.userGroupResponseDto.length > 0
        ? this.userGroupResponseDto.filter(element => {
            return usergrpVal.includes(element.id);
          })
        : [];
    const specialistArray = [];
    currentUserGrpDetails.map(e => {
      specialistArray.push(...e.specialists);
    });
    this.specialistList = specialistArray.map(e => {
      return {
        label: e.name,
        assignedCount: e.assignedCount,
        pendedCount: e.pendedCount,
        value: e
      };
    });
  }

  getWorkCategories() {
    this.enrollmentManagementService.getUserWorkItemTypes().subscribe(res => {
      this.workCategories = res;
    });
  }

  setCols() {
    this.cols = [
      { field: "subscriptionId", header: "Subscription ID", filter: "text" },
      { field: "priority", header: "Priority" },
      { field: "receiptDate", header: "Receipt Date", filter: "text" },
      { field: "recordAge", header: "Record Age (In Days)", filter: "text" },
      { field: "subscriberName", header: "Subscriber Name" },
      { field: "memberId", header: "Member ID", filter: "text" },
      { field: "memberName", header: "Member Name" },
      { field: "benefitPlanName", header: "Benefit Plan Name", filter: "text" },
      { field: "memberGroupId", header: "Member Group ID" },
      { field: "memberGroupName", header: "Member Group Name", filter: "text" },
      { field: "queueName", header: "Queue Name", filter: "text" }
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

  reprioritize() {
    this.reprioritizeForm.patchValue({
      priority: "Low"
    });
    this.enrollmentManualPrioritizationService
      .getPriorityLevels()
      .subscribe(res => {
        this.priorityLevels = res;
      });
    this.prioritize = true;
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
        }
      });
  }

  loadSubs() {
    this.selectedValues = [];
    this.selectedAll = false;
    const { name: workCategory } = this.selectedWorkCategory;
    this.showLoading = true;
    this.enrollmentManualPrioritizationService
      .loadSubs(workCategory)
      .subscribe(res => {
        this.showLoading = false;
        this.unAssignedSubscriptions = res;
      });
  }
}
