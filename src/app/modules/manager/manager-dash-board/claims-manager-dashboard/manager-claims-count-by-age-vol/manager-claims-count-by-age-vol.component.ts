import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input
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
  selector: "app-manager-claims-count-by-age-vol",
  templateUrl: "./manager-claims-count-by-age-vol.component.html"
})
export class ClaimsCountByAgeComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // @ViewChild(MultiSelect, { static: false })
  // select: MultiSelect;
  @ViewChild("queueSelect", { static: false }) queueSelect: MultiSelect;
  @ViewChild("statusSelect", { static: false }) statusSelect: MultiSelect;
  @Input()
  triggerZoom: boolean;
  managerAgeScoreDto: any;
  enlargedDisplay = false;
  public isDataPresent = false;
  private userAgeReportDto: any;
  private ageSubscription: Subscription = new Subscription();
  private reportSubscription: Subscription;
  private queueSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  public titleAge = "";
  public queueList = [];
  public statusList = [];
  public typeAge = "ColumnChart";
  // public columnNamesAge = ["", "Claim Count"];
  public columnNamesAge = [
    "",
    "Complete",
    { role: "annotation" },
    "Pended",
    { role: "annotation" },
    "To Do",
    { role: "annotation" },
    "Routed In",
    { role: "annotation" }
  ];
  public optionsAge = {
    // bar: { groupWidth: "70%" },
    bar: { width: "60%" },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal",
        fontSize: 12
      }
    },
    annotations: {
      textStyle: {
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#2c68a6", "#686868"],
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
      left: 30,
      right: 1,
      top: 30,
      bottom: 30
    },
    legend: {
      position: "top",
      width: "50%",
      textStyle: { fontSize: 12 }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
    // isStacked: true
  };

  public optionsAgeEnlarged = {
    bar: { width: "65%" },
    annotations: {
      textStyle: {
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal",
        fontSize: 13
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#2c68a6", "#686868"],
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
      width: "100%",
      left: 80,
      right: 1,
      top: 30,
      bottom: 30
    },
    legend: {
      position: "top",
      textStyle: {
        fontSize: 13,
        position: "top"
      },
      width: "50%"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
    // isStacked: true
  };

  public widthAge = 500;
  public heightAge = 150;
  public dataAge = [];
  public isAgeRendered = false;
  public countByAgeGroup: FormGroup;
  public maxDate = new Date();
  queue: any[];
  queueArray: any[];
  status: any[];
  statusArray: any[];
  barDetails: { type: any; value: any; ageRange: any };
  public detailsView: boolean;
  public cols: any;
  public chartDetails: any[];

  constructor(
    private fbAge: FormBuilder,
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
    this.countByAgeGroup = fbAge.group({
      dateRange: [defaultDateRange, Validators.required],
      queueName: ["", Validators.required],
      status: ["", Validators.required]
    });
  }

  get getDateRange() {
    return this.countByAgeGroup.controls.dateRange;
  }

  get getStatusSelect() {
    return this.countByAgeGroup.controls.status;
  }

  get getQueue() {
    return this.countByAgeGroup.controls.queueName;
  }

  ngOnInit() {
    this.getManagerQueues();
    this.onSubmitAge();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  updateMultiSelectLabels() {
    this.queueSelect.updateLabel = function() {
      const queueLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Queue Selected"
          : this.value.length.toString() + " Queues Selected";
      this.valuesAsString = queueLabel;
    };
    this.statusSelect.updateLabel = function() {
      const statusLabel = this.value.length.toString() + " Status Selected";
      this.valuesAsString = statusLabel;
    };
  }

  getManagerQueues() {
    this.queue = [];
    this.taskManagementService.getManagerQueues();
    this.queue = this.taskManagementService.queueNamesResponse;
    this.queueSubscription = this.taskManagementService
      .getManagerQueuesListner()
      .subscribe(data => {
        this.queue = data;
        this.mapQueueNames();
        this.queueSubscription.unsubscribe();
      });
  }

  getStatus() {
    this.status = [];
    this.taskManagementService.getStatus();
    this.status = this.taskManagementService.statusResponse;
    this.statusSubscription = this.taskManagementService
      .getStatusListner()
      .subscribe(data => {
        this.status = data;
        this.mapStatus();
        this.statusSubscription.unsubscribe();
      });
  }

  mapQueueNames() {
    const selectedScopes = [];
    if (this.queue && this.queue.length > 0) {
      this.queue.forEach(s => {
        this.queueList.push({
          label: s.label,
          value: { id: s.value, name: s.label, code: s.label }
        });
      });
      this.queueList.forEach(item => selectedScopes.push(item.value));
    }
    this.countByAgeGroup.get("queueName").setValue(selectedScopes);
    this.getStatus();
  }

  getQueueId(queueName) {
    const queueArray = [];
    if (queueName !== null && queueName.length > 0) {
      for (let index = 0; index <= queueName.length; index++) {
        this.queueList.forEach(item => {
          if (item.label === queueName[index]) {
            queueArray.push({ value: item.value.id, label: item.label });
          }
        });
      }
    }
    return queueArray;
  }

  mapStatus() {
    if (this.status && this.status.length > 0) {
      this.status.forEach(s => {
        this.statusList.push({
          label: s,
          value: { id: s, name: s, code: s }
        });
      });
    }
    const selectedStatus = [];
    this.statusList.forEach(item => {
      if (item.label !== "Completed") {
        selectedStatus.push(item.value);
      }
    });
    this.countByAgeGroup.get("status").setValue(selectedStatus);
    this.getAgeCount();
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.countByAgeGroup.get("dateRange").value;

    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      const isValid = diffInMonths > 6 ? false : true;
      if (!isValid) {
        this.countByAgeGroup.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.countByAgeGroup.updateValueAndValidity();
      } else {
        this.countByAgeGroup.controls.dateRange.setErrors(null);
        this.countByAgeGroup.updateValueAndValidity();
        this.onSubmitAge();
      }
    } else {
      this.countByAgeGroup.controls.dateRange.setErrors(null);
      this.countByAgeGroup.updateValueAndValidity();
      this.onSubmitAge();
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
    this.onSubmitAge();
  }

  validateStatus() {
    this.updateMultiSelectLabels();
    this.onSubmitAge();
  }

  getAgeChartNoValue() {
    this.dataAge = [];
    this.isDataPresent = false;
    this.optionsAge.legend.position = "none";
    this.optionsAge.tooltip.trigger = "none";
    this.optionsAgeEnlarged.legend.position = "none";
    this.optionsAgeEnlarged.tooltip.trigger = "none";
    this.dataAge.push(["NO DATA", 0, "0", 0, "0", 0, "0", 0, "0", 0, "0"]);
  }

  getAgeChartValue() {
    this.isDataPresent = true;
    this.dataAge = [];
    this.optionsAge.legend.position = "top";
    this.optionsAge.tooltip.trigger = "focus";
    this.optionsAgeEnlarged.legend.position = "top";
    this.optionsAgeEnlarged.tooltip.trigger = "focus";
    let responseValue = [];

    responseValue = this.managerAgeScoreDto;
    if (responseValue !== null && responseValue.length !== 0) {
      const parsedResponseValue = this.parseResponseValue(responseValue);
      this.widthAge = parsedResponseValue.length * 150;
      parsedResponseValue.forEach(val => {
        this.dataAge.push([
          val.ageRange,
          val.completed,
          val.completed,
          val.pended,
          val.pended,
          val.toDo,
          val.toDo,
          val.routedIn,
          val.routedIn
        ]);
      });
    } else {
      this.getAgeChartNoValue();
    }
  }

  parseResponseValue(responseValue) {
    let parsedResponseValue = [];
    parsedResponseValue.push(
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: ">64"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "57-63"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "50-56"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "43-49"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "36-42"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "29-35"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "22-28"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "15-21"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "8-14"
      },
      {
        toDo: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "1-7"
      }
    );
    parsedResponseValue = this.mapParsedResponseValue(
      responseValue,
      parsedResponseValue
    );
    return parsedResponseValue;
  }

  mapParsedResponseValue(responseValue, parsedResponseValue) {
    for (const indexResponse of responseValue) {
      for (const indexParsed in parsedResponseValue) {
        if (
          indexResponse.ageRange === parsedResponseValue[indexParsed].ageRange
        ) {
          parsedResponseValue[indexParsed].completed = indexResponse.completed;
          parsedResponseValue[indexParsed].pended = indexResponse.pended;
          parsedResponseValue[indexParsed].toDo = indexResponse.toDo;
          parsedResponseValue[indexParsed].routedIn = indexResponse.routedIn;
        }
      }
    }
    return parsedResponseValue;
  }

  getToDateValue() {
    const toDateValue =
      this.countByAgeGroup.get("dateRange").value[1] !== null &&
      this.countByAgeGroup.get("dateRange").value[1] !== "" &&
      this.countByAgeGroup.get("dateRange").value[1] !== undefined
        ? this.countByAgeGroup.get("dateRange").value[1]
        : this.countByAgeGroup.get("dateRange").value[0];
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

  mapStatusList(status) {
    this.statusArray = [];
    if (
      status &&
      status !== undefined &&
      status !== "" &&
      status !== null &&
      status.length > 0
    ) {
      status.forEach(q => {
        this.statusArray.push(q.name);
      });
    }
  }

  getAgeCount() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByAgeGroup.get("dateRange").value[0];
    this.mapQueueNameList(this.countByAgeGroup.get("queueName").value);
    this.mapStatusList(this.countByAgeGroup.get("status").value);
    this.taskManagementService.getManagerAgeScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.getQueueId(this.queueArray),
      this.statusArray
    );
    this.managerAgeScoreDto = this.taskManagementService.managerAgeScoreResponse;
    this.managerAgeScoreDto = null;
    this.ageSubscription = this.taskManagementService
      .getManagerAgeScoresListner()
      .subscribe((data: any) => {
        this.managerAgeScoreDto = data;
        this.dataAge = [];
        this.managerAgeScoreDto && this.managerAgeScoreDto.length > 0
          ? this.getAgeChartValue()
          : this.getAgeChartNoValue();
        this.ageSubscription.unsubscribe();
      });
    if (this.managerAgeScoreDto === null) {
      this.getAgeChartNoValue();
    }
    this.isAgeRendered = true;
  }

  onSubmitAge() {
    if (this.countByAgeGroup.invalid) {
      return;
    }
    this.getAgeCount();
  }

  private constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByAgeGroup.get("dateRange").value[0];
    const payload = {
      fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      status:
        String(this.barDetails.type).indexOf("Complete") > -1
          ? "Completed"
          : this.barDetails.type,
      queueNames: this.queue,
      ageRange: this.barDetails.ageRange
    };
    return payload;
  }

  selectBar(bar) {
    this.barDetails = this.getBarDetails(bar[0]);
    console.log(bar, this.barDetails);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns(this.barDetails.type);
      this.chartDetails = [];
      this.chartService
        .claimVolumeByAgeDetails(this.constructPayload(), "manager")
        .subscribe(res => {
          this.chartDetails = res || [];
        });
      this.detailsView = true;
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.dataAge[bar.row];
    const barDetails = {
      type: this.columnNamesAge[bar.column],
      value: barValue[bar.column],
      ageRange: barValue[0]
    };
    return barDetails;
  }

  setColumns(type) {
    const prefix = [
      { header: "Claim ID", field: "claimId" },
      { header: "PROMT Status", field: "promtStatus" },
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
      "To Do": [
        ...prefix.filter(e => e.header !== "Examiner Name"),
        ...suffix,
        { header: "User Group Name", field: "userGroupName" }
      ],
      "Routed In": [
        ...prefix,
        { header: "Routed In Date", field: "routedInDate" },
        ...suffix
      ],
      "Routed Out": [
        ...prefix,
        { header: "Routed Out Date", field: "routedOutDate" },
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
      .claimVolumeByAgeExcel(this.constructPayload(), "manager")
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
        const fileName = `Claims Volume By Age-${dateString}`;
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
    this.queueSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }
}
