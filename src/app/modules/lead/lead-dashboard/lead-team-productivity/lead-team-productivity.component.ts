import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";

@Component({
  selector: "app-lead-team-productivity",
  templateUrl: "./lead-team-productivity.component.html"
})
export class LeadTeamProductivityComponent implements OnInit {
  private myTeamProductivitySubscription: Subscription = new Subscription();
  public userProductivityDto: any;
  public myDataProductivity = [];
  public isProductivityRendered = false;
  public myTeamProductivityDates: FormGroup;
  public enlargedDisplay = false;
  public isValid = true;
  public role = "";
  public maxDate = new Date();
  public isDataPresent = false;
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
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
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

  public myOptionsProductivityEnlarged = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
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
      right: 10,
      top: 30,
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

  public myWidthProductivity = 530;
  public myHeightProductivity = 250;

  constructor(
    private fbprod: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    const today = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(today);
    defaultDateRange.push(today);
    this.myTeamProductivityDates = fbprod.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId");
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
    this.taskManagementService.getLeadTeamProdScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userProductivityDto = this.taskManagementService.leadTeamProdScoreResponse;
    this.userProductivityDto = null;
    this.myTeamProductivitySubscription = this.taskManagementService
      .getLeadTeamProdScoresListner()
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

  onSubmitMyTeamProductivity() {
    this.getMyTeamProductivityDays();
  }

  onDestroy() {
    this.myTeamProductivitySubscription.unsubscribe();
  }
}
