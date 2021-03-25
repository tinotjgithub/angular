import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

import { EnrollmentAuditService } from "./../../services/enrollment-audit.service";

@Component({
  selector: "app-transaction-strategy",
  templateUrl: "./transaction-strategy.component.html",
  styleUrls: ["./transaction-strategy.component.css"]
})
export class TransactionStrategyComponent implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  transDtos: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public typeStatus = "PieChart";
  public columnNamesStatus = ["Status", "Count"];
  public isValid = true;
  public dataStatus = [];
  public isStatusRendered = false;
  public widthStatus = 460;
  public heightStatus = 250;
  public myColumnNamesStatus = [
    "Address Change",
    "Name Correction",
    "Gender Correction",
    "Demographic Change",
    "Plan Correction",
    "Termination"
  ];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    pieHole: 0.4,
    chartArea: {
      left: 50,
      right: 50,
      top: 19,
      bottom: 1
    },
    colors: ["#329c83", "#4f945a", "#718931", "#92770e", "#b15e12", "#c83b34"],
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
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    }
  };

  public optionsStatusEnlarged = {
    pieSliceTextStyle: { fontSize: 16 },
    pieHole: 0.4,
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 60,
      right: 20,
      top: 35,
      bottom: 10
    },
    colors: ["#329c83", "#4f945a", "#718931", "#92770e", "#b15e12", "#c83b34"],
    pieSliceText: "value",
    tooltip: { text: "value", trigger: "focus", showColorCode: true },
    legend: {
      position: "top",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 13
      }
    }
  };

  constructor(
    private enrollmentAuditService: EnrollmentAuditService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getStatusDays();
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
  }

  getDataChart() {
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value";
    this.optionsStatus.tooltip.text = "value";
    this.optionsStatus.legend.position = "top";
    let responseValue = [];
    responseValue = this.transDtos.transDtos;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "Address Change",
        claimCount: 0
      },
      {
        status: "Name Correction",
        claimCount: 0
      },
      {
        status: "Gender Correction",
        claimCount: 0
      },
      {
        status: "Demographic Change",
        claimCount: 0
      },
      {
        status: "Plan Correction",
        claimCount: 0
      },
      {
        status: "Termination",
        claimCount: 0
      }
    );
    this.mapResponseValue(responseValue, dataStatusArray);
  }

  mapResponseValue(responseValue, dataStatusArray) {
    responseValue.map(val => {
      if (val.status === "AddressChange") {
        dataStatusArray[0].claimCount = val.claimCount;
      } else if (val.status === "NameCorrection") {
        dataStatusArray[1].claimCount = val.claimCount;
      } else if (val.status === "GenderCorrection") {
        dataStatusArray[2].claimCount = val.claimCount;
      } else if (val.status === "DemographicChange") {
        dataStatusArray[3].claimCount = val.claimCount;
      } else if (val.status === "PlanCorrection") {
        dataStatusArray[4].claimCount = val.claimCount;
      } else {
        dataStatusArray[5].claimCount = val.claimCount;
      }
    });
    dataStatusArray.map(val => {
      this.dataStatus.push([val.status, val.claimCount]);
    });
  }

  getStatusDays() {
    this.enrollmentAuditService.getTransactionStrategy();
    this.transDtos = this.enrollmentAuditService.transactionStrategyResponse;
    this.transDtos = null;
    this.statusSubscription = this.enrollmentAuditService
      .getTransactionStrategyListner()
      .subscribe((data: any) => {
        this.transDtos = data;
        this.dataStatus = [];
        this.transDtos && this.transDtos.transDtos
          ? this.getDataChart()
          : this.getNoDataChart();
        this.statusSubscription.unsubscribe();
      });
    if (this.transDtos === null || this.transDtos === undefined) {
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
