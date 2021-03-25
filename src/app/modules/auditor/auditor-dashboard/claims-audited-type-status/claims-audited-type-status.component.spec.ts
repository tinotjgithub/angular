import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsAuditedTypeStatusComponent } from "./claims-audited-type-status.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { auditTypeStatus, auditDetails } from "./../auditor-dashboard.mock";
import { AuditDashboardService } from "./../audit-dashboard.service";
import { of, throwError, BehaviorSubject } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditedClaimsDetailsComponent } from '../audited-claims-details/audited-claims-details.component';
import { TableModule } from 'primeng/table';
import { MockAuditDashboardService } from '../audit-dashboard/audit-dashboard.component.spec';

class MockAuditDashboardService2 extends MockAuditDashboardService {
  getAuditTypeStatus() {
    const prodArray = auditTypeStatus;
    this.auditTypeStatusFetch.next(prodArray);
  }
  getAuditDates() {
    return auditDetails;
  }
}

describe("ClaimsAuditedTypeStatusComponent", () => {
  let component: ClaimsAuditedTypeStatusComponent;
  let fixture: ComponentFixture<ClaimsAuditedTypeStatusComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClaimsAuditedTypeStatusComponent,
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
        { provide: AuditDashboardService, useClass: MockAuditDashboardService2 },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAuditedTypeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditedTypeStatusComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set to empty audit details when response is not present", () => {
      component.processedDates = [];
      component.resetFormSubject = new BehaviorSubject(false);
      fixture.detectChanges();
      component.getAuditDetails();
      expect(component.processedDates.length).toEqual(0);
    });
    it("should set to empty audit details when response is present", () => {
      component.processedDates = [];
      component.resetFormSubject = new BehaviorSubject(true);
      spyOn(component, 'getAuditDays');
      fixture.detectChanges();
      component.getAuditDetails();
      expect(component.processedDates.length > 0).toBeTruthy();
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
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.auditStatusScoreDto = auditTypeStatus.auditStatusScoreDto;
      component.optionsAudit.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.auditStatusScoreDto = auditTypeStatus.auditStatusScoreDto;
      component.optionsAudit.legend.position = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataAudit = [];
      component.auditStatusScoreDto = auditTypeStatus.auditStatusScoreDto;
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
      fixture = TestBed.createComponent(ClaimsAuditedTypeStatusComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch audit data", () => {
      component.processedDates = auditDetails.auditDates;
      const servSpy = spyOn(service, "getAuditTypeStatus");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when error occurs", () => {
      component.processedDates = auditDetails.auditDates;
      spyOn(service, "getAuditTypeStatus").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      component.processedDates = auditDetails.auditDates;
      spyOn(service, "getAuditTypeStatus");
      component.auditStatusScoreDto = null;
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      component.processedDates = auditDetails.auditDates;
      spyOn(service, 'getAuditTypeStatusListner').and.returnValue(of({
        auditStatusScoreDto: []
      }));
      fixture.detectChanges();
      component.getAuditDays();
      expect(component.isAuditRendered).toBeTruthy();
    });
  });

  describe("should validate dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditedTypeStatusComponent);
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
        'test', 0, 0, 0, 0, 0, 0
      ],
      [
        'test1', 0, 0, 0, 0, 0, 0
      ],
      [
        'test2', 0, 0, 0, 0, 0, 0
      ],
      [
        'test3', 0, 0, 0, 0, 0, 0
      ],
      [
        'test4', 0, 0, 0, 0, 0, 0
      ],
      [
        'test5', 0, 0, 0, 0, 0, 0
      ],
      [
        'test6', 0, 0, 0, 0, 0, 0
      ],
      [
        'test7', 0, 0, 0, 0, 0, 0
      ],
      [
        'test8', 0, 0, 0, 0, 0, 0
      ],
      [
        'test9', 0, 0, 0, 0, 0, 0
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
    component.closePopUp();
    expect(component.editMode).toBeFalsy();
  });

  it("should mapParsedResponseValue", () => {
    expect(component.mapParsedResponseValue([{}], true)).toBeTruthy();
  });
});
