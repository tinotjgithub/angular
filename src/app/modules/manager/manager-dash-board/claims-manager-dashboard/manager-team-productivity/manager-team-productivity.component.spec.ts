import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ManagerTeamProductivityComponent } from "./manager-team-productivity.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import {
  productivitySchedule,
} from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockTaskMgtService extends TaskmanagementService {
  getMyTeamProdScores() {
    const prodArray: any = productivitySchedule;
    this.myTeamProdScoresFetch.next(prodArray);
  }
}

describe("ManagerTeamProductivityComponent", () => {
  let component: ManagerTeamProductivityComponent;
  let fixture: ComponentFixture<ManagerTeamProductivityComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTeamProductivityComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe,
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTeamProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ManagerTeamProductivityComponent);
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
    it("should fetch productivitySchedule data on OK button click", () => {
      const locSpy = spyOn(component, "getMyTeamProductivityDays");
      fixture.detectChanges();
      component.onSubmitMyTeamProductivity();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.myDataProductivity = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.myDataProductivity[0]).toEqual([
        "NO DATA",
        0,
        "0",
        0,
        "0",
      ]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.myOptionsProductivity.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.myOptionsProductivity.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.myOptionsProductivity.legend.position = "top";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.myOptionsProductivity.legend.position).toBe("none");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.userProductivityDto = productivitySchedule;
      component.myOptionsProductivity.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.myOptionsProductivity.tooltip.trigger).toBe("focus");
    });
    it("should set data in chart to a default value when data is empty", () => {
      const mockData: any = {
        userProductivityDto: null,
      };
      component.userProductivityDto = mockData;
      const sppy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getDataChart();
      expect(sppy).toHaveBeenCalled();
    });
    it("should display legend when there are values", () => {
      component.userProductivityDto = productivitySchedule;
      component.myOptionsProductivity.legend.position = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.myOptionsProductivity.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.myDataProductivity = [];
      component.userProductivityDto = productivitySchedule;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.myDataProductivity.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should set to date value as to date itself when to date is present", async(() => {
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
      component.myTeamProductivityDates
        .get("dateRange")
        .setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(dat);
    }));
    it("should set to date value as from date value when to date is undefined", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.myTeamProductivityDates
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
      fixture = TestBed.createComponent(ManagerTeamProductivityComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch productivity by schedule data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.myTeamProductivityDates
        .get("dateRange")
        .setValue(defaultDateRange);
      const servSpy = spyOn(service, "getMyTeamProdScores");
      fixture.detectChanges();
      component.getMyTeamProductivityDays();
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
      component.myTeamProductivityDates
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(service, "getMyTeamProdScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getMyTeamProductivityDays();
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
      component.myTeamProductivityDates
        .get("dateRange")
        .setValue(defaultDateRange);
      fixture.detectChanges();
      component.getMyTeamProductivityDays();
      expect(component.isProductivityRendered).toBeTruthy();
    });
  });

  describe("should validate dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ManagerTeamProductivityComponent);
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
      component.myTeamProductivityDates
        .get("dateRange")
        .setValue(defaultDateRange);
      const locSpy = spyOn(component, "getNoOfmonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set validity to true when from date is not present", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.myTeamProductivityDates
        .get("dateRange")
        .setValue(defaultDateRange);
      fixture.detectChanges();
      component.validateDates();
      expect(component.myTeamProductivityDates.controls.dateRange.getError("inValidDate")).toBeFalsy();
    });
    it("should set dates as invalid when diffrence is more than 6 months", () => {
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
      component.myTeamProductivityDates
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(component, "getNoOfmonths");
      fixture.detectChanges();
      component.validateDates();
      expect(component.isValid).toBeFalsy();
    });
    it("should set dates as valid when diffrence is less than 6 months", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.myTeamProductivityDates
        .get("dateRange")
        .setValue(defaultDateRange);
      spyOn(component, "getNoOfmonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(component.myTeamProductivityDates.controls.dateRange.valid).toBeTruthy();
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
      const diff = component.getNoOfmonths(
        defaultDateRange[0],
        defaultDateRange[1]
      );
      expect(diff).toBe(0);
    });
    it("should format and fetch time as pm if it is greater than 12pm", () => {
      const time = 15;
      fixture.detectChanges();
      const startTime = component.formatTime(time);
      expect(startTime).toBe("3pm");
    });
    it("should format and fetch time as am if it is lesser than 12pm", () => {
      const time = 3;
      fixture.detectChanges();
      const startTime = component.formatTime(time);
      expect(startTime).toBe("3am");
    });
  });
});
