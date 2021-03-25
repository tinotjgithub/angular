import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EnrollmentLeadDashboardService } from "./../enrollment-lead-dashboard.service";

@Component({
  selector: "app-specialist-working-time-trend",
  templateUrl: "./specialist-working-time-trend.component.html",
  styleUrls: ["./specialist-working-time-trend.component.css"]
})
export class SpecialistWorkingTimeTrendComponent implements OnInit, OnDestroy {
  auditSummaryDtos: any;
  public processedDates: Array<{}>;
  public maxDate = new Date();
  frequency: string;
  public editMode = false;
  public editUser = {};
  public showMonthlyCalendar = false;
  public showWeeklyCalendar = false;
  public showDailyCalendar = true;
  public enlargedDisplay = false;
  userAuditReportDto: any;
  private auditSubscription: Subscription = new Subscription();
  public columnNamesAudit = [
    "",
    "Specialist",
    { role: "annotation" },
    "Target",
    { role: "annotation" }
  ];
  public isDataPresent = false;
  public typeAudit = "LineChart";
  public titleAudit = "";
  public optionsAudit = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    colors: ["#7a5195", "#ef5675"],
    hAxis: {
      title: "",
      type: "string",
      textStyle: {
        fontSize: 12
      }
    },
    vAxis: {
      minValue: 0,
      title: "",
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      width: "20%",
      textStyle: {
        fontSize: 12
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    chartArea: {
      left: 30,
      right: 10,
      top: 17,
      bottom: 35
    },
    pointSize: 3,
    annotations: {
      textStyle: {
        fontSize: 12
      }
    },
    series: {
      0: {
        // series 0
        annotations: {
          stem: {
            length: 0
          }
        }
      },
      1: {
        // series 1
        annotations: {
          stem: {
            length: 7
          }
        }
      }
    }
  };
  public widthAudit = 500;
  public heightAudit = 200;
  public auditDates: FormGroup;
  public dataAudit = [];
  public isAuditRendered = false;
  public maxMonth;
  public freqList = [];
  constructor(
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe,
    private fbAudit: FormBuilder
  ) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const currentMonth = new Date(y, m, 1);
    this.maxMonth = currentMonth;
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const maxDay = new Date();
    maxDay.setDate(maxDay.getDate() - 1);
    this.maxDate = maxDay;
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
  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const status = this.dataAudit[row][0];
      const count = this.dataAudit[row][1];
      this.editUser = { type: "spl-wor", status: status, count: count };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
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
        const rangeError = diffInMonths < 6 ? false : true;
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
    this.dataAudit.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.auditSummaryDtos.auditSummaryDtos;
    this.setChartXAxis(responseValue);
  }

  setChartXAxis(responseValue) {
    if (this.frequency === "Daily") {
      responseValue.forEach(val => {
        const frmDay = this.datePipe.transform(val.startDate, "MM-dd-yyyy");
        this.dataAudit.push([
          frmDay,
          val.specialist,
          val.specialist,
          val.target,
          val.target
        ]);
      });
    } else if (this.frequency === "Monthly") {
      responseValue.forEach(val => {
        const frmDay = this.datePipe.transform(val.startDate, "MM-yyyy");
        this.dataAudit.push([
          frmDay,
          val.specialist,
          val.specialist,
          val.target,
          val.target
        ]);
      });
    } else {
      responseValue.forEach(val => {
        const frmDay = this.datePipe.transform(val.startDate, "MM-dd-yyyy");
        const toDay = this.datePipe.transform(val.endDate, "MM-dd-yyyy");
        this.dataAudit.push([
          frmDay + " - " + toDay,
          val.specialist,
          val.specialist,
          val.target,
          val.target
        ]);
      });
    }
  }

  getToDateValue() {
    let toDateValue;
    if (this.processedDates) {
      toDateValue =
        this.processedDates[1] !== null &&
        this.processedDates[1] !== "" &&
        this.processedDates[1] !== undefined
          ? this.processedDates[1]
          : this.processedDates[0];
    }
    return toDateValue;
  }

  getAuditDays() {
    const processedDateValue = this.auditDates.get("dateRange").value;
    this.processedDates = [];
    this.processedDates.push(processedDateValue[0]);
    this.processedDates.push(processedDateValue[1]);
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    const freq =
      this.frequency === "Daily"
        ? "daily"
        : this.frequency === "Weekly"
        ? "weekly"
        : "monthly";
    this.enrollmentLeadDashboardService.getSpecialistWorkingClaims(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      freq
    );
    this.auditSummaryDtos = this.enrollmentLeadDashboardService.specialistWorkingResponse;
    this.auditSummaryDtos = null;
    this.auditSubscription = this.enrollmentLeadDashboardService
      .getSpecialistWorkingClaimsListner()
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
  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
