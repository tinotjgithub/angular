import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";
import { NotifierService } from "src/app/services/notifier.service";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-audit-summary-by-audit-status",
  templateUrl: "./audit-summary-by-audit-status.component.html",
  styleUrls: ["./audit-summary-by-audit-status.component.css"]
})
export class AuditSummaryByAuditStatusComponent
  implements OnInit, OnDestroy, AfterViewInit {
  auditSummaryDtos: any;
  @ViewChild("CategorySelect", { static: false })
  CategorySelect: MultiSelect;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input()
  public processedDates: Array<{}>;
  frequency: string;
  public showMonthlyCalendar = false;
  public maxDate = new Date();
  public isDataPresent = false;
  public showDailyCalendar = true;
  public enlargedDisplay = false;
  public editMode: boolean;
  public status = "";
  public date = "";
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
    { role: "annotation" },
    "Transaction Count Mismatch",
    { role: "annotation" }
  ];
  public optionsAudit = {
    colors: ["#4cc14f", "#ff5c5d", "#deb833"],
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
      left: 40,
      right: 40,
      top: 17,
      bottom: 50
    },
    legend: {
      textStyle: { fontSize: 12 },
      position: "top"
    },
    animation: {
      duration: 1200,
      easing: "out",
      startup: true
    },
    isStacked: true
  };

  public optionsAuditEnlarged = {
    colors: ["#4cc14f", "#ff5c5d", "#deb833"],
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
      left: 80,
      right: 50,
      top: 25,
      bottom: 60
    },
    legend: {
      textStyle: { fontSize: 14 },
      position: "top"
    },
    animation: {
      duration: 1200,
      easing: "out",
      startup: true
    },
    isStacked: true
  };
  public auditDates: FormGroup;
  public dataAudit = [];
  public isAuditRendered = false;
  public widthAudit = 600;
  public widthEnlargedAudit = 800;
  public heightAudit = 250;
  public freqList = [];
  public chartDetail: any[];
  public barDetails: { type: any; value: any; data: any };
  public cols: any;
  public maxMonth;
  public detailsView: boolean;
  categorySubscription: Subscription = new Subscription();
  public category = [];
  public catList = [];
  public catArray = [];
  constructor(
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService,
    public datePipe: DatePipe,
    private fbAudit: FormBuilder,
    private notifierService: NotifierService
  ) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const currentMonth = new Date(y, m, 1);
    this.maxMonth = currentMonth;
    const todaysDate = new Date();
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() - 3);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonths);
    defaultDateRange.push(todaysDate);
    this.showDailyCalendar = false;
    this.showMonthlyCalendar = true;
    this.auditDates = fbAudit.group({
      dateRange: [defaultDateRange, Validators.required],
      frequency: ["Monthly", Validators.required],
      category: [""]
    });
  }

  get getCategory() {
    return this.auditDates.controls.category;
  }

  ngOnInit() {
    this.setFrequency();
    this.setFreq("M");
    this.getEnrollManagerCategory();
    this.onSubmitAudit();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  get getDateRange() {
    return this.auditDates.controls.dateRange;
  }

  mapCategory() {
    const selectedScopes = [];
    if (this.category && this.category.length > 0) {
      this.category.forEach(s => {
        this.catList.push({
          label: s.name,
          value: {
            id: s.id,
            name: s.name,
            code: s.name
          }
        });
      });
      this.catList.forEach(item => selectedScopes.push(item.value));
    }
    this.auditDates.get("category").setValue(selectedScopes);
    this.catList.forEach(q => {
      this.catArray.push(q.value.id);
    });
    this.onSubmitAudit();
  }

  mapCat(cate) {
    const catArr = [];
    if (cate !== null && cate.length > 0) {
      for (let i = 0; i < this.catList.length; i++) {
        cate.forEach(item => {
          if (this.catList[i].value.id === item.id) {
            catArr.push(item.id);
          }
        });
      }
    }
    return catArr;
  }

  mapCatNames(cate) {
    const catArr = [];
    if (cate !== null && cate.length > 0) {
      for (let i = 0; i < this.catList.length; i++) {
        cate.forEach(item => {
          if (this.catList[i].value.id === item.id) {
            catArr.push(item.name);
          }
        });
      }
    }
    return catArr;
  }

  validateCategory() {
    this.updateMultiSelectLabels();
    this.onSubmitAudit();
  }

  updateMultiSelectLabels() {
    this.CategorySelect.updateLabel = function() {
      const catLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Work Category Selected"
          : this.value.length.toString() + " Work Categories Selected";
      this.valuesAsString = catLabel;
    };
  }

  getEnrollManagerCategory() {
    this.category = [];
    this.enrollmentAuditorDashboardService.getEnrollAuditorCategory();
    this.category = this.enrollmentAuditorDashboardService.enrollAuditorCategoryResponse;
    this.categorySubscription = this.enrollmentAuditorDashboardService
      .getEnrollAuditorCategoryListner()
      .subscribe(data => {
        this.category = data;
        this.mapCategory();
        this.categorySubscription.unsubscribe();
      });
  }

  onSubmitAudit() {
    if (
      this.getDateRange.invalid ||
      this.auditDates.get("category").value === "" ||
      this.auditDates.get("category").value.length <= 0
    ) {
      return;
    } else {
      this.processedDates = [];
      const processedDateValue = this.auditDates.get("dateRange").value;
      this.processedDates.push(processedDateValue[0]);
      this.processedDates.push(processedDateValue[1]);

      const frequencyValue = this.auditDates.get("frequency").value;
      this.setFreq(frequencyValue);
      this.getAuditDays();
    }
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

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataAudit.length > 0) {
      const row = e[0].row;
      const col = e[0].column;
      this.date = this.dataAudit[row][0];
      const a = this.columnNamesAudit[col];
      const workCategoryIds = this.mapCat(
        this.auditDates.get("category").value
      );
      const workCategoryNames = this.mapCatNames(
        this.auditDates.get("category").value
      );
      const act = typeof a === "object" ? this.columnNamesAudit[col - 1] : a;
      this.status = act.toString();
      this.editUser = {
        mode: this.status,
        type: "audit-summary-audit-status",
        status:
          this.status === "Audit Passed"
            ? "PASSED"
            : this.status === "Audit Failed"
            ? "FAILED"
            : "TRANSACTION MISMATCH",
        date: this.date,
        frequency:
          this.auditDates.get("frequency").value === "M" ? "Monthly" : "Daily",
          workCategoryIds,
          workCategoryNames
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  setDefaultDay() {
    this.auditDates.controls.dateRange.setErrors(null);
    this.auditDates.updateValueAndValidity();
    const todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate());

    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    this.auditDates.get("dateRange").setValue(defaultDateRange);
  }

  setDefaultMonth() {
    this.auditDates.controls.dateRange.setErrors(null);
    this.auditDates.updateValueAndValidity();
    const todaysDate = new Date();
    const defaultDateRange = [];
    const threeMonth = new Date(
      todaysDate.getFullYear(),
      todaysDate.getMonth(),
      3
    );
    const today = new Date();
    const todaysMonth = new Date(today.getFullYear(), today.getMonth(), 3);
    defaultDateRange.push(threeMonth);
    defaultDateRange.push(todaysMonth);
    this.auditDates.get("dateRange").setValue(defaultDateRange);
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

  showDialog() {
    this.enlargedDisplay = true;
  }

  getAuditChartNoValue() {
    this.isDataPresent = false;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "none";
    this.optionsAudit.tooltip.trigger = "none";
    this.optionsAuditEnlarged.legend.position = "none";
    this.optionsAuditEnlarged.tooltip.trigger = "none";
    this.dataAudit.push(["NO DATA", 0, "0", 0, "0", 0, "0"]);
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    this.optionsAuditEnlarged.legend.position = "top";
    this.optionsAuditEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.auditSummaryDtos;
    this.setChartXAxis(responseValue);
    this.setChartScroll();
  }

  setChartXAxis(responseValue) {
    if (this.frequency === "Daily") {
      responseValue.forEach(val => {
        const frmDay = this.datePipe.transform(val.startDate, "MM-dd-yyyy");
        this.dataAudit.push([
          frmDay,
          val.successAuditCount,
          val.successAuditCount,
          val.failedAuditCount,
          val.failedAuditCount,
          val.transactionCountMismatch,
          val.transactionCountMismatch
        ]);
      });
    } else if (this.frequency === "Monthly") {
      responseValue.forEach(val => {
        const frmDay = this.datePipe.transform(val.startDate, "MM-yyyy");
        this.dataAudit.push([
          frmDay,
          val.successAuditCount,
          val.successAuditCount,
          val.failedAuditCount,
          val.failedAuditCount,
          val.transactionCountMismatch,
          val.transactionCountMismatch
        ]);
      });
    }
  }

  setChartScroll() {
    this.widthAudit =
      this.auditSummaryDtos.length > 6
        ? this.auditSummaryDtos.length * 100
        : 600;
    this.widthEnlargedAudit =
      this.auditSummaryDtos.length > 6
        ? this.auditSummaryDtos.length * 100
        : 800;
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
    const freq = this.frequency === "Daily" ? "daily" : "monthly";
    this.enrollmentAuditorDashboardService.getAuditTrans(
      this.mapCat(this.auditDates.get("category").value),
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      freq
    );
    this.auditSummaryDtos = this.enrollmentAuditorDashboardService.auditTransResponse;
    this.auditSummaryDtos = null;
    this.auditSubscription = this.enrollmentAuditorDashboardService
      .getAuditTransListner()
      .subscribe((data: any) => {
        this.auditSummaryDtos = data;
        this.dataAudit = [];
        this.auditSummaryDtos && this.auditSummaryDtos.length > 0
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
    const freq = this.frequency === "Daily" ? "daily" : "monthly";
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

  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
