import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsCountByAgeComponent } from "./manager-claims-count-by-age-vol.component";
import { GoogleChartsModule } from "angular-google-charts";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { MessageService } from "primeng/api";
import { RouterModule } from "@angular/router";
import {
  managerClaimsCountByVol,
  managerQueueNames,
  managerStatus
} from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockTaskMgtService extends TaskmanagementService {
  getManagerQueues() {
    const prodArray: any = managerQueueNames;
    this.managerQueueNamesSub.next(prodArray);
  }
  getStatus() {
    const prodArray: any = managerStatus;
    this.statusSub.next(prodArray);
  }
  getManagerAgeScores() {
    const prodArray: any = managerStatus;
    this.managerAgeScoresFetch.next(prodArray);
  }
}

describe("ClaimsCountByAgeComponent", () => {
  let component: ClaimsCountByAgeComponent;
  let fixture: ComponentFixture<ClaimsCountByAgeComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsCountByAgeComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        MultiSelectModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ReportsModule
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
    fixture = TestBed.createComponent(ClaimsCountByAgeComponent);
    component = fixture.componentInstance;
    localStorage = fixture.debugElement.injector.get(CryptoService);
    localStorage.setItem("user-details", JSON.stringify({ id: 1 }));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsCountByAgeComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should map queues for manager", () => {
      const led = [];
      led.push({ id: 11, name: "Brian Pe", code: "Brian P" });
      led.push({ id: 13, name: "Deepa S", code: "Deepa S" });
      component.queue = led;
      component.queueList = [];
      fixture.detectChanges();
      component.mapQueueNames();
      expect(component.queueList.length).toBeGreaterThan(0);
    });
    it("should not map queues for manager when queues are empty", () => {
      component.queue = [];
      component.queueList = [];
      fixture.detectChanges();
      component.mapQueueNames();
      expect(component.queueList.length).toEqual(0);
    });

    it("should not map queues for manager when queues are undefined", () => {
      component.queue = [];
      component.queueList = [];
      fixture.detectChanges();
      component.mapQueueNames();
      expect(component.queueList.length).toEqual(0);
    });

    it("should fetch queues for manager", () => {
      component.queue = [];
      fixture.detectChanges();
      const res = { id: 4 };
      localStorage.setItem("user-details", JSON.stringify(res));
      const servSpy = spyOn(service, "getManagerQueues");
      component.getManagerQueues();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should fetch status for manager", () => {
      component.status = [];
      fixture.detectChanges();
      const servSpy = spyOn(service, "getStatus");
      component.getStatus();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should set enlarged Display as true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should fetch managerClaimsCountByVol data on OK button click", () => {
      const locSpy = spyOn(component, "getAgeCount");
      component.onSubmitAge();
      const fbAge = new FormBuilder();
      expect(locSpy).not.toHaveBeenCalled();
      component.countByAgeGroup = fbAge.group({
        dateRange: [["10-10-2010", "10-10-2010"]]
      });
      component.onSubmitAge();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataAge = [];
      fixture.detectChanges();
      component.getAgeChartNoValue();
      expect(component.dataAge[0]).toEqual([
        "NO DATA",
        0,
        "0",
        0,
        "0",
        0,
        "0",
        0,
        "0",
        0,
        "0"
      ]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsAge.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getAgeChartNoValue();
      expect(component.optionsAge.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsAge.legend.position = "top";
      fixture.detectChanges();
      component.getAgeChartNoValue();
      expect(component.optionsAge.legend.position).toBe("none");
    });
    it("should set age data when response value is present", () => {
      component.dataAge = [];
      component.managerAgeScoreDto = managerClaimsCountByVol;
      fixture.detectChanges();
      component.getAgeChartValue();
      const l = component.dataAge.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should set age data to no data when response value is empty", () => {
      component.dataAge = [];
      component.managerAgeScoreDto = null;
      fixture.detectChanges();
      const locSpy = spyOn(component, "getAgeChartNoValue");
      component.getAgeChartValue();
      const l = component.dataAge.length;
      expect(l).toEqual(0);
      expect(locSpy).toHaveBeenCalled();
    });
    it("should map parsed response value when parsed response value is present", () => {
      const resp = managerClaimsCountByVol;
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(
        resp,
        managerClaimsCountByVol
      );
      expect(parsed).toEqual(managerClaimsCountByVol);
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
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
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
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsCountByAgeComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch manager age data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getManagerAgeScores").and.returnValue(
        managerStatus
      );
      fixture.detectChanges();
      component.getAgeCount();
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
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerAgeScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getAgeChartNoValue");
      fixture.detectChanges();
      component.getAgeCount();
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
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerAgeScores").and.returnValue([]);
      component.managerAgeScoreDto = [];
      const locSpy = spyOn(component, "getAgeChartNoValue");
      fixture.detectChanges();
      component.getAgeCount();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is null", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerAgeScores").and.returnValue(null);
      component.managerAgeScoreDto = null;
      const locSpy = spyOn(component, "getAgeChartNoValue");
      fixture.detectChanges();
      component.getAgeCount();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is null", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerAgeScores").and.returnValue(null);
      const locSpy = spyOn(component, "getAgeChartNoValue");
      fixture.detectChanges();
      component.getAgeCount();
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
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getAgeCount();
      expect(component.isAgeRendered).toBeTruthy();
    });
  });

  describe("should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsCountByAgeComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set empty status to false when to status is present", () => {
      const sts = [];
      sts.push({ id: "ToDo", name: "ToDo", code: "ToDo" });
      sts.push({ id: "Pended", name: "Pended", code: "Pended" });
      component.countByAgeGroup.get("status").setValue(sts);
      fixture.detectChanges();
      component.validateStatus();
      expect(
        component.countByAgeGroup.get("status").hasError("emptyStatus")
      ).toBeFalsy();
    });
    it("should set empty status to true when to status is not present", () => {
      const sts = [];
      component.countByAgeGroup.get("status").setValue(sts);
      fixture.detectChanges();
      component.validateStatus();
      expect(
        component.countByAgeGroup.get("status").hasError("emptyStatus")
      ).toBeFalsy();
    });
    it("should set empty queue to false when to queue is present", () => {
      const led = [];
      led.push({ id: 11, name: "Brian P", code: "Brian P" });
      led.push({ id: 13, name: "Deepa S", code: "Deepa S" });
      component.countByAgeGroup.get("queueName").setValue(led);
      fixture.detectChanges();
      component.validateQueue();
      expect(
        component.countByAgeGroup.get("queueName").hasError("emptyQueue")
      ).toBeFalsy();
    });
    it("should set empty queue to true when to queue is not present", () => {
      const led = [];
      component.countByAgeGroup.get("queueName").setValue(led);
      fixture.detectChanges();
      component.validateQueue();
      expect(
        component.countByAgeGroup.get("queueName").hasError("emptyQueue")
      ).toBeFalsy();
    });
    it("should calculate difference when from date is present", () => {
      const today = new Date();
      component.countByAgeGroup
        .get("dateRange")
        .setErrors({ inValidDate: true });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set invalidity to true when diffrence is more than 6 months", () => {
      const today = new Date();
      component.countByAgeGroup
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
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByAgeGroup.get("dateRange").hasError("inValidDate")
      ).toBeTruthy();
    });
    it("should set set invalidity to false when diffrence is less than 6 months", () => {
      const today = new Date();
      component.countByAgeGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByAgeGroup.get("dateRange").hasError("inValidDate")
      ).toBeFalsy();
    });
    it("should set validilty to false when to date is not present", () => {
      const today = new Date();
      component.countByAgeGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByAgeGroup.get("dateRange").hasError("inValidDate")
      ).toBeFalsy();
    });
    it("should set validilty to true when to date is present", () => {
      const today = new Date();
      component.countByAgeGroup
        .get("dateRange")
        .setErrors({ inValidDate: false });
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.countByAgeGroup.get("dateRange").hasError("inValidDate")
      ).toBeTruthy();
    });
    it("should calculate difference between two dates", () => {
      const today = new Date();
      component.countByAgeGroup
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

  it("getQueueName", () => {
    component.queueList = [
      {
        label: 'test',
        value: {
          id: 123
        }
      }
    ];
    const queues = ['test', 'ttest1'];
    expect(component.getQueueId(queues).length).toEqual(1);
  });

  it("mapStatus", () => {
    component.status = ['Pending', 'Completed', 'Assigned'];
    spyOn(component, 'getToDateValue').and.returnValue(new Date());
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(taskService, 'getManagerAgeScores');
    spyOn(taskService, 'getManagerAgeScoresListner').and.returnValue(of([
      {
        toDo: 0,
        routedOut: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: ">64"
      },
      {
        toDo: 0,
        routedOut: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "57-63"
      },
      {
        toDo: 0,
        routedOut: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "50-56"
      },
      {
        toDo: 0,
        routedOut: 0,
        routedIn: 0,
        pended: 0,
        completed: 0,
        ageRange: "43-49"
      }
    ]));
    component.mapStatus();
    component.status = [];
    component.mapStatus();
    expect(component.isAgeRendered).toBeTruthy();
  });

  it("getManagerQueues", () => {
    const authService: AuthenticationService = fixture.debugElement.injector.get(AuthenticationService);
    authService.userDetails = {
      id: 12
    };
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(taskService, 'getManagerQueues');
    spyOn(component, 'mapQueueNames');
    spyOn(taskService, 'getManagerQueuesListner').and.returnValue(of([]));
    component.getManagerQueues();
    expect(component).toBeTruthy();
  });

  it("getstatus", () => {
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(taskService, 'getStatus');
    spyOn(component, 'mapStatus');
    spyOn(taskService, 'getStatusListner').and.returnValue(of([]));
    component.getStatus();
    expect(component).toBeTruthy();
  });
});
