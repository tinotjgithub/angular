import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentLeadDashboardService } from "./../enrollment-lead-dashboard.service";

@Component({
  selector: "app-audit-by-request-type",
  templateUrl: "./audit-by-request-type.component.html",
  styleUrls: ["./audit-by-request-type.component.css"]
})
export class AuditByRequestTypeComponent implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  userStatusDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public typeStatus = "PieChart";

  public columnNamesStatus = ["Status", "Count"];
  public isValid = true;
  public editMode = false;
  public maxDate = new Date();
  public statusDates: FormGroup;
  public editUser = {};
  public isDataPresent = false;
  public dataStatus = [];
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
    colors: ["#872b45", "#b13e45", "#d55a3d", "#f07d2b", "#ffa600"],
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
    colors: ["#872b45", "#b13e45", "#d55a3d", "#f07d2b", "#ffa600"],
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

  constructor(
    private fbStatus: FormBuilder,
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    public datePipe: DatePipe
  ) {
    const today = new Date();
    const todaysDate = new Date(this.datePipe.transform(today, "yyyy-MM-dd"));
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    this.statusDates = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.getStatusDays();
  }

  get getDateRange() {
    return this.statusDates.controls.dateRange;
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  getNoDataChart() {
    this.isDataPresent = false;
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
    this.isDataPresent = true;
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value";
    this.optionsStatus.tooltip.text = "value";
    this.optionsStatus.legend.position = "top";
    let responseValue = [];
    responseValue = this.userStatusDto.userStatusDtos;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "Workbasket",
        claimCount: 0
      },
      { status: "Reconciliation", claimCount: 0 },
      { status: "Fallout", claimCount: 0 },
      { status: "ID Card", claimCount: 0 },
      { status: "Group Renewal", claimCount: 0 }
    );
    this.mapResponseValue(responseValue, dataStatusArray);
  }

  mapResponseValue(responseValue, dataStatusArray) {
    responseValue.map(val => {
      if (val.status === "Workbasket") {
        dataStatusArray[0].claimCount = val.claimCount;
      } else if (val.status === "Reconciliation") {
        dataStatusArray[1].claimCount = val.claimCount;
      } else if (val.status === "Fallout") {
        dataStatusArray[2].claimCount = val.claimCount;
      } else if (val.status === "ID Card") {
        dataStatusArray[3].claimCount = val.claimCount;
      } else {
        dataStatusArray[4].claimCount = val.claimCount;
      }
    });
    dataStatusArray.map(val => {
      this.dataStatus.push([val.status, val.claimCount]);
    });
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.statusDates.get("dateRange").value[0];
    this.enrollmentLeadDashboardService.getAuditByRequestType(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userStatusDto = this.enrollmentLeadDashboardService.auditByRequestTypeResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentLeadDashboardService
      .getAuditByRequestTypeListner()
      .subscribe((data: any) => {
        this.userStatusDto = data;
        this.dataStatus = [];
        this.userStatusDto && this.userStatusDto.userStatusDtos.length > 0
          ? this.getDataChart()
          : this.getNoDataChart();
        this.statusSubscription.unsubscribe();
      });
    if (this.userStatusDto === null || this.userStatusDto === undefined) {
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  getToDateValue() {
    const toDateValue =
      this.statusDates.get("dateRange").value[1] !== null &&
      this.statusDates.get("dateRange").value[1] !== "" &&
      this.statusDates.get("dateRange").value[1] !== undefined
        ? this.statusDates.get("dateRange").value[1]
        : this.statusDates.get("dateRange").value[0];
    return toDateValue;
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const status = this.dataStatus[row][0];
      const count = this.dataStatus[row][1];
      this.editUser = {
        type: "audit-by-request-type",
        status: status,
        count: count
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  validateDates() {
    const fromDateValue = this.statusDates.get("dateRange").value;
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
    if (this.isValid) {
      this.getStatusDays();
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
