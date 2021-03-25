import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-my-team-productivity-by-lead",
  templateUrl: "./my-team-productivity-by-lead.component.html",
  styleUrls: ["./my-team-productivity-by-lead.component.css"]
})
export class MyTeamProductivityByLeadComponent
  implements OnInit, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("LeadSelect", { static: false })
  LeadSelect: MultiSelect;
  private myTeamProductivitySubscription: Subscription = new Subscription();
  private userGrpSubscription: Subscription = new Subscription();
  private leadSubscription: Subscription = new Subscription();
  public teamProductivityDto: any;
  public myDataProductivity = [];
  public isProductivityRendered = false;
  public myTeamProductivityDates: FormGroup;
  public enlargedDisplay = false;
  public isValid = true;
  public role = "";
  public maxDate = new Date();
  public isDataPresent = false;
  public myTeamProductivityType = "LineChart";
  public myTitleProductivity = "";
  public myTypeProductivity = "LineChart";
  public userGrpList = [];
  public leadListArray = [];
  userGrp: any[];
  userGrpArray: any[];
  lead: any[];
  leadArray: any[];
  public myColumnNamesProductivity = [
    "",
    "Average Transaction Completed",
    { role: "annotation" },
    "Target",
    { role: "annotation" }
  ];
  public myOptionsProductivity = {
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
    legend: {
      position: "top",
      width: "20%",
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
    chartArea: {
      left: 30,
      right: 10,
      top: 17,
      bottom: 35
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

  public myOptionsProductivityEnlarged = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 13
      }
    },
    colors: ["#1f9675", "#c7203e"],
    hAxis: {
      title: "",
      type: "string",
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
      }
    },
    legend: {
      position: "top",
      width: "20%",
      textStyle: {
        color: "black",
        fontSize: 14,
        textPosition: "Horizontal"
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    chartArea: {
      left: 30,
      right: 10,
      top: 30,
      bottom: 40
    },
    pointSize: 3,
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
    }
  };

  public myWidthProductivity = 530;
  public myHeightProductivity = 250;

  constructor(
    private fbprod: FormBuilder,
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    const today = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(today);
    defaultDateRange.push(today);
    this.myTeamProductivityDates = fbprod.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      leadName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getEnrollLeadUserGroups();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  get getLeadsSelect() {
    return this.myTeamProductivityDates.controls.leadName;
  }

  get getGroup() {
    return this.myTeamProductivityDates.controls.userGrpName;
  }

  showDialog() {
    this.myOptionsProductivity.annotations.textStyle.fontSize = 13;
    this.enlargedDisplay = true;
  }

  getNoDataChart() {
    this.isDataPresent = false;
    this.myDataProductivity = [];
    this.myOptionsProductivity.legend.position = "none";
    this.myOptionsProductivity.tooltip.trigger = "none";
    this.myDataProductivity.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getDataChart() {
    this.isDataPresent = true;
    this.myDataProductivity = [];
    this.myOptionsProductivity.legend.position = "top";
    this.myOptionsProductivity.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.teamProductivityDto;
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
      const leadArray = this.myTeamProductivityDates.get("leadName").value;
      const leads = [];
      leadArray.forEach(lead => {
        leads.push(lead.name);
      });
      if (leads.length === 1) {
        this.myColumnNamesProductivity[1] = leads[0].toString();
      } else {
        this.myColumnNamesProductivity[1] = "Average Transaction Completed";
      }
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
      this.myTeamProductivityDates.get("dateRange").value[1] !== null &&
      this.myTeamProductivityDates.get("dateRange").value[1] !== "" &&
      this.myTeamProductivityDates.get("dateRange").value[1] !== undefined
        ? this.myTeamProductivityDates.get("dateRange").value[1]
        : this.myTeamProductivityDates.get("dateRange").value[0];
    return toDateValue;
  }

  getMyTeamProductivityDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.myTeamProductivityDates.get("dateRange")
      .value[0];
    this.enrollmentManagerDashboardService.getManagerTeamProdScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapUserGrp(this.userGrpArray),
      this.mapLead(this.myTeamProductivityDates.get("leadName").value)
    );
    this.teamProductivityDto = this.enrollmentManagerDashboardService.managerTeamProdScoreResponse;
    this.teamProductivityDto = null;
    this.myTeamProductivitySubscription = this.enrollmentManagerDashboardService
      .getManagerTeamProdScoresListner()
      .subscribe((data: any) => {
        this.teamProductivityDto = data;
        this.myDataProductivity = [];
        this.teamProductivityDto && this.teamProductivityDto.length > 0
          ? this.getDataChart()
          : this.getNoDataChart();
        this.myTeamProductivitySubscription.unsubscribe();
      });
    if (this.teamProductivityDto === null) {
      this.getNoDataChart();
    }
    this.isProductivityRendered = true;
    this.updateMultiSelectLabels();
  }

  validateDates() {
    const fromDateValue = this.myTeamProductivityDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const date1 = new Date(fromDateValue[0]);
      const date2 = new Date(fromDateValue[1]);
      this.isValid = this.getNoOfmonths(date1, date2) > 6 ? false : true;
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

  onSubmitMyTeamProductivity() {
    if (
      this.isValid &&
      this.myTeamProductivityDates.get("leadName").value.length > 0 &&
      this.myTeamProductivityDates.get("userGrpName").value.length > 0
    ) {
      this.getMyTeamProductivityDays();
    }
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

  getEnrollManagerLeads() {
    this.lead = [];
    if (this.myTeamProductivityDates.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(
        this.myTeamProductivityDates.get("userGrpName").value
      );
      this.enrollmentManagerDashboardService.getEnrollManagerLeads(
        this.mapUserGrp(this.userGrpArray)
      );
      this.lead = this.enrollmentManagerDashboardService.enrollManagerLeadsResponse;
      this.leadSubscription = this.enrollmentManagerDashboardService
        .getEnrollManagerLeadsListner()
        .subscribe(data => {
          this.lead = data;
          this.mapLeads();
          this.leadSubscription.unsubscribe();
        });
    } else {
      this.myTeamProductivityDates.get("leadName").setValue([]);
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
    this.myTeamProductivityDates.get("userGrpName").setValue(selectedScopes);
    this.getEnrollManagerLeads();
  }

  mapLeads() {
    this.leadListArray = [];
    if (this.lead && this.lead.length > 0) {
      this.lead.forEach(s => {
        this.leadListArray.push({
          label: s.leadName,
          value: {
            id: s.id,
            name: s.leadName,
            code: s.leadName
          }
        });
      });
    }
    const selectedLead = [];
    this.leadListArray.forEach(item => {
      selectedLead.push(item.value);
    });
    this.myTeamProductivityDates.get("leadName").setValue(selectedLead);
    this.onSubmitMyTeamProductivity();
  }

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollManagerLeads();
  }

  validateLead() {
    this.updateMultiSelectLabels();
    this.onSubmitMyTeamProductivity();
  }

  updateMultiSelectLabels() {
    this.userGrpSelect.updateLabel = function() {
      const grpLabel =
        this.value.length === 1
          ? this.value.length.toString() + " User Group Selected"
          : this.value.length.toString() + " User Groups Selected";
      this.valuesAsString = grpLabel;
    };
    this.LeadSelect.updateLabel = function() {
      const LeadLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Lead Selected"
          : this.value.length.toString() + " Leads Selected";

      this.valuesAsString = LeadLabel;
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

  mapLead(ldName) {
    this.leadArray = [];
    if (
      ldName &&
      ldName !== undefined &&
      ldName !== "" &&
      ldName !== null &&
      ldName.length > 0
    ) {
      ldName.forEach(q => {
        this.leadArray.push(q.id);
      });
    }
    return this.leadArray;
  }

  onDestroy() {
    this.myTeamProductivitySubscription.unsubscribe();
    this.leadSubscription.unsubscribe();
    this.userGrpSubscription.unsubscribe();
  }
}
