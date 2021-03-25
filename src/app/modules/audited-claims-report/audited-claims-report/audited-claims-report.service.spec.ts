import { TestBed, ComponentFixture } from "@angular/core/testing";

import { AuditedClaimsReportService } from "./../audited-claims-report.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseHttpService } from "./../../../services/base-http.service";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
describe("AuditedClaimsReportService", () => {
  let http: BaseHttpService;
  let service: AuditedClaimsReportService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        AuditedClaimsReportService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService
      ]
    })
  );

  beforeEach(() => {
    service = TestBed.get(AuditedClaimsReportService);
    http = TestBed.get(BaseHttpService);
  });

  it("should get claims audited report", () => {
    spyOn(service, "post").and.returnValue(of([]));
    let value = [];
    service.getAuditedClaimsReportListner().subscribe(val => (value = val));
    service.getAuditedClaimsReport("test");
    expect(value).toEqual([]);
  });

  it("should get claims audited report - message", () => {
    spyOn(service, "post").and.returnValue(of({message: 'test'}));
    let value = {};
    service.getAuditedClaimsReportListner().subscribe(val => (value = val));
    service.getAuditedClaimsReport("test");
    expect(value).toEqual({message: 'test'});
  });

  it("should handle the error on getting audited claims report", () => {
    service.auditedClaimsReportResponse = [];
    spyOn(service, "post").and.returnValue(throwError(null));
    service.getAuditedClaimsReport("test");
    expect(service.auditedClaimsReportResponse).toEqual([]);
  });

  it("Status Report", () => {
    spyOn(service, "getExcel").and.returnValue(of([]));
    let value = [];
    service
      .getAuditedClaimsReportReportsListner()
      .subscribe(val => (value = val));
    service.getAuditedClaimsReportReports("test");
    expect(value).toEqual([]);
  });
});
