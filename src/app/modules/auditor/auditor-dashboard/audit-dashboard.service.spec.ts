import { TestBed } from "@angular/core/testing";

import { AuditDashboardService } from "./audit-dashboard.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseHttpService } from "./../../../services/base-http.service";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
import { APP_INITIALIZER } from '@angular/core';

describe("AuditDashboardService", () => {
  let http: BaseHttpService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppConfigService,
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        AuditDashboardService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService
      ]
    })
  );

  beforeEach(() => {
    http = TestBed.get(BaseHttpService);
  });

  it("should be created", () => {
    const service: AuditDashboardService = TestBed.get(AuditDashboardService);
    service.auditDetails = [
      "Tue Jun 23 2020 11:03:42 GMT+0530 (India Standard Time)",
      "Tue Jun 23 2020 11:03:42 GMT+0530 (India Standard Time)"
    ];
    const auditDate = service.getAuditDates();
    expect(auditDate.length).toEqual(2);
  });

  describe("should fetch data from backend", () => {
    it("should get audit summary details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getAuditSumryListner().subscribe(val => (detail = val));
      service.getAuditSumry("2020-06-16", "2020-06-23", "daily");
      expect(detail).toBeTruthy();
    });

    it("should get audit summary details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getAuditSumry("2020-06-16", "2020-06-23", "daily");
      expect(service.auditSumryResponse).toEqual([]);
    });

    it("should get audit queue details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getAuditQueueListner().subscribe(val => (detail = val));
      service.getAuditQueue("2020-06-16", "2020-06-23");
      expect(detail).toBeTruthy();
    });

    it("should get audit queue details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getAuditQueue("2020-06-16", "2020-06-23");
      expect(service.auditQueueResponse).toEqual([]);
    });

    it("should get audit productivity details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getMyAuditProdScoresListner().subscribe(val => (detail = val));
      service.getMyAuditProdScores("2020-06-16", "2020-06-23");
      expect(detail).toBeTruthy();
    });

    it("should get audit productivity details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getMyAuditProdScores("2020-06-16", "2020-06-23");
      expect(service.myprodScoreResponse).toEqual([]);
    });

    it("should get audit productivity details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getMyAuditProdScoresListner().subscribe(val => (detail = val));
      service.getMyAuditProdScores("2020-06-16", "2020-06-23");
      expect(detail).toBeTruthy();
    });

    it("should get Audit Type Status details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getAuditTypeStatus("2020-06-16", "2020-06-23");
      expect(service.auditTypeStatusResponse).toEqual([]);
    });

    it("should get Audit Type Status details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getAuditTypeStatusListner().subscribe(val => (detail = val));
      service.getAuditTypeStatus("2020-06-16", "2020-06-23");
      expect(detail).toBeTruthy();
    });

    it("should get Claims Processed Adited details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getClaimsProcessedAdited("2020-06-16", "2020-06-23", "daily");
      expect(service.claimsProcessedAditedResponse).toEqual([]);
    });

    it("should get Claims Processed Adited details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service
        .getClaimsProcessedAditedListner()
        .subscribe(val => (detail = val));
      service.getClaimsProcessedAdited("2020-06-16", "2020-06-23", "daily");
      expect(detail).toBeTruthy();
    });

    it("should get low performing examiner details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getLowPerExaminersListner().subscribe(val => (detail = val));
      service.getLowPerExaminers("2020-06-16", "2020-06-23", "Claims Auditor");
      expect(detail).toBeTruthy();
    });

    it("should get low performing examiner details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getLowPerExaminers("2020-06-16", "2020-06-23", "Claims Auditor");
      expect(service.lowPerExaminersResponse).toEqual([]);
    });

    it("should get high performing examiner details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getHighPerExaminersListner().subscribe(val => (detail = val));
      service.getHighPerExaminers("2020-06-16", "2020-06-23", "Claims Auditor");
      expect(detail).toBeTruthy();
    });

    it("should get high performing examiner details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getHighPerExaminers("2020-06-16", "2020-06-23", "Claims Auditor");
      expect(service.highPerExaminersResponse).toEqual([]);
    });

    it("should get examiner financial score details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getAuditorFinScoresListner().subscribe(val => (detail = val));
      service.getAuditorFinScores("2020-06-16", "2020-06-23", 1, 2);
      expect(detail).toBeTruthy();
    });

    it("should get examiner financial score details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getAuditorFinScores("2020-06-16", "2020-06-23", 1, 2);
      expect(service.auditorFinScoreResponse).toEqual([]);
    });

    it("should get examiner procedural score details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(of(true));
      let detail;
      service.getAuditorProcScoresListner().subscribe(val => (detail = val));
      service.getAuditorProcScores("2020-06-16", "2020-06-23", 1, 2);
      expect(detail).toBeTruthy();
    });

    it("should get examiner procedural score details - handle error", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "post").and.returnValue(throwError({ status: 400 }));
      service.getAuditorProcScores("2020-06-16", "2020-06-23", 1, 2);
      expect(service.auditorProcScoreResponse).toEqual([]);
    });
    it("should get auditor claim examiners", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "get").and.returnValue(of([]));
      let value;
      service
        .getAuditorClaimsExaminersListner()
        .subscribe(val => (value = val));
      service.getAuditorClaimsExaminers(2);
      expect(value).toEqual([]);
    });

    it("should handle the error for auditor claim examiners", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(service, "get").and.returnValue(throwError(null));
      service.getAuditorClaimsExaminers(null);
      expect(service.auditorClaimsExaminersResponse).toEqual([]);
    });
    it("should get audit Status Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "get").and.returnValue(of([]));
      let value;
      service.auditStatusDetailsListner().subscribe(val => (value = val));
      service.auditStatusDetails("test");
      expect(value).toBeUndefined();
    });

    it("should get audit Status Details when auditStatus is AuditSuccess", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "get").and.returnValue(of([]));
      let value;
      service.auditStatusDetailsListner().subscribe(val => (value = val));
      service.auditStatusDetails({ auditStatus: "AuditSuccess" });
      expect(value).toBeUndefined();
    });
    it("should get audit Status Details when auditStatus is AuditFailed", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "get").and.returnValue(of([]));
      let value;
      service.auditStatusDetailsListner().subscribe(val => (value = val));
      service.auditStatusDetails({ auditStatus: "AuditFailed" });
      expect(value).toBeUndefined();
    });

    it("should handle the error on audit Status Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
      service.auditStatusDetails("test");
      expect(service.auditStatusDetailsResponse).toBeUndefined();
    });
    it("should get audit Claims Details when type is audit-claims-summary", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "post").and.returnValue(of([]));
      let value;
      service.auditClaimsDetailsListner().subscribe(val => (value = val));
      service.auditClaimsDetails("audit-claims-summary", "test");
      expect(value).toBeUndefined();
    });

    it("should get audit Claims Details when type is claims-audited-queue", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "post").and.returnValue(of([]));
      let value;
      service.auditClaimsDetailsListner().subscribe(val => (value = val));
      service.auditClaimsDetails("claims-audited-queue", "test");
      expect(value).toBeUndefined();
    });

    it("should get audit Claims Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "post").and.returnValue(of([]));
      let value;
      service.auditClaimsDetailsListner().subscribe(val => (value = val));
      service.auditClaimsDetails("test", "test");
      expect(value).toBeUndefined();
    });

    it("should handle the error on audit Status Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
      service.auditClaimsDetails("audit-claims-summary", "test");
      expect(service.auditClaimsDetailsResponse).toBeUndefined();
    });

    it("should get auditor Audited Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "get").and.returnValue(of([]));
      let value;
      service.auditorAuditedDetailsListner().subscribe(val => (value = val));
      service.auditorAuditedDetails("test");
      expect(value).toBeUndefined();
    });

    it("should handle the error on aauditor Audited Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
      service.auditorAuditedDetails("test");
      expect(service.auditorAuditedDetailsResponse).toBeUndefined();
    });
    //

    it("should get auditor Audited Details Report", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(service.auditorAuditedDetailsReport({})).toBeTruthy();
    });

    it("should get Audit Reports", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(service.auditStatusDetailsReport({})).toBeTruthy();
    });

    it("should get Audit Reports", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(service.auditQualityDetailsReport({})).toBeTruthy();
    });

    it("should get audit Quality Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "post").and.returnValue(of([]));
      let value;
      service.auditQualityDetailsListner().subscribe(val => (value = val));
      service.auditQualityDetails("test");
      expect(value).toBeUndefined();
    });

    it("should get audit Claims Details Report when type is audit-claims-summary", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(
        service.auditClaimsDetailsReport("audit-claims-summary", "test")
      ).toBeTruthy();
    });

    it("should get audit Claims Details Report when type is claims-audited-queue", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(
        service.auditClaimsDetailsReport("claims-audited-queue", "test")
      ).toBeTruthy();
    });

    it("should get audit Claims Details Report when type is not claims-audited-queue or audit-claims-summary", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(service.auditClaimsDetailsReport("test", "test")).toBeTruthy();
    });

    it("should get claims Audited Category Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn(http, "post").and.returnValue(of([]));
      let value;
      service
        .claimsAuditedCategoryDetailsListner()
        .subscribe(val => (value = val));
      service.claimsAuditedCategoryDetails("test", "test");
      expect(value).toBeUndefined();
    });

    it("should get claim Audited Category Reportt", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(service.claimsAuditedCategoryReport("test", "test")).toBeTruthy();
    });

    it("should get low Performing Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "post").and.returnValue(true);
      expect(service.lowPerformingDetails("test")).toBeTruthy();
    });

    it("should get low Performing Excel", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(service.lowPerformingExcel("test")).toBeTruthy();
    });

    it("should get audited Claims Excel", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "getExcel").and.returnValue(true);
      expect(service.auditedClaimsExcel("test")).toBeTruthy();
    });
    it("should get audited Claims Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      spyOn<any>(http, "post").and.returnValue(true);
      expect(service.auditedClaimsDetails("test")).toBeTruthy();
    });
    it("should set Audit Details", () => {
      const service: AuditDashboardService = TestBed.get(AuditDashboardService);
      service.setAuditDetails("test");
      expect(service.auditDetails).toEqual({ auditDates: "test" });
    });

    // setAuditDetails
  });
});
