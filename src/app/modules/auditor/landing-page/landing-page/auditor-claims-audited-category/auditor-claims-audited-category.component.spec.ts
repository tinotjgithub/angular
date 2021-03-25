import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditorClaimsAuditedCategoryComponent } from "./auditor-claims-audited-category.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { categoryScore } from "src/app/mocks/auditor-landing-page-charts.mock";
import { AuditorService } from "./../../../../../services/auditor/auditor.service";
import { of, throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { TableModule } from "primeng/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// tslint:disable-next-line: max-line-length
import { ClaimsAuditedCategoryDetailsComponent } from "./claims-audited-category-details/claims-audited-category-details.component";

class MockAuditorService extends AuditorService {
  getAuditorClaimsAuditedCategory() {
    const categoryArray: any = categoryScore;
    this.auditorCategoryFetch.next(categoryArray);
  }
}

describe("AuditorClaimsAuditedCategoryComponent", () => {
  let component: AuditorClaimsAuditedCategoryComponent;
  let fixture: ComponentFixture<AuditorClaimsAuditedCategoryComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditorClaimsAuditedCategoryComponent,
        ClaimsAuditedCategoryDetailsComponent
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        TableModule,
        DialogModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuditorService, useClass: MockAuditorService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorClaimsAuditedCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorClaimsAuditedCategoryComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set data in chart as 'No Data' when data is empty for professional chart", () => {
      component.dataProfessional = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataProfessional[0]).toEqual(["NO DATA", 1]);
    });
    it("should set data in chart as 'No Data' when data is empty for check chart", () => {
      component.dataCheck = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataCheck[0]).toEqual(["NO DATA", 1]);
    });
    it("should set data in chart as 'No Data' when data is empty for Edi chart", () => {
      component.dataEdi = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataEdi[0]).toEqual(["NO DATA", 1]);
    });
    it("should set data in chart as 'No Data' when data is empty for adjudication chart", () => {
      component.dataAdj = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataAdj[0]).toEqual(["NO DATA", 1]);
    });

    it("should set pie slice text in chart to a default value when data is empty for professional chart", () => {
      component.optionsProfessional.pieSliceText = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsProfessional.pieSliceText).toBe("label");
    });
    it("should set pie slice text in chart to a default value when data is empty for Check chart", () => {
      component.optionsCheck.pieSliceText = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsCheck.pieSliceText).toBe("label");
    });
    it("should set pie slice text in chart to a default value when data is empty for EDI chart", () => {
      component.optionsEdi.pieSliceText = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsEdi.pieSliceText).toBe("label");
    });
    it("should set pie slice text in chart to a default value when data is empty for Adjudication chart", () => {
      component.optionsAdj.pieSliceText = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsAdj.pieSliceText).toBe("label");
    });

    it("should set tooltip text in chart to a default value when data is empty for professional chart", () => {
      component.optionsProfessional.tooltip.text = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsProfessional.tooltip.text).toBe("none");
    });
    it("should not display legend when there are no values for professional chart", () => {
      component.optionsProfessional.legend.position = "top";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsProfessional.legend.position).toBe("none");
    });
    it("should set pie slice text in chart to a default value when data is empty for professional chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsProfessional.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsProfessional.pieSliceText).toBe(
        "value-and-percentage"
      );
    });
    it("should set pie slice text in chart to a default value when data is empty for Check chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsCheck.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsCheck.pieSliceText).toBe("value-and-percentage");
    });
    it("should set pie slice text in chart to a default value when data is empty for EDI chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsEdi.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsEdi.pieSliceText).toBe("value-and-percentage");
    });
    it("should set pie slice text in chart to a default value when data is not empty for Adjudication chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsAdj.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsAdj.pieSliceText).toBe("value-and-percentage");
    });
    it("should set pie slice text in chart to a default value when data is not empty for Check chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsCheck.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsCheck.pieSliceText).toBe("value-and-percentage");
    });
    it("should set pie slice text in chart to a default value when data is not empty for Edi chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsEdi.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsEdi.pieSliceText).toBe("value-and-percentage");
    });
    it("should set pie slice text in chart to a default value when data is not empty for Adjudication chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsAdj.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsAdj.pieSliceText).toBe("value-and-percentage");
    });

    it("should set tooltip text in chart to a default value when data is empty for professional chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsProfessional.tooltip.text = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsProfessional.tooltip.text).toBe(
        "value-and-percentage"
      );
    });
    it("should display legend when there are values for professional chart", () => {
      component.auditCategoryDto = categoryScore;
      component.optionsProfessional.legend.position = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsProfessional.legend.position).toBe("top");
    });
    it("should map response value when response value is present for professional score chart", () => {
      component.dataProfessional = [];
      component.auditCategoryDto = categoryScore;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataProfessional.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should map response value when response value is present for Check sore chart", () => {
      component.dataCheck = [];
      component.auditCategoryDto = categoryScore;
      // fixture.detectChanges();
      try {
        component.getDataChart();
      } catch (error) {}
      const l = component.dataCheck.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should map response value when response value is present for EDI score chart", () => {
      component.dataEdi = [];
      component.auditCategoryDto = categoryScore;
      spyOn(service, "getAuditorClaimsAuditedCategory").and.callFake(() =>
        console.log("getAuditorClaimsAuditedCategory")
      );
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataEdi.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should map response value when response value is present for Adjudication score chart", () => {
      component.dataAdj = [];
      component.auditCategoryDto = categoryScore;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataAdj.length;
      expect(l).toBeGreaterThan(0);
    });

    it("should open Adjudication Type popup when selected object has values", () => {
      const e = [];
      e.push({ column: 1, row: 1 });
      component.editMode = false;
      component.dataAdj = [
        ["Auto Adjudicated", 12],
        ["Manually", 12]
      ];
      const row = e[0].row;
      const adjType = component.dataAdj[row][0];
      component.editUser = {
        chartType: "adjudicatedType",
        type: adjType
      };
      fixture.detectChanges();

      component.openAdjPopUp(e);
      expect(component.editMode).toBeTruthy();
    });

    it("should close Adjudication Type popup", () => {
      component.editMode = true;
      component.dataAdj = [
        ["Auto Adjudicated", 12],
        ["Manually", 12]
      ];
      const e = [];
      e.push({ column: 1, row: 1 });
      const row = e[0].row;
      const adjType = component.dataAdj[row][0];
      component.editUser = {
        chartType: "adjudicatedType",
        type: adjType
      };
      fixture.detectChanges();
      component.closePopUp();
      expect(component.editMode).toBeFalsy();
    });

    it("should not open Adjudication Type popup when selected object has no values", () => {
      const e = [];
      component.editMode = false;
      component.dataAdj = [
        ["Auto Adjudicated", 12],
        ["Manually", 12]
      ];
      fixture.detectChanges();
      component.openAdjPopUp(e);
      expect(component.editMode).toBeFalsy();
    });
  });

  it("should close EDI popup", () => {
    component.editMode = true;
    component.dataEdi = [
      ["EDI", 12],
      ["Paper", 12]
    ];
    const e = [];
    e.push({ column: 1, row: 1 });
    const row = e[0].row;
    const ediType = component.dataEdi[row][0];
    component.editUser = {
      chartType: "claimSource",
      type: ediType
    };
    fixture.detectChanges();
    component.closePopUp();
    expect(component.editMode).toBeFalsy();
  });

  it("should not open EDI popup when selected object has no values", () => {
    const e = [];
    component.editMode = false;
    component.dataEdi = [
      ["EDI", 12],
      ["Paper", 12]
    ];
    fixture.detectChanges();
    component.openClaimSourcePopUp(e);
    expect(component.editMode).toBeFalsy();
  });

  it("should open EDI popup when selected object has values", () => {
    const e = [];
    e.push({ column: 1, row: 1 });
    component.editMode = false;
    component.dataEdi = [
      ["EDI", 12],
      ["Paper", 12]
    ];
    const row = e[0].row;
    const ediType = component.dataEdi[row][0];
    component.editUser = {
      chartType: "claimSource",
      type: ediType
    };
    fixture.detectChanges();

    component.openClaimSourcePopUp(e);
    expect(component.editMode).toBeTruthy();
  });

  it("should not open EDI popup when selected object has no values", () => {
    const e = [];
    component.editMode = false;
    component.dataEdi = [
      ["EDI", 12],
      ["Paper", 12]
    ];
    fixture.detectChanges();
    component.openClaimSourcePopUp(e);
    expect(component.editMode).toBeFalsy();
  });

  it("should open claim type popup when selected object has values", () => {
    const e = [];
    e.push({ column: 1, row: 1 });
    component.editMode = false;
    component.dataProfessional = [];
    const row = e[0].row;
    component.dataProfessional = [
      ["Professional", 12],
      ["Institutional IP", 12],
      ["Institutional OP", 12]
    ];
    const ediType = component.dataProfessional[row][0];
    component.editUser = {
      chartType: "claimType",
      type: ediType
    };
    fixture.detectChanges();

    component.openClaimTypePopUp(e);
    expect(component.editMode).toBeTruthy();
  });

  it("should not open claim type popup when selected object has no values", () => {
    const e = [];
    component.editMode = false;
    component.dataProfessional = [
      ["Professional", 12],
      ["Institutional IP", 12],
      ["Institutional OP", 12]
    ];
    fixture.detectChanges();
    component.openClaimTypePopUp(e);
    expect(component.editMode).toBeFalsy();
  });

  it("should open Payment popup when selected object has values", () => {
    const e = [];
    e.push({ column: 1, row: 2 });
    component.editMode = false;
    component.dataCheck = [
      ["Check Issued", 12],
      ["Check Not Issued", 12],
      ["Denied", 12]
    ];
    const row = e[0].row;
    const ediType = component.dataCheck[row][0];
    component.editUser = {
      chartType: "paymentType",
      type: ediType
    };
    fixture.detectChanges();
    component.openPaymentStatusPopUp(e);
    expect(component.editMode).toBeTruthy();
  });

  it("should not open Payment status popup when selected object has no values", () => {
    const e = [];
    component.editMode = false;
    component.dataCheck = [
      ["Check Issued", 12],
      ["Check Not Issued", 12],
      ["Denied", 12]
    ];
    fixture.detectChanges();
    component.openPaymentStatusPopUp(e);
    expect(component.editMode).toBeFalsy();
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorClaimsAuditedCategoryComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch category-data", () => {
      const servSpy = spyOn(service, "getAuditorClaimsAuditedCategory");
      fixture.detectChanges();
      component.getCategoryDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      spyOn(service, "getAuditorClaimsAuditedCategory").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getCategoryDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when null response", () => {
      spyOn(service, "getAuditorClaimsAuditedCategory").and.returnValue(null);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getCategoryDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when undefined response", () => {
      spyOn(service, "getAuditorClaimsAuditedCategory").and.returnValue(
        undefined
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getCategoryDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render professional score chart", () => {
      fixture.detectChanges();
      component.getCategoryDays();
      expect(component.isProfessionalRendered).toBeTruthy();
    });
    it("should render Check score chart", () => {
      fixture.detectChanges();
      component.getCategoryDays();
      expect(component.isCheckRendered).toBeTruthy();
    });
    it("should render EDI score chart", () => {
      fixture.detectChanges();
      component.getCategoryDays();
      expect(component.isEdiRendered).toBeTruthy();
    });
    it("should render Adhjudicated score chart", () => {
      fixture.detectChanges();
      component.getCategoryDays();
      expect(component.isAdjRendered).toBeTruthy();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      spyOn(service, "getAuditorClaimsAuditedCategory");
      component.auditCategoryDto = null;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getCategoryDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is undefined", () => {
      spyOn(service, "getAuditorClaimsAuditedCategory");
      component.auditCategoryDto = undefined;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getCategoryDays();
      expect(locSpy).toHaveBeenCalled();
    });

    it("should map response values for professional score", () => {
      const dataProfessionalArray = [];
      dataProfessionalArray.push(
        {
          status: "Institutional-IP",
          count: 12
        },
        {
          status: "Institutional-OP",
          count: 11
        },
        {
          status: "Professional",
          count: 13
        },
        {
          status: "Others",
          count: 15
        }
      );
      component.mapProfessionalResponseValue(
        categoryScore.auditCategoryDtos,
        dataProfessionalArray
      );
      const len = component.dataProfessional.length;
      expect(len).toEqual(5);
    });

    it("should map response values for Check score", () => {
      const dataCheckArray = [];
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
      component.mapCheckResponseValue(
        categoryScore.auditCategoryDtos,
        dataCheckArray
      );
      const len = component.dataCheck.length;
      expect(len).toEqual(4);
    });

    it("should map response values for EDI score", () => {
      const dataEdiArray = [];
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
      component.mapEdiResponseValue(
        categoryScore.auditCategoryDtos,
        dataEdiArray
      );
      const len = component.dataEdi.length;
      expect(len).toEqual(3);
    });

    it("should map response values for Adjudicated score", () => {
      const dataAdjArray = [];
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
      component.mapAdjResponseValue(
        categoryScore.auditCategoryDtos,
        dataAdjArray
      );
      const len = component.dataAdj.length;
      expect(len).toEqual(3);
    });
  });
});
