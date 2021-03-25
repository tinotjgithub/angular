import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  Validators,
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-request-count-by-transaction",
  templateUrl: "./request-count-by-transaction.component.html"
})
export class RequestCountByTransactionComponent implements OnInit {
  public displayEnlarged = false;
  public title = "";
  public type = "PieChart";
  public data = [["NO-DATA", 0]];
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
      top: 17,
      bottom: 1
    },
    colors: ["#2f6da1", "#d1cf36", "#00c7b3"],
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
    colors: ["#2f6da1", "#d1cf36", "#00c7b3"],
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
    this.data = [];
    this.data.push(["NO DATA", 1]);
    this.options.pieSliceText = "label";
    this.options.tooltip.text = "none";
    this.options.legend.position = "none";
    this.optionsEnlarged.pieSliceText = "label";
    this.optionsEnlarged.tooltip.text = "none";
    this.optionsEnlarged.legend.position = "none";
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const status = this.data[row][0];
      const count = this.data[row][1];
      this.editUser = {
        type: "production-volume-trans",
        status: status,
        count: count
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
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

  getData() {
    const value = this.dateForm.value.dateRange;
    const payload = {
      fromDate: this.datePipe.transform(value[0], "yyyy-MM-dd"),
      toDate: this.datePipe.transform(
        value[1] ? value[1] : value[0],
        "yyyy-MM-dd"
      )
    };
    this.data = [["NO DATA", 1]];
    this.enrollmentService.specialistRequestByTransaction(payload).subscribe(
      res => {
        if (res) {
          this.data = [];
          this.options.pieSliceText = "value-and-percentage";
          this.options.tooltip.text = "value-and-percentage";
          this.options.legend.position = "top";
          this.optionsEnlarged.pieSliceText = "value-and-percentage";
          this.optionsEnlarged.tooltip.text = "value-and-percentage";
          this.optionsEnlarged.legend.position = "top";
          res.forEach(val => {
            this.data.push([val.transactionType, val.requestCount]);
          });
        } else {
          this.getNoDataChart();
        }
      },
      err => {
        this.getNoDataChart();
      }
    );
  }
}
