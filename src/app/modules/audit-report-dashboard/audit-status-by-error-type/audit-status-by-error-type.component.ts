import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";

@Component({
  selector: "app-audit-status-by-error-type",
  templateUrl: "./audit-status-by-error-type.component.html"
})
export class AuditStatusByErrorTypeComponent implements OnInit, OnDestroy {
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  auditStatusCountDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public isDataPresent = false;
  public typeStatus = "PieChart";
  public isValid = true;
  public maxDate = new Date();
  public statusDates: FormGroup;
  public dataStatus = [];
  public isStatusRendered = false;
  public widthStatus = "100%";
  public heightStatus = 240;
  public myColumnNamesStatus = ["Financial", "Procedural", "Both"];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 12 },
    pieHole: 0.25,
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 25,
      bottom: 1
    },
    colors: ["#e19b0e", "#058ba3", "#b84066"],
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
      width: "100%",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };
  public optionsStatusEnlarged = {
    pieSliceTextStyle: { fontSize: 12 },
    pieHole: 0.25,
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 50,
      bottom: 1
    },
    colors: ["#e19b0e", "#058ba3", "#b84066"],
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
    private auditReportDashboardService: AuditReportDashboardService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.auditDetails = this.auditReportDashboardService.getAuditDates();
    this.processedDates = this.auditDetails.auditDates;
    this.getStatusDays();
    this.getAuditDetails();
  }

  getAuditDetails() {
    this.processedDates = [];
    this.resetFormSubject.subscribe(response => {
      if (response) {
        this.auditDetails = this.auditReportDashboardService.getAuditDates();
        this.processedDates = this.auditDetails.auditDates;
        this.getStatusDays();
      }
    });
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
    this.optionsStatusEnlarged.pieHole = 0.4;
    this.optionsStatus.pieHole = 0.4;
  }

  getDataChart() {
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value-and-percentage";
    this.optionsStatus.tooltip.text = "value-and-percentage";
    this.optionsStatus.legend.position = "top";
    this.optionsStatusEnlarged.pieSliceText = "value-and-percentage";
    this.optionsStatusEnlarged.tooltip.text = "value-and-percentage";
    this.optionsStatusEnlarged.legend.position = "top";
    this.optionsStatusEnlarged.pieHole = 0.25;
    this.optionsStatus.pieHole = 0.25;
    let responseValue = [];
    responseValue = this.auditStatusCountDto.auditClaimCountDto;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "Financial",
        claimCount: 0
      },
      {
        status: "Procedural",
        claimCount: 0
      },
      {
        status: "Both",
        claimCount: 0
      }
    );
    this.mapResponseValue(responseValue, dataStatusArray);
  }

  mapResponseValue(responseValue, dataStatusArray) {
    responseValue.map(val => {
      if (val.status === "Financial") {
        dataStatusArray[0].claimCount = val.claimCount;
      }
      if (val.status === "Procedural") {
        dataStatusArray[1].claimCount = val.claimCount;
      }
      if (val.status === "Both") {
        dataStatusArray[2].claimCount = val.claimCount;
      }
    });
    dataStatusArray.map(val => {
      this.dataStatus.push([val.status, val.claimCount]);
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
    this.auditReportDashboardService.getAuditSamplingErr(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.auditStatusCountDto = this.auditReportDashboardService.samplingErrResponse;
    this.auditStatusCountDto = null;
    this.statusSubscription = this.auditReportDashboardService
      .getAuditSamplingErrListner()
      .subscribe((data: any) => {
        this.auditStatusCountDto = data;
        this.dataStatus = [];
        if (
          this.auditStatusCountDto &&
          this.auditStatusCountDto.auditClaimCountDto &&
          this.auditStatusCountDto.auditClaimCountDto.length > 0
        ) {
          this.isDataPresent = true;
          this.getDataChart();
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
