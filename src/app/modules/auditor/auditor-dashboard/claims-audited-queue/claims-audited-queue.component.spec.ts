import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsAuditedQueueComponent } from "./claims-audited-queue.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { auditQueueCount, auditDetails } from "./../auditor-dashboard.mock";
import { AuditDashboardService } from "./../audit-dashboard.service";
import { of, throwError, BehaviorSubject } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditedClaimsDetailsComponent } from '../audited-claims-details/audited-claims-details.component';
import { TableModule } from 'primeng/table';
import { MockAuditDashboardService } from '../audit-dashboard/audit-dashboard.component.spec';

class MockAuditDashboardServiceTwo extends MockAuditDashboardService {
  resetFormSubject = new BehaviorSubject<any>(true);
  getAuditQueue() {
    const prodArray = auditQueueCount;
    this.auditSumryFetch.next(prodArray);
  }
  getAuditDates() {
    return auditDetails;
  }
}

describe("ClaimsAuditedQueueComponent", () => {
  let component: ClaimsAuditedQueueComponent;
  let fixture: ComponentFixture<ClaimsAuditedQueueComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClaimsAuditedQueueComponent,
        AuditedClaimsDetailsComponent
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule,
        TableModule
      ],
      providers: [
        { provide: AuditDashboardService, useClass: MockAuditDashboardServiceTwo },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAuditedQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditedQueueComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should audit details when response is true", () => {
      component.processedDates = [];
      component.processedDates.push(new Date());
      spyOn(component, 'getToDateValue').and.returnValue(new Date());
      component.resetFormSubject = new BehaviorSubject<any>(true);
      spyOn(service, "getAuditDates")
        .and.returnValue(of(auditDetails));
      spyOn(service, "getAuditQueue");
      spyOn(service, "getAuditQueueListner")
        .and.returnValue(of([]));
      component.getAuditDetails();
      component.resetFormSubject.subscribe(res => expect(res).toEqual(true));
      // expect(spy).toHaveBeenCalled());
    });
    it("should not set audit details when response is false", () => {
      component.processedDates = [];
      component.processedDates.push(new Date());
      component.resetFormSubject = new BehaviorSubject<any>(false);
      fixture.detectChanges();
      component.getAuditDetails();
      // const spy = spyOn(service, "getAuditDates").and.returnValue(of(auditDetails));
      component.resetFormSubject.subscribe(res => expect(res).toEqual(false));
      // expect(spy).toHaveBeenCalled());
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
      expect(component.dataAudit[0]).toEqual(["NO DATA", 0, "0"]);
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
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.auditQueueCountDtos = auditQueueCount;
      component.optionsAudit.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.auditQueueCountDtos = auditQueueCount;
      component.optionsAudit.legend.position = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataAudit = [];
      component.auditQueueCountDtos = auditQueueCount;
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
      fixture = TestBed.createComponent(ClaimsAuditedQueueComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch audit data", () => {
      component.processedDates = auditDetails.auditDates;
      const servSpy = spyOn(service, "getAuditQueue").and.returnValue(
        auditQueueCount
      );
      spyOn(service, "getAuditQueueListner")
        .and.returnValue(of({
          auditQueueCountDtos: []
        }));
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when error occurs", () => {
      component.processedDates = auditDetails.auditDates;
      spyOn(service, "getAuditQueue").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      component.processedDates = auditDetails.auditDates;
      spyOn(service, "getAuditQueue").and.returnValue(null);
      component.auditQueueCountDtos = null;
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      component.processedDates = auditDetails.auditDates;
      spyOn(service, "getAuditQueue").and.returnValue(undefined);
      component.auditQueueCountDtos = undefined;
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      component.processedDates = auditDetails.auditDates;
      fixture.detectChanges();
      component.getAuditDays();
      expect(component.isAuditRendered).toBeTruthy();
    });
  });

  describe("should validate dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditedQueueComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  });

  it("should openPopup", () => {
    const today = new Date();
    const todaysDate = new Date(
      component.datePipe.transform(today, "yyyy-MM-dd")
    );
    component.processedDates = [];
    component.processedDates.push(todaysDate);
    component.dataAudit = [
      [
        'test', 0, 0
      ],
      [
        'test1', 0, 0
      ],
      [
        'test2', 0, 0
      ],
      [
        'test3', 0, 0
      ],
      [
        'test4', 0, 0
      ],
      [
        'test5', 0, 0
      ],
      [
        'test6', 0, 0
      ]
    ];
    fixture.detectChanges();
    component.setChartScroll();
    component.openPopUp([]);
    expect(component.editMode).toBeFalsy();
    component.openPopUp([{row: 0}]);
    expect(component.editMode).toBeTruthy();
  });

  it("should close popup", () => {
    component.editMode = false;
    fixture.detectChanges();
    component.closePopUp();
    expect(component.editMode).toBeFalsy();
  });
});
