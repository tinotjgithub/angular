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
import { EnrollmentLeadDashboardService } from "../../../enrollment-ops/enrollment-lead/enrollment-lead-dashboard/enrollment-lead-dashboard.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { MultiSelect } from "primeng/multiselect";
@Component({
  selector: "app-production-count-by-transaction-category",
  templateUrl: "./production-count-by-transaction-category.html"
})
export class ProductionCountByTransactionCategoryComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("userGrpSelect", { static: false }) userGrpSelect: MultiSelect;
  @ViewChild("SpecialistSelect", { static: false })
  SpecialistSelect: MultiSelect;
  @ViewChild("CategorySelect", { static: false })
  CategorySelect: MultiSelect;
  private userGrpSubscription: Subscription = new Subscription();
  private specialistSubscription: Subscription = new Subscription();
  reportSubscription: Subscription = new Subscription();
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
  public widthStatus = 540;
  public heightStatus = 250;
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
    pieSliceText: "value",
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      alignment: "center",
      width: "100%",
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
    pieSliceText: "value",
    tooltip: { text: "value", trigger: "focus", showColorCode: true },
    legend: {
      position: "top",
      alignment: "center",
      width: "100%",
      textStyle: {
        fontSize: 13
      }
    }
  };
  userGrp: any[];
  public category = [];
  public catList = [];
  public catArray = [];
  public title = "";
  public isLead = false;
  userGrpArray: any[];
  specialist: any[];
  specialistArray: any[];
  public userGrpList = [];
  public specialistListArray = [];

  constructor(
    private fbStatus: FormBuilder,
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    const today = new Date();
    const todaysDate = new Date(this.datePipe.transform(today, "yyyy-MM-dd"));
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    this.requestCategoryGroup = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required],
      userGrpName: ["", Validators.required],
      specialistName: ["", Validators.required],
      category: [""]
    });
  }
  get getSpecialistsSelect() {
    return this.requestCategoryGroup.controls.specialistName;
  }

  get getCategory() {
    return this.requestCategoryGroup.controls.category;
  }

  get getGroup() {
    return this.requestCategoryGroup.controls.userGrpName;
  }
  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId")
      ? this.secureLocalStorage.getItem("roleId")
      : "";
    this.isLead = this.role === "Enrollment Lead" ? true : false;
    this.title = this.isLead
      ? "Production Count By Category"
      : "Production Count By Transaction Category";
    this.getEnrollLeadCategory();
    this.isLead ? this.getEnrollLeadUserGroups() : "";
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
    if (this.isLead) {
      this.userGrpSelect.updateLabel = function() {
        const grpLabel =
          this.value.length === 1
            ? this.value.length.toString() + " User Group Selected"
            : this.value.length.toString() + " User Groups Selected";
        this.valuesAsString = grpLabel;
      };
      this.SpecialistSelect.updateLabel = function() {
        const SpecialistLabel =
          this.value.length === 1
            ? this.value.length.toString() + " Specialist Selected"
            : this.value.length.toString() + " Specialists Selected";

        this.valuesAsString = SpecialistLabel;
      };
    }
    if (!this.isLead) {
      this.CategorySelect.updateLabel = function() {
        const catLabel =
          this.value.length === 1
            ? this.value.length.toString() + " Category Selected"
            : this.value.length.toString() + " Category Selected";
        this.valuesAsString = catLabel;
      };
    }
  }

  getEnrollLeadCategory() {
    this.category = [];
    this.enrollmentLeadDashboardService.getEnrollLeadCategory(this.role);
    this.category = this.enrollmentLeadDashboardService.enrollLeadCategoryResponse;
    this.categorySubscription = this.enrollmentLeadDashboardService
      .getEnrollLeadCategoryListner()
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
          label: s.category,
          value: {
            id: s.id,
            name: s.category,
            code: s.category
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

  getEnrollLeadUserGroups() {
    this.userGrp = [];
    this.enrollmentLeadDashboardService.getEnrollLeadUserGroups();
    this.userGrp = this.enrollmentLeadDashboardService.enrollLeadUserGroupsResponse;
    this.userGrpSubscription = this.enrollmentLeadDashboardService
      .getEnrollLeadUserGroupsListner()
      .subscribe(data => {
        this.userGrp = data;
        this.mapUsrGrpNames();
        this.userGrpSubscription.unsubscribe();
      });
  }

  getEnrollLeadSpecialists() {
    this.specialist = [];
    if (this.requestCategoryGroup.get("userGrpName").value.length > 0) {
      this.mapUsrGrpNameList(
        this.requestCategoryGroup.get("userGrpName").value
      );
      this.enrollmentLeadDashboardService.getEnrollLeadSpecialists(
        this.mapUserGrp(this.userGrpArray)
      );
      this.specialist = this.enrollmentLeadDashboardService.enrollLeadSpecialistsResponse;
      this.specialistSubscription = this.enrollmentLeadDashboardService
        .getEnrollLeadSpecialistsListner()
        .subscribe(data => {
          this.specialist = data;
          this.mapSpecialists();
          this.specialistSubscription.unsubscribe();
        });
    } else {
      this.requestCategoryGroup.get("specialistName").setValue([]);
    }
  }
  mapUsrGrpNames() {
    const selectedScopes = [];
    if (this.userGrp && this.userGrp.length > 0) {
      this.userGrp.forEach(s => {
        this.userGrpList.push({
          label: s.groupName,
          value: { id: s.groupId, name: s.groupName, code: s.groupName }
        });
      });
      this.userGrpList.forEach(item => selectedScopes.push(item.value));
    }
    this.requestCategoryGroup.get("userGrpName").setValue(selectedScopes);
    this.getEnrollLeadSpecialists();
  }

  mapUserGrp(userGrpName) {
    const userGrpArray = [];
    if (userGrpName !== null && userGrpName.length > 0) {
      for (let index = 0; index <= userGrpName.length; index++) {
        this.userGrpList.forEach(item => {
          if (item.label === userGrpName[index]) {
            userGrpArray.push(item.value.id);
          }
        });
      }
    }
    return userGrpArray;
  }

  mapCat(cate) {
    this.catArray = [];
    if (cate !== null && cate.length > 0) {
      for (let i = 0; i < this.catList.length; i++) {
        cate.forEach(item => {
          if (this.catList[i].value.id === item.id) {
            this.catArray.push(item.name);
          }
        });
      }
    }
    return this.catArray;
  }

  mapUsrGrpNameList(userGrpName) {
    this.userGrpArray = [];
    if (
      userGrpName &&
      userGrpName !== undefined &&
      userGrpName !== "" &&
      userGrpName !== null &&
      userGrpName.length > 0
    ) {
      userGrpName.forEach(q => {
        this.userGrpArray.push(q.name);
      });
    }
  }

  mapSpecialist(specialist) {
    this.specialistArray = [];
    if (
      specialist &&
      specialist !== undefined &&
      specialist !== "" &&
      specialist !== null &&
      specialist.length > 0
    ) {
      specialist.forEach(q => {
        this.specialistArray.push(q.id);
      });
    }
    return this.specialistArray;
  }

  mapSpecialists() {
    this.specialistListArray = [];
    if (this.specialist && this.specialist.length > 0) {
      this.specialist.forEach(s => {
        this.specialistListArray.push({
          label: s.specialistName,
          value: {
            id: s.specialistId,
            name: s.specialistName,
            code: s.specialistName
          }
        });
      });
    }
    const selectedSpecialist = [];
    this.specialistListArray.forEach(item => {
      selectedSpecialist.push(item.value);
    });
    this.requestCategoryGroup
      .get("specialistName")
      .setValue(selectedSpecialist);
    this.onSubmitStatus();
  }

  validateUserGroups() {
    this.updateMultiSelectLabels();
    this.getEnrollLeadSpecialists();
  }

  validateSpecialist() {
    this.updateMultiSelectLabels();
    this.onSubmitStatus();
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
    this.optionsStatus.pieSliceText = "value";
    this.optionsStatus.tooltip.text = "value";
    this.optionsStatus.legend.position = "top";
    this.optionsStatusEnlarged.pieSliceText = "value";
    this.optionsStatusEnlarged.tooltip.text = "value";
    this.optionsStatusEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue = this.userStatusDto;
    this.mapResponseValue(responseValue);
  }

  mapResponseValue(responseValue) {
    responseValue.map(val => {
      this.dataStatus.push([val.category, val.requestCount]);
    });
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataStatus.length > 0) {
      const row = e[0].row;
      const workCategory = this.dataStatus[row][0];
      this.cat = this.dataStatus[row][0];
      const fromDateValue = this.requestCategoryGroup.get("dateRange").value[0];
      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(this.getToDateValue(), "yyyy-MM-dd");
      const type =
        this.role === "Enrollment Lead"
          ? "prod-count-trans-cat-lead"
          : "prod-count-trans-cat";
      this.role === "Enrollment Lead"
        ? (this.editUser = {
            type,
            workCategory,
            fromDate: from,
            toDate: to,
            groupId: this.mapUserGrp(this.userGrpArray),
            specialistId: this.mapSpecialist(
              this.requestCategoryGroup.get("specialistName").value
            )
          })
        : (this.editUser = {
            type,
            workCategory,
            fromDate: from,
            toDate: to
          });
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.requestCategoryGroup.get("dateRange").value[0];
    this.enrollmentLeadDashboardService.completedReqCat(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      !this.isLead
        ? this.mapCat(this.requestCategoryGroup.get("category").value)
        : null,
      this.isLead
        ? this.mapSpecialist(
            this.requestCategoryGroup.get("specialistName").value
          )
        : null,
      this.isLead ? this.mapUserGrp(this.userGrpArray) : null,
      this.role
    );
    this.userStatusDto = this.enrollmentLeadDashboardService.completedReqCatResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentLeadDashboardService
      .completedReqCatListner()
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
      this.isLead &&
      this.isValid &&
      this.requestCategoryGroup.get("userGrpName").value.length > 0 &&
      this.requestCategoryGroup.get("specialistName").value.length > 0
    ) {
      this.getStatusDays();
    } else if (
      !this.isLead &&
      this.isValid &&
      this.requestCategoryGroup.get("category").value.length > 0
    ) {
      this.getStatusDays();
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
    this.userGrpSubscription.unsubscribe();
    this.specialistSubscription.unsubscribe();
  }
}
