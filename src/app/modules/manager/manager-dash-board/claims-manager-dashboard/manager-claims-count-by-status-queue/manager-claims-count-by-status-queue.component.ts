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
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-manager-claims-count-by-status-queue",
  templateUrl: "./manager-claims-count-by-status-queue.component.html"
})
export class ManagerClaimsCountByStatusComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MultiSelect, { static: false })
  select: MultiSelect;
  managerStatusScoreDto: any;
  enlargedDisplay = false;
  public isDataPresent = false;
  private submittedStatus = false;
  private statusSubscription: Subscription = new Subscription();
  private queueSubscription: Subscription = new Subscription();
  public titleStatus = "";
  public queueList = [];
  public typeStatus = "BarChart";
  // stackedBar-Manager-1
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
    height: 200,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#ff9226", "#645ba1"],
    hAxis: {
      format: "0",
      minValue: 1,
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
      width: 100,
      left: 200,
      right: 55,
      top: 20,
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
      position: "top",
      width: "100%",
      textStyle: { fontSize: 12 }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
    // isStacked: true
  };

  public optionsStatusEnlarged = {
    height: 400,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 13,
        color: "black",
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#ff9226", "#645ba1"],
    hAxis: {
      format: "0",
      minValue: 1,
      title: "",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    annotations: {
      textStyle: {
        fontSize: 12,
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
    // isStacked: true
  };
  public widthStatus = 580;
  public heightStatus = 200;
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
    this.getManagerQueueNames();
    this.onSubmitStatus();
  }

  get getDateRange() {
    return this.countByStatusGroup.controls.dateRange;
  }

  get getQueue() {
    return this.countByStatusGroup.controls.queueName;
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
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

  getManagerQueueNames() {
    this.queue = [];
    const userID = this.authService.currentUserDetails;
    const managerId = userID ? userID.id : "";
    this.taskManagementService.getManagerQueueNames(managerId);
    this.queue = this.taskManagementService.managerQueueNamesResponse;
    this.queueSubscription = this.taskManagementService
      .getManagerQueueNamesListner()
      .subscribe(data => {
        this.queue = data;
        this.mapQueueNames();
        this.queueSubscription.unsubscribe();
      });
  }

  mapQueueNames() {
    this.queueList = [];
    if (this.queue && this.queue !== undefined && this.queue.length > 0) {
      this.queue.forEach(s => {
        this.queueList.push({
          label: s.queueName,
          value: { id: s.queueId, name: s.queueName, code: s.queueName }
        });
      });
      const selectedScopes = [];
      this.queueList.forEach(item => selectedScopes.push(item.value));
      this.countByStatusGroup.get("queueName").setValue(selectedScopes);
      this.getStatusDays();
    }
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

  getMonths(fromDateValue) {
    const fromDate = new Date(fromDateValue[0]);
    const toDate = new Date(fromDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  validateQueue() {
    this.updateMultiSelectLabels();
    this.onSubmitStatus();
  }

  getStatusChartNoValue() {
    this.isDataPresent = false;
    this.dataStatus = [];
    this.optionsStatus.legend.position = "none";
    this.optionsStatus.tooltip.trigger = "none";
    this.optionsStatusEnlarged.legend.position = "none";
    this.optionsStatusEnlarged.tooltip.trigger = "none";
    this.dataStatus.push(["NO DATA", 0, "0", 0, "0", 0, "0", 0, "0"]);
  }

  parseResponseValue(responseValue) {
    let parsedResponseValue = [];
    responseValue.forEach(() => {
      parsedResponseValue.push({
        managerStatusScoreDto: {
          Completed: 0,
          Pended: 0,
          Assigned: 0,
          ToDo: 0,
          quename: ""
        }
      });
    });
    parsedResponseValue = this.mapParsedResponseValue(
      responseValue,
      parsedResponseValue
    );
    return parsedResponseValue;
  }

  mapParsedResponseValue(responseValue, parsedResponseValue) {
    responseValue.map((val, index) => {
      if (val.managerStatusScoreDto.hasOwnProperty("Completed")) {
        parsedResponseValue[index].managerStatusScoreDto.Completed =
          val.managerStatusScoreDto.Completed;
      }
      if (val.managerStatusScoreDto.hasOwnProperty("Pended")) {
        parsedResponseValue[index].managerStatusScoreDto.Pended =
          val.managerStatusScoreDto.Pended;
      }
      if (val.managerStatusScoreDto.hasOwnProperty("Assigned")) {
        parsedResponseValue[index].managerStatusScoreDto.Assigned =
          val.managerStatusScoreDto.Assigned;
      }
      if (val.managerStatusScoreDto.hasOwnProperty("ToDo")) {
        parsedResponseValue[index].managerStatusScoreDto.ToDo =
          val.managerStatusScoreDto.ToDo;
      }
      if (val.managerStatusScoreDto.hasOwnProperty("quename")) {
        parsedResponseValue[index].managerStatusScoreDto.quename =
          val.managerStatusScoreDto.quename;
      }
    });
    return parsedResponseValue;
  }

  getStatusChartValue(managerStatusScoreDto) {
    this.isDataPresent = true;
    this.dataStatus = [];
    this.optionsStatus.legend.position = "top";
    this.optionsStatus.tooltip.trigger = "focus";
    this.optionsStatusEnlarged.legend.position = "top";
    this.optionsStatusEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = managerStatusScoreDto;
    if (
      responseValue &&
      responseValue !== null &&
      responseValue !== undefined &&
      responseValue.length > 0
    ) {
      const parsedResponseValue = [...this.parseResponseValue(responseValue)];
      parsedResponseValue.forEach(val => {
        this.dataStatus.push([
          val.managerStatusScoreDto.quename,
          val.managerStatusScoreDto.Completed,
          val.managerStatusScoreDto.Completed,
          val.managerStatusScoreDto.Pended,
          val.managerStatusScoreDto.Pended,
          val.managerStatusScoreDto.Assigned,
          val.managerStatusScoreDto.Assigned,
          val.managerStatusScoreDto.ToDo,
          val.managerStatusScoreDto.ToDo
          // val.managerStatusScoreDto.Completed +
          //   val.managerStatusScoreDto.Pended +
          //   val.managerStatusScoreDto.Assigned +
          //   val.managerStatusScoreDto.ToDo
        ]);
      });
      this.setManagerChartOptions();
    } else {
      this.getStatusChartNoValue();
    }
  }

  setManagerChartOptions() {
    const statusLength = this.dataStatus.length;
    const newHeightEnlarged = statusLength > 4 ? statusLength * 90 : 400;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 400 ? newHeightEnlarged : 400;
    const newHeight = statusLength > 4 ? statusLength * 50 : 200;
    this.optionsStatusEnlarged.height = newGeneratedHeightEnlarged;
    this.optionsStatus.height = newHeight;
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
    if (queueName && queueName !== undefined && queueName.length > 0) {
      queueName.map(q => {
        this.queueArray.push(q.name);
      });
    }
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByStatusGroup.get("dateRange").value[0];
    this.mapQueueNameList(this.countByStatusGroup.get("queueName").value);
    this.taskManagementService.getManagerStatusScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.queueArray
    );
    this.managerStatusScoreDto = this.taskManagementService.managerStatusScoreResponse;
    this.managerStatusScoreDto = null;
    this.statusSubscription = this.taskManagementService
      .getManagerStatusScoresListner()
      .subscribe((data: any) => {
        this.managerStatusScoreDto = data;
        this.dataStatus = [];
        this.managerStatusScoreDto && this.managerStatusScoreDto.length > 0
          ? this.getStatusChartValue(this.managerStatusScoreDto)
          : this.getStatusChartNoValue();
        this.statusSubscription.unsubscribe();
      });
    if (this.managerStatusScoreDto === null) {
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
