import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LeadClaimsCountByAgeVolComponent } from "./lead-claims-count-by-age-vol.component";
import { GoogleChartsModule } from "angular-google-charts";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { DialogModule } from "primeng/dialog";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { HttpClientModule } from "@angular/common/http";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import {
  leadClaimsCountByVol,
  leadQueues,
  leadStatus,
  qeues
} from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError, Subscription } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockTaskMgtService extends TaskmanagementService {
  getLeadQueueNames() {
    const prodArray: any = leadQueues;
    this.leadQueueNamesSub.next(prodArray);
  }
  getLeadStatuses() {
    const prodArray: any = leadStatus;
    this.leadStatusesSub.next(prodArray);
  }
  getLeadAgeScores() {
    const prodArray: any = leadClaimsCountByVol;
    this.leadAgeScoresFetch.next(prodArray);
  }
}

class MockAuthenticationService extends AuthenticationService {
  get currentUserDetails() {
    // return this.userDetails;
    const usrDetails: any = { id: 4 };
    return usrDetails;
  }
}

describe("LeadClaimsCountByAgeVolComponent", () => {
  let component: LeadClaimsCountByAgeVolComponent;
  let fixture: ComponentFixture<LeadClaimsCountByAgeVolComponent>;
  let localStorage: CryptoService;
  let service;
  let authService: AuthenticationService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeadClaimsCountByAgeVolComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        HttpClientTestingModule,
        DialogModule,
        RouterTestingModule,
        MultiSelectModule,
        ReportsModule
      ],
      providers: [
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe,
        MessageService,
        { provide: AuthenticationService, useClass: MockAuthenticationService }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LeadClaimsCountByAgeVolComponent);
    component = fixture.componentInstance;
    localStorage = fixture.debugElement.injector.get(CryptoService);
    authService = fixture.debugElement.injector.get(AuthenticationService);
    fixture.detectChanges();
    authService = fixture.debugElement.injector.get(AuthenticationService);
    localStorage = fixture.debugElement.injector.get(CryptoService);
    // const res = { id: 4 };
    // localStorage.setItem("user-details", JSON.stringify(res));
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    beforeEach(() => {
      service = fixture.debugElement.injector.get(TaskmanagementService);
    });
    it("should map queues for lead", () => {
      component.queue = leadQueues;
      component.queueList = [];
      spyOn(component, "getStatus");
      fixture.detectChanges();
      component.mapQueueNames();
      expect(component.queueList.length).toBeGreaterThan(0);
    });
    it("should not map queues for lead when queues are empty", () => {
      component.queue = [];
      component.queueList = [];
      spyOn(component, "getStatus");
      fixture.detectChanges();
      component.mapQueueNames();
      expect(component.queueList.length).toEqual(0);
    });

    it("should not map queues for lead when queues are undefined", () => {
      component.queue = undefined;
      component.queueList = [];
      spyOn(component, "getStatus");
      fixture.detectChanges();
      component.mapQueueNames();
      expect(component.queueList.length).toEqual(0);
    });

    it("should map queuenames when value is present", () => {
      component.queueArray = [];
      fixture.detectChanges();
      component.mapQueueNameList(qeues);
      expect(component.queueArray.length).toBeGreaterThan(0);
    });
    it("should not map queuenames when value is not present", () => {
      component.queueArray = [];
      fixture.detectChanges();
      component.mapQueueNameList(null);
      expect(component.queueArray.length).toEqual(0);
    });

    it("should map status when value is present", () => {
      component.statusArray = [];
      fixture.detectChanges();
      component.mapStatusList(qeues);
      expect(component.statusArray.length).toBeGreaterThan(0);
    });
    it("should not map status when value is not present", () => {
      component.statusArray = [];
      fixture.detectChanges();
      component.mapStatusList(null);
      expect(component.statusArray.length).toEqual(0);
    });

    it("should fetch queues for lead", () => {
      component.queue = [];
      fixture.detectChanges();
      const servSpy = spyOn(service, "getLeadQueueNames");
      component.getQueueNames();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should fetch status for lead", () => {
      component.status = [];
      fixture.detectChanges();
      const servSpy = spyOn(service, "getLeadStatuses");
      const payload = {
        success: true,
        roleId: "Manager",
        authToken: "ysdgyeuroho"
      };
      spyOn(authService, "getUserDetails").and.returnValue(
        of({ id: "4", firstName: "", lastName: "" })
      );
      authService.setLogin(payload);
      component.getStatus();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should set enlarged Display as true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });

    it("onSubmitAge", () => {
      component.countByAgeGroup = new FormBuilder().group({
        dateRange: [[], Validators.required],
        queueName: ["", Validators.required],
        status: ["", Validators.required]
      });

      component.countByAgeGroup.patchValue({
        dateRange: [],
        queueName: "",
        status: ""
      });
      const spy = spyOn(component, "getAgeCount");
      component.onSubmitAge();
      expect(spy).not.toHaveBeenCalled();
      component.countByAgeGroup.patchValue({
        dateRange: [new Date(), new Date(new Date().getDate() - 6)],
        queueName: "que",
        status: "sts"
      });
      component.onSubmitAge();
      expect(spy).toHaveBeenCalled();
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
      component.leadAgeScoreDto = leadClaimsCountByVol;
      fixture.detectChanges();
      component.getAgeChartValue();
      const l = component.dataAge.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should map parsed response value when parsed response value is present", () => {
      const resp = leadClaimsCountByVol;
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(
        resp,
        leadClaimsCountByVol
      );
      expect(parsed).toEqual(leadClaimsCountByVol);
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
    let serviceTask;
    beforeEach(() => {
      serviceTask = fixture.debugElement.injector.get(TaskmanagementService);
      fixture.detectChanges();
    });
    it("should call service to fetch lead age data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(serviceTask, "getLeadAgeScores");
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
      spyOn(serviceTask, "getLeadAgeScores").and.returnValue(
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
      spyOn(serviceTask, "getLeadAgeScores").and.returnValue([]);
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
      spyOn(serviceTask, "getLeadAgeScores").and.returnValue(null);
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
    let serviceTask;
    beforeEach(() => {
      serviceTask = fixture.debugElement.injector.get(TaskmanagementService);
      fixture.detectChanges();
    });
    it("should set validity to true when to status is present", () => {
      const sts = [];
      sts.push({ id: "ToDo", name: "ToDo", code: "ToDo" });
      sts.push({ id: "Pended", name: "Pended", code: "Pended" });
      component.countByAgeGroup.get("status").setValue(sts);
      fixture.detectChanges();
      component.validateStatus();
      expect(component.countByAgeGroup.get("status").invalid).toBeFalsy();
    });
    it("should set validity to false when to status is not present", () => {
      const sts = [];
      component.countByAgeGroup.get("status").setValue(sts);
      fixture.detectChanges();
      component.validateStatus();
      expect(component.countByAgeGroup.invalid).toBeTruthy();
    });
    it("should set validity to true when to queue is present", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByAgeGroup.get("dateRange").setValue(defaultDateRange);
      const que = [];
      const sts = [];
      sts.push({ id: "ToDo", name: "ToDo", code: "ToDo" });
      sts.push({ id: "Pended", name: "Pended", code: "Pended" });
      component.countByAgeGroup.get("status").setValue(sts);
      que.push({ id: 1, name: "Medi Care", code: "Medi Care" });
      que.push({ id: 2, name: "Medi Care", code: "Medi Care" });
      component.countByAgeGroup.get("queueName").setValue(que);
      fixture.detectChanges();
      component.validateQueue();
      expect(component.countByAgeGroup.valid).toBeTruthy();
    });
    it("should set validity to false when to queue is not present", () => {
      const led = [];
      component.countByAgeGroup.get("queueName").setValue(led);
      fixture.detectChanges();
      component.validateQueue();
      expect(component.countByAgeGroup.valid).toBeFalsy();
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
});
