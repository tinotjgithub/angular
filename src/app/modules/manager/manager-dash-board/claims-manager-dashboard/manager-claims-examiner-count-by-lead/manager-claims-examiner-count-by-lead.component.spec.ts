import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsExaminerCountByLeadComponent } from "./manager-claims-examiner-count-by-lead.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { managerExaminerCountByStatus } from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockTaskMgtService extends TaskmanagementService {
  getExaminerCount() {
    const prodArray: any = managerExaminerCountByStatus;
    this.examinerCountFetch.next(prodArray);
  }
}

describe("ClaimsExaminerCountByLeadComponent", () => {
  let component: ClaimsExaminerCountByLeadComponent;
  let fixture: ComponentFixture<ClaimsExaminerCountByLeadComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsExaminerCountByLeadComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        DropdownModule,
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
    fixture = TestBed.createComponent(ClaimsExaminerCountByLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsExaminerCountByLeadComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set displayEnlarded to true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should fetch managerClaimsCountByStatus data on OK button click", () => {
      component.submittedExaminerCount = false;
      const locSpy = spyOn(component, "getExaminerCount");
      fixture.detectChanges();
      component.onSubmitExaminerCount();
      expect(locSpy).toHaveBeenCalled();
      expect(component.submittedExaminerCount).toBeTruthy();
    });
    it("should fetch no data to chart when response is not prsent", () => {
      component.examinerCount = null;
      const locSpy = spyOn(component, "getExaminerCountChartNoValue");
      fixture.detectChanges();
      component.getExaminerCountChartValue();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataExaminerCount = [];
      fixture.detectChanges();
      component.getExaminerCountChartNoValue();
      expect(component.dataExaminerCount[0]).toEqual(["NO DATA", 0, "0"]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsExaminerCount.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getExaminerCountChartNoValue();
      expect(component.optionsExaminerCount.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsExaminerCount.legend.position = "top";
      fixture.detectChanges();
      component.getExaminerCountChartNoValue();
      expect(component.optionsExaminerCount.legend.position).toBe("none");
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
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
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
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsExaminerCountByLeadComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch manager lead data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      const servSpy = spyOn(service, "getExaminerCount");
      fixture.detectChanges();
      component.getExaminerCount();
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
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(service, "getExaminerCount").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getExaminerCountChartNoValue");
      fixture.detectChanges();
      component.getExaminerCount();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is empty", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(service, "getExaminerCount").and.returnValue(null);
      component.examinerCount = null;
      const locSpy = spyOn(component, "getExaminerCountChartNoValue");
      fixture.detectChanges();
      component.getExaminerCount();
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
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      fixture.detectChanges();
      component.getExaminerCount();
      expect(component.isExaminerCountRendered).toBeTruthy();
    });
  });

  describe("should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsExaminerCountByLeadComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should calculate difference when from date is present", () => {
      const today = new Date();
      component.countByExaminerCountGroup
        .get("dateRange")
        .setErrors({ inValidDate: true });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set invalidity to true when diffrence is more than 6 months", () => {
      const today = new Date();
      component.countByExaminerCountGroup
        .get("dateRange")
        .setErrors({ inValidDate: true });
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
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByExaminerCountGroup
          .get("dateRange")
          .hasError("inValidDate")
      ).toBeTruthy();
    });
    it("should set set invalidity to false when diffrence is less than 6 months", () => {
      const today = new Date();
      component.countByExaminerCountGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByExaminerCountGroup
          .get("dateRange")
          .hasError("inValidDate")
      ).toBeFalsy();
    });
    it("should set validilty to false when to date is not present", () => {
      const today = new Date();
      component.countByExaminerCountGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByExaminerCountGroup
          .get("dateRange")
          .hasError("inValidDate")
      ).toBeFalsy();
    });
    it("should set validilty to true when to date is present", () => {
      const today = new Date();
      component.countByExaminerCountGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByExaminerCountGroup
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByExaminerCountGroup
          .get("dateRange")
          .hasError("inValidDate")
      ).toBeTruthy();
    });
    it("should calculate difference between two dates", () => {
      const today = new Date();
      component.countByExaminerCountGroup
        .get("dateRange")
        .setErrors({ inValidDate: true });
      /* const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const sevenDate = new Date();
      sevenDate.setDate(sevenDate.getDate() - 12);
      const dat = new Date(
        component.datePipe.transform(sevenDate, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(dat);
      defaultDateRange.push(todaysDate); */
      const defaultDateRange = [];
      defaultDateRange.push(new Date("12/12/2012"));
      defaultDateRange.push(new Date("12/06/2012"));
      fixture.detectChanges();
      const diff = component.getMonths(defaultDateRange);
      expect(diff).toBe(0);
    });
  });
});
