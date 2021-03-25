import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditSamplingByMethodComponent } from "./audit-sampling-by-method.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { samplingByMethod, auditDates } from "./../mocks/report-dashboard.mock";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";
import { of, throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

class MockAuditReportDashboardService extends AuditReportDashboardService {
  getAuditSamplingMethod() {
    const statusArray: any = samplingByMethod;
    this.samplingMethodFetch.next(statusArray);
  }
  getAuditDates() {
    const statusArray: any = auditDates;
    return statusArray;
  }
}

describe("AuditSamplingByMethodComponent", () => {
  let component: AuditSamplingByMethodComponent;
  let fixture: ComponentFixture<AuditSamplingByMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditSamplingByMethodComponent],
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
    fixture = TestBed.createComponent(AuditSamplingByMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditSamplingByMethodComponent);
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
      component.auditStatusCountDto = samplingByMethod;
      component.optionsStatus.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.pieSliceText).toBe("value-and-percentage");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.auditStatusCountDto = samplingByMethod;
      component.optionsStatus.tooltip.text = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.tooltip.text).toBe("value-and-percentage");
    });
    it("should display legend when there are values", () => {
      component.auditStatusCountDto = samplingByMethod;
      component.optionsStatus.legend.position = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataStatus = [];
      component.auditStatusCountDto = samplingByMethod;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataStatus.length;
      expect(l).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditSamplingByMethodComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch status-data", () => {
      const servSpy = spyOn(service, "getAuditSamplingMethod");
      fixture.detectChanges();
      component.getStatusDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      spyOn(service, "getAuditSamplingMethod").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when null response", () => {
      spyOn(service, "getAuditSamplingMethod").and.returnValue(null);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when undefined response", () => {
      spyOn(service, "getAuditSamplingMethod").and.returnValue(undefined);
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
      spyOn(service, "getAuditSamplingMethod");
      component.auditStatusCountDto = null;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is undefined", () => {
      spyOn(service, "getAuditSamplingMethod");
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
          status: "Manual",
          claimCount: 4
        },
        {
          status: "Auto",
          claimCount: 5
        },
        {
          status: "Auditor",
          claimCount: 3
        }
      );
      component.mapResponseValue(
        samplingByMethod.auditClaimCountDto,
        dataStatusArray
      );
      const len = component.dataStatus.length;
      expect(len).toEqual(4);
    });
  });
});
