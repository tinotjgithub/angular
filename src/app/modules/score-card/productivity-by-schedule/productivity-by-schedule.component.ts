import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ProductivitySchedule } from "src/app/services/task-management/models/ProductivitySchedule";

import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

@Component({
  selector: "app-productivity-by-schedule",
  templateUrl: "./productivity-by-schedule.component.html"
})
export class ProductivityByScheduleComponent implements OnInit {
  private myProductivitySubscription: Subscription = new Subscription();
  private reportSubscription: Subscription = new Subscription();
  private userProductivityReportDto: any;
  public userProductivityDto: ProductivitySchedule;
  public myDataProductivity = [];
  public isProductivityRendered = false;
  public myProductivityDates: FormGroup;
  public enlargedDisplay = false;
  public isDataPresent = false;
  public isValid = true;
  public maxDate = new Date();
  public myProductivityType = "LineChart";
  public myTitleProductivity = "";
  public myTypeProductivity = "LineChart";
  public myColumnNamesProductivity = [
    "",
    "Claims Completed",
    { role: "annotation" },
    "Target",
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
    colors: ["#1f9675", "#c7203e"],
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
        fontSize: 11
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
  public myWidthProductivity = 520;
  public myHeightProductivity = 235;

  constructor(
    private fbsts: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe
  ) {
    const today = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(today);
    defaultDateRange.push(today);
    this.myProductivityDates = fbsts.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.getMyProductivityDays();
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
    this.myDataProductivity.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getDataChart() {
    this.isDataPresent = true;
    this.myDataProductivity = [];
    this.myOptionsProductivity.legend.position = "top";
    this.myOptionsProductivity.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.userProductivityDto.userProductivityDto;
    if (responseValue !== null && responseValue.length !== 0) {
      responseValue.forEach(val => {
        this.myDataProductivity.push([
          this.formatTime(val.hour),
          val.claimCount,
          val.claimCount,
          val.target,
          val.target
        ]);
      });
    } else {
      this.getNoDataChart();
    }
  }

  formatTime(time) {
    let hours = time;
    const meridiem = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const startTime = hours + meridiem;
    return startTime;
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

  downloadExcel() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.myProductivityDates.get("dateRange").value[0];
    this.taskManagementService.getProductivityReport(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userProductivityReportDto = this.taskManagementService.productivityReportResponse;
    this.reportSubscription = this.taskManagementService
      .getProductivityReportListner()
      .subscribe(data => {
        this.userProductivityReportDto = data;
        this.downloadFile(this.userProductivityReportDto);
        this.reportSubscription.unsubscribe();
      });
  }

  downloadFile(productivityReport: any) {
    const responseBody = productivityReport.body;
    const blob = new Blob([responseBody], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const today = new Date();
    const dateString = this.datePipe.transform(today, "MMddyyyy");
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(
        blob,
        "My_Productivity" + dateString + ".xlsx"
      );
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "My_Productivity" + dateString + ".xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  getMyProductivityDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.myProductivityDates.get("dateRange").value[0];
    this.taskManagementService.getMyProdScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userProductivityDto = this.taskManagementService.myprodScoreResponse;
    this.userProductivityDto = null;
    this.myProductivitySubscription = this.taskManagementService
      .getMyProdScoresListner()
      .subscribe((data: ProductivitySchedule) => {
        this.userProductivityDto = data;
        this.myDataProductivity = [];
        this.userProductivityDto && this.userProductivityDto.userProductivityDto
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
      this.isValid = this.getNoOfmonths(date1, date2) > 6 ? false : true;
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
    this.reportSubscription.unsubscribe();
  }
}
