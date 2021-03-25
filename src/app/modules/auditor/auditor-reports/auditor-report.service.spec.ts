import { TestBed } from "@angular/core/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AuditorReportService } from "./auditor-report.service";
import { Subject, of, throwError } from "rxjs";

describe("AuditorReportService", () => {
  let service: AuditorReportService;
  let http: BaseHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [BaseHttpService]
    });
    service = TestBed.get(AuditorReportService);
    http = TestBed.get(BaseHttpService);
    spyOn<any>(http, "get").and.returnValue(of(true));
    spyOn<any>(http, "post").and.returnValue(of(true));
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getAuditReportListner", () => {
    service.auditReportSub = new Subject<any>();
    expect(service.getAuditReportListner()).toEqual(
      service.auditReportSub.asObservable()
    );
  });

  it("getAuditRebuttalReportListner", () => {
    service.auditRebuttalReportSub = new Subject<any>();
    expect(service.getAuditRebuttalReportListner()).toEqual(
      service.auditRebuttalReportSub.asObservable()
    );
  });

  it("getAuditBacklogReportListner", () => {
    service.auditBacklogReportSub = new Subject<any>();
    expect(service.getAuditBacklogReportListner()).toEqual(
      service.auditBacklogReportSub.asObservable()
    );
  });

  it("getAuditReport", () => {
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service.getAuditReportListner().subscribe(val => (value = val));
    service.getAuditReport({});
    expect(value).toEqual([]);
  });

  it("getAuditReport Failed", () => {
    spyOn(service, "post").and.returnValue(throwError(null));
    service.getAuditReport({});
    expect(service.auditReportResponse).toEqual([]);
  });
  it("getAuditRebuttalReport", () => {
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service.getAuditRebuttalReportListner().subscribe(val => (value = val));
    service.getAuditRebuttalReport({});
    expect(value).toEqual([]);
  });

  it("getAuditRebuttalReport Failed", () => {
    spyOn(service, "post").and.returnValue(throwError(null));
    service.getAuditRebuttalReport({});
    expect(service.auditRebuttalReportResponse).toEqual([]);
  });

  it("getAuditBacklogReport", () => {
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service.getAuditBacklogReportListner().subscribe(val => (value = val));
    service.getAuditBacklogReport({});
    expect(value).toEqual([]);
  });

  it("getAuditBacklogReport Failed", () => {
    spyOn(service, "post").and.returnValue(throwError(null));
    service.getAuditBacklogReport({});
    expect(service.auditBacklogReportResponse).toEqual([]);
  });

  it("getAuditBacklogReportReports", () => {
    spyOn<any>(http, "getExcel").and.returnValue(true);
    expect(service.getAuditBacklogReportReports({})).toBeTruthy();
  });
  it("getAuditRebuttalReports", () => {
    spyOn<any>(http, "getExcel").and.returnValue(true);
    expect(service.getAuditRebuttalReports({})).toBeTruthy();
  });
  it("getAuditReports", () => {
    spyOn<any>(http, "getExcel").and.returnValue(true);
    expect(service.getAuditReports({})).toBeTruthy();
  });
});
