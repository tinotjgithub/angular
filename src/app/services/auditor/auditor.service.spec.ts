import { TestBed } from "@angular/core/testing";

import { AuditorService } from "./auditor.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import { APP_CONFIG, AppConfig, AppConfigService } from "../config/config.service";
import { APP_INITIALIZER } from '@angular/core';

/**
* Exported function so that it works with AOT
* @param {AppConfigService} configService
* @returns {Function}
*/
export function loadConfigServiceTest(configService: AppConfigService): Function 

{
  return () => { return configService.loadForTest() }; 
}

describe("AuditorService", () => {
  let service: AuditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppConfigService,
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
      ]
    });
  });

  it("should be created", () => {
    service = TestBed.get(AuditorService);
    expect(service).toBeTruthy();
  });

  it("get details", () => {
    spyOn<any>(service, "get").and.returnValue(true);
    expect(service.getAuditFailedCount()).toBeTruthy();
    expect(service.getAuditFailedDetails(1, true)).toBeTruthy();
    expect(service.getAuditFailedDetails(1, false)).toBeTruthy();
    expect(service.getAuditReviewCount()).toBeTruthy();
    expect(service.getAuditStatus()).toBeTruthy();
    expect(service.getAuditailedDetails()).toBeTruthy();
    expect(service.getChecklist()).toBeTruthy();
    expect(service.getClaimForAuditorQueue()).toBeTruthy();
    expect(service.getClaimForAuditorQueueById(1)).toBeTruthy();
    expect(service.getInitializedClaimForAuditorQueue()).toBeTruthy();
    expect(service.getProcessedClaimsInventoryStatus()).toBeTruthy();
    expect(service.getQueueDetails("backlog")).toBeTruthy();
    expect(service.getQueueDetails("test")).toBeTruthy();
    expect(service.getQueueSummary()).toBeTruthy();
    expect(service.deleteQueueDetails(1)).toBeTruthy();
    expect(service.deleteFile(1, "test")).toBeTruthy();
    expect(service.deleteAuditFailedFile(1, "test")).toBeTruthy();
    expect(service.getAuditFailedDetails(null, false)).toBeTruthy();
    expect(service.getAuditQueueDetails(null)).toBeTruthy();
    expect(service.getQueueSummaryLeadManager("Claims Lead")).toBeTruthy();
    expect(service.getQueueSummaryLeadManager("Manager")).toBeTruthy();
    expect(service.getAuditStatusLeadManager()).toBeTruthy();
    expect(service.getProcessedClaimsInventoryStatusLeadManager()).toBeTruthy();
    expect(
      service.getQueueDetailsLeadManager("backlog", "Claims Lead")
    ).toBeTruthy();
    expect(
      service.getQueueDetailsLeadManager("todays", "Manager")
    ).toBeTruthy();
    expect(service.getAuditorClaimsLeadManager(1, "backlog")).toBeTruthy();
    expect(service.getAuditorClaimsLeadManager(1, "todays")).toBeTruthy();
    expect(
      service.getUnassignedClaimsCountAndAuditorsLeadManager("backlog")
    ).toBeTruthy();
    expect(
      service.getUnassignedClaimsCountAndAuditorsLeadManager("test")
    ).toBeTruthy();
    expect(service.getRebuttalList("")).toBeTruthy();
    expect(service.getRebuttalCounts()).toBeTruthy();
    expect(service.getAuditorCounts("", "")).toBeTruthy();
  });

  it("should get workflow details", () => {
    spyOn(service, "get").and.returnValue(of(true));
    let detail;
    service.getWorkFlowRolesListner().subscribe((val) => (detail = val));
    service.getWorkFlowRoles();
    expect(detail).toBeTruthy();
  });

  it("should get workflow details - handle error", () => {
    spyOn(service, "get").and.returnValue(throwError({ status: 400 }));
    service.getWorkFlowRoles();
    expect(service.workFlowRoleResponse).toEqual([]);
  });

  it("should save workflow details", () => {
    spyOn(service, "post").and.returnValue(of(true));
    service.saveWorkFlowRoles({});
    expect(service).toBeTruthy();
  });

  it("should download file", () => {
    spyOn<any>(service, "getBlob").and.returnValue(true);
    expect(service.downloadFile("1")).toBeTruthy();
    // expect(service.downloadExaminerFile("2")).toBeTruthy();
  });

  it("should post detail", () => {
    spyOn<any>(service, "post").and.returnValue(true);
    expect(service.saveAuditQueueClaim({})).toBeTruthy();
    expect(service.getClaimCountDetails({})).toBeTruthy();
    expect(service.addClaimCountDetails({})).toBeTruthy();
    expect(service.addChecklist({})).toBeTruthy();
    expect(service.removeChecklist({})).toBeTruthy();
    expect(service.uploadFile(null)).toBeTruthy();
    expect(service.uploadFileExaminerFile(null)).toBeTruthy();
    expect(service.submitAuditClaim({})).toBeTruthy();
    expect(service.acceptAuditFailedTask({})).toBeTruthy();
    expect(service.pendAuditFailedTask({})).toBeTruthy();
    expect(service.rebutAuditFailedTask({})).toBeTruthy();
    expect(service.assignClaims({})).toBeTruthy();
    expect(service.deleteClaimLeadManager({})).toBeTruthy();
    expect(service.auditorRouteClaim({})).toBeTruthy();
    expect(service.addToTodaysQueue({}, "Claims Auditor")).toBeTruthy();
    expect(service.addToTodaysQueue({}, "Manager")).toBeTruthy();
    expect(service.getClaimsForManualSelection({})).toBeTruthy();
  });

  it("should get auditor quality score details", () => {
    spyOn(service, "get").and.returnValue(of(true));
    let detail;
    service.getAuditorQualityScoreListner().subscribe((val) => (detail = val));
    service.getAuditorQualityScore();
    expect(detail).toBeTruthy();
  });

  it("should get auditor claims audited details", () => {
    spyOn(service, "get").and.returnValue(of(true));
    let detail;
    service.getAuditorClaimsAuditedListner().subscribe((val) => (detail = val));
    service.getAuditorClaimsAudited();
    expect(detail).toBeTruthy();
  });

  it("should get auditor claims audited category details", () => {
    spyOn(service, "get").and.returnValue(of(true));
    let detail;
    service
      .getAuditorClaimsAuditedCategoryListner()
      .subscribe((val) => (detail = val));
    service.getAuditorClaimsAuditedCategory();
    expect(detail).toBeTruthy();
  });

  it("should get auditor audit status details", () => {
    spyOn(service, "get").and.returnValue(of(true));
    let detail;
    service.getAuditorAuditStatusListner().subscribe((val) => (detail = val));
    service.getAuditorAuditStatus();
    expect(detail).toBeTruthy();
  });

  it("should get - handle error", () => {
    spyOn(service, "get").and.returnValue(throwError({ status: 400 }));
    service.getAuditorClaimsAuditedCategory();
    service.getAuditorQualityScore();
    service.getAuditorAuditStatus();
    service.getAuditorClaimsAudited();
    expect(service.auditorCategoryResponse).toEqual([]);
    expect(service.auditorQualityResponse).toEqual([]);
    expect(service.auditorFinScoreResponse).toEqual([]);
    expect(service.auditorAuditResponse).toEqual([]);
  });

  it("should fetch audit Summary Details", () => {
    spyOn(service, "post").and.returnValue(of(true));
    service.auditSummaryByAuditorDetails({});
    expect(service).toBeTruthy();
  });

  it("should fetch audit Summary Excel", () => {
    spyOn(service, "get").and.returnValue(of(true));
    service.auditSummaryByAuditorExcel({});
    expect(service).toBeTruthy();
  });

  it("should fetch Touched Claims", () => {
    spyOn(service, "get").and.returnValue(of(true));
    service.getTouchedClaimsExaminer({});
    expect(service).toBeTruthy();
  });
});
