import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { MultiSelect } from "primeng/multiselect";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { EnrollmentLeadDashboardService } from "../enrollment-lead-dashboard.service";

@Component({
  selector: "app-enrollment-audit-summary-by-auditor",
  templateUrl: "./enrollment-audit-summary-by-auditor.component.html",
  styleUrls: ["./enrollment-audit-summary-by-auditor.component.css"]
})
export class EnrollmentAuditSummaryByAuditorComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // @ViewChild(MultiSelect, { static: false })
  // select: MultiSelect;
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("AuditorSelect", { static: false })
  AuditorSelect: MultiSelect;
  @Input()
  triggerZoom: boolean;
  managerAgeScoreDto: any;
  enlargedDisplay = false;
  public auditorIds = [];
  public userGroupIdArray = [];
  public isDataPresent = false;
  public editMode = false;
  public editUser = {};
  private ageSubscription: Subscription = new Subscription();
  private userGrpSubscription: Subscription = new Subscription();
  private auditorSubscription: Subscription = new Subscription();
  public titleAge = "";
  public userGrpList = [];
  public auditorListArray = [];
  public typeAge = "BarChart";
  public columnNamesAge = [
    "",
    "Audit Success",
    { role: "annotation" },
    "Audit Failed",
    { role: "annotation" },
    "To Do",
    { role: "annotation" }
  ];
  public optionsAge = {
    bar: { width: "60%" },
    height: 100,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12,
        color: "black",
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#2c68a6"],
    hAxis: {
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 11,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 100,
      right: 70,
      top: 17,
      bottom: 30
    },
    legend: {
      position: "top",
      width: "50%",
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
    },
    isStacked: true
  };

  public optionsAgeEnlarged = {
    height: 100,
    bar: { width: "60%" },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12,
        color: "black",
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#2c68a6"],
    hAxis: {
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 11,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 100,
      right: 70,
      top: 17,
      bottom: 20
    },
    legend: {
      position: "top",
      width: "50%",
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
    },
    isStacked: true
  };
  public widthAge = 550;
  public heightAge = 150;
  public auditorName = "";
  public action = "";
  public dataAge = [];
  public isAgeRendered = false;
  public countByProdVolGroup: FormGroup;
  public maxDate = new Date();
  userGrp: any[];
  userGrpArray: any[];
  auditor: any[];
  auditorArray: any[];

  constructor(
    private fbAge: FormBuilder,
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe,
    private authService: AuthenticationService
  ) {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterdayDate = new Date(
      this.datePipe.transform(today, "yyyy-MM-dd")
    );

    const thirty = new Date();
    today.setDate(thirty.getDate() - 31);
    const thirtyDays = new Date(this.datePipe.transform(today, "yyyy-MM-dd"));
    const defaultDateRange = [];
    defaultDateRange.push(thirtyDays);
    defaultDateRange.push(yesterdayDate);
    this.countByProdVolGroup = fbAge.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      auditorName: ["", Validators.required]
    });
  }

  get getDateRange() {
    return this.countByProdVolGroup.controls.dateRange;
  }

  get getAuditorsSelect() {
    return this.countByProdVolGroup.controls.auditorName;
  }

  get getGroup() {
    return this.countByProdVolGroup.controls.userGrpName;
  }

  ngOnInit() {
    this.getEnrollLeadUserGroups();
    this.onSubmitAge();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const col = e[0].column;
      const auditorName = this.dataAge[row][0];
      this.auditorName = auditorName;
      const a = this.columnNamesAge[col];
      const act = typeof a === "object" ? this.columnNamesAge[col - 1] : a;
      this.action = act.toString();
      const acct = [];
      acct.push(
        act.toString() === "Audit Failed"
          ? "FAILED"
          : act.toString() === "Audit Success"
          ? "PASSED"
          : "TODO"
      );

      const fromDate = this.countByProdVolGroup.get("dateRange").value[0];
      const toDate = this.getToDateValue();
      this.editUser = {
        type: "enr-audit-summary",
        action: acct,
        auditorId: this.auditorIds[row],
        auditorName,
        userGroupId: this.userGroupIdArray[row],
        fromDate: this.datePipe.transform(fromDate, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDate, "yyyy-MM-dd")
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
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

  getEnrollLeadAuditors() {
    if (this.countByProdVolGroup.get("userGrpName").value.length > 0) {
      this.auditor = [];
      this.mapUsrGrpNameList(this.countByProdVolGroup.get("userGrpName").value);
      this.enrollmentLeadDashboardService.getEnrollAuditors(
        this.mapUserGrp(this.userGrpArray)
      );
      this.auditor = this.enrollmentLeadDashboardService.enrollAuditorResponse;
      this.auditorSubscription = this.enrollmentLeadDashboardService
        .getEnrollAuditorsListner()
        .subscribe(data => {
          this.auditor = data;
          this.mapAuditors();
          this.auditorSubscription.unsubscribe();
        });
    }
  }

  setProdVolChartOptions() {
    const userGroupLength =
      this.dataAge.length === 1
        ? this.dataAge.length * 250
        : this.dataAge.length <= 3
        ? this.dataAge.length * 150
        : this.dataAge.length * 100;
    this.optionsAge.height = userGroupLength;
    this.optionsAgeEnlarged.height = userGroupLength;
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
    this.countByProdVolGroup.get("userGrpName").setValue(selectedScopes);
    this.getEnrollLeadAuditors();
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

  mapAudit(auditName) {
    const adtArray = [];
    if (auditName !== null && auditName.length > 0) {
      auditName.forEach(item => {
        adtArray.push(item.value);
      });
    }
    return adtArray;
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
    this.countByProdVolGroup.get("auditorName").setValue(selectedAuditor);
    this.getAgeCount();
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.countByProdVolGroup.get("dateRange").value;

    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      const isValid = diffInMonths < 6 ? true : false;
      if (!isValid) {
        this.countByProdVolGroup.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.countByProdVolGroup.updateValueAndValidity();
      } else {
        this.countByProdVolGroup.controls.dateRange.setErrors(null);
        this.countByProdVolGroup.updateValueAndValidity();
        this.onSubmitAge();
      }
    } else {
      this.countByProdVolGroup.controls.dateRange.setErrors(null);
      this.countByProdVolGroup.updateValueAndValidity();
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

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollLeadAuditors();
  }

  validateAuditor() {
    this.updateMultiSelectLabels();
    this.onSubmitAge();
  }

  getAgeChartNoValue() {
    this.isDataPresent = false;
    this.userGroupIdArray = [];
    this.auditorIds = [];
    this.dataAge = [];
    this.optionsAge.legend.position = "none";
    this.optionsAge.tooltip.trigger = "none";
    this.optionsAgeEnlarged.legend.position = "none";
    this.optionsAgeEnlarged.tooltip.trigger = "none";
    this.dataAge.push(["NO DATA", 0, "0", 0, "0", 0, "0"]);
  }

  getAgeChartValue() {
    this.dataAge = [];
    this.userGroupIdArray = [];
    this.auditorIds = [];
    this.optionsAge.legend.position = "top";
    this.optionsAge.tooltip.trigger = "focus";
    this.optionsAgeEnlarged.legend.position = "top";
    this.optionsAgeEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.managerAgeScoreDto;
    if (responseValue !== null && responseValue.length !== 0) {
      this.isDataPresent = true;
      this.optionsAge.bar.width = responseValue.length <= 3 ? "45%" : "65%";

      responseValue.forEach(val => {
        this.dataAge.push([
          val.auditorName,
          val.auditSuccessCount,
          val.auditSuccessCount,
          val.auditFailedCount,
          val.auditFailedCount,
          val.toDoCount,
          val.toDoCount
        ]);
        this.userGroupIdArray.push(val.userGroupId);
        this.auditorIds.push(val.auditorId);
      });
      this.setProdVolChartOptions();
    } else {
      this.getAgeChartNoValue();
    }
  }

  getToDateValue() {
    const toDateValue =
      this.countByProdVolGroup.get("dateRange").value[1] !== null &&
      this.countByProdVolGroup.get("dateRange").value[1] !== "" &&
      this.countByProdVolGroup.get("dateRange").value[1] !== undefined
        ? this.countByProdVolGroup.get("dateRange").value[1]
        : this.countByProdVolGroup.get("dateRange").value[0];
    return toDateValue;
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
        this.auditorArray.push({ label: q.name, value: q.id });
      });
    }
  }

  getAgeCount() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByProdVolGroup.get("dateRange").value[0];
    this.mapUsrGrpNameList(this.countByProdVolGroup.get("userGrpName").value);
    this.mapAuditor(this.countByProdVolGroup.get("auditorName").value);
    this.enrollmentLeadDashboardService.auditSummary(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrp(this.userGrpArray),
      this.mapAudit(this.auditorArray)
    );
    this.managerAgeScoreDto = this.enrollmentLeadDashboardService.auditSummaryResponse;
    this.managerAgeScoreDto = null;
    this.ageSubscription = this.enrollmentLeadDashboardService
      .auditSummaryListner()
      .subscribe((data: any) => {
        this.managerAgeScoreDto = data;
        this.dataAge = [];
        this.managerAgeScoreDto.length > 0
          ? this.getAgeChartValue()
          : this.getAgeChartNoValue();
        this.ageSubscription.unsubscribe();
      });
    if (this.managerAgeScoreDto === null) {
      this.getAgeChartNoValue();
    }
    this.isAgeRendered = true;
  }

  onSubmitAge() {
    if (this.countByProdVolGroup.invalid) {
      return;
    } else {
      this.getAgeCount();
    }
  }

  ngOnDestroy() {
    this.ageSubscription.unsubscribe();
    this.userGrpSubscription.unsubscribe();
    this.auditorSubscription.unsubscribe();
  }
}
