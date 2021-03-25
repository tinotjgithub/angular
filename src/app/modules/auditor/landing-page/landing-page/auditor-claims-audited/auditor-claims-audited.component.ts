import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { AuditorService } from "./../../../../../services/auditor/auditor.service";

@Component({
  selector: "app-auditor-claims-audited",
  templateUrl: "./auditor-claims-audited.component.html"
})
export class AuditorClaimsAuditedComponent implements OnInit, OnDestroy {
  auditedAndBacklogDtos: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input()
  public processedDates: Array<{}>;
  public maxDate = new Date();
  frequency: string;
  public showMonthlyCalendar = false;
  public showWeeklyCalendar = false;
  public showDailyCalendar = true;
  auditDetails: { auditDates: []; frequency: string };
  userAuditReportDto: any;
  public editUser: any;
  public editMode: boolean;
  private auditSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public typeAudit = "ComboChart";
  public columnNamesAudit = [
    "",
    "Claims Audited",
    { role: "annotation" },
    "Open Inventory/Backlog",
    { role: "annotation" },
    "Average",
    { role: "annotation" }
  ];
  public isValid = true;
  invalidDaily = false;
  public isDataPresent = false;
  invalidWeekly = false;
  public rangeError = false;
  public invalidDateError = false;
  public optionsAudit = {
    width: "100%",
    bar: { width: "50%" },
    colors: ["#3a99f2", "#b03761", "#c49900"],
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
      left: 5,
      right: 2,
      top: 20,
      bottom: 40
    },
    legend: {
      textStyle: { fontSize: 13 },
      position: "top",
      width: "100%"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    seriesType: "bars",
    series: {
      0: {
        annotations: {
          stem: {
            length: 5
          },
          textStyle: { fontSize: 12 }
        }
      },
      1: {
        annotations: {
          stem: {
            length: 0
          },
          textStyle: { fontSize: 12 }
        }
      },
      2: {
        lineWidth: 2,
        type: "line",
        annotations: {
          stem: {
            length: 10
          },
          textStyle: { fontSize: 12 }
        }
      }
    }
    // isStacked: true
  };

  public dataAudit = [];
  public isAuditRendered = false;
  public widthAudit = 500;
  public heightAudit = 250;
  public freqList = [];
  constructor(
    private auditDashboardService: AuditorService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getAuditDays();
  }

  getAuditChartNoValue() {
    this.isDataPresent = false;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "none";
    this.optionsAudit.tooltip.trigger = "none";
    // this.optionsAudit.width = 400;
    this.dataAudit.push(["NO DATA", 0, "0", 0, "0", 0, "0"]);
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.auditedAndBacklogDtos.auditedAndBacklogDtos;
    this.setChartXAxis(responseValue);
  }

  setChartXAxis(responseValue) {
    const avg = [];
    responseValue.forEach(val => {
      const frmDay = this.datePipe.transform(val.startDate, "MM-dd-yyyy");
      const toDay = this.datePipe.transform(val.endDate, "MM-dd-yyyy");
      this.dataAudit.push([
        frmDay + " - " + toDay,
        val.completedAuditCount,
        val.completedAuditCount,
        val.backlogAuditCount,
        val.backlogAuditCount,
        null,
        null
      ]);
      const date1 = new Date(frmDay);
      const date2 = new Date(toDay);
      const DifferenceTime = date2.getTime() - date1.getTime();
      const diff = DifferenceTime / (1000 * 3600 * 24);
      const average = val.completedAuditCount / (diff + 1);
      const av = Math.round((average + Number.EPSILON) * 100) / 100;
      avg.push(Math.ceil(av));
    });
    for (let i = 0; i < this.dataAudit.length; i++) {
      this.dataAudit[i][5] = avg[i];
      this.dataAudit[i][6] = avg[i];
    }
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const col = e[0].column;
      const date = this.dataAudit[row][0];
      const day = date.split(" - ");
      const sts = this.columnNamesAudit[col];
      const type =
        typeof sts === "object" ? this.columnNamesAudit[col - 1] : sts;
      this.editUser = {
        type,
        fromDate: this.datePipe.transform(day[0], "yyyy-MM-dd"),
        toDate: this.datePipe.transform(day[1], "yyyy-MM-dd")
      };

      if (this.editUser.type === "Average") {
        return;
      }
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getAuditDays() {
    this.auditDashboardService.getAuditorClaimsAudited();
    this.auditedAndBacklogDtos = this.auditDashboardService.auditorFinScoreResponse;
    this.auditedAndBacklogDtos = null;
    this.auditSubscription = this.auditDashboardService
      .getAuditorClaimsAuditedListner()
      .subscribe((data: any) => {
        this.auditedAndBacklogDtos = data;
        this.dataAudit = [];
        this.auditedAndBacklogDtos &&
        this.auditedAndBacklogDtos.auditedAndBacklogDtos.length > 0
          ? this.getAuditChartValue()
          : this.getAuditChartNoValue();
        this.auditSubscription.unsubscribe();
      });
    if (this.auditedAndBacklogDtos === null) {
      this.getAuditChartNoValue();
    }
    this.isAuditRendered = true;
  }

  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
