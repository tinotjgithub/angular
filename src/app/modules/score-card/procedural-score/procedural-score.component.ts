import { Component, OnInit, OnDestroy } from "@angular/core";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { ProceduralScore } from "./../../../services/task-management/models/ProceduralScore";
import { Subscription } from "rxjs";

@Component({
  selector: "app-procedural-score",
  templateUrl: "./procedural-score.component.html"
})
export class ProceduralScoreComponent implements OnInit, OnDestroy {
  userMyProcedureDto: ProceduralScore;
  procedureReportDto: any;
  private previousDate: Date;
  public isDataPresent = false;
  private threeMonthsBeforeDate: Date;
  private reportSubscription: Subscription = new Subscription();
  public procedureGroup: FormGroup;
  public isMyProcRendered = false;
  public mydataprocedure: any;
  public enlargedDisplay = false;
  public maxDate = new Date();
  public isValid = true;
  public isRequired = false;
  public yearRange = "2000" + ":" + new Date().getFullYear();
  // Procedure chart
  public mywidthprocedure = 520;
  public myheightprocedure = 225;
  public myprocedureType = "LineChart";
  public mytitleprocedure = "";
  public mytypeprocedure = "LineChart";
  public mycolumnNamesprocedure = [
    "",
    "Procedural Score (%)",
    { role: "annotation" },
    "Target (%)",
    { role: "annotation" }
  ];
  public myoptionsprocedure = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
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
    colors: ["#058ba3", "#b84066"],
    hAxis: {
      textStyle: {
        fontSize: 12
      },
      title: "",
      type: "string"
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
    public datePipe: DatePipe,
    fbproc: FormBuilder,
    private taskManagementService: TaskmanagementService
  ) {
    const today = new Date();
    const previousDate = new Date(new Date().setDate(today.getDate() - 1));
    this.previousDate = previousDate;
    const prevDate = new Date(previousDate);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(previousDate.getMonth() - 3)
    );
    this.threeMonthsBeforeDate = threeMonthsBefore;
    this.maxDate = today;
    this.procedureGroup = fbproc.group({
      dateRange: [[threeMonthsBefore, previousDate], Validators.required]
    });
  }

  showDialog() {
    this.myoptionsprocedure.annotations.textStyle.fontSize = 13;
    this.enlargedDisplay = true;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getProcedauralData(this.threeMonthsBeforeDate, this.previousDate);
  }

  getMyProcedureNoChartValue() {
    this.isDataPresent = false;
    this.mydataprocedure = [];
    this.myoptionsprocedure.legend.position = "none";
    this.myoptionsprocedure.tooltip.trigger = "none";
    this.mydataprocedure.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getMyProcedureChartValue(procedure: any) {
    this.isDataPresent = true;
    this.mydataprocedure = [];
    this.myoptionsprocedure.legend.position = "top";
    this.myoptionsprocedure.tooltip.trigger = "focus";
    this.mydataprocedure = [];
    let responseValue = [];
    responseValue = procedure.proceduralAccuracyDtoList;
    if (responseValue !== null && responseValue.length !== 0) {
      let min = 100;
      let targetMin = 100;
      for (const proc of responseValue) {
        const proceduralAccuracyPct = proc.proceduralAccuracyPct * 100;
        const target = proc.target * 100;
        min =
          Number(proceduralAccuracyPct.toFixed(2)) < min
            ? Number(proceduralAccuracyPct.toFixed(2))
            : min;
        targetMin =
          Number(target.toFixed(2)) < target
            ? Number(target.toFixed(2))
            : targetMin;
        this.mydataprocedure.push([
          this.datePipe.transform(proc.monthStartDate, "MMM`yy"),
          parseFloat(proceduralAccuracyPct.toFixed(2)),
          parseFloat(proceduralAccuracyPct.toFixed(2)),
          parseFloat(target.toFixed(2)),
          parseFloat(target.toFixed(2))
        ]);
      }
      const minValue = min < targetMin ? min - 10 : targetMin - 10;
      this.myoptionsprocedure.vAxis.viewWindow.min = minValue;
    } else {
      this.getMyProcedureNoChartValue();
    }
  }

  getToDateValue(fromDate, toDate) {
    const toDateValue =
      toDate !== null && toDate !== "" && toDate !== undefined
        ? toDate
        : fromDate;
    return toDateValue;
  }

  downloadExcel() {
    const formValue = this.procedureGroup.get("dateRange");
    const fromDate: Date = formValue.value[0];
    const toDate: Date = formValue.value[1];
    const toDateValue = this.getToDateValue(fromDate, toDate);
    const fromDateValue = this.procedureGroup.get("dateRange").value[0];
    this.taskManagementService.getProcReport(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.procedureReportDto = this.taskManagementService.procReportResponse;
    this.reportSubscription = this.taskManagementService
      .getProcReportListner()
      .subscribe(data => {
        this.procedureReportDto = data;
        this.downloadFile(this.procedureReportDto);
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
        "My_Procedural_Score" + dateString + ".xlsx"
      );
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          "My_Procedural_Score" + dateString + ".xlsx"
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  onSubmitMyProcedure() {
    const formValue = this.procedureGroup.get("dateRange");
    const fromDate: Date = formValue.value[0];
    const toDate: Date = formValue.value[1];
    this.getProcedauralData(fromDate, toDate);
  }

  getProcedauralData(fromDate: Date, toDate: Date) {
    const toDateValue = this.getToDateValue(fromDate, toDate);
    this.taskManagementService.getMyProcScores(
      this.datePipe.transform(fromDate, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userMyProcedureDto = this.taskManagementService.myprocScoreResponse;
    this.userMyProcedureDto = null;
    this.taskManagementService
      .getMyProcScoresListner()
      .subscribe((data: ProceduralScore) => {
        if (data && data.proceduralAccuracyDtoList.length > 0) {
          this.userMyProcedureDto = data;
          this.mydataprocedure = [];
          this.getMyProcedureChartValue(this.userMyProcedureDto);
        } else {
          this.getMyProcedureNoChartValue();
        }
      });
    if (this.userMyProcedureDto === null) {
      this.getMyProcedureNoChartValue();
    }
    this.isMyProcRendered = true;
  }

  validate() {
    const fromDateValue =
      this.procedureGroup.get("dateRange").value &&
      this.procedureGroup.get("dateRange").value[0];
    const toDateValue =
      this.procedureGroup.get("dateRange").value &&
      this.procedureGroup.get("dateRange").value[1];
    if (fromDateValue && toDateValue) {
      const diffInMonths = this.getMonths(fromDateValue, toDateValue);
      this.isValid = diffInMonths > 6 ? false : true;
    } else {
      this.isValid = true;
    }
  }
  getMonths(fromDateValue, toDateValue) {
    const date1 = new Date(fromDateValue);
    const date2 = new Date(toDateValue);
    const diffInMonths =
      (date2.getFullYear() - date1.getFullYear()) * 12 +
      (date2.getMonth() - date1.getMonth());
    return diffInMonths;
  }

  ngOnDestroy() {
    this.reportSubscription.unsubscribe();
  }
}
