import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-audit-details-page',
  templateUrl: './audit-details-page.component.html'
})
export class AuditDetailsPageComponent implements OnInit {

  public tableData: any[];
  public cols: any[];
  public claimsType: any;

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
      { field: "assignmentType", header: "Assign Type", filter: 'dropdown' },
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
      { field: "auditDate", header: "Audit Date", filter: 'text'  },
    ];
    const suffixData = [
      { field: "errorType", header: "Error Type", filter: 'dropdown'  },
      { field: "errorDesc", header: "Error Description", filter: 'text'  },
      { field: "financialImpact", header: "Financial Impact", filter: 'text'  },
      { field: "amount", header: "Amount ($)", filter: 'text'  },
    ];
    if (this.claimsType === 'complete') {
      this.cols = [...this.cols, { field: 'auditStatus', header: 'Audit Status', filter: 'dropdown' }];
    }
    if (this.claimsType === 'failed' || this.claimsType === 'complete') {
      this.cols = [...this.cols, ...suffixData];
    }
  }

  getQueueList() {
    this.tableData = [];
    this.auditorService.getAuditQueueDetails(this.claimsType).subscribe(res => {
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

}
