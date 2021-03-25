import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";

@Component({
  selector: "app-audit-billed-amount-by-claim-type",
  templateUrl: "./audit-billed-amount-by-claim-type.component.html"
})
export class AuditBilledAmountByClaimTypeComponent
  implements OnInit, OnDestroy {
  auditReportBilledAmountByClaimTypeDtoList: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input()
  public processedDates: Array<{}>;
  public maxDate = new Date();
  frequency: string;
  public isDataPresent = false;
  public showMonthlyCalendar = false;
  public showWeeklyCalendar = false;
  public showDailyCalendar = true;
  auditDetails: { auditDates: []; frequency: string };
  public enlargedDisplay = false;
  userAuditReportDto: any;
  private auditSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public typeAudit = "BarChart";
  public columnNamesAudit = [
    "",
    "Professional",
    { role: "annotation" },
    "Institutional (IP)",
    { role: "annotation" },
    "Institutional (OP)",
    { role: "annotation" },
    "Others",
    { role: "annotation" }
  ];

  public isValid = true;
  invalidDaily = false;
  invalidWeekly = false;
  public rangeError = false;
  public invalidDateError = false;
  public optionsAudit = {
    width: "100%",
    bar: { width: "50%" },
    colors: ["#ff9226", "#017ecf", "#cc3f6c", "#565454"],
    tooltip: {
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
    height: 300,
    hAxis: {
      format: "0",
      title: "",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      format: "0",
      viewWindowMode: "explicit",
      minValue: 0,
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 90,
      right: 10,
      top: 17,
      bottom: 5
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
    },
    seriesType: "bars"
    // isStacked: true
  };

  public optionsAuditEnlarged = {
    annotations: {
      textStyle: {
        fontSize: 14
      }
    },
    height: 400,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    // isStacked: true,
    colors: ["#ff9226", "#017ecf", "#cc3f6c", "#565454"],
    minValue: 0,
    hAxis: {
      format: "0",
      title: "",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      title: "",
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      width: 50,
      left: 180,
      right: 55,
      top: 25,
      bottom: 30
    },
    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        color: "black",
        fontSize: 14,
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
  public heightAudit = 400;
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
    this.dataAudit = [];
    this.isDataPresent = false;
    this.optionsAudit.legend.position = "none";
    this.optionsAudit.tooltip.trigger = "none";
    // this.optionsAudit.width = 400;
    this.dataAudit.push(["NO DATA", 0, "0", 0, "0", 0, "0", 0, "0"]);
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    // this.optionsAudit.width = 550;
    let responseValue = [];
    responseValue = this.auditReportBilledAmountByClaimTypeDtoList
      .auditReportBilledAmountByClaimTypeDtoList;
    this.setChartXAxis(responseValue);
    this.setChartScroll();
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
    responseValue.forEach(val => {
      const billedAmtStart = val.billedAmtStart;
      const billedAmtEnd = val.billedAmtEnd;
      this.dataAudit.push([
        billedAmtStart + " - " + billedAmtEnd,
        val.professional,
        val.professional,
        val.institutionalIP,
        val.institutionalIP,
        val.institutionalOP,
        val.institutionalOP,
        val.others,
        val.others
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
    this.auditReportDashboardService.getBilledAmtByClaimType(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.auditReportBilledAmountByClaimTypeDtoList = this.auditReportDashboardService.auditBilledAmtClaimTypeResponse;
    this.auditReportBilledAmountByClaimTypeDtoList = null;
    this.auditSubscription = this.auditReportDashboardService
      .getBilledAmtByClaimTypeListner()
      .subscribe((data: any) => {
        this.auditReportBilledAmountByClaimTypeDtoList = data;
        this.dataAudit = [];
        this.auditReportBilledAmountByClaimTypeDtoList &&
        this.auditReportBilledAmountByClaimTypeDtoList
          .auditReportBilledAmountByClaimTypeDtoList &&
        this.auditReportBilledAmountByClaimTypeDtoList
          .auditReportBilledAmountByClaimTypeDtoList.length > 0
          ? this.getAuditChartValue()
          : this.getAuditChartNoValue();
        this.auditSubscription.unsubscribe();
      });
    if (
      this.auditReportBilledAmountByClaimTypeDtoList === null ||
      this.auditReportBilledAmountByClaimTypeDtoList === undefined
    ) {
      this.getAuditChartNoValue();
    }
    this.isAuditRendered = true;
  }

  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
