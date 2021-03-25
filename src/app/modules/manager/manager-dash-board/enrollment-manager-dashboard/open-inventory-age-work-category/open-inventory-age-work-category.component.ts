import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { MultiSelect } from "primeng/multiselect";
@Component({
  selector: "app-open-inventory-age-work-category",
  templateUrl: "./open-inventory-age-work-category.component.html",
  styleUrls: ["./open-inventory-age-work-category.component.css"]
})
export class OpenInventoryAgeWorkCategoryComponent
  implements OnInit, OnDestroy {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  pendedTransactionReportDto: any;
  pendRecDtos: any;
  age = "";
  public action = "";
  public isLead = false;
  public isDataPresent = false;
  reportSubscription: Subscription = new Subscription();
  enlargedDisplay = false;
  public ageSubscription: Subscription = new Subscription();
  userGrp: any[];
  public editUser = {};
  public editMode = false;
  userGrpArray: any[];
  specialist: any[];
  public userGrpList = [];
  specialistArray: any[];
  public specialistListArray = [];
  public titleAge = "";
  public role = "";
  public typeAge = "ColumnChart";
  public columnNamesAge = [];
  public optionsAge = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal",
        fontSize: 12
      }
    },
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
      "#f6ff00",
      "#02a2ce",
      "#b03761",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268",
      "#ea4f5b",
      "#f7614d",
      "#ff763b",
      "#ff8e26"
    ],
    hAxis: {
      title: "",
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
    chartArea: {
      left: 50,
      right: 1,
      top: 17,
      bottom: 20
    },
    legend: {
      position: "top",
      textStyle: { fontSize: 12 }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
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
            length: 7
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
    },
    isStacked: true
  };

  public optionsAgeEnlarged = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal",
        fontSize: 13
      }
    },
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
      "#f6ff00",
      "#02a2ce",
      "#b03761",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268",
      "#ea4f5b",
      "#f7614d",
      "#ff763b",
      "#ff8e26"
    ],
    hAxis: {
      title: "",
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
    chartArea: {
      left: 50,
      right: 1,
      top: 25,
      bottom: 50
    },
    legend: {
      position: "top",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    annotations: {
      textStyle: {
        fontSize: 13
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
    },
    isStacked: true
  };

  public heightAge = 320;
  public widthAge = 600;
  public widthAgeEnlarged = 800;
  public dataAge = [];
  public isAgeRendered = false;
  public OpenInv = "";

  constructor(
    private fbAge: FormBuilder,
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.OpenInv = "Open Inventory Age by Work Category";
    this.onSubmitAge();
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataAge.length > 0) {
      const row = e[0].row;
      const age = this.dataAge[row][0];
      const col = e[0].column;
      const a = this.columnNamesAge[col];
      const act = typeof a === "object" ? this.columnNamesAge[col - 1] : a;
      this.action = act.toString();
      const workCategory = this.action;
      this.age = age;
      this.editUser = {
        type: "open-inv-age-wrk-cat",
        age,
        workCategory
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  ngOnDestroy() {
    this.ageSubscription.unsubscribe();
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  getAgeChartNoValue() {
    this.isDataPresent = false;
    this.dataAge = [];
    this.optionsAge.legend.position = "none";
    this.optionsAge.tooltip.trigger = "none";
    this.optionsAgeEnlarged.legend.position = "none";
    this.optionsAgeEnlarged.tooltip.trigger = "none";
    this.dataAge.push(["NO DATA", 0, "0", 0, "0", 0, "0"]);
  }

  getAgeChartValue() {
    this.dataAge = [];
    this.optionsAge.legend.position = "top";
    this.optionsAge.tooltip.trigger = "focus";
    this.optionsAgeEnlarged.legend.position = "top";
    this.optionsAgeEnlarged.tooltip.trigger = "focus";
    let responseValue = [];

    responseValue = this.pendRecDtos.chartAgeDtos;
    this.columnNamesAge.push("");
    if (responseValue !== null && responseValue.length !== 0) {
      this.widthAge =
        responseValue.length > 6 ? responseValue.length * 100 : 550;
      this.widthAgeEnlarged =
        responseValue.length > 6 ? responseValue.length * 100 : 700;

      this.dataAge = [];
      const keyValues = [];
      responseValue.forEach(val => {
        const key = Object.keys(val);
        const value = Object.values(val);
        keyValues.push(key);
        key.forEach((k, i) => {
          if (k === "requestAge") {
            this.dataAge.push([value[i]]);
          }
        });
      });

      keyValues[0].forEach((val, i) => {
        if (val === "requestAge") {
          keyValues[0].splice(i, 1);
        }
      });
      //columns
      keyValues[0].forEach(k => {
        this.columnNamesAge.push(k.toString(), { role: "annotation" });
      });
      console.log(this.columnNamesAge);
      const res = responseValue;
      res.forEach(val => {
        delete val.requestAge;
      });

      res.forEach((val, j) => {
        const value = Object.values(val);
        const key = Object.keys(val);
        key.forEach((k, i) => {
          const x = value[i];
          let w;
          if (x !== null) {
            const y: number = +x;
            w = y;
          } else {
            const y = x;
            w = y;
          }
          this.dataAge[j].push(w, w);
        });
      });
      console.log(" this.dataAge:", this.dataAge);
    } else {
      this.getAgeChartNoValue();
    }
  }

  getAgeCount() {
    const todaysDate = new Date();
    const defaultFrom = new Date("01-01-1970");
    const fromDateValue = defaultFrom;
    const toDateValue = todaysDate;
    this.enrollmentManagerDashboardService.getOpenInvAgeWrkCat(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.pendRecDtos = this.enrollmentManagerDashboardService.openInvAgeWrkCatResponse;
    this.pendRecDtos = null;
    this.ageSubscription = this.enrollmentManagerDashboardService
      .getOpenInvAgeWrkCatListner()
      .subscribe((data: any) => {
        this.pendRecDtos = data;
        this.dataAge = [];
        if (this.pendRecDtos && this.pendRecDtos.chartAgeDtos.length > 0) {
          this.getAgeChartValue();
          this.isDataPresent = true;
        } else {
          this.getAgeChartNoValue();
        }
        this.ageSubscription.unsubscribe();
      });
    if (this.pendRecDtos === null) {
      this.getAgeChartNoValue();
    }
    this.isAgeRendered = true;
  }

  onSubmitAge() {
    this.getAgeCount();
  }
}
