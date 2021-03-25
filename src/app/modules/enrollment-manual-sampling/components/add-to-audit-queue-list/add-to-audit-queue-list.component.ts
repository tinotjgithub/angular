import { Component, OnInit, OnDestroy } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { NotifierService } from "src/app/services/notifier.service";
import { EnrollmentManualSamplingService } from "../../services/enrollment-manual-sampling.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-add-to-audit-queue-list",
  templateUrl: "./add-to-audit-queue-list.component.html",
  providers: [ConfirmationService]
})
export class AddToAuditQueueListComponent implements OnInit, OnDestroy {
  cols;
  gridData: any[] = [];
  selectedValues: any[] = [];
  unassignedCount: any = 0;
  auditor: any = "";
  showAlert = false;
  auditorNames: any;
  assignedQueueCount = 0;
  associatedUserGroups: any[];
  showSpinner = false;
  constructor(
    private confirmationService: ConfirmationService,
    private notifierService: NotifierService,
    private samplingService: EnrollmentManualSamplingService
  ) {}

  ngOnInit() {
    this.getAuditorNames();
    this.cols = [
      { field: "subscriptionId", header: "Subscription ID" },
      { field: "specialistName", header: "Specialist Name" },
      { field: "transactionType", header: "Transaction Type" },
      { field: "processedDate", header: "Processed Date" },
      { field: "recordAge", header: "Record Age (In Days)" },
      { field: "subscriberName", header: "Subscriber Name" },
      { field: "memberGroupName", header: "Member Group Name" },
      { field: "memberId", header: "Member ID" },
      { field: "memberLastName", header: "Member Last Name" },
      { field: "memberFirstName", header: "Member First Name" },
      { field: "memberDob", header: "Member DOB" },
      { field: "subscriberRelationship", header: "Relation To Subscriber" },
      { field: "userGroupName", header: "User Group Name" }
    ];
    this.showSpinner = true;
    this.samplingService.loadAuditerQueueList().subscribe(res => {
      this.samplingService.setAuditorQueueList(res);
      this.gridData = res;
      this.showSpinner = false;
      this.unassignedCount = this.gridData.length;
    });
  }

  getAuditorNames() {
    this.samplingService.getAuditorNamesForRouteOut().subscribe(res => {
      this.auditorNames = res;
    });
  }

  assign() {
    if (this.selectedValues.length === 0 || this.auditor === "") {
      this.showAlert = true;
      return;
    } else {
      this.confirmationService.confirm({
        message:
          "Are you sure that you want to Assign the selected subscription(s) to the Auditor?",
        accept: () => {
          this.assignSubscriptionsToAuditor();
        }
      });
    }
  }

  assignSubscriptionsToAuditor() {
    const param = {
      selectedAuditQueueSubscriptions: this.selectedValues,
      selectedAuditor: this.auditor.id,
      selectedSubscriptionsCount: this.selectedValues.length
    };
    const selectedSubscriptions = this.selectedValues;
    this.samplingService.assignSubscriptionsToAuditor(param).subscribe(() => {
      this.notifierService.throwNotification({
        type: "success",
        message: "subscription(s) assigned successfully"
      });
      this.removeAssignedSubscriptionsFromGrid(selectedSubscriptions);
    });
  }

  removeAssignedSubscriptionsFromGrid(selectedSubscriptions) {
    const array = selectedSubscriptions.map(item => {
      return item.subscriptionId;
    });
    this.gridData = this.samplingService.removeAssignedSubscriptionsAndReturnAuidtQueue(
      array
    );
    this.initializePageAfterAssign();
  }

  initializePageAfterAssign() {
    this.selectedValues = [];
    this.assignedQueueCount = 0;
    this.showAlert = false;
    this.auditor = "";
  }

  change(event) {
    this.auditor = event.value;
    this.getAssociatedUserGroupsOfAuditor(this.auditor.id);
  }

  getAssociatedUserGroupsOfAuditor(id) {
    this.associatedUserGroups = [];
    this.samplingService.getAssociatedUserGroupsOfAuditor(id).subscribe(res => {
      this.associatedUserGroups = this.getAssociatedUserGroups(
        res.associatedUserGroupDetails
      );
      this.assignedQueueCount = res.auditQueueCountDetails;

      if (this.associatedUserGroups.length === 0) {
        this.setGridData([...this.samplingService.auditerQueueList]);
        return;
      }
      this.filterDownsubscriptionGrid(this.associatedUserGroups);
    });
  }

  filterDownsubscriptionGrid(associatedUserGroups = []) {
    const clonedData = [...this.samplingService.auditerQueueList];
    const filteredGrid = [];
    if (!isNullOrUndefined(clonedData)) {
      clonedData.forEach(item => {
        item.userGroups.forEach(userGrp => {
          if (associatedUserGroups.includes(userGrp.groupId)) {
            filteredGrid.push(item);
          }
        });
      });
    }
    this.setGridData(filteredGrid);
  }

  setGridData(filteredGrid: any[]) {
    this.selectedValues = [];
    this.gridData = filteredGrid;
  }

  getAssociatedUserGroups(userGroups: any[]) {
    const array = [];
    userGroups.forEach(item => {
      array.push(item.groupId);
    });
    return array;
  }

  ngOnDestroy(): void {
    this.samplingService.setnavigationEnabled(false);
  }
}
