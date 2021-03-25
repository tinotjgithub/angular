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
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";

@Component({
  selector: "app-auditor-audit-status-by-specialist",
  templateUrl: "./auditor-audit-status-by-specialist.component.html",
  styleUrls: ["./auditor-audit-status-by-specialist.component.css"]
})
export class AuditorAuditStatusBySpecialistComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  @Input()
  enlargedDisplay: boolean;
  public specialistIdArray = [];
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  public isValid = true;
  public userGroupIdArray = [];
  managerReqCountScoreDto: any;
  public isDataPresent = false;
  public editMode = false;
  public userGroupNameArray = [];
  public editUser = {};
  public stsArray = [];
  public userGrpList = [];
  public specialistListArray = [];
  userGrp: any[];
  userGrpArray: any[];
  specialist: any[];
  specialistArray: any[];
  public specialistName = "";
  private ageSubscription: Subscription = new Subscription();
  public titleReqCount = "";
  public typeReqCount = "BarChart";
  public columnNamesReqCount = [
    "",
    "Audit Passed",
    { role: "annotation" },
    "Audit Failed",
    { role: "annotation" },
    "Transaction Count Mismatch",
    { role: "annotation" }
  ];
  public optionsReqCount = {
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
    colors: ["#4cc14f", "#ff5c5d", "#deb833"],
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
      left: 120,
      right: 70,
      top: 17,
      bottom: 10
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

  public optionsReqCountEnlarged = {
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
    colors: ["#4cc14f", "#ff5c5d", "#deb833"],
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
      left: 120,
      right: 70,
      top: 17,
      bottom: 10
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
  public widthReqCount = 610;
  public heightReqCount = 250;
  public action = "";
  public dataReqCount = [];
  public isReqCountRendered = false;
  public countByProdVolGroup: FormGroup;
  public maxDate = new Date();

  constructor(
    private fbReqCount: FormBuilder,
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService,
    public datePipe: DatePipe,
    private authService: AuthenticationService
  ) {
    const todaysDate = new Date();
    const defaultDateRange = [];
    const dateToday = new Date();
    const y = dateToday.getFullYear();
    const m = dateToday.getMonth();
    const firstDay = new Date(y, m, 1);
    defaultDateRange.push(firstDay);
    defaultDateRange.push(todaysDate);

    this.countByProdVolGroup = fbReqCount.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      specialistName: ["", Validators.required]
    });
  }

  get getDateRange() {
    return this.countByProdVolGroup.controls.dateRange;
  }
  get getSpecialistsSelect() {
    return this.countByProdVolGroup.controls.specialistName;
  }

  get getGroup() {
    return this.countByProdVolGroup.controls.userGrpName;
  }

  ngOnInit() {
    this.getEnrollSpecialistUserGroups();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  getEnrollSpecialistUserGroups() {
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
    this.getEnrollAuditorSpecialists();
  }

  getEnrollAuditorSpecialists() {
    this.specialist = [];
    if (this.countByProdVolGroup.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(this.countByProdVolGroup.get("userGrpName").value);
      this.enrollmentAuditorDashboardService.getEnrollAuditorSpecialists(
        this.mapUserGrp(this.userGrpArray)
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
      this.countByProdVolGroup.get("specialistName").setValue([]);
    }
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
    this.countByProdVolGroup.get("specialistName").setValue(selectedSpecialist);
    this.onSubmitReqCount();
  }

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollAuditorSpecialists();
  }

  validateSpecialist() {
    this.updateMultiSelectLabels();
    this.onSubmitReqCount();
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

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const col = e[0].column;
      const specialistName = this.dataReqCount[row][0];
      this.specialistName = specialistName;
      const a = this.columnNamesReqCount[col];
      const act = typeof a === "object" ? this.columnNamesReqCount[col - 1] : a;
      this.action = act.toString();
      const acct =
        this.action === "Audit Passed"
          ? "PASSED"
          : this.action === "Audit Failed"
          ? "FAILED"
          : "TRANSACTION MISMATCH";
      const fromDate = this.countByProdVolGroup.get("dateRange").value[0];
      const toDate = this.getToDateValue();
      this.editUser = {
        type: "audit-sts-specialist",
        specialistName,
        status: acct,
        specialistId: this.specialistIdArray[row],
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
    this.SpecialistSelect.updateLabel = function() {
      const SpecialistLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Specialist Selected"
          : this.value.length.toString() + " Specialists Selected";

      this.valuesAsString = SpecialistLabel;
    };
  }

  setProdVolChartOptions() {
    const userGroupLength =
      this.dataReqCount.length === 1
        ? this.dataReqCount.length * 250
        : this.dataReqCount.length <= 3
        ? this.dataReqCount.length * 150
        : this.dataReqCount.length * 100;
    this.optionsReqCount.height = userGroupLength;
    this.optionsReqCountEnlarged.height = userGroupLength;
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
        this.onSubmitReqCount();
      }
    } else {
      this.countByProdVolGroup.controls.dateRange.setErrors(null);
      this.countByProdVolGroup.updateValueAndValidity();
      this.onSubmitReqCount();
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

  auditStatusSpecialistChartNoValue() {
    this.isDataPresent = false;
    this.specialistIdArray = [];
    this.userGroupIdArray = [];
    this.dataReqCount = [];
    this.userGroupIdArray = [];
    this.specialistIdArray = [];
    this.optionsReqCount.legend.position = "none";
    this.optionsReqCount.tooltip.trigger = "none";
    this.optionsReqCountEnlarged.legend.position = "none";
    this.optionsReqCountEnlarged.tooltip.trigger = "none";
    this.dataReqCount.push(["NO DATA", 0, "0", 0, "0"]);
  }

  auditStatusSpecialistChartValue() {
    this.userGroupIdArray = [];
    this.specialistIdArray = [];
    this.dataReqCount = [];
    this.optionsReqCount.legend.position = "top";
    this.optionsReqCount.tooltip.trigger = "focus";
    this.optionsReqCountEnlarged.legend.position = "top";
    this.optionsReqCountEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.managerReqCountScoreDto;
    if (responseValue !== null && responseValue.length !== 0) {
      this.isDataPresent = true;
      this.optionsReqCount.bar.width =
        responseValue.length <= 3 ? "45%" : "65%";
      responseValue.forEach(val => {
        this.dataReqCount.push([
          val.specialistName,
          val.auditPassedCount,
          val.auditPassedCount,
          val.auditFailedCount,
          val.auditFailedCount,
          val.transactionCountMismatch,
          val.transactionCountMismatch
        ]);
        this.specialistIdArray.push(val.specialistId);
        this.userGroupIdArray.push(val.userGroupIds);
      });
      this.setProdVolChartOptions();
    } else {
      this.auditStatusSpecialistChartNoValue();
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

  getAuditStatusSpecialist() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByProdVolGroup.get("dateRange").value[0];
    this.mapUsrGrpNameList(this.countByProdVolGroup.get("userGrpName").value);
    this.enrollmentAuditorDashboardService.getAuditStatusSpecialist(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrp(this.userGrpArray),
      this.mapSpecialist(this.countByProdVolGroup.get("specialistName").value)
    );
    this.managerReqCountScoreDto = this.enrollmentAuditorDashboardService.auditStatusSpecialistResponse;
    this.managerReqCountScoreDto = null;
    this.ageSubscription = this.enrollmentAuditorDashboardService
      .getAuditStatusSpecialistListner()
      .subscribe((data: any) => {
        this.managerReqCountScoreDto = data;
        this.dataReqCount = [];
        this.managerReqCountScoreDto.length > 0
          ? this.auditStatusSpecialistChartValue()
          : this.auditStatusSpecialistChartNoValue();
        this.ageSubscription.unsubscribe();
      });
    if (this.managerReqCountScoreDto === null) {
      this.auditStatusSpecialistChartNoValue();
    }
    this.isReqCountRendered = true;
  }

  onSubmitReqCount() {
    if (this.countByProdVolGroup.invalid && this.isValid) {
      return;
    } else {
      this.getAuditStatusSpecialist();
    }
  }

  ngOnDestroy() {
    this.ageSubscription.unsubscribe();
    this.userGrpSubscription.unsubscribe();
    this.specialistSubscription.unsubscribe();
  }
}
