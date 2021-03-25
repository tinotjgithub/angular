import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

@Component({
  selector: "app-manager-team-productivity",
  templateUrl: "./manager-team-productivity.component.html"
})
export class ManagerTeamProductivityComponent implements OnInit {
  private myTeamProductivitySubscription: Subscription = new Subscription();
  public userProductivityDto: any;
  public myDataProductivity = [];
  public isDataPresent = false;
  public isProductivityRendered = false;
  public myTeamProductivityDates: FormGroup;
  public enlargedDisplay = false;
  public isValid = true;
  public maxDate = new Date();
  public myTeamProductivityType = "LineChart";
  public myTitleProductivity = "";
  public myTypeProductivity = "LineChart";
  public myColumnNamesProductivity = [
    "",
    "Claims Completed",
    { role: "annotation" },
    "Target",
    { role: "annotation" }
  ];
  public myOptionsProductivity: any = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12
      }
    },
    colors: ["#1f9675", "#c7203e"],
    hAxis: {
      title: "",
      type: "string",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
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
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    chartArea: {
      left: 30,
      right: 5,
      top: 20,
      bottom: 20
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

  public myOptionsProductivityEnlarged = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13
      }
    },
    colors: ["#1f9675", "#c7203e"],
    hAxis: {
      title: "",
      type: "string",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      minValue: 0,
      title: "",
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      }
    },
    legend: {
      position: "top",
      width: "20%",
      textStyle: {
        color: "black",
        fontSize: 14,
        textPosition: "Horizontal"
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    chartArea: {
      left: 30,
      right: 5,
      top: 20,
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
  public myHeightProductivity = 150;

  constructor(
    private fbprod: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe
  ) {
    const today = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(today);
    defaultDateRange.push(today);
    this.myTeamProductivityDates = fbprod.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  get getDateRange() {
    return this.myTeamProductivityDates.controls.dateRange;
  }

  ngOnInit() {
    this.getMyTeamProductivityDays();
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
      this.myOptionsProductivity.width =
        responseValue.length > 10 ? responseValue.length * 50 : 500;
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
      this.myTeamProductivityDates.get("dateRange").value[1] !== null &&
      this.myTeamProductivityDates.get("dateRange").value[1] !== "" &&
      this.myTeamProductivityDates.get("dateRange").value[1] !== undefined
        ? this.myTeamProductivityDates.get("dateRange").value[1]
        : this.myTeamProductivityDates.get("dateRange").value[0];
    return toDateValue;
  }

  getMyTeamProductivityDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.myTeamProductivityDates.get("dateRange")
      .value[0];
    this.taskManagementService.getMyTeamProdScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userProductivityDto = this.taskManagementService.myTeamProdScoreResponse;
    this.userProductivityDto = null;
    this.myTeamProductivitySubscription = this.taskManagementService
      .getMyTeamProdScoresListner()
      .subscribe((data: any) => {
        this.userProductivityDto = data;
        this.myDataProductivity = [];
        this.userProductivityDto &&
        this.userProductivityDto.userProductivityDto.length > 0
          ? this.getDataChart()
          : this.getNoDataChart();
        this.myTeamProductivitySubscription.unsubscribe();
      });
    if (this.userProductivityDto === null) {
      this.getNoDataChart();
    }
    this.isProductivityRendered = true;
  }

  validateDates() {
    const fromDateValue = this.myTeamProductivityDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const date1 = new Date(fromDateValue[0]);
      const date2 = new Date(fromDateValue[1]);
      const isValid = this.getNoOfmonths(date1, date2) > 6 ? false : true;
      if (!isValid) {
        this.myTeamProductivityDates.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.myTeamProductivityDates.updateValueAndValidity();
      } else {
        this.myTeamProductivityDates.controls.dateRange.setErrors(null);
        this.myTeamProductivityDates.updateValueAndValidity();
        this.onSubmitMyTeamProductivity();
      }
    } else {
      this.myTeamProductivityDates.controls.dateRange.setErrors(null);
      this.myTeamProductivityDates.updateValueAndValidity();
      this.onSubmitMyTeamProductivity();
    }
  }

  getNoOfmonths(date1, date2) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth() + 1;
    months += date2.getMonth() + 1;
    return months <= 0 ? 0 : months;
  }

  onSubmitMyTeamProductivity() {
    if (this.myTeamProductivityDates.invalid) {
      return;
    }
    this.getMyTeamProductivityDays();
  }

  onDestroy() {
    this.myTeamProductivitySubscription.unsubscribe();
  }
}
