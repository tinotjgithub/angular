import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-manager-claims-examiner-count-by-lead",
  templateUrl: "./manager-claims-examiner-count-by-lead.component.html"
})
export class ClaimsExaminerCountByLeadComponent
  implements OnInit, OnDestroy, AfterViewInit {
  examinerCount: any;
  enlargedDisplay = false;
  private userExaminerCountReportDto: any;
  submittedExaminerCount = false;
  private ageSubscription: Subscription = new Subscription();
  private reportSubscription: Subscription = new Subscription();
  private leadSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  public titleExaminerCount = "";
  public statusList = [];
  public isDataPresent = false;
  public typeExaminerCount = "BarChart";
  // stackedBar-Manager-1
  public columnNamesExaminerCount = [
    "",
    "Claims Examiner Count",
    { role: "annotation" }
  ];
  public optionsExaminerCount = {
    height: 200,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal",
        fontSize: 12
      }
    },
    colors: ["#2c699d"],
    hAxis: {
      format: "0",
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 11,
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
      width: 50,
      left: 130,
      right: 30,
      top: 17,
      bottom: 30
    },
    annotations: {
      textStyle: {
        fontSize: 11,
        textPosition: "Horizontal"
      },
      Vertical: true
    },
    legend: {
      position: "none",
      width: "50%",
      textStyle: { fontSize: 12 }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };

  public optionsExaminerCountEnlarged = {
    height: 430,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    colors: ["#2c699d"],
    hAxis: {
      format: "0",
      title: "",
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    annotations: {
      textStyle: {
        fontSize: 13,
        textPosition: "Horizontal"
      },
      Vertical: true
    },
    vAxis: {
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
      left: 270,
      right: 55,
      top: 25,
      bottom: 30
    },
    legend: {
      position: "top",
      width: "50%",
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
    }
  };

  public widthExaminerCount = 430;
  public heightExaminerCount = 250;
  public dataExaminerCount = [];
  public isExaminerCountRendered = false;
  public countByExaminerCountGroup: FormGroup;
  public maxDate = new Date();
  status: any[];
  statusArray: any[];
  public barDetails: { type: any; value: any; leadName: any };
  public cols: any;
  public detailsView: boolean;
  public chartDetail: any[];

  constructor(
    private fbExaminerCount: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe,
    private chartService: ChartDetailService,
    private notifierService: NotifierService
  ) {
    const today = new Date();
    const todaysDate = new Date(this.datePipe.transform(today, "yyyy-MM-dd"));
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const defaultDateRange = [];
    const defaultFrom = new Date("01-01-1970");
    defaultDateRange.push(defaultFrom);
    defaultDateRange.push(todaysDate);
    this.countByExaminerCountGroup = fbExaminerCount.group({
      dateRange: [defaultDateRange, Validators.required],
      status: ["", Validators.required]
    });
  }

  get getDateRange() {
    return this.countByExaminerCountGroup.controls.dateRange;
  }

  get getStatus() {
    return this.countByExaminerCountGroup.controls.status;
  }

  ngOnInit() {
    this.setActiveInactiveStatus();
    this.getExaminerCount();
    this.onSubmitExaminerCount();
  }

  ngAfterViewInit() {}

  setActiveInactiveStatus() {
    this.statusList = [];
    this.statusList.push(
      {
        value: "A",
        label: "Active"
      },
      { value: "I", label: "Inactive" }
    );
    this.countByExaminerCountGroup.get("status").setValue("A");
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.countByExaminerCountGroup.get("dateRange").value;

    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      this.onSubmitExaminerCount();
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

  getExaminerCountChartNoValue() {
    this.isDataPresent = false;
    this.dataExaminerCount = [];
    this.optionsExaminerCount.legend.position = "none";
    this.optionsExaminerCount.tooltip.trigger = "none";
    this.optionsExaminerCountEnlarged.legend.position = "none";
    this.optionsExaminerCountEnlarged.tooltip.trigger = "none";
    this.dataExaminerCount.push(["NO DATA", 0, "0"]);
  }

  getExaminerCountChartValue() {
    this.isDataPresent = true;
    this.dataExaminerCount = [];
    this.optionsExaminerCount.legend.position = "top";
    this.optionsExaminerCount.tooltip.trigger = "focus";
    this.optionsExaminerCountEnlarged.legend.position = "top";
    this.optionsExaminerCountEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.examinerCount;
    if (responseValue !== null && responseValue.length !== 0) {
      responseValue.forEach(val => {
        this.dataExaminerCount.push([val.lead, val.count, val.count]);
      });
      this.setManagerChartOptions();
    } else {
      this.getExaminerCountChartNoValue();
    }
  }

  setManagerChartOptions() {
    const statusLength = this.dataExaminerCount.length;
    const newHeightEnlarged = statusLength > 4 ? statusLength * 90 : 430;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 430 ? newHeightEnlarged : 430;
    const newHeight = statusLength > 4 ? statusLength * 50 : 200;
    this.optionsExaminerCountEnlarged.height = newGeneratedHeightEnlarged;
    this.optionsExaminerCount.height = newHeight;
  }

  getToDateValue() {
    const toDateValue =
      this.countByExaminerCountGroup.get("dateRange").value[1] !== null &&
      this.countByExaminerCountGroup.get("dateRange").value[1] !== "" &&
      this.countByExaminerCountGroup.get("dateRange").value[1] !== undefined
        ? this.countByExaminerCountGroup.get("dateRange").value[1]
        : this.countByExaminerCountGroup.get("dateRange").value[0];
    return toDateValue;
  }

  getExaminerCount() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByExaminerCountGroup.get("dateRange")
      .value[0];
    const sts = this.countByExaminerCountGroup.get("status").value;
    this.taskManagementService.getExaminerCount(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      sts
    );
    this.examinerCount = this.taskManagementService.examinerCountResponse;
    this.examinerCount = null;
    this.ageSubscription = this.taskManagementService
      .getExaminerCountListner()
      .subscribe((data: any) => {
        this.examinerCount = data;
        this.dataExaminerCount = [];
        this.examinerCount.length > 0
          ? this.getExaminerCountChartValue()
          : this.getExaminerCountChartNoValue();
        this.ageSubscription.unsubscribe();
      });
    if (this.examinerCount === null) {
      this.getExaminerCountChartNoValue();
    }
    this.optionsExaminerCount.colors = sts === "A" ? ["#2c699d"] : ["#f48d2c"];
    this.optionsExaminerCountEnlarged.colors =
      sts === "A" ? ["#2c699d"] : ["#f48d2c"];
    this.isExaminerCountRendered = true;
  }

  onSubmitExaminerCount() {
    if (this.countByExaminerCountGroup.invalid) {
      return;
    }
    this.submittedExaminerCount = true;
    this.getExaminerCount();
  }

  private constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByExaminerCountGroup.get("dateRange")
      .value[0];
    const filteredLead = this.examinerCount.filter(
      e => e.lead === this.barDetails.leadName
    )[0];
    const payload = {
      fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      status: this.countByExaminerCountGroup.get("status").value,
      leadId: filteredLead.id,
      leadName: this.barDetails.leadName
    };
    return payload;
  }

  selectBar(bar) {
    this.barDetails = this.getBarDetails(bar[0]);
    console.log(bar, this.barDetails);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns(this.barDetails.type);
      this.chartDetail = [];
      this.chartService
        .examinersUnderLeadDetails(this.constructPayload())
        .subscribe(res => {
          this.chartDetail = res || [];
        });
      this.detailsView = true;
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.dataExaminerCount[bar.row];
    const barDetails = {
      type: this.columnNamesExaminerCount[bar.column],
      value: barValue[bar.column],
      leadName: barValue[0]
    };
    return barDetails;
  }

  setColumns(type) {
    const cols = [
      { header: "Examiner Name", field: "examinerName" },
      { header: "User Name", field: "userName" },
      { header: "Lead Name", field: "leadName" },
      { header: "Status", field: "status" },
      { header: "Proficiency", field: "proficiency" }
    ];
    return cols;
  }

  downloadExcel() {
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    this.chartService
      .examinersUnderLeadExcel(this.constructPayload())
      .subscribe(res => {
        this.notifierService.throwNotification({
          type: "success",
          message: "Report is generated."
        });
        const responseBody = res.body;
        const blob = new Blob([responseBody], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const today = new Date();
        const dateString = this.datePipe.transform(today, "MMddyyyy");
        const fileName = `Examiners under Lead-${dateString}`;
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }

  ngOnDestroy() {
    this.ageSubscription.unsubscribe();
  }
}
