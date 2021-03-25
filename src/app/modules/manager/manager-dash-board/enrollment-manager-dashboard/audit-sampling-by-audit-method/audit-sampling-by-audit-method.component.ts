import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { MultiSelect } from "primeng/multiselect";
@Component({
  selector: "app-audit-sampling-by-audit-method",
  templateUrl: "./audit-sampling-by-audit-method.component.html",
  styleUrls: ["./audit-sampling-by-audit-method.component.css"]
})
export class AuditSamplingByAuditMethodComponent implements OnInit, OnDestroy {
  private statusSubscription: Subscription = new Subscription();
  userStatusDto: any;
  public colors = [
    "#006272",
    "#3aa96f",
    "#edb21c",
    "#78bc5b",
    "#b9cb47",
    " #007b7d",
    "#00937c"
  ];
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public isDataPresent = false;
  public typeStatus = "PieChart";
  public editMode = false;
  public columnNamesStatus = ["Sampling Method", "Count"];
  public isValid = true;
  public role = "";
  public cat = "";
  public maxDate = new Date();
  public requestSamplingMethodGroup: FormGroup;
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
    pieSliceText: "percentage",
    tooltip: {
      text: "percentage",
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
    pieSliceText: "percentage",
    tooltip: {
      text: "percentage",
      trigger: "focus",
      showColorCode: true
    },
    legend: {
      position: "top",
      alignment: "center",
      textStyle: {
        fontSize: 13
      }
    }
  };

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
    this.requestSamplingMethodGroup = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.title = "Audit Sampling By Audit Method";
    this.onSubmitStatus();
  }

  get getDateRange() {
    return this.requestSamplingMethodGroup.controls.dateRange;
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
    this.optionsStatus.pieSliceText = "percentage";
    this.optionsStatus.tooltip.text = "percentage";
    this.optionsStatus.legend.position = "top";
    this.optionsStatusEnlarged.pieSliceText = "percentage";
    this.optionsStatusEnlarged.tooltip.text = "percentage";
    this.optionsStatusEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue = this.userStatusDto;
    this.mapResponseValue(responseValue);
  }

  mapResponseValue(responseValue) {
    responseValue.map(val => {
      this.dataStatus.push([val.samplingMethod, val.transactionCount]);
    });
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataStatus.length > 0) {
      const row = e[0].row;
      const samplingMethod = [];
      samplingMethod.push(this.dataStatus[row][0]);
      this.cat = this.dataStatus[row][0];
      const fromDateValue = this.requestSamplingMethodGroup.get("dateRange")
        .value[0];
      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(this.getToDateValue(), "yyyy-MM-dd");
      const type = "audit-sampling-by-audit";
      this.editUser = {
        type,
        samplingMethod,
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

  auditSamplingAuditMethod() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.requestSamplingMethodGroup.get("dateRange")
      .value[0];
    this.enrollmentManagerDashboardService.getAuditSamplingByAuditMethod(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.userStatusDto = this.enrollmentManagerDashboardService.auditSamplingByAuditMethodResponse;
    this.userStatusDto = null;
    this.statusSubscription = this.enrollmentManagerDashboardService
      .getAuditSamplingByAuditMethodListner()
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
      this.requestSamplingMethodGroup.get("dateRange").value[1] !== null &&
      this.requestSamplingMethodGroup.get("dateRange").value[1] !== "" &&
      this.requestSamplingMethodGroup.get("dateRange").value[1] !== undefined
        ? this.requestSamplingMethodGroup.get("dateRange").value[1]
        : this.requestSamplingMethodGroup.get("dateRange").value[0];
    return toDateValue;
  }

  validateDates() {
    const fromDateValue = this.requestSamplingMethodGroup.get("dateRange")
      .value;
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
      this.auditSamplingAuditMethod();
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
