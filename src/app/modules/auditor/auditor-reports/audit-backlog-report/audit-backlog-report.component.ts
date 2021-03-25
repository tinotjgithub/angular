import { Component, OnInit, ViewChild, OnDestroy, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { AuditorReportService } from "./../auditor-report.service";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-audit-backlog-report",
  templateUrl: "./audit-backlog-report.component.html"
})
export class AuditBacklogReportComponent implements OnInit, OnDestroy {
  @ViewChild("auditTable", { static: false }) auditTable;
  public auditReportGroup: FormGroup;
  public today = new Date();
  public gridData: any[];
  public isDataPresent = false;
  public backlogStatusVal = 0;
  public backlogStatusLbl = "";
  public currentBacklogStatus = "";
  currentActiveFrom = "";
  currentActiveTo = "";
  leads: any[];
  leadList: any[];
  cols: { field: string; header: string }[];
  reportSubscription: Subscription = new Subscription();
  public leadSubscription: Subscription = new Subscription();
  backlogStatus: string;
  @Input()
  fromTab: boolean;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private reportService: AuditorReportService,
    private datePipe: DatePipe
  ) {
    const yesterdaysDate = new Date();
    const todayDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultFrom = new Date("01-01-1970");
    this.auditReportGroup = this.fb.group({
      activeFrom: [defaultFrom, [Validators.required]],
      activeTo: [todayDate, [Validators.required]],
      backlogStatus: ["All", [Validators.required]]
    });
  }

  ngOnInit() {
    this.setCols();
    this.backlogStatus = "All";
    this.getAuditBacklogReport();
    if (this.auditTable && this.auditTable !== undefined) {
      this.auditTable.reset();
    }
  }

  getAuditBacklogReport() {
    const { activeFrom, activeTo, backlogStatus } = this.auditReportGroup.value;
    this.currentBacklogStatus = backlogStatus;
    const payload = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      backlogStatus: this.currentBacklogStatus.toUpperCase()
    };
    this.currentBacklogStatus = backlogStatus;
    this.currentActiveFrom = payload.fromDate;
    this.currentActiveTo = payload.toDate;
    this.backlogStatus = backlogStatus;
    this.isDataPresent = true;
    this.reportService.getAuditBacklogReport(payload);
    this.gridData = this.reportService.auditBacklogReportResponse;
    this.gridData = [];
    this.reportSubscription = this.reportService
      .getAuditBacklogReportListner()
      .subscribe((data: any) => {
        this.gridData = data.auditBacklogReportDtoList;
        this.setSummary(data, this.backlogStatus);
        this.reportSubscription.unsubscribe();
      });
  }

  setSummary(data, backlogStatus) {
    this.currentBacklogStatus = backlogStatus;
    this.backlogStatusLbl =
      backlogStatus === "Pending"
        ? "Pending Count"
        : backlogStatus === "Saved"
        ? "Saved Count"
        : backlogStatus === "Reassigned"
        ? "Reassigned Count"
        : "Total Backlog Count";
    this.backlogStatusVal =
      backlogStatus === "Pending"
        ? data.pendedCount
        : backlogStatus === "Saved"
        ? data.savedCount
        : backlogStatus === "Reassigned"
        ? data.reassignedCount
        : data.totalCount;
  }

  checkToDate() {
    if (
      this.getActiveTo.value &&
      this.getActiveTo.value < this.getActiveFrom.value
    ) {
      this.getActiveTo.reset();
    } else {
      // const valid = this.validateDates();
      // if (valid) {
      this.auditReportGroup.controls.activeTo.setErrors(null);
      this.auditReportGroup.controls.activeFrom.setErrors(null);
      this.auditReportGroup.updateValueAndValidity();
    }
    // }
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
      { field: "backlogAge", header: "Backlog Age (In Days)" },
      { field: "backlogStatus", header: "Backlog Status" }
    ];
  }

  get getActiveFrom() {
    return this.auditReportGroup.controls.activeFrom;
  }

  get getActiveTo() {
    return this.auditReportGroup.controls.activeTo;
  }

  get getBacklogStatus() {
    return this.auditReportGroup.controls.backlogStatus;
  }

  submit() {
    // const valid = this.validateDates();
    // if (valid) {
      this.getAuditBacklogReport();
      if (this.auditTable && this.auditTable !== undefined) {
        this.auditTable.reset();
      }
    // }
  }

  exportExcel() {
    if (this.auditReportGroup.invalid) {
      return;
    }
    const payload = {
      fromDate: this.getFormattedDate(this.currentActiveFrom, true),
      toDate: this.getFormattedDate(this.currentActiveTo, true),
      backlogStatus: this.currentBacklogStatus.toUpperCase()
    };

    this.reportService.getAuditBacklogReportReports(payload).subscribe(res => {
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
        window.navigator.msSaveBlob(blob, "Audit Backlog-" + dateString + ".xlsx");
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "Audit Backlog-" + dateString + ".xlsx");
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

  // validateDates() {
  //   const activeFrom = this.auditReportGroup.get("activeFrom").value;
  //   const activeTo = this.auditReportGroup.get("activeTo").value;
  //   const diffInMonths = this.getMonths(activeFrom, activeTo);
  //   const isValid = diffInMonths > 6 ? false : true;;
  //   if (!isValid) {
  //     this.auditReportGroup.controls.activeTo.setErrors({
  //       rangeError: true
  //     });
  //     this.auditReportGroup.updateValueAndValidity();
  //   } else {
  //     this.auditReportGroup.controls.activeTo.setErrors(null);
  //     this.auditReportGroup.updateValueAndValidity();
  //   }
  //   return isValid;
  // }

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
