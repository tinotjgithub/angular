import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { AuditReportDashboardService } from "./audit-report-dashboard.service";
import { AuditedClaimsReportService } from "./../../modules/audited-claims-report/audited-claims-report.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-audit-report-dashboard",
  templateUrl: "./audit-report-dashboard.component.html"
})
export class AuditReportDashboardComponent implements OnInit, OnDestroy {
  public resetFormSubject: Subject<boolean> = new Subject<boolean>();
  reportSubscription: Subscription = new Subscription();
  processedDates = [];
  nonMondays: [];
  public isValid = true;
  userStatusReportDto: any;
  public rangeError = false;
  public invalidDateError = false;
  public auditDates: FormGroup;
  public maxDate = new Date();
  constructor(
    private notifierService: NotifierService,
    private fbAudit: FormBuilder,
    public datePipe: DatePipe,
    private auditReportDashboardService: AuditReportDashboardService,
    private auditedClaimsReportService: AuditedClaimsReportService
  ) {
    const maxDay = new Date();
    maxDay.setDate(maxDay.getDate() - 1);
    const thirtyDaysBefore = new Date();
    const yesterday = new Date();
    thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 31);
    yesterday.setDate(yesterday.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(thirtyDaysBefore);
    defaultDateRange.push(yesterday);
    this.auditDates = fbAudit.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.processedDates = [];
    this.setAuditDates();
  }

  setAuditDates() {
    const processedDateValue = this.auditDates.get("dateRange").value;
    this.processedDates.push(processedDateValue[0]);
    this.processedDates.push(processedDateValue[1]);
    this.auditReportDashboardService.setAuditDetails(this.processedDates);
  }

  onSubmitAudit() {
    this.processedDates = [];
    const processedDateValue = this.auditDates.get("dateRange").value;
    this.processedDates.push(processedDateValue[0]);
    this.processedDates.push(processedDateValue[1]);
    this.auditReportDashboardService.setAuditDetails(this.processedDates);
    this.resetChildForm();
  }

  validateDates() {
    const fromDateValue = this.auditDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      this.isValid = diffInMonths > 6 ? false : true;
      this.rangeError = true;
      this.invalidDateError = false;
    } else {
      this.isValid = true;
    }
  }

  getMonths(processedDateValue) {
    const fromDate = new Date(processedDateValue[0]);
    const toDate = new Date(processedDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
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

  resetChildForm() {
    this.resetFormSubject.next(true);
  }

  getToDateValue() {
    const toDateValue =
      this.auditDates.get("dateRange").value[1] !== null &&
      this.auditDates.get("dateRange").value[1] !== "" &&
      this.auditDates.get("dateRange").value[1] !== undefined
        ? this.auditDates.get("dateRange").value[1]
        : this.auditDates.get("dateRange").value[0];
    return toDateValue;
  }

  exportExcel() {
    if (this.auditDates.invalid) {
      return;
    }
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.auditDates.get("dateRange").value[0];
    const payload = {
      fromDate: this.getFormattedDate(fromDateValue, true),
      toDate: this.getFormattedDate(toDateValue, true),
      auditStatus: "ALL"
    };
    this.auditedClaimsReportService
      .getAuditedClaimsReportReports(payload)
      .subscribe(res => {
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
          window.navigator.msSaveBlob(
            blob,
            "Audit Claims Report-" + dateString + ".xlsx"
          );
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute(
              "download",
              "Audit Claims Report-" + dateString + ".xlsm"
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }

  ngOnDestroy() {
    this.reportSubscription.unsubscribe();
  }
}
