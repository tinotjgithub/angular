import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { MultiSelect } from "primeng/multiselect";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { NotifierService } from "src/app/services/notifier.service";
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";

@Component({
  selector: "app-lead-claims-count-by-status-queue",
  templateUrl: "./lead-claims-count-by-status-queue.component.html"
})
export class LeadClaimsCountByStatusQueueComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MultiSelect, { static: false })
  select: MultiSelect;
  leadStatusScoreDto: any;
  enlargedDisplay = false;
  private userStatusReportDto: any;
  private submittedStatus = false;
  public isDataPresent = false;
  private statusSubscription: Subscription = new Subscription();
  private reportSubscription: Subscription = new Subscription();
  private queueSubscription: Subscription = new Subscription();
  public titleStatus = "";
  public queueList = [];
  public typeStatus = "BarChart";
  public columnNamesStatus = [
    "",
    "Complete",
    { role: "annotation" },
    "Pended",
    { role: "annotation" },
    "Assigned",
    { role: "annotation" },
    "Unassigned",
    { role: "annotation" }
    // { type: "number", role: "annotation" }
  ];
  public optionsStatus = {
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
    colors: ["#4cc14f", "#ff5c5d", "#ff9226", "#645ba1"],
    hAxis: {
      format: "0",
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
      width: "100%",
      left: 200,
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
    }
    // isStacked: true
  };

  public optionsStatusEnlarged = {
    height: 400,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#ff9226", "#645ba1"],
    hAxis: {
      format: "0",
      minValue: 0,
      title: "",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
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
        fontSize: 13,
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
    // isStacked: true
  };
  public widthStatus = 600;
  public heightStatus = 150;
  public dataStatus = [];
  public isStatusRendered = false;
  public countByStatusGroup: FormGroup;
  public maxDate = new Date();
  queue: any[];
  queueArray: any[];
  public detailsView: boolean;
  public barDetails: any;
  public cols: any[];
  public chartDetails: any[];

  get getDateRange() {
    return this.countByStatusGroup.controls.dateRange;
  }

  get getQueue() {
    return this.countByStatusGroup.controls.queueName;
  }
  constructor(
    private fbStatus: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe,
    private authService: AuthenticationService,
    private chartService: ChartDetailService,
    private notifierService: NotifierService
  ) {
    const currentDate = new Date();
    const sixMonthsBefore = new Date(
      currentDate.setMonth(currentDate.getMonth() - 6)
    );
    const todaysDate = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(sixMonthsBefore);
    defaultDateRange.push(todaysDate);

    this.countByStatusGroup = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required],
      queueName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getLeadQueueNames();
    this.onSubmitStatus();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  getLeadQueueNames() {
    this.queue = [];
    const userID = this.authService.currentUserDetails;
    const leadId = userID ? userID.id : "";
    this.taskManagementService.getLeadQueueNames(leadId);
    this.queue = this.taskManagementService.leadQueueNamesResponse;
    this.queueSubscription = this.taskManagementService
      .getLeadQueueNamesListner()
      .subscribe(data => {
        this.queue = data;
        this.mapQueueNames();
        this.queueSubscription.unsubscribe();
      });
  }
  mapQueueNames() {
    if (this.queue && this.queue.length > 0) {
      this.queue.forEach(s => {
        this.queueList.push({
          label: s.queueName,
          value: { id: s.queueId, name: s.queueName, code: s.queueName }
        });
      });
    }
    const selectedScopes = [];
    this.queueList.forEach(item => selectedScopes.push(item.value));
    this.countByStatusGroup.get("queueName").setValue(selectedScopes);
    this.getStatusDays();
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.countByStatusGroup.get("dateRange").value;

    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      const isValid = diffInMonths > 6 ? false : true;
      if (!isValid) {
        this.countByStatusGroup.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.countByStatusGroup.updateValueAndValidity();
      } else {
        this.countByStatusGroup.controls.dateRange.setErrors(null);
        this.countByStatusGroup.updateValueAndValidity();
        this.onSubmitStatus();
      }
    } else {
      this.countByStatusGroup.controls.dateRange.setErrors(null);
      this.countByStatusGroup.updateValueAndValidity();
      this.onSubmitStatus();
    }
  }

  validateQueue() {
    this.updateMultiSelectLabels();
    this.onSubmitStatus();
  }

  updateMultiSelectLabels() {
    this.select.updateLabel = function() {
      const label =
        this.value.length === 1
          ? this.value.length.toString() + " Queue Selected"
          : this.value.length.toString() + " Queues Selected";
      this.valuesAsString = label;
    };
  }

  getStatusChartNoValue() {
    this.isDataPresent = false;
    this.dataStatus = [];
    this.optionsStatus.legend.position = "none";
    this.optionsStatusEnlarged.tooltip.trigger = "none";
    this.optionsStatusEnlarged.legend.position = "none";
    this.optionsStatus.tooltip.trigger = "none";
    this.dataStatus.push(["NO DATA", 0, "0", 0, "0", 0, "0", 0, "0", 0]);
  }

  parseResponseValue(responseValue) {
    const responseValueLength = responseValue.length;
    let parsedResponseValue = [];
    for (let i = 0; i < responseValueLength; i++) {
      parsedResponseValue.push({
        leadStatusScoreDto: {
          Completed: 0,
          Pended: 0,
          Assigned: 0,
          ToDo: 0,
          quename: ""
        }
      });
    }
    parsedResponseValue = this.mapParsedResponseValue(
      responseValue,
      parsedResponseValue
    );
    return parsedResponseValue;
  }

  mapParsedResponseValue(responseValue, parsedResponseValue) {
    responseValue.forEach((val, index) => {
      if (val.leadStatusScoreDto.hasOwnProperty("Completed")) {
        parsedResponseValue[index].leadStatusScoreDto.Completed =
          val.leadStatusScoreDto.Completed;
      }
      if (val.leadStatusScoreDto.hasOwnProperty("Pended")) {
        parsedResponseValue[index].leadStatusScoreDto.Pended =
          val.leadStatusScoreDto.Pended;
      }
      if (val.leadStatusScoreDto.hasOwnProperty("Assigned")) {
        parsedResponseValue[index].leadStatusScoreDto.Assigned =
          val.leadStatusScoreDto.Assigned;
      }
      if (val.leadStatusScoreDto.hasOwnProperty("ToDo")) {
        parsedResponseValue[index].leadStatusScoreDto.ToDo =
          val.leadStatusScoreDto.ToDo;
      }
      if (val.leadStatusScoreDto.hasOwnProperty("quename")) {
        parsedResponseValue[index].leadStatusScoreDto.quename =
          val.leadStatusScoreDto.quename;
      }
    });
    return parsedResponseValue;
  }

  getStatusChartValue(leadStatusScoreDto) {
    this.isDataPresent = true;
    this.dataStatus = [];
    this.optionsStatus.legend.position = "top";
    this.optionsStatus.tooltip.trigger = "focus";
    this.optionsStatusEnlarged.legend.position = "top";
    this.optionsStatusEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = leadStatusScoreDto;
    if (
      responseValue &&
      responseValue !== null &&
      responseValue !== undefined &&
      responseValue.length > 0
    ) {
      const parsedResponseValue = this.parseResponseValue(responseValue);
      parsedResponseValue.forEach(val => {
        this.dataStatus.push([
          val.leadStatusScoreDto.quename,
          val.leadStatusScoreDto.Completed,
          val.leadStatusScoreDto.Completed,
          val.leadStatusScoreDto.Pended,
          val.leadStatusScoreDto.Pended,
          val.leadStatusScoreDto.Assigned,
          val.leadStatusScoreDto.Assigned,
          val.leadStatusScoreDto.ToDo,
          val.leadStatusScoreDto.ToDo
          // val.leadStatusScoreDto.Completed +
          //   val.leadStatusScoreDto.Pended +
          //   val.leadStatusScoreDto.Assigned +
          //   val.leadStatusScoreDto.ToDo
        ]);
      });
      this.setLeadChartOptions();
    } else {
      this.getStatusChartNoValue();
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

  setLeadChartOptions() {
    const statusLength = this.dataStatus.length;
    const newHeightEnlarged = statusLength > 4 ? statusLength * 90 : 400;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 400 ? newHeightEnlarged : 400;
    const newHeight = statusLength > 4 ? statusLength * 30 : 150;
    const newGeneratedHeight = newHeight > 190 ? newHeight : 150;
    this.optionsStatusEnlarged.height = newGeneratedHeightEnlarged;
    this.optionsStatus.height = newGeneratedHeight;
  }

  getToDateValue() {
    const toDateValue =
      this.countByStatusGroup.get("dateRange").value[1] !== null &&
      this.countByStatusGroup.get("dateRange").value[1] !== "" &&
      this.countByStatusGroup.get("dateRange").value[1] !== undefined
        ? this.countByStatusGroup.get("dateRange").value[1]
        : this.countByStatusGroup.get("dateRange").value[0];
    return toDateValue;
  }

  mapQueueNameList(queueName) {
    this.queueArray = [];
    if (
      queueName &&
      queueName !== undefined &&
      queueName !== "" &&
      queueName !== null &&
      queueName.length > 0
    ) {
      queueName.forEach(q => {
        this.queueArray.push(q.name);
      });
    }
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByStatusGroup.get("dateRange").value[0];
    this.mapQueueNameList(this.countByStatusGroup.get("queueName").value);
    this.taskManagementService.getLeadStatusScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.queueArray
    );
    this.leadStatusScoreDto = this.taskManagementService.leadStatusScoreResponse;
    this.leadStatusScoreDto = null;
    this.statusSubscription = this.taskManagementService
      .getLeadStatusScoresListner()
      .subscribe((data: any) => {
        this.leadStatusScoreDto = data;
        this.dataStatus = [];
        this.getStatusChartValue(this.leadStatusScoreDto);

        this.statusSubscription.unsubscribe();
      });
    if (this.leadStatusScoreDto === null) {
      this.getStatusChartNoValue();
    }
    this.isStatusRendered = true;
  }
  onSubmitStatus() {
    if (this.countByStatusGroup.invalid) {
      return;
    }
    this.getStatusDays();
  }

  private constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByStatusGroup.get("dateRange").value[0];
    const payload = {
      fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      status:
        String(this.barDetails.type).indexOf("Complete") > -1
          ? "Completed"
          : String(this.barDetails.type).replace(" ", ""),
      queueName: this.barDetails.queueName
    };
    return payload;
  }

  selectBar(bar) {
    this.barDetails = this.getBarDetails(bar[0]);
    console.log(bar, this.barDetails);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns(this.barDetails.type);
      this.detailsView = true;
      this.chartDetails = [];
      this.chartService
        .claimCountByQueueStatusDetails(this.constructPayload())
        .subscribe(res => {
          this.chartDetails = res || [];
        });
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.dataStatus[bar.row];
    const barDetails = {
      type: this.columnNamesStatus[bar.column],
      value: barValue[bar.column],
      queueName: barValue[0]
    };
    return barDetails;
  }

  setColumns(type) {
    const prefix = [
      { header: "Claim ID", field: "claimId" },
      { header: "PROMT Status", field: "promtStatus" },
      // { header: "Age Bracket(In Days)", field: "age" },
      { header: "Claim Age (In Days)", field: "age" },
      { header: "Examiner Name", field: "examinerName" }
    ];
    const suffix = [
      { header: "Claim Type", field: "claimType" },
      { header: "Claim Status", field: "claimStatus" },
      { header: "Billed Amount ($)", field: "billedAmount" },
      { header: "Allowed Amount($)", field: "allowedAmount" },
      { header: "Paid Amount($)", field: "paidAmount" },
      { header: "Processed Date", field: "processedDate" }
    ];
    const cols = {
      Complete: [
        ...prefix,
        { header: "Complete Date", field: "completedDate" },
        ...suffix
      ],
      Pended: [
        ...prefix,
        { header: "Pended Date", field: "pendedDate" },
        ...suffix
      ],
      Unassigned: [
        ...prefix.filter(e => e.header !== "Examiner Name"),
        ...suffix,
        { header: "User Group Name", field: "userGroupName" }
      ],
      Assigned: [
        ...prefix,
        { header: "Routed In Date", field: "routedInDate" },
        ...suffix
      ]
    };
    return cols[type];
  }

  downloadExcel() {
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    this.chartService
      .claimCountByQueueStatusExcel(this.constructPayload())
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
        const fileName = `Claims Count By Queue-${dateString}`;
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
    this.statusSubscription.unsubscribe();
  }
}
