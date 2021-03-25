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
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-audit-sampling-by-work-category",
  templateUrl: "./audit-sampling-by-work-category.component.html",
  styleUrls: ["./audit-sampling-by-work-category.component.css"]
})
export class AuditSamplingByWorkCategoryComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("AuditorSelect", { static: false })
  AuditorSelect: MultiSelect;
  reportSubscription: Subscription = new Subscription();
  private auditorSubscription: Subscription = new Subscription();
  private userGrpSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  userStatusDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public isDataPresent = false;
  public typeStatus = "PieChart";
  public editUser = {};
  public category = "";
  public columnNamesStatus = ["Status", "Count"];
  public isValid = true;
  public editMode = false;
  public maxDate = new Date();
  public statusDates: FormGroup;
  public dataStatus = [];
  public isStatusRendered = false;
  public widthStatus = 550;
  public heightStatus = 270;

  userGrpArray: any[];
  userGrp: any[];
  auditor: any[];
  auditorArray: any[];
  public userGrpList = [];
  public auditorListArray = [];
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
    pieSliceText: "percentage",
    tooltip: {
      text: "percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      alignment: "center",
      width: "100%",
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
    pieSliceText: "percentage",
    tooltip: { text: "percentage", trigger: "focus", showColorCode: true },
    legend: {
      position: "top",
      alignment: "center",
      width: "100%",
      textStyle: {
        fontSize: 13
      }
    }
  };

  get getAuditorsSelect() {
    return this.statusDates.controls.auditorName;
  }
  get getGroup() {
    return this.statusDates.controls.userGrpName;
  }
  constructor(
    private fbStatus: FormBuilder,
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe
  ) {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const todaysDate = new Date(this.datePipe.transform(today, "yyyy-MM-dd"));
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);

    this.statusDates = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      auditorName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getEnrollLeadUserGroups();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  getEnrollLeadUserGroups() {
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

  updateMultiSelectLabels() {
    this.userGrpSelect.updateLabel = function() {
      const grpLabel =
        this.value.length === 1
          ? this.value.length.toString() + " User Group Selected"
          : this.value.length.toString() + " User Groups Selected";
      this.valuesAsString = grpLabel;
    };
    this.AuditorSelect.updateLabel = function() {
      const AuditorLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Auditor Selected"
          : this.value.length.toString() + " Auditors Selected";

      this.valuesAsString = AuditorLabel;
    };
  }

  get getDateRange() {
    return this.statusDates.controls.dateRange;
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollAuditors();
  }

  validateAuditor() {
    this.updateMultiSelectLabels();
    this.onSubmitStatus();
  }

  getEnrollAuditors() {
    this.auditor = [];
    if (this.statusDates.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(this.statusDates.get("userGrpName").value);
      this.enrollmentManagerDashboardService.getEnrollManagerAuditors(
        this.mapUserGrp(this.userGrpArray)
      );
      this.auditor = this.enrollmentManagerDashboardService.enrollManagerAuditorsResponse;
      this.auditorSubscription = this.enrollmentManagerDashboardService
        .getEnrollManagerAuditorsListner()
        .subscribe(data => {
          this.auditor = data;
          this.mapAuditors();
          this.auditorSubscription.unsubscribe();
        });
    } else {
      this.statusDates.get("auditorName").setValue([]);
    }
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

  mapAuditor(auditor) {
    this.auditorArray = [];
    if (
      auditor &&
      auditor !== undefined &&
      auditor !== "" &&
      auditor !== null &&
      auditor.length > 0
    ) {
      auditor.forEach(q => {
        this.auditorArray.push(q.id);
      });
    }
    return this.auditorArray;
  }

  mapAuditors() {
    this.auditorListArray = [];
    if (this.auditor && this.auditor.length > 0) {
      this.auditor.forEach(s => {
        this.auditorListArray.push({
          label: s.auditorName,
          value: {
            id: s.auditorId,
            name: s.auditorName,
            code: s.auditorName
          }
        });
      });
    }
    const selectedAuditor = [];
    this.auditorListArray.forEach(item => {
      selectedAuditor.push(item.value);
    });
    this.statusDates.get("auditorName").setValue(selectedAuditor);
    if (
      this.isValid &&
      this.statusDates.get("auditorName").value.length > 0 &&
      this.statusDates.get("userGrpName").value.length > 0
    ) {
      this.getStatusDays();
    }
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
    this.getEnrollAuditors();
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

  getDataChart() {
    this.isDataPresent = true;
    this.dataStatus = [];
    this.optionsStatusEnlarged.pieSliceText = "percentage";
    this.optionsStatusEnlarged.tooltip.text = "percentage";
    this.optionsStatusEnlarged.legend.position = "top";
    this.optionsStatus.pieSliceText = "percentage";
    this.optionsStatus.tooltip.text = "percentage";
    this.optionsStatus.legend.position = "top";
    let responseValue = [];
    responseValue = this.userStatusDto;
    this.mapResponseValue(responseValue);
  }

  mapResponseValue(responseValue) {
    responseValue.map(val => {
      this.dataStatus.push([val.workCategoryType, val.transactionCount]);
    });
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.statusDates.get("dateRange").value[0];
    this.enrollmentManagerDashboardService.getAuditSamplingWrkCategory(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapAuditor(this.statusDates.get("auditorName").value),
      this.mapUserGrp(this.userGrpArray)
    );
    this.userStatusDto = this.enrollmentManagerDashboardService.auditSamplingWrkCategoryResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentManagerDashboardService
      .getAuditSamplingWrkCategoryListner()
      .subscribe((data: any) => {
        this.userStatusDto = data;
        this.dataStatus = [];
        this.userStatusDto && this.userStatusDto.length > 0
          ? this.getDataChart()
          : this.getNoDataChart();
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

  mapAuditorNames(adtIds) {
    const auditorArray = [];
    if (
      adtIds &&
      adtIds !== undefined &&
      adtIds !== "" &&
      adtIds !== null &&
      adtIds.length > 0
    ) {
      adtIds.forEach(q => {
        auditorArray.push(q.name);
      });
    }
    return auditorArray;
  }

  mapAuditorIds(adtIds) {
    const auditorArray = [];
    if (
      adtIds &&
      adtIds !== undefined &&
      adtIds !== "" &&
      adtIds !== null &&
      adtIds.length > 0
    ) {
      adtIds.forEach(q => {
        auditorArray.push(q.id);
      });
    }
    return auditorArray;
  }

  mapUsrGrpName(userGrpNames) {
    const userGrpArray = [];
    if (
      userGrpNames &&
      userGrpNames !== undefined &&
      userGrpNames !== "" &&
      userGrpNames !== null &&
      userGrpNames.length > 0
    ) {
      userGrpNames.forEach(q => {
        userGrpArray.push(q.name);
      });
    }
    return userGrpArray;
  }

  mapUsrGrpIds(userGrpNames) {
    const userGrpArray = [];
    if (
      userGrpNames &&
      userGrpNames !== undefined &&
      userGrpNames !== "" &&
      userGrpNames !== null &&
      userGrpNames.length > 0
    ) {
      userGrpNames.forEach(q => {
        userGrpArray.push(q.id);
      });
    }
    return userGrpArray;
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const category = this.dataStatus[row][0];
      this.category = category;
      const fromDate = this.statusDates.get("dateRange").value[0];
      const toDate = this.getToDateValue();
      this.editUser = {
        type: "audit-sampling-work-category",
        workCategory: category.toUpperCase(),
        auditorName: this.mapAuditorNames(
          this.statusDates.get("auditorName").value
        ),
        auditorIds: this.mapAuditorIds(
          this.statusDates.get("auditorName").value
        ),
        userGroupId: this.mapUsrGrpIds(
          this.statusDates.get("userGrpName").value
        ),
        userGroupName: this.mapUsrGrpName(
          this.statusDates.get("userGrpName").value
        ),
        fromDate: this.datePipe.transform(fromDate, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDate, "yyyy-MM-dd")
      };
      this.editMode = true;
    }
  }

  mapUsrGrpValues(userGrpNames) {
    const userGrpArray = [];
    if (
      userGrpNames &&
      userGrpNames !== undefined &&
      userGrpNames !== "" &&
      userGrpNames !== null &&
      userGrpNames.length > 0
    ) {
      userGrpNames.forEach(q => {
        userGrpArray.push({ userGroupId: q.id, userGroupName: q.name });
      });
    }
    return userGrpArray;
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
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
      this.statusDates.get("auditorName").value.length > 0
    ) {
      this.getStatusDays();
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
