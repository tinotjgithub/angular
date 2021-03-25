import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditorQualityScoreComponent } from "./auditor-quality-score.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { qualityScore } from "src/app/mocks/auditor-landing-page-charts.mock";
import { AuditorService } from "./../../../../../services/auditor/auditor.service";
import { of, throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditorQualityScoreDetailsComponent } from "./auditor-quality-score-details/auditor-quality-score-details.component";
import { TableModule } from "primeng/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

class MockAuditorService extends AuditorService {
  getAuditorQualityScore() {
    const qualityArray: any = qualityScore;
    this.auditorQualityScoreFetch.next(qualityArray);
  }
}

describe("AuditorQualityScoreComponent", () => {
  let component: AuditorQualityScoreComponent;
  let fixture: ComponentFixture<AuditorQualityScoreComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditorQualityScoreComponent,
        AuditorQualityScoreDetailsComponent
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        TableModule,
        ReactiveFormsModule,
        CalendarModule,
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
    fixture = TestBed.createComponent(AuditorQualityScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorQualityScoreComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set displayEnlarded to true", () => {
      component.displayEnlarged = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.displayEnlarged).toBe(true);
    });

    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataQuality = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataQuality[0]).toEqual(["NO DATA", 1]);
    });
    it("should set pie slice text in chart to a default value when data is empty", () => {
      component.optionsQuality.pieSliceText = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsQuality.pieSliceText).toBe("label");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsQuality.tooltip.text = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsQuality.tooltip.text).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsQuality.legend.position = "top";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsQuality.legend.position).toBe("none");
    });
    it("should set pie slice text in chart to a default value when data is empty", () => {
      component.auditQualityScoreDto = qualityScore;
      component.optionsQuality.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsQuality.pieSliceText).toBe(
        "value-and-percentage"
      );
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.auditQualityScoreDto = qualityScore;
      component.optionsQuality.tooltip.text = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsQuality.tooltip.text).toBe(
        "value-and-percentage"
      );
    });
    it("should display legend when there are values", () => {
      component.auditQualityScoreDto = qualityScore;
      component.optionsQuality.legend.position = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsQuality.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataQuality = [];
      component.auditQualityScoreDto = qualityScore;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataQuality.length;
      expect(l).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorQualityScoreComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch quality-data", () => {
      const servSpy = spyOn(service, "getAuditorQualityScore");
      fixture.detectChanges();
      component.getStatusDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      spyOn(service, "getAuditorQualityScore").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when null response", () => {
      spyOn(service, "getAuditorQualityScore").and.returnValue(null);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when undefined response", () => {
      spyOn(service, "getAuditorQualityScore").and.returnValue(undefined);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      fixture.detectChanges();
      component.getStatusDays();
      expect(component.isStatusRendered).toBeTruthy();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      spyOn(service, "getAuditorQualityScore");
      component.auditQualityScoreDto = null;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is undefined", () => {
      spyOn(service, "getAuditorQualityScore");
      component.auditQualityScoreDto = undefined;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });

    it("should map response values", () => {
      const dataQualityArray = [];
      dataQualityArray.push(
        {
          status: "Audit Failed",
          claimCount: 12
        },
        {
          status: "Audit Passed",
          claimCount: 12
        },
        {
          status: "Audit Rebutted",
          claimCount: 13
        }
      );
      component.mapResponseValue(
        qualityScore.auditStatusCountDtos,
        dataQualityArray
      );
      const len = component.dataQuality.length;
      expect(len).toEqual(4);
    });

    it("should close popup", () => {
      component.editUser = {
        status: "Audit Failed"
      };
      component.editMode = true;
      component.dataQuality = [
        ["Audit Failed", 6],
        ["Rebuttal Accepted", 10]
      ];
      const e = [];
      e.push({ column: null, row: 0 });
      fixture.detectChanges();
      component.closePopUp();
      expect(component.editMode).toBeFalsy();
    });

    it("should open Payment popup when selected object has values", () => {
      const e = [];
      e.push({ column: null, row: 0 });
      component.editMode = false;
      component.dataQuality = [
        ["Audit Failed", 6],
        ["Rebuttal Accepted", 10]
      ];
      fixture.detectChanges();
      component.openPopUp(e);
      expect(component.editMode).toBeTruthy();
    });

    it("should not open popup when selected object has no values", () => {
      const e = [];
      component.editMode = false;
      component.dataQuality = [
        ["Audit Failed", 6],
        ["Rebuttal Accepted", 10]
      ];
      fixture.detectChanges();
      component.openPopUp(e);
      expect(component.editMode).toBeFalsy();
    });
  });
});
