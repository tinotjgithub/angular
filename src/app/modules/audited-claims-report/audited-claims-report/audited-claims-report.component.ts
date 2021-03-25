import { Component, OnInit, ViewChild, OnDestroy, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { AuditedClaimsReportService } from "./../audited-claims-report.service";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-audited-claims-report",
  templateUrl: "./audited-claims-report.component.html"
})
export class AuditedClaimsReportComponent implements OnInit, OnDestroy {
  @ViewChild("auditTable", { static: false }) auditTable;
  public auditReportGroup: FormGroup;
  public today = new Date();
  public gridData: any[];
  public isDataPresent = false;
  public claimsAuditedSatusVal = 0;
  public claimsAuditedSatusLbl = "";
  public currentAuditStatus = "";
  currentActiveFrom = "";
  currentActiveTo = "";
  leads: any[];
  leadList: any[];
  cols: { field: string; header: string }[];
  reportSubscription: Subscription = new Subscription();
  public leadSubscription: Subscription = new Subscription();
  auditStatus: string;
  public maxDate;
  @Input()
  public fromTab: boolean;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private auditedClaimsReportService: AuditedClaimsReportService,
    private datePipe: DatePipe
  ) {
    const maxDay = new Date();
    maxDay.setDate(maxDay.getDate() - 1);
    this.maxDate = maxDay;
    const thirtyDaysBefore = new Date();
    const yesterday = new Date();
    thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 31);
    yesterday.setDate(yesterday.getDate() - 1);
    this.auditReportGroup = this.fb.group({
      activeFrom: [thirtyDaysBefore, [Validators.required]],
      activeTo: [yesterday, [Validators.required]],
      auditStatus: ["All", [Validators.required]]
    });
  }

  ngOnInit() {
    this.setCols();
    this.auditStatus = "All";
  }

  getAuditedClaimsReport() {
    const { activeFrom, activeTo, auditStatus } = this.auditReportGroup.value;
    this.currentAuditStatus = auditStatus;
    const payload = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      auditStatus: this.currentAuditStatus.toUpperCase()
    };
    this.currentAuditStatus = auditStatus;
    this.currentActiveFrom = payload.fromDate;
    this.currentActiveTo = payload.toDate;
    this.auditStatus = auditStatus;
    this.isDataPresent = true;
    this.auditedClaimsReportService.getAuditedClaimsReport(payload);
    this.gridData = this.auditedClaimsReportService.auditedClaimsReportResponse;
    this.gridData = [];
    this.reportSubscription = this.auditedClaimsReportService
      .getAuditedClaimsReportListner()
      .subscribe((data: any) => {
        this.gridData = data.auditClaimsReportDtoList;
        this.setSummary(data, this.auditStatus);
        this.reportSubscription.unsubscribe();
      });
  }

  setSummary(data, auditStatus) {
    this.currentAuditStatus = auditStatus;
    this.claimsAuditedSatusLbl =
      auditStatus === "Passed"
        ? "Passed Count"
        : auditStatus === "Failed"
        ? "Failed Count"
        : "Total Count";
    this.claimsAuditedSatusVal =
      auditStatus === "Passed"
        ? data.passedCount
        : auditStatus === "Failed"
        ? data.failedCount
        : data.totalCount;
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

  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "claimType", header: "Claim Type" },
      { field: "processedDate", header: "Processed Date" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "diagnosisCode", header: "Diagnosis Code" },
      { field: "procedureCode", header: "Procedure Code" },
      { field: "providerName", header: "Provider Name" },
      { field: "memberGroupName", header: "Member Group" },
      { field: "paymentStatus", header: "Payment Status" },
      { field: "planType", header: "Plan Type" },
      { field: "lineOfBusiness", header: "Line of Business" },
      { field: "processWorkflow", header: "Adjudication Type" },
      { field: "samplingMethod", header: "Sampling Method" },
      { field: "claimSource", header: "Claim Source" },
      { field: "auditorName", header: "Auditor Name" },
      { field: "auditDate", header: "Audit Date" },
      { field: "status", header: "Audit Status" },
      { field: "errorType", header: "Error Type" },
      { field: "financialImpact", header: "Financial Impact" },
      { field: "amountAudit", header: "Amount ($)" },
      { field: "userGroupName", header: "User Group" },
      { field: "examinerName", header: "Examiner Name" }
    ];
  }

  get getActiveFrom() {
    return this.auditReportGroup.controls.activeFrom;
  }

  get getActiveTo() {
    return this.auditReportGroup.controls.activeTo;
  }

  get getClaimsAuditStatus() {
    return this.auditReportGroup.controls.auditStatus;
  }

  submit() {
    const valid = this.validateDates();
    if (valid) {
      this.getAuditedClaimsReport();
      if (this.auditTable && this.auditTable !== undefined) {
        this.auditTable.reset();
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
      auditStatus: this.currentAuditStatus.toUpperCase()
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
          window.navigator.msSaveBlob(blob, "Audit Claims Report-" + dateString + ".xlsx");
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
