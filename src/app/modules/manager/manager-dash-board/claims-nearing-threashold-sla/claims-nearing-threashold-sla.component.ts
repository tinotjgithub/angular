import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

@Component({
  selector: "app-claims-nearing-threashold-sla",
  templateUrl: "./claims-nearing-threashold-sla.component.html",
  styleUrls: ["./claims-nearing-threashold-sla.component.css"]
})
export class ClaimsNearingThreasholdSlaComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("barchart", { static: false }) barchart;
  public dataThreshold = [];
  public editUser = {};
  public isDataPresent = false;
  claimsCount: any;
  public editMode = false;
  public isSLAArray = false;
  enlargedDisplay = false;
  private thresholdSubscription: Subscription = new Subscription();
  public titleThresholdCount = "";
  public slaDays = "";
  public slaDaysArray = [];
  public daysList = [];
  public typeThresholdCount = "ColumnChart";
  // stackedBar-Manager-1
  public columnNamesThresholdCount = [
    "",
    "Claim Count",
    { role: "annotation" },
    { role: "style" }
  ];
  public optionsThreshold = {
    bar: { width: "50%" },
    tooltip: {
      trigger: "focus",
      showColorCode: false,
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
      left: 30,
      right: 30,
      top: 17,
      bottom: 35
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

  public optionsThresholdEnlarged = {
    bar: { width: "50%" },
    tooltip: {
      trigger: "focus",
      showColorCode: false,
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
      left: 50,
      right: 50,
      top: 25,
      bottom: 35
    },
    legend: {
      position: "none",
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

  public widthAge = 600;
  public heightAge = 180;
  public enlargedWidth = 750;
  public isExaminerCountRendered = false;
  public thresholdGroup: FormGroup;
  public maxDate = new Date();
  days: any[];
  daysArray: any[];

  constructor(
    private fbThresholdCount: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe
  ) {
    this.thresholdGroup = fbThresholdCount.group({
      days: ["", Validators.required]
    });
  }

  get getdays() {
    return this.thresholdGroup.controls.days;
  }

  ngOnInit() {
    this.thresholdGroup.get("days").setValue("Default");
    this.getClaimsThreashold();
    this.onSubmitThreshold();
  }

  ngAfterViewInit() {}

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const age = this.dataThreshold[row][0];
      const claimCount = this.dataThreshold[row][1];
      this.editUser = { age, claimCount, type: "threshold-sla" };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  setThresholddays(targetArray) {
    this.daysList = [];

    this.daysList.push({
      value: "Default",
      label: "Default"
    });
    this.daysList.push({
      value: "<0",
      label: "<0"
    });
    let largest = 0;
    targetArray.forEach(elem => {
      if (largest < elem.target) {
        largest = elem.target;
      }
    });
    const target = largest <= 30 ? largest : 30;
    let isSame = targetArray.every(
      (val, i, arr) => val.target === arr[0].target
    );
    if (targetArray.length === 1 || isSame) {
      this.isSLAArray = false;
      this.slaDays = "";
      this.slaDays = largest.toString();
    } else {
      this.isSLAArray = true;
    }
    for (let i = 0; i <= target; i++) {
      this.slaDaysArray = [];
      this.daysList.push({
        value: i.toString(),
        label: i.toString()
      });
    }
    targetArray.forEach(elem => {
      const mon = this.datePipe.transform(elem.month, "MMMM");
      this.slaDaysArray.push(mon + " : " + elem.target.toString());
    });
    this.daysList.push({
      value: ">" + target,
      label: ">" + target
    });
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  getClaimsThreasholdChartNoValue() {
    this.isDataPresent = false;
    this.dataThreshold = [];
    this.optionsThreshold.legend.position = "none";
    this.optionsThreshold.tooltip.trigger = "none";
    this.optionsThresholdEnlarged.legend.position = "none";
    this.optionsThresholdEnlarged.tooltip.trigger = "none";
    this.dataThreshold.push(["NO DATA", 0, "0", "#800909"]);
  }

  setChartScroll() {
    const statusLength = this.dataThreshold.length;
    this.optionsThreshold.bar.width =
      statusLength > 3 ? (statusLength * 60).toString() + "%" : "40%";
    this.optionsThresholdEnlarged.bar.width =
      statusLength > 3 ? (statusLength * 60).toString() + "%" : "40%";
  }

  getClaimsThreasholdChartValue() {
    this.isDataPresent = true;
    this.dataThreshold = [];
    this.optionsThreshold.legend.position = "none";
    this.optionsThreshold.tooltip.trigger = "focus";
    this.optionsThresholdEnlarged.legend.position = "none";
    this.optionsThresholdEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.claimsCount;
    if (responseValue !== null && responseValue.length !== 0) {
      this.setChartScroll();
      responseValue.forEach(val => {
        if (val.age === "<0") {
          this.dataThreshold.push([val.age, val.count, val.count, "#800909"]);
        } else if (val.age === "0-2" || val.age === "3-5") {
          this.dataThreshold.push([val.age, val.count, val.count, "#d90f0f"]);
        } else if (val.age === "6-8" || val.age === "9-11") {
          this.dataThreshold.push([val.age, val.count, val.count, "#ebbf1f"]);
        } else {
          this.dataThreshold.push([val.age, val.count, val.count, "#2c699d"]);
        }
      });
    } else {
      this.getClaimsThreasholdChartNoValue();
    }
  }

  getClaimsThreashold() {
    const sts = this.thresholdGroup.get("days").value;
    this.taskManagementService.getClaimsThreashold(sts);
    this.claimsCount = this.taskManagementService.examinerCountResponse;
    this.claimsCount = null;
    this.thresholdSubscription = this.taskManagementService
      .getClaimsThreasholdListner()
      .subscribe((data: any) => {
        this.claimsCount = data.claimsInventoryDto;
        this.dataThreshold = [];
        this.claimsCount.length > 0
          ? this.getClaimsThreasholdChartValue()
          : this.getClaimsThreasholdChartNoValue();
        this.setThresholddays(data.target);
        this.thresholdSubscription.unsubscribe();
      });
    if (this.claimsCount === null) {
      this.getClaimsThreasholdChartNoValue();
    }
    this.isExaminerCountRendered = true;
  }

  onSubmitThreshold() {
    if (this.thresholdGroup.invalid) {
      return;
    }
    this.getClaimsThreashold();
  }

  ngOnDestroy() {
    this.thresholdSubscription.unsubscribe();
  }
}
