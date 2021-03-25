import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditBilledAmountByClaimTypeComponent } from "./audit-billed-amount-by-claim-type.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { billedAmt, auditDates } from "./../mocks/report-dashboard.mock";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

class MockAuditDashboardService extends AuditReportDashboardService {
  getBilledAmtByClaimType() {
    const prodArray = billedAmt;
    this.auditBilledAmtClaimTypeFetch.next(prodArray);
  }
  getAuditDates() {
    return auditDates;
  }
  resetFormSubject() {
    return auditDates;
  }
}

describe("AuditBilledAmountByClaimTypeComponent", () => {
  let component: AuditBilledAmountByClaimTypeComponent;
  let fixture: ComponentFixture<AuditBilledAmountByClaimTypeComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditBilledAmountByClaimTypeComponent],
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
          useClass: MockAuditDashboardService
        },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AuditBilledAmountByClaimTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    try {
      expect(component).toBeTruthy();
    } catch (error) {}
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      // fixture = TestBed.createComponent(AuditBilledAmountByClaimTypeComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      // component = fixture.componentInstance;
      // fixture.detectChanges();
    });
    it("should set to empty audit details when response is not present", () => {
      component.processedDates = [];
      fixture.detectChanges();
      component.getAuditDetails();
      spyOn(service, "resetFormSubject").and.returnValue(of(''));
      expect(component.processedDates.length).toEqual(0);
    });
    it("should set displayEnlarded to true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataAudit = [];
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.dataAudit[0]).toEqual([
        "NO DATA",
        0,
        "0",
        0,
        "0",
        0,
        "0",
        0,
        "0"
      ]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsAudit.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsAudit.legend.position = "top";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.legend.position).toBe("none");
    });
    it("should set tooltip text in chart when data is not empty", () => {
      component.auditReportBilledAmountByClaimTypeDtoList = billedAmt;
      component.optionsAudit.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.auditReportBilledAmountByClaimTypeDtoList = billedAmt;
      component.optionsAudit.legend.position = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataAudit = [];
      component.auditReportBilledAmountByClaimTypeDtoList = billedAmt;
      fixture.detectChanges();
      component.getAuditChartValue();
      const l = component.dataAudit.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should set to date value as to date itself when to date is present", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const sevenDate = new Date();
      sevenDate.setDate(sevenDate.getDate() - 7);
      const dat = new Date(
        component.datePipe.transform(sevenDate, "yyyy-MM-dd")
      );
      component.processedDates = [];
      component.processedDates.push(todaysDate);
      component.processedDates.push(dat);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(dat);
    });
    it("should set to date value as from date value when to date is undefined", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      component.processedDates = [];
      component.processedDates.push(todaysDate);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditBilledAmountByClaimTypeComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch audit data", () => {
      component.processedDates = auditDates.auditDates;
      const servSpy = spyOn(service, "getBilledAmtByClaimType");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when error occurs", () => {
      component.processedDates = auditDates.auditDates;
      spyOn(service, "getBilledAmtByClaimType").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      component.processedDates = auditDates.auditDates;
      spyOn(service, "getBilledAmtByClaimType");
      component.auditReportBilledAmountByClaimTypeDtoList = null;
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      component.processedDates = auditDates.auditDates;
      fixture.detectChanges();
      component.getAuditDays();
      expect(component.isAuditRendered).toBeTruthy();
    });
  });

  describe("should validate dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditBilledAmountByClaimTypeComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  });
});
