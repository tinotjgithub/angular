import { Component, ViewChild, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { MultiSelect } from "primeng/multiselect";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";

@Component({
  selector: "app-quality-score",
  templateUrl: "./quality-score.component.html"
})
export class QualityScoreComponent implements OnInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  frequency: string;
  public showMonthlyCalendar = false;
  public showDailyCalendar = true;
  private myProductivitySubscription: Subscription = new Subscription();
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  private userProductivityReportDto: any;
  public userProductivityDto: any;
  public isDataPresent = false;
  public myDataQuality = [];
  public isProductivityRendered = false;
  public freqList = [];
  public myQualityGroup: FormGroup;
  public enlargedDisplay = false;
  public isValid = true;
  public userGrpList = [];
  public specialistListArray = [];
  userGrp: any[];
  public editMode = false;
  public editUser = {};
  userGrpArray: any[];
  specialist: any[];
  specialistArray: any[];

  public maxDate = new Date();
  public myProductivityType = "LineChart";
  public myTitleProductivity = "";
  public myTypeProductivity = "LineChart";
  public myColumnNamesProductivity = [
    "",
    "Actual Score",
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
      right: 20,
      top: 17,
      bottom: 50
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
      left: 40,
      right: 20,
      top: 17,
      bottom: 80
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

  public myWidthProductivity = 800;
  public myHeightProductivity = 220;
  public enlargedWidth = 850;
  public maxMonth;
  constructor(
    private fbsts: FormBuilder,
    private enrollmentManagementService: EnrollmentManagementService,
    public datePipe: DatePipe
  ) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const currentMonth = new Date(y, m, 1);
    this.maxMonth = currentMonth;
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const fifteenDate = new Date();
    fifteenDate.setDate(fifteenDate.getDate() - 16);
    const defaultDateRange = [];
    defaultDateRange.push(fifteenDate);
    defaultDateRange.push(yesterdaysDate);
    this.myQualityGroup = fbsts.group({
      dateRange: [defaultDateRange, Validators.required],
      frequency: ["Daily", Validators.required]
    });
  }

  ngOnInit() {
    this.setFrequency();
    this.setFreq("D");
    this.onSubmitMyQuality();
  }

  get getDates() {
    return this.myQualityGroup.controls.dateRange;
  }

  showDialog() {
    this.myOptionsProductivity.annotations.textStyle.fontSize = 13;
    this.enlargedDisplay = true;
  }

  getNoDataChart() {
    this.isDataPresent = false;
    this.myDataQuality = [];
    this.myOptionsProductivity.legend.position = "none";
    this.myOptionsProductivity.tooltip.trigger = "none";
    this.myOptionsProductivityEnlarged.legend.position = "none";
    this.myOptionsProductivityEnlarged.tooltip.trigger = "none";
    this.myDataQuality.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getDataChart() {
    this.isDataPresent = true;
    this.myDataQuality = [];
    this.myOptionsProductivity.legend.position = "top";
    this.myOptionsProductivity.tooltip.trigger = "focus";
    this.myOptionsProductivityEnlarged.legend.position = "top";
    this.myOptionsProductivityEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.userProductivityDto;
    if (responseValue !== null && responseValue.length !== 0) {
      if (this.frequency === "Daily") {
        responseValue.forEach(val => {
          const frmDay = this.datePipe.transform(val.startDate, "MM-dd-yyyy");
          this.myDataQuality.push([
            frmDay,
            val.actualScore,
            val.actualScore,
            val.target,
            val.target
          ]);
        });
      } else if (this.frequency === "Monthly") {
        responseValue.forEach(val => {
          const frmDay = this.datePipe.transform(val.startDate, "MM-yyyy");
          this.myDataQuality.push([
            frmDay,
            val.actualScore,
            val.actualScore,
            val.target,
            val.target
          ]);
        });
      }
    } else {
      this.getNoDataChart();
    }
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
    this.onSubmitMyQuality();
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
    this.myQualityGroup.get("frequency").setValue("D");
  }

  setDefaultDay() {
    this.myQualityGroup.controls.dateRange.setErrors(null);
    this.myQualityGroup.updateValueAndValidity();
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const fifteenDate = new Date();
    fifteenDate.setDate(fifteenDate.getDate() - 16);
    const defaultDateRange = [];
    defaultDateRange.push(fifteenDate);
    defaultDateRange.push(yesterdaysDate);
    this.myQualityGroup.get("dateRange").setValue(defaultDateRange);
  }

  setDefaultMonth() {
    this.myQualityGroup.controls.dateRange.setErrors(null);
    this.myQualityGroup.updateValueAndValidity();
    const todaysDate = new Date();
    const defaultDateRange = [];
    const makeDate = new Date();
    const threeMonth = new Date(makeDate.setMonth(makeDate.getMonth() - 3));
    const firstDayofThirdMonth = new Date(
      threeMonth.getFullYear(),
      threeMonth.getMonth(),
      1
    );
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // const today = new Date();
    // const todaysMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    defaultDateRange.push(firstDayofThirdMonth);
    defaultDateRange.push(firstDay);
    this.myQualityGroup.get("dateRange").setValue(defaultDateRange);
  }

  getToDateValue() {
    const toDateValue =
      this.myQualityGroup.get("dateRange").value[1] !== null &&
      this.myQualityGroup.get("dateRange").value[1] !== "" &&
      this.myQualityGroup.get("dateRange").value[1] !== undefined
        ? this.myQualityGroup.get("dateRange").value[1]
        : this.myQualityGroup.get("dateRange").value[0];
    return toDateValue;
  }

  getMyProductivityDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.myQualityGroup.get("dateRange").value[0];
    const freq = this.frequency === "Daily" ? "daily" : "monthly";
    this.enrollmentManagementService.auditQualitScore(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      freq
    );
    this.userProductivityDto = this.enrollmentManagementService.myQualityResponse;
    this.userProductivityDto = null;
    this.myProductivitySubscription = this.enrollmentManagementService
      .auditQualitScoreListner()
      .subscribe((data: any) => {
        this.userProductivityDto = data;
        this.myDataQuality = [];
        this.userProductivityDto && this.userProductivityDto.length > 0
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
    const fromDateValue = this.myQualityGroup.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const date1 = new Date(fromDateValue[0]);
      const date2 = new Date(fromDateValue[1]);
      this.isValid = this.getNoOfmonths(date1, date2) < 6 ? true : false;
      this.isValid ? this.onSubmitMyQuality() : "";
    } else {
      this.isValid = true;
      this.onSubmitMyQuality();
    }
  }

  getNoOfmonths(date1, date2) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth() + 1;
    months += date2.getMonth() + 1;
    return months <= 0 ? 0 : months;
  }

  onSubmitMyQuality() {
    this.getMyProductivityDays();
  }

  onDestroy() {
    this.myProductivitySubscription.unsubscribe();
    this.userGrpSubscription.unsubscribe();
    this.specialistSubscription.unsubscribe();
  }
}
