import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuditDashboardService } from "./../audit-dashboard.service";

@Component({
  selector: "app-claims-audit-productivity",
  templateUrl: "./claims-audit-productivity.component.html"
})
export class ClaimsAuditProductivityComponent implements OnInit {
  private myProductivitySubscription: Subscription = new Subscription();
  public userProductivityDto: any;
  public myDataProductivity = [];
  public isProductivityRendered = false;
  public myProductivityDates: FormGroup;
  public enlargedDisplay = false;
  public isValid = true;
  public isDataPresent = false;
  public maxDate = new Date();
  public myProductivityType = "LineChart";
  public myTitleProductivity = "";
  public myTypeProductivity = "LineChart";
  public myColumnNamesProductivity = [
    "",
    "Claims Completed",
    { role: "annotation" }
  ];

  public myOptionsProductivity = {
    width: 600,
    bar: { width: "50%" },
    colors: ["#1f9675", "#c7203e"],
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    hAxis: {
      title: "",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      miValue: 0,
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
      width: 100,
      left: 20,
      right: 30,
      top: 25,
      bottom: 30
    },
    legend: {
      textStyle: { fontSize: 12 },
      position: "top",
      width: "30%"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    pointSize: 3,
    annotations: {
      textStyle: {
        fontSize: 12
      }
    },
    series: {
      0: {
        annotations: {
          stem: {
            length: 0
          }
        }
      },
      1: {
        annotations: {
          stem: {
            length: 16
          }
        }
      }
    }
  };

  public myOptionsProductivityEnlarged = {
    colors: ["#1f9675", "#c7203e"],
    width: 700,
    bar: { width: "50%" },
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
      miValue: 0,
      slantedText: true,
      title: "",
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
      left: 20,
      right: 1,
      top: 25,
      bottom: 60
    },
    legend: {
      textStyle: { fontSize: 14 },
      position: "top",
      width: "50%"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    pointSize: 3
  };

  public myWidthProductivity = 100;
  public myHeightProductivity = 250;

  constructor(
    private fbsts: FormBuilder,
    private auditDashboardService: AuditDashboardService,
    public datePipe: DatePipe
  ) {
    const todayDate = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(todayDate);
    defaultDateRange.push(todayDate);
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
    responseValue = this.userProductivityDto.userProductivityDto;
    if (responseValue !== null && responseValue.length !== 0) {
      responseValue.forEach(val => {
        this.myDataProductivity.push([
          this.formatTime(val.hour),
          val.claimCount,
          val.claimCount
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

  getMyProductivityDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.myProductivityDates.get("dateRange").value[0];
    this.auditDashboardService.getMyAuditProdScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userProductivityDto = this.auditDashboardService.myprodScoreResponse;
    this.userProductivityDto = null;
    this.myProductivitySubscription = this.auditDashboardService
      .getMyAuditProdScoresListner()
      .subscribe(data => {
        this.userProductivityDto = data;
        this.myDataProductivity = [];
        this.userProductivityDto &&
        this.userProductivityDto.userProductivityDto.length > 0
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
      const isValid = this.getNoOfmonths(date1, date2) > 6 ? false : true;
      if (!isValid) {
        this.myProductivityDates.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.myProductivityDates.updateValueAndValidity();
      } else {
        this.myProductivityDates.controls.dateRange.setErrors(null);
        this.myProductivityDates.updateValueAndValidity();
        this.onSubmitMyProductivity();
      }
    } else {
      this.myProductivityDates.controls.dateRange.setErrors(null);
      this.myProductivityDates.updateValueAndValidity();
      this.onSubmitMyProductivity();
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
    if (this.myProductivityDates.invalid) {
      return;
    }
    this.getMyProductivityDays();
  }

  onDestroy() {
    this.myProductivitySubscription.unsubscribe();
  }
}
