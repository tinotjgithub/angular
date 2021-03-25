import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuditDashboardService } from "./../audit-dashboard.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-claims-audit-summary",
  templateUrl: "./claims-audit-summary.component.html"
})
export class ClaimsAuditSummaryComponent implements OnInit, OnDestroy {
  auditSummaryDtos: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input()
  public processedDates: Array<{}>;
  public maxDate = new Date();
  frequency: string;
  public isDataPresent = false;
  public showMonthlyCalendar = false;
  public showWeeklyCalendar = false;
  public showDailyCalendar = true;
  auditDetails: { auditDates: []; frequency: string };
  public enlargedDisplay = false;
  public editMode: boolean;
  public editUser = {};
  userAuditReportDto: any;
  private auditSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public typeAudit = "ColumnChart";
  public columnNamesAudit = [
    "",
    "Audit Passed",
    { role: "annotation" },
    "Audit Failed",
    { role: "annotation" }
  ];
  public optionsAudit = {
    width: 400,
    bar: { width: "50%" },
    colors: ["#4cc14f", "#ff5c5d"],
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    annotations: {
      textStyle: {
        fontSize: 11
      }
    },
    hAxis: {
      format: "0",
      title: "",
      textStyle: {
        color: "black",
        fontSize: 9,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      format: "0",
      viewWindowMode: "explicit",
      minValue: 0,
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 9,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      width: 120,
      left: 20,
      right: 12,
      top: 17,
      bottom: 20
    },
    legend: {
      textStyle: { fontSize: 12 },
      position: "top",
      width: "30%"
    },
    animation: {
      duration: 1200,
      easing: "out",
      startup: true
    }
    // isStacked: true
  };

  public optionsAuditEnlarged = {
    colors: ["#4cc14f", "#ff5c5d"],
    width: 700,
    bar: { width: "50%" },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    annotations: {
      textStyle: {
        fontSize: 14
      }
    },
    hAxis: {
      format: "0",
      tooltip: {
        trigger: "focus",
        showColorCode: true,
        textStyle: {
          color: "black",
          fontSize: 13,
          textPosition: "Horizontal"
        }
      },
      title: "",
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      slantedText: true,
      title: "",
      minValue: 0,
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 50,
      right: 1,
      top: 25,
      bottom: 60
    },
    legend: {
      textStyle: { fontSize: 14 },
      position: "top",
      width: "50%"
    },
    animation: {
      duration: 1200,
      easing: "out",
      startup: true
    }
    // isStacked: true
  };
  public auditDates: FormGroup;
  public dataAudit = [];
  public isAuditRendered = false;
  public widthAudit = 300;
  public heightAudit = 200;
  public freqList = [];
  public chartDetail: any[];
  public barDetails: { type: any; value: any; data: any };
  public cols: any;
  public maxMonth;
  public detailsView: boolean;
  constructor(
    private auditDashboardService: AuditDashboardService,
    public datePipe: DatePipe,
    private fbAudit: FormBuilder,
    private notifierService: NotifierService
  ) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const currentMonth = new Date(y, m, 1);
    this.maxMonth = currentMonth;
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const seventhDate = new Date();
    seventhDate.setDate(seventhDate.getDate() - 8);
    const defaultDateRange = [];
    defaultDateRange.push(seventhDate);
    defaultDateRange.push(yesterdaysDate);
    this.auditDates = fbAudit.group({
      dateRange: [defaultDateRange, Validators.required],
      weeklyFromDate: [seventhDate, Validators.required],
      weeklyToDate: [yesterdaysDate, Validators.required],
      frequency: ["Daily", Validators.required]
    });
  }

  ngOnInit() {
    this.setFrequency();
    this.processedDates = [];
    const processedDateValue = this.auditDates.get("dateRange").value;
    this.processedDates.push(processedDateValue[0]);
    this.processedDates.push(processedDateValue[1]);
    const frequencyValue = this.auditDates.get("frequency").value;
    this.setFreq(frequencyValue);
    this.auditDetails = this.auditDashboardService.getAuditDates();
    this.getAuditDays();
    this.onSubmitAudit();
  }

  get getDateRange() {
    return this.auditDates.controls.dateRange;
  }

  onSubmitAudit() {
    if (this.getDateRange.invalid) {
      return;
    }
    this.processedDates = [];
    if (this.frequency !== "Weekly") {
      const processedDateValue = this.auditDates.get("dateRange").value;
      this.processedDates.push(processedDateValue[0]);
      this.processedDates.push(processedDateValue[1]);
    } else {
      const processedFromDateValue = this.auditDates.get("weeklyFromDate")
        .value;
      const processedToDateValue = this.auditDates.get("weeklyToDate").value;
      this.processedDates.push(processedFromDateValue);
      this.processedDates.push(processedToDateValue);
    }
    const frequencyValue = this.auditDates.get("frequency").value;
    this.setFreq(frequencyValue);
    this.getAuditDays();
  }

  getDateDifference(toDateValue, fromDateValue) {
    let valid = true;
    const date1 = new Date(fromDateValue);
    const date2 = new Date(toDateValue);
    const DifferenceTime = date2.getTime() - date1.getTime();
    const diff = DifferenceTime / (1200 * 3600 * 24);
    if (this.frequency === "Daily" && diff > 30) {
      this.auditDates.controls.dateRange.setErrors({
        invalidDaily: true
      });
      this.auditDates.updateValueAndValidity();
      valid = false;
    } else if (this.frequency === "Weekly" && diff > 60) {
      this.auditDates.controls.dateRange.setErrors({
        invalidWeekly: true
      });
      this.auditDates.updateValueAndValidity();
      valid = false;
    } else {
      this.auditDates.controls.dateRange.setErrors(null);
      this.auditDates.updateValueAndValidity();
      valid = true;
    }
    return valid;
  }

  checkToDate() {
    let valid = true;
    if (
      this.getActiveTo.value &&
      this.getActiveTo.value < this.getActiveFrom.value
    ) {
      valid = false;
      this.auditDates.controls.dateRange.setErrors({
        invalidDateError: true
      });
      this.auditDates.updateValueAndValidity();
    } else {
      valid = true;
      this.auditDates.controls.dateRange.setErrors(null);
      this.auditDates.updateValueAndValidity();
    }
    return valid;
  }

  get getActiveFrom() {
    return this.auditDates.controls.weeklyFromDate;
  }

  get getActiveTo() {
    return this.auditDates.controls.weeklyToDate;
  }

  validateDates() {
    const valid = this.checkToDate();
    if (valid) {
      let fromDateValue = [];
      if (this.frequency !== "Weekly") {
        fromDateValue = this.auditDates.get("dateRange").value;
        this.validateRange(fromDateValue);
      } else {
        fromDateValue.push(this.auditDates.get("weeklyFromDate").value);
        fromDateValue.push(this.auditDates.get("weeklyToDate").value);
        const isValid = this.checkToDate();
        if (isValid) {
          this.validateRange(fromDateValue);
        }
      }
    }
  }

  validateRange(fromDateValue) {
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const dateValid = this.getDateDifference(
        fromDateValue[1],
        fromDateValue[0]
      );
      if (dateValid) {
        const diffInMonths = this.getMonths(fromDateValue);
        const rangeError = diffInMonths > 6 ? true : false;
        if (rangeError) {
          this.auditDates.controls.dateRange.setErrors({
            rangeError: true
          });
          this.auditDates.updateValueAndValidity();
        } else {
          this.auditDates.controls.dateRange.setErrors(null);
          this.auditDates.updateValueAndValidity();
          this.onSubmitAudit();
        }
      }
    } else {
      this.auditDates.controls.dateRange.setErrors(null);
      this.auditDates.updateValueAndValidity();
      this.onSubmitAudit();
    }
  }

  setDefaultDay() {
    this.auditDates.controls.dateRange.setErrors(null);
    this.auditDates.updateValueAndValidity();
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const yesterdayWeek = new Date();
    yesterdayWeek.setDate(yesterdayWeek.getDate() - 8);
    const defaultDateRange = [];
    defaultDateRange.push(yesterdayWeek);
    defaultDateRange.push(yesterdaysDate);
    this.auditDates.get("dateRange").setValue(defaultDateRange);
  }

  setDefaultMonth() {
    this.auditDates.controls.dateRange.setErrors(null);
    this.auditDates.updateValueAndValidity();
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    const yesterdayMonth = new Date(
      yesterdaysDate.getFullYear(),
      yesterdaysDate.getMonth(),
      1
    );
    defaultDateRange.push(yesterdayMonth);
    defaultDateRange.push(yesterdayMonth);
    this.auditDates.get("dateRange").setValue(defaultDateRange);
  }

  setDefaultWeek() {
    this.auditDates.controls.dateRange.setErrors(null);
    this.auditDates.updateValueAndValidity();
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const yesterdayWeek = new Date();
    yesterdayWeek.setDate(yesterdayWeek.getDate() - 8);
    this.auditDates.get("weeklyFromDate").setValue(yesterdayWeek);
    this.auditDates.get("weeklyToDate").setValue(yesterdaysDate);
  }

  OnSelectFrequency(e) {
    this.showMonthlyCalendar = false;
    this.showDailyCalendar = false;
    this.showWeeklyCalendar = false;
    if (e.value === "W") {
      this.setDefaultWeek();
      this.showWeeklyCalendar = true;
    } else if (e.value === "M") {
      this.setDefaultMonth();
      this.showMonthlyCalendar = true;
    } else {
      this.setDefaultDay();
      this.showDailyCalendar = true;
    }
    this.setFreq(e.value);
    this.onSubmitAudit();
  }

  getMonths(processedDateValue) {
    const fromDate = new Date(processedDateValue[0]);
    const toDate = new Date(processedDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  setFreq(frequencyValue) {
    this.frequency =
      frequencyValue === "D"
        ? "Daily"
        : frequencyValue === "W"
        ? "Weekly"
        : "Monthly";
  }

  setFrequency() {
    this.freqList = [];
    this.freqList.push(
      {
        value: "D",
        label: "Daily"
      },
      { value: "W", label: "Weekly" },
      { value: "M", label: "Monthly" }
    );
    this.auditDates.get("frequency").setValue("D");
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  get getFromDateVal() {
    return this.auditDates.controls.weeklyFromDate;
  }

  getAuditChartNoValue() {
    this.isDataPresent = false;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "none";
    this.optionsAudit.tooltip.trigger = "none";
    this.optionsAuditEnlarged.legend.position = "none";
    this.optionsAuditEnlarged.tooltip.trigger = "none";
    this.dataAudit.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    this.optionsAuditEnlarged.legend.position = "top";
    this.optionsAuditEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.auditSummaryDtos.auditSummaryDtos;
    this.setChartXAxis(responseValue);
    this.setChartScroll();
  }

  setChartXAxis(responseValue) {
    if (this.frequency === "Daily") {
      responseValue.forEach(val => {
        const frmDay = this.datePipe.transform(val.startDate, "MM-dd-yyyy");
        this.dataAudit.push([
          frmDay,
          val.passedAuditCount,
          val.passedAuditCount,
          val.failedAuditCount,
          val.failedAuditCount
        ]);
      });
    } else if (this.frequency === "Monthly") {
      responseValue.forEach(val => {
        const frmDay = this.datePipe.transform(val.startDate, "MM-yyyy");
        this.dataAudit.push([
          frmDay,
          val.passedAuditCount,
          val.passedAuditCount,
          val.failedAuditCount,
          val.failedAuditCount
        ]);
      });
    } else {
      responseValue.forEach(val => {
        const frmDay = this.datePipe.transform(val.startDate, "MM-dd-yyyy");
        const toDay = this.datePipe.transform(val.endDate, "MM-dd-yyyy");
        this.dataAudit.push([
          frmDay + " - " + toDay,
          val.passedAuditCount,
          val.passedAuditCount,
          val.failedAuditCount,
          val.failedAuditCount
        ]);
      });
    }
  }

  setChartScroll() {
    const statusLength = this.dataAudit.length;
    const newWidthEnlarged = statusLength > 7 ? statusLength * 90 : 700;
    const newGeneratedWidthEnlarged =
      newWidthEnlarged > 400 ? newWidthEnlarged : 800;
    this.optionsAuditEnlarged.width = newGeneratedWidthEnlarged;
    const newWidth = statusLength > 6 ? statusLength * 60 : 500;
    const newGeneratedWidth = newWidth > 50 ? newWidth : 500;
    this.optionsAudit.width = newGeneratedWidth;
  }

  getToDateValue() {
    const toDateValue =
      this.processedDates[1] !== null &&
      this.processedDates[1] !== "" &&
      this.processedDates[1] !== undefined
        ? this.processedDates[1]
        : this.processedDates[0];
    return toDateValue;
  }

  getAuditDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    const freq =
      this.frequency === "Daily"
        ? "daily"
        : this.frequency === "Weekly"
        ? "weekly"
        : "monthly";
    this.auditDashboardService.getAuditSumry(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      freq
    );
    this.auditSummaryDtos = this.auditDashboardService.auditSumryResponse;
    this.auditSummaryDtos = null;
    this.auditSubscription = this.auditDashboardService
      .getAuditSumryListner()
      .subscribe((data: any) => {
        this.auditSummaryDtos = data;
        this.dataAudit = [];
        this.auditSummaryDtos &&
        this.auditSummaryDtos.auditSummaryDtos.length > 0
          ? this.getAuditChartValue()
          : this.getAuditChartNoValue();
        this.auditSubscription.unsubscribe();
      });
    if (this.auditSummaryDtos === null || this.auditSummaryDtos === undefined) {
      this.getAuditChartNoValue();
    }
    this.isAuditRendered = true;
  }
  private constructPayload() {
    const freq =
      this.frequency === "Daily"
        ? "daily"
        : this.frequency === "Weekly"
        ? "weekly"
        : "monthly";
    const payload = {
      startDate: this.barDetails.data.startDate,
      endDate: this.barDetails.data.endDate,
      status: String(this.barDetails.type)
        .replace("Audit", "")
        .trim(),
      frequency: freq
    };
    return payload;
  }

  selectBar(bar) {
    this.barDetails = this.getBarDetails(bar[0]);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns(this.barDetails.type);
      this.chartDetail = [];
      this.auditDashboardService
        .auditedClaimsDetails(this.constructPayload())
        .subscribe(res => {
          this.chartDetail = res || [];
        });
      this.detailsView = true;
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.dataAudit[bar.row];
    const data = this.auditSummaryDtos.auditSummaryDtos[bar.row];
    const barDetails = {
      type: this.columnNamesAudit[bar.column],
      value: barValue[bar.column],
      data
    };
    return barDetails;
  }

  setColumns(type) {
    const prefix = [
      { header: "Claim ID", field: "claimId" },
      { header: "Claim Type", field: "claimType" },
      { header: "Audit Status", field: "auditStatus" },
      { header: "Auditor Name", field: "auditorName" },
      { header: "Examiner Name", field: "examinerName" },
      { header: "Audit Date", field: "auditDate" }
    ];
    const suffixPassed = [
      { header: "Claim Status", field: "claimStatus" },
      { header: "Billed Amount ($)", field: "billedAmount" },
      { header: "Allowed Amount($)", field: "allowedAmount" },
      { header: "Paid Amount($)", field: "paidAmount" },
      { header: "Processed Date", field: "processedDate" }
    ];
    const cols = {
      "Audit Passed": [...prefix, ...suffixPassed],
      "Audit Failed": [
        ...prefix,
        { header: "Error Type", field: "errorType" },
        { header: "Financial Impact", field: "financialImpact" },
        { header: "Amount($)", field: "amount" },
        { header: "Processed Date", field: "processedDate" }
      ]
    };
    return cols[type];
  }

  downloadExcel() {
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    this.auditDashboardService
      .auditedClaimsExcel(this.constructPayload())
      .subscribe(res => {
        this.notifierService.throwNotification({
          type: "success",
          message: "Report is generated."
        });
        const responseBody = res.body;
        const blob = new Blob([responseBody], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const today = new Date();
        const dateString = this.datePipe.transform(today, "MMddyyyy");
        const fileName = `Claims Audit Summary-${dateString}`;
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }

  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
