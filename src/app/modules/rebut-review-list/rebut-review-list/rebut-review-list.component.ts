import { Component, OnInit } from '@angular/core';
import { ReviewService } from 'src/app/services/review/review.service';
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

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
  public currentRole: string;

  constructor(
    private reviewService: ReviewService,
    private secureLocalStorage: CryptoService
  ) { }

  ngOnInit() {
    this.currentRole = this.secureLocalStorage.getItem('roleId');
    this.setCols();
    this.getQueueList();
  }
  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", filter: 'text' },
      { field: "auditFlowStatus", header: "Rebut/Accept", filter: 'dropdown' },
      { field: "claimType", header: "Claim Type", filter: 'dropdown'  },
      { field: "claimStatus", header: "Claim Status", filter: 'dropdown'  },
      { field: "receiptDate", header: "Receipt Date", filter: 'text'  },
      { field: "claimByAge", header: "Claim Age (In Days)", filter: 'text'  },
      { field: "providerName", header: "Provider Name"  },
      { field: "groupName", header: "Group Name", filter: 'text'  },
      { field: "billedAmount", header: "Billed Amount ($)", filter: 'text'  },
      { field: "allowedAmount", header: "Allowed Amount ($)", filter: 'text'  },
      { field: "totalPaidAmount", header: "Paid Amount ($)", filter: 'text'  },
      { field: "processedDate", header: "Processed Date" },
      { field: "queueName", header: "Queue Name" },
    ];
  }

  getQueueList() {
    this.tableData = [];
    if (this.currentRole === 'Claims Lead') {
      this.reviewService.getLeadReviewList().subscribe(res => {
        this.tableData = res || [];
      });
    } else {
      this.reviewService.getManagerReviewList().subscribe(res => {
        this.tableData = res || [];
      });
    }
  }

  getOptions(col) {
    const data: any[] =
      this.tableData.length > 0
        ? this.tableData.map((c) => c[col.field]).filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }
}
