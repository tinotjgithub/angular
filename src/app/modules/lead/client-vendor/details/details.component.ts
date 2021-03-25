import { Component, OnInit } from '@angular/core';
import { AuditClaimRoutingService } from 'src/app/modules/audit-claim-routing/services/audit-claim-routing.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: []
})
export class DetailsComponent implements OnInit {

  cols: { field: string; header: string }[];
  numberOfClaims: any = 0;
  public routeReasonOptions: Array<any> = [];
  roleId = "";
  selectedStatus: any;
  public queueList: any[];
  claimListLoaded: any[];
  public routeReasonOption: any;
  constructor(
    private taskManagementService: TaskmanagementService,
    private secureLocalStorage: CryptoService
  ) {}

  ngOnInit() {
    this.roleId = this.secureLocalStorage.getItem("roleId");
    this.getColumns();
    this.getRoutedClaims();
  }

  getColumns() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "movedDate", header: "Client/Vendor Queue Move Date" },
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "claimAge", header: "Claim Age (In Days)" },
      { field: "processedDate", header: "Processed Date" },
      { field: "examinerName", header: "Last Touched Examiner Name" },
      { field: "leadName", header: "Claims Lead Name" },
      { field: "userGroupName", header: "User Group Name" },
    ];
  }

  tableFilter(claimsTable, value, field, matchMode) {
    claimsTable.filter(value, field, matchMode);
  }

  getRoutedClaims() {
    this.queueList = [];
    this.taskManagementService
      .clientVendorQueue()
      .subscribe(queueList => {
        this.queueList = queueList;
      });
  }

}
