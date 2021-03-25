import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-today-queue-backlog-summary',
  templateUrl: './today-queue-backlog-summary.component.html'
})
export class TodayQueueBacklogSummaryComponent implements OnInit {

  public tableData: any[];

  public cols: any[];

  public selectedClaims: any[] = [];
  public frozenCol: { field: string; header: string; }[];
  public claimsType: any;
  public delete: boolean;
  public reason: string;

  constructor(
    private route: ActivatedRoute,
    private auditorService: AuditorService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.claimsType = this.route.snapshot.queryParamMap.get('type');
    this.setCols();
    this.getQueueList();
  }
  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", filter: 'text' },
      { field: "assignType", header: "Assign Type", filter: 'dropdown' },
      { field: "claimType", header: "Claim Type", filter: 'dropdown'  },
      { field: "status", header: "Claim Status", filter: 'dropdown'  },
      { field: "receiptDate", header: "Receipt Date", filter: 'text'  },
      { field: "age", header: "Claim Age (In Days)", filter: 'text'  },
      { field: "providerName", header: "Provider Name", filter: 'text'  },
      { field: "memberGroupName", header: "Group Name", filter: 'text'  },
      { field: "billedAmount", header: "Billed Amount ($)", filter: 'text'  },
      { field: "allowedAmount", header: "Allowed Amount ($)", filter: 'text'  },
      { field: "paidAmount", header: "Paid Amount ($)", filter: 'text'  },
      { field: "processedDate", header: "Processed Date", filter: 'text'  },
      { field: "examinerName", header: "Examiner Name", filter: 'text'  },
      { field: "claimQueueName", header: "Queue Name", filter: 'text'  },
    ];
    if (this.claimsType === 'backlog') {
      this.cols = [...this.cols, { field: 'backlogAge', header: 'Backlog Age (In Days)', filter: 'text' }];
      this.cols = [...this.cols, { field: 'backlogStatus', header: 'Backlog Status', filter: 'dropdown' }];
    }
    this.frozenCol = [
      { field: "select", header: "Select" }
    ];
    this.cols = [ ...this.frozenCol, ...this.cols];
  }

  getQueueList() {
    this.tableData = [];
    this.auditorService.getQueueDetails(this.claimsType).subscribe(res => {
      this.tableData = res || [];
    });
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
    const ids = this.selectedClaims.map(c => c.taskId).join(',');
    const payload = {
      taskIds: ids,
      comments: this.reason
    };
    this.auditorService.deleteQueueDetails(payload).subscribe(res => {
      this.delete = false;
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claims are removed from queue'
      });
      this.selectedClaims = [];
      this.getQueueList();
    });
  }

}
