import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";
import { NotifierService } from "src/app/services/notifier.service";
import { ReportService } from "src/app/services/report/report.service";
import { DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

@Component({
  selector: "app-status-report",
  templateUrl: "./status-report.component.html"
})
export class StatusReportComponent implements OnInit {
  public role = this.secureLocalStorage.getItem("roleId");
  public userListForm: FormGroup;
  public today = new Date();
  @Input()
  public reportType;
  @Input()
  public fromTab: boolean;
  public reportLoaded: boolean;
  public reportData: any[];
  public columns: any[];
  public claimAges: string[];
  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private reportService: ReportService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private secureLocalStorage: CryptoService
  ) {
    this.reportType = route.snapshot.data[`reportType`] ? route.snapshot.data[`reportType`] : this.reportType;
  }

  ngOnInit() {
    const defaultFrom = new Date("01-01-1970");
    this.userListForm = this.fb.group({
      activeFrom: [defaultFrom, [Validators.required]],
      activeTo: [this.today, [Validators.required]],
      claimAge: [""]
    });
    this.columns = [
      { header: "SL No.", field: "slNo", sort: false },
      { header: "Processor Name", field: "processorName", sort: true },
      { header: "Pended Date", field: "pendedDate", sort: true, dateFilter: true },
      { header: "Claim ID", field: "claimId", sort: false },
      { header: "Claim Type", field: "claimType", sort: false },
      { header: "Status (In WFM)", field: "claimStatus", sort: false },
      { header: "Receipt Date", field: "receiptDate", sort: true, dateFilter: true },
      { header: "Age of Claim (In Days)", field: "claimAge", sort: true },
      { header: "Member ID", field: "memberId", sort: false },
      { header: "Member Name", field: "memberName", sort: true },
      { header: "Supplier ID", field: "providerId", sort: false },
      { header: "Supplier Name", field: "providerName", sort: true },
      { header: "Billed Amount ($)", field: "billedAmount", sort: true }
    ];
    if (this.reportType !== 'Pended') {
      this.columns = this.columns.map(col => {
        return (col.field === 'pendedDate') ?
         { header: "Routed In Date", field: "routedInDate", sort: true, dateFilter: true }
          : col;
      });
    }
    this.getClaimAgeRange();
  }

  get getActiveFrom() {
    return this.userListForm.controls.activeFrom;
  }

  get getActiveTo() {
    return this.userListForm.controls.activeTo;
  }

  get getStatus() {
    return this.userListForm.controls.claimAge;
  }

  checkToDate() {
    if (
      this.getActiveTo.value &&
      this.getActiveTo.value < this.getActiveFrom.value
    ) {
      this.getActiveTo.reset();
    }
  }

  getClaimAgeRange() {
    this.claimAges = [];
    this.reportService.getClaimAgeRange().subscribe(res => {
      this.claimAges = res;
    }, err => {
      this.claimAges = [];
    });
  }

  submit() {
    if (this.userListForm.invalid) {
      return;
    }

    const { activeFrom, activeTo, claimAge } = this.userListForm.value;
    const payload = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      claimByAge: claimAge
    };
    this.reportLoaded = false;
    this.reportService
      .getClaimsStatusByPendeOrRoutedData(payload, this.reportType)
      .subscribe(res => {
        this.reportLoaded = true;
        if (res) {
          this.reportData = res;
        } else {
          this.reportData = [];
        }
      }, err => {
        this.reportLoaded = false;
        this.reportData = [];
      });
  }

  getFormattedDate(date, twisted = false) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return twisted
      ? year + "-" + month + "-" + day
      : month + "/" + day + "/" + year;
  }

  downloadExcel() {
    const { activeFrom, activeTo, claimAge } = this.userListForm.value;
    const payload = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      claimByAge: claimAge
    };
    this.reportService
      .getClaimsStatusByPendeOrRoutedReport(payload, this.reportType)
      .subscribe(res => {
        const responseBody = res.body;
        const blob = new Blob([responseBody], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const today = new Date();
        const dateString = this.datePipe.transform(today, "MMddyyyy");
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, this.reportType + " Claims  - " + dateString + ".xlsx");
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute(
              "download",
              this.reportType + " Claims  - " + dateString + ".xlsx"
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }

  clearData() {
    this.reportData = [];
    this.reportLoaded = false;
  }
}
