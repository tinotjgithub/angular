import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  ViewChild
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-rebuttal-status",
  templateUrl: "./rebuttal-status.component.html",
  styleUrls: ["./rebuttal-status.component.css"]
})
export class RebuttalStatusComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  reportSubscription: Subscription = new Subscription();
  private processedSubscription: Subscription = new Subscription();
  userProcessedDto: any;
  public enlargedDisplay = false;
  public total = [];
  public hasData = false;
  public editMode = false;
  public status = "";
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  public editUser = {};
  public isDataPresent = false;
  public titleProcessed = "";
  public typeProcessed = "PieChart";
  public columnNamesProcessed = ["Status", "Transaction Count"];
  public isValid = true;
  public trans = "";
  public maxDate = new Date();
  public processedDates: FormGroup;
  public dataProcessed = [];
  public isProcessedRendered = false;
  @Input()
  public isManager: boolean;
  optionsProcessed = {
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    // is3D: true,
    chartArea: {
      left: 1,
      right: 1,
      top: 17,
      bottom: 10,
      width: "100%",
      height: "100%"
    },
    colors: ["#00aadf", "#ff5c5d", "#75bb00"],
    pieSliceText: "value",
    pieSliceTextStyle: { fontSize: 12 },
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12
      }
    },
    legend: {
      textStyle: { fontSize: 13 },
      position: "top",
      alignment: "center"
    },
    pieHole: 0.35
  };
  public role = "";
  public widthProcessed = 380;
  public heightProcessed = 260;

  public optionsProcessedEnlarged = {
    pieSliceTextStyle: { fontSize: 16 },
    pieSliceText: "value",
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      width: "100%",
      left: 2,
      right: 2,
      top: 20,
      bottom: 10
    },
    colors: ["#00aadf", "#ff5c5d", "#79c200"],
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13
      }
    },
    legend: {
      fontSize: 12,
      position: "top",
      width: "50%",
      alignment: "center"
    },
    pieHole: 0.5
  };
  public barDetails: { type: any; value: any };
  public cols: { header: string; field: string }[];
  public detailsView: boolean;
  public chartDetail: any[];
  public userGrpList = [];
  public specialistListArray = [];
  userGrp: any[];
  userGrpArray: any[];
  specialist: any[];
  specialistArray: any[];
  constructor(
    private fbProcessed: FormBuilder,
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService,
    public datePipe: DatePipe
  ) {
    const todaysDate = new Date();
    const defaultDateRange = [];
    const dateToday = new Date();
    const y = dateToday.getFullYear();
    const m = dateToday.getMonth();
    const firstDay = new Date(y, m, 1);
    defaultDateRange.push(firstDay);
    defaultDateRange.push(todaysDate);
    this.processedDates = fbProcessed.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      specialistName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getEnrollAuditorUserGroups();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  get getSpecialistsSelect() {
    return this.processedDates.controls.specialistName;
  }

  get getGroup() {
    return this.processedDates.controls.userGrpName;
  }

  get getDateRange() {
    return this.processedDates.controls.dateRange;
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  getNoDataChart() {
    this.optionsProcessed.pieSliceText = "none";
    this.optionsProcessed.tooltip.text = "none";
    this.optionsProcessedEnlarged.tooltip.text = "none";
    this.optionsProcessedEnlarged.legend.position = "none";
    this.optionsProcessed.legend.position = "none";
    this.isDataPresent = false;
    this.total = ["0"];
    this.dataProcessed = [];
    this.dataProcessed.push(["NO DATA", 1]);
  }

  getDataChart() {
    this.optionsProcessed.pieSliceText = "value";
    this.optionsProcessed.tooltip.text = "value";
    this.optionsProcessedEnlarged.tooltip.text = "value";
    this.optionsProcessedEnlarged.legend.position = "top";
    this.optionsProcessed.legend.position = "top";
    this.isDataPresent = true;
    this.dataProcessed = [];
    let responseValue = [];
    this.total = (
      "" + Number(Number(this.userProcessedDto.totalRebuttalCount))
    ).split("");
    responseValue = this.userProcessedDto.userRebuttalDtos;
    this.mapResponseValue(responseValue);
  }

  mapResponseValue(responseValue) {
    responseValue.map(val => {
      this.dataProcessed.push([val.status, val.transactionCount]);
    });
  }

  getProcessedDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates.get("dateRange").value[0];
    this.mapUsrGrpNameList(this.processedDates.get("userGrpName").value);
    this.mapSpecialist(this.processedDates.get("specialistName").value);
    this.enrollmentAuditorDashboardService.getAuditRebuttalStatus(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrpId(this.userGrpArray),
      this.mapSpecialId(this.specialistArray)
    );
    this.userProcessedDto = this.enrollmentAuditorDashboardService.auditRebuttalStatusResponse;
    this.userProcessedDto = null;
    this.processedSubscription = this.enrollmentAuditorDashboardService
      .getAuditRebuttalStatusListner()
      .subscribe(data => {
        this.userProcessedDto = data;
        this.dataProcessed = [];
        if (
          this.userProcessedDto &&
          this.userProcessedDto.userRebuttalDtos.length > 0
        ) {
          this.hasData = true;
          this.getDataChart();
        } else {
          this.hasData = false;
          this.getNoDataChart();
        }
        this.processedSubscription.unsubscribe();
      });
    if (this.userProcessedDto === null || this.userProcessedDto === undefined) {
      this.hasData = false;
      this.getNoDataChart();
    }
    this.isProcessedRendered = true;
  }
  getToDateValue() {
    const toDateValue =
      this.processedDates.get("dateRange").value[1] !== null &&
      this.processedDates.get("dateRange").value[1] !== "" &&
      this.processedDates.get("dateRange").value[1] !== undefined
        ? this.processedDates.get("dateRange").value[1]
        : this.processedDates.get("dateRange").value[0];
    return toDateValue;
  }

  validateDates() {
    const fromDateValue = this.processedDates.get("dateRange").value;
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
    this.onSubmitProcessed();
  }

  dateDifference(fromDateValue) {
    const fromDate = new Date(fromDateValue[0]);
    const toDate = new Date(fromDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  getNoOfmonths(date1, date2) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth() + 1;
    months += date2.getMonth() + 1;
    return months <= 0 ? 0 : months;
  }

  onSubmitProcessed() {
    if (
      this.isValid &&
      this.processedDates.get("userGrpName").value.length > 0 &&
      this.processedDates.get("specialistName").value.length > 0
    ) {
      this.getProcessedDays();
    }
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataProcessed.length > 0) {
      const row = e[0].row;
      const act = this.dataProcessed[row][0];
      this.status = act;
      this.trans = this.dataProcessed[row][0];
      const fromDateValue = this.processedDates.get("dateRange").value[0];
      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(this.getToDateValue(), "yyyy-MM-dd");
      const type = "rebuttal-status";
      this.editUser = {
        type,
        act,
        fromDate: from,
        toDate: to,
        userGroupId: this.mapUserGrpId(this.userGrpArray),
        specialistId: this.mapSpecialId(this.specialistArray),
        userGroupName: this.mapUserGrpName(this.userGrpArray),
        specialistName: this.mapSpecialName(this.specialistArray)
      };
      this.editMode = true;
    }
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

  mapSpecialId(splName) {
    const splArray = [];
    if (splName !== null && splName.length > 0) {
      splName.forEach(item => {
        splArray.push(item.value);
      });
    }
    return splArray;
  }

  getEnrollAuditorSpecialists() {
    this.specialist = [];
    if (this.processedDates.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(this.processedDates.get("userGrpName").value);
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
      this.processedDates.get("specialistName").setValue([]);
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
    this.processedDates.get("userGrpName").setValue(selectedScopes);
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
    this.processedDates.get("specialistName").setValue(selectedSpecialist);
    this.onSubmitProcessed();
  }

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollAuditorSpecialists();
  }

  validateSpecialist() {
    this.updateMultiSelectLabels();
    this.onSubmitProcessed();
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

  mapSpecialName(splName) {
    const splArray = [];
    if (splName !== null && splName.length > 0) {
      splName.forEach(item => {
        splArray.push(item.label);
      });
    }
    return splArray;
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  ngOnDestroy() {
    this.processedSubscription.unsubscribe();
  }
}
