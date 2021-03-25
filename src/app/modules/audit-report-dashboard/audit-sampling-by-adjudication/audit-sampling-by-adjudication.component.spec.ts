import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditSamplingByAdjudicationComponent } from "./audit-sampling-by-adjudication.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { auditAdj, auditDates } from "./../mocks/report-dashboard.mock";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";
import { of, throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
import { APP_INITIALIZER } from '@angular/core';

class MockAuditReportDashboardService extends AuditReportDashboardService {
  getAuditSamplingAdj() {
    const statusArray: any = auditAdj;
    this.samplingAdjFetch.next(statusArray);
  }
  getAuditDates() {
    const statusArray: any = auditDates;
    return statusArray;
  }
}

describe("AuditSamplingByAdjudicationComponent", () => {
  let component: AuditSamplingByAdjudicationComponent;
  let fixture: ComponentFixture<AuditSamplingByAdjudicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditSamplingByAdjudicationComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        {
          provide: AuditReportDashboardService,
          useClass: MockAuditReportDashboardService
        },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSamplingByAdjudicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditSamplingByAdjudicationComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
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
      component.dataStatus = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataStatus[0]).toEqual(["NO DATA", 1]);
    });
    it("should set pie slice text in chart to a default value when data is empty", () => {
      component.optionsStatus.pieSliceText = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.pieSliceText).toBe("label");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsStatus.tooltip.text = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.tooltip.text).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsStatus.legend.position = "top";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.legend.position).toBe("none");
    });
    it("should set pie slice text in chart to a default value when data is empty", () => {
      component.auditClaimCountDto = auditAdj;
      component.optionsStatus.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.pieSliceText).toBe("value-and-percentage");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.auditClaimCountDto = auditAdj;
      component.optionsStatus.tooltip.text = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.tooltip.text).toBe("value-and-percentage");
    });
    it("should display legend when there are values", () => {
      component.auditClaimCountDto = auditAdj;
      component.optionsStatus.legend.position = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataStatus = [];
      component.auditClaimCountDto = auditAdj;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataStatus.length;
      expect(l).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditSamplingByAdjudicationComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch data", () => {
      const servSpy = spyOn(service, "getAuditSamplingAdj");
      fixture.detectChanges();
      component.getStatusDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      spyOn(service, "getAuditSamplingAdj").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when null response", () => {
      spyOn(service, "getAuditSamplingAdj").and.returnValue(null);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when undefined response", () => {
      spyOn(service, "getAuditSamplingAdj").and.returnValue(undefined);
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
      spyOn(service, "getAuditSamplingAdj");
      component.auditClaimCountDto = null;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is undefined", () => {
      spyOn(service, "getAuditSamplingAdj");
      component.auditClaimCountDto = undefined;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });

    it("should map response values", () => {
      const dataStatusArray = [];
      dataStatusArray.push(
        {
          status: "Auto",
          claimCount: 2
        },
        {
          status: "Manual",
          claimCount: 31
        }
      );
      component.mapResponseValue(auditAdj.auditClaimCountDto, dataStatusArray);
      const len = component.dataStatus.length;
      expect(len).toEqual(3);
    });
  });
});
