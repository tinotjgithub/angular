import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditStatusByErrorTypeComponent } from "./audit-status-by-error-type.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { statusByError, auditDates } from "./../mocks/report-dashboard.mock";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";
import { of, throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

class MockAuditReportDashboardService extends AuditReportDashboardService {
  getAuditSamplingErr() {
    const statusArray: any = statusByError;
    this.samplingAmtFetch.next(statusArray);
  }
  getAuditDates() {
    const statusArray: any = auditDates;
    return statusArray;
  }
}

describe("AuditStatusByErrorTypeComponent", () => {
  let component: AuditStatusByErrorTypeComponent;
  let fixture: ComponentFixture<AuditStatusByErrorTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditStatusByErrorTypeComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
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
    fixture = TestBed.createComponent(AuditStatusByErrorTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditStatusByErrorTypeComponent);
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
      component.auditStatusCountDto = statusByError;
      component.optionsStatus.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.pieSliceText).toBe("value-and-percentage");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.auditStatusCountDto = statusByError;
      component.optionsStatus.tooltip.text = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.tooltip.text).toBe("value-and-percentage");
    });
    it("should display legend when there are values", () => {
      component.auditStatusCountDto = statusByError;
      component.optionsStatus.legend.position = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataStatus = [];
      component.auditStatusCountDto = statusByError;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataStatus.length;
      expect(l).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditStatusByErrorTypeComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch status-data", () => {
      const servSpy = spyOn(service, "getAuditSamplingErr");
      fixture.detectChanges();
      component.getStatusDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      spyOn(service, "getAuditSamplingErr").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when null response", () => {
      spyOn(service, "getAuditSamplingErr").and.returnValue(null);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when undefined response", () => {
      spyOn(service, "getAuditSamplingErr").and.returnValue(undefined);
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
      spyOn(service, "getAuditSamplingErr");
      component.auditStatusCountDto = null;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is undefined", () => {
      spyOn(service, "getAuditSamplingErr");
      component.auditStatusCountDto = undefined;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });

    it("should map response values", () => {
      const dataStatusArray = [];
      dataStatusArray.push(
        {
          status: "Financial",
          claimCount: 5
        },
        {
          status: "Procedural",
          claimCount: 5
        },
        {
          status: "Both",
          claimCount: 6
        }
      );
      component.mapResponseValue(
        statusByError.auditClaimCountDto,
        dataStatusArray
      );
      const len = component.dataStatus.length;
      expect(len).toEqual(4);
    });
  });

  it("getAuditDetails", () => {
    const service: AuditReportDashboardService = fixture.debugElement.injector.get(AuditReportDashboardService);
    component.processedDates = [];
    spyOn(service, 'getAuditDates').and.returnValue({auditDates: ['12/11/2012', '12/12/2012']});
    spyOn(service, 'getAuditSamplingErr');
    spyOn(service, 'getAuditSamplingErrListner').and.returnValue(of({auditClaimCountDto : [
      {
        status: "Financial",
        claimCount: 0
      },
      {
        status: "Procedural",
        claimCount: 0
      },
      {
        status: "Both",
        claimCount: 0
      }
    ]}));
    fixture.detectChanges();
    component.getAuditDetails();
    (component as any).resetFormSubject.next(null);
    component.processedDates = ['12/11/2012', '12/12/2012'];
    (component as any).resetFormSubject.next(true);
    expect(component.processedDates.length).toEqual(2);
  });

  it("getStatusDays", () => {
    const service: AuditReportDashboardService = fixture.debugElement.injector.get(AuditReportDashboardService);
    component.processedDates = ['12/11/2012', '12/12/2012'];
    spyOn(service, 'getAuditSamplingErrListner').and.returnValue(of({auditClaimCountDto : []}));
    component.getStatusDays();
    expect(component.processedDates.length).toEqual(2);
  });
});
