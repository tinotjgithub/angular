import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

@Component({
  selector: 'app-queue-page',
  templateUrl: './queue-page.component.html'
})
export class QueuePageComponent implements OnInit {

  public tableData: any[];

  public cols: any[];

  public selectedClaims: any[] = [];
  public frozenCol: { field: string; header: string; }[];
  public claimsType: any;
  public delete: boolean;
  public reason: string;
  public auditorNames: any[];
  public auditorName: any;
  private currentRole: string;
  public unassignedOrBacklogClaimCount: number;
  public auditorClaimListCount: number;
  private alreadyNameChanged: any;
  @ViewChild('dt', {static: false})
  public table: Table;
  public allCheckbox: boolean;

  constructor(
    private route: ActivatedRoute,
    private auditorService: AuditorService,
    private notifierService: NotifierService,
    private confirmationService: ConfirmationService,
    private secureLocalStorage: CryptoService
  ) { }

  ngOnInit() {
    this.claimsType = this.route.snapshot.queryParamMap.get('type');
    this.currentRole = this.secureLocalStorage.getItem('roleId');
    this.alreadyNameChanged = false;
    this.auditorName = '';
    this.setCols();
    this.getQueueList();
  }
  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", filter: 'text' },
      { field: "samplingType", header: "Sampling Type", filter: 'text' },
      { field: "assignmentStatus", header: "Assigned", filter: 'dropdown' },
      { field: "auditorName", header: "Auditor Name", filter: 'text'  },
      { field: "claimType", header: "Claim Type", filter: 'dropdown'  },
      { field: "status", header: "Claim Status", filter: 'dropdown'  },
      { field: "receiptDate", header: "Receipt Date", filter: 'text'  },
      { field: "age", header: "Claim Age (In Days)", filter: 'text'  },
      { field: "billedAmount", header: "Billed Amount ($)", filter: 'text'  },
      { field: "allowedAmount", header: "Allowed Amount ($)", filter: 'text'  },
      { field: "paidAmount", header: "Paid Amount ($)", filter: 'text'  },
      { field: "processedDate", header: "Processed Date", filter: 'text'  },
      { field: "examinerName", header: "Examiner Name", filter: 'text'  },
      { field: "claimQueueName", header: "Queue Name", filter: 'text'  }
    ];
    if (this.claimsType === 'backlog') {
      this.cols = [
        { field: "claimId", header: "Claim ID", filter: 'text' },
        { field: "samplingType", header: "Sampling Type", filter: 'text' },
        { field: "assignmentStatus", header: "Assigned", filter: 'dropdown' },
        { field: "auditorName", header: "Auditor Name", filter: 'text'  },
        { field: "claimType", header: "Claim Type", filter: 'dropdown'  },
        { field: "status", header: "Claim Status", filter: 'dropdown'  },
        { field: "receiptDate", header: "Receipt Date", filter: 'text'  },
        { field: "age", header: "Claim Age (In Days)", filter: 'text'  },
        { field: "billedAmount", header: "Billed Amount ($)", filter: 'text'  },
        { field: "allowedAmount", header: "Allowed Amount ($)", filter: 'text'  },
        { field: "paidAmount", header: "Paid Amount ($)", filter: 'text'  },
        { field: "processedDate", header: "Processed Date", filter: 'text'  },
        { field: "examinerName", header: "Examiner Name", filter: 'text'  },
        { field: "claimQueueName", header: "Queue Name", filter: 'text'  },
        // { field: "userGroupName", header: "UserGroup Name", filter: 'text'  },
        { field: 'backlogAge', header: 'Backlog Age (Days)', filter: 'text' },
      ];
    }
    this.frozenCol = [
      { field: "select", header: "Select" }
    ];
    this.cols = [ ...this.frozenCol, ...this.cols];
  }

  getQueueList() {
    this.tableData = [];
    this.auditorService.getQueueDetailsLeadManager(this.claimsType, this.currentRole).subscribe(res => {
      this.tableData = res || [];
      this.resetTable(this.table);
    });
    this.getUnassignedClaimsCountAndAuditorName();
  }

  getUnassignedClaimsCountAndAuditorName() {
    this.auditorService.getUnassignedClaimsCountAndAuditorsLeadManager(this.claimsType).subscribe((res) => {
      this.unassignedOrBacklogClaimCount = res ? res.unassignedCount : 0;
      this.auditorNames = res ? this.processAuditorName(res.assignedCountDtoList) : [];
    });
  }

  processAuditorName(res = []) {
    const auditors = [
      {
        value: null,
        label: 'Select',
        count: 'all'
      }
    ];
    res.forEach(e => {
      const obj = {
        value: e.userId,
        label: e.auditorName,
        count: e.assignedCount
      };
      auditors.push(obj);
    });
    return auditors;
  }

  getOptions(col) {
    const data: any[] =
      this.tableData.length > 0
        ? this.tableData.map((c) => c[col.field]).filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }

  toggleDelete(value) {
    this.delete = value;
    this.reason = null;
  }

  deleteClaimFromQueue() {
    const ids = this.selectedClaims.map(c => c.stagingId);
    const payload = {
      comments: this.reason,
      stagingIds: ids,
    };
    this.auditorService.deleteClaimLeadManager(payload).subscribe(res => {
      this.delete = false;
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claims are removed from queue'
      });
      this.selectedClaims = [];
      this.allCheckbox  = false;
      this.getQueueList();
    });
  }

  auditorNameChange(value) {
    if (value) {
      if (this.selectedClaims.length > 0 && !this.alreadyNameChanged) {
        this.alreadyNameChanged = true;
        this.confirmationService.confirm({
          message: `Do you want to proceed without deleting selected Claim(s).`,
          accept: () => {
            this.clearSelected();
            this.auditorNameClaimList(value);
            this.alreadyNameChanged = true;
          },
          reject: () => {
            this.auditorName = '';
            this.alreadyNameChanged = false;
          }
        });
      } else {
        this.selectedClaims = [];
        this.allCheckbox  = false;
        this.auditorNameClaimList(value);
        this.alreadyNameChanged = true;
      }
    } else {
      this.selectedClaims = [];
      this.allCheckbox  = false;
      this.alreadyNameChanged = false;
      this.auditorClaimListCount = 0;
      this.getQueueList();
    }
  }

  auditorNameClaimList(id) {
    this.auditorService.getAuditorClaimsLeadManager(id, this.claimsType).subscribe(res => {
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Auditor Claim details are loaded.'
      });
      if (res) {
        this.tableData = res.queueDetailDtoList;
        this.unassignedOrBacklogClaimCount = res.unAssignedCount;
        this.auditorClaimListCount = res.assignedCount;
      } else {
        this.tableData = [];
        this.unassignedOrBacklogClaimCount = 0;
        this.auditorClaimListCount = 0;
      }
      this.resetTable(this.table);
    });
  }

  clearSelected() {
    this.selectedClaims = [];
  }

  cancelAssign() {
    this.selectedClaims = [];
    this.auditorName = '';
    this.auditorClaimListCount = 0;
    this.allCheckbox = false;
    this.getQueueList();
  }

  selectAllUnassigned(checkValue) {
    if (checkValue) {
      this.selectedClaims = this.tableData.filter(value => {
        return !value.assignmentStatus || (value.assignmentStatus === 'No');
      });
    } else {
      this.selectedClaims = [];
    }
  }

  assignClaims() {
    const ids = this.selectedClaims.map(c => c.stagingId);
    const payload = {
      auditorId: Number(this.auditorName),
      stagingId: ids,
    };
    this.auditorService.assignClaims(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claims are assigned successfully'
      });
      this.selectedClaims = [];
      this.allCheckbox  = false;
      this.auditorNameClaimList(this.auditorName);
    });
  }

  resetTable(table) {
    if (table) {
      table.reset();
      // table.filter();
    }
  }

  getUnassignedClaims() {
    const array = (this.tableData && this.tableData.length > 0) ? this.tableData.filter(value => {
      return !value.assignmentStatus || (value.assignmentStatus === 'No');
    }) : [];
    return array;
  }

  checkAllSelected() {
    if ((this.selectedClaims.length > 0) && (this.getUnassignedClaims().length === this.selectedClaims.length)) {
      this.allCheckbox = true;
    }
  }

}
