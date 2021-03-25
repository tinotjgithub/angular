import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { Subscription } from "rxjs";
import { EnrollmentLeadDashboardService } from "./../../../enrollment-ops/enrollment-lead/enrollment-lead-dashboard/enrollment-lead-dashboard.service";
import { MultiSelect } from "primeng/multiselect";
@Component({
  selector: "app-pended-request-age",
  templateUrl: "./pended-request-age.component.html"
})
export class PendedRequestAgeComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  pendedTransactionReportDto: any;
  pendRecDtos: any;
  age = "";
  public isLead = false;
  public isDataPresent = false;
  reportSubscription: Subscription = new Subscription();
  enlargedDisplay = false;
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  public ageSubscription: Subscription = new Subscription();
  userGrp: any[];
  public editUser = {};
  public editMode = false;
  userGrpArray: any[];
  specialist: any[];
  public userGrpList = [];
  specialistArray: any[];
  public specialistListArray = [];
  public titleAge = "";
  public role = "";
  public typeAge = "ColumnChart";
  public columnNamesAge = ["", "Pended Request Count", { role: "annotation" }];
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
    colors: ["#ff5c5d"],
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
    }
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
    colors: ["#ff5c5d"],
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
    }
  };

  public heightAge = 250;
  public widthAge = 600;
  public widthAgeEnlarged = 800;
  public dataAge = [];
  public isAgeRendered = false;
  public countByAgeGroup: FormGroup;
  public titlePend = "";

  constructor(
    private fbAge: FormBuilder,
    private enrollmentManagementService: EnrollmentManagementService,
    private enrollmenLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    this.countByAgeGroup = fbAge.group({
      userGrpName: ["", Validators.required],
      specialistName: ["", Validators.required]
    });
  }

  get getSpecialistsSelect() {
    return this.countByAgeGroup.controls.specialistName;
  }

  get getGroup() {
    return this.countByAgeGroup.controls.userGrpName;
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId")
      ? this.secureLocalStorage.getItem("roleId")
      : "";

    this.isLead = this.role === "Enrollment Lead" ? true : false;
    this.isLead ? this.getEnrollLeadUserGroups() : "";
    this.titlePend = this.isLead
      ? "Pended Records Age "
      : "Pended Transaction Age";
    this.onSubmitAge();
  }

  ngAfterViewInit() {
    this.isLead ? this.updateMultiSelectLabels() : "";
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

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataAge.length > 0) {
      const row = e[0].row;
      const age = this.dataAge[row][0];
      const todaysDate = new Date();
      const defaultFrom = new Date("01-01-1970");
      const fromDateValue = defaultFrom;
      const toDateValue = todaysDate;
      this.age = age;
      const userGroupId = this.isLead
        ? this.mapUserGrp(this.userGrpArray)
        : null;
      const specialistId = this.isLead
        ? this.mapSpecialist(this.countByAgeGroup.get("specialistName").value)
        : null;
      this.editUser = {
        type: "pend-req-age-lead",
        fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
        userGroupId,
        specialistId,
        age
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
    this.enrollmenLeadDashboardService.getEnrollLeadUserGroups();
    this.userGrp = this.enrollmenLeadDashboardService.enrollLeadUserGroupsResponse;
    this.userGrpSubscription = this.enrollmenLeadDashboardService
      .getEnrollLeadUserGroupsListner()
      .subscribe(data => {
        this.userGrp = data;
        this.mapUsrGrpNames();
        this.userGrpSubscription.unsubscribe();
      });
  }

  getEnrollLeadSpecialists() {
    this.specialist = [];
    this.mapUsrGrpNameList(this.countByAgeGroup.get("userGrpName").value);
    this.mapUserGrp(this.userGrpArray);
    this.enrollmenLeadDashboardService.getEnrollLeadSpecialists(
      this.mapUserGrp(this.userGrpArray)
    );
    this.specialist = this.enrollmenLeadDashboardService.enrollLeadSpecialistsResponse;
    this.specialistSubscription = this.enrollmenLeadDashboardService
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
    this.countByAgeGroup.get("userGrpName").setValue(selectedScopes);
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
    this.countByAgeGroup.get("specialistName").setValue(selectedSpecialist);
    this.getAgeCount();
  }
  validateUserGroups() {
    this.updateMultiSelectLabels();
    if (this.countByAgeGroup.get("userGrpName").value.length > 0) {
      this.getEnrollLeadSpecialists();
    }
  }

  validateSpecialist() {
    this.updateMultiSelectLabels();
    this.onSubmitAge();
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

  mapSpecialist(specialist) {
    const specialistArray = [];
    if (
      specialist &&
      specialist !== undefined &&
      specialist !== "" &&
      specialist !== null &&
      specialist.length > 0
    ) {
      for (let index = 0; index <= specialist.length; index++) {
        specialist.forEach(q => {
          if (q.label === specialist[index]) {
            specialistArray.push(q.id);
          }
        });
      }
    }
    return specialistArray;
  }

  ngOnDestroy() {
    this.ageSubscription.unsubscribe();
    if (this.role === "Enrollment Lead") {
      this.userGrpSubscription.unsubscribe();
      this.specialistSubscription.unsubscribe();
    }
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
    this.dataAge.push(["NO DATA", 0, "0"]);
  }

  getAgeChartValue() {
    this.dataAge = [];
    this.optionsAge.legend.position = "top";
    this.optionsAge.tooltip.trigger = "focus";
    this.optionsAgeEnlarged.legend.position = "top";
    this.optionsAgeEnlarged.tooltip.trigger = "focus";
    let responseValue = [];

    responseValue = this.pendRecDtos;
    if (responseValue !== null && responseValue.length !== 0) {
      this.widthAge =
        responseValue.length > 6 ? responseValue.length * 100 : 550;
      this.widthAgeEnlarged =
        responseValue.length > 6 ? responseValue.length * 100 : 700;
      responseValue.forEach(val => {
        this.dataAge.push([val.requestAge, val.requestCount, val.requestCount]);
      });
    } else {
      this.getAgeChartNoValue();
    }
  }

  getAgeCount() {
    const todaysDate = new Date();
    const defaultFrom = new Date("01-01-1970");
    const fromDateValue = defaultFrom;
    const toDateValue = todaysDate;
    const userGroupId = this.isLead
      ? this.mapUserGrp(this.userGrpArray)
      : null;
    const specialistId = this.isLead
      ? this.mapSpecialist(this.countByAgeGroup.get("specialistName").value)
      : null;
    this.enrollmenLeadDashboardService.getPendedRecordsAge(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      userGroupId,
      specialistId,
      this.role
    );
    this.pendRecDtos = this.enrollmenLeadDashboardService.pendedRecordsAgeResponse;
    this.pendRecDtos = null;
    this.ageSubscription = this.enrollmenLeadDashboardService
      .getPendedRecordsAgeListner()
      .subscribe((data: any) => {
        this.pendRecDtos = data;
        this.dataAge = [];
        if (this.pendRecDtos && this.pendRecDtos.length > 0) {
          this.getAgeChartValue();
          this.isDataPresent = true;
        } else {
          this.getAgeChartNoValue();
        }
        this.ageSubscription.unsubscribe();
      });
    if (this.pendRecDtos === null) {
      this.getAgeChartNoValue();
    }
    this.isAgeRendered = true;
  }

  downloadFile(statusReport: any) {
    const responseBody = statusReport.body;
    const blob = new Blob([responseBody], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const today = new Date();
    const dateString = this.datePipe.transform(today, "MMddyyyy");
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(
        blob,
        "Pended Transaction Age-" + dateString + ".xlsx"
      );
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          "Pended Transaction Age-" + dateString + ".xlsx"
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  downloadExcel() {
    const todaysDate = new Date();
    const defaultFrom = new Date("01-01-1970");
    const fromDateValue = defaultFrom;
    const toDateValue = todaysDate;
    this.enrollmenLeadDashboardService.getPendedTransactionReport(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.pendedTransactionReportDto = this.enrollmenLeadDashboardService.pendedTransactionResponse;
    this.reportSubscription = this.enrollmenLeadDashboardService
      .getPendedTransactionReportListner()
      .subscribe(data => {
        this.pendedTransactionReportDto = data;
        this.downloadFile(this.pendedTransactionReportDto);
        this.reportSubscription.unsubscribe();
      });
  }

  onSubmitAge() {
    if (this.isLead) {
      if (
        this.countByAgeGroup.get("userGrpName").value.length > 0 &&
        this.countByAgeGroup.get("specialistName").value.length > 0
      ) {
        this.getAgeCount();
      } else {
        return;
      }
    } else {
      this.getAgeCount();
    }
  }
}
