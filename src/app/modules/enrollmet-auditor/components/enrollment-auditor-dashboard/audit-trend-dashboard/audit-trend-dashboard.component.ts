import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-audit-trend-dashboard",
  templateUrl: "./audit-trend-dashboard.component.html",
  styleUrls: ["./audit-trend-dashboard.component.css"]
})
export class AuditTrendDashboardComponent implements OnInit, OnDestroy {
  public resetFormSubject: Subject<boolean> = new Subject<boolean>();
  reportSubscription: Subscription = new Subscription();
  processedDates = [];
  nonMondays: [];
  public isValid = true;
  public showMonthlyCalendar = true;
  public showDailyCalendar = false;
  public frequency: string;
  userStatusReportDto: any;
  public freqList = [];
  public rangeError = false;
  public invalidDateError = false;
  public auditDates: FormGroup;
  public maxDate = new Date();
  public maxMonth;
  constructor(
    private notifierService: NotifierService,
    private fbAudit: FormBuilder,
    public datePipe: DatePipe,
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService
  ) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const currentMonth = new Date(y, m, 1);
    this.maxMonth = currentMonth;
    const todayDate = new Date();
    const threeMonth = new Date();
    threeMonth.setMonth(threeMonth.getMonth() - 3);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonth);
    defaultDateRange.push(todayDate);
    this.auditDates = fbAudit.group({
      dateRange: [defaultDateRange, Validators.required],
      frequency: ["Monthly", Validators.required]
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.setFrequency();
    this.setFreq("M");
    this.onSubmitAudit();
  }

  get getDateRange() {
    return this.auditDates.controls.dateRange;
  }

  OnSelectFrequency(e) {
    this.showMonthlyCalendar = false;
    this.showDailyCalendar = false;
    if (e.value === "M") {
      this.setDefaultMonth();
      this.showMonthlyCalendar = true;
    } else {
      this.setDefaultDay();
      this.showDailyCalendar = true;
    }
    this.setFreq(e.value);
    this.processedDates = [];
    this.setAuditDates();
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
    } else {
      this.auditDates.controls.dateRange.setErrors(null);
      this.auditDates.updateValueAndValidity();
      valid = true;
    }
    return valid;
  }

  setDefaultDay() {
    this.auditDates.controls.dateRange.setErrors(null);
    this.auditDates.updateValueAndValidity();
    const todayDate = new Date();
    todayDate.setDate(todayDate.getDate());
    const defaultDateRange = [];
    defaultDateRange.push(todayDate);
    defaultDateRange.push(todayDate);
    this.auditDates.get("dateRange").setValue(defaultDateRange);
  }

  setDefaultMonth() {
    this.auditDates.controls.dateRange.setErrors(null);
    this.auditDates.updateValueAndValidity();

    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const currentMonth = new Date(y, m, 1);

    const threeMonth = new Date();
    threeMonth.setMonth(threeMonth.getMonth() - 3);
    const yy = date.getFullYear();
    const mm = date.getMonth();
    const threeMonthsBefore = new Date(yy, mm, 1);

    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(currentMonth);

    this.auditDates.get("dateRange").setValue(defaultDateRange);
  }

  setFreq(frequencyValue) {
    this.frequency = frequencyValue === "D" ? "Daily" : "Monthly";
  }

  setFrequency() {
    this.freqList = [];
    this.freqList.push(
      {
        value: "D",
        label: "Daily"
      },
      { value: "M", label: "Monthly" }
    );
    this.auditDates.get("frequency").setValue("M");
  }

  setAuditDates() {
    const processedDateValue = this.auditDates.get("dateRange").value;
    this.processedDates.push(processedDateValue[0]);
    this.processedDates.push(processedDateValue[1]);
    this.setFreq(this.auditDates.get("frequency").value);
    this.processedDates.push(this.frequency);
    this.enrollmentAuditorDashboardService.setAuditDetails(this.processedDates);
    this.onSubmitAudit();
  }

  onSubmitAudit() {
    this.processedDates = [];
    const processedDateValue = this.auditDates.get("dateRange").value;
    this.processedDates.push(processedDateValue[0]);
    this.processedDates.push(processedDateValue[1]);
    this.setFreq(this.auditDates.get("frequency").value);
    this.processedDates.push(this.frequency);
    this.enrollmentAuditorDashboardService.setAuditDetails(this.processedDates);
    this.resetChildForm();
  }

  validateDates() {
    const fromDateValue = this.auditDates.get("dateRange").value;
    this.validateRange(fromDateValue);
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

  ngOnDestroy() {
    this.reportSubscription.unsubscribe();
  }
}
