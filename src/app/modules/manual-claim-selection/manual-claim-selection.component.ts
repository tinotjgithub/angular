import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

@Component({
  selector: 'app-manual-claim-selection',
  templateUrl: './manual-claim-selection.component.html'
})
export class ManualClaimSelectionComponent implements OnInit {

  public tableData: any[];

  public cols: any[];

  public selectedClaims: any[] = [];
  public frozenCol: { field: string; header: string; filter: string }[];
  public today = new Date();
  public yesterday: Date;
  public claimForm: FormGroup;
  public claimLoaded: boolean;
  public claimCount: any;
  public claimLoading: boolean;
  public addingToQueue: boolean;
  public showAuditorAssign: boolean;
  public assignableClaims: any[];
  public auditorDetails: any[];
  public auditorName: any;
  public role = this.secureLocalStorage.getItem("roleId");

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auditorService: AuditorService,
    private notifierService: NotifierService,
    private secureLocalStorage: CryptoService
  ) { }

  ngOnInit() {
    const yesterday = new Date(this.today);
    yesterday.setDate(yesterday.getDate() - 1);
    this.yesterday = yesterday;
    this.claimForm = this.fb.group({
      from: [yesterday, [Validators.required]],
      to: [yesterday, [Validators.required]]
    });
    this.setCols();
    this.claimForm.valueChanges.subscribe(val => {
      this.claimLoaded = false;
      this.claimCount = 0;
      this.tableData = [];
    });
    this.auditorDetails = [];
    if (this.role !== "Claims Auditor") {
      this.auditorService.getAuditorDetailsForManualAssignment().subscribe(res => {
        const auditors = res || [];
        this.auditorDetails = auditors.map(e => {
          return {
            label: e.name,
            count: e.assignCount,
            value: e
          };
        });
      });
    }
  }

  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", filter: 'text' },
      { field: "claimType", header: "Claim Type", filter: 'dropdown'  },
      { field: "claimStatus", header: "Claim Status", filter: 'dropdown'  },
      { field: "receiptDate", header: "Receipt Date", filter: 'text'  },
      { field: "claimsAge", header: "Claim Age (In Days)", filter: 'text'  },
      { field: "providerName", header: "Provider Name", filter: 'text'  },
      { field: "memberGroupName", header: "Group Name", filter: 'text'  },
      { field: "billedAmount", header: "Billed Amount ($)", filter: 'text'  },
      { field: "allowedAmount", header: "Allowed Amount ($)", filter: 'text'  },
      { field: "paidAmount", header: "Paid Amount ($)", filter: 'text'  },
      { field: "processedDate", header: "Processed Date", filter: 'text'  },
      { field: "examinerName", header: "Examiner Name", filter: 'text'  },
      { field: "queueName", header: "Queue Name", filter: 'text'  },
    ];
    this.frozenCol = [
      { field: "select", header: "Select", filter: 'check' }
    ];
    this.cols = [...this.cols, ...this.frozenCol];
  }

  getClaims() {
    if (this.claimForm.invalid) {
      return;
    }
    const value = this.claimForm.value;
    const payload = {
      fromDate: this.getFormattedDate(value.from),
      toDate: this.getFormattedDate(value.to),
    };
    this.claimLoaded = false;
    this.claimLoading = true;
    this.auditorService.getClaimsForManualSelection(payload).subscribe(res => {
      this.claimLoading = false;
      this.claimLoaded = true;
      /* this.notifierService.throwNotification({
        type: 'success',
        message: 'Claims Loaded Successfully!'
      }); */
      this.tableData = [];
      this.claimCount = 0;
      if (res) {
        this.tableData = res.auditUnAssignedClaimsDtoList;
        this.claimCount = res.count;
      }
    }, err => {
      this.claimLoading = false;
      this.claimLoaded = true;
      this.tableData = [];
      this.claimCount = 0;
    });
  }

  addToQueue() {
    const value = this.claimForm.value;
    const payload = {
      fromDate: `${this.getFormattedDate(value.from)} 00:00:00`,
      toDate: `${this.getFormattedDate(value.to)} 00:00:00`,
      count: this.claimCount,
      auditUnAssignedClaimsDtoList: [...this.selectedClaims]
    };
    const role = this.secureLocalStorage.getItem('roleId');
    this.addingToQueue = true;
    this.auditorService.addToTodaysQueue(payload, role).subscribe(res => {
      this.addingToQueue = false;
      this.notifierService.throwNotification({
        type: "success",
        message: `${this.selectedClaims.length} Claims Added to Audit Queue`,
      });
      this.tableData = this.tableData.filter(f => this.selectedClaims.indexOf(f) === -1);
      this.claimCount = this.claimCount - this.selectedClaims.length;
      this.selectedClaims = [];
    }, err => {
      this.addingToQueue = false;
    });
  }

  getOptions(col, array = []) {
    const data: any[] =
    array.length > 0
        ? array.map((c) => c[col.field]).filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }

  getFormattedDate(date) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return  year + "-" + month + "-" + day;
  }

  showAssign() {
    this.showAuditorAssign = true;
    this.auditorName = null;
    this.assignableClaims = this.selectedClaims;
  }

  auditorNameChange(val) {
    if (val) {
      const userGroupIds: any[] = val.userGroupIds || [];
      this.assignableClaims = this.selectedClaims.filter(e => {
        const array: any[] = e.userGroupId || [];
        const found: any[] = array.filter(f => userGroupIds.indexOf(f) > -1);
        return found.length > 0;
      });
    } else {
      this.assignableClaims = this.selectedClaims;
    }
  }

  assigntoAuditor() {
    const value = this.claimForm.value;
    const payload = {
      fromDate: `${this.getFormattedDate(value.from)} 00:00:00`,
      toDate: `${this.getFormattedDate(value.to)} 00:00:00`,
      auditorId: [this.auditorName.id],
      auditUnAssignedClaimsDtoList: [...this.assignableClaims]
    };
    this.addingToQueue = true;
    this.auditorService.addToAuditorQueue(payload).subscribe(res => {
      this.addingToQueue = false;
      this.notifierService.throwNotification({
        type: "success",
        message: `${this.selectedClaims.length} Claims Added to Auditor Queue`,
      });
      this.tableData = this.tableData.filter(f => this.assignableClaims.indexOf(f) === -1);
      this.claimCount = this.claimCount - this.assignableClaims.length;
      this.selectedClaims = [];
      this.showAuditorAssign = false;
      this.assignableClaims = [];
    }, err => {
      this.addingToQueue = false;
    });
  }
}
