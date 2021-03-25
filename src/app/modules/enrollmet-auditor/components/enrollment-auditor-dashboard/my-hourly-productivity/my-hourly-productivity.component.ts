import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";

@Component({
  selector: "app-my-hourly-productivity",
  templateUrl: "./my-hourly-productivity.component.html",
  styleUrls: ["./my-hourly-productivity.component.css"]
})
export class MyHourlyProductivityComponent implements OnInit {
  private myTeamProductivitySubscription: Subscription = new Subscription();
  public userProductivityDto: any;
  public myDataProductivity = [];
  public frequency: string;
  public showMonthlyCalendar = false;
  public showDailyCalendar = true;
  public isProductivityRendered = false;
  public myTeamProductivityDates: FormGroup;
  public enlargedDisplay = false;
  public isValid = true;
  public freqList = [];
  public role = "";
  public maxDate = new Date();
  public isDataPresent = false;
  public myTeamProductivityType = "LineChart";
  public myTitleProductivity = "";
  public myTypeProductivity = "LineChart";
  public myColumnNamesProductivity = [
    "",
    "Transaction Count",
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
  public maxMonth;
  constructor(
    private fbprod: FormBuilder,
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const currentMonth = new Date(y, m, 1);
    this.maxMonth = currentMonth;
    const today = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(today);
    defaultDateRange.push(today);
    this.myTeamProductivityDates = fbprod.group({
      dateRange: [defaultDateRange, Validators.required],
      frequency: ["Daily", Validators.required]
    });
  }

  get getDateRange() {
    return this.myTeamProductivityDates.controls.dateRange;
  }

  ngOnInit() {
    this.setFrequency();
    this.setFreq("D");
    this.getMyTeamProductivityDays();
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
    this.onSubmitMyTeamProductivity();
  }

  getDateDifference(toDateValue, fromDateValue) {
    let valid = true;
    const date1 = new Date(fromDateValue);
    const date2 = new Date(toDateValue);
    const DifferenceTime = date2.getTime() - date1.getTime();
    const diff = DifferenceTime / (1200 * 3600 * 24);
    if (this.frequency === "Daily" && diff > 30) {
      this.myTeamProductivityDates.controls.dateRange.setErrors({
        invalidDaily: true
      });
      this.myTeamProductivityDates.updateValueAndValidity();
      valid = false;
    } else {
      this.myTeamProductivityDates.controls.dateRange.setErrors(null);
      this.myTeamProductivityDates.updateValueAndValidity();
      valid = true;
    }
    return valid;
  }

  setDefaultDay() {
    this.myTeamProductivityDates.controls.dateRange.setErrors(null);
    this.myTeamProductivityDates.updateValueAndValidity();
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const fifteenDate = new Date();
    fifteenDate.setDate(fifteenDate.getDate() - 16);
    const defaultDateRange = [];
    defaultDateRange.push(fifteenDate);
    defaultDateRange.push(yesterdaysDate);
    this.myTeamProductivityDates.get("dateRange").setValue(defaultDateRange);
  }

  setDefaultMonth() {
    this.myTeamProductivityDates.controls.dateRange.setErrors(null);
    this.myTeamProductivityDates.updateValueAndValidity();
    const defaultDateRange = [];
    const makeDate = new Date();
    const threeMonth = new Date(makeDate.setMonth(makeDate.getMonth()));
    const firstDayofThirdMonth = new Date(
      threeMonth.getFullYear(),
      threeMonth.getMonth(),
      1
    );
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    defaultDateRange.push(firstDayofThirdMonth);
    defaultDateRange.push(firstDay);
    this.myTeamProductivityDates.get("dateRange").setValue(defaultDateRange);
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
    this.myTeamProductivityDates.get("frequency").setValue("D");
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
          this.formatTime(val.hour),
          val.count,
          val.count
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
    const freq = this.frequency === "Daily" ? "daily" : "monthly";
    this.enrollmentAuditorDashboardService.getHourlyProdScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      freq
    );
    this.userProductivityDto = this.enrollmentAuditorDashboardService.hourlyProdResponse;
    this.userProductivityDto = null;
    this.myTeamProductivitySubscription = this.enrollmentAuditorDashboardService
      .getHourlyProdScoresListner()
      .subscribe((data: any) => {
        this.userProductivityDto = data;
        this.myDataProductivity = [];
        this.userProductivityDto && this.userProductivityDto.length > 0
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
          this.myTeamProductivityDates.controls.dateRange.setErrors({
            rangeError: true
          });
          this.myTeamProductivityDates.updateValueAndValidity();
        } else {
          this.myTeamProductivityDates.controls.dateRange.setErrors(null);
          this.myTeamProductivityDates.updateValueAndValidity();
          this.onSubmitMyTeamProductivity();
        }
      }
    } else {
      this.myTeamProductivityDates.controls.dateRange.setErrors(null);
      this.myTeamProductivityDates.updateValueAndValidity();
      this.onSubmitMyTeamProductivity();
    }
  }

  getMonths(processedDateValue) {
    const fromDate = new Date(processedDateValue[0]);
    const toDate = new Date(processedDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  onSubmitMyTeamProductivity() {
    this.getMyTeamProductivityDays();
  }

  onDestroy() {
    this.myTeamProductivitySubscription.unsubscribe();
  }
}
