import { Component, OnInit } from "@angular/core";
import { actions, ROLES } from "src/app/shared/constants.js";
import { EmrollmentLeadLandingPageService } from "../../services/emrollment-lead-landing-page.service";
import PieChartCount from "src/app/modules/lead/landing-page/models/PieChartCount";
import { count } from "rxjs/operators";
@Component({
  selector: "app-enrollment-lead-landing-page",
  templateUrl: "./enrollment-lead-landing-page.component.html",
  styleUrls: ["./enrollment-lead-landing-page.component.css"]
})
export class EnrollmentLeadLandingPageComponent implements OnInit {
  public view = "list";
  public pieColor = [];
  public color = [
    "#003f5c",
    "#665191",
    "#a05195",
    "#d45087",
    "#ff6460",
    "#f95d6a",
    "#ff7c43",
    "#ffa600"
  ];
  piechartCount: PieChartCount = {
    assignedCount: 0,
    pendedCount: 0,
    toDoCount: 0
  };
  public optionsGeneralQueue = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
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
      position: "none"
    },
    pieHole: 0.25
  };
  public optionsRoutedIn = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
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
      position: "none"
    },
    pieHole: 0.25
  };
  public optionsRebuttalReview = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
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
      position: "none"
    },
    pieHole: 0.25
  };
  public optionsAssigned = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
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
      position: "none"
    },
    pieHole: 0.25
  };
  public optionsPended = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
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
      position: "none"
    },
    pieHole: 0.25
  };
  public optionsCompleted = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
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
      position: "none"
    },
    pieHole: 0.25
  };
  public optionsRoutedOut = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
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
      position: "none"
    },
    pieHole: 0.25
  };
  public optionsAuditFailed = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
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
      position: "none"
    },
    pieHole: 0.25
  };
  public typeStatus = "PieChart";
  public columnNamesStatus = ["requestType", "requestCount"];

  public totalAuditFailed = 0;
  public totalCompleted = 0;
  public totalPended = 0;
  public totalAssigned = 0;
  public totalRoutedOut = 0;
  public titleStatus = "";
  public totalRoutedIn = 0;
  public totalReview = 0;
  public totalGeneralQueue = 0;
  public myDataRebuttalReviewStatus = [];
  public myDataRoutedInStatus = [];

  public teamDataAssignedStatus = [];
  public teamDataPendedStatus = [];
  public teamDataCompletedStatus = [];
  public myDataGeneralQueueStatus = [];
  public generalQueueData = [];
  public assignedData = [];
  public completedData = [];
  public routedOutData = [];
  public pendedData = [];
  public auditFailedData = [];
  public reviewData = [];
  public teamDataRoutedOutStatus = [];
  public teamDataAuditFailedStatus = [];
  public routedInData = [];
  public teamDataStatus = [];
  public isStatusRendered = false;
  public widthStatus = "80%";
  public heightStatus = 200;
  public totalConfiguredItems = [];
  public specialistCount = 0;
  public pendingCount = 0;
  public daysCrossed = 0;

  public myTeamTask = false;
  constructor(private service: EmrollmentLeadLandingPageService) {}

  ngOnInit() {
    this.totalConfiguredItems = [];
    this.service.getTotalConfiguredItems().subscribe(res => {
      if (res) {
        this.totalConfiguredItems = res;
        this.setLegend();
      }
    });
    this.service.getEnrollmentLeadSpecialistCount().subscribe(res => {
      if (res) {
        this.specialistCount = res.specialistCount ? res.specialistCount : 0;
      }
    });
    this.service.getEnrollmentLeadPendingCount().subscribe(res => {
      if (res) {
        this.pendingCount = res.userCount ? res.userCount : 0;
        this.daysCrossed = res ? res.daysCrossed : false;
      }
    });
    this.clearData();
    this.service.getEnrollmentLeadStatus().subscribe(res => {
      if (res) {
        this.setGraphData(res);
        this.isStatusRendered = true;
      } else {
        this.getNoDataChart();
      }
    });
  }

  setLegend() {
    this.pieColor = [];
    this.color.forEach(clr => {
      this.pieColor.push(clr);
    });
    this.optionsAuditFailed.colors = this.pieColor;
    this.optionsAssigned.colors = this.pieColor;
    this.optionsCompleted.colors = this.pieColor;
    this.optionsGeneralQueue.colors = this.pieColor;
    this.optionsPended.colors = this.pieColor;
    this.optionsRebuttalReview.colors = this.pieColor;
    this.optionsRoutedIn.colors = this.pieColor;
    this.optionsRoutedOut.colors = this.pieColor;
  }

  clearData() {
    this.myDataRebuttalReviewStatus = [];
    this.myDataRoutedInStatus = [];
    this.teamDataAuditFailedStatus = [];
    this.generalQueueData = [];
    this.assignedData = [];
    this.reviewData = [];
    this.completedData = [];
    this.pendedData = [];
    this.teamDataAssignedStatus = [];
    this.myDataGeneralQueueStatus = [];
    this.teamDataPendedStatus = [];
    this.teamDataCompletedStatus = [];
    this.teamDataRoutedOutStatus = [];
    this.myDataGeneralQueueStatus = [];
    this.auditFailedData = [];
    this.routedOutData = [];
    this.routedInData = [];
    this.totalAuditFailed = 0;
    this.totalCompleted = 0;
    this.totalPended = 0;
    this.totalAssigned = 0;

    this.totalRoutedOut = 0;
    this.titleStatus = "";
    this.totalRoutedIn = 0;
    this.totalReview = 0;
    this.totalGeneralQueue = 0;
  }

  checkEmptyVal(value) {
    let isEmpty = true;
    if (value.length > 0) {
      value.map(val => {
        if (val.requestCount !== 0) {
          isEmpty = false;
        }
      });
    }
    return isEmpty;
  }

  getChartData(type, responseValue) {
    const dataStatusArray = [];
    this.totalConfiguredItems.forEach(val => {
      dataStatusArray.push({
        requestType: val,
        requestCount: 0
      });
    });
    this.mapResponseValue(responseValue, dataStatusArray, type);
  }

  mapResponseValue(responseValue, dataStatusArray, type) {
    if (dataStatusArray && dataStatusArray.length > 0) {
      dataStatusArray.forEach((value, index) => {
        if (responseValue && responseValue.length > 0) {
          responseValue.map(val => {
            const a = val.requestType;
            const b = value.requestType;
            if (b.localeCompare(a) === 0) {
              dataStatusArray[index].requestCount = val.requestCount;
            }
          });
        }
      });
    }
    dataStatusArray.map(val => {
      switch (type) {
        case "Completed":
          this.teamDataCompletedStatus.push([
            val.requestType,
            val.requestCount
          ]);
          this.totalCompleted = this.totalCompleted + val.requestCount;
          break;
        case "Pended":
          this.teamDataPendedStatus.push([val.requestType, val.requestCount]);
          this.totalPended = this.totalPended + val.requestCount;
          break;
        case "Assigned":
          this.teamDataAssignedStatus.push([val.requestType, val.requestCount]);
          this.totalAssigned = this.totalAssigned + val.requestCount;
          break;
        case "Routed In":
          this.myDataRoutedInStatus.push([val.requestType, val.requestCount]);
          this.totalRoutedIn = this.totalRoutedIn + val.requestCount;
          break;
        case "Routed Out":
          this.teamDataRoutedOutStatus.push([
            val.requestType,
            val.requestCount
          ]);
          this.totalRoutedOut = this.totalRoutedOut + val.requestCount;
          break;
        case "Audit Failed":
          this.teamDataAuditFailedStatus.push([
            val.requestType,
            val.requestCount
          ]);
          this.totalAuditFailed = this.totalAuditFailed + val.requestCount;
          break;
        case "Rebuttal Review":
          this.myDataRebuttalReviewStatus.push([
            val.requestType,
            val.requestCount
          ]);
          this.totalReview = this.totalReview + val.requestCount;
          break;
        case "General Queue":
          this.myDataGeneralQueueStatus.push([
            val.requestType,
            val.requestCount
          ]);
          this.totalGeneralQueue = this.totalGeneralQueue + val.requestCount;
          break;
        default:
          break;
      }
    });
  }

  setNoDataGeneralQueue() {
    this.myDataGeneralQueueStatus.push(["NO DATA", 1]);
    this.optionsGeneralQueue.pieSliceText = "none";
    this.optionsGeneralQueue.tooltip.text = "none";
  }

  setNoDataAssigned() {
    this.optionsAssigned.pieSliceText = "none";
    this.optionsAssigned.tooltip.text = "none";
    this.teamDataAssignedStatus.push(["NO DATA", 1]);
  }

  setNoDataPended() {
    this.teamDataPendedStatus.push(["NO DATA", 1]);
    this.optionsPended.pieSliceText = "none";
    this.optionsPended.tooltip.text = "none";
  }

  setNoDataCompleted() {
    this.teamDataCompletedStatus.push(["NO DATA", 1]);
    this.optionsCompleted.pieSliceText = "none";
    this.optionsCompleted.tooltip.text = "none";
  }

  setNoDataRoutedOut() {
    this.optionsRoutedOut.pieSliceText = "none";
    this.optionsRoutedOut.tooltip.text = "none";
    this.teamDataRoutedOutStatus.push(["NO DATA", 1]);
  }

  setNoDataAuditFailed() {
    this.teamDataAuditFailedStatus.push(["NO DATA", 1]);
    this.optionsAuditFailed.pieSliceText = "none";
    this.optionsAuditFailed.tooltip.text = "none";
  }

  setNoDataRoutedIn() {
    this.myDataRoutedInStatus.push(["NO DATA", 1]);
    this.optionsRoutedIn.pieSliceText = "none";
    this.optionsRoutedIn.tooltip.text = "none";
  }

  setNoDataReview() {
    this.myDataRebuttalReviewStatus.push(["NO DATA", 1]);
    this.optionsRebuttalReview.pieSliceText = "none";
    this.optionsRebuttalReview.tooltip.text = "none";
  }

  setGraphData(response) {
    response.map(value => {
      if (value.status === "General") {
        this.generalQueueData = value.workCategoryList;
        this.totalGeneralQueue = 0;
        if (
          value.workCategoryList.length > 0 &&
          !this.checkEmptyVal(value.workCategoryList)
        ) {
          this.getChartData("General Queue", value.workCategoryList);
          this.optionsGeneralQueue.pieSliceText = "value";
          this.optionsGeneralQueue.tooltip.text = "value";
        } else {
          this.setNoDataGeneralQueue();
        }
      } else if (value.status === "Assigned") {
        this.assignedData = value.workCategoryList;
        this.totalAssigned = 0;
        if (
          value.workCategoryList.length > 0 &&
          !this.checkEmptyVal(value.workCategoryList)
        ) {
          this.optionsAssigned.pieSliceText = "value";
          this.optionsAssigned.tooltip.text = "value";
          this.getChartData("Assigned", value.workCategoryList);
        } else {
          this.setNoDataAssigned();
        }
      } else if (value.status === "Pended") {
        this.pendedData = value.workCategoryList;
        this.totalPended = 0;
        if (
          value.workCategoryList.length > 0 &&
          !this.checkEmptyVal(value.workCategoryList)
        ) {
          this.optionsPended.pieSliceText = "value";
          this.optionsPended.tooltip.text = "value";
          this.getChartData("Pended", value.workCategoryList);
        } else {
          this.setNoDataPended();
        }
      } else if (value.status === "Completed") {
        this.completedData = value.workCategoryList;
        this.totalCompleted = 0;
        if (
          value.workCategoryList.length > 0 &&
          !this.checkEmptyVal(value.workCategoryList)
        ) {
          this.getChartData("Completed", value.workCategoryList);
          this.optionsCompleted.pieSliceText = "value";
          this.optionsCompleted.tooltip.text = "value";
        } else {
          this.setNoDataCompleted();
        }
      } else if (value.status === "Routed Out") {
        this.routedOutData = value.workCategoryList;
        this.totalRoutedOut = 0;
        if (
          value.workCategoryList.length > 0 &&
          !this.checkEmptyVal(value.workCategoryList)
        ) {
          this.optionsRoutedOut.pieSliceText = "value";
          this.optionsRoutedOut.tooltip.text = "value";
          this.getChartData("Routed Out", value.workCategoryList);
        } else {
          this.setNoDataRoutedOut();
        }
      } else if (value.status === "Audit Failed") {
        this.auditFailedData = value.workCategoryList;
        this.totalAuditFailed = 0;
        if (
          value.workCategoryList.length > 0 &&
          !this.checkEmptyVal(value.workCategoryList)
        ) {
          this.getChartData("Audit Failed", value.workCategoryList);
          this.optionsAuditFailed.pieSliceText = "value";
          this.optionsAuditFailed.tooltip.text = "value";
        } else {
          this.setNoDataAuditFailed();
        }
      } else if (value.status === "Routed In") {
        this.routedInData = value.workCategoryList;
        this.totalRoutedIn = 0;
        if (
          value.workCategoryList.length > 0 &&
          !this.checkEmptyVal(value.workCategoryList)
        ) {
          this.optionsRoutedIn.pieSliceText = "value";
          this.optionsRoutedIn.tooltip.text = "value";
          this.getChartData("Routed In", value.workCategoryList);
        } else {
          this.setNoDataRoutedIn();
        }
      } else if (value.status === "Rebuttal Review") {
        this.reviewData = value.workCategoryList;
        this.totalReview = 0;
        if (
          value.workCategoryList.length > 0 &&
          !this.checkEmptyVal(value.workCategoryList)
        ) {
          this.optionsRebuttalReview.pieSliceText = "value";
          this.optionsRebuttalReview.tooltip.text = "value";
          this.getChartData("Rebuttal Review", value.workCategoryList);
        } else {
          this.setNoDataReview();
        }
      } else {
        console.log("No Data");
      }
    });
  }

  setNoData() {
    this.setNoDataGeneralQueue();
    this.setNoDataAssigned();
    this.setNoDataPended();
    this.setNoDataCompleted();
    this.setNoDataRoutedOut();
    this.setNoDataAuditFailed();
    this.setNoDataRoutedIn();
    this.setNoDataReview();
  }

  getNoDataChart() {
    this.clearData();
    this.setNoData();
  }

  setToggleState(type) {
    this.myTeamTask = type === "Team" ? true : false;
  }

  setView(val) {
    this.view = val;
  }
}
