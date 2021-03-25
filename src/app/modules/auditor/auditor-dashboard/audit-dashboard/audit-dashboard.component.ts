import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { AuditDashboardService } from "./../audit-dashboard.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

@Component({
  selector: "app-audit-dashboard",
  templateUrl: "./audit-dashboard.component.html"
})
export class AuditorDashboardComponent implements OnInit {
  public resetFormSubject: Subject<boolean> = new Subject<boolean>();
  processedDates = [];
  nonMondays: [];
  public isValid = true;
  public rangeError = false;
  public invalidDateError = false;
  public auditDates: FormGroup;
  public maxDate = new Date();
  constructor(
    private fbAudit: FormBuilder,
    public datePipe: DatePipe,
    private auditDashboardService: AuditDashboardService,
    private taskMgtService: TaskmanagementService
  ) {
    const maxDay = new Date();
    maxDay.setDate(maxDay.getDate() - 1);
    this.maxDate = maxDay;
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(yesterdaysDate);
    defaultDateRange.push(yesterdaysDate);
    this.auditDates = fbAudit.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.processedDates = [];
    this.setAuditDates();
  }

  get getDateRange() {
    return this.auditDates.controls.dateRange;
  }

  setAuditDates() {
    const processedDateValue = this.auditDates.get("dateRange").value;
    this.processedDates.push(processedDateValue[0]);
    this.processedDates.push(processedDateValue[1]);
    this.auditDashboardService.setAuditDetails(this.processedDates);
  }

  onSubmitAudit() {
    if (this.auditDates.invalid) {
      return;
    }
    this.processedDates = [];
    const processedDateValue = this.auditDates.get("dateRange").value;
    this.processedDates.push(processedDateValue[0]);
    this.processedDates.push(processedDateValue[1]);
    this.auditDashboardService.setAuditDetails(this.processedDates);
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
      const isValid = diffInMonths > 6 ? false : true;
      if (!isValid) {
        this.auditDates.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.auditDates.updateValueAndValidity();
      } else {
        this.auditDates.controls.dateRange.setErrors(null);
        this.auditDates.updateValueAndValidity();
        this.onSubmitAudit();
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

  resetChildForm() {
    this.resetFormSubject.next(true);
  }
}
