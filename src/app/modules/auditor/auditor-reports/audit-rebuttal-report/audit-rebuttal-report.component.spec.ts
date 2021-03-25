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
import { AuditorReportService } from "./../auditor-report.service";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { auditRebuttalReport, mockReport } from "./../audit-report-mock";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditRebuttalReportComponent } from "./audit-rebuttal-report.component";
import { CalendarModule } from "primeng/calendar";
import { DatePipe } from "@angular/common";
import { of, Subscription, throwError } from "rxjs";
import { AnimationDriver } from "@angular/animations/browser";

class MockAuditorReportService extends AuditorReportService {
  getAuditRebuttalReport() {
    const auditReportArray: any = auditRebuttalReport;
    this.auditReportSub.next(auditReportArray);
  }
  getAuditRebuttalReports() {
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

describe("AuditRebuttalReportComponent", () => {
  let component: AuditRebuttalReportComponent;
  let fixture: ComponentFixture<AuditRebuttalReportComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditRebuttalReportComponent],
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
    fixture = TestBed.createComponent(AuditRebuttalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditRebuttalReportComponent);
      service = fixture.debugElement.injector.get(AuditorReportService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set passed, failed and total count", () => {
      component.summary = [];
      fixture.detectChanges();
      component.setSummary(auditRebuttalReport);
      expect(component.summary.length).toBeGreaterThan(0);
    });
    it("should set rebuttal table columns", () => {
      component.colsRebuttal = [];
      fixture.detectChanges();
      component.setColsRebuttal();
      expect(component.colsRebuttal.length).toBeGreaterThan(0);
    });
    it("should set summary table columns", () => {
      component.colsSummary = [];
      fixture.detectChanges();
      component.setColsSummary();
      expect(component.colsSummary.length).toBeGreaterThan(0);
    });
    it("should set summary columns according to value selected", () => {
      component.currentLevel = "firstLevel";
      fixture.detectChanges();
      component.getColumsOnLevel();
      expect(component.colsSummary.length).toEqual(4);
    });
    it("should set summary columns according to value selected", () => {
      component.currentLevel = "secondLevel";
      fixture.detectChanges();
      component.getColumsOnLevel();
      expect(component.colsSummary.length).toEqual(4);
    });
    it("should set summary columns according to value selected", () => {
      component.currentLevel = "thirdLevel";
      fixture.detectChanges();
      component.getColumsOnLevel();
      expect(component.colsSummary.length).toEqual(4);
    });
    it("should set summary columns according to value selected", () => {
      component.currentLevel = "totalRebuttal";
      fixture.detectChanges();
      component.getColumsOnLevel();
      expect(component.colsSummary.length).toEqual(6);
    });
    it("should able to get auditor report and set to table", () => {
      component.isDataPresent = false;
      spyOn(service, "getAuditRebuttalReportListner").and.returnValue(
        of(auditRebuttalReport)
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(),
        level: "All"
      });
      fixture.detectChanges();
      component.reportSubscription = new Subscription();
      try {
        component.getAuditRebuttalReport();
      } catch (error) {
        console.log(error);
      }
      expect(component.isDataPresent).toBeTruthy();
    });
  });

  describe("Should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditRebuttalReportComponent);
      service = fixture.debugElement.injector.get(AuditorReportService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should fetch report data from service", () => {
      component.isDataPresent = false;
      component.gridData = [];
      component.auditReportGroup.get("activeFrom").setValue(new Date());
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("level").setValue("secondLevel");
      const servSpy = spyOn(service, "getAuditRebuttalReport");
      spyOn(component, "setSummary");
      fixture.detectChanges();
      component.getAuditRebuttalReport();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should not allow to download excel when form is invalid", () => {
      component.auditReportGroup.reset();
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - firstLevel", () => {
      spyOn(service, "getAuditRebuttalReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        level: "firstLevel"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - All", () => {
      spyOn(service, "getAuditRebuttalReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        level: "All"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });
    it("should allow to download excel - First Level", () => {
      spyOn(service, "getAuditRebuttalReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        level: "firstLevel"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });
    it("should allow to download excel - Second Level", () => {
      spyOn(service, "getAuditRebuttalReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        level: "secondLevel"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });
    it("should allow to download excel - Third Level", () => {
      spyOn(service, "getAuditRebuttalReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        level: "thirdLevel"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - secondLevel", () => {
      spyOn(service, "getAuditRebuttalReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        level: "secondLevel"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });
  });

  describe("Should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditRebuttalReportComponent);
      service = fixture.debugElement.injector.get(AuditorReportService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service when data is valid", () => {
      component.auditReportGroup.get("activeFrom").setValue(new Date());
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("level").setValue("secondLevel");
      const auditTable = jasmine.createSpyObj("auditTable", ["reset"]);
      component.auditTable = auditTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "getAuditRebuttalReport");
      component.submit();
      expect(component.auditTable.reset).toHaveBeenCalled();
      expect(getAudit).toHaveBeenCalled();
    });
    it("should not call service when data is invalid", () => {
      const daysBeforeDate = new Date();
      daysBeforeDate.setDate(daysBeforeDate.getDate() - 500);
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("activeFrom").setValue(daysBeforeDate);
      component.auditReportGroup.get("level").setValue("secondLevel");
      const auditTable = jasmine.createSpyObj("auditTable", ["reset"]);
      component.auditTable = auditTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "getAuditRebuttalReport");
      component.submit();
      expect(component.auditTable.reset).not.toHaveBeenCalled();
      expect(getAudit).not.toHaveBeenCalled();
    });
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
    it("should clear to date value if from date is greater than to date", () => {
      const currentDate = new Date();
      const threeDaysBefore = new Date();
      threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
      component.auditReportGroup.get("activeTo").setValue(currentDate);
      component.auditReportGroup
        .get("activeFrom")
        .setValue(threeDaysBefore);
      fixture.detectChanges();
      component.checkToDate();
      const dat = component.auditReportGroup.get("activeTo").errors;
      expect(dat).toEqual(null);
    });

    it("should call validate and set active to date as null if from date is less than to date", () => {
      const sixMonthsAfter = new Date();
      sixMonthsAfter.setDate(sixMonthsAfter.getDate() + 400);
      const currentDate = new Date();
      component.auditReportGroup
        .get("activeTo")
        .setValue(sixMonthsAfter);
      component.auditReportGroup
        .get("activeFrom")
        .setValue(currentDate);
      const spy = spyOn(component, "validateDates").and.returnValue(false);
      fixture.detectChanges();
      component.checkToDate();
      expect(spy).toHaveBeenCalled();
      expect(
        component.auditReportGroup.get("activeTo").hasError
      ).toBeTruthy();
    });

    it("should not set active to date as null if from date is less than to date", () => {
      const oneDayBeforeDate = new Date();
      const currentDate = new Date();
      component.auditReportGroup
        .get("activeTo")
        .setValue(oneDayBeforeDate);
      component.auditReportGroup
        .get("activeFrom")
        .setValue(currentDate);
      const spy = spyOn(component, "validateDates").and.returnValue(true);
      fixture.detectChanges();
      component.checkToDate();
      expect(spy).toHaveBeenCalled();
      expect(
        component.auditReportGroup.get("activeTo").value
      ).not.toEqual(null);
    });
  });
  afterAll(() => {
    localStorage.clear();
  });
});
