import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { FinancialScore } from "src/app/services/task-management/models/FinancialScore";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-financial-score",
  templateUrl: "./financial-score.component.html"
})
export class FinancialScoreComponent implements OnInit, OnDestroy {
  financialAccuracyDtos: FinancialScore;
  private reportSubscription: Subscription = new Subscription();
  private financialSubscription: Subscription = new Subscription();
  private userStatusReportDto: any;
  enlargedDisplay = false;
  public financialGroup: FormGroup;
  public isMyFinRendered = false;
  public myDataFinance = [];
  public isDataPresent = false;
  public maxDate = new Date();
  public isValid = true;
  public myTitleFinance = "";
  public myTypeFinance = "LineChart";
  public myColumnNamesFinance = [
    "",
    "Financial Score (%)",
    { role: "annotation" },
    "Target (%)",
    { role: "annotation" }
  ];
  public myWidthFinance = 520;
  public myHeightFinance = 225;
  public myOptionsFinance = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    colors: ["#e19b0e", "#b84066"],
    hAxis: {
      title: "",
      type: "string",
      textStyle: {
        fontSize: 12
      }
    },
    vAxis: {
      minValue: 0,
      title: "",
      format: "#'%'",
      viewWindowMode: "explicit",
      viewWindow: {
        max: 100,
        min: 70
      },
      gridlines: {
        count: 3
      },
      textStyle: {
        fontSize: 12
      }
    },

    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    },
    chartArea: {
      left: 35,
      right: 10,
      top: 20,
      bottom: 20
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    pointSize: 5,
    annotations: {
      textStyle: {
        fontSize: 10
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
            length: 16
          }
        }
      }
    }
  };

  constructor(
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe,
    public fbFinance: FormBuilder
  ) {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(prevDate.getMonth() - 3)
    );
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    this.financialGroup = fbFinance.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getFinanceDays();
  }

  showDialog() {
    this.myOptionsFinance.annotations.textStyle.fontSize = 13;
    this.enlargedDisplay = true;
  }

  getMyFinanceNoChartValue() {
    this.isDataPresent = false;
    this.myDataFinance = [];
    this.myOptionsFinance.legend.position = "none";
    this.myOptionsFinance.tooltip.trigger = "none";
    this.myDataFinance.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getMyFinanceChartValue() {
    this.isDataPresent = true;
    this.myDataFinance = [];
    this.myOptionsFinance.legend.position = "top";
    this.myOptionsFinance.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.financialAccuracyDtos.financialAccuracyDtos;
    if (responseValue !== null && responseValue.length !== 0) {
      let min = 100;
      let targetMin = 100;
      responseValue.forEach(val => {
        const claims = val.financialAccuracy.toFixed(2);
        const target = val.target.toFixed(2);
        min = Number(claims) < min ? Number(claims) : min;
        targetMin = Number(target) < target ? Number(target) : targetMin;
        this.myDataFinance.push([
          this.datePipe.transform(val.monthStartDate, "MMM`yy"),
          parseFloat(claims),
          parseFloat(claims),
          parseFloat(target),
          parseFloat(target)
        ]);
      });
      const minValue = min < targetMin ? min - 10 : targetMin - 10;
      this.myOptionsFinance.vAxis.viewWindow.min = minValue;
    } else {
      this.getMyFinanceNoChartValue();
    }
  }

  getNoOfmonths(date1, date2) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth() + 1;
    months += date2.getMonth() + 1;
    return months <= 0 ? 0 : months;
  }

  validateDates() {
    const fromDateValue = this.financialGroup.get("dateRange").value;
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

  getToDateValue() {
    const toDateValue =
      this.financialGroup.get("dateRange").value[1] !== null &&
      this.financialGroup.get("dateRange").value[1] !== "" &&
      this.financialGroup.get("dateRange").value[1] !== undefined
        ? this.financialGroup.get("dateRange").value[1]
        : this.financialGroup.get("dateRange").value[0];
    return toDateValue;
  }

  downloadExcel() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.financialGroup.get("dateRange").value[0];
    this.taskManagementService.getFinanceReport(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userStatusReportDto = this.taskManagementService.statusReportResponse;
    this.reportSubscription = this.taskManagementService
      .getFinanceReportListner()
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
        "My_Financial_Score" + dateString + ".xlsx"
      );
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          "My_Financial_Score" + dateString + ".xlsx"
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  getFinanceDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.financialGroup.get("dateRange").value[0];
    this.taskManagementService.getMyFinScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.financialAccuracyDtos = this.taskManagementService.myfinScoreResponse;
    this.financialAccuracyDtos = null;
    this.financialSubscription = this.taskManagementService
      .getMyFinScoresListner()
      .subscribe((data: FinancialScore) => {
        this.financialAccuracyDtos = data;
        this.myDataFinance = [];
        this.financialAccuracyDtos &&
        this.financialAccuracyDtos.financialAccuracyDtos.length > 0
          ? this.getMyFinanceChartValue()
          : this.getMyFinanceNoChartValue();
        this.financialSubscription.unsubscribe();
      });
    if (this.financialAccuracyDtos === null) {
      this.getMyFinanceNoChartValue();
    }
    this.isMyFinRendered = true;
  }

  onSubmitMyFinance() {
    this.getFinanceDays();
  }

  ngOnDestroy() {
    this.financialSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
