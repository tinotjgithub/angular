import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";

@Component({
  selector: "app-processed-vs-audited",
  templateUrl: "./processed-vs-audited.component.html",
  styleUrls: ["./processed-vs-audited.component.css"]
})
export class ProcessedVsAuditedComponent implements OnInit, OnDestroy {
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  auditStatusCountDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public total = [];
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
  public editMode = false;
  public widthStatus = 380;
  public heightStatus = 260;
  public myColumnNamesStatus = ["Auto", "Manual", "Auditor"];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 12 },
    pieHole: 0.35,
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
    colors: ["#0ca8a6", "#f23860"],
    pieSliceText: "value",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "labeled",
      width: "100%",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };
  public optionsStatusEnlarged = {
    pieHole: 0.5,
    pieSliceTextStyle: { fontSize: 12 },
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
    pieSliceText: "value",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "labeled",
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
      const auditType = this.dataStatus[row][0];
      this.status = auditType;
      this.trans = this.dataStatus[row][0];

      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(toDateValue, "yyyy-MM-dd");
      const type = "processed-vs-audited";
      this.editUser = {
        type,
        auditType,
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
    this.total = ["0"];
  }

  getDataChart() {
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value";
    this.optionsStatus.tooltip.text = "value-and-percentage";
    this.optionsStatus.legend.position = "labeled";
    this.optionsStatusEnlarged.pieSliceText = "value";
    this.optionsStatusEnlarged.tooltip.text = "value-and-percentage";
    this.optionsStatusEnlarged.legend.position = "labeled";
    let responseValue = [];
    this.total = (
      "" + Number(Number(this.auditStatusCountDto.transactionsProcessedCount))
    ).split("");
    responseValue = this.auditStatusCountDto.auditStatusCountDtos;
    responseValue.map(val => {
      this.dataStatus.push([val.status, val.count]);
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
    this.enrollmentAuditorDashboardService.getProcessedVsAudited(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      frequency
    );
    this.auditStatusCountDto = this.enrollmentAuditorDashboardService.processedVsAuditedResponse;
    this.auditStatusCountDto = null;
    this.statusSubscription = this.enrollmentAuditorDashboardService
      .getProcessedVsAuditedListner()
      .subscribe((data: any) => {
        this.auditStatusCountDto = data;
        this.dataStatus = [];

        if (
          this.auditStatusCountDto &&
          this.auditStatusCountDto.auditStatusCountDtos &&
          this.auditStatusCountDto.auditStatusCountDtos.length > 0
        ) {
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
