import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-transaction-processed-vs-audited",
  templateUrl: "./transaction-processed-vs-audited.component.html",
  styleUrls: ["./transaction-processed-vs-audited.component.css"]
})
export class TransactionProcessedVsAuditedComponent
  implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private processedSubscription: Subscription = new Subscription();
  userProcessedDto: any;
  public enlargedDisplay = false;
  public total = [];
  public hasData = false;
  public editMode = false;
  public editUser = {};
  public isDataPresent = false;
  public titleProcessed = "";
  public typeProcessed = "PieChart";
  public columnNamesProcessed = ["Audited", "Not Audited"];
  public isValid = true;
  public trans = "";
  public maxDate = new Date();
  public completionDates: FormGroup;
  public dataProcessed = [];
  public isProcessedRendered = false;
  @Input()
  public isManager: boolean;
  optionsProcessed = {
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    // is3D: true,
    chartArea: {
      width: "100%",
      height: "100%",
      left: 1,
      right: 1,
      top: 17,
      bottom: 1
    },
    colors: ["#0ca8a6", "#f23860"],
    pieSliceText: "value",
    pieSliceTextStyle: { fontSize: 12 },
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12
      }
    },
    legend: {
      textStyle: { fontSize: 13 },
      position: "labeled",
      alignment: "center"
    },
    pieHole: 0.35
  };
  public role = "";
  public widthProcessed= 380;
  public heightProcessed = 260;

  public optionsProcessedEnlarged = {
    pieSliceTextStyle: { fontSize: 16 },
    pieSliceText: "value",
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
    colors: ["#0ca8a6", "#f23860"],
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13
      }
    },
    legend: {
      fontSize: 12,
      position: "labeled",
      width: "50%",
      alignment: "center"
    },
    pieHole: 0.5
  };
  public barDetails: { type: any; value: any };
  public cols: { header: string; field: string }[];
  public detailsView: boolean;
  public chartDetail: any[];

  constructor(
    private fbProcessed: FormBuilder,
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

    const yester = new Date();
    yester.setDate(yester.getDate() - 1);
    const threeMonthsBefore = new Date(yester.setMonth(yester.getMonth() - 3));

    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    this.completionDates = fbProcessed.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId");
    this.getProcessedDays();
  }

  get getDateRange() {
    return this.completionDates.controls.dateRange;
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  getNoDataChart() {
    this.optionsProcessed.pieSliceText = "none";
    this.optionsProcessed.tooltip.text = "none";
    this.optionsProcessedEnlarged.tooltip.text = "none";
    this.optionsProcessedEnlarged.legend.position = "none";
    this.optionsProcessed.legend.position = "none";
    this.isDataPresent = false;
    this.total = ["0"];
    this.dataProcessed = [];
    this.dataProcessed.push(["NO DATA", 1]);
  }

  getDataChart() {
    this.optionsProcessed.pieSliceText = "value";
    this.optionsProcessed.tooltip.text = "value";
    this.optionsProcessedEnlarged.tooltip.text = "value";
    this.optionsProcessedEnlarged.legend.position = "labeled";
    this.optionsProcessed.legend.position = "labeled";
    this.isDataPresent = true;
    this.dataProcessed = [];
    let responseValue = [];
    this.total = (
      "" + Number(Number(this.userProcessedDto.processedCount))
    ).split("");
    responseValue = this.userProcessedDto.userProcessedDtos;
    this.mapResponseValue(responseValue);
  }

  mapResponseValue(responseValue) {
    responseValue.map(val => {
      this.dataProcessed.push([val.status, val.enrollmentCount]);
    });
  }

  getProcessedDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.completionDates.get("dateRange").value[0];
    this.enrollmentManagerDashboardService.getManagerProcessedVsAudited(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userProcessedDto = this.enrollmentManagerDashboardService.managerProcessedVsAuditedResponse;
    this.userProcessedDto = null;
    this.processedSubscription = this.enrollmentManagerDashboardService
      .getManagerProcessedVsAuditedListner()
      .subscribe(data => {
        this.userProcessedDto = data;
        this.dataProcessed = [];
        if (
          this.userProcessedDto &&
          this.userProcessedDto.userProcessedDtos.length > 0
        ) {
          this.hasData = true;
          this.getDataChart();
        } else {
          this.hasData = false;
          this.getNoDataChart();
        }
        this.processedSubscription.unsubscribe();
      });
    if (this.userProcessedDto === null || this.userProcessedDto === undefined) {
      this.hasData = false;
      this.getNoDataChart();
    }
    this.isProcessedRendered = true;
  }

  getToDateValue() {
    const toDateValue =
      this.completionDates.get("dateRange").value[1] !== null &&
      this.completionDates.get("dateRange").value[1] !== "" &&
      this.completionDates.get("dateRange").value[1] !== undefined
        ? this.completionDates.get("dateRange").value[1]
        : this.completionDates.get("dateRange").value[0];
    return toDateValue;
  }

  validateDates() {
    const fromDateValue = this.completionDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.dateDifference(fromDateValue);
      const isValid = diffInMonths > 6 ? false : true;
      if (!isValid) {
        this.completionDates.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.completionDates.updateValueAndValidity();
      } else {
        this.completionDates.controls.dateRange.setErrors(null);
        this.completionDates.updateValueAndValidity();
        this.onSubmitProcessed();
      }
    } else {
      this.completionDates.controls.dateRange.setErrors(null);
      this.completionDates.updateValueAndValidity();
      this.onSubmitProcessed();
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

  onSubmitProcessed() {
    if (this.completionDates.invalid) {
      return;
    }
    this.getProcessedDays();
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataProcessed.length > 0) {
      const row = e[0].row;
      const transactionType = this.dataProcessed[row][0];
      this.trans = this.dataProcessed[row][0];
      const fromDateValue = this.completionDates.get("dateRange").value[0];
      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(this.getToDateValue(), "yyyy-MM-dd");
      const type = "transaction-processed-vs-audited";
      this.editUser = {
        type,
        transactionType,
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

  private constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.completionDates.get("dateRange").value[0];
    const payload = {
      fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      status: this.barDetails.type
    };
    return payload;
  }

  ngOnDestroy() {
    this.processedSubscription.unsubscribe();
  }
}
