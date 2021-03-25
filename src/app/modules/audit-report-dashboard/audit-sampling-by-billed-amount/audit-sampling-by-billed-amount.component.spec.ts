import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditSamplingByBilledAmountComponent } from "./audit-sampling-by-billed-amount.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import {
  billedAmtSampling,
  auditDates
} from "./../mocks/report-dashboard.mock";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

class MockAuditDashboardService extends AuditReportDashboardService {
  getAuditSamplingBilledAmt() {
    const prodArray = billedAmtSampling;
    this.auditSamplingBilledAmtFetch.next(prodArray);
  }
  getAuditDates() {
    return auditDates;
  }
  resetFormSubject() {
    return auditDates;
  }
}

describe("AuditSamplingByBilledAmountComponent", () => {
  let component: AuditSamplingByBilledAmountComponent;
  let fixture: ComponentFixture<AuditSamplingByBilledAmountComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditSamplingByBilledAmountComponent],
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
    fixture = TestBed.createComponent(AuditSamplingByBilledAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditSamplingByBilledAmountComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set to empty audit details when response is not present", () => {
      component.processedDates = [];
      fixture.detectChanges();
      component.getAuditDetails();
      spyOn(service, "resetFormSubject").and.returnValue(of(null));
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
      expect(component.dataAudit[0]).toEqual(["NO DATA", 1, "1"]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsAudit.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.tooltip.text).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsAudit.legend.position = "top";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.legend.position).toBe("none");
    });
    it("should set tooltip text in chart when data is not empty", () => {
      component.auditReportBilledAmountDtos = billedAmtSampling;
      component.optionsAudit.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.auditReportBilledAmountDtos = billedAmtSampling;
      component.optionsAudit.legend.position = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataAudit = [];
      component.auditReportBilledAmountDtos = billedAmtSampling;
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
      fixture = TestBed.createComponent(AuditSamplingByBilledAmountComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch audit data", () => {
      component.processedDates = auditDates.auditDates;
      const servSpy = spyOn(service, "getAuditSamplingBilledAmt");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when error occurs", () => {
      component.processedDates = auditDates.auditDates;
      spyOn(service, "getAuditSamplingBilledAmt").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      component.processedDates = auditDates.auditDates;
      spyOn(service, "getAuditSamplingBilledAmt");
      component.auditReportBilledAmountDtos = null;
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
      fixture = TestBed.createComponent(AuditSamplingByBilledAmountComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  });

  it("should get AuditDetails", () => {
    const service: AuditReportDashboardService = fixture.debugElement.injector.get(
      AuditReportDashboardService
    );
    spyOn(service, "getAuditSamplingBilledAmt");
    spyOn(service, "getAuditSamplingBilledAmtListner").and.returnValue(
      of({
        auditReportBilledAmountDtos: [
          {
            billedAmtStart: 1000,
            billedAmtEnd: 10,
            claimCount: 12
          }
        ]
      })
    );
    spyOn(service, "getAuditDates").and.returnValue(
      of({ auditDates: ["12/11/2010", "12/12/2018"] })
    );
    component.processedDates = auditDates.auditDates;
    component.getAuditDays();
    (component as any).resetFormSubject.next(null);
    (component as any).resetFormSubject.next(true);
    // component.getAuditDays();
    expect(component.isAuditRendered).toBeTruthy();
  });

  it("setChartScroll", () => {
    component.processedDates = auditDates.auditDates;
    component.dataAudit = [];
    component.setChartScroll();
    component.dataAudit = [
      {
        billedAmtStart: 1000,
        billedAmtEnd: 10,
        claimCount: 12
      },
      {
        billedAmtStart: 1000,
        billedAmtEnd: 10,
        claimCount: 12
      },
      {
        billedAmtStart: 1000,
        billedAmtEnd: 10,
        claimCount: 12
      },
      {
        billedAmtStart: 1000,
        billedAmtEnd: 10,
        claimCount: 12
      },
      {
        billedAmtStart: 1000,
        billedAmtEnd: 10,
        claimCount: 12
      },
      {
        billedAmtStart: 1000,
        billedAmtEnd: 10,
        claimCount: 12
      },
      {
        billedAmtStart: 1000,
        billedAmtEnd: 10,
        claimCount: 12
      },
      {
        billedAmtStart: 1000,
        billedAmtEnd: 10,
        claimCount: 12
      }
    ];
    component.setChartScroll();
    expect(component.optionsAudit.height).toBeGreaterThan(230);
  });
});
