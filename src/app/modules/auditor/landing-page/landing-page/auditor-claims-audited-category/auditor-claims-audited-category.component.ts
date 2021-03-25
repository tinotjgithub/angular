import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuditorService } from "./../../../../../services/auditor/auditor.service";

@Component({
  selector: "app-auditor-claims-audited-category",
  templateUrl: "./auditor-claims-audited-category.component.html"
})
export class AuditorClaimsAuditedCategoryComponent
  implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private categorySubscription: Subscription = new Subscription();
  auditCategoryDto: any;
  public titleCategory = "";
  public typeCategory = "PieChart";
  public dataProfessional = [];
  public dataCheck = [];
  public dataEdi = [];
  public dataAdj = [];
  public editUser: any;
  public isDataPresent = false;
  public editMode: boolean;
  public isProfessionalRendered = false;
  public isCheckRendered = false;
  public isEdiRendered = false;
  public isAdjRendered = false;

  public heightCategory = 280;

  public optionsProfessional = {
    pieSliceTextStyle: { fontSize: 12 },
    pieStartAngle: 15,
    pieHole: 0.26,
    chartArea: {
      width: "100%",
      top: 20,
      height: "100%",
      left: 2,
      right: 2,
      bottom: 10
    },
    colors: ["#ff9226", "#017ecf", "#cc3f6c", "#565454"],
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
      /* alignment: "center",
      width: "100%", */
      width: "50%",
      alignment: "center",
      textStyle: {
        fontSize: 12,
        fontFamily: "Popinns-Regular"
      }
    }
  };

  public optionsCheck = {
    pieSliceTextStyle: { fontSize: 12 },
    pieStartAngle: 70,
    pieHole: 0.26,
    chartArea: {
      width: "100%",
      top: 20,
      height: "100%",
      left: 2,
      right: 2,
      bottom: 10
    },
    colors: ["#45ad97", "#ffae3d", "#ff6947"],
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
      /* alignment: "center",
      width: "100%", */
      width: "50%",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };

  public optionsEdi = {
    pieSliceTextStyle: { fontSize: 12 },
    pieHole: 0.26,
    chartArea: {
      width: "100%",
      top: 20,
      height: "100%",
      left: 2,
      right: 2,
      bottom: 10
    },
    colors: ["#2b5381", "#f25eb0"],
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
      /* alignment: "center",
      width: "100%", */
      width: "50%",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };

  public optionsAdj = {
    pieSliceTextStyle: {
      fontSize: 12
    },
    pieStartAngle: 90,
    pieHole: 0.26,
    chartArea: {
      width: "100%",
      height: "100%",
      left: 2,
      right: 2,
      top: 20,
      bottom: 10
    },
    colors: ["#e19b0e", "#f74d89"],
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
      /* alignment: "center",
      width: "100%", */
      width: "50%",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };

  constructor(private auditorService: AuditorService) {}

  ngOnInit() {
    this.getCategoryDays();
  }

  getNoDataChart() {
    this.dataProfessional = [];
    this.dataCheck = [];
    this.dataEdi = [];
    this.dataAdj = [];
    this.dataProfessional.push(["NO DATA", 1]);
    this.dataCheck.push(["NO DATA", 1]);
    this.dataEdi.push(["NO DATA", 1]);
    this.dataAdj.push(["NO DATA", 1]);
    this.resetOptions();
  }

  resetOptions() {
    this.optionsProfessional.pieHole = 0.4;
    this.optionsProfessional.pieSliceText = "label";
    this.optionsProfessional.tooltip.text = "none";
    this.optionsProfessional.legend.position = "none";
    this.optionsCheck.pieSliceText = "label";
    this.optionsCheck.pieHole = 0.4;
    this.optionsCheck.tooltip.text = "none";
    this.optionsCheck.legend.position = "none";
    this.optionsEdi.pieHole = 0.4;
    this.optionsEdi.pieSliceText = "label";
    this.optionsEdi.tooltip.text = "none";
    this.optionsEdi.legend.position = "none";
    this.optionsAdj.pieHole = 0.4;
    this.optionsAdj.pieSliceText = "label";
    this.optionsAdj.tooltip.text = "none";
    this.optionsAdj.legend.position = "none";
  }

  getDataChart() {
    this.optionsProfessional.pieHole = 0.25;
    this.optionsCheck.pieHole = 0.25;
    this.optionsEdi.pieHole = 0.25;
    this.optionsAdj.pieHole = 0.25;
    this.dataProfessional = [];
    this.dataCheck = [];
    this.dataEdi = [];
    this.dataAdj = [];
    let responseValue = [];
    responseValue = this.auditCategoryDto.auditCategoryDtos;
    const dataProfessionalArray = [];
    const dataCheckArray = [];
    const dataEdiArray = [];
    const dataAdjArray = [];
    dataProfessionalArray.push(
      {
        category: "Professional",
        count: 0
      },
      {
        category: "Institutional-IP",
        count: 0
      },
      {
        category: "Institutional-OP",
        count: 0
      },
      {
        category: "Others",
        count: 0
      }
    );
    dataCheckArray.push(
      {
        category: "Check Issued",
        count: 0
      },
      {
        category: "Check Not Issued",
        count: 0
      },
      {
        category: "Denied",
        count: 0
      }
    );
    dataEdiArray.push(
      {
        category: "EDI",
        count: 0
      },
      {
        category: "Paper",
        count: 0
      }
    );
    dataAdjArray.push(
      {
        category: "Auto Adjudicated",
        count: 0
      },
      {
        category: "Manually Adjudicated",
        count: 0
      }
    );
    this.mapProfessionalResponseValue(responseValue, dataProfessionalArray);
    this.mapCheckResponseValue(responseValue, dataCheckArray);
    this.mapEdiResponseValue(responseValue, dataEdiArray);
    this.mapAdjResponseValue(responseValue, dataAdjArray);
  }

  mapProfessionalResponseValue(responseValue, dataProfessionalArray) {
    responseValue.map(val => {
      if (val.category.toLowerCase() === "professional") {
        dataProfessionalArray[0].count = val.count;
      }
      if (val.category.toLowerCase() === "institutional-ip") {
        dataProfessionalArray[1].count = val.count;
      }
      if (val.category.toLowerCase() === "institutional-op") {
        dataProfessionalArray[2].count = val.count;
      }
      if (val.category.toLowerCase() === "others") {
        dataProfessionalArray[3].count = val.count;
      }
    });
    dataProfessionalArray.map(val => {
      this.dataProfessional.push([val.category, val.count]);
    });
    this.optionsProfessional.pieSliceText = "value-and-percentage";
    this.optionsProfessional.tooltip.text = "value-and-percentage";
    this.optionsProfessional.legend.position = "top";
  }

  mapCheckResponseValue(responseValue, dataCheckArray) {
    responseValue.map(val => {
      if (val.category.toLowerCase() === "check issued") {
        dataCheckArray[0].count = val.count;
      }
      if (val.category.toLowerCase() === "check not issued") {
        dataCheckArray[1].count = val.count;
      }
      if (val.category.toLowerCase() === "denied") {
        dataCheckArray[2].count = val.count;
      }
    });
    dataCheckArray.map(val => {
      this.dataCheck.push([val.category, val.count]);
    });
    this.optionsCheck.pieSliceText = "value-and-percentage";
    this.optionsCheck.tooltip.text = "value-and-percentage";
    this.optionsCheck.legend.position = "top";
  }

  mapEdiResponseValue(responseValue, dataEdiArray) {
    responseValue.map(val => {
      if (val.category.toLowerCase() === "edi") {
        dataEdiArray[0].count = val.count;
      }
      if (val.category.toLowerCase() === "paper") {
        dataEdiArray[1].count = val.count;
      }
    });
    dataEdiArray.map(val => {
      this.dataEdi.push([val.category, val.count]);
    });
    this.optionsEdi.pieSliceText = "value-and-percentage";
    this.optionsEdi.tooltip.text = "value-and-percentage";
    this.optionsEdi.legend.position = "top";
  }

  mapAdjResponseValue(responseValue, dataAdjArray) {
    responseValue.map(val => {
      if (val.category.toLowerCase() === "auto adjudicated") {
        dataAdjArray[0].count = val.count;
      }
      if (val.category.toLowerCase() === "manually adjudicated") {
        dataAdjArray[1].count = val.count;
      }
    });
    dataAdjArray.map(val => {
      this.dataAdj.push([val.category, val.count]);
    });
    this.optionsAdj.pieSliceText = "value-and-percentage";
    this.optionsAdj.tooltip.text = "value-and-percentage";
    this.optionsAdj.legend.position = "top";
  }

  openClaimTypePopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const claimType = this.dataProfessional[row][0];
      const count = this.dataProfessional[row][1];
      this.editUser = {
        chartType: "claimType",
        type: claimType
      };
      this.editMode = true;
    }
  }

  openPaymentStatusPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const paymentType = this.dataCheck[row][0];
      const count = this.dataCheck[row][1];
      this.editUser = {
        chartType: "paymentType",
        type: paymentType
      };
      this.editMode = true;
    }
  }

  openClaimSourcePopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const claimsource = this.dataEdi[row][0];
      const count = this.dataEdi[row][1];
      this.editUser = {
        chartType: "claimSource",
        type: claimsource
      };
      this.editMode = true;
    }
  }

  openAdjPopUp(e) {
    this.editUser = {};
    if (e.length > 0) {
      const row = e[0].row;
      const adjType = this.dataAdj[row][0];
      const count = this.dataAdj[row][1];
      this.editUser = {
        chartType: "adjudicatedType",
        type: adjType
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getCategoryDays() {
    this.auditorService.getAuditorClaimsAuditedCategory();
    this.auditCategoryDto = this.auditorService.auditorCategoryResponse;
    this.auditCategoryDto = null;
    this.categorySubscription = this.auditorService
      .getAuditorClaimsAuditedCategoryListner()
      .subscribe((data: any) => {
        this.auditCategoryDto = data;
        this.dataAdj = [];
        this.dataCheck = [];
        this.dataEdi = [];
        this.dataProfessional = [];
        if (
          this.auditCategoryDto &&
          this.auditCategoryDto.auditCategoryDtos.length > 0
        ) {
          this.isDataPresent = true;
          this.getDataChart();
        } else {
          this.isDataPresent = false;
          this.getNoDataChart();
        }
        this.categorySubscription.unsubscribe();
      });
    if (this.auditCategoryDto === null || this.auditCategoryDto === undefined) {
      this.isDataPresent = false;
      this.getNoDataChart();
    }
    this.isProfessionalRendered = true;
    this.isCheckRendered = true;
    this.isEdiRendered = true;
    this.isAdjRendered = true;
  }

  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
  }
}
