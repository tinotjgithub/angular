import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentLeadDashboardService } from "./../enrollment-lead-dashboard.service";

@Component({
  selector: "app-lead-rebuttal-status",
  templateUrl: "./lead-rebuttal-status.component.html",
  styleUrls: ["./lead-rebuttal-status.component.css"]
})
export class LeadRebuttalStatusComponent implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  userStatusDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public isDataPresent = false;
  public titleStatus = "";
  public status = "";
  public typeStatus = "PieChart";
  public total = [];
  public columnNamesStatus = ["Status", "Count"];
  public isValid = true;
  public maxDate = new Date();
  public statusDates: FormGroup;
  public dataStatus = [];
  public editUser = {};
  public editMode = false;
  public isStatusRendered = false;
  public widthStatus = 380;
  public heightStatus = 260;
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 12 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      width: "100%",
      height: "100%",
      left: 1,
      right: 1,
      top: 17,
      bottom: 1
    },
    colors: ["#00aadf", "#ff5c5d", "#75bb00"],
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
    },
    pieHole: 0.35
  };

  public optionsStatusEnlarged = {
    pieSliceTextStyle: { fontSize: 16 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      width: "100%",
      left: 2,
      right: 2,
      top: 20,
      bottom: 10
    },
    colors: ["#00aadf", "#ff5c5d", "#75bb00"],
    pieSliceText: "value",
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true
    },
    legend: {
      position: "top",
      alignment: "center",
      width: "100%",
      textStyle: {
        fontSize: 14
      }
    },
    pieHole: 0.5
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
    this.getRebuttalStatus();
  }

  get getDateRange() {
    return this.statusDates.controls.dateRange;
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  getNoDataChart() {
    this.isDataPresent = false;
    this.total = ["0"];
    this.dataStatus = [];
    this.dataStatus.push(["NO DATA", 1]);
    this.optionsStatus.pieSliceText = "label";
    this.optionsStatus.tooltip.text = "none";
    this.optionsStatus.legend.position = "none";
  }

  getDataChart() {
    this.isDataPresent = true;
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value";
    this.optionsStatus.tooltip.text = "value";
    this.optionsStatus.legend.position = "top";
    let responseValue = [];
    this.total = ("" + Number(Number(this.userStatusDto.totalRebuttalCount))).split("");
    responseValue = this.userStatusDto.userRebuttalDtos;
    responseValue.map(val => {
      this.dataStatus.push([val.status, val.transactionCount]);
    });
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const toDateValue = this.getToDateValue();
      const fromDateValue = this.statusDates.get("dateRange").value[0];
      const row = e[0].row;
      const status = this.dataStatus[row][0];
      this.status = status;
      this.editUser = {
        type: "rebuttal-status",
        status,
        fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd")
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getRebuttalStatus() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.statusDates.get("dateRange").value[0];
    this.enrollmentLeadDashboardService.getLeadRebuttalStatus(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userStatusDto = this.enrollmentLeadDashboardService.leadRebuttalStatusResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentLeadDashboardService
      .getLeadRebuttalStatusListner()
      .subscribe((data: any) => {
        this.userStatusDto = data;
        this.dataStatus = [];
        this.userStatusDto && this.userStatusDto.userRebuttalDtos.length > 0
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
    if (this.isValid) {
      this.getRebuttalStatus();
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
      this.getRebuttalStatus();
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
