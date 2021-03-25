import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { MultiSelect } from "primeng/multiselect";
import { EnrollmentLeadDashboardService } from "../enrollment-lead-dashboard.service";
import { Action } from "rxjs/internal/scheduler/Action";

@Component({
  selector: "app-production-count-by-status",
  templateUrl: "./production-count-by-status.component.html"
})
export class ProductionCountByStatusComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  private myProductivitySubscription: Subscription = new Subscription();
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  public editUser = {};
  userStatusDto: any;
  public status = "";
  userStatusReportDto: any;
  public isDataPresent = false;
  public displayEnlarged = false;
  public titleStatus = "";
  public typeStatus = "PieChart";
  public columnNamesStatus = ["Status", "Count"];
  public isValid = true;
  public maxDate = new Date();
  public statusDates: FormGroup;
  public dataStatus = [];
  public isStatusRendered = false;
  public editMode = false;
  public widthStatus = 540;
  public heightStatus = 250;
  public myColumnNamesStatus = ["Completed", "Pended", "Assigned"];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 50,
      right: 50,
      top: 17,
      bottom: 20
    },
    colors: ["#4cc14f", "#ff5c5d", "#ff9226"],
    pieSliceText: "value",
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    }
  };

  public optionsStatusEnlarged = {
    pieSliceTextStyle: { fontSize: 16 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 60,
      right: 20,
      top: 30,
      bottom: 20
    },
    colors: ["#4cc14f", "#ff5c5d", "#ff9226"],
    pieSliceText: "value",
    tooltip: { text: "value", trigger: "focus", showColorCode: true },
    legend: {
      position: "top",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 13
      }
    }
  };
  public userGrpList = [];
  public specialistListArray = [];
  userGrp: any[];
  userGrpArray: any[];
  specialist: any[];
  specialistArray: any[];

  constructor(
    private fbStatus: FormBuilder,
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe
  ) {
    const today = new Date();
    const todaysDate = new Date(this.datePipe.transform(today, "yyyy-MM-dd"));
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    this.statusDates = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      specialistName: ["", Validators.required]
    });
  }

  get getSpecialistsSelect() {
    return this.statusDates.controls.specialistName;
  }

  get getGroup() {
    return this.statusDates.controls.userGrpName;
  }

  ngOnInit() {
    this.getEnrollLeadUserGroups();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  get getDateRange() {
    return this.statusDates.controls.dateRange;
  }

  getAction(action) {
    let act = [];
    if (action === "Assigned") {
      act.push("ASSIGNED");
      act.push("ROUTED");
    } else {
      act.push(action.toUpperCase());
    }
    return act;
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const action = this.dataStatus[row][0];
      this.status = action;
      const dates = this.statusDates.get("dateRange").value;
      const fromDate = this.datePipe.transform(dates[0], "yyyy-MM-dd");
      const toDate = this.datePipe.transform(
        this.getToDateValue(),
        "yyyy-MM-dd"
      );
      this.editUser = {
        type: "prod-count-sts",
        action: this.getAction(action),
        fromDate,
        toDate,
        userGroupId: this.mapUserGrp(this.userGrpArray),
        specialistId: this.mapSpecial(this.specialistArray)
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
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

  getNoDataChart() {
    this.isDataPresent = false;
    this.dataStatus = [];
    this.dataStatus.push(["NO DATA", 1]);
    this.optionsStatus.pieSliceText = "label";
    this.optionsStatus.tooltip.text = "none";
    this.optionsStatus.legend.position = "none";
    this.optionsStatusEnlarged.pieSliceText = "label";
    this.optionsStatusEnlarged.tooltip.text = "none";
    this.optionsStatusEnlarged.legend.position = "none";
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

  getDataChart() {
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value";
    this.optionsStatus.tooltip.text = "value";
    this.optionsStatus.legend.position = "top";
    this.optionsStatusEnlarged.pieSliceText = "value";
    this.optionsStatusEnlarged.tooltip.text = "value";
    this.optionsStatusEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue = this.userStatusDto;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "Completed",
        requestCount: 0
      },
      {
        status: "Pended",
        requestCount: 0
      },
      {
        status: "Assigned",
        requestCount: 0
      }
    );
    this.mapResponseValue(responseValue, dataStatusArray);
  }

  mapResponseValue(responseValue, dataStatusArray) {
    responseValue.map(val => {
      if (val.status === "Completed") {
        dataStatusArray[0].requestCount = val.requestCount;
      } else if (val.status === "Pended") {
        dataStatusArray[1].requestCount = val.requestCount;
      } else {
        dataStatusArray[2].requestCount = val.requestCount;
      }
    });
    dataStatusArray.map(val => {
      this.dataStatus.push([val.status, val.requestCount]);
    });
  }
  getEnrollLeadSpecialists() {
    this.specialist = [];
    if (this.statusDates.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(this.statusDates.get("userGrpName").value);
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
    } else {
      this.statusDates.get("specialistName").setValue([]);
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
    this.statusDates.get("userGrpName").setValue(selectedScopes);
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
    this.statusDates.get("specialistName").setValue(selectedSpecialist);
    this.onSubmitStatus();
  }

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollLeadSpecialists();
  }

  validateSpecialist() {
    this.updateMultiSelectLabels();
    this.onSubmitStatus();
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

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.statusDates.get("dateRange").value[0];
    this.mapUsrGrpNameList(this.statusDates.get("userGrpName").value);
    this.mapSpecialist(this.statusDates.get("specialistName").value);
    this.enrollmentLeadDashboardService.productionVol(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrp(this.userGrpArray),
      this.mapSpecial(this.specialistArray)
    );
    this.userStatusDto = this.enrollmentLeadDashboardService.prodVolResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentLeadDashboardService
      .productionVolListner()
      .subscribe((data: any) => {
        this.userStatusDto = data;
        this.dataStatus = [];
        if (this.userStatusDto && this.userStatusDto.length > 0) {
          this.isDataPresent = true;
          this.getDataChart();
        } else {
          this.getNoDataChart();
        }
        this.statusSubscription.unsubscribe();
      });
    if (this.userStatusDto === null || this.userStatusDto === undefined) {
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  getToDateValue() {
    const toDateValue =
      this.statusDates.get("dateRange").value[1] !== null &&
      this.statusDates.get("dateRange").value[1] !== "" &&
      this.statusDates.get("dateRange").value[1] !== undefined
        ? this.statusDates.get("dateRange").value[1]
        : this.statusDates.get("dateRange").value[0];
    return toDateValue;
  }

  validateDates() {
    const fromDateValue = this.statusDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.dateDifference(fromDateValue);
      this.isValid = diffInMonths < 6 ? true : false;
    } else {
      this.isValid = true;
    }
  }

  dateDifference(fromDateValue) {
    const fromDate = new Date(fromDateValue[0]);
    const toDate = new Date(fromDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  onSubmitStatus() {
    if (
      this.isValid &&
      this.statusDates.get("userGrpName").value.length > 0 &&
      this.statusDates.get("specialistName").value.length > 0
    ) {
      this.getStatusDays();
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
