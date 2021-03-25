import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-specialist-productivity-by-transaction",
  templateUrl: "./specialist-productivity-by-transaction.component.html",
  styleUrls: ["./specialist-productivity-by-transaction.component.css"]
})
export class SpecialistProductivityByTransactionComponent
  implements OnInit, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  private myTeamProductivitySubscription: Subscription = new Subscription();
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  public specialistProductivityDto: any;
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
  public userGrpList = [];
  public specialistListArray = [];
  userGrp: any[];
  userGrpArray: any[];
  specialist: any[];
  specialistArray: any[];
  public myColumnNamesProductivity = [
    "",
    "Transaction Completed",
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
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    const today = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(today);
    defaultDateRange.push(today);
    this.myTeamProductivityDates = fbprod.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      specialistName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getEnrollSpecialistUserGroups();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  get getSpecialistsSelect() {
    return this.myTeamProductivityDates.controls.specialistName;
  }

  get getGroup() {
    return this.myTeamProductivityDates.controls.userGrpName;
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
    responseValue = this.specialistProductivityDto;
    if (responseValue !== null && responseValue.length !== 0) {
      responseValue.forEach(val => {
        this.myDataProductivity.push([
          this.formatTime(val.hour),
          val.count,
          val.count,
          val.target,
          val.target
        ]);
      });
      const splArray = this.myTeamProductivityDates.get("specialistName").value;
      const spl = [];
      splArray.forEach(lead => {
        spl.push(lead.name);
      });
      if (spl.length === 1) {
        this.myColumnNamesProductivity[1] = spl[0].toString();
      } else {
        this.myColumnNamesProductivity[1] = "Average Transaction Completed";
      }
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
    this.enrollmentManagerDashboardService.getManagerSpecialistProdTrans(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrp(this.userGrpArray),
      this.mapSpecialist(
        this.myTeamProductivityDates.get("specialistName").value
      )
    );
    this.specialistProductivityDto = this.enrollmentManagerDashboardService.managerSpecialistProdTransResponse;
    this.specialistProductivityDto = null;
    this.myTeamProductivitySubscription = this.enrollmentManagerDashboardService
      .getManagerSpecialistProdTransListner()
      .subscribe((data: any) => {
        this.specialistProductivityDto = data;
        this.myDataProductivity = [];
        this.specialistProductivityDto &&
        this.specialistProductivityDto.length > 0
          ? this.getDataChart()
          : this.getNoDataChart();
        this.myTeamProductivitySubscription.unsubscribe();
      });
    if (this.specialistProductivityDto === null) {
      this.getNoDataChart();
    }
    this.isProductivityRendered = true;
    this.updateMultiSelectLabels();
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
    if (
      this.isValid &&
      this.myTeamProductivityDates.get("specialistName").value.length > 0 &&
      this.myTeamProductivityDates.get("userGrpName").value.length > 0
    ) {
      this.getMyTeamProductivityDays();
    }
  }

  getEnrollSpecialistUserGroups() {
    this.userGrp = [];
    this.enrollmentManagerDashboardService.getEnrollManagerUserGroups();
    this.userGrp = this.enrollmentManagerDashboardService.enrollManagerUserGroupsResponse;
    this.userGrpSubscription = this.enrollmentManagerDashboardService
      .getEnrollManagerUserGroupsListner()
      .subscribe(data => {
        this.userGrp = data;
        this.mapUsrGrpNames();
        this.userGrpSubscription.unsubscribe();
      });
  }

  getEnrollManagerSpecialists() {
    this.specialist = [];
    if (this.myTeamProductivityDates.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(
        this.myTeamProductivityDates.get("userGrpName").value
      );
      this.enrollmentManagerDashboardService.getEnrollManagerSpecialists(
        this.mapUserGrp(this.userGrpArray)
      );
      this.specialist = this.enrollmentManagerDashboardService.enrollManagerSpecialistsResponse;
      this.specialistSubscription = this.enrollmentManagerDashboardService
        .getEnrollManagerSpecialistsListner()
        .subscribe(data => {
          this.specialist = data;
          this.mapSpecialists();
          this.specialistSubscription.unsubscribe();
        });
    } else {
      this.myTeamProductivityDates.get("specialistName").setValue([]);
    }
  }

  mapUserGrp(userGrpName) {
    const userGrpArray = [];
    if (userGrpName !== null && userGrpName.length > 0) {
      for (let index = 0; index <= userGrpName.length; index++) {
        this.userGrpList.forEach(item => {
          if (item.label === userGrpName[index]) {
            userGrpArray.push(item.value.id);
          }
        });
      }
    }
    return userGrpArray;
  }

  mapUsrGrpNames() {
    const selectedScopes = [];
    if (this.userGrp && this.userGrp.length > 0) {
      this.userGrp.forEach(s => {
        this.userGrpList.push({
          label: s.groupName,
          value: { id: s.groupId, name: s.groupName, code: s.groupName }
        });
      });
      this.userGrpList.forEach(item => selectedScopes.push(item.value));
    }
    this.myTeamProductivityDates.get("userGrpName").setValue(selectedScopes);
    this.getEnrollManagerSpecialists();
  }

  mapSpecialists() {
    this.specialistListArray = [];
    if (this.specialist && this.specialist.length > 0) {
      this.specialist.forEach(s => {
        this.specialistListArray.push({
          label: s.specialistName,
          value: {
            id: s.specialistId,
            name: s.specialistName,
            code: s.specialistName
          }
        });
      });
    }
    const selectedSpecialist = [];
    this.specialistListArray.forEach(item => {
      selectedSpecialist.push(item.value);
    });
    this.myTeamProductivityDates
      .get("specialistName")
      .setValue(selectedSpecialist);
    this.onSubmitMyTeamProductivity();
  }

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollManagerSpecialists();
  }

  validateSpecialist() {
    this.updateMultiSelectLabels();
    this.onSubmitMyTeamProductivity();
  }

  updateMultiSelectLabels() {
    this.userGrpSelect.updateLabel = function() {
      const grpLabel =
        this.value.length === 1
          ? this.value.length.toString() + " User Group Selected"
          : this.value.length.toString() + " User Groups Selected";
      this.valuesAsString = grpLabel;
    };
    this.SpecialistSelect.updateLabel = function() {
      const SpecialistLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Specialist Selected"
          : this.value.length.toString() + " Specialists Selected";

      this.valuesAsString = SpecialistLabel;
    };
  }

  mapUsrGrpNameList(userGrpName) {
    this.userGrpArray = [];
    if (
      userGrpName &&
      userGrpName !== undefined &&
      userGrpName !== "" &&
      userGrpName !== null &&
      userGrpName.length > 0
    ) {
      userGrpName.forEach(q => {
        this.userGrpArray.push(q.name);
      });
    }
  }

  mapSpecialist(ldName) {
    this.specialistArray = [];
    if (
      ldName &&
      ldName !== undefined &&
      ldName !== "" &&
      ldName !== null &&
      ldName.length > 0
    ) {
      ldName.forEach(q => {
        this.specialistArray.push(q.id);
      });
    }
    return this.specialistArray;
  }

  onDestroy() {
    this.myTeamProductivitySubscription.unsubscribe();
  }
}
