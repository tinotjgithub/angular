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
  selector: "app-claims-open-inventory-sla",
  templateUrl: "./claims-open-inventory-sla.component.html",
  styleUrls: ["./claims-open-inventory-sla.component.css"]
})
export class ClaimsOpenInventorySlaComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("barchart", { static: false }) barchart;
  public dataInventory = [];
  public editUser = {};
  public isDataPresent = false;
  claimsCount: any;
  public editMode = false;
  public isSLAArray = false;
  enlargedDisplay = false;
  private userExaminerCountReportDto: any;
  submittedExaminerCount = false;
  private ageSubscription: Subscription = new Subscription();
  private reportSubscription: Subscription = new Subscription();
  private leadSubscription: Subscription = new Subscription();
  private daysSubscription: Subscription = new Subscription();
  public titleExaminerCount = "";
  public slaDays = "";
  public slaDaysArray = [];
  public daysList = [];
  public typeExaminerCount = "ColumnChart";
  // stackedBar-Manager-1
  public columnNamesExaminerCount = [
    "",
    "Claim Count",
    { role: "annotation" },
    { role: "style" }
  ];
  public optionsOpenInv = {
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

  public optionsOpenInvEnlarged = {
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
  public invGroup: FormGroup;
  public maxDate = new Date();
  days: any[];
  daysArray: any[];

  constructor(
    private fbExaminerCount: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe
  ) {
    this.invGroup = fbExaminerCount.group({
      days: ["", Validators.required]
    });
  }

  get getdays() {
    return this.invGroup.controls.days;
  }

  ngOnInit() {
    this.invGroup.get("days").setValue("Default");
    this.onSubmitOpenInv();
  }

  ngAfterViewInit() {}

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const age = this.dataInventory[row][0];
      const claimCount = this.dataInventory[row][1];
      this.editUser = {
        age,
        claimCount,
        type: "open-inventory"
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  setSlaDays(targetArray) {
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

  getClaimsOpenInventoryChartNoValue() {
    this.isDataPresent = false;
    this.dataInventory = [];
    this.optionsOpenInv.legend.position = "none";
    this.optionsOpenInv.tooltip.trigger = "none";
    this.optionsOpenInvEnlarged.legend.position = "none";
    this.optionsOpenInvEnlarged.tooltip.trigger = "none";
    this.dataInventory.push(["NO DATA", 0, "0", "#800909"]);
  }

  setChartScroll() {
    const statusLength = this.dataInventory.length;
    this.optionsOpenInv.bar.width =
      statusLength > 3 ? (statusLength * 60).toString() + "%" : "40%";
    this.optionsOpenInvEnlarged.bar.width =
      statusLength > 3 ? (statusLength * 60).toString() + "%" : "40%";
  }

  getClaimsOpenInventoryChartValue() {
    this.isDataPresent = true;
    this.dataInventory = [];
    this.optionsOpenInv.legend.position = "none";
    this.optionsOpenInv.tooltip.trigger = "focus";
    this.optionsOpenInvEnlarged.legend.position = "none";
    this.optionsOpenInvEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.claimsCount;
    if (responseValue !== null && responseValue.length !== 0) {
      this.setChartScroll();
      responseValue.forEach(val => {
        if (val.age === "<0") {
          this.dataInventory.push([val.age, val.count, val.count, "#800909"]);
        } else if (val.age === "0-2" || val.age === "3-5") {
          this.dataInventory.push([val.age, val.count, val.count, "#d90f0f"]);
        } else if (val.age === "6-8" || val.age === "9-11") {
          this.dataInventory.push([val.age, val.count, val.count, "#ebbf1f"]);
        } else {
          this.dataInventory.push([val.age, val.count, val.count, "#2c699d"]);
        }
      });
    } else {
      this.getClaimsOpenInventoryChartNoValue();
    }
  }

  getClaimsOpenInventory() {
    const sts = this.invGroup.get("days").value;
    this.taskManagementService.getClaimsOpenInventory(sts);
    this.claimsCount = this.taskManagementService.claimsOpenInvResponse;
    this.claimsCount = null;
    this.ageSubscription = this.taskManagementService
      .getClaimsOpenInventoryListner()
      .subscribe((data: any) => {
        this.claimsCount = data.claimsInventoryDto;
        this.dataInventory = [];
        this.claimsCount.length > 0
          ? this.getClaimsOpenInventoryChartValue()
          : this.getClaimsOpenInventoryChartNoValue();
        this.setSlaDays(data.target);
        this.ageSubscription.unsubscribe();
      });
    if (this.claimsCount === null) {
      this.getClaimsOpenInventoryChartNoValue();
    }
    this.isExaminerCountRendered = true;
  }

  onSubmitOpenInv() {
    if (this.invGroup.invalid) {
      return;
    }
    this.submittedExaminerCount = true;
    this.getClaimsOpenInventory();
  }

  ngOnDestroy() {
    this.ageSubscription.unsubscribe();
  }
}
