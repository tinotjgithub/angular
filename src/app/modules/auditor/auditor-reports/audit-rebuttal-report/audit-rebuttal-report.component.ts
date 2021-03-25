import { Component, OnInit, ViewChild, OnDestroy, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { AuditorReportService } from "./../auditor-report.service";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-audit-rebuttal-report",
  templateUrl: "./audit-rebuttal-report.component.html"
})
export class AuditRebuttalReportComponent implements OnInit, OnDestroy {
  @ViewChild("auditTable", { static: false }) auditTable;
  public auditReportGroup: FormGroup;
  public today = new Date();
  public gridData: any[];
  public isDataPresent = false;
  public level = "";
  currentActiveFrom = "";
  currentActiveTo = "";
  currentLevel = "";
  leads: any[];
  leadList: any[];
  colsRebuttal: { field: string; header: string }[];
  colsSummary: { field: string; header: string }[];
  reportSubscription: Subscription = new Subscription();
  public leadSubscription: Subscription = new Subscription();
  public summary: any[];
  @Input()
  fromTab: boolean;
  summaryValue: any;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private reportService: AuditorReportService,
    private datePipe: DatePipe
  ) {
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    this.auditReportGroup = this.fb.group({
      activeFrom: [yesterdaysDate, [Validators.required]],
      activeTo: [yesterdaysDate, [Validators.required]],
      level: ["All", [Validators.required]]
    });
  }

  ngOnInit() {
    this.setColsRebuttal();
    this.setColsSummary();
    this.level = "All";
  }

  getAuditRebuttalReport() {
    const { activeFrom, activeTo, level } = this.auditReportGroup.value;
    const payload = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      level:
        level === "firstLevel"
          ? 1
          : level === "secondLevel"
          ? 2
          : level === "thirdLevel"
          ? 3
          : 0
    };
    this.currentActiveTo = payload.toDate;
    this.currentActiveFrom = payload.fromDate;
    this.currentLevel = level;
    this.level = level;
    this.reportService.getAuditRebuttalReport(payload);
    this.gridData = this.reportService.auditRebuttalReportResponse;
    this.gridData = [];
    this.reportSubscription = this.reportService
      .getAuditRebuttalReportListner()
      .subscribe((data: any) => {
        this.gridData = data.auditRebuttalReportDtoList;
        this.isDataPresent = this.gridData.length > 0 ? true : false;
        this.setSummary(data);
        this.reportSubscription.unsubscribe();
      });
  }

  getColumsOnLevel() {
    this.colsSummary = [];
    if (this.currentLevel === "firstLevel") {
      this.colsSummary = [
        { field: "totalRebuttal", header: "Total Rebuttal" },
        { field: "examinerAccepted", header: "Examiner Accepted" },
        { field: "auditorAccepted", header: "Auditor Accepted" },
        { field: "level1", header: "Level 1" }
      ];
    } else if (this.currentLevel === "secondLevel") {
      this.colsSummary = [
        { field: "totalRebuttal", header: "Total Rebuttal" },
        { field: "examinerAccepted", header: "Examiner Accepted" },
        { field: "auditorAccepted", header: "Auditor Accepted" },
        { field: "level2", header: "Level 2" }
      ];
    } else if (this.currentLevel === "thirdLevel") {
      this.colsSummary = [
        { field: "totalRebuttal", header: "Total Rebuttal" },
        { field: "examinerAccepted", header: "Examiner Accepted" },
        { field: "auditorAccepted", header: "Auditor Accepted" },
        { field: "level3", header: "Level 3" }
      ];
    } else {
      this.colsSummary = [
        { field: "totalRebuttal", header: "Total Rebuttal" },
        { field: "examinerAccepted", header: "Examiner Accepted" },
        { field: "auditorAccepted", header: "Auditor Accepted" },
        { field: "level1", header: "Level 1" },
        { field: "level2", header: "Level 2" },
        { field: "level3", header: "Level 3" }
      ];
    }
  }

  setSummary(data) {
    const totalReb = data.total;
    const examinerAcc = data.examinerAccepted;
    const auditorAcc = data.auditorAccepted;
    const lvl1 = data.firstLevel;
    const lvl2 = data.secondLevel;
    const lvl3 = data.thirdLevel;
    this.getColumsOnLevel();

    this.summary = [];
    this.summaryValue = {
      totalRebuttal: totalReb,
      examinerAccepted: examinerAcc,
      auditorAccepted: auditorAcc,
      level1: lvl1,
      level2: lvl2,
      level3: lvl3
    };
    this.summary.push(this.summaryValue);
  }

  setColsSummary() {
    this.colsSummary = [
      { field: "totalRebuttal", header: "Total Rebuttal" },
      { field: "examinerAccepted", header: "Examiner Accepted" },
      { field: "auditorAccepted", header: "Auditor Accepted" },
      { field: "level1", header: "Level 1" },
      { field: "level2", header: "Level 2" },
      { field: "level3", header: "Level 3" },
      { field: "allLevels", header: "Total (levels)" }
    ];
  }

  setColsRebuttal() {
    this.colsRebuttal = [
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
      { field: "examinerName", header: "Examiner name" },
      { field: "queueName", header: "Queue Name" },
      { field: "auditorName", header: "Auditor Name" },
      { field: "auditDate", header: "Audit Date" },
      { field: "auditStatus", header: "Audit Status" },
      { field: "errorType", header: "Error Type" },
      { field: "errorDescription", header: "Error Description" },
      { field: "examinerAgreed", header: "Examiner Agreed" },
      { field: "examinerRebuttalComment", header: "Examiner Rebuttal Comment" },
      { field: "rebuttalLevel", header: "Rebuttal Level" },
      { field: "level2AuditorComments", header: "Level2 Auditor Comments" },
      { field: "leadName", header: "Claims Lead Name" },
      { field: "managerName", header: "Manager Name" },
      { field: "rebuttalDate", header: "Rebuttal Date" },
      { field: "rebuttalStatus", header: "Rebuttal Status" }
    ];
  }

  get getActiveFrom() {
    return this.auditReportGroup.controls.activeFrom;
  }

  get getActiveTo() {
    return this.auditReportGroup.controls.activeTo;
  }

  get getStatus() {
    return this.auditReportGroup.controls.level;
  }

  submit() {
    const valid = this.validateDates();
    if (valid) {
      this.getAuditRebuttalReport();
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
      fromDate: this.currentActiveFrom,
      toDate: this.currentActiveTo,
      level:
        this.currentLevel === "firstLevel"
          ? 1
          : this.currentLevel === "secondLevel"
          ? 2
          : this.currentLevel === "thirdLevel"
          ? 3
          : 0
    };

    this.reportService.getAuditRebuttalReports(payload).subscribe(res => {
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
        window.navigator.msSaveBlob(blob, "Audit Rebuttal-" + dateString + ".xlsx");
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "Audit Rebuttal-" + dateString + ".xlsx");
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
