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
import { AuditSamplingDeletionService } from "./../audit-sampling-deletion.service";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  auditSamplingReport,
  userRoles,
  deletedBy,
  mockReport
} from "./../../auditor/auditor-reports/audit-report-mock";

import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditSamplingDeletionReportComponent } from "./audit-sampling-deletion-report.component";
import { CalendarModule } from "primeng/calendar";
import { DatePipe } from "@angular/common";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { MultiSelectModule } from "primeng/multiselect";
import { of, Subscription, throwError } from "rxjs";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

class MockAuditorReportService extends AuditSamplingDeletionService {
  samplingDeletionReport() {
    const auditReportArray: any = auditSamplingReport;
    this.samplingDeletionReportSub.next(auditReportArray);
  }
  samplingDeletionReportExcel() {
    return mockReport;
  }
  getUserRoles() {
    const auditReportArray: any = userRoles;
    this.deletedByRolesSub.next(auditReportArray);
  }
  getDeletedByNames() {
    const auditReportArray: any = deletedBy;
    this.deletedByNamesSub.next(auditReportArray);
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

describe("AuditSamplingDeletionReportComponent", () => {
  let component: AuditSamplingDeletionReportComponent;
  let fixture: ComponentFixture<AuditSamplingDeletionReportComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditSamplingDeletionReportComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MessageModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        ComponentsModule,
        ProgressSpinnerModule,
        TableModule,
        TooltipModule,
        CalendarModule,
        MultiSelectModule,
        CardModule,
        HttpClientTestingModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        {
          provide: AuditSamplingDeletionService,
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
    fixture = TestBed.createComponent(AuditSamplingDeletionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditSamplingDeletionReportComponent);
      service = fixture.debugElement.injector.get(AuditSamplingDeletionService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should get report data", () => {
      component.isDataPresent = false;
      component.samplingDeleteReportGroup.get("activeTo").setValue(new Date());
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(new Date());
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      component.samplingDeleteReportGroup.get("deletedByName").setValue(res);
      fixture.detectChanges();

      spyOn(service, "samplingDeletionReport");
      component.samplingDeletionReport();
      expect(component.isDataPresent).toBeTruthy();
    });
    it("should set table columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });
    it("should able to get auditor report and set to table", () => {
      component.isDataPresent = false;
      spyOn(service, "samplingDeletionReport").and.returnValue(
        of(auditSamplingReport)
      );
      component.samplingDeleteReportGroup.patchValue({
        activeTo: new Date(),
        activeFrom: new Date(),
        status: "All"
      });
      fixture.detectChanges();
      component.reportSubscription = new Subscription();
      try {
        component.samplingDeletionReport();
      } catch (error) {
        console.log(error);
      }
      expect(component.isDataPresent).toBeTruthy();
    });
  });

  describe("Should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditSamplingDeletionReportComponent);
      service = fixture.debugElement.injector.get(AuditSamplingDeletionService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should fetch report data from service", () => {
      component.isDataPresent = false;
      component.gridData = [];
      const rol = [{ code: "George Floyd", id: 118, name: "George Floyd" }];
      component.samplingDeleteReportGroup.get("userRole").setValue(3);
      component.samplingDeleteReportGroup.get("deletedByName").setValue(rol);
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(new Date());
      component.samplingDeleteReportGroup.get("activeTo").setValue(new Date());
      component.roleSeledtedArray = [{ label: "Claims Lead", value: 3 }];
      const servSpy = spyOn(service, "samplingDeletionReport");
      fixture.detectChanges();
      component.samplingDeletionReport();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should get user roles", () => {
      component.userRoles = [];
      fixture.detectChanges();
      const servSpy = spyOn(service, "getUserRoles");
      component.getUserRoleList();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should get deleted by names", () => {
      const roleArray = [{ label: "Claims Lead", value: 3 }];
      component.userRoles = [];
      fixture.detectChanges();
      const servSpy = spyOn(service, "getDeletedByNames");
      component.getDeletedBy(roleArray);
      expect(servSpy).toHaveBeenCalled();
    });

    it("should not map deleted by when it is empty", () => {
      component.nameList = [];
      component.nam = [];
      fixture.detectChanges();
      component.mapDeletedByNames();
      expect(component.nameList.length).toEqual(0);
    });

    it("should map deleted by", () => {
      component.nameList = [];
      component.nam = [
        { value: 3, label: "Deepa John" },
        { value: 12, label: "Dhanya Saraswathi" }
      ];
      fixture.detectChanges();
      component.mapDeletedByNames();
      expect(component.nameList.length).toBeGreaterThan(0);
    });

    it("should allow to download excel - Passed", () => {
      const rol = [{ code: "George Floyd", id: 118, name: "George Floyd" }];
      component.samplingDeleteReportGroup.get("userRole").setValue(3);
      component.samplingDeleteReportGroup.get("deletedByName").setValue(rol);
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(new Date());
      component.samplingDeleteReportGroup.get("activeTo").setValue(new Date());
      component.roleSeledtedArray = [{ label: "Claims Lead", value: 3 }];
      spyOn(service, "samplingDeletionReportExcel").and.returnValue(
        of({ body: "test" })
      );
      component.samplingDeleteReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: "Passed"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - All", () => {
      const rol = [{ code: "George Floyd", id: 118, name: "George Floyd" }];
      component.samplingDeleteReportGroup.get("userRole").setValue(3);
      component.samplingDeleteReportGroup.get("deletedByName").setValue(rol);
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(new Date());
      component.samplingDeleteReportGroup.get("activeTo").setValue(new Date());
      component.roleSeledtedArray = [{ label: "Claims Lead", value: 3 }];
      spyOn(service, "samplingDeletionReportExcel").and.returnValue(
        of({ body: "test" })
      );
      component.samplingDeleteReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: "All"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - Failed", () => {
      spyOn(service, "samplingDeletionReportExcel").and.returnValue(
        of({ body: "test" })
      );
      component.samplingDeleteReportGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 3)),
        status: "Failed"
      });
      component.exportExcel();
      expect(component).toBeTruthy();
    });
  });

  describe("Should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditSamplingDeletionReportComponent);
      service = fixture.debugElement.injector.get(AuditSamplingDeletionService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service when data is valid", () => {
      component.samplingDeleteReportGroup.get("activeTo").setValue(new Date());
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(new Date());
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      component.samplingDeleteReportGroup.get("deletedByName").setValue(res);
      const samplingTable = jasmine.createSpyObj("samplingTable", ["reset"]);
      component.samplingTable = samplingTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "samplingDeletionReport");
      component.submit();
      expect(component.samplingTable.reset).toHaveBeenCalled();
      expect(getAudit).toHaveBeenCalled();
    });

    it("should not call service when data is invalid", () => {
      component.samplingDeleteReportGroup.get("activeTo").setValue(new Date());
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(new Date(new Date().setDate(new Date().getDate() - 3)));
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      component.samplingDeleteReportGroup.get("deletedByName").setValue(res);
      const samplingTable = jasmine.createSpyObj("samplingTable", ["reset"]);
      component.samplingTable = samplingTable;
      spyOn(component, "validateDates").and.returnValue(false);
      fixture.detectChanges();
      const getAudit = spyOn(component, "samplingDeletionReport");
      component.submit();
      expect(getAudit).not.toHaveBeenCalled();
    });

    it("should update role multi select label during role change", () => {
      const spy = spyOn(component, "updateRoleMultiSelectLabel");
      component.changeNames();
      expect(spy).toHaveBeenCalled();
    });

    // it("should update name multi select label during name change", () => {
    //   const spy = spyOn(component, "updateNameMultiSelectLabel");
    //   const evt = {
    //     itemValue: { id: 5, name: "Claims Auditor", code: "Claims Auditor" },
    //     originalEvent: {},
    //     value: [
    //       { id: 3, name: "Claims Lead", code: "Claims Lead" },
    //       { id: 2, name: "Manager", code: "Manager" }
    //     ]
    //   };
    //   component.changeRoles(evt);
    //   expect(spy).toHaveBeenCalled();
    // });

    it("should set user roles as selected user roles", () => {
      component.roleSeledtedArray = [];
      component.userRoles = [{ value: "5", label: "Claims Auditor" }];
      const evt = { target: { value: "5" } };
      fixture.detectChanges();
      component.changeRoles(evt);
      expect(component.roleSeledtedArray.length).toBeGreaterThan(0);
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
      component.samplingDeleteReportGroup.get("activeTo").setValue(currentDate);
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(threeDaysBefore);
      fixture.detectChanges();
      component.checkToDate();
      const dat = component.samplingDeleteReportGroup.get("activeTo").errors;
      expect(dat).toEqual(null);
    });

    it("should call validate and set active to date as null if from date is less than to date", () => {
      const sixMonthsAfter = new Date();
      sixMonthsAfter.setDate(sixMonthsAfter.getDate() + 400);
      const currentDate = new Date();
      component.samplingDeleteReportGroup
        .get("activeTo")
        .setValue(sixMonthsAfter);
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(currentDate);
      const spy = spyOn(component, "validateDates").and.returnValue(false);
      fixture.detectChanges();
      component.checkToDate();
      expect(spy).toHaveBeenCalled();
      expect(
        component.samplingDeleteReportGroup.get("activeTo").hasError
      ).toBeTruthy();
    });

    it("should not set active to date as null if from date is less than to date", () => {
      const oneDayBeforeDate = new Date();
      const currentDate = new Date();
      component.samplingDeleteReportGroup
        .get("activeTo")
        .setValue(oneDayBeforeDate);
      component.samplingDeleteReportGroup
        .get("activeFrom")
        .setValue(currentDate);
      const spy = spyOn(component, "validateDates").and.returnValue(true);
      fixture.detectChanges();
      component.checkToDate();
      expect(spy).toHaveBeenCalled();
      expect(
        component.samplingDeleteReportGroup.get("activeTo").value
      ).not.toEqual(null);
    });
  });
  afterAll(() => {
    localStorage.clear();
  });
});
