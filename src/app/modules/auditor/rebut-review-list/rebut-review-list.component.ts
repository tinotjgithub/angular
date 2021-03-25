import { Component, OnInit } from '@angular/core';
import { ReviewService } from 'src/app/services/review/review.service';

@Component({
  selector: 'app-rebut-review-list',
  templateUrl: './rebut-review-list.component.html'
})
export class RebutReviewListComponent implements OnInit {

  public tableData: any[];

  public cols: any[];

  public selectedClaims: any[] = [];
  public frozenCol: { field: string; header: string; }[];
  public claimsType: any;

  constructor(
    private reviewService: ReviewService,
  ) { }

  ngOnInit() {
    this.setCols();
    this.getQueueList();
  }
  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", filter: 'text' },
      { field: "reviewRebutStatus", header: "Review/Rebut", filter: 'text' },
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
      { field: "auditDate", header: "Audit Date", filter: 'text'  },
      { field: "errorType", header: "Error Type", filter: 'dropdown'  },
      { field: "errorDesc", header: "Error Description", filter: 'text'  },
      { field: "financialImpact", header: "Financial Impact", filter: 'dropdown'  },
      { field: "amount", header: "Amount ($)", filter: 'text'  }
    ];
  }

  getQueueList() {
    this.tableData = [];
    this.reviewService.getRebuttalList().subscribe(res => {
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
