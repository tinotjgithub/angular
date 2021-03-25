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
import { MultiSelect } from "primeng/multiselect";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { EnrollmentManagerDashboardService } from "../enrollment-manager-dashboard.service";

@Component({
  selector: "app-request-count-by-queue-status",
  templateUrl: "./request-count-by-queue-status.component.html",
  styleUrls: ["./request-count-by-queue-status.component.css"]
})
export class RequestCountByQueueStatusComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("statusSelect", { static: false }) statusSelect: MultiSelect;
  @ViewChild("queueSelect", { static: false }) queueSelect: MultiSelect;
  @Input()
  enlargedDisplay: boolean;
  public isValid = true;
  managerReqCountScoreDto: any;
  public isDataPresent = false;
  public data = [];
  public editMode = false;
  public queueNameArray = [];
  public editUser = {};
  public status = [];
  public stsArray = [];
  public queueName = "";
  private ageSubscription: Subscription = new Subscription();
  private queueSubscription: Subscription = new Subscription();
  public titleReqCount = "";
  public queueList = [];
  public statusList = [];
  public typeReqCount = "BarChart";
  public statusArray = [];
  public queueIdArray = [];
  public columnNamesReqCount = [
    "",
    "Completed",
    { role: "annotation" },
    "Pended",
    { role: "annotation" },
    "Assigned",
    { role: "annotation" },
    "Unassigned",
    { role: "annotation" }
  ];
  public optionsReqCount = {
    bar: { width: "60%" },
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
    colors: ["#4cc14f", "#ff5c5d", "#ff9226", "#686868"],
    hAxis: {
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
      left: 120,
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
    },
    isStacked: true
  };

  public optionsReqCountEnlarged = {
    height: 100,
    bar: { width: "60%" },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12,
        color: "black",
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#ff9226", "#686868"],
    hAxis: {
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
      left: 120,
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
    },
    isStacked: true
  };
  public widthReqCount = 550;
  public heightReqCount = 250;
  public action = "";
  public dataReqCount = [];
  public isReqCountRendered = false;
  public requestCountQueueGrp: FormGroup;
  public maxDate = new Date();
  queue: any[];
  queArray: any[];

  constructor(
    private fbReqCount: FormBuilder,
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe,
    private authService: AuthenticationService
  ) {
    const todaysDate = new Date();
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    this.requestCountQueueGrp = fbReqCount.group({
      dateRange: [defaultDateRange, Validators.required],
      queueName: ["", Validators.required],
      status: ["", Validators.required]
    });
  }

  get getDateRange() {
    return this.requestCountQueueGrp.controls.dateRange;
  }

  get getStatus() {
    return this.requestCountQueueGrp.controls.status;
  }

  get getQueue() {
    return this.requestCountQueueGrp.controls.queueName;
  }

  ngOnInit() {
    this.mapStatus();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const col = e[0].column;
      const queueName = this.dataReqCount[row][0];
      this.queueName = queueName;
      const queueNameArray = queueName;
      const a = this.columnNamesReqCount[col];
      const act = typeof a === "object" ? this.columnNamesReqCount[col - 1] : a;
      this.action = act.toString();
      const acct = [];
      if (this.action === "Assigned") {
        acct.push(this.action);
        acct.push("Routed");
      } else {
        acct.push(this.action);
      }
      const fromDate = this.requestCountQueueGrp.get("dateRange").value[0];
      const toDate = this.getToDateValue();
      const queueArray = [];
      queueArray.push(this.queueIdArray[row]);
      this.editUser = {
        type: "req-count-by-grp-sts",
        singleQueueName: queueNameArray,
        queueId: queueArray,
        queueName,
        action: acct,
        fromDate: this.datePipe.transform(fromDate, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDate, "yyyy-MM-dd")
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  updateMultiSelectLabels() {
    this.queueSelect.updateLabel = function() {
      const grpLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Queue Selected"
          : this.value.length.toString() + " Queues Selected";
      this.valuesAsString = grpLabel;
    };

    this.statusSelect.updateLabel = function() {
      const statusLabel = this.value.length.toString() + " Status Selected";
      this.valuesAsString = statusLabel;
    };
  }

  mapStatus() {
    this.status = [];
    this.status.push({ status: "Assigned", id: "Assigned" });
    this.status.push({ status: "Pended", id: "Pended" });
    this.status.push({ status: "Completed", id: "Completed" });
    this.status.push({ status: "Unassigned", id: "Unassigned" });
    const selectedScopes = [];
    if (this.status && this.status.length > 0) {
      this.status.forEach(s => {
        this.statusList.push({
          label: s.status,
          value: {
            id: s.id,
            name: s.status,
            code: s.status
          }
        });
      });
      this.statusList.forEach(item => selectedScopes.push(item.value));
    }
    this.requestCountQueueGrp.get("status").setValue(selectedScopes);
    this.statusList.forEach(q => {
      this.statusArray.push(q.value.id);
    });
    this.getEnrollManagerQueues();
  }

  getEnrollManagerQueues() {
    this.queue = [];
    this.enrollmentManagerDashboardService.getEnrollManagerQueues();
    this.queue = this.enrollmentManagerDashboardService.enrollManagerQueuesResponse;
    this.queueSubscription = this.enrollmentManagerDashboardService
      .getEnrollManagerQueuesListner()
      .subscribe(data => {
        this.queue = data;
        this.mapQueueNames();
        this.queueSubscription.unsubscribe();
      });
  }

  setProdVolChartOptions() {
    const queueLength =
      this.dataReqCount.length === 1
        ? this.dataReqCount.length * 250
        : this.dataReqCount.length <= 3
        ? this.dataReqCount.length * 150
        : this.dataReqCount.length * 100;
    this.optionsReqCount.height = queueLength;
    this.optionsReqCountEnlarged.height = queueLength;
  }

  mapQueueNames() {
    const selectedScopes = [];
    if (this.queue && this.queue.length > 0) {
      this.queue.forEach(s => {
        this.queueList.push({
          label: s.queueName,
          value: { id: s.queueId, name: s.queueName, code: s.queueName }
        });
      });
      this.queueList.forEach(item => selectedScopes.push(item.value));
    }
    this.requestCountQueueGrp.get("queueName").setValue(selectedScopes);
    this.onSubmitReqCount();
  }

  mapQueue(queueName) {
    const queArray = [];
    if (queueName !== null && queueName.length > 0) {
      for (let index = 0; index <= queueName.length; index++) {
        this.queueList.forEach(item => {
          if (item.label === queueName[index]) {
            queArray.push(item.value.id);
          }
        });
      }
    }
    return queArray;
  }

  mapSpecial(splName) {
    const splArray = [];
    if (splName !== null && splName.length > 0) {
      splName.forEach(item => {
        splArray.push(item.value);
      });
    }
    return splArray;
  }

  validateDates() {
    const fromDateValue = this.requestCountQueueGrp.get("dateRange").value;

    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      const isValid = diffInMonths < 6 ? true : false;
      if (!isValid) {
        this.requestCountQueueGrp.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.requestCountQueueGrp.updateValueAndValidity();
      } else {
        this.requestCountQueueGrp.controls.dateRange.setErrors(null);
        this.requestCountQueueGrp.updateValueAndValidity();
        this.onSubmitReqCount();
      }
    } else {
      this.requestCountQueueGrp.controls.dateRange.setErrors(null);
      this.requestCountQueueGrp.updateValueAndValidity();
      this.onSubmitReqCount();
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

  validateQueues() {
    this.updateMultiSelectLabels();
    this.onSubmitReqCount();
  }

  validateStatus() {
    this.updateMultiSelectLabels();
    this.isValid = this.requestCountQueueGrp.get("status").hasError("required")
      ? false
      : true;
    this.isValid ? this.onSubmitReqCount() : "";
  }

  reqCountStsChartNoValue() {
    this.isDataPresent = false;
    this.dataReqCount = [];
    this.optionsReqCount.legend.position = "none";
    this.optionsReqCount.tooltip.trigger = "none";
    this.optionsReqCountEnlarged.legend.position = "none";
    this.optionsReqCountEnlarged.tooltip.trigger = "none";
    this.dataReqCount.push(["NO DATA", 0, "0", 0, "0", 0, "0", 0, "0"]);
  }

  reqCountStsChartValue() {
    this.dataReqCount = [];
    this.optionsReqCount.legend.position = "top";
    this.optionsReqCount.tooltip.trigger = "focus";
    this.optionsReqCountEnlarged.legend.position = "top";
    this.optionsReqCountEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.managerReqCountScoreDto;
    if (responseValue !== null && responseValue.length !== 0) {
      this.isDataPresent = true;
      this.optionsReqCount.bar.width =
        responseValue.length <= 3 ? "45%" : "65%";
      this.data = [];

      responseValue.forEach(val => {
        this.dataReqCount.push(this.pushVal(val));
      });
      this.setProdVolChartOptions();
    } else {
      this.reqCountStsChartNoValue();
    }
  }

  pushVal(obj) {
    this.data = [];
    const keyArray = Object.keys(obj);
    this.data.push(obj.queueName);
    this.columnNamesReqCount = [];
    this.columnNamesReqCount.push("");
    const clr = [];
    this.optionsReqCount.colors = [];
    this.optionsReqCountEnlarged.colors = [];
    keyArray.forEach(key => {
      if (key !== "queueName" && key !== "queueId" && obj[key] !== null) {
        this.data.push(obj[key]);
        this.data.push(obj[key]);
        const colName =
          key === "assignedCount"
            ? "Assigned"
            : key === "pendedCount"
            ? "Pended"
            : key === "completedCount"
            ? "Completed"
            : "Unassigned";
        this.columnNamesReqCount.push(colName);
        this.columnNamesReqCount.push({ role: "annotation" });

        key === "assignedCount"
          ? clr.push("#ff9226")
          : key === "pendedCount"
          ? clr.push("#ff5c5d")
          : key === "completedCount"
          ? clr.push("#4cc14f")
          : key === "unassignedCount"
          ? clr.push("#686868")
          : "";
        this.optionsReqCount.colors = clr;
        this.optionsReqCountEnlarged.colors = clr;
      } else if (key === "queueId") {
        this.queueIdArray.push(obj[key]);
      }
    });
    return this.data;
  }

  getToDateValue() {
    const toDateValue =
      this.requestCountQueueGrp.get("dateRange").value[1] !== null &&
      this.requestCountQueueGrp.get("dateRange").value[1] !== "" &&
      this.requestCountQueueGrp.get("dateRange").value[1] !== undefined
        ? this.requestCountQueueGrp.get("dateRange").value[1]
        : this.requestCountQueueGrp.get("dateRange").value[0];
    return toDateValue;
  }

  mapUsrGrpNameList(queueName) {
    this.queArray = [];
    if (
      queueName &&
      queueName !== undefined &&
      queueName !== "" &&
      queueName !== null &&
      queueName.length > 0
    ) {
      queueName.forEach(q => {
        this.queArray.push(q.name);
      });
    }
  }

  mapSts(sts) {
    this.stsArray = [];
    if (sts !== null && sts.length > 0) {
      sts.forEach(item => {
        this.stsArray.push(item.id.toUpperCase());
      });
    }
    return this.stsArray;
  }

  getReqCountSts() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.requestCountQueueGrp.get("dateRange").value[0];
    this.mapUsrGrpNameList(this.requestCountQueueGrp.get("queueName").value);
    this.enrollmentManagerDashboardService.reqCountSts(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapQueue(this.queArray),
      this.mapSts(this.requestCountQueueGrp.get("status").value)
    );
    this.managerReqCountScoreDto = this.enrollmentManagerDashboardService.reqCountStatusResponse;
    this.managerReqCountScoreDto = null;
    this.ageSubscription = this.enrollmentManagerDashboardService
      .reqCountStsListner()
      .subscribe((data: any) => {
        this.managerReqCountScoreDto = data;
        this.dataReqCount = [];
        this.managerReqCountScoreDto.length > 0
          ? this.reqCountStsChartValue()
          : this.reqCountStsChartNoValue();
        this.ageSubscription.unsubscribe();
      });
    if (this.managerReqCountScoreDto === null) {
      this.reqCountStsChartNoValue();
    }
    this.isReqCountRendered = true;
  }

  onSubmitReqCount() {
    if (this.requestCountQueueGrp.invalid || !this.isValid) {
      return;
    } else {
      this.getReqCountSts();
    }
  }

  ngOnDestroy() {
    this.ageSubscription.unsubscribe();
    this.queueSubscription.unsubscribe();
  }
}
