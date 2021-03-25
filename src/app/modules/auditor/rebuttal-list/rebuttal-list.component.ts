import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-rebuttal-list',
  templateUrl: './rebuttal-list.component.html'
})
export class RebuttalListComponent implements OnInit {

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
      { field: "reviewRebutStatus", header: "Rebuttal/Review", filter: 'dropdown'  },
      { field: "claimType", header: "Claim Type", filter: 'dropdown'  },
      { field: "claimStatus", header: "Claim Status", filter: 'dropdown' },
      { field: "claimAge", header: "Claim Age (In Days)", filter: 'text'  },
      { field: "processedDate", header: "Processed Date", filter: 'text'  },
      { field: "errorDesc", header: "Error Description", filter: 'text'  },
    ];
    const commonSufix = [
      { field: "rebuttalLevel", header: "Rebuttal Level", filter: 'text'  },
      { field: "rebuttalDate", header: "Rebuttal Date", filter: 'text'  }
    ];
    if (this.claimsType === 'examiner') {
      this.cols = [
        ...this.cols,
        { field: "examinerName", header: "Examiner Name", filter: 'text'  },
        // { field: "rebuttalComment", header: "Examiner Rebuttal Comment", filter: 'text'  },
        ...commonSufix,
        {field: "withExaminerDate", header: "With Examiner Date", filter: 'text'}
      ];
    }
    if (this.claimsType === 'lead') {
      this.cols = [
        ...this.cols,
        { field: "leadName", header: "Lead Name", filter: 'text'  },
        // { field: "rebuttalComment", header: "Lead's Rebuttal Comment", filter: 'text'  },
        ...commonSufix,
        {field: "withLeadDate", header: "With Lead Date", filter: 'text'}
      ];
    }
    if (this.claimsType === 'manager') {
      this.cols = [
        ...this.cols,
        { field: "managerName", header: "Manager Name", filter: 'text'  },
        // { field: "rebuttalComment", header: "Manager's Rebuttal Comment", filter: 'text'  },
        ...commonSufix,
        {field: "withManagerDate", header: "With Manager Date", filter: 'text'}
      ];
    }
  }

  getQueueList() {
    this.tableData = [];
    this.auditorService.getRebuttalList(this.claimsType).subscribe(res => {
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
