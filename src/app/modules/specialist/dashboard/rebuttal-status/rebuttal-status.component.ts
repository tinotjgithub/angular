import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  Validators,
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-rebuttal-status",
  templateUrl: "./rebuttal-status.component.html"
})
export class RebuttalStatusComponent implements OnInit {
  public displayEnlarged = false;
  private rebuttalSubscription: Subscription = new Subscription();
  public title = "";
  public type = "PieChart";
  public isDataPresent = false;
  public data = [["NO-DATA", 0]];
  public height = 250;
  public status: any;
  public editUser = {};
  public editMode = false;
  rebuttalDto: any;
  public isRebuttalRendered = false;
  public myColumnNames = ["Transaction", "Count"];
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
      bottom: 20
    },
    colors: ["#00aadf", "#ff5c5d", "#75bb00"],
    pieSliceText: "value",
    tooltip: {
      text: "value",
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
      bottom: 20
    },
    colors: ["#00aadf", "#ff5c5d", "#75bb00"],
    pieSliceText: "value",
    tooltip: {
      text: "value",
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
        fontSize: 13
      }
    }
  };
  public dateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private enrollmentService: EnrollmentManagementService
  ) {}

  ngOnInit() {
    const defaultDateRange = [];
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const thirtyDate = new Date();
    thirtyDate.setDate(thirtyDate.getDate() - 31);
    defaultDateRange.push(thirtyDate);
    defaultDateRange.push(yesterdaysDate);
    this.dateForm = this.fb.group({
      dateRange: [defaultDateRange, [Validators.required, this.validateDates]]
    });
    this.getData();
  }

  getNoDataChart() {
    this.data = [];
    this.isDataPresent = false;
    this.data.push(["NO DATA", 1]);
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

  getToDateValue() {
    const toDateValue =
      this.dateForm.get("dateRange").value[1] !== null &&
      this.dateForm.get("dateRange").value[1] !== "" &&
      this.dateForm.get("dateRange").value[1] !== undefined
        ? this.dateForm.get("dateRange").value[1]
        : this.dateForm.get("dateRange").value[0];
    return toDateValue;
  }

  getData() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.dateForm.get("dateRange").value[0];
    this.enrollmentService.getRebuttalStatus(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.rebuttalDto = this.enrollmentService.openInvReqResponse;
    this.rebuttalDto = null;
    this.rebuttalSubscription = this.enrollmentService
      .getRebuttalStatusListner()
      .subscribe((data: any) => {
        this.rebuttalDto = data;
        this.data = [];
        if (this.rebuttalDto && this.rebuttalDto.userRebuttalDtos.length > 0) {
          this.isDataPresent = true;
          this.getDataChart();
        } else {
          this.getNoDataChart();
        }
        this.rebuttalSubscription.unsubscribe();
      });
    if (this.rebuttalDto === null || this.rebuttalDto === undefined) {
      this.getNoDataChart();
    }
    this.isRebuttalRendered = true;
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.data.length > 0) {
      const row = e[0].row;
      const status = this.data[row][0];
      this.status = status;
      const fromDateValue = this.dateForm.get("dateRange").value[0];
      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(this.getToDateValue(), "yyyy-MM-dd");
      const type = "rebuttal-status";
      this.editUser = {
        status,
        type,
        fromDate: from,
        toDate: to
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getDataChart() {
    this.data = [];
    this.options.pieSliceText = "value";
    this.options.tooltip.text = "value";
    this.options.legend.position = "top";
    this.optionsEnlarged.pieSliceText = "value";
    this.optionsEnlarged.tooltip.text = "value";
    this.optionsEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue = this.rebuttalDto.userRebuttalDtos;
    this.mapResponseValue(responseValue);
  }

  mapResponseValue(responseValue) {
    responseValue.map(val => {
      this.data.push([val.status, val.transactionCount]);
    });
  }
}
