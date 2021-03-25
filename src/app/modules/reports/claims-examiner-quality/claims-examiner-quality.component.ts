import { Component, OnInit, Input } from "@angular/core";
import { Validators, FormGroup } from "@angular/forms";

import { FormBuilder } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { ReportService } from "src/app/services/report/report.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-claims-examiner-quality",
  templateUrl: "./claims-examiner-quality.component.html"
})
export class ClaimsExaminerQualityComponent implements OnInit {
  list = [];
  selectedList = "All";
  usersForm: FormGroup;
  fromDate;
  toDate;
  endDate;
  public reportLoaded: boolean;
  public reportData: any[];
  public columns: any[];
  public today = new Date();
  @Input()
  public fromTab: boolean;
  constructor(
    private fb: FormBuilder,
    private notifierServices: NotifierService,
    private reportsService: ReportService,
    private datePipe: DatePipe
  ) {
    this.endDate = new Date();
    this.endDate.setDate(this.endDate.getDate() - 1);
  }

  ngOnInit() {
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    this.usersForm = this.fb.group({
      fromDate: [
        // this.getFormattedDate(new Date("01-01-1970")),
        yesterdaysDate,
        [Validators.required]
      ],
      toDate: [yesterdaysDate, [Validators.required]]
    });
    this.toDate = yesterdaysDate;
    this.fromDate = yesterdaysDate;
    // new Date("01/01/1970");

    this.list = [
      { label: "All", value: "All" },
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" }
    ];

    this.selectedList = "All";
    this.columns = [
      { header: "SL No.", field: "slNo", sort: false },
      { header: "Claim ID", field: "claimId", sort: false },
      // { header: "Claim Type", field: "claimType", sort: false},
      { header: "Claim Status", field: "claimStatus", sort: false },
      // { header: "Processor Name", field: "processorName", sort: true },
      {
        header: "Claims Examiner Name",
        field: "claimExaminerName",
        sort: true
      },
      {
        header: "Processed Date",
        field: "processedDate",
        sort: true,
        dateFilter: true
      },
      { header: "Member ID", field: "memberId", sort: false },
      { header: "Member Name", field: "memberName", sort: true },
      { header: "Supplier ID", field: "supplierId", sort: false },
      { header: "Supplier Name", field: "supplierName", sort: true },
      { header: "Total Billed Amount ($)", field: "billedAmount", sort: true },
      {
        header: "Total Allowed Amount ($)",
        field: "allowedAmount",
        sort: true
      },
      { header: "Total Paid Amount ($)", field: "totalPaidAmount", sort: true },
      { header: "Passed/Failed", field: "passedOrFailed", sort: true },
      // { header: "Error type", field: "financialImpact", sort: false },
      { header: "Error Description", field: "errorDescription", sort: true },
      { header: "Financial Impact", field: "financialImpact", sort: false },
      {
        header: "Overpaid/Underpaid",
        field: "overPaidOrUnderPaid",
        sort: false
      },
      { header: "Audited by", field: "auditedBy", sort: true },
      {
        header: "Audit Date",
        field: "auditDate",
        sort: true,
        dateFilter: true
      },
      { header: "Error Type", field: "errorType", sort: false }
    ];
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

  submit() {
    const { fromDate, toDate } = this.usersForm.value;
    if (fromDate > toDate) {
      this.notifierServices.throwNotification({
        type: "error",
        message:
          "From Date should be less than To Date, Please corret the dates"
      });
      return;
    }
    const param = {
      fromDate: this.getFormattedDate(fromDate, true),
      toDate: this.getFormattedDate(toDate, true)
    };
    this.reportsService.getClaimQualityData(param).subscribe(
      res => {
        this.reportLoaded = true;
        if (res) {
          this.reportData = res;
        } else {
          this.reportData = [];
        }
      },
      err => {
        this.reportLoaded = false;
        this.reportData = [];
      }
    );
  }

  downloadReport() {
    const { fromDate, toDate } = this.usersForm.value;
    const param = {
      fromDate: this.getFormattedDate(fromDate, true),
      toDate: this.getFormattedDate(toDate, true)
    };
    this.reportsService.generateClaimQuality(param).subscribe(res => {
      const responseBody = res.body;
      const blob = new Blob([responseBody], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const today = new Date();
      const dateString = this.datePipe.transform(today, "MMddyyyy");
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, "Claims Examiner Quality Report - " + dateString + ".xlsx");
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "Claims Examiner Quality Report - " + dateString + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }

  setFromDate(val) {
    this.validateDates();
    this.usersForm.patchValue({
      fromDate: val
    });
    this.fromDate = val;
  }
  setToDate(val) {
    this.validateDates();
    if (this.usersForm.valid) {
      this.usersForm.patchValue({
        toDate: val
      });
      this.toDate = val;
    } else {
      this.usersForm.patchValue({
        toDate: val
      });
      this.toDate = val;
      this.usersForm.controls.toDate.setErrors({
        rangeError: true
      });
      this.usersForm.updateValueAndValidity();
    }
  }

  getMonths(fromDate, toDate) {
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  validateDates() {
    const fromDate = this.usersForm.get("fromDate").value;
    const toDate = this.usersForm.get("toDate").value;
    const diffInMonths = this.getMonths(fromDate, toDate);
    const isValid = diffInMonths > 6 ? false : true;
    if (!isValid) {
      this.usersForm.controls.toDate.setErrors({
        rangeError: true
      });
      this.usersForm.updateValueAndValidity();
    } else {
      this.usersForm.controls.toDate.setErrors(null);
      this.usersForm.updateValueAndValidity();
    }
    return isValid;
  }

  getFormControl(controlName) {
    return this.usersForm.get(controlName);
  }

  clearData() {
    this.reportData = [];
    this.reportLoaded = false;
  }
}
