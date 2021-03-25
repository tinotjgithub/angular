import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { MultiSelect } from "primeng/multiselect";
@Component({
  selector: "app-assigned-vs-audited",
  templateUrl: "./assigned-vs-audited.component.html",
  styleUrls: ["./assigned-vs-audited.component.css"]
})
export class AssignedVsAuditedComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("AuditorSelect", { static: false }) AuditorSelect: MultiSelect;
  SpecialistSelect: MultiSelect;
  pendedTransactionReportDto: any;
  assignedAuditedDtos: any; 
  workCategory = "";
  public auditorListArray = [];
  userGrp: any[];
  userGrpArray: any[];
  auditor: any[];
  auditorArray: any[];
  public auditorName = "";
  public action = "";
  public isAuditor = false;
  public isDataPresent = false;
  reportSubscription: Subscription = new Subscription();
  enlargedDisplay = false;
  public ageSubscription: Subscription = new Subscription();
  public editUser = {};
  public editMode = false;
  private userGrpSubscription: Subscription = new Subscription();
  private auditorSubscription: Subscription = new Subscription();
  specialist: any[];
  public userGrpList = [];
  specialistArray: any[];
  public specialistListArray = [];
  public titleAge = "";
  public role = "";
  public typeAge = "ColumnChart";
  public columnNamesAge = [
    "",
    "Transaction Assigned",
    { role: "annotation" },
    "Audit Completed",
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
    colors: ["#ff9226", "#4cc14f"],
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
    colors: ["#ff9226", "#4cc14f"],
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

  public heightAge = 250;
  public widthAge = 600;
  public widthAgeEnlarged = 800;
  public dataAge = [];
  public isAgeRendered = false;
  public OpenInv = "";
  public assignedVsAuditedGroup: FormGroup;

  constructor(
    private fbReqCount: FormBuilder,
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe
  ) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(yesterday);
    defaultDateRange.push(yesterday);
    this.assignedVsAuditedGroup = fbReqCount.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      auditorName: ["", Validators.required]
    });
  }
  get getDateRange() {
    return this.assignedVsAuditedGroup.controls.dateRange;
  }
  get getAuditorsSelect() {
    return this.assignedVsAuditedGroup.controls.auditorName;
  }

  get getGroup() {
    return this.assignedVsAuditedGroup.controls.userGrpName;
  }

  ngOnInit() {
    this.OpenInv = "Assigned Vs Audited by Auditor";
    this.getEnrollAuditorUserGroups();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  validateDates() {
    const fromDateValue = this.assignedVsAuditedGroup.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      const isValid = diffInMonths < 6 ? true : false;
      if (!isValid) {
        this.assignedVsAuditedGroup.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.assignedVsAuditedGroup.updateValueAndValidity();
      } else {
        this.assignedVsAuditedGroup.controls.dateRange.setErrors(null);
        this.assignedVsAuditedGroup.updateValueAndValidity();
        this.onSubmitAge();
      }
    } else {
      this.assignedVsAuditedGroup.controls.dateRange.setErrors(null);
      this.assignedVsAuditedGroup.updateValueAndValidity();
      this.onSubmitAge();
    }
  }

  getMonths(fromDateValue) {
    const fromDate = new Date(fromDateValue[0]);
    const toDate = new Date(fromDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  getEnrollAuditorUserGroups() {
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
    this.assignedVsAuditedGroup.get("userGrpName").setValue(selectedScopes);
    this.getEnrollManagerAuditors();
  }

  getEnrollManagerAuditors() {
    this.auditor = [];
    if (this.assignedVsAuditedGroup.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(
        this.assignedVsAuditedGroup.get("userGrpName").value
      );
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
      this.assignedVsAuditedGroup.get("auditorName").setValue([]);
    }
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
    this.assignedVsAuditedGroup.get("auditorName").setValue(selectedAuditor);
    this.onSubmitAge();
  }

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollManagerAuditors();
  }

  validateAuditor() {
    this.updateMultiSelectLabels();
    this.onSubmitAge();
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

  mapAuditor(adtName) {
    this.auditorArray = [];
    if (
      adtName &&
      adtName !== undefined &&
      adtName !== "" &&
      adtName !== null &&
      adtName.length > 0
    ) {
      adtName.forEach(q => {
        this.auditorArray.push(q.id);
      });
    }
    return this.auditorArray;
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

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataAge.length > 0) {
      const row = e[0].row;
      const col = e[0].column;
      const workCategory = this.dataAge[row][0];
      this.workCategory = workCategory;
      const workCategoryArray = workCategory;
      const a = this.columnNamesAge[col];
      const act = typeof a === "object" ? this.columnNamesAge[col - 1] : a;
      this.action = act.toString();
      const acct =
        this.action.toUpperCase() === "TRANSACTION ASSIGNED"
          ? "ASSIGNED"
          : "COMPLETED";
      const fromDate = this.assignedVsAuditedGroup.get("dateRange").value[0];
      const toDate = this.getToDateValue();
      this.editUser = {
        type: "assigned-vs-audited",
        workCategory: workCategoryArray,
        status: acct,
        auditorName: this.mapAuditorNames(
          this.assignedVsAuditedGroup.get("auditorName").value
        ),
        auditorIds: this.mapAuditorIds(
          this.assignedVsAuditedGroup.get("auditorName").value
        ),
        userGroupId: this.mapUsrGrpIds(
          this.assignedVsAuditedGroup.get("userGrpName").value
        ),
        userGroupName: this.mapUsrGrpName(
          this.assignedVsAuditedGroup.get("userGrpName").value
        ),
        fromDate: this.datePipe.transform(fromDate, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDate, "yyyy-MM-dd")
      };
      this.editMode = true;
    }
  }

  getToDateValue() {
    const toDateValue =
      this.assignedVsAuditedGroup.get("dateRange").value[1] !== null &&
      this.assignedVsAuditedGroup.get("dateRange").value[1] !== "" &&
      this.assignedVsAuditedGroup.get("dateRange").value[1] !== undefined
        ? this.assignedVsAuditedGroup.get("dateRange").value[1]
        : this.assignedVsAuditedGroup.get("dateRange").value[0];
    return toDateValue;
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
    this.dataAge.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getAgeChartValue() {
    this.dataAge = [];
    this.optionsAge.legend.position = "top";
    this.optionsAge.tooltip.trigger = "focus";
    this.optionsAgeEnlarged.legend.position = "top";
    this.optionsAgeEnlarged.tooltip.trigger = "focus";
    let responseValue = [];

    responseValue = this.assignedAuditedDtos;
    if (responseValue !== null && responseValue.length !== 0) {
      this.widthAge =
        responseValue.length > 6 ? responseValue.length * 100 : 550;
      this.widthAgeEnlarged =
        responseValue.length > 6 ? responseValue.length * 100 : 700;
      responseValue.forEach(val => {
        this.dataAge.push([
          val.workCategory,
          val.assignedTransactionCount,
          val.assignedTransactionCount,
          val.auditCompletedCount,
          val.auditCompletedCount
        ]);
      });
      const adt = this.assignedVsAuditedGroup.get("auditorName").value;
      const audit = [];
      adt.forEach(q => {
        audit.push(q.name);
      });
      this.auditorName = audit.length === 1 ? audit[0] : "";
    } else {
      this.getAgeChartNoValue();
    }
  }

  getAgeCount() {
    const fromDateValue = this.assignedVsAuditedGroup.get("dateRange").value[0];
    const toDateValue = this.assignedVsAuditedGroup.get("dateRange").value[1];
    this.enrollmentManagerDashboardService.getAssignedVsAudited(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrp(this.userGrpArray),
      this.mapAuditor(this.assignedVsAuditedGroup.get("auditorName").value)
    );
    this.assignedAuditedDtos = this.enrollmentManagerDashboardService.assignedVsAuditedResponse;
    this.assignedAuditedDtos = null;
    this.ageSubscription = this.enrollmentManagerDashboardService
      .getAssignedVsAuditedListner()
      .subscribe((data: any) => {
        this.assignedAuditedDtos = data;
        this.dataAge = [];
        if (this.assignedAuditedDtos && this.assignedAuditedDtos.length > 0) {
          this.getAgeChartValue();
          this.isDataPresent = true;
        } else {
          this.getAgeChartNoValue();
        }
        this.ageSubscription.unsubscribe();
      });
    if (this.assignedAuditedDtos === null) {
      this.getAgeChartNoValue();
    }
    this.isAgeRendered = true;
  }

  onSubmitAge() {
    this.getAgeCount();
  }
}
