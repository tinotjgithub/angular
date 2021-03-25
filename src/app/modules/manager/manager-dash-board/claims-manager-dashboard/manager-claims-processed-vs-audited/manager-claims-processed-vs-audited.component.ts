import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-manager-claims-processed-vs-audited",
  templateUrl: "./manager-claims-processed-vs-audited.component.html"
})
export class ManagerClaimsProcessedVsAuditedComponent
  implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private processedSubscription: Subscription = new Subscription();
  userProcessedDto: any;
  public displayEnlarged = false;
  public total = [];
  public hasData = false;
  public isDataPresent = false;
  public titleProcessed = "";
  public typeProcessed = "PieChart";
  public columnNamesProcessed = ["Audited", "Not Audited"];
  public isValid = true;
  public maxDate = new Date();
  public processedDates: FormGroup;
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
      left: 1,
      right: 1,
      top: 17,
      bottom: 10,
      width: "100%",
      height: "100%"
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
    pieHole: 0.4
  };
  public role = "";
  public widthProcessed = 340;
  public heightProcessed = 210;

  public optionsProcessedEnlarged = {
    pieSliceTextStyle: { fontSize: 14 },
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
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService,
    private chartDetailService: ChartDetailService,
    private notifierService: NotifierService
  ) {
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

    const yester = new Date();
    yester.setDate(yester.getDate() - 1);
    const threeMonthsBefore = new Date(yester.setMonth(yester.getMonth() - 3));

    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    this.processedDates = fbProcessed.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId");
    this.getProcessedDays();
  }

  get getDateRange() {
    return this.processedDates.controls.dateRange;
  }

  showDialog() {
    this.displayEnlarged = true;
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
      this.dataProcessed.push([val.status, val.claimCount]);
    });
  }

  getProcessedDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates.get("dateRange").value[0];
    this.taskManagementService.getManagerProcessedScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.role
    );
    this.userProcessedDto = this.taskManagementService.processedScoreResponse;
    this.userProcessedDto = null;
    this.processedSubscription = this.taskManagementService
      .getManagerProcessedScoresListner()
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
      this.processedDates.get("dateRange").value[1] !== null &&
      this.processedDates.get("dateRange").value[1] !== "" &&
      this.processedDates.get("dateRange").value[1] !== undefined
        ? this.processedDates.get("dateRange").value[1]
        : this.processedDates.get("dateRange").value[0];
    return toDateValue;
  }

  validateDates() {
    const fromDateValue = this.processedDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.dateDifference(fromDateValue);
      const isValid = diffInMonths > 6 ? false : true;
      if (!isValid) {
        this.processedDates.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.processedDates.updateValueAndValidity();
      } else {
        this.processedDates.controls.dateRange.setErrors(null);
        this.processedDates.updateValueAndValidity();
        this.onSubmitProcessed();
      }
    } else {
      this.processedDates.controls.dateRange.setErrors(null);
      this.processedDates.updateValueAndValidity();
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
    if (this.processedDates.invalid) {
      return;
    }
    this.getProcessedDays();
  }

  selectBar(bar, total?) {
    this.barDetails = total
      ? {
          type: "All",
          value: 0
        }
      : this.getBarDetails(bar[0]);
    if (this.barDetails && typeof this.barDetails.type === "string") {
      this.cols = this.setColumns();
      const payload = this.constructPayload();
      this.chartDetail = [];
      this.chartDetailService
        .processedVsAuditedDetails(payload)
        .subscribe(res => {
          this.chartDetail = res;
        });
      this.detailsView = true;
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.dataProcessed[bar.row];
    const barDetails = {
      type: barValue[0],
      value: barValue[1]
    };
    return barDetails;
  }

  setColumns() {
    const cols = [
      { header: "Claim ID", field: "claimId" },
      { header: "Audited", field: "audited" },
      { header: "Claim Age (In Days)", field: "claimAge" },
      { header: "Examiner Name", field: "examinerName" },
      { header: "Processed Date", field: "processedDate" },
      { header: "Claim Type", field: "claimType" },
      { header: "Claim Status", field: "claimStatus" },
      { header: "Billed Amount ($)", field: "billedAmount" },
      { header: "Allowed Amount($)", field: "allowedAmount" },
      { header: "Paid Amount($)", field: "paidAmount" }
    ];
    return cols;
  }

  downloadExcel() {
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    const payload = this.constructPayload();
    this.chartDetailService.processedVsAuditedExcel(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: "success",
        message: "Report is generated."
      });
      const responseBody = res.body;
      const blob = new Blob([responseBody], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const today = new Date();
      const dateString = this.datePipe.transform(today, "MMddyyyy");
      const fileName = `Claims Processed Vs Audited-${dateString}`;
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }

  private constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates.get("dateRange").value[0];
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
