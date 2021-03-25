import { Component, ViewChild, OnInit, AfterViewInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { MultiSelect } from "primeng/multiselect";
import { EnrollmentLeadDashboardService } from "./../enrollment-lead-dashboard.service";

@Component({
  selector: "app-specialist-hourly-productivity",
  templateUrl: "./specialist-hourly-productivity.component.html",
  styleUrls: ["./specialist-hourly-productivity.component.css"]
})
export class SpecialistHourlyProductivityComponent
  implements OnInit, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  private myProductivitySubscription: Subscription = new Subscription();
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  private userProductivityReportDto: any;
  public userProductivityDto: any;
  public isDataPresent = false;
  public myDataProductivity = [];
  public isProductivityRendered = false;
  public myProductivityDates: FormGroup;
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
    "Completed",
    { role: "annotation" },
    "Target",
    { role: "annotation" }
  ];
  public myOptionsQuality = {
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
      bottom: 40
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
  public myWidthProductivity = 500;
  public myHeightProductivity = 200;

  constructor(
    private fbsts: FormBuilder,
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe
  ) {
    const currentDate = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(currentDate);
    defaultDateRange.push(currentDate);
    this.myProductivityDates = fbsts.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      specialistName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getEnrollLeadUserGroups();
    this.onSubmitMyProductivity();
  }

  get getSpecialistsSelect() {
    return this.myProductivityDates.controls.specialistName;
  }

  get getGroup() {
    return this.myProductivityDates.controls.userGrpName;
  }

  get getDates() {
    return this.myProductivityDates.controls.dateRange;
  }

  showDialog() {
    this.myOptionsQuality.annotations.textStyle.fontSize = 13;
    this.enlargedDisplay = true;
  }

  getEnrollLeadUserGroups() {
    this.userGrp = [];
    this.enrollmentLeadDashboardService.getEnrollLeadUserGroups();
    this.userGrp = this.enrollmentLeadDashboardService.enrollLeadUserGroupsResponse;
    this.userGrpSubscription = this.enrollmentLeadDashboardService
      .getEnrollLeadUserGroupsListner()
      .subscribe(data => {
        this.userGrp = data;
        this.mapUsrGrpNames();
        this.userGrpSubscription.unsubscribe();
      });
  }

  getEnrollLeadSpecialists() {
    this.specialist = [];
    this.mapUsrGrpNameList(this.myProductivityDates.get("userGrpName").value);
    this.enrollmentLeadDashboardService.getEnrollLeadSpecialists(
      this.mapUserGrp(this.userGrpArray)
    );
    this.specialist = this.enrollmentLeadDashboardService.enrollLeadSpecialistsResponse;
    this.specialistSubscription = this.enrollmentLeadDashboardService
      .getEnrollLeadSpecialistsListner()
      .subscribe(data => {
        this.specialist = data;
        this.mapSpecialists();
        this.specialistSubscription.unsubscribe();
      });
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
    this.myProductivityDates.get("userGrpName").setValue(selectedScopes);
    this.getEnrollLeadSpecialists();
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
    this.myProductivityDates.get("specialistName").setValue(selectedSpecialist);
    this.getMyProductivityDays();
  }

  validateUserGroups() {
    this.myOptionsQuality.annotations.textStyle.fontSize = 13;
    this.updateMultiSelectLabels();
    if (this.myProductivityDates.get("userGrpName").value.length > 0) {
      this.getEnrollLeadSpecialists();
    }
  }

  validateSpecialist() {
    this.myOptionsQuality.annotations.textStyle.fontSize = 13;
    this.updateMultiSelectLabels();
    this.onSubmitMyProductivity();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
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

  mapSpecialist(specialist) {
    this.specialistArray = [];
    if (
      specialist &&
      specialist !== undefined &&
      specialist !== "" &&
      specialist !== null &&
      specialist.length > 0
    ) {
      specialist.forEach(q => {
        this.specialistArray.push({ label: q.name, value: q.id });
      });
    }
  }

  getNoDataChart() {
    this.isDataPresent = false;
    this.myDataProductivity = [];
    this.myOptionsQuality.legend.position = "none";
    this.myOptionsQuality.tooltip.trigger = "none";
    this.myDataProductivity.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getDataChart() {
    this.isDataPresent = true;
    this.myDataProductivity = [];
    this.myOptionsQuality.legend.position = "top";
    this.myOptionsQuality.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.userProductivityDto;
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

  mapSpecial(splName) {
    const splArray = [];
    if (splName !== null && splName.length > 0) {
      splName.forEach(item => {
        splArray.push(item.value);
      });
    }
    return splArray;
  }

  getMyProductivityDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.myProductivityDates.get("dateRange").value[0];
    this.mapUsrGrpNameList(this.myProductivityDates.get("userGrpName").value);
    this.mapSpecialist(this.myProductivityDates.get("specialistName").value);
    this.enrollmentLeadDashboardService.getSpecialistProdScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrp(this.userGrpArray),
      this.mapSpecial(this.specialistArray)
    );
    this.userProductivityDto = this.enrollmentLeadDashboardService.specialistProdScoresResponse;
    this.userProductivityDto = null;
    this.myProductivitySubscription = this.enrollmentLeadDashboardService
      .getSpecialistProdScoresListner()
      .subscribe((data: any) => {
        this.userProductivityDto = data;
        this.myDataProductivity = [];
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
    if (
      this.myProductivityDates.get("userGrpName").value.length > 0 &&
      this.myProductivityDates.get("specialistName").value.length > 0
    ) {
      this.getMyProductivityDays();
    }
  }

  onDestroy() {
    this.myProductivitySubscription.unsubscribe();
    this.userGrpSubscription.unsubscribe();
    this.specialistSubscription.unsubscribe();
  }
}
