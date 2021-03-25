import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditorDashboardComponent } from "./audit-dashboard.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { auditQueueCount, auditDetails } from "./../auditor-dashboard.mock";
import { AuditDashboardService } from "./../audit-dashboard.service";
import { of, throwError, BehaviorSubject, Subject } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ClaimsAuditSummaryComponent } from "./../claims-audit-summary/claims-audit-summary.component";
import { ClaimsAuditedQueueComponent } from "./../claims-audited-queue/claims-audited-queue.component";
import { ClaimsAuditedTypeStatusComponent } from "./../claims-audited-type-status/claims-audited-type-status.component";
import { ClaimsAuditProductivityComponent } from "./../claims-audit-productivity/claims-audit-productivity.component";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { AuditReportDashboardModule } from "./../../../audit-report-dashboard/audit-report-dashboard.module";
import { ManagerModule } from "./../../../manager/manager.module";
import { LandingPageModule } from "./../../landing-page/landing-page.module";
import { AuditedClaimsDetailsComponent } from "./../audited-claims-details/audited-claims-details.component";
import { TableModule } from "primeng/table";
import { ReportsModule } from "./../../../../modules/reports/reports.module";
import { APP_INITIALIZER } from "@angular/core";
import { AppConfigService } from "src/app/services/config/config.service";

export class MockAuditDashboardService {
  resetFormSubject = new BehaviorSubject<any>(true);
  auditDetails: any;
  auditSumryResponse: any;
  claimSourceResponse: any;
  auditTypeStatusResponse: any;
  auditClaimsDetailsResponse: any;
  auditClaimsDetailsFetch = new Subject<any>();
  auditStatusDetailsResponse: any;
  auditStatusDetailsFetch = new Subject<any>();
  auditQualityDetailsResponse: any;
  auditQualityDetailsFetch = new Subject<any>();
  auditTypeStatusFetch = new Subject<any>();
  myProdScoresFetch = new Subject<any>();
  auditSumryFetch = new Subject<any>();
  auditorAuditedDetailsResponse: any;
  auditorAuditedDetailsFetch = new Subject<any>();
  auditQueueResponse: any;
  myprodScoreResponse: any;
  auditorClaimsExaminersResponse: any;
  auditorUserGroupsResponse: any;
  auditorProcScoreResponse: any;
  auditorFinScoreResponse: any;
  lowPerExaminersResponse: any;
  highPerExaminersResponse: any;
  auditQueueFetch = new Subject<any>();
  auditorFinScoresFetch = new Subject<any>();
  auditorProcScoresFetch = new Subject<any>();
  auditorUserGroupsSub = new Subject<any>();
  lowPerExaminersFetch = new Subject<any>();
  highPerExaminersFetch = new Subject<any>();
  auditorClaimsExaminersSub = new Subject<any>();
  paymentStatusResponse: any;
  claimsProcessedAditedResponse: any;
  claimsProcessedAditedFetch = new Subject<any>();
  claimsAuditedCategoryDetailsFetch = new Subject<any>();
  claimsAuditedCategoryDetailsResponse: any;
  claimsAuditedCategoryReportFetch = new Subject<any>();
  claimsAuditedCategoryReportResponse: any;

  constructor() {}

  getAuditDates() {
    return this.auditDetails;
  }

  setAuditDetails(auditDates) {
    this.auditDetails = {};
    this.auditDetails = { auditDates };
  }
  auditQualityDetailsListner() {
    return this.auditQualityDetailsFetch.asObservable();
  }

  auditClaimsDetailsListner() {
    return this.auditClaimsDetailsFetch.asObservable();
  }

  claimsAuditedCategoryDetailsListner() {
    return this.claimsAuditedCategoryDetailsFetch.asObservable();
  }

  auditStatusDetailsListner() {
    return this.auditStatusDetailsFetch.asObservable();
  }

  auditorAuditedDetailsListner() {
    return this.auditorAuditedDetailsFetch.asObservable();
  }

  getAuditSumryListner() {
    return this.auditSumryFetch.asObservable();
  }

  getMyAuditProdScoresListner() {
    return this.myProdScoresFetch.asObservable();
  }

  getClaimsProcessedAditedListner() {
    return this.claimsProcessedAditedFetch.asObservable();
  }

  getAuditTypeStatusListner() {
    return this.auditTypeStatusFetch.asObservable();
  }

  getAuditQueueListner() {
    return this.auditQueueFetch.asObservable();
  }

  getLowPerExaminersListner() {
    return this.lowPerExaminersFetch.asObservable();
  }

  getHighPerExaminersListner() {
    return this.highPerExaminersFetch.asObservable();
  }

  getAuditorClaimsExaminersListner() {
    return this.auditorClaimsExaminersSub.asObservable();
  }

  getAuditorFinScoresListner() {
    return this.auditorFinScoresFetch.asObservable();
  }

  getAuditorProcScoresListner() {
    return this.auditorProcScoresFetch.asObservable();
  }

  getAuditSumry(fromDate, toDate, frequency) {
    this.auditSumryResponse = {};
    this.auditSumryFetch.next(this.auditSumryResponse);
  }

  getAuditQueue(fromDate, toDate) {
    this.auditQueueResponse = {
      auditQueueCountDtos: [],
    };
    this.auditQueueFetch.next(this.auditQueueResponse);
  }

  getMyAuditProdScores(fromDate, toDate) {
    this.myprodScoreResponse = {};
    this.myProdScoresFetch.next(this.myprodScoreResponse);
  }

  getAuditTypeStatus(fromDate, toDate) {
    this.auditTypeStatusResponse = {};
    this.auditTypeStatusFetch.next(this.auditTypeStatusResponse);
  }

  getClaimsProcessedAdited(fromDate, toDate, schedule) {
    this.claimsProcessedAditedResponse = {};
    this.claimsProcessedAditedFetch.next(this.claimsProcessedAditedResponse);
  }

  getLowPerExaminers(fromDate, toDate, role) {
    this.lowPerExaminersResponse = {};
    this.lowPerExaminersFetch.next(this.lowPerExaminersResponse);
  }

  getHighPerExaminers(fromDate, toDate, role) {
    this.highPerExaminersResponse = {};
    this.highPerExaminersFetch.next(this.highPerExaminersResponse);
  }

  getAuditorFinScores(fromDate, toDate, examinerId, role) {
    this.auditorFinScoreResponse = {};
    this.auditorFinScoresFetch.next(this.auditorFinScoreResponse);
  }

  getAuditorProcScores(fromDate, toDate, examinerId, role) {
    this.auditorProcScoreResponse = {};
    this.auditorProcScoresFetch.next(this.auditorProcScoreResponse);
  }
  getAuditorClaimsExaminers(role) {
    this.auditorClaimsExaminersResponse = {};
    this.auditorClaimsExaminersSub.next(this.auditorClaimsExaminersResponse);
  }

  auditClaimsDetails(type, payload) {
    this.auditClaimsDetailsResponse = {};
    this.auditClaimsDetailsFetch.next(this.auditClaimsDetailsResponse);
  }

  auditStatusDetails(payload) {
    this.auditStatusDetailsResponse = {};
    this.auditStatusDetailsFetch.next(this.auditStatusDetailsResponse);
  }

  auditorAuditedDetails(payload) {
    this.auditorAuditedDetailsResponse = {};
    this.auditorAuditedDetailsFetch.next(this.auditorAuditedDetailsResponse);
  }

  auditorAuditedDetailsReport(payload) {
    return of(null);
  }

  auditStatusDetailsReport(payload) {
    return of(null);
  }

  auditQualityDetails(payload) {
    this.auditQualityDetailsResponse = {};
    this.auditQualityDetailsFetch.next(this.auditQualityDetailsResponse);
  }

  auditQualityDetailsReport(payload) {
    return of(null);
  }

  auditClaimsDetailsReport(type, payload) {
    return of(null);
  }

  claimsAuditedCategoryDetails(type, payload) {
    this.claimsAuditedCategoryDetailsResponse = {};
    this.claimsAuditedCategoryDetailsFetch.next(
      this.claimsAuditedCategoryDetailsResponse
    );
  }

  claimsAuditedCategoryReport(type, payload) {
    return of(null);
  }

  lowPerformingDetails(payload) {
    return of(null);
  }

  lowPerformingExcel(payload) {
    return of(null);
  }

  auditedClaimsDetails(payload) {
    return of(null);
  }

  auditedClaimsExcel(payload) {
    return of(null);
  }
}

/**
 * Exported function so that it works with AOT
 * @param {AppConfigService} configService
 * @returns {Function}
 */
export function loadConfigService(configService: AppConfigService): Function {
  return () => {
    return configService.load();
  };
}

describe("AuditorDashboardComponent", () => {
  let component: AuditorDashboardComponent;
  let fixture: ComponentFixture<AuditorDashboardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditorDashboardComponent,
        ClaimsAuditSummaryComponent,
        ClaimsAuditedQueueComponent,
        AuditedClaimsDetailsComponent,
        ClaimsAuditedTypeStatusComponent,
        ClaimsAuditProductivityComponent,
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        AuditReportDashboardModule,
        ReactiveFormsModule,
        TableModule,
        LandingPageModule,
        CalendarModule,
        DialogModule,
        ManagerModule,
        MultiSelectModule,
        HttpClientTestingModule,
        ReportsModule,
        DropdownModule,
        MultiSelectModule,
      ],
      providers: [
        AppConfigService,
        {
          provide: APP_INITIALIZER,
          useFactory: loadConfigService,
          deps: [AppConfigService],
          multi: true,
        },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        { provide: AuditDashboardService, useClass: MockAuditDashboardService },
        DatePipe,
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
    component.auditDates.setValue({
      dateRange: null
    });
    component.onSubmitAudit();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      // fixture = TestBed.createComponent(AuditorDashboardComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      /* component = fixture.componentInstance;
      fixture.detectChanges(); */
    });
    it("should set audit dates", () => {
      component.processedDates = [];
      fixture.detectChanges();
      component.setAuditDates();
      const spy = spyOn(service, "getAuditDates");
      expect(component.processedDates.length).toBeGreaterThan(0);
    });
    it("should submit audit dates", () => {
      component.processedDates = [];
      const yesterdaysDate = new Date();
      yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
      component.processedDates.push(yesterdaysDate);
      component.processedDates.push(yesterdaysDate);
      component.auditDates.get("dateRange").setValue(component.processedDates);
      const spy = spyOn(service, "setAuditDetails");
      fixture.detectChanges();
      component.onSubmitAudit();
      expect(spy).toHaveBeenCalled();
    });
    it("should validate audit dates and set validity to true when difference in dates is less than 6 months", () => {
      component.isValid = false;
      component.processedDates = [];
      const yesterdaysDate = new Date();
      yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
      component.processedDates.push(yesterdaysDate);
      component.processedDates.push(yesterdaysDate);
      component.auditDates.get("dateRange").setValue(component.processedDates);
      component.validateDates();
      expect(component.auditDates.valid).toBeTruthy();
    });
    it("should validate audit dates and set validity to false when difference in dates is more than 6 months", () => {
      component.isValid = false;
      component.processedDates = [];
      const yesterdaysDate = new Date();
      yesterdaysDate.setDate(yesterdaysDate.getDate() - 500);
      component.processedDates.push(yesterdaysDate);
      component.processedDates.push(new Date());
      component.auditDates.get("dateRange").setValue(component.processedDates);
      fixture.detectChanges();
      component.validateDates();
      expect(component.auditDates.invalid).toBeTruthy();
    });

    it("should calculate difference when to date is present", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set validilty to true when to date is not present", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(component.auditDates.valid).toBeTruthy();
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
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(component.auditDates.valid).toBeFalsy();
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
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(component.auditDates.valid).toBeTruthy();
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
      const diff = component.getMonths(defaultDateRange);
      expect(diff).toBe(0);
    });
  });
});
