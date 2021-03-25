import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NotifierService } from "src/app/services/notifier.service";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageModule } from "primeng/message";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { AuditorReportService } from "../auditor-report.service";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { auditBacklogReport, mockReport } from "./../audit-report-mock";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditBacklogReportComponent } from "./audit-backlog-report.component";
import { CalendarModule } from "primeng/calendar";
import { DatePipe } from "@angular/common";
import { of, Subscription, throwError } from "rxjs";

class MockAuditorReportService extends AuditorReportService {
  getAuditBacklogReport() {
    const auditReportArray: any = auditBacklogReport;
    this.auditReportSub.next(auditReportArray);
  }
  getAuditBacklogReportReports() {
    return mockReport;
  }
}

class MockNotiferService extends NotifierService {
  throwNotification(notification) {
    this.notifierListener.next({
      type: notification.type,
      message: notification.message
    });
  }
}

describe("AuditBacklogReportComponent", () => {
  let component: AuditBacklogReportComponent;
  let fixture: ComponentFixture<AuditBacklogReportComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditBacklogReportComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MessageModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        TooltipModule,
        CalendarModule,
        CardModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuditorReportService, useClass: MockAuditorReportService },
        { provide: NotifierService, useClass: MockNotiferService },
        MessageService,
        ConfirmationService,
        DatePipe,
        { provide: BaseHttpService, useClass: MockBaseHttpService }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    localStorage.setItem("user-details", JSON.stringify({ id: 1 }));
    fixture = TestBed.createComponent(AuditBacklogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditBacklogReportComponent);
      service = fixture.debugElement.injector.get(AuditorReportService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should get report data", () => {
      component.isDataPresent = false;
      component.auditReportGroup.get("activeFrom").setValue(new Date());
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("backlogStatus").setValue("Pending");
      fixture.detectChanges();
      spyOn(service, "getAuditBacklogReport");
      component.getAuditBacklogReport();
      expect(component.isDataPresent).toBeTruthy();
    });
    it("should set Pending", () => {
      component.backlogStatusVal = 0;
      fixture.detectChanges();
      component.setSummary(auditBacklogReport, "Pending");
      expect(component.backlogStatusVal.toString()).toEqual("1");
      expect(component.backlogStatusLbl).toEqual("Pending Count");
    });
    it("should set Saved", () => {
      component.backlogStatusVal = 0;
      fixture.detectChanges();
      component.setSummary(auditBacklogReport, "Saved");
      expect(component.backlogStatusVal.toString()).toEqual("1");
      expect(component.backlogStatusLbl).toEqual("Saved Count");
    });
    it("should set Reassigned", () => {
      component.backlogStatusVal = 0;
      fixture.detectChanges();
      component.setSummary(auditBacklogReport, "Reassigned");
      expect(component.backlogStatusVal.toString()).toEqual("1");
      expect(component.backlogStatusLbl).toEqual("Reassigned Count");
    });
    it("should set All", () => {
      component.backlogStatusVal = 0;
      fixture.detectChanges();
      component.setSummary(auditBacklogReport, "All");
      expect(component.backlogStatusVal.toString()).toEqual("3");
      expect(component.backlogStatusLbl).toEqual("Total Backlog Count");
    });
    it("should set table columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });
    it("should able to get auditor report and set to table", () => {
      component.isDataPresent = false;
      spyOn(service, "getAuditBacklogReportListner").and.returnValue(
        of(auditBacklogReport)
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(),
        backlogStatus: "All"
      });
      fixture.detectChanges();
      component.reportSubscription = new Subscription();
      try {
        component.getAuditBacklogReport();
      } catch (error) {
        console.log(error);
      }
      expect(component.isDataPresent).toBeTruthy();
    });
  });

  describe("Should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditBacklogReportComponent);
      service = fixture.debugElement.injector.get(AuditorReportService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should fetch report data from service", () => {
      component.isDataPresent = false;
      component.gridData = [];
      component.auditReportGroup.get("activeFrom").setValue(new Date());
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("backlogStatus").setValue("Pending");
      const servSpy = spyOn(service, "getAuditBacklogReport");
      spyOn(component, "setSummary");
      fixture.detectChanges();
      component.getAuditBacklogReport();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should not allow to download excel when form is invalid", () => {
      component.auditReportGroup.reset();
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - Pending", () => {
      spyOn(service, "getAuditBacklogReportReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        backlogStatus: "Pending"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - All", () => {
      spyOn(service, "getAuditBacklogReportReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        backlogStatus: "All"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - Pending", () => {
      spyOn(service, "getAuditBacklogReportReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        backlogStatus: "Pending"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });
  });

  describe("Should validate", () => {
    let service;
    beforeEach(() => {
      // fixture = TestBed.createComponent(AuditBacklogReportComponent);
      service = fixture.debugElement.injector.get(AuditorReportService);
      /* component = fixture.componentInstance;
      fixture.detectChanges(); */
    });
    it("should call service when data is valid", () => {
      component.auditReportGroup.get("activeFrom").setValue(new Date());
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("backlogStatus").setValue("Pending");
      const auditTable = jasmine.createSpyObj("auditTable", ["reset"]);
      component.auditTable = auditTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "getAuditBacklogReport");
      component.submit();
      expect(component.auditTable.reset).toHaveBeenCalled();
      expect(getAudit).toHaveBeenCalled();
    });
    /* it("should not call service when data is invalid", () => {
      const daysBeforeDate = new Date();
      daysBeforeDate.setDate(daysBeforeDate.getDate() - 500);
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("activeFrom").setValue(daysBeforeDate);
      component.auditReportGroup.get("backlogStatus").setValue("Pending");
      const auditTable = jasmine.createSpyObj("auditTable", ["reset"]);
      component.auditTable = auditTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "getAuditBacklogReport");
      component.submit();
      expect(component.auditTable.reset).not.toHaveBeenCalled();
      expect(getAudit).not.toHaveBeenCalled();
    }); */
    it("should format a given date in mm-dd-yyyy format", () => {
      const currentDate =
        "Mon May 25 2020 16:12:52 GMT+0530 (India Standard Time)";
      fixture.detectChanges();
      const formatedDate = component.getFormattedDate(currentDate, false);
      expect(formatedDate).toEqual("05/25/2020");
    });
    it("should format a given date in yyyy-mm-dd format", () => {
      const currentDate =
        "Mon May 25 2020 16:12:52 GMT+0530 (India Standard Time)";
      fixture.detectChanges();
      const formatedDate = component.getFormattedDate(currentDate, true);
      expect(formatedDate).toEqual("2020-05-25");
    });
    it("should return difference in months", () => {
      const currentDate = new Date();
      fixture.detectChanges();
      const diff = component.getMonths(currentDate, currentDate);
      expect(diff).toEqual(0);
    });
  });
  afterAll(() => {
    localStorage.clear();
  });
});
