import { TestBed } from "@angular/core/testing";
import { AuditReportDashboardService } from "./audit-report-dashboard.service";
import { Router } from "@angular/router";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "primeng/api";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { filter } from "rxjs/operators";
import { Subject, of, throwError } from "rxjs";
import { BaseHttpService } from "src/app/services/base-http.service";
import { AuditDashboardService } from "../auditor/auditor-dashboard/audit-dashboard.service";

describe("ReportsService", () => {
  let service: AuditReportDashboardService;
  let http: MockBaseHttpService;
  let router: Router;
  let navigateSpy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [BaseHttpService, MessageService]
    });
    service = TestBed.get(AuditReportDashboardService);
    http = TestBed.get(BaseHttpService);
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, "navigateByUrl");
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getAuditDates", () => {
    service.auditDetails = "Data";
    expect(service.getAuditDates()).toEqual("Data");
  });

  it("getfilters", () => {
    service.filters = "Data";
    expect(service.getfilters()).toEqual("Data");
  });
  it("setfilters", () => {
    const filters = "filters";
    service.setfilters(filters);
    expect(service.auditDetails).toEqual({ filters });
  });
  it("setAuditDetails", () => {
    const filters = "auditDetails";
    service.setfilters(filters);
    expect(service.auditDetails).toEqual({ filters });
  });

  it("getAuditSamplingMethodListner", () => {
    service.samplingMethodFetch = new Subject<any>();
    expect(service.getAuditSamplingMethodListner()).toEqual(
      service.samplingMethodFetch.asObservable()
    );
  });
  it("getAuditSamplingAdjListner", () => {
    service.samplingAdjFetch = new Subject<any>();
    expect(service.getAuditSamplingAdjListner()).toEqual(
      service.samplingAdjFetch.asObservable()
    );
  });
  it("getBilledAmtByClaimTypeListner", () => {
    service.auditBilledAmtClaimTypeFetch = new Subject<any>();
    expect(service.getBilledAmtByClaimTypeListner()).toEqual(
      service.auditBilledAmtClaimTypeFetch.asObservable()
    );
  });
  it("getAuditSamplingErrListner", () => {
    service.samplingErrFetch = new Subject<any>();
    expect(service.getAuditSamplingErrListner()).toEqual(
      service.samplingErrFetch.asObservable()
    );
  });
  it("getAuditSamplingStsListner", () => {
    service.samplingStsFetch = new Subject<any>();
    expect(service.getAuditSamplingStsListner()).toEqual(
      service.samplingStsFetch.asObservable()
    );
  });
  it("getAuditSamplingAmtListner", () => {
    service.samplingAmtFetch = new Subject<any>();
    expect(service.getAuditSamplingAmtListner()).toEqual(
      service.samplingAmtFetch.asObservable()
    );
  });
  it("getClaimsParameterListListner", () => {
    service.claimsParameterListFetch = new Subject<any>();
    expect(service.getClaimsParameterListListner()).toEqual(
      service.claimsParameterListFetch.asObservable()
    );
  });
  it("getPaymentStatusListner", () => {
    service.getPaymentStatusFetch = new Subject<any>();
    expect(service.getPaymentStatusListner()).toEqual(
      service.getPaymentStatusFetch.asObservable()
    );
  });
  it("getAuditSamplingCategoryListner", () => {
    service.statusReportFetch = new Subject<any>();
    expect(service.getAuditSamplingCategoryListner()).toEqual(
      service.statusReportFetch.asObservable()
    );
  });
  it("getSamplingReportListner", () => {
    service.auditSamplingCategoryFetch = new Subject<any>();
    expect(service.getSamplingReportListner()).toEqual(
      service.auditSamplingCategoryFetch.asObservable()
    );
  });
  it("getClaimSourceListner", () => {
    service.claimSourceFetch = new Subject<any>();
    expect(service.getClaimSourceListner()).toEqual(
      service.claimSourceFetch.asObservable()
    );
  });
  it("getLOBListner", () => {
    service.lobFetch = new Subject<any>();
    expect(service.getLOBListner()).toEqual(service.lobFetch.asObservable());
  });
  it("getPlanTypeListner", () => {
    service.planTypeFetch = new Subject<any>();
    expect(service.getPlanTypeListner()).toEqual(
      service.planTypeFetch.asObservable()
    );
  });
  it("getAuditSamplingBilledAmtListner", () => {
    service.auditSamplingBilledAmtFetch = new Subject<any>();
    expect(service.getAuditSamplingBilledAmtListner()).toEqual(
      service.auditSamplingBilledAmtFetch.asObservable()
    );
  });
  it("getAuditSamplingMethod", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service1.getAuditSamplingMethodListner().subscribe(val => (value = val));
    service1.getAuditSamplingMethod(new Date(), new Date());
    expect(value).toEqual([]);
  });
  it("getAuditSamplingMethod Failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(throwError(null));
    service1.getAuditSamplingMethod(new Date(), new Date());
    expect(service.samplingMethodResponse).toEqual([]);
  });
  it("getAuditSamplingAdj", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service1.getAuditSamplingAdjListner().subscribe(val => (value = val));
    service1.getAuditSamplingAdj(new Date(), new Date());
    expect(value).toEqual([]);
  });
  it("getAuditSamplingAdj Failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(throwError(null));
    service1.getAuditSamplingAdj(new Date(), new Date());
    expect(service.samplingAdjResponse).toEqual([]);
  });
  it("getAuditSamplingErr", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service1.getAuditSamplingErrListner().subscribe(val => (value = val));
    service1.getAuditSamplingErr(new Date(), new Date());
    expect(value).toEqual([]);
  });
  it("getAuditSamplingErr Failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(throwError( null));
    service1.getAuditSamplingErr(new Date(), new Date());
    expect(service.samplingErrResponse).toEqual([]);
  });
  it("getAuditSamplingBilledAmt", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service1.getAuditSamplingBilledAmtListner().subscribe(val => (value = val));
    service1.getAuditSamplingBilledAmt(new Date(), new Date());
    expect(value).toEqual([]);
  });
  it("getAuditSamplingBilledAmt Failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(throwError(null));
    service1.getAuditSamplingBilledAmt(new Date(), new Date());
    expect(service.auditSamplingBilledAmtResponse).toEqual([]);
  });
  it("getBilledAmtByClaimType", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service1.getBilledAmtByClaimTypeListner().subscribe(val => (value = val));
    service1.getBilledAmtByClaimType(new Date(), new Date());
    expect(value).toEqual([]);
  });
  it("getBilledAmtByClaimType Failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(throwError(null));
    service1.getBilledAmtByClaimType(new Date(), new Date());
    expect(service.auditBilledAmtClaimTypeResponse).toEqual([]);
  });
  it("getAuditSamplingSts", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service1.getAuditSamplingStsListner().subscribe(val => (value = val));
    service1.getAuditSamplingSts(new Date(), new Date());
    expect(value).toEqual([]);
  });
  it("getAuditSamplingSts Failed" , () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(throwError(null));
    service1.getAuditSamplingSts(new Date(), new Date());
    expect(service.samplingStsResponse).toEqual([]);
  });
  it("getAuditSamplingAmt", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service1.getAuditSamplingAmtListner().subscribe(val => (value = val));
    service1.getAuditSamplingAmt(new Date(), new Date());
    expect(value).toEqual([]);
  });
  it("getAuditSamplingAmt Failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(throwError(null));
    service1.getAuditSamplingAmt(new Date(), new Date());
    expect(service.samplingAmtResponse).toEqual([]);
  });
  it("getClaimsParameterList", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "get").and.returnValue(of([]));
    let value;
    service1.getClaimsParameterListListner().subscribe(val => (value = val));
    service1.getClaimsParameterList();
    expect(value).toEqual([]);
  });
  it("getClaimsParameterList Failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "get").and.returnValue(throwError(null));
    service1.getClaimsParameterList();
    expect(service.claimsParameterListResponse).toEqual([]);
  });
  it("getSamplingReport", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "getExcel").and.returnValue(of([]));
    let value;
    service1.getSamplingReportListner().subscribe(val => (value = val));
    service1.getSamplingReport([new Date(), new Date()]);
    expect(value).toEqual([]);
  });
  it("getSamplingReport Failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "getExcel").and.returnValue(throwError(null));
    service1.getSamplingReport([new Date(), new Date()]);
    expect(service.samplingReportResponse).toEqual([]);
  });
  it("getAuditSamplingCategory", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(of([]));
    let value;
    service1.getAuditSamplingCategoryListner().subscribe(val => (value = val));
    service1.getAuditSamplingCategory([new Date(), new Date()]);
    expect(value).toEqual([]);
  });
  it("getAuditSamplingCategory failed", () => {
    const service1: AuditReportDashboardService = TestBed.get(
      AuditReportDashboardService
    );
    spyOn(service, "post").and.returnValue(throwError(null));
    service1.getAuditSamplingCategory([new Date(), new Date()]);
    expect(service.auditSamplingCategoryResponse).toEqual([]);
  });
});
