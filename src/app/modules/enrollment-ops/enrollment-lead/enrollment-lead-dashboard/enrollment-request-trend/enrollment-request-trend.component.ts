import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentLeadDashboardService } from "./../enrollment-lead-dashboard.service";

@Component({
  selector: "app-enrollment-request-trend",
  templateUrl: "./enrollment-request-trend.component.html",
  styleUrls: ["./enrollment-request-trend.component.css"]
})
export class EnrollmentRequestTrendComponent implements OnInit {
  private myProductivitySubscription: Subscription = new Subscription();
  public userProductivityDto: any;
  public isDataPresent = false;
  public myDataProductivity = [];
  public isProductivityRendered = false;
  public myProductivityDates: FormGroup;
  public enlargedDisplay = false;
  public editMode = false;
  public editUser = {};
  public isValid = true;
  public maxDate = new Date();
  public myProductivityType = "LineChart";
  public myTitleProductivity = "";
  public myTypeProductivity = "LineChart";
  public myColumnNamesProductivity = [
    "",
    "Request Count",
    { role: "annotation" }
  ];
  public myOptionsProductivity = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    colors: ["3a859e"],
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
      bottom: 40
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
  public myWidthProductivity = 500;
  public myHeightProductivity = 250;

  constructor(
    private fbsts: FormBuilder,
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe
  ) {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(prevDate.getMonth() - 3)
    );
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    this.myProductivityDates = fbsts.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.getMyProductivityDays();
  }

  get getDateRange() {
    return this.myProductivityDates.controls.dateRange;
  }

  showDialog() {
    this.myOptionsProductivity.annotations.textStyle.fontSize = 13;
    this.enlargedDisplay = true;
  }

  getNoDataChart() {
    this.isDataPresent = false;
    this.myDataProductivity = [];
    this.myOptionsProductivity.legend.position = "none";
    this.myOptionsProductivity.tooltip.trigger = "none";
    this.myDataProductivity.push(["NO DATA", 0, "0"]);
  }

  getDataChart() {
    this.isDataPresent = true;
    this.myDataProductivity = [];
    this.myOptionsProductivity.legend.position = "top";
    this.myOptionsProductivity.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.userProductivityDto;
    if (responseValue !== null && responseValue.length !== 0) {
      responseValue.forEach(val => {
        this.myDataProductivity.push([
          this.datePipe.transform(val.monthStartDate, "MM-yyyy"),
          val.requestCount,
          val.requestCount
        ]);
      });
    } else {
      this.getNoDataChart();
    }
  }
  getToDateValue() {
    const toDateValue =
      this.myProductivityDates.get("dateRange").value[1] !== null &&
      this.myProductivityDates.get("dateRange").value[1] !== "" &&
      this.myProductivityDates.get("dateRange").value[1] !== undefined
        ? this.myProductivityDates.get("dateRange").value[1]
        : this.myProductivityDates.get("dateRange").value[0];
    return toDateValue;
  }

  getMyProductivityDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.myProductivityDates.get("dateRange").value[0];
    this.enrollmentLeadDashboardService.getEnrollmentRequestTrend(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userProductivityDto = this.enrollmentLeadDashboardService.enrollmentRequestResponse;
    this.userProductivityDto = null;
    this.myProductivitySubscription = this.enrollmentLeadDashboardService
      .getEnrollmentRequestTrendListner()
      .subscribe((data: any) => {
        this.userProductivityDto = data;
        this.myDataProductivity = [];
        this.userProductivityDto && this.userProductivityDto
          ? this.getDataChart()
          : this.getNoDataChart();
        this.myProductivitySubscription.unsubscribe();
      });
    if (this.userProductivityDto === null) {
      this.getNoDataChart();
    }
    this.isProductivityRendered = true;
  }

  validateDates() {
    const fromDateValue = this.myProductivityDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const date1 = new Date(fromDateValue[0]);
      const date2 = new Date(fromDateValue[1]);
      this.isValid = this.getNoOfmonths(date1, date2) < 6 ? true : false;
    } else {
      this.isValid = true;
    }
  }

  getNoOfmonths(date1, date2) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth() + 1;
    months += date2.getMonth() + 1;
    return months <= 0 ? 0 : months;
  }

  onSubmitMyProductivity() {
    this.getMyProductivityDays();
  }

  onDestroy() {
    this.myProductivitySubscription.unsubscribe();
  }
}
