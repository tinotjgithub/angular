import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

@Component({
  selector: "app-audit-failed-vs-rebuttal-accepted",
  templateUrl: "./audit-failed-vs-rebuttal-accepted.component.html"
})
export class AuditFailedVsRebuttalAcceptedComponent
  implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  statusSubscription: Subscription = new Subscription();
  auditStatusCountDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public typeStatus = "PieChart";
  public isValid = true;
  public maxDate = new Date();
  public statusDates: FormGroup;
  public dataStatus = [];
  public isStatusRendered = false;
  public widthStatus = 400;
  public heightStatus = 225;
  public isDataPresent = false;
  public myColumnNamesStatus = ["Rebuttal Failed", "Rebuttal Accepted"];

  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 20,
      right: 20,
      top: 17,
      bottom: 1
    },
    colors: ["#ff5c5d", "#00aadf"],
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
      position: "top",
      alignment: "center",
      width: "50%",
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
      top: 20,
      bottom: 10
    },
    colors: ["#ff5c5d", "#00aadf"],
    pieSliceText: "value",
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true
    },
    legend: {
      alignment: "center",
      position: "top",
      width: "50%"
    }
  };

  constructor(
    private fbStatus: FormBuilder,
    private taskmanagementService: TaskmanagementService,
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
    this.statusDates = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.getStatusDays();
  }

  showDialog() {
    this.displayEnlarged = true;
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
    this.optionsStatus.pieSliceText = "value";
    this.optionsStatus.tooltip.text = "value";
    this.optionsStatus.legend.position = "top";
    this.optionsStatusEnlarged.pieSliceText = "value";
    this.optionsStatusEnlarged.tooltip.text = "value";
    this.optionsStatusEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue = this.auditStatusCountDto.auditStatusCountDtos;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "Rebuttal Failed",
        claimCount: 0
      },
      {
        status: "Rebuttal Accepted",
        claimCount: 0
      }
    );
    this.mapResponseValue(responseValue, dataStatusArray);
  }

  mapResponseValue(responseValue, dataStatusArray) {
    responseValue.map(val => {
      if (val.status === "Rebuttal Failed") {
        dataStatusArray[0].claimCount = val.claimCount;
      } else if (val.status === "Rebuttal Accepted") {
        dataStatusArray[1].claimCount = val.claimCount;
      }
    });
    dataStatusArray.map(val => {
      this.dataStatus.push([val.status, val.claimCount]);
    });
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
      this.isValid = diffInMonths > 6 ? false : true;
    } else {
      this.isValid = true;
    }
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
    this.getStatusDays();
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.statusDates.get("dateRange").value[0];
    this.taskmanagementService.getAuditFailedRebuttalAccepted(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.auditStatusCountDto = this.taskmanagementService.auditFailedRebuttalAcceptedResponse;
    this.auditStatusCountDto = null;
    this.statusSubscription = this.taskmanagementService
      .getAuditFailedRebuttalAcceptedListner()
      .subscribe((data: any) => {
        this.auditStatusCountDto = data;
        this.dataStatus = [];
        this.auditStatusCountDto &&
        this.auditStatusCountDto.auditStatusCountDtos.length > 0
          ? this.getDataChart()
          : this.getNoDataChart();
        this.statusSubscription.unsubscribe();
      });
    if (
      this.auditStatusCountDto === null ||
      this.auditStatusCountDto === undefined
    ) {
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  downloadExcel() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.statusDates.get("dateRange").value[0];
    this.taskmanagementService.getAuditFailedRebuttalReport(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userStatusReportDto = this.taskmanagementService.statusReportResponse;
    this.reportSubscription = this.taskmanagementService
      .getAuditFailedRebuttalReportListner()
      .subscribe(data => {
        this.userStatusReportDto = data;
        this.downloadFile(this.userStatusReportDto);
        this.reportSubscription.unsubscribe();
      });
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
        "Rebuttal_Summary" + dateString + ".xlsx"
      );
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          "Rebuttal_Summary" + dateString + ".xlsx"
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
