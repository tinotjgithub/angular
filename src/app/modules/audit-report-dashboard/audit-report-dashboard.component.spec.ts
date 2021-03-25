//   beforeEach(() => {
//     fixture = TestBed.createComponent(AuditReportDashboardComponent);
//     service = fixture.debugElement.injector.get(AuditReportDashboardService);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//     component.auditDates = new FormBuilder().group({
//       dateRange: [dateRange, Validators.required]
//     });
//   });

import { auditDates } from "./mocks/report-dashboard.mock";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditReportDashboardComponent } from "./audit-report-dashboard.component";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CalendarModule } from "primeng/calendar";
import { RouterModule } from "@angular/router";
import { DropdownModule } from "primeng/dropdown";
import { TooltipModule } from "primeng/tooltip";
import { GoogleChartsModule } from "angular-google-charts";
import { CommonModule, DatePipe } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { MultiSelectModule } from "primeng/multiselect";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AuditSamplingByCategoryComponent } from "./audit-sampling-by-category/audit-sampling-by-category.component";
import { AuditStatusByAmountComponent } from "./audit-status-by-amount/audit-status-by-amount.component";
import { AuditSamplingByMethodComponent } from "./audit-sampling-by-method/audit-sampling-by-method.component";
import { AuditStatusByErrorTypeComponent } from "./audit-status-by-error-type/audit-status-by-error-type.component";
import { AuditSamplingByBilledAmountComponent } from "./audit-sampling-by-billed-amount/audit-sampling-by-billed-amount.component";
import { AuditBilledAmountByClaimTypeComponent } from "./audit-billed-amount-by-claim-type/audit-billed-amount-by-claim-type.component";
import { AuditSamplingByAdjudicationComponent } from "./audit-sampling-by-adjudication/audit-sampling-by-adjudication.component";
import { AuditStatusComponent } from "./audit-status/audit-status.component";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditReportDashboardService } from "./audit-report-dashboard.service";
import { AuditedClaimsReportService } from "../audited-claims-report/audited-claims-report.service";
import { of } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";
class MockAuditReportDashboardService extends AuditReportDashboardService {
  getAuditDates() {
    const statusArray: any = auditDates;
    return statusArray;
  }
}
const maxDay = new Date("2020-08-12T08:19:25.520Z");
maxDay.setDate(maxDay.getDate() - 1);
const thirtyDaysBefore = new Date("2020-08-12T08:19:25.520Z");
const yesterday = new Date("2020-08-12T08:19:25.520Z");
thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 31);
yesterday.setDate(yesterday.getDate() - 1);
const dateRange = [];
dateRange.push(thirtyDaysBefore);
dateRange.push(yesterday);
describe("AuditReportDashboardComponent", () => {
  let component: AuditReportDashboardComponent;
  let fixture: ComponentFixture<AuditReportDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditReportDashboardComponent,
        AuditSamplingByCategoryComponent,
        AuditStatusByAmountComponent,
        AuditSamplingByMethodComponent,
        AuditStatusByErrorTypeComponent,
        AuditSamplingByBilledAmountComponent,
        AuditBilledAmountByClaimTypeComponent,
        AuditSamplingByAdjudicationComponent,
        AuditStatusComponent
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        RouterModule,
        DropdownModule,
        TooltipModule,
        CommonModule,
        CardModule,
        MultiSelectModule,
        HttpClientTestingModule,
        ComponentsModule
      ],
      providers: [
        {
          provide: AuditReportDashboardService,
          useClass: MockAuditReportDashboardService
        },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditReportDashboardComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("setAuditDates function works properly", () => {
      const spy = spyOn(service, "setAuditDetails");
      component.setAuditDates();
      expect(component.processedDates).toBeDefined();
      expect(component.processedDates.length).toEqual(4);
      expect(spy).toHaveBeenCalled();
    });
    it("onSubmitAudit", () => {
      component.auditDates = new FormBuilder().group({
        dateRange: [dateRange, Validators.required]
      });
      const spy = spyOn(service, "setAuditDetails");
      const spy2 = spyOn(component.resetFormSubject, "next");
      component.onSubmitAudit();
      expect(component.processedDates).toBeDefined();
      expect(component.processedDates.length).toEqual(2);
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    it("validateDates", () => {
      component.auditDates = new FormBuilder().group({
        dateRange: [dateRange, Validators.required]
      });
      component.validateDates();
      expect(component.isValid).toBeTruthy();
      expect(component.rangeError).toBeTruthy();
      expect(component.invalidDateError).toBeFalsy();
      component.auditDates = new FormBuilder().group({
        dateRange: [[], Validators.required]
      });
      component.validateDates();
      expect(component.isValid).toBeTruthy();
    });

    it("getMonths", () => {
      expect(component.getMonths([new Date(), new Date()])).toEqual(0);
    });

    it("getFormattedDate", () => {
      expect(
        component.getFormattedDate(new Date("2020-07-18T09:54:27.445Z"))
      ).toEqual("07/18/2020");
    });

    it("getToDateValue", () => {
      component.auditDates = new FormBuilder().group({
        dateRange: [dateRange, Validators.required]
      });
      expect(component.getToDateValue()).toEqual(
        new Date("2020-08-11T08:19:25.520Z")
      );
    });

    it("exportExcel", () => {
      const service1 = fixture.debugElement.injector.get(
        AuditedClaimsReportService
      );
      const notifierService = fixture.debugElement.injector.get(
        NotifierService
      );
      const spy1 = spyOn(
        service1,
        "getAuditedClaimsReportReports"
      ).and.returnValue(of({ body: "test" }));

      const spy2 = spyOn(notifierService, "throwNotification");
      component.auditDates = new FormBuilder().group({
        dateRange: [dateRange, Validators.required]
      });
      component.exportExcel();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      component.auditDates.reset();
      component.exportExcel();
      expect(spy1).not.toHaveBeenCalledTimes(2);
    });
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
