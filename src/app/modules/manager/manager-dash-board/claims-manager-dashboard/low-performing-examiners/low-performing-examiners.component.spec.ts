import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LowPerformingExaminersComponent } from "./low-performing-examiners.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { failedExaminers } from "./../../../../auditor/auditor-dashboard/auditor-dashboard.mock";
import { AuditDashboardService } from "./../../../../auditor/auditor-dashboard/audit-dashboard.service";
import { of, throwError } from "rxjs";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockAuditDashboardService extends AuditDashboardService {
  getLowPerExaminers() {
    const prodArray: any = failedExaminers;
    this.lowPerExaminersFetch.next(prodArray);
  }
}

class MockTaskmanagementService extends TaskmanagementService {
  getLowPerExaminers() {
    const prodArray: any = failedExaminers;
    this.lowPerExaminersFetch.next(prodArray);
  }
}

describe("LowPerformingExaminersComponent", () => {
  let component: LowPerformingExaminersComponent;
  let fixture: ComponentFixture<LowPerformingExaminersComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LowPerformingExaminersComponent],
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
        { provide: AuditDashboardService, useClass: MockAuditDashboardService },
        { provide: TaskmanagementService, useClass: MockTaskmanagementService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LowPerformingExaminersComponent);
    component = fixture.componentInstance;
    localStorage = fixture.debugElement.injector.get(CryptoService);
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(LowPerformingExaminersComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set displayEnlarded to true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });

    it("should fetch low performing examiner data on OK button click when role is manager", () => {
      component.submittedAudit = false;
      component.role = "Manager";
      localStorage.setItem("roleId", "Manager");
      const locSpy = spyOn(component, "getLowPerExaminersManagerLead");
      fixture.detectChanges();
      component.onSubmitExaminer();
      expect(locSpy).toHaveBeenCalled();
      expect(component.submittedAudit).toBeTruthy();
    });
    it("should fetch no data to chart when response is not prsent", () => {
      component.userAuditScoreDto = [];
      component.role = "Manager";
      localStorage.setItem("roleId", "Manager");
      const locSpy = spyOn(component, "getExaminerChartNoValue");
      fixture.detectChanges();
      component.getLowPerExaminersManagerLead();
      expect(locSpy).toHaveBeenCalled();
    });

    it("should fetch low performing examiner data on OK button click when role is lead", () => {
      component.submittedAudit = false;
      localStorage.setItem("roleId", "Claims Lead");
      const locSpy = spyOn(component, "getLowPerExaminersManagerLead");
      fixture.detectChanges();
      component.onSubmitExaminer();
      expect(locSpy).toHaveBeenCalled();
      expect(component.submittedAudit).toBeTruthy();
    });
    it("should fetch no data to chart when response is not prsent", () => {
      component.userAuditScoreDto = [];
      localStorage.setItem("roleId", "Claims Lead");
      const locSpy = spyOn(component, "getExaminerChartNoValue");
      fixture.detectChanges();
      component.getLowPerExaminersManagerLead();
      expect(locSpy).toHaveBeenCalled();
    });

    it("should fetch low performing examiner data on OK button click when role is auditor", () => {
      component.submittedAudit = false;
      component.role = "Claims Auditor";
      localStorage.setItem("roleId", "Claims Auditor");
      const locSpy = spyOn(component, "getLowPerExaminersAuditor");
      fixture.detectChanges();
      component.onSubmitExaminer();
      expect(locSpy).toHaveBeenCalled();
      expect(component.submittedAudit).toBeTruthy();
    });
    it("should fetch no data to chart when response is not prsent", () => {
      component.userAuditScoreDto = [];
      localStorage.setItem("roleId", "Claims Auditor");
      const locSpy = spyOn(component, "getExaminerChartNoValue");
      fixture.detectChanges();
      component.getLowPerExaminersAuditor();
      expect(locSpy).toHaveBeenCalled();
    });

    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataExaminer = [];
      fixture.detectChanges();
      component.getExaminerChartNoValue();
      expect(component.dataExaminer[0]).toEqual(["NO DATA", 0, "0"]);
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
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
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
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let serviceAuditor;
    let serviceManager;
    beforeEach(() => {
      fixture = TestBed.createComponent(LowPerformingExaminersComponent);
      serviceAuditor = fixture.debugElement.injector.get(AuditDashboardService);
      serviceManager = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch low performing examiner data for auditor", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      localStorage.setItem("roleId", "Claims Auditor");
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(serviceAuditor, "getLowPerExaminers");
      fixture.detectChanges();
      component.getLowPerExaminersAuditor();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs for auditor", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      localStorage.setItem("roleId", "Claims Auditor");
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      spyOn(serviceAuditor, "getLowPerExaminers").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getExaminerChartNoValue");
      fixture.detectChanges();
      component.getLowPerExaminersAuditor();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is empty for auditor", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      localStorage.setItem("roleId", "Claims Auditor");
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      spyOn(serviceAuditor, "getLowPerExaminers").and.returnValue(null);
      const locSpy = spyOn(component, "getExaminerChartNoValue");
      fixture.detectChanges();
      component.getLowPerExaminersAuditor();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart for auditor", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      localStorage.setItem("roleId", "Claims Auditor");
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getLowPerExaminersAuditor();
      expect(component.isExaminersRendered).toBeTruthy();
    });

    it("should call service to fetch low performing examiner data for lead", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      component.role = "Claims Lead";
      localStorage.setItem("roleId", "Claims Lead");
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(serviceManager, "getLowPerExaminers");
      fixture.detectChanges();
      component.getLowPerExaminersManagerLead();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs for auditor", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      localStorage.setItem("roleId", "Claims Auditor");
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      spyOn(serviceAuditor, "getLowPerExaminers").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getExaminerChartNoValue");
      fixture.detectChanges();
      component.getLowPerExaminersManagerLead();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is empty for auditor", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      localStorage.setItem("roleId", "Claims Auditor");
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      spyOn(serviceAuditor, "getLowPerExaminers").and.returnValue(null);
      const locSpy = spyOn(component, "getExaminerChartNoValue");
      fixture.detectChanges();
      component.getLowPerExaminersManagerLead();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart for auditor", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      localStorage.setItem("roleId", "Claims Auditor");
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getLowPerExaminersManagerLead();
      expect(component.isExaminersRendered).toBeTruthy();
    });
  });

  describe("should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(LowPerformingExaminersComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
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
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
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
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.validateDates();
      expect(component.examinerDates.valid).toBeTruthy();
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
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(component.examinerDates.valid).toBeFalsy();
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
      component.examinerDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(component.examinerDates.valid).toBeTruthy();
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
      const diff = component.getMonths(
        defaultDateRange[0],
        defaultDateRange[1]
      );
      expect(diff).toBe(0);
    });
  });
});
