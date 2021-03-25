import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";

@Component({
  selector: "app-audit-sampling-by-billed-amount",
  templateUrl: "./audit-sampling-by-billed-amount.component.html"
})
export class AuditSamplingByBilledAmountComponent implements OnInit, OnDestroy {
  auditReportBilledAmountDtos: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input()
  public processedDates: Array<{}>;
  public maxDate = new Date();
  frequency: string;
  public showMonthlyCalendar = false;
  public showWeeklyCalendar = false;
  public showDailyCalendar = true;
  public isDataPresent = false;
  auditDetails: { auditDates: []; frequency: string };
  public enlargedDisplay = false;
  userAuditReportDto: any;
  private auditSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public typeAudit = "PieChart";
  public columnNamesAudit = ["", "Billed Amount", { role: "annotation" }];
  public isValid = true;
  invalidDaily = false;
  invalidWeekly = false;
  public rangeError = false;
  public invalidDateError = false;
  public optionsAudit = {
    pieSliceTextStyle: { fontSize: 12 },
    pieSliceText: "value-and-percentage",
    height: 240,
    colors: ["#2a5fa1", "#6c5da9", "#a156a2", "#e5526f", "#ef654b", "#e68123"],
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    annotations: {
      textStyle: {
        fontSize: 12
      }
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 17,
      bottom: 1
    },
    legend: {
      textStyle: { fontSize: 12 },
      position: "top",
      width: "100%"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };

  public optionsAuditEnlarged = {
    pieSliceTextStyle: { fontSize: 14 },
    pieSliceText: "value-and-percentage",
    annotations: {
      textStyle: {
        fontSize: 14
      }
    },
    height: 440,
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    colors: ["#2a5fa1", "#6c5da9", "#a156a2", "#e5526f", "#ef654b", "#e68123"],
    chartArea: {
      width: "100%",
      left: 1,
      right: 1,
      top: 50,
      bottom: 30
    },
    legend: {
      position: "top",
      width: "100%",
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };

  public dataAudit = [];
  public isAuditRendered = false;
  public widthAudit = "100%";
  public heightAudit = 200;
  public freqList = [];
  constructor(
    private auditReportDashboardService: AuditReportDashboardService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.auditDetails = this.auditReportDashboardService.getAuditDates();
    this.processedDates = this.auditDetails.auditDates;
    this.getAuditDays();
    this.getAuditDetails();
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  getAuditChartNoValue() {
    this.isDataPresent = false;
    this.dataAudit = [];
    this.dataAudit.push(["NO DATA", 1, "1"]);
    this.optionsAudit.pieSliceText = "label";
    this.optionsAudit.tooltip.text = "none";
    this.optionsAudit.legend.position = "none";
    this.optionsAuditEnlarged.pieSliceText = "label";
    this.optionsAuditEnlarged.tooltip.text = "none";
    this.optionsAuditEnlarged.legend.position = "none";
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAuditEnlarged.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";

    this.optionsAudit.pieSliceText = "value-and-percentage";
    this.optionsAudit.tooltip.text = "value-and-percentage";
    this.optionsAuditEnlarged.pieSliceText = "value-and-percentage";
    this.optionsAuditEnlarged.tooltip.text = "value-and-percentage";

    let responseValue = [];
    responseValue = this.auditReportBilledAmountDtos
      .auditReportBilledAmountDtos;
    this.setChartXAxis(responseValue);
    // this.setChartScroll();
  }

  getAuditDetails() {
    this.processedDates = [];
    this.resetFormSubject.subscribe(response => {
      if (response) {
        this.auditDetails = this.auditReportDashboardService.getAuditDates();
        this.processedDates = this.auditDetails.auditDates;
        this.getAuditDays();
      }
    });
  }

  setChartXAxis(responseValue) {
    const avg = [];
    responseValue.forEach(val => {
      const start = val.billedAmtStart;
      const end = val.billedAmtEnd;
      this.dataAudit.push([
        start + " - " + end,
        val.claimCount,
        val.claimCount
      ]);
    });
  }

  setChartScroll() {
    const statusLength = this.dataAudit.length;
    const newHeightEnlarged = statusLength > 5 ? statusLength * 90 : 400;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 400 ? newHeightEnlarged : 400;
    const newHeight = statusLength > 5 ? statusLength * 30 : 330;
    const newGeneratedHeight = newHeight > 230 ? newHeight : 230;
    this.optionsAuditEnlarged.height = newGeneratedHeightEnlarged;
    this.optionsAudit.height = newGeneratedHeight;
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

  getAuditDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    this.auditReportDashboardService.getAuditSamplingBilledAmt(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.auditReportBilledAmountDtos = this.auditReportDashboardService.auditSamplingBilledAmtResponse;
    this.auditReportBilledAmountDtos = null;
    this.auditSubscription = this.auditReportDashboardService
      .getAuditSamplingBilledAmtListner()
      .subscribe((data: any) => {
        this.auditReportBilledAmountDtos = data;
        this.dataAudit = [];
        this.auditReportBilledAmountDtos &&
        this.auditReportBilledAmountDtos.auditReportBilledAmountDtos &&
        this.auditReportBilledAmountDtos.auditReportBilledAmountDtos.length > 0
          ? this.getAuditChartValue()
          : this.getAuditChartNoValue();
        this.auditSubscription.unsubscribe();
      });
    if (
      this.auditReportBilledAmountDtos === null ||
      this.auditReportBilledAmountDtos === undefined
    ) {
      this.getAuditChartNoValue();
    }
    this.isAuditRendered = true;
  }

  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
