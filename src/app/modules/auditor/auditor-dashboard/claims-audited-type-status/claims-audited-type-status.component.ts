import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";

import { AuditDashboardService } from "./../audit-dashboard.service";

@Component({
  selector: "app-claims-audited-type-status",
  templateUrl: "./claims-audited-type-status.component.html"
})
export class ClaimsAuditedTypeStatusComponent implements OnInit, OnDestroy {
  auditStatusScoreDto: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input()
  auditDetails: { auditDates: [] };
  public processedDates: Array<{}>;
  public enlargedDisplay = false;
  userAuditReportDto: any;
  public editMode: boolean;
  public editUser = {};
  private auditSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public isDataPresent = false;
  public typeAudit = "BarChart";
  public columnNamesAudit = [
    "",
    "Check Issued",
    { role: "annotation" },
    "Check Not Issued",
    { role: "annotation" },
    "Denied",
    { role: "annotation" }
  ];
  public optionsAudit = {
    annotations: {
      textStyle: {
        fontSize: 10
      }
    },
    colors: ["#45ad97", "#ffae3d", "#ff6947"],
    bar: { width: "70%" },
    height: 250,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 10,
        textPosition: "Horizontal"
      }
    },
    // isStacked: true,
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
      left: 100,
      right: 45,
      top: 20,
      bottom: 0
    },
    legend: {
      position: "top",
      textStyle: { fontSize: 12 },
      width: "100%",
      alignment: "start"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
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
    colors: ["#45ad97", "#ffae3d", "#ff6947"],
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
      width: "100%",
      height: "100%",
      left: 270,
      right: 55,
      top: 25
    },
    legend: {
      position: "top",
      alignment: "start",
      width: "100%",
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
  public widthAudit = 500;
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
    this.processedDates = [];
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
    this.dataAudit.push(["NO DATA", 0, "0", 0, "0", 0, "0"]);
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    this.optionsAuditEnlarged.legend.position = "top";
    this.optionsAuditEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.auditStatusScoreDto;
    const parsedResponseValue = this.parseResponseValue(responseValue);
    parsedResponseValue.forEach(val => {
      this.dataAudit.push([
        val.auditStatusScoreDto.claimType,
        val.auditStatusScoreDto.checkIssued,
        val.auditStatusScoreDto.checkIssued,
        val.auditStatusScoreDto.checkNotIssued,
        val.auditStatusScoreDto.checkNotIssued,
        val.auditStatusScoreDto.denied,
        val.auditStatusScoreDto.denied
      ]);
    });
    this.setChartScroll();
  }

  openPopUp(e) {
    this.auditDetails = this.auditDashboardService.getAuditDates();
    this.processedDates = this.auditDetails.auditDates;
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const column = e[0].column;
      const claimTyp = this.dataAudit[row][0];
      const sts = this.columnNamesAudit[column];
      const status =
        typeof sts === "object" ? this.columnNamesAudit[column - 1] : sts;
      this.editUser = {
        fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
        paymentStatus: status,
        claimType: claimTyp,
        type: "claims-audited-type"
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  parseResponseValue(resp) {
    const responseValueLength = resp.length;
    let parsedResponseValue = [];
    for (let i = 0; i < responseValueLength; i++) {
      parsedResponseValue.push({
        auditStatusScoreDto: {
          checkIssued: 0,
          checkNotIssued: 0,
          denied: 0,
          claimType: ""
        }
      });
    }
    parsedResponseValue = this.mapParsedResponseValue(
      resp,
      parsedResponseValue
    );
    return parsedResponseValue;
  }

  mapParsedResponseValue(responseValue, parsedResponseValue) {
    responseValue.map((val, index) => {
      if (val.hasOwnProperty("checkIssued")) {
        parsedResponseValue[index].auditStatusScoreDto.checkIssued =
          val.checkIssued;
      }
      if (val.hasOwnProperty("checkNotIssued")) {
        parsedResponseValue[index].auditStatusScoreDto.checkNotIssued =
          val.checkNotIssued;
      }
      if (val.hasOwnProperty("denied")) {
        parsedResponseValue[index].auditStatusScoreDto.denied = val.denied;
      }
      if (val.hasOwnProperty("claimType")) {
        parsedResponseValue[index].auditStatusScoreDto.claimType =
          val.claimType;
      }
    });
    return parsedResponseValue;
  }

  setChartScroll() {
    const statusLength = this.dataAudit.length;
    const newHeight = statusLength > 5 ? statusLength * 25 : 250;
    const newGeneratedHeight = newHeight > 250 ? newHeight : 250;
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
    this.auditDashboardService.getAuditTypeStatus(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd")
    );
    this.auditStatusScoreDto = this.auditDashboardService.auditTypeStatusResponse;
    this.auditStatusScoreDto = null;
    this.auditSubscription = this.auditDashboardService
      .getAuditTypeStatusListner()
      .subscribe((data: any) => {
        this.auditStatusScoreDto = data.auditStatusScoreDto;
        this.dataAudit = [];
        this.auditStatusScoreDto && this.auditStatusScoreDto.length > 0
          ? this.getAuditChartValue()
          : this.getAuditChartNoValue();
        this.auditSubscription.unsubscribe();
      });
    if (
      this.auditStatusScoreDto === null ||
      this.auditStatusScoreDto === undefined
    ) {
      this.getAuditChartNoValue();
    }
    this.isAuditRendered = true;
  }
  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
