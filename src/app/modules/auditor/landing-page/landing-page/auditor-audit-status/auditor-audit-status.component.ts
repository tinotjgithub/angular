import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuditorService } from "./../../../../../services/auditor/auditor.service";

@Component({
  selector: "app-auditor-audit-status",
  templateUrl: "./auditor-audit-status.component.html"
})
export class AuditorAuditStatusComponent implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  auditStatusCountDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public editUser: any;
  public editMode: boolean;
  public titleStatus = "";
  public isDataPresent = false;
  public typeStatus = "PieChart";
  public isValid = true;
  public maxDate = new Date();
  public statusDates: FormGroup;
  public dataStatus = [];
  public isStatusRendered = false;
  public widthStatus = "100%";
  public heightStatus = 280;
  public myColumnNamesStatus = [
    "Audit Passed",
    "Audit Failed",
    "Audit Rebutted"
  ];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 12 },
    pieHole: 0.4,
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      width: "100%",
      left: 1,
      right: 1,
      top: 30,
      bottom: 10
    },
    colors: ["#52d055", "#ff5c5d", "#c5b200"],
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
      position: "labeled",
      width: "100%",
      alignment: "center",
      textStyle: {
        fontSize: 13
      }
    }
  };

  constructor(
    private auditorService: AuditorService,
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
    this.optionsStatus.pieHole = 0.25;
    this.optionsStatus.pieSliceText = "label";
    this.optionsStatus.tooltip.text = "none";
    this.optionsStatus.legend.position = "none";
    this.optionsStatus.chartArea.bottom = 15;
  }

  getDataChart() {
    this.dataStatus = [];
    this.optionsStatus.pieHole = 0.25;
    this.optionsStatus.pieSliceText = "value-and-percentage";
    this.optionsStatus.tooltip.text = "value-and-percentage";
    this.optionsStatus.legend.position = "labeled";
    let responseValue = [];
    responseValue = this.auditStatusCountDto.auditStatusCountDtos;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "Audit Passed",
        claimCount: 0
      },
      {
        status: "Audit Failed",
        claimCount: 0
      },
      {
        status: "Audit Rebutted",
        claimCount: 0
      }
    );
    this.mapResponseValue(responseValue, dataStatusArray);
  }

  mapResponseValue(responseValue, dataStatusArray) {
    responseValue.map(val => {
      if (val.status === "Audit Passed") {
        dataStatusArray[0].claimCount = val.claimCount;
      }
      if (val.status === "Audit Failed") {
        dataStatusArray[1].claimCount = val.claimCount;
      }
      if (val.status === "Audit Rebutted") {
        dataStatusArray[2].claimCount = val.claimCount;
      }
    });
    dataStatusArray.map(val => {
      this.dataStatus.push([val.status, val.claimCount]);
    });
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const status = this.dataStatus[row][0];
      this.editUser = {
        status: status
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getStatusDays() {
    this.auditorService.getAuditorAuditStatus();
    this.auditStatusCountDto = this.auditorService.auditorAuditResponse;
    this.auditStatusCountDto = null;
    this.statusSubscription = this.auditorService
      .getAuditorAuditStatusListner()
      .subscribe((data: any) => {
        this.auditStatusCountDto = data;
        this.dataStatus = [];
        if (
          this.auditStatusCountDto &&
          this.auditStatusCountDto.auditStatusCountDtos.length > 0
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
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
