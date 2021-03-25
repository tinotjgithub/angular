import { Component, OnInit, ViewChild, OnDestroy, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { AuditorReportService } from "./../auditor-report.service";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-audit-report",
  templateUrl: "./audit-report.component.html"
})
export class AuditReportComponent implements OnInit, OnDestroy {

  @ViewChild("auditTable", { static: false }) auditTable;
  public auditReportGroup: FormGroup;
  public today = new Date();
  public gridData: any[];
  public currentStatus: string;
  currentActiveFrom: string;
  currentActiveTo: string;
  public isDataPresent = false;
  public passedCount: string;
  public failedCount: string;
  public totalCount: string;
  leads: any[];
  leadList: any[];
  cols: { field: string; header: string }[];
  reportSubscription: Subscription = new Subscription();
  public leadSubscription: Subscription = new Subscription();
  status: string;
  @Input()
  fromTab: boolean;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private reportService: AuditorReportService,
    public datePipe: DatePipe
  ) {
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    this.auditReportGroup = this.fb.group({
      activeFrom: [yesterdaysDate, [Validators.required]],
      activeTo: [yesterdaysDate, [Validators.required]],
      status: ["Failed", [Validators.required]]
    });
  }

  get getActiveFrom() {
    return this.auditReportGroup.controls.activeFrom;
  }

  get getActiveTo() {
    return this.auditReportGroup.controls.activeTo;
  }

  get getStatus() {
    return this.auditReportGroup.controls.status;
  }

  ngOnInit() {
    this.setCols();
    this.status = "Failed";
  }

  getAuditReport() {
    const { activeFrom, activeTo, status } = this.auditReportGroup.value;
    const payload = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      status: status.toUpperCase()
    };
    this.currentStatus = status;
    this.currentActiveFrom = payload.fromDate;
    this.currentActiveTo = payload.toDate;
    this.status = status;
    this.isDataPresent = true;
    this.reportService.getAuditReport(payload);
    this.gridData = this.reportService.auditReportResponse;
    this.gridData = [];
    this.reportSubscription = this.reportService
      .getAuditReportListner()
      .subscribe((data: any) => {
        this.gridData = data.auditReportDtoList;
        this.setSummary(data);
        this.reportSubscription.unsubscribe();
      });
  }

  setSummary(data) {
    this.passedCount = data.passed;
    this.failedCount = data.failed;
    this.totalCount = data.passed + data.failed;
  }

  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "age", header: "Claim Age (In Days)" },
      { field: "providerName", header: "Provider Name" },
      { field: "groupName", header: "Group Name" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "allowedAmount", header: "Allowed Amount ($)" },
      { field: "paidAmount", header: "Paid Amount ($)" },
      { field: "processedDate", header: "Processed Date" },
      { field: "examinerName", header: "Examiner Name" },
      { field: "queueName", header: "Queue Name" },
      { field: "auditorName", header: "Auditor Name" },
      { field: "auditDate", header: "Audit Date" },
      { field: "auditStatus", header: "Audit Status" },
      { field: "errorType", header: "Error Type" },
      { field: "errorDescription", header: "Error Description" },
      { field: "financialImpact", header: "Financial Impact" },
      { field: "amount", header: "Amount" }
    ];
  }

  submit() {
    const valid = this.validateDates();
    if (valid) {
      this.getAuditReport();
      if (this.auditTable && this.auditTable !== undefined) {
        this.auditTable.reset();
      }
    }
  }

  checkToDate() {
    if (
      this.getActiveTo.value &&
      this.getActiveTo.value < this.getActiveFrom.value
    ) {
      this.getActiveTo.reset();
    } else {
      const valid = this.validateDates();
      if (valid) {
        this.auditReportGroup.controls.activeTo.setErrors(null);
        this.auditReportGroup.controls.activeFrom.setErrors(null);
        this.auditReportGroup.updateValueAndValidity();
      }
    }
  }

  exportExcel() {
    if (this.auditReportGroup.invalid) {
      return;
    }
    const payload = {
      fromDate: this.getFormattedDate(this.currentActiveFrom, true),
      toDate: this.getFormattedDate(this.currentActiveTo, true),
      status: this.currentStatus.toUpperCase()
    };

    this.reportService.getAuditReports(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: "info",
        message: "Report is being generated. Please wait."
      });
      const responseBody = res.body;
      const blob = new Blob([responseBody], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const today = new Date();
      const dateString = this.datePipe.transform(today, "MMddyyyy");
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, "Audit Report-" + dateString + ".xlsx");
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "Audit Report-" + dateString + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
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

  validateDates() {
    const activeFrom = this.auditReportGroup.get("activeFrom").value;
    const activeTo = this.auditReportGroup.get("activeTo").value;
    const diffInMonths = this.getMonths(activeFrom, activeTo);
    const isValid = diffInMonths > 6 ? false : true;
    if (!isValid) {
      this.auditReportGroup.controls.activeTo.setErrors({
        rangeError: true
      });
      this.auditReportGroup.updateValueAndValidity();
    } else {
      this.auditReportGroup.controls.activeTo.setErrors(null);
      this.auditReportGroup.updateValueAndValidity();
    }
    return isValid;
  }

  getMonths(fromDate, toDate) {
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  ngOnDestroy() {
    this.leadSubscription.unsubscribe();
  }
}
