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
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";

@Component({
  selector: "app-open-inventory-nearing-sla-days",
  templateUrl: "./open-inventory-nearing-sla-days.component.html",
  styleUrls: ["./open-inventory-nearing-sla-days.component.css"]
})
export class OpenInventoryNearingSlaDaysComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("barchart", { static: false }) barchart;
  public dataInventory = [];
  public editUser = {};
  public categoryName = "";
  public isDataPresent = false;
  transactionsCount: any;
  public editMode = false;
  public isSLAArray = false;
  enlargedDisplay = false;
  submittedExaminerCount = false;
  private ageSubscription: Subscription = new Subscription();
  private categorySubscription: Subscription = new Subscription();
  public titleExaminerCount = "";
  public slaDays = "";
  public slaDaysArray = [];
  public categoryList = [];
  public age = "";
  public typeExaminerCount = "ColumnChart";
  public columnNamesExaminerCount = [
    "",
    "Transaction Count",
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
    colors: ["#4973a6"],
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
    colors: ["#4973a6"],
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
  category: any[];
  categoryArray: any[];

  constructor(
    private fbSLACount: FormBuilder,
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe
  ) {
    this.invGroup = fbSLACount.group({
      category: ["", Validators.required]
    });
  }

  get getcategory() {
    return this.invGroup.controls.category;
  }

  ngOnInit() {
    this.getEnrollManagerCategory();
  }

  getEnrollManagerCategory() {
    this.category = [];
    this.enrollmentManagerDashboardService.getEnrollManagerCategory();
    this.category = this.enrollmentManagerDashboardService.enrollManagerCategoryResponse;
    this.categorySubscription = this.enrollmentManagerDashboardService
      .getEnrollManagerCategoryListner()
      .subscribe(data => {
        this.category = data;
        this.mapCategory();
        this.categorySubscription.unsubscribe();
      });
  }

  mapCategory() {
    this.categoryList = [];
    const selectedScopes = [];
    if (this.category && this.category.length > 0) {
      this.category.forEach(s => {
        this.categoryList.push({
          label: s.name,
          value: s.id
        });
      });
      this.categoryList.forEach(item => selectedScopes.push(item.value));
    }
    this.invGroup.get("category").setValue(selectedScopes[0]);
    this.categoryName = this.categoryList[0].label;
    this.onSubmitOpenInv();
  }

  mapCategoryName(catId) {
    let catName = "";
    if (this.category && this.category.length > 0) {
      this.categoryList.forEach(s => {
        if (catId === s.value) {
          catName = s.label;
        }
      });
    }
    return this.categoryName;
  }

  ngAfterViewInit() {}

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const age = this.dataInventory[row][0];
      this.age = age;
      const ageVal = this.formatRequest(age);
      this.editUser = {
        workCategory: this.mapCategoryName(this.invGroup.get("category").value),
        type: "open-inventory-sla-days",
        ageStartDay: ageVal.startDay,
        ageEndDay: ageVal.endDay,
        ageType: ageVal.type,
        workCategoryId: this.invGroup.get("category").value
      };
      this.editMode = true;
    }
  }

  formatRequest(age) {
    let request: { startDay: string; endDay: string; type: string };
    if (age === "<0") {
      request = { startDay: "0", endDay: "0", type: "lessThanZero" };
    } else if (age.includes(">")) {
      const day = age.split(">");
      request = { startDay: day[1], endDay: day[1], type: "greaterThanSLA" };
    } else if (!age.includes(">") && !age.includes("<") && !age.includes("-")) {
      request = { startDay: age, endDay: age, type: "single" };
    } else {
      const day = age.split("-");

      const firstRange = day[0];
      const secondRange = day[1];
      request = { startDay: firstRange, endDay: secondRange, type: "range" };
    }
    return request;
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  setSlaDays(targetArray) {
    let largest = 0;
    targetArray.forEach(elem => {
      if (largest < elem.target) {
        largest = elem.target;
      }
    });
    const isSame = targetArray.every(
      (val, i, arr) => val.target === arr[0].target
    );
    if (targetArray.length === 1 || isSame) {
      this.isSLAArray = false;
      this.slaDays = "";
      this.slaDays = largest.toString();
    } else {
      this.isSLAArray = true;
    }
    this.slaDaysArray = [];
    targetArray.forEach(elem => {
      const fromMonth = this.datePipe.transform(elem.fromMonth, "MMMM");
      const toMonth = this.datePipe.transform(elem.toMonth, "MMMM");
      if (fromMonth !== toMonth) {
        this.slaDaysArray.push(
          fromMonth + "-" + toMonth + " : " + elem.target.toString()
        );
      } else {
        this.slaDaysArray.push(fromMonth + " : " + elem.target.toString());
      }
    });
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  getTransactionsOpenInventoryChartNoValue() {
    this.isDataPresent = false;
    this.dataInventory = [];
    this.optionsOpenInv.tooltip.trigger = "none";
    this.optionsOpenInvEnlarged.tooltip.trigger = "none";
    this.dataInventory.push(["NO DATA", 0, "0", "#4973a6"]);
    this.isSLAArray = false;
    this.slaDays = "";
  }

  setChartScroll() {
    const statusLength = this.dataInventory.length;
    this.optionsOpenInv.bar.width =
      statusLength > 3 ? (statusLength * 60).toString() + "%" : "40%";
    this.optionsOpenInvEnlarged.bar.width =
      statusLength > 3 ? (statusLength * 60).toString() + "%" : "40%";
  }

  getTransactionsOpenInventoryChartValue() {
    this.isDataPresent = true;
    this.dataInventory = [];
    this.optionsOpenInv.tooltip.trigger = "focus";
    this.optionsOpenInvEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.transactionsCount;
    if (responseValue !== null && responseValue.length !== 0) {
      this.setChartScroll();
      responseValue.forEach(val => {
        this.dataInventory.push([val.age, val.count, val.count, "#4973a6"]);
      });
    } else {
      this.getTransactionsOpenInventoryChartNoValue();
    }
  }

  getTransactionsOpenInventory() {
    const todaysDate = new Date();
    const defaultFrom = new Date("01-01-1970");
    const fromDateValue = defaultFrom;
    const toDateValue = todaysDate;
    const workCategoryId = this.invGroup.get("category").value;
    this.categoryList.forEach(val => {
      if (val.value === workCategoryId) {
        this.categoryName = val.label;
      }
    });
    this.enrollmentManagerDashboardService.getTransactionsOpenInventorySla(
      workCategoryId,
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.transactionsCount = this.enrollmentManagerDashboardService.transactionsOpenInvSlaResponse;
    this.transactionsCount = null;
    this.ageSubscription = this.enrollmentManagerDashboardService
      .getTransactionsOpenInventorySlaListner()
      .subscribe((data: any) => {
        this.transactionsCount = data.enrollmentInventoryDto;
        this.dataInventory = [];
        this.transactionsCount.length > 0
          ? this.getTransactionsOpenInventoryChartValue()
          : this.getTransactionsOpenInventoryChartNoValue();
        this.setSlaDays(data.target);
        this.ageSubscription.unsubscribe();
      });
    if (this.transactionsCount === null) {
      this.getTransactionsOpenInventoryChartNoValue();
    }
    this.isExaminerCountRendered = true;
  }

  onSubmitOpenInv() {
    if (this.invGroup.invalid) {
      return;
    }
    this.submittedExaminerCount = true;
    this.getTransactionsOpenInventory();
  }

  ngOnDestroy() {
    this.ageSubscription.unsubscribe();
  }
}
