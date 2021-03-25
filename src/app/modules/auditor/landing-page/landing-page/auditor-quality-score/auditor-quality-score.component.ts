import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuditorService } from "./../../../../../services/auditor/auditor.service";

@Component({
  selector: "app-auditor-quality-score",
  templateUrl: "./auditor-quality-score.component.html"
})
export class AuditorQualityScoreComponent implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  auditQualityScoreDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public typeStatus = "PieChart";
  public isValid = true;
  public isDataPresent = false;
  public maxDate = new Date();
  public statusDates: FormGroup;
  public dataQuality = [];
  public isStatusRendered = false;
  public widthStatus = "100%";
  public hasData = false;
  public heightStatus = 280;
  public editUser: any;
  public editMode: boolean;
  public myColumnNamesStatus = ["Audit Failed", "Rebuttal Accepted"];
  public optionsQuality = {
    pieSliceTextStyle: { fontSize: 12 },
    pieHole: 0.25,
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      top: 25,
      bottom: 5,
      width: "100%",
      height: "100%"
    },
    colors: ["#ff5c5d", "#00aadf"],
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
    this.isDataPresent = false;
    this.optionsQuality.pieHole = 0.4;
    this.dataQuality = [];
    this.dataQuality.push(["NO DATA", 1]);
    this.optionsQuality.pieSliceText = "label";
    this.optionsQuality.tooltip.text = "none";
    this.optionsQuality.legend.position = "none";
    this.optionsQuality.chartArea.bottom = 15;
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const status = this.dataQuality[row][0];
      this.editUser = {
        status
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getDataChart() {
    this.isDataPresent = true;
    this.dataQuality = [];
    this.optionsQuality.pieHole = 0.25;
    this.optionsQuality.pieSliceText = "value-and-percentage";
    this.optionsQuality.tooltip.text = "value-and-percentage";
    this.optionsQuality.legend.position = "top";
    let responseValue = [];
    responseValue = this.auditQualityScoreDto.auditStatusCountDtos;
    const dataStatusArray = [];
    dataStatusArray.push(
      {
        status: "Audit Failed",
        claimCount: 0
      },
      {
        status: "Rebuttal Accepted",
        claimCount: 0
      }
    );
    this.mapResponseValue(responseValue, dataStatusArray);
  }

  mapResponseValue(responseValue, dataStatusArray) {
    responseValue.map(val => {
      if (val.status === "Audit Failed") {
        dataStatusArray[0].claimCount = val.claimCount;
      }
      if (val.status === "Rebuttal Accepted") {
        dataStatusArray[1].claimCount = val.claimCount;
      }
    });
    dataStatusArray.map(val => {
      this.dataQuality.push([val.status, val.claimCount]);
    });
  }

  getStatusDays() {
    this.auditorService.getAuditorQualityScore();
    this.auditQualityScoreDto = this.auditorService.auditorQualityResponse;
    this.auditQualityScoreDto = null;
    this.statusSubscription = this.auditorService
      .getAuditorQualityScoreListner()
      .subscribe((data: any) => {
        this.auditQualityScoreDto = data;
        this.dataQuality = [];
        if (
          this.auditQualityScoreDto &&
          this.auditQualityScoreDto.auditStatusCountDtos.length > 0
        ) {
          this.getDataChart();
          this.hasData = true;
        } else {
          this.getNoDataChart();
        }
        this.statusSubscription.unsubscribe();
      });
    if (
      this.auditQualityScoreDto === null ||
      this.auditQualityScoreDto === undefined
    ) {
      this.hasData = false;
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
