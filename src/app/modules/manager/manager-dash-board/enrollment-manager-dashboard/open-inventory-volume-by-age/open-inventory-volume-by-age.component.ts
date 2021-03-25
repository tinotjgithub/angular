import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { MultiSelect } from "primeng/multiselect";
@Component({
  selector: "app-open-inventory-volume-by-age",
  templateUrl: "./open-inventory-volume-by-age.component.html",
  styleUrls: ["./open-inventory-volume-by-age.component.css"]
})
export class OpenInventoryVolumeByAgeComponent implements OnInit, OnDestroy {
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
  public columnNamesAge = [
    "",
    "Assigned",
    { role: "annotation" },
    "Pended",
    { role: "annotation" },
    "Unassigned",
    { role: "annotation" }
  ];
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
    colors: ["#ff9226", "#ff5c5d", "#686868"],
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
        fontSize: 12
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
    colors: ["#ff9226", "#ff5c5d", "#686868"],
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
        fontSize: 13
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    annotations: {
      textStyle: {
        fontSize: 14
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

  public heightAge = 270;
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
    this.OpenInv = "Open Inventory Volume By Age";
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
      const acct = [];
      if (this.action.toUpperCase() === "ASSIGNED") {
        acct.push(this.action.toUpperCase());
        acct.push("ROUTED");
      } else {
        acct.push(this.action.toUpperCase());
      }
      const action = acct;
      const todaysDate = new Date();
      const defaultFrom = new Date("01-01-1970");
      const fromDateValue = defaultFrom;
      const toDateValue = todaysDate;
      this.age = age;
      this.editUser = {
        type: "open-inv-vol-age",
        age,
        action
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

    responseValue = this.pendRecDtos;
    if (responseValue !== null && responseValue.length !== 0) {
      this.widthAge =
        responseValue.length > 6 ? responseValue.length * 100 : 550;
      this.widthAgeEnlarged =
        responseValue.length > 6 ? responseValue.length * 100 : 700;
      responseValue.forEach(val => {
        this.dataAge.push([
          val.requestAge,
          val.assignedCount,
          val.assignedCount,
          val.pendedCount,
          val.pendedCount,
          val.unassignedCount,
          val.unassignedCount
        ]);
      });
    } else {
      this.getAgeChartNoValue();
    }
  }

  getAgeCount() {
    const todaysDate = new Date();
    const defaultFrom = new Date("01-01-1970");
    const fromDateValue = defaultFrom;
    const toDateValue = todaysDate;
    this.enrollmentManagerDashboardService.getOpenInvVolAge(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.pendRecDtos = this.enrollmentManagerDashboardService.openInvVolAgeResponse;
    this.pendRecDtos = null;
    this.ageSubscription = this.enrollmentManagerDashboardService
      .getOpenInvVolAgeListner()
      .subscribe((data: any) => {
        this.pendRecDtos = data;
        this.dataAge = [];
        if (this.pendRecDtos && this.pendRecDtos.length > 0) {
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
