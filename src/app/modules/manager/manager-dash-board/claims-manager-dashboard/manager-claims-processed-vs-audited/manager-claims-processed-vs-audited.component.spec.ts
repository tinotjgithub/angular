import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ManagerClaimsProcessedVsAuditedComponent } from "./manager-claims-processed-vs-audited.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { processedVsAudited } from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockTaskMgtService extends TaskmanagementService {
  getManagerProcessedScores() {
    const processedArray: any = processedVsAudited;
    this.processedScoresFetch.next(processedArray);
  }
}

describe("ManagerClaimsProcessedVsAuditedComponent", () => {
  let component: ManagerClaimsProcessedVsAuditedComponent;
  let fixture: ComponentFixture<ManagerClaimsProcessedVsAuditedComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerClaimsProcessedVsAuditedComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule,
        ReportsModule
      ],
      providers: [
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerClaimsProcessedVsAuditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(
        ManagerClaimsProcessedVsAuditedComponent
      );
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set displayEnlarded to true", () => {
      component.displayEnlarged = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.displayEnlarged).toBe(true);
    });
    it("should fetch processed vs audited data on OK button click", () => {
      const locSpy = spyOn(component, "getProcessedDays");
      fixture.detectChanges();
      component.onSubmitProcessed();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataProcessed = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataProcessed[0]).toEqual(["NO DATA", 1]);
    });
    it("should map response value when response value is present", () => {
      component.dataProcessed = [];
      component.userProcessedDto = processedVsAudited;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataProcessed.length;
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
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(dat);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(dat);
    });
    it("should set to date value as from date value when to date is undefined", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(
        ManagerClaimsProcessedVsAuditedComponent
      );
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch processed vs audited data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getManagerProcessedScores");
      fixture.detectChanges();
      component.getProcessedDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerProcessedScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getProcessedDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when null response", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerProcessedScores").and.returnValue(null);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getProcessedDays();
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
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getProcessedDays();
      expect(component.isProcessedRendered).toBeTruthy();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getAuditScores");
      component.userProcessedDto = null;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getProcessedDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is undefined", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getAuditScores");
      component.userProcessedDto = undefined;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getProcessedDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should map response values", () => {
      component.dataProcessed = [];
      const res = [
        { claimCount: 8, status: "Audited" },
        { claimCount: 1, status: "Not Audited" }
      ];
      component.mapResponseValue(res);
      const len = component.dataProcessed.length;
      expect(len).toEqual(2);
    });
  });

  describe("should validate dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(
        ManagerClaimsProcessedVsAuditedComponent
      );
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should calculate difference when from date is present", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "dateDifference");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set validilty to true when to date is not present", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "dateDifference");
      fixture.detectChanges();
      component.validateDates();
      expect(component.processedDates.valid).toBeTruthy();
    });
    it("should set dates as invalid when diffrence is more than 3 months", () => {
      const today = new Date();
      component.isValid = false;
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
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "dateDifference");
      fixture.detectChanges();
      component.validateDates();
      expect(component.processedDates.controls.dateRange.invalid).toBeTruthy();
    });
    it("should set dates as valid when diffrence is less than 3 months", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.processedDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "dateDifference").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(component.processedDates.valid).toBeTruthy();
    });
    it("should calculate difference between two dates", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      fixture.detectChanges();
      const diff = component.dateDifference(defaultDateRange);
      expect(diff).toBe(0);
    });
  });
});
