import { Component, OnInit, OnDestroy } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { NotifierService } from "src/app/services/notifier.service";
import { ManualSamplingService } from "../../services/manual-sampling.service";
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
    private samplingService: ManualSamplingService
  ) {}

  ngOnInit() {
    this.getAuditorNames();
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "claimsAge", header: "Age (In Days)" },
      { field: "providerId", header: "Provider Id" },
      { field: "providerName", header: "Provider Name" },
      { field: "memberGroupCode", header: "Member Group Code" },
      { field: "memberGroupName", header: "Member Group Name" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "allowedAmount", header: "Allowed Amount ($)" },
      { field: "paidAmount", header: "Paid Amount ($)" },
      { field: "processedDate", header: "Processed Date" },
      { field: "examinerName", header: "Examiner Name" },
      { field: "claimQueueName", header: "Claim Queue" }
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
          "Are you sure that you want to Assign the selected Claim(s) to the Auditor?",
        accept: () => {
          this.assignClaimsToAuditor();
        }
      });
    }
  }

  assignClaimsToAuditor() {
    const param = {
      selectedAuditQueueClaims: this.selectedValues,
      selectedAuditor: this.auditor.id,
      selectedClaimsCount: this.selectedValues.length
    };
    const selectedClaims = this.selectedValues;
    this.samplingService.assignClaimsToAuditor(param).subscribe(() => {
      this.notifierService.throwNotification({
        type: "success",
        message: "Claim(s) assigned successfully"
      });
      this.removeAssignedClaimsFromGrid(selectedClaims);
    });
  }

  removeAssignedClaimsFromGrid(selectedClaims) {
    const array = selectedClaims.map(item => {
      return item.claimId;
    });
    this.gridData = this.samplingService.removeAssignedClaimsAndReturnAuidtQueue(
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
      this.filterDownClaimGrid(this.associatedUserGroups);
    });
  }

  filterDownClaimGrid(associatedUserGroups = []) {
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
