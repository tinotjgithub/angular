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
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";

@Component({
  selector: "app-audited-count-by-work-category",
  templateUrl: "./audited-count-by-work-category.component.html",
  styleUrls: ["./audited-count-by-work-category.component.css"]
})
export class AuditedCountByWorkCategoryComponent
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
  public myColumnNamesStatus = ["Work Category", "Audit Transaction Count"];
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
    colors: [
      "#4973a6",
      "#776fb8",
      "#b260b3",
      "#e44b94",
      "#ff4461",
      "#ff6017",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268",
      "#ea4f5b",
      "#f7614d",
      "#ff763b",
      "#ff8e26",
      "#ffa600"
    ],
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
    colors: [
      "#4973a6",
      "#776fb8",
      "#b260b3",
      "#e44b94",
      "#ff4461",
      "#ff6017",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268",
      "#ea4f5b",
      "#f7614d",
      "#ff763b",
      "#ff8e26",
      "#ffa600"
    ],
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
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService,
    public datePipe: DatePipe
  ) {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterdayDate = new Date(
      this.datePipe.transform(today, "yyyy-MM-dd")
    );
    const defaultDateRange = [];
    defaultDateRange.push(yesterdayDate);
    defaultDateRange.push(yesterdayDate);
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
    this.getEnrollAuditorUserGroups();
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
        type: "audit-count-by-work-category",
        workCategory: action,
        fromDate,
        toDate,
        userGroupId: this.mapUserGrpId(this.userGrpArray),
        specialistId: this.mapSpecialId(this.specialistArray),
        userGroupName: this.mapUserGrpName(this.userGrpArray),
        specialistName: this.mapSpecialName(this.specialistArray)
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getEnrollAuditorUserGroups() {
    this.userGrp = [];
    this.enrollmentAuditorDashboardService.getEnrollAuditorUserGroups();
    this.userGrp = this.enrollmentAuditorDashboardService.enrollAuditorUserGroupsResponse;
    this.userGrpSubscription = this.enrollmentAuditorDashboardService
      .getEnrollAuditorUserGroupsListner()
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

  mapSpecialId(splName) {
    const splArray = [];
    if (splName !== null && splName.length > 0) {
      splName.forEach(item => {
        splArray.push(item.value);
      });
    }
    return splArray;
  }

  mapSpecialName(splName) {
    const splArray = [];
    if (splName !== null && splName.length > 0) {
      splName.forEach(item => {
        splArray.push(item.label);
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
    responseValue.map(val => {
      this.dataStatus.push([val.workCategory, val.requestCount]);
    });
  }

  getEnrollAuditorSpecialists() {
    this.specialist = [];
    if (this.statusDates.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(this.statusDates.get("userGrpName").value);
      this.enrollmentAuditorDashboardService.getEnrollAuditorSpecialists(
        this.mapUserGrpId(this.userGrpArray)
      );
      this.specialist = this.enrollmentAuditorDashboardService.enrollAuditorSpecialistsResponse;
      this.specialistSubscription = this.enrollmentAuditorDashboardService
        .getEnrollAuditorSpecialistsListner()
        .subscribe(data => {
          this.specialist = data;
          this.mapSpecialists();
          this.specialistSubscription.unsubscribe();
        });
    } else {
      this.statusDates.get("specialistName").setValue([]);
    }
  }

  mapUserGrpId(userGrpName) {
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

  mapUserGrpName(userGrpName) {
    const userGrpArray = [];
    if (userGrpName !== null && userGrpName.length > 0) {
      for (let index = 0; index <= userGrpName.length; index++) {
        this.userGrpList.forEach(item => {
          if (item.label === userGrpName[index]) {
            userGrpArray.push(item.value.name);
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
    this.getEnrollAuditorSpecialists();
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
    this.getEnrollAuditorSpecialists();
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
    this.enrollmentAuditorDashboardService.getAuditCountWorkCategory(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrpId(this.userGrpArray),
      this.mapSpecialId(this.specialistArray)
    );
    this.userStatusDto = this.enrollmentAuditorDashboardService.auditCountWorkCategoryResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentAuditorDashboardService
      .getAuditCountWorkCategoryListner()
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
