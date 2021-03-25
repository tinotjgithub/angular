import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { MultiSelect } from "primeng/multiselect";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-lead-claims-count-by-age-vol",
  templateUrl: "./lead-claims-count-by-age-vol.component.html"
})
export class LeadClaimsCountByAgeVolComponent implements OnInit, AfterViewInit {
  @ViewChild("queueSelect", { static: false }) queueSelect: MultiSelect;
  @ViewChild("statusSelect", { static: false }) statusSelect: MultiSelect;
  leadAgeScoreDto: any;
  enlargedDisplay = false;
  public ageSubscription: Subscription = new Subscription();
  public queueSubscription: Subscription = new Subscription();
  public statusSubscription: Subscription = new Subscription();
  public titleAge = "";
  public queueList = [];
  public isDataPresent = false;
  queue: any[];
  public statusList = [];
  public typeAge = "ColumnChart";
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
    colors: ["#4cc14f", "#ff5c5d", "#2c68a6", "#686868"],
    hAxis: {
      format: "0",
      title: "",
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
    chartArea: {
      left: 50,
      right: 1,
      top: 17,
      bottom: 20
    },
    legend: {
      position: "top",
      textStyle: { fontSize: 12 },
      width: "50%"
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
            length: 7
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

  public optionsAgeEnlarged = {
    bar: { width: "65%" },
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
      title: "",
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
    chartArea: {
      left: 50,
      right: 1,
      top: 25,
      bottom: 30
    },
    legend: {
      position: "top",
      width: "50%",
      alignment: "center",
      textStyle: {
        fontSize: 13,
        width: "50%"
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
  };

  public widthAge = 400;
  public heightAge = 150;
  public enlargedWidth = 700;
  public dataAge = [];
  public isAgeRendered = false;
  public countByAgeGroup: FormGroup;
  public maxDate = new Date();
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
    this.getQueueNames();
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
  getQueueNames() {
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
    const selectedScopes = [];
    this.queueList = [];
    if (
      this.queue &&
      this.queue !== null &&
      this.queue !== undefined &&
      this.queue.length > 0
    ) {
      this.queue.forEach(s => {
        this.queueList.push({
          label: s.queueName,
          value: { id: s.queueId, name: s.queueName, code: s.queueName }
        });
      });
      this.queueList.forEach(item => selectedScopes.push(item.value));
      this.countByAgeGroup.get("queueName").setValue(selectedScopes);
      this.getStatus();
    }
  }

  getStatus() {
    this.status = [];
    const userID = this.authService.currentUserDetails;
    const leadId = userID.id;
    this.taskManagementService.getLeadStatuses(leadId);
    this.status = this.taskManagementService.leadStatusesResponse;
    this.statusSubscription = this.taskManagementService
      .getLeadStatusesListner()
      .subscribe(data => {
        this.status = data;
        this.mapStatus();
        this.statusSubscription.unsubscribe();
      });
  }

  mapStatus() {
    if (this.status && this.status.length > 0) {
      this.status.forEach(s => {
        this.statusList.push({
          label: s.action,
          value: { id: s.action, name: s.action, code: s.action }
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
    this.isDataPresent = false;
    this.dataAge = [];
    this.optionsAge.legend.position = "none";
    this.optionsAge.tooltip.trigger = "none";
    this.optionsAgeEnlarged.legend.position = "none";
    this.optionsAgeEnlarged.tooltip.trigger = "none";
    this.dataAge.push(["NO DATA", 0, "0", 0, "0", 0, "0", 0, "0"]);
  }

  getAgeChartValue() {
    this.isDataPresent = true;
    this.dataAge = [];
    this.optionsAge.legend.position = "top";
    this.optionsAge.tooltip.trigger = "focus";
    this.optionsAgeEnlarged.legend.position = "top";
    this.optionsAgeEnlarged.tooltip.trigger = "focus";
    let responseValue = [];

    responseValue = this.leadAgeScoreDto;
    if (responseValue !== null && responseValue.length !== 0) {
      const parsedResponseValue = this.parseResponseValue(responseValue);
      this.widthAge = parsedResponseValue.length * 100;
      parsedResponseValue.forEach(val => {
        this.dataAge.push([
          val.age,
          val.COMPLETED,
          val.COMPLETED,
          val.PENDED,
          val.PENDED,
          val.TODO,
          val.TODO,
          val.ROUTEDIN,
          val.ROUTEDIN
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
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: ">64"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "57-63"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "50-56"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "43-49"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "36-42"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "29-35"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "22-28"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "15-21"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "8-14"
      },
      {
        TODO: 0,
        ROUTEDIN: 0,
        PENDED: 0,
        COMPLETED: 0,
        age: "1-7"
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
          indexResponse.claimVolumeByAge.age ===
          parsedResponseValue[indexParsed].age
        ) {
          parsedResponseValue[indexParsed].COMPLETED =
            indexResponse.claimVolumeByAge.COMPLETED;
          parsedResponseValue[indexParsed].PENDED =
            indexResponse.claimVolumeByAge.PENDED;
          parsedResponseValue[indexParsed].TODO =
            indexResponse.claimVolumeByAge.TODO;
          parsedResponseValue[indexParsed].ROUTEDIN =
            indexResponse.claimVolumeByAge.ROUTEDIN;
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
    this.taskManagementService.getLeadAgeScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.queueArray,
      this.statusArray
    );
    this.leadAgeScoreDto = this.taskManagementService.leadAgeScoreResponse;
    this.leadAgeScoreDto = null;
    this.ageSubscription = this.taskManagementService
      .getLeadAgeScoresListner()
      .subscribe((data: any) => {
        this.leadAgeScoreDto = data;
        this.dataAge = [];
        this.leadAgeScoreDto &&
        this.leadAgeScoreDto !== null &&
        this.leadAgeScoreDto.length > 0
          ? this.getAgeChartValue()
          : this.getAgeChartNoValue();
        this.ageSubscription.unsubscribe();
      });
    if (this.leadAgeScoreDto === null) {
      this.getAgeChartNoValue();
    }
    this.isAgeRendered = true;
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
        .claimVolumeByAgeDetails(this.constructPayload(), "lead")
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
      .claimVolumeByAgeExcel(this.constructPayload(), "lead")
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

  onSubmitAge() {
    if (this.countByAgeGroup.invalid) {
      return;
    }
    this.getAgeCount();
  }
}
