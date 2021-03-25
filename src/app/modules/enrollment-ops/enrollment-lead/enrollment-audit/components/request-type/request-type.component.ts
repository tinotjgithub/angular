import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

import { EnrollmentAuditService } from "./../../services/enrollment-audit.service";

@Component({
  selector: "app-request-type",
  templateUrl: "./request-type.component.html",
  styleUrls: ["./request-type.component.css"]
})
export class RequestTypeComponent implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  requestDtos: any;
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
    "Create",
    "Amend",
    "Error Report",
    "ID Card Request",
    "Recon Report",
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
    colors: ["#5a5182", "#8f578e", "#c25c89", "#ea6976", "#ffaa3d", "#c83b34"],
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
    pieHole: 0.4,
    pieSliceTextStyle: { fontSize: 16 },
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
    colors: ["#5a5182", "#8f578e", "#c25c89", "#ea6976", "#ffaa3d", "#c83b34"],
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
    responseValue = this.requestDtos.requestDtos;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "Create",
        claimCount: 0
      },
      {
        status: "Amend",
        claimCount: 0
      },
      {
        status: "Error Report",
        claimCount: 0
      },
      {
        status: "ID Card Request",
        claimCount: 0
      },
      {
        status: "Recon Report",
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
      if (val.status === "Create") {
        dataStatusArray[0].claimCount = val.claimCount;
      } else if (val.status === "Amend") {
        dataStatusArray[1].claimCount = val.claimCount;
      } else if (val.status === "ErrorReport") {
        dataStatusArray[2].claimCount = val.claimCount;
      } else if (val.status === "IDCardRequest") {
        dataStatusArray[3].claimCount = val.claimCount;
      } else if (val.status === "ReconReport") {
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
    this.enrollmentAuditService.getRequestType();
    this.requestDtos = this.enrollmentAuditService.requestTypeResponse;
    this.requestDtos = null;
    this.statusSubscription = this.enrollmentAuditService
      .getRequestTypeListner()
      .subscribe((data: any) => {
        this.requestDtos = data;
        this.dataStatus = [];
        this.requestDtos && this.requestDtos.requestDtos
          ? this.getDataChart()
          : this.getNoDataChart();
        this.statusSubscription.unsubscribe();
      });
    if (this.requestDtos === null || this.requestDtos === undefined) {
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
