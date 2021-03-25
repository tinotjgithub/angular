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
  selector: "app-production-count-specialist",
  templateUrl: "./production-count-specialist.component.html"
})
export class ProductionCountSpecialistComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // @ViewChild(MultiSelect, { static: false })
  // select: MultiSelect;
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  @Input()
  triggerZoom: boolean;
  managerAgeScoreDto: any;
  enlargedDisplay = false;
  public specialistIdArray = [];
  public isDataPresent = false;
  public userGroupIdArray = [];
  public editMode = false;
  public editUser = {};
  private ageSubscription: Subscription = new Subscription();
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  public titleAge = "";
  public userGrpList = [];
  public specialistListArray = [];
  public typeAge = "BarChart";
  public columnNamesAge = [
    "",
    "Completed",
    { role: "annotation" },
    "Pended",
    { role: "annotation" },
    "Assigned",
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
    colors: ["#4cc14f", "#ff5c5d", "#ff9226"],
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
    colors: ["#4cc14f", "#ff5c5d", "#ff9226"],
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
  public widthAge = 550;
  public heightAge = 200;
  public specialistName = "";
  public action = "";
  public dataAge = [];
  public isAgeRendered = false;
  public countByProdVolGroup: FormGroup;
  public maxDate = new Date();
  userGrp: any[];
  userGrpArray: any[];
  specialist: any[];
  specialistArray: any[];

  constructor(
    private fbAge: FormBuilder,
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe,
    private authService: AuthenticationService
  ) {
    const todaysDate = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    this.countByProdVolGroup = fbAge.group({
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
      const specialistName = this.dataAge[row][0];
      this.specialistName = specialistName;
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
      const fromDate = this.countByProdVolGroup.get("dateRange").value[0];
      const toDate = this.getToDateValue();
      this.editUser = {
        type: "prod-count-spl",
        singleSpecialistName: this.specialistName,
        action: acct,
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
    if (this.countByProdVolGroup.get("userGrpName").value.length > 0) {
      this.specialist = [];
      this.mapUsrGrpNameList(this.countByProdVolGroup.get("userGrpName").value);
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
    this.getEnrollLeadSpecialists();
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
    this.getEnrollLeadSpecialists();
  }

  validateSpecialist() {
    this.updateMultiSelectLabels();
    this.onSubmitAge();
  }

  getAgeChartNoValue() {
    this.isDataPresent = false;
    this.dataAge = [];
    this.optionsAge.legend.position = "none";
    this.optionsAge.tooltip.trigger = "none";
    this.optionsAgeEnlarged.legend.position = "none";
    this.optionsAgeEnlarged.tooltip.trigger = "none";
    this.dataAge.push(["NO DATA", 0, "0", 0, "0", 0, "0"]);
    this.userGroupIdArray = [];
    this.specialistIdArray = [];
  }

  getAgeChartValue() {
    this.userGroupIdArray = [];
    this.specialistIdArray = [];
    this.dataAge = [];
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
          val.specialistName,
          val.completedCount,
          val.completedCount,
          val.pendedCount,
          val.pendedCount,
          val.assignedCount,
          val.assignedCount
        ]);
        this.specialistIdArray.push(val.specialistId);
        this.userGroupIdArray.push(val.userGroupId);
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

  getAgeCount() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByProdVolGroup.get("dateRange").value[0];
    this.mapUsrGrpNameList(this.countByProdVolGroup.get("userGrpName").value);
    this.mapSpecialist(this.countByProdVolGroup.get("specialistName").value);
    this.enrollmentLeadDashboardService.prodVolSpl(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrp(this.userGrpArray),
      this.mapSpecial(this.specialistArray)
    );
    this.managerAgeScoreDto = this.enrollmentLeadDashboardService.prodVolResponse;
    this.managerAgeScoreDto = null;
    this.ageSubscription = this.enrollmentLeadDashboardService
      .prodVolSplListner()
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
    this.specialistSubscription.unsubscribe();
  }
}
