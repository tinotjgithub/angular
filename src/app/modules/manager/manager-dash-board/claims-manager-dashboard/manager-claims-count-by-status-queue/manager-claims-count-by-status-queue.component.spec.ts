import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ManagerClaimsCountByStatusComponent } from "./manager-claims-count-by-status-queue.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import {
  managerClaimsCountByStatus,
  managerQueues,
  managerQueueDates
} from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockTaskMgtService extends TaskmanagementService {
  getManagerStatusScores() {
    const prodArray: any = managerClaimsCountByStatus;
    this.managerStatusScoresFetch.next(prodArray);
  }
  getManagerQueueNames() {
    const prodArray: any = managerQueues;
    this.managerQueueNamesSub.next(prodArray);
  }
}

describe("ManagerClaimsCountByStatusComponent", () => {
  let component: ManagerClaimsCountByStatusComponent;
  let fixture: ComponentFixture<ManagerClaimsCountByStatusComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerClaimsCountByStatusComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        RouterModule.forRoot([]),
        MultiSelectModule,
        ReportsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe,
        MessageService
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerClaimsCountByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ManagerClaimsCountByStatusComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should map queues for manager", () => {
      component.queue = [];
      const que = [];
      que.push({ id: 1, name: "Medi Care", code: "Medi Care" });
      que.push({
        id: 2,
        name: "HPS Special Care Unit",
        code: "HPS Special Care Unit"
      });
      component.queueArray = [];
      fixture.detectChanges();
      component.mapQueueNameList(que);
      expect(component.queueArray.length).toBeGreaterThan(0);
    });
    it("should not map queues for manager when queuenames are empty", () => {
      component.queue = [];
      const que = [];
      component.queueArray = [];
      fixture.detectChanges();
      component.mapQueueNameList(que);
      expect(component.queueArray.length).toEqual(0);
    });

    it("should not map queues for manager when queuenames are undefined", () => {
      component.queue = [];
      const que = undefined;
      component.queueArray = [];
      fixture.detectChanges();
      component.mapQueueNameList(que);
      expect(component.queueArray.length).toEqual(0);
    });

    it("should map queue names for manager", () => {
      component.queue = [];
      component.queue = managerQueues;
      fixture.detectChanges();
      component.mapQueueNames();
      expect(component.queueList.length).toBeGreaterThan(0);
    });

    it("should map queue names for manager", () => {
      component.queue = [];
      component.queue = [];
      fixture.detectChanges();
      component.mapQueueNames();
      expect(component.queueList.length).toEqual(0);
    });

    it("should fetch queues for manager", () => {
      component.queue = [];
      component.enlargedDisplay = false;
      fixture.detectChanges();
      const res = { id: 4 };
      localStorage.setItem("user-details", JSON.stringify(res));
      const servSpy = spyOn(service, "getManagerQueueNames");
      component.getManagerQueueNames();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set displayEnlarded to true", () => {
      component.queue = [];
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should fetch managerClaimsCountByStatus data on OK button click when queue is not empty", () => {
      const que = [];
      que.push({ id: 1, name: "Medi Care", code: "Medi Care" });
      que.push({
        id: 2,
        name: "HPS Special Care Unit",
        code: "HPS Special Care Unit"
      });
      component.countByStatusGroup.get("queueName").setValue(que);
      const locSpy = spyOn(component, "getStatusDays");
      fixture.detectChanges();
      component.onSubmitStatus();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should not fetch managerClaimsCountByStatus data on OK button click  when queue is empty", () => {
      component.queue = [];
      const locSpy = spyOn(component, "getStatusDays");
      fixture.detectChanges();
      component.onSubmitStatus();
      expect(locSpy).not.toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.queue = [];
      component.dataStatus = [];
      fixture.detectChanges();
      component.getStatusChartNoValue();
      expect(component.dataStatus[0]).toEqual([
        "NO DATA",
        0,
        "0",
        0,
        "0",
        0,
        "0",
        0,
        "0",
        0
      ]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.queue = [];
      component.optionsStatus.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getStatusChartNoValue();
      expect(component.optionsStatus.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.queue = [];
      component.optionsStatus.legend.position = "top";
      fixture.detectChanges();
      component.getStatusChartNoValue();
      expect(component.optionsStatus.legend.position).toBe("none");
    });
    it("should map response value when response value is present", () => {
      component.dataStatus = [];
      component.optionsStatus.legend.position = "top";
      component.optionsStatus.tooltip.trigger = "focus";
      component.optionsStatusEnlarged.legend.position = "top";
      component.optionsStatusEnlarged.tooltip.trigger = "focus";
      const managerClaims = [
        {
          managerStatusScoreDto: {
            Completed: 7,
            Assigned: 3,
            ToDo: 5,
            quename: "High Dollar WB",
            Pended: 21
          }
        }
      ];
      component.managerStatusScoreDto = managerClaims;
      spyOn(component, "parseResponseValue").and.returnValue(managerClaims);
      const locSpy = spyOn(component, "setManagerChartOptions");
      fixture.detectChanges();
      component.getStatusChartValue(managerClaims);
      const l = component.dataStatus.length;
      expect(l).toBeGreaterThan(0);
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set no data when response value is not present", () => {
      component.dataStatus = [];
      component.optionsStatus.legend.position = "top";
      component.optionsStatus.tooltip.trigger = "focus";
      component.optionsStatusEnlarged.legend.position = "top";
      component.optionsStatusEnlarged.tooltip.trigger = "focus";
      component.managerStatusScoreDto = null;
      const locSpy = spyOn(component, "getStatusChartNoValue");
      fixture.detectChanges();
      component.getStatusChartValue(null);
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set manager chart options", () => {
      component.dataStatus = [];
      component.queue = [];
      component.dataStatus = managerClaimsCountByStatus;
      fixture.detectChanges();
      component.setManagerChartOptions();
      expect(component.optionsStatusEnlarged.height).toEqual(400);
      expect(component.optionsStatus.height).toEqual(200);
    });

    it("should map parsed response value when parsed response value is present", () => {
      const resp = managerQueueDates;
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(resp, managerQueueDates);
      expect(parsed).toEqual(managerQueueDates);
    });
    it("should map parsed response value when parsed response value quename is not present", () => {
      const resp = [
        {
          managerStatusScoreDto: {
            Completed: 5,
            Assigned: 3,
            ToDo: 5,
            Pended: 21
          }
        }
      ];
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(resp, managerQueueDates);
      expect(parsed).toEqual(managerQueueDates);
    });
    it("should map parsed response value when parsed response value Completed is not present", () => {
      const resp = [
        {
          managerStatusScoreDto: {
            Assigned: 3,
            ToDo: 5,
            quename: "High Dollar WB",
            Pended: 21
          }
        }
      ];
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(resp, managerQueueDates);
      expect(parsed).toEqual(managerQueueDates);
    });
    it("should map parsed response value when parsed response value Assigned is not present", () => {
      const resp = [
        {
          managerStatusScoreDto: {
            Completed: 7,
            ToDo: 5,
            quename: "High Dollar WB",
            Pended: 21
          }
        }
      ];
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(resp, managerQueueDates);
      expect(parsed).toEqual(managerQueueDates);
    });
    it("should map parsed response value when parsed response value ToDo is not present", () => {
      const resp = [
        {
          managerStatusScoreDto: {
            Completed: 7,
            Assigned: 3,
            quename: "High Dollar WB",
            Pended: 21
          }
        }
      ];
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(resp, managerQueueDates);
      expect(parsed).toEqual(managerQueueDates);
    });
    it("should map parsed response value when parsed response value Pended is not present", () => {
      const resp = [
        {
          managerStatusScoreDto: {
            Completed: 7,
            Assigned: 3,
            ToDo: 5,
            quename: "High Dollar WB"
          }
        }
      ];
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(resp, managerQueueDates);
      expect(parsed).toEqual(managerQueueDates);
    });

    it("should parse response value when response value is not present", () => {
      fixture.detectChanges();
      const parsedRes = component.parseResponseValue([]);
      expect(parsedRes.length).toEqual(0);
    });

    it("should set to date value as to date itself when to date is present", () => {
      const today = new Date();
      component.queue = [];
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
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(dat);
    });
    it("should set to date value as from date value when to date is undefined", () => {
      component.queue = [];
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ManagerClaimsCountByStatusComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch manager queue data", () => {
      component.queue = [];
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getManagerStatusScores");
      fixture.detectChanges();
      component.getStatusDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      const today = new Date();
      component.queue = [];
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerStatusScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getStatusChartNoValue");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is empty", () => {
      const today = new Date();
      component.queue = [];
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerStatusScores").and.returnValue([]);
      const locSpy = spyOn(component, "getStatusChartNoValue");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is null", () => {
      const today = new Date();
      component.queue = [];
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerStatusScores").and.returnValue(null);
      component.managerStatusScoreDto = null;
      const locSpy = spyOn(component, "getStatusChartNoValue");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      component.queue = [];
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getStatusDays();
      expect(component.isStatusRendered).toBeTruthy();
    });
  });

  describe("should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ManagerClaimsCountByStatusComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set validity to false when to queue is present", () => {
      const que = [];
      que.push({ id: 1, name: "Medi Care", code: "Medi Care" });
      que.push({
        id: 2,
        name: "HPS Special Care Unit",
        code: "HPS Special Care Unit"
      });
      component.countByStatusGroup.get("queueName").setValue(que);
      fixture.detectChanges();
      component.validateQueue();
      expect(component.countByStatusGroup.get("queueName").valid).toBeTruthy();
    });
    it("should set validity to true when to queue is not present", () => {
      const que = [];
      component.countByStatusGroup.get("queueName").setValue(que);
      fixture.detectChanges();
      component.validateQueue();
      expect(component.countByStatusGroup.get("queueName").valid).toBeFalsy();
    });
    it("should calculate difference when from date is present", () => {
      component.queue = [];
      const today = new Date();
      component.countByStatusGroup
        .get("dateRange")
        .setErrors({ inValidDate: true });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set invalidity to true when diffrence is more than 6 months", () => {
      component.queue = [];
      const today = new Date();
      component.countByStatusGroup
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
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByStatusGroup.get("dateRange").hasError("inValidDate")
      ).toBeTruthy();
    });
    it("should set set invalidity to false when diffrence is less than 6 months", () => {
      component.queue = [];
      const today = new Date();
      component.countByStatusGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByStatusGroup.get("dateRange").hasError("inValidDate")
      ).toBeFalsy();
    });
    it("should set validilty to false when to date is not present", () => {
      const today = new Date();
      component.countByStatusGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByStatusGroup.get("dateRange").hasError("inValidDate")
      ).toBeFalsy();
    });
    it("should set validilty to true when to date is present", () => {
      const today = new Date();
      component.countByStatusGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByStatusGroup.get("dateRange").hasError("inValidDate")
      ).toBeTruthy();
    });
    it("should calculate difference between two dates", () => {
      component.queue = [];
      const today = new Date();
      component.countByStatusGroup
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
