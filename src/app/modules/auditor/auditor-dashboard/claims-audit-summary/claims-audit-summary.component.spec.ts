import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsAuditSummaryComponent } from "./claims-audit-summary.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { auditsummary } from "./../auditor-dashboard.mock";
import { AuditDashboardService } from "./../audit-dashboard.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { DropdownModule } from "primeng/dropdown";
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockAuditDashboardService extends AuditDashboardService {
  getAuditSumry() {
    const summaryArray = auditsummary;
    this.auditSumryFetch.next(summaryArray);
  }
}

describe("ClaimsAuditSummaryComponent", () => {
  let component: ClaimsAuditSummaryComponent;
  let fixture: ComponentFixture<ClaimsAuditSummaryComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsAuditSummaryComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule,
        DropdownModule,
        ReportsModule
      ],
      providers: [
        { provide: AuditDashboardService, useClass: MockAuditDashboardService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAuditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditSummaryComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set default daily value", () => {
      component.auditDates.get("dateRange").setErrors({ isValid: false });
      fixture.detectChanges();
      component.setDefaultDay();
      expect(
        component.auditDates.get("dateRange").hasError("isValid")
      ).toBeFalsy();
    });
    it("should set default monthly value", () => {
      component.auditDates.get("dateRange").setErrors({ isValid: false });
      fixture.detectChanges();
      component.setDefaultMonth();
      expect(
        component.auditDates.get("dateRange").hasError("isValid")
      ).toBeFalsy();
    });
    it("should set default weekly value", () => {
      component.auditDates.get("dateRange").setErrors({ isValid: false });
      fixture.detectChanges();
      component.setDefaultWeek();
      expect(
        component.auditDates.get("dateRange").hasError("isValid")
      ).toBeFalsy();
    });
    it("should set frequency to weekly if weekly is selected", () => {
      component.showWeeklyCalendar = false;
      fixture.detectChanges();
      component.OnSelectFrequency({ value: "W" });
      expect(component.showWeeklyCalendar).toBe(true);
    });
    it("should set frequency to monthly if monthly is selected", () => {
      component.showMonthlyCalendar = false;
      fixture.detectChanges();
      component.OnSelectFrequency({ value: "M" });
      expect(component.showMonthlyCalendar).toBe(true);
    });
    it("should set frequency to daily if daily is selected", () => {
      component.showDailyCalendar = false;
      fixture.detectChanges();
      component.OnSelectFrequency({ value: "D" });
      expect(component.showDailyCalendar).toBe(true);
    });
    it("should set frequency variable if daily is selected", () => {
      fixture.detectChanges();
      component.setFreq("D");
      expect(component.frequency).toBe("Daily");
    });
    it("should set frequency variable if monthly is selected", () => {
      fixture.detectChanges();
      component.setFreq("M");
      expect(component.frequency).toBe("Monthly");
    });
    it("should set frequency variable if weekly is selected", () => {
      fixture.detectChanges();
      component.setFreq("W");
      expect(component.frequency).toBe("Weekly");
    });
    it("should set chart axis to daily format", () => {
      component.frequency = "Daily";
      component.auditSummaryDtos = auditsummary;
      component.dataAudit = [];
      fixture.detectChanges();
      component.setChartXAxis(auditsummary.auditSummaryDtos);
      expect(component.dataAudit[0]).toEqual(["05-28-2020", 1, 1, 0, 0]);
    });
    it("should set chart axis to monthly format", () => {
      component.auditSummaryDtos = auditsummary;
      component.dataAudit = [];
      component.frequency = "Monthly";
      fixture.detectChanges();
      component.setChartXAxis(auditsummary.auditSummaryDtos);
      expect(component.dataAudit[0]).toEqual(["05-2020", 1, 1, 0, 0]);
    });
    it("should set chart axis to weekly format", () => {
      component.auditSummaryDtos = auditsummary;
      component.dataAudit = [];
      component.frequency = "Weekly";
      fixture.detectChanges();
      component.setChartXAxis(auditsummary.auditSummaryDtos);
      expect(component.dataAudit[0]).toEqual([
        "05-28-2020 - 05-28-2020",
        1,
        1,
        0,
        0
      ]);
    });
    it("should set displayEnlarded to true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should fetch auditsummary data on OK button click", () => {
      const locSpy = spyOn(component, "getAuditDays");
      fixture.detectChanges();
      component.onSubmitAudit();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataAudit = [];
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.dataAudit[0]).toEqual(["NO DATA", 0, "0", 0, "0"]);
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
      component.auditSummaryDtos = auditsummary;
      component.optionsAudit.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.auditSummaryDtos = auditsummary;
      component.optionsAudit.legend.position = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataAudit = [];
      component.auditSummaryDtos = auditsummary;
      fixture.detectChanges();
      component.getAuditChartValue();
      const l = component.dataAudit.length;
      expect(l).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditSummaryComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch audit data when daily is selected", () => {
      component.frequency = "Daily";
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getAuditSumry");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should call service to fetch audit data when monthly is selected", () => {
      component.frequency = "Monthly";
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getAuditSumry");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should call service to fetch audit data when weekly is selected", () => {
      component.frequency = "Weekly";
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getAuditSumry");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when error occurs", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getAuditSumry").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getAuditSumry");
      component.auditSummaryDtos = null;
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getAuditDays();
      expect(component.isAuditRendered).toBeTruthy();
    });
  });

  describe("should validate dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditSummaryComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should calculate difference when to date is present", () => {
      const today = new Date();
      component.auditDates.get("dateRange").setErrors({ isValid: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set validilty to false when to date is not present", () => {
      const today = new Date();
      component.auditDates.get("dateRange").setErrors({ isValid: true });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.auditDates.get("dateRange").hasError("isValid")
      ).toBeFalsy();
    });
    it("should set dates as invalid when diffrence is more than 6 months", () => {
      const today = new Date();
      component.auditDates.get("dateRange").setErrors({ isValid: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const sevenDate = new Date();
      sevenDate.setDate(sevenDate.getDate() - 350);
      const dat = new Date(
        component.datePipe.transform(sevenDate, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(dat);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.auditDates.get("dateRange").hasError("isValid")
      ).toBeFalsy();
    });
    it("should set dates as valid when diffrence is less than 6 months", () => {
      const today = new Date();
      component.auditDates.get("dateRange").setErrors({ isValid: true });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.auditDates.get("dateRange").hasError("isValid")
      ).toBeFalsy();
    });
    it("should calculate difference between two dates", () => {
      const today = new Date();
      component.auditDates.get("dateRange").setErrors({ isValid: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      fixture.detectChanges();
      const diff = component.getMonths(defaultDateRange);
      expect(diff).toBe(0);
    });
  });
});
