import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";

@Component({
  selector: "app-inventory-by-status",
  templateUrl: "./inventory-by-status.component.html"
})
export class InventoryByStatusComponent implements OnInit {
  public displayEnlarged = false;
  public sts = null;
  public isDataPresent = false;
  public titleStatus = "";
  public typeStatus = "PieChart";
  public dataStatus = [];
  public heightStatus = 250;
  public myColumnNamesStatus = ["Status", "Count"];
  public editUser = {};
  public editMode = false;
  public optionsStatus = {
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
      bottom: 10
    },
    colors: ["#4cc14f", "#ff9226", "#ff5c5d"],
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

  public optionsStatusEnlarged = {
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
      bottom: 20
    },
    colors: ["#4cc14f", "#ff9226", "#ff5c5d"],
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
    this.isDataPresent = false;
    this.dataStatus = [];
    this.dataStatus.push(["NO DATA", 1]);
    this.optionsStatus.pieSliceText = "label";
    this.optionsStatus.tooltip.text = "none";
    this.optionsStatus.legend.position = "none";
    this.optionsStatusEnlarged.pieSliceText = "label";
    this.optionsStatusEnlarged.tooltip.text = "none";
    this.optionsStatusEnlarged.legend.position = "none";
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
    if (e.length > 0 && this.dataStatus.length > 0) {
      const row = e[0].row;
      const status = this.dataStatus[row][0];
      this.sts = this.dataStatus[row][0];
      const count = this.dataStatus[row][1];
      const fromDateValue = this.dateForm.get("dateRange").value;
      this.editUser = {
        type: "inventory-status",
        status,
        fromDate: this.datePipe.transform(fromDateValue[0], "yyyy-MM-dd"),
        toDate: this.datePipe.transform(
          fromDateValue[1] ? fromDateValue[1] : fromDateValue[0],
          "yyyy-MM-dd"
        )
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getData() {
    const mapRes = {
      Completed: 0,
      Assigned: 0,
      Pended: 0
    };
    const value = this.dateForm.value.dateRange;
    const payload = {
      fromDate: this.datePipe.transform(value[0], "yyyy-MM-dd"),
      toDate: this.datePipe.transform(
        value[1] ? value[1] : value[0],
        "yyyy-MM-dd"
      )
    };
    this.dataStatus = [];
    this.enrollmentService.specialistRequestByStatus(payload).subscribe(
      res => {
        if (res) {
          this.optionsStatus.pieSliceText = "value-and-percentage";
          this.optionsStatus.tooltip.text = "value-and-percentage";
          this.optionsStatus.legend.position = "top";
          this.optionsStatusEnlarged.pieSliceText = "value-and-percentage";
          this.optionsStatusEnlarged.tooltip.text = "value-and-percentage";
          this.optionsStatusEnlarged.legend.position = "top";
          if (res.length > 0) {
            this.isDataPresent = true;
            res.forEach(val => {
              mapRes[val.status] = val.requestCount;
            });
            Object.keys(mapRes).forEach(key => {
              this.dataStatus.push([key, mapRes[key]]);
            });
          } else {
            this.getNoDataChart();
          }
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
