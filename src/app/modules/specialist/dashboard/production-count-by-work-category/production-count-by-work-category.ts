import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-production-count-by-work-category",
  templateUrl: "./production-count-by-work-category.html"
})
export class ProductionCountByWorkCategoryComponent implements OnInit {
  public cat = "";
  private statusSubscription: Subscription = new Subscription();
  userStatusDto: any;
  public isStatusRendered = false;
  public displayEnlarged = false;
  public title = "";
  public type = "PieChart";
  public dataWb = [];
  public isDataPresent = false;
  public height = 250;
  public myColumnNames = ["Transaction", "Count"];
  public editUser = {};
  public editMode = false;
  public options = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 50,
      right: 50,
      top: 20,
      bottom: 10
    },
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
      "#f6ff00",
      "#02a2ce",
      "#b03761",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268",
      "#ea4f5b",
      "#f7614d",
      "#ff763b",
      "#ff8e26"
    ],
    pieSliceText: "value-and-percentage",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    }
  };

  public optionsEnlarged = {
    pieSliceTextStyle: { fontSize: 16 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 60,
      right: 20,
      top: 30,
      bottom: 10
    },
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
      "#f6ff00",
      "#02a2ce",
      "#b03761",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268",
      "#ea4f5b",
      "#f7614d",
      "#ff763b",
      "#ff8e26"
    ],
    pieSliceText: "value-and-percentage",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true
    },
    legend: {
      position: "top",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 13
      }
    }
  };
  public dateForm: FormGroup;
  public maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private enrollmentService: EnrollmentManagementService
  ) {}

  ngOnInit() {
    const today = new Date();
    const todaysDate = new Date(this.datePipe.transform(today, "yyyy-MM-dd"));
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    this.dateForm = this.fb.group({
      dateRange: [defaultDateRange, [Validators.required, this.validateDates]]
    });
    this.getData();
  }

  getNoDataChart() {
    this.dataWb = [];
    this.isDataPresent = false;
    this.dataWb.push(["NO DATA", 1]);
    this.options.pieSliceText = "label";
    this.options.tooltip.text = "none";
    this.options.legend.position = "none";
    this.optionsEnlarged.pieSliceText = "label";
    this.optionsEnlarged.tooltip.text = "none";
    this.optionsEnlarged.legend.position = "none";
  }

  validateDates(control: AbstractControl) {
    const dateDifference = formValue => {
      const fromDate = new Date(formValue[0]);
      const toDate = new Date(formValue[1]);
      const diffInMonths =
        (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
        (toDate.getMonth() - fromDate.getMonth());
      return diffInMonths;
    };
    const fromDateValue = control.value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = dateDifference(fromDateValue);
      return diffInMonths < 6 ? null : { invalidDate: true };
    } else {
      return null;
    }
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataWb.length > 0) {
      const value = this.dateForm.value.dateRange;
      const fromDate = this.datePipe.transform(value[0], "yyyy-MM-dd");
      const toDate = this.datePipe.transform(
        value[1] ? value[1] : value[0],
        "yyyy-MM-dd"
      );
      const row = e[0].row;
      const status = this.dataWb[row][0];
      this.cat = this.dataWb[row][0].toString();
      this.editUser = {
        type: "production-count-by-work-category",
        status,
        fromDate,
        toDate
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getDataChart() {
    this.dataWb = [];
    this.options.pieSliceText = "value-and-percentage";
    this.options.tooltip.text = "value-and-percentage";
    this.options.legend.position = "top";
    this.optionsEnlarged.pieSliceText = "value-and-percentage";
    this.optionsEnlarged.tooltip.text = "value-and-percentage";
    this.optionsEnlarged.legend.position = "top";
    const responseValue = this.userStatusDto;
    if (responseValue.length > 0) {
      this.isDataPresent = true;
      responseValue.map(val => {
        this.dataWb.push([val.requestType, val.requestCount]);
      });
    } else {
      this.isDataPresent = false;
    }
  }

  getData() {
    const value = this.dateForm.value.dateRange;
    const payload = {
      fromDate: this.datePipe.transform(value[0], "yyyy-MM-dd"),
      toDate: this.datePipe.transform(
        value[1] ? value[1] : value[0],
        "yyyy-MM-dd"
      )
    };
    this.dataWb = [];
    this.statusSubscription = this.enrollmentService
      .specialistRequestByType(payload)
      .subscribe(res => {
        this.userStatusDto = res;
        this.dataWb = [];
        this.userStatusDto && this.userStatusDto.length > 0
          ? this.getDataChart()
          : this.getNoDataChart();
        this.statusSubscription.unsubscribe();
      });
    if (this.userStatusDto === null || this.userStatusDto === undefined) {
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }
}
