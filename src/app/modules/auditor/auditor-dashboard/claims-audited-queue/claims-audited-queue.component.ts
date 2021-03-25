import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";

import { AuditDashboardService } from "./../audit-dashboard.service";

@Component({
  selector: "app-claims-audited-queue",
  templateUrl: "./claims-audited-queue.component.html"
})
export class ClaimsAuditedQueueComponent implements OnInit, OnDestroy {
  auditQueueCountDtos: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input()
  public processedDates: Array<{}>;
  auditDetails: { auditDates: [] };
  public enlargedDisplay = false;
  userAuditReportDto: any;
  public editMode: boolean;
  public isDataPresent = false;
  public editUser = {};
  private auditSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public typeAudit = "BarChart";
  public columnNamesAudit = ["", "Claim Count", { role: "annotation" }];

  public optionsAudit = {
    colors: ["#479fd0"],
    bar: { width: "70%" },
    height: 300,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 11,
        textPosition: "Horizontal"
      }
    },
    annotations: {
      textStyle: {
        fontSize: 11
      }
    },
    hAxis: {
      format: "0",
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 11,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 11,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      width: "100%",
      left: 140,
      right: 70,
      top: 17,
      bottom: 10
    },
    legend: {
      position: "top",
      textStyle: { fontSize: 12 },
      width: "50%"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };

  public optionsAuditEnlarged = {
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
    annotations: {
      textStyle: {
        fontSize: 16
      }
    },
    colors: ["#479fd0"],
    hAxis: {
      format: "0",
      minValue: 0,
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
      width: "100%",
      left: 250,
      right: 55,
      top: 25,
      bottom: 20
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
  public widthAudit = 400;
  public heightAudit = 200;
  constructor(
    private auditDashboardService: AuditDashboardService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.auditDetails = this.auditDashboardService.getAuditDates();
    this.processedDates = this.auditDetails.auditDates;
    this.getAuditDays();
    this.getAuditDetails();
  }

  getAuditDetails() {
    this.resetFormSubject.subscribe(response => {
      if (response) {
        this.auditDetails = this.auditDashboardService.getAuditDates();
        this.processedDates = this.auditDetails.auditDates;
        this.getAuditDays();
      }
    });
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  getAuditChartNoValue() {
    this.isDataPresent = false;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "none";
    this.optionsAudit.tooltip.trigger = "none";
    this.optionsAuditEnlarged.legend.position = "none";
    this.optionsAuditEnlarged.tooltip.trigger = "none";
    this.dataAudit.push(["NO DATA", 0, "0"]);
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    this.optionsAuditEnlarged.legend.position = "top";
    this.optionsAuditEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.auditQueueCountDtos.auditQueueCountDtos;
    responseValue.forEach(val => {
      this.dataAudit.push([
        val.queueName,
        val.auditedClaimsCount,
        val.auditedClaimsCount
      ]);
    });
    this.setChartScroll();
  }

  setChartScroll() {
    const statusLength = this.dataAudit.length;
    const newHeightEnlarged = statusLength > 5 ? statusLength * 90 : 400;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 400 ? newHeightEnlarged : 400;
    const newHeight = statusLength > 5 ? statusLength * 30 : 200;
    const newGeneratedHeight = newHeight > 200 ? newHeight : 200;
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
    this.auditDashboardService.getAuditQueue(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.auditQueueCountDtos = this.auditDashboardService.auditQueueResponse;
    this.auditQueueCountDtos = null;
    this.auditSubscription = this.auditDashboardService
      .getAuditQueueListner()
      .subscribe((data: any) => {
        this.auditQueueCountDtos = data;
        this.dataAudit = [];
        if (
          this.auditQueueCountDtos &&
          this.auditQueueCountDtos.auditQueueCountDtos.length > 0
        ) {
          this.getAuditChartValue();
        } else {
          this.getAuditChartNoValue();
        }
        this.auditSubscription.unsubscribe();
      });
    if (
      this.auditQueueCountDtos === null ||
      this.auditQueueCountDtos === undefined
    ) {
      this.getAuditChartNoValue();
    }
    this.isAuditRendered = true;
  }

  openPopUp(e) {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const name = this.dataAudit[row][0];
      this.editUser = {
        type: "claims-audited-queue",
        queueName: name,
        fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd")
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }
  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
