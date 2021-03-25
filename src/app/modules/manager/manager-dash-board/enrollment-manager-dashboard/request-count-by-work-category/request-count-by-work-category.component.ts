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
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { MultiSelect } from "primeng/multiselect";
@Component({
  selector: "app-request-count-by-work-category",
  templateUrl: "./request-count-by-work-category.component.html",
  styleUrls: ["./request-count-by-work-category.component.css"]
})
export class RequestCountByWorkCategoryComponent
  implements OnInit, OnDestroy, AfterViewInit {
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
  public columnNamesStatus = ["Status", "Count"];
  public isValid = true;
  public role = "";
  public cat = "";
  public maxDate = new Date();
  public requestCategoryGroup: FormGroup;
  public dataStatus = [];
  public editUser = {};
  public isStatusRendered = false;
  public widthStatus = 550;
  public heightStatus = 270;
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
  public category = [];
  public catList = [];
  public catArray = [];
  public title = "";

  constructor(
    private fbStatus: FormBuilder,
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(yesterdaysDate);
    defaultDateRange.push(yesterdaysDate);
    this.requestCategoryGroup = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required],
      category: [""]
    });
  }

  get getCategory() {
    return this.requestCategoryGroup.controls.category;
  }

  ngOnInit() {
    this.title = "Request Count By Work Category";
    this.getEnrollManagerCategory();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  get getDateRange() {
    return this.requestCategoryGroup.controls.dateRange;
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  updateMultiSelectLabels() {
    this.CategorySelect.updateLabel = function() {
      const catLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Work Category Selected"
          : this.value.length.toString() + " Work Categories Selected";
      this.valuesAsString = catLabel;
    };
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
    const selectedScopes = [];
    if (this.category && this.category.length > 0) {
      this.category.forEach(s => {
        this.catList.push({
          label: s.name,
          value: {
            id: s.id,
            name: s.name,
            code: s.name
          }
        });
      });
      this.catList.forEach(item => selectedScopes.push(item.value));
    }
    this.requestCategoryGroup.get("category").setValue(selectedScopes);
    this.catList.forEach(q => {
      this.catArray.push(q.value.id);
    });
    this.onSubmitStatus();
  }

  mapCat(cate) {
    const catArr = [];
    if (cate !== null && cate.length > 0) {
      for (let i = 0; i < this.catList.length; i++) {
        cate.forEach(item => {
          if (this.catList[i].value.id === item.id) {
            catArr.push(item.id);
          }
        });
      }
    }
    return catArr;
  }

  validateCategory() {
    this.updateMultiSelectLabels();
    this.onSubmitStatus();
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
      const workCategoryList = [];
      workCategoryList.push(this.dataStatus[row][0]);
      this.cat = this.dataStatus[row][0];
      const fromDateValue = this.requestCategoryGroup.get("dateRange").value[0];
      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(this.getToDateValue(), "yyyy-MM-dd");
      const type = "request-count-wrk-cat";
      this.editUser = {
        type,
        workCategoryList,
        fromDate: from,
        toDate: to
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  requestCountCategory() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.requestCategoryGroup.get("dateRange").value[0];
    this.enrollmentManagerDashboardService.requestCountByWorkCategory(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapCat(this.requestCategoryGroup.get("category").value)
    );
    this.userStatusDto = this.enrollmentManagerDashboardService.requestCountByCategoryResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentManagerDashboardService
      .requestCountByWorkCategoryListner()
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

  getToDateValue() {
    const toDateValue =
      this.requestCategoryGroup.get("dateRange").value[1] !== null &&
      this.requestCategoryGroup.get("dateRange").value[1] !== "" &&
      this.requestCategoryGroup.get("dateRange").value[1] !== undefined
        ? this.requestCategoryGroup.get("dateRange").value[1]
        : this.requestCategoryGroup.get("dateRange").value[0];
    return toDateValue;
  }

  validateDates() {
    const fromDateValue = this.requestCategoryGroup.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.dateDifference(fromDateValue);
      this.isValid = diffInMonths < 6 ? true : false;
    } else {
      this.isValid = true;
    }
  }

  dateDifference(fromDateValue) {
    const fromDate = new Date(fromDateValue[0]);
    const toDate = new Date(fromDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  onSubmitStatus() {
    if (
      this.isValid &&
      this.requestCategoryGroup.get("category").value !== "" &&
      this.requestCategoryGroup.get("category").value.length > 0
    ) {
      this.requestCountCategory();
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
