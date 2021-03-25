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
import { AuditedClaimsReportService } from "./../audited-claims-report.service";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  auditClaimsReport,
  mockReport
} from "./../../auditor/auditor-reports/audit-report-mock";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditedClaimsReportComponent } from "./audited-claims-report.component";
import { CalendarModule } from "primeng/calendar";
import { DatePipe } from "@angular/common";
import { of, Subscription, throwError } from "rxjs";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

class MockAuditorReportService extends AuditedClaimsReportService {
  getAuditedClaimsReport() {
    const auditReportArray: any = auditClaimsReport;
    this.auditedClaimsReportSub.next(auditReportArray);
  }
  getAuditedClaimsReportReports() {
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

describe("AuditedClaimsReportComponent", () => {
  let component: AuditedClaimsReportComponent;
  let fixture: ComponentFixture<AuditedClaimsReportComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditedClaimsReportComponent],
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
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        {
          provide: AuditedClaimsReportService,
          useClass: MockAuditorReportService
        },
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
    fixture = TestBed.createComponent(AuditedClaimsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditedClaimsReportComponent);
      service = fixture.debugElement.injector.get(AuditedClaimsReportService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should get report data", () => {
      component.isDataPresent = false;
      component.auditReportGroup.get("activeFrom").setValue(new Date());
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("auditStatus").setValue("Failed");
      fixture.detectChanges();
      spyOn(service, "getAuditedClaimsReport");
      component.getAuditedClaimsReport();
      expect(component.isDataPresent).toBeTruthy();
    });
    it("should set passed, failed and total count", () => {
      component.claimsAuditedSatusVal = 0;
      fixture.detectChanges();
      component.setSummary(auditClaimsReport, "Passed");
      expect(component.claimsAuditedSatusVal.toString()).toEqual("4");
    });
    it("should set table columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });
    it("should able to get auditor report and set to table", () => {
      component.isDataPresent = false;
      spyOn(service, "getAuditedClaimsReportListner").and.returnValue(
        of(auditClaimsReport)
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(),
        status: "All"
      });
      fixture.detectChanges();
      component.reportSubscription = new Subscription();
      try {
        component.getAuditedClaimsReport();
      } catch (error) {
        console.log(error);
      }
      expect(component.isDataPresent).toBeTruthy();
    });
  });

  describe("Should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditedClaimsReportComponent);
      service = fixture.debugElement.injector.get(AuditedClaimsReportService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should fetch report data from service", () => {
      component.isDataPresent = false;
      component.gridData = [];
      component.auditReportGroup.get("activeFrom").setValue(new Date());
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("auditStatus").setValue("Failed");
      const servSpy = spyOn(service, "getAuditedClaimsReport");
      spyOn(component, "setSummary");
      fixture.detectChanges();
      component.getAuditedClaimsReport();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should not allow to download excel when form is invalid", () => {
      component.auditReportGroup.reset();
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - Passed", () => {
      spyOn(service, "getAuditedClaimsReportReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: "Passed"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - All", () => {
      spyOn(service, "getAuditedClaimsReportReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: "All"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - Failed", () => {
      spyOn(service, "getAuditedClaimsReportReports").and.returnValue(
        of({ body: "test" })
      );
      component.auditReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: "Failed"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });
  });

  describe("Should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditedClaimsReportComponent);
      service = fixture.debugElement.injector.get(AuditedClaimsReportService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service when data is valid", () => {
      component.auditReportGroup.get("activeFrom").setValue(new Date());
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("auditStatus").setValue("Failed");
      const auditTable = jasmine.createSpyObj("auditTable", ["reset"]);
      component.auditTable = auditTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "getAuditedClaimsReport");
      component.submit();
      expect(component.auditTable.reset).toHaveBeenCalled();
      expect(getAudit).toHaveBeenCalled();
    });
    it("should not call service when data is invalid", () => {
      const daysBeforeDate = new Date();
      daysBeforeDate.setDate(daysBeforeDate.getDate() - 500);
      component.auditReportGroup.get("activeTo").setValue(new Date());
      component.auditReportGroup.get("activeFrom").setValue(daysBeforeDate);
      component.auditReportGroup.get("auditStatus").setValue("Failed");
      const auditTable = jasmine.createSpyObj("auditTable", ["reset"]);
      component.auditTable = auditTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "getAuditedClaimsReport");
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
    it("should clear to date value if from date is greater than to date", () => {
      const currentDate = new Date();
      const threeDaysBefore = new Date();
      threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
      component.auditReportGroup.get("activeFrom").setValue(currentDate);
      component.auditReportGroup.get("activeTo").setValue(threeDaysBefore);
      fixture.detectChanges();
      component.checkToDate();
      expect(component.auditReportGroup.get("activeTo").value).toEqual(null);
    });
    it("should call validate if from date is less than to date", () => {
      const oneDayBeforeDate = new Date();
      const currentDate = new Date();
      component.auditReportGroup.get("activeFrom").setValue(oneDayBeforeDate);
      component.auditReportGroup.get("activeTo").setValue(currentDate);
      const spy = spyOn(component, "validateDates");
      fixture.detectChanges();
      component.checkToDate();
      expect(spy).toHaveBeenCalled();
    });
  });
  afterAll(() => {
    localStorage.clear();
  });
});
