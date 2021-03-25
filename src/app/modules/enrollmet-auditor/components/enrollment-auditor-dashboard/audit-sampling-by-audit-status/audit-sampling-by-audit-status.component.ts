import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";

@Component({
  selector: "app-audit-sampling-by-audit-status",
  templateUrl: "./audit-sampling-by-audit-status.component.html",
  styleUrls: ["./audit-sampling-by-audit-status.component.css"]
})
export class AuditSamplingByAuditStatusComponent implements OnInit, OnDestroy {
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  auditStatusCountDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public typeStatus = "PieChart";
  public isDataPresent = false;
  public isValid = true;
  public maxDate = new Date();
  public status = "";
  public trans = "";
  public statusDates: FormGroup;
  public dataStatus = [];
  public isStatusRendered = false;
  public editUser = {};
  public widthStatus = "100%";
  public editMode = false;
  public heightStatus = 250;
  public myColumnNamesStatus = [
    "Audit Sucess",
    "Audit Failed",
    "Transaction Count Mismatch"
  ];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 12 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 17,
      bottom: 1
    },
    colors: ["#4cc14f", "#ff5c5d", "#deb833"],
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
      width: "100%",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };
  public optionsStatusEnlarged = {
    pieSliceTextStyle: { fontSize: 12 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 10,
      right: 10,
      top: 50,
      bottom: 10
    },
    colors: ["#4cc14f", "#ff5c5d", "#deb833"],
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
      width: "100%",
      alignment: "center",
      textStyle: {
        fontSize: 14
      }
    }
  };
  auditDetails: { auditDates: [] };
  public processedDates: Array<{}>;
  constructor(
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.auditDetails = this.enrollmentAuditorDashboardService.getAuditDates();
    this.processedDates = this.auditDetails.auditDates;
    this.getStatusDays();
    this.getAuditDetails();
  }

  getAuditDetails() {
    this.processedDates = [];
    this.resetFormSubject.subscribe(response => {
      if (response) {
        this.auditDetails = this.enrollmentAuditorDashboardService.getAuditDates();
        this.processedDates = this.auditDetails.auditDates;
        this.getStatusDays();
      }
    });
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataStatus.length > 0) {
      this.auditDetails = this.enrollmentAuditorDashboardService.getAuditDates();
      this.processedDates = this.auditDetails.auditDates;
      const toDateValue = this.getToDateValue();
      const fromDateValue = this.processedDates[0];
      const frequency = this.processedDates[2];
      const row = e[0].row;
      const act = this.dataStatus[row][0];
      const action = [];
      action.push(act);
      const sts =
        act === "Audit Passed"
          ? "PASSED"
          : act === "Audit Failed"
          ? "FAILED"
          : "TRANSACTION MISMATCH";
      this.status = act;
      this.trans = this.dataStatus[row][0];

      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(toDateValue, "yyyy-MM-dd");
      const type = "audit-sampling-audit-status";
      this.editUser = {
        type,
        action: sts,
        fromDate: from,
        toDate: to,
        frequency
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
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

    responseValue = this.auditStatusCountDto;
    responseValue.map(val => {
      this.dataStatus.push([val.status, val.transactionCount]);
    });
  }

  getToDateValue() {
    const toDateValue =
      this.processedDates[1] !== null &&
      this.processedDates[1] !== "" &&
      this.processedDates[1] !== undefined
        ? this.processedDates[1]
        : this.processedDates[0];
    return toDateValue;
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    const frequency = this.processedDates[2];
    this.enrollmentAuditorDashboardService.getAuditSamplingAuditStatus(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      frequency
    );
    this.auditStatusCountDto = this.enrollmentAuditorDashboardService.auditSamplingAuditStatusResponse;
    this.auditStatusCountDto = null;
    this.statusSubscription = this.enrollmentAuditorDashboardService
      .getAuditSamplingAuditStatusListner()
      .subscribe((data: any) => {
        this.auditStatusCountDto = data;
        this.dataStatus = [];

        if (this.auditStatusCountDto && this.auditStatusCountDto.length > 0) {
          this.getDataChart();
          this.isDataPresent = true;
        } else {
          this.isDataPresent = false;
          this.getNoDataChart();
        }
        this.statusSubscription.unsubscribe();
      });
    if (
      this.auditStatusCountDto === null ||
      this.auditStatusCountDto === undefined
    ) {
      this.isDataPresent = false;
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
