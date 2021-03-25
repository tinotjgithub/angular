import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { QualityScore } from "./../../../services/task-management/models/QualityScore";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

@Component({
  selector: "app-audit-score",
  templateUrl: "./audit-score.component.html"
})
export class AuditScoreComponent implements OnInit, OnDestroy {
  statusCountDtos: QualityScore;
  public enlargedDisplay = false;
  public isDataPresent = false;
  userAuditReportDto: any;
  public total = [];
  public hasData = false;
  private submittedAudit = false;
  private auditSubscription: Subscription = new Subscription();
  private reportSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public typeAudit = "PieChart";
  public columnNamesAudit = ["Status", "Count"];

  public optionsAudit = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 50,
      right: 50,
      top: 10,
      bottom: 1
    },
    colors: ["#4cc14f", "#ff5c5d"],
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
      position: "labeled",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    },
    pieHole: 0.4
  };

  public optionsAuditEnlarged = {
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
      bottom: 10
    },
    colors: ["#4cc14f", "#ff5c5d"],
    pieSliceText: "value",
    tooltip: { text: "value", trigger: "focus", showColorCode: true },
    legend: {
      position: "labeled",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 13
      }
    },
    pieHole: 0.5
  };
  public widthAudit = 450;
  public heightAudit = 235;
  public dataAudit = [];
  public isValid = true;
  public rangeError = false;
  public invalidDateError = false;
  public isAuditRendered = false;
  public auditDates: FormGroup;
  public maxDate = new Date();

  constructor(
    private fbAudit: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe
  ) {
    const maxDay = new Date();
    maxDay.setDate(maxDay.getDate() - 1);
    this.maxDate = maxDay;
    const thirtyDaysBefore = new Date();
    const yesterday = new Date();
    thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 31);
    yesterday.setDate(yesterday.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(thirtyDaysBefore);
    defaultDateRange.push(yesterday);
    this.auditDates = fbAudit.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.getAuditDays();
  }

  showDialog() {
    // this.optionsAudit.annotations.textStyle.fontSize = 14;
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.auditDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      this.isValid = diffInMonths > 6 ? false : true;
      this.rangeError = true;
      this.invalidDateError = false;
    } else {
      this.isValid = true;
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

  downloadExcel() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.auditDates.get("dateRange").value[0];
    this.taskManagementService.getAuditReport(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userAuditReportDto = this.taskManagementService.auditReportResponse;
    this.reportSubscription = this.taskManagementService
      .getAuditReportListner()
      .subscribe(data => {
        this.userAuditReportDto = data;
        this.downloadFile(this.userAuditReportDto);
        this.reportSubscription.unsubscribe();
      });
  }

  downloadFile(auditReport: any) {
    const responseBody = auditReport.body;
    const blob = new Blob([responseBody], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const today = new Date();
    const dateString = this.datePipe.transform(today, "MMddyyyy");
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(
        blob,
        "My_Quality_Score" + dateString + ".xlsx"
      );
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          "My_Quality_Score" + dateString + ".xlsx"
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  getAuditChartNoValue() {
    this.isDataPresent = false;
    this.dataAudit = [];
    this.optionsAudit.tooltip.trigger = "none";
    this.optionsAuditEnlarged.tooltip.trigger = "none";
    this.optionsAudit.legend.position = "none";
    this.optionsAuditEnlarged.legend.position = "none";
    this.dataAudit.push(["NO DATA", 1]);
    this.total = ["0"];
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.pieSliceText = "value";
    this.optionsAudit.tooltip.text = "value";
    this.optionsAuditEnlarged.tooltip.text = "value";
    this.optionsAudit.legend.position = "labeled";
    this.optionsAuditEnlarged.legend.position = "labeled";
    let responseValue = [];
    this.total = (
      "" + Number(Number(this.statusCountDtos.auditCompletedCount))
    ).split("");
    responseValue = this.statusCountDtos.statusCountDtos;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "PASSED",
        count: 0
      },
      {
        status: "FAILED",
        count: 0
      }
    );
    this.mapResponseValue(responseValue, dataStatusArray);
  }

  mapResponseValue(responseValue, dataStatusArray) {
    responseValue.map(val => {
      if (val.status === "PASSED") {
        dataStatusArray[0].count = val.count;
      } else if (val.status === "FAILED") {
        dataStatusArray[1].count = val.count;
      }
    });
    dataStatusArray.map(val => {
      this.dataAudit.push([val.status, val.count]);
    });
  }

  getToDateValue() {
    const toDateValue =
      this.auditDates.get("dateRange").value[1] !== null &&
      this.auditDates.get("dateRange").value[1] !== "" &&
      this.auditDates.get("dateRange").value[1] !== undefined
        ? this.auditDates.get("dateRange").value[1]
        : this.auditDates.get("dateRange").value[0];
    return toDateValue;
  }

  getAuditDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.auditDates.get("dateRange").value[0];
    this.taskManagementService.getAuditScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.statusCountDtos = this.taskManagementService.auditScoreResponse;
    this.statusCountDtos = null;
    this.auditSubscription = this.taskManagementService
      .getAuditScoresListner()
      .subscribe((data: QualityScore) => {
        this.statusCountDtos = data;
        this.dataAudit = [];
        if (
          this.statusCountDtos &&
          this.statusCountDtos.statusCountDtos.length > 0
        ) {
          this.hasData = true;
          this.getAuditChartValue();
        } else {
          this.hasData = false;
          this.getAuditChartNoValue();
        }
        this.auditSubscription.unsubscribe();
      });
    if (this.statusCountDtos === null || this.statusCountDtos === undefined) {
      this.getAuditChartNoValue();
      this.hasData = false;
    }
    this.isAuditRendered = true;
  }

  onSubmitAudit() {
    this.submittedAudit = true;
    this.getAuditDays();
  }

  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
