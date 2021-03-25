import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { DatePipe } from "@angular/common";
import { MultiSelect } from "primeng/multiselect";
@Component({
  selector: "app-open-inventory-by-work-category",
  templateUrl: "./open-inventory-by-work-category.component.html",
  styleUrls: ["./open-inventory-by-work-category.component.css"]
})
export class OpenInventoryByWorkCategoryComponent implements OnInit, OnDestroy {
  @ViewChild("CategorySelect", { static: false })
  CategorySelect: MultiSelect;
  categorySubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  userStatusDto: any;
  public colors = [
    "#4973a6",
    "#776fb8",
    "#b260b3",
    "#e44b94",
    "#ff4461",
    "#ff6017",
    "#6e2550",
    "#a63777",
    "#c03a71",
    "#d74268",
    "#ea4f5b",
    "#f7614d",
    "#ff763b",
    "#ff8e26",
    "#ffa600"
  ];
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public isDataPresent = false;
  public typeStatus = "PieChart";
  public editMode = false;
  public columnNamesStatus = ["Work Category", "Count"];
  public isValid = true;
  public role = "";
  public cat = "";
  public dataStatus = [];
  public editUser = {};
  public isStatusRendered = false;
  public widthStatus = 560;
  public heightStatus = 280;
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 50,
      right: 50,
      top: 17,
      bottom: 20
    },
    colors: this.colors,
    pieSliceText: "value-and-percentage",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };

  public optionsStatusEnlarged = {
    pieSliceTextStyle: { fontSize: 16 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 60,
      right: 20,
      top: 30,
      bottom: 20
    },
    colors: this.colors,
    pieSliceText: "value-and-percentage",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true
    },
    legend: {
      position: "top",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };
  public title = "";

  constructor(
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.title = "Open Inventory By Work Category";
    this.requestCountCategory();
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  getNoDataChart() {
    this.dataStatus = [];
    this.dataStatus.push(["NO DATA", 1]);
    this.optionsStatus.pieSliceText = "label";
    this.optionsStatus.tooltip.text = "none";
    this.optionsStatus.legend.position = "none";
    this.optionsStatusEnlarged.pieSliceText = "label";
    this.optionsStatusEnlarged.tooltip.text = "none";
    this.optionsStatusEnlarged.legend.position = "none";
  }

  getDataChart() {
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value-and-percentage";
    this.optionsStatus.tooltip.text = "value-and-percentage";
    this.optionsStatus.legend.position = "top";
    this.optionsStatusEnlarged.pieSliceText = "value-and-percentage";
    this.optionsStatusEnlarged.tooltip.text = "value-and-percentage";
    this.optionsStatusEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue = this.userStatusDto;
    this.mapResponseValue(responseValue);
  }

  mapResponseValue(responseValue) {
    responseValue.map(val => {
      this.dataStatus.push([val.requestType, val.requestCount]);
    });
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataStatus.length > 0) {
      const row = e[0].row;
      const workCategory = this.dataStatus[row][0];
      this.cat = this.dataStatus[row][0];
      const type = "open-inv-by-WorkCategory";
      this.editUser = {
        type,
        workCategory
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  requestCountCategory() {
    const todaysDate = new Date();
    const defaultFrom = new Date("01-01-1970");
    const fromDate = this.datePipe.transform(defaultFrom, "yyyy-MM-dd");
    const toDate = this.datePipe.transform(todaysDate, "yyyy-MM-dd");
    this.enrollmentManagerDashboardService.getOpenInventoryByWorkCategory(
      fromDate,
      toDate
    );
    this.userStatusDto = this.enrollmentManagerDashboardService.openInventoryByCategoryResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentManagerDashboardService
      .getOpenInventoryByWorkCategoryListner()
      .subscribe((data: any) => {
        this.userStatusDto = data;
        this.dataStatus = [];
        if (this.userStatusDto && this.userStatusDto.length > 0) {
          this.isDataPresent = true;
          this.getDataChart();
        } else {
          this.isDataPresent = false;
          this.getNoDataChart();
        }
        this.statusSubscription.unsubscribe();
      });
    if (this.userStatusDto === null || this.userStatusDto === undefined) {
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
