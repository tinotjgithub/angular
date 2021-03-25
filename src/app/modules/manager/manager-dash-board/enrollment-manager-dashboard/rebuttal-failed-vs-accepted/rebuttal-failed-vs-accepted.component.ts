import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-rebuttal-failed-vs-accepted",
  templateUrl: "./rebuttal-failed-vs-accepted.component.html",
  styleUrls: ["./rebuttal-failed-vs-accepted.component.css"]
})
export class RebuttalFailedVsAcceptedComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("AuditorSelect", { static: false }) AuditorSelect: MultiSelect;
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
  public columnNamesProcessed = ["Rebuttal Failed", "Rebuttal Accepted"];
  public isValid = true;
  auditor: any[];
  auditorArray: any[];
  public isAuditor = false;
  public auditorName = "";
  public auditorListArray = [];
  public trans = "";
  public maxDate = new Date();
  public processedDates: FormGroup;
  public dataProcessed = [];
  private auditorSubscription: Subscription = new Subscription();
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
    colors: ["#00aadf", "#ff5c5d"],
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
  public widthProcessed = 380;
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
    colors: ["#00aadf", "#ff5c5d"],
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
    const todaysDate = new Date();
    const defaultDateRange = [];
    const dateToday = new Date();
    const y = dateToday.getFullYear();
    const m = dateToday.getMonth();
    const firstDay = new Date(y, m, 1);
    defaultDateRange.push(firstDay);
    defaultDateRange.push(todaysDate);
    this.processedDates = fbProcessed.group({
      dateRange: [defaultDateRange, Validators.required],
      auditorName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId");
    this.getEnrollManagerAuditors();
  }
  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }
  get getAuditorsSelect() {
    return this.processedDates.controls.auditorName;
  }
  get getDateRange() {
    return this.processedDates.controls.dateRange;
  }
  getEnrollManagerAuditors() {
    this.auditor = [];

    this.enrollmentManagerDashboardService.getEnrollManagerAuditorsList();
    this.auditor = this.enrollmentManagerDashboardService.enrollManagerAuditorsListResponse;
    this.auditorSubscription = this.enrollmentManagerDashboardService
      .getEnrollManagerAuditorsListListner()
      .subscribe(data => {
        this.auditor = data;
        this.mapAuditors();
        this.auditorSubscription.unsubscribe();
      });
  }

  mapAuditors() {
    this.auditorListArray = [];
    if (this.auditor && this.auditor.length > 0) {
      this.auditor.forEach(s => {
        this.auditorListArray.push({
          label: s.auditorName,
          value: {
            id: s.auditorId,
            name: s.auditorName,
            code: s.auditorName
          }
        });
      });
    }
    const selectedAuditor = [];
    this.auditorListArray.forEach(item => {
      selectedAuditor.push(item.value);
    });
    this.processedDates.get("auditorName").setValue(selectedAuditor);
    this.onSubmitProcessed();
  }

  validateAuditor() {
    this.updateMultiSelectLabels();
    this.onSubmitProcessed();
  }
  updateMultiSelectLabels() {
    this.AuditorSelect.updateLabel = function() {
      const AuditorLabel =
        this.value.length === 1
          ? this.value.length.toString() + " Auditor Selected"
          : this.value.length.toString() + " Auditors Selected";

      this.valuesAsString = AuditorLabel;
    };
  }
  mapAuditor(adtName) {
    this.auditorArray = [];
    if (
      adtName &&
      adtName !== undefined &&
      adtName !== "" &&
      adtName !== null &&
      adtName.length > 0
    ) {
      adtName.forEach(q => {
        this.auditorArray.push(q.id);
      });
    }
    return this.auditorArray;
  }

  mapAuditorNames(adtIds) {
    const auditorArray = [];
    if (
      adtIds &&
      adtIds !== undefined &&
      adtIds !== "" &&
      adtIds !== null &&
      adtIds.length > 0
    ) {
      adtIds.forEach(q => {
        auditorArray.push(q.name);
      });
    }
    return auditorArray;
  }

  mapAuditorIds(adtIds) {
    const auditorArray = [];
    if (
      adtIds &&
      adtIds !== undefined &&
      adtIds !== "" &&
      adtIds !== null &&
      adtIds.length > 0
    ) {
      adtIds.forEach(q => {
        auditorArray.push(q.id);
      });
    }
    return auditorArray;
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
      "" + Number(Number(this.userProcessedDto.totalRebuttalCount))
    ).split("");
    responseValue = this.userProcessedDto.userRebuttalDtos;
    this.mapResponseValue(responseValue);
  }

  mapResponseValue(responseValue) {
    responseValue.map(val => {
      this.dataProcessed.push([val.status, val.transactionCount]);
    });
    const adt = this.processedDates.get("auditorName").value;
    const audit = [];
    adt.forEach(q => {
      audit.push(q.name);
    });
    this.auditorName = audit.length === 1 ? audit[0] : "";
  }

  getProcessedDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates.get("dateRange").value[0];
    this.enrollmentManagerDashboardService.getManagerRebuttalFailedVsAccepted(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapAuditor(this.processedDates.get("auditorName").value)
    );
    this.userProcessedDto = this.enrollmentManagerDashboardService.managerRebuttalFailedVsAcceptedResponse;
    this.userProcessedDto = null;
    this.processedSubscription = this.enrollmentManagerDashboardService
      .getManagerRebuttalFailedVsAcceptedListner()
      .subscribe(data => {
        this.userProcessedDto = data;
        this.dataProcessed = [];
        if (
          this.userProcessedDto &&
          this.userProcessedDto.userRebuttalDtos.length > 0
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

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataProcessed.length > 0) {
      const row = e[0].row;
      const action = [];
      const act =
        this.dataProcessed[row][0] === "Rebuttal Failed" ? "FAILED" : "PASSED";
      action.push(act);
      this.trans = this.dataProcessed[row][0];
      const fromDateValue = this.processedDates.get("dateRange").value[0];
      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(this.getToDateValue(), "yyyy-MM-dd");
      const type = "rebuttal-failed-vs-accepted";
      this.editUser = {
        type,
        action,
        fromDate: from,
        toDate: to,
        auditorName: this.mapAuditorNames(
          this.processedDates.get("auditorName").value
        ),
        auditorIds: this.mapAuditorIds(
          this.processedDates.get("auditorName").value
        )
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
