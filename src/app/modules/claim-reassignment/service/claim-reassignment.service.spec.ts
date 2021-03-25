import { TestBed } from "@angular/core/testing";
import { ClaimReassignmentService } from "./claim-reassignment.service";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";
describe("ClaimReassignmentService", () => {
  let http: BaseHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [{ provide: BaseHttpService, useClass: MockBaseHttpService }]
    });
    http = TestBed.get(BaseHttpService);
  });

  describe("it should fetchservices", () => {
    let service: ClaimReassignmentService;
    beforeEach(() => {
      service = TestBed.get(ClaimReassignmentService);
      spyOn<any>(http, "get").and.returnValue(of([]));
      spyOn<any>(http, "post").and.returnValue(of([]));
      spyOn(http, "getExcel").and.returnValue(of([]));
    });

    it("should be created", () => {
      expect(service).toBeTruthy();
    });

    it("listClaims", () => {
      expect(service.listClaims(1)).toBeTruthy();
    });

    it("getAssignFromUsersList", () => {
      expect(service.getAssignFromUsersList(1)).toBeTruthy();
    });

    it("getReassignmentReasonList", () => {
      expect(service.getReassignmentReasonList()).toBeTruthy();
    });

    it("getAssignToUsersList", () => {
      expect(service.getAssignToUsersList(1)).toBeTruthy();
    });

    it("refreshClaims", () => {
      expect(service.refreshClaims(1)).toBeTruthy();
    });

    it("reAssignClaims", () => {
      expect(service.reAssignClaims(1)).toBeTruthy();
    });

    it("getFromRoles", () => {
      expect(service.getFromRoles()).toBeTruthy();
    });
    it("getToRoles", () => {
      expect(service.getToRoles(1)).toBeTruthy();
    });
    it("getAssignFromStatus", () => {
      expect(service.getAssignToStatus(1)).toBeTruthy();
    });
    it("loadUserGroups", () => {
      expect(service.loadUserGroups(1)).toBeTruthy();
    });
    it("getReassignmentReportExcel", () => {
      expect(service.getReassignmentReportExcel(1)).toBeTruthy();
    });
    it("loadClaimStatusCount", () => {
      expect(service.loadClaimStatusCount("test")).toBeTruthy();
    });
  });

  describe("it should fetchservices", () => {
    let service: ClaimReassignmentService;
    beforeEach(() => {
      service = TestBed.get(ClaimReassignmentService);
    });
    it("should get Reassignment report", () => {
      let value = [];
      spyOn<any>(http, "get").and.returnValue(of([]));
      service.getAuditedClaimsReportListner().subscribe(val => (value = val));
      service.getReassignmentReport("test");
      expect(value).toEqual([]);
    });
    it("should handle the error on getting Reassignment report", () => {
      spyOn(http, "get").and.returnValue(throwError(null));
      service.reassignmentResponse = [];
      service.getReassignmentReport("test");
      expect(service.reassignmentResponse).toEqual([]);
    });

    it("should get Reassignment report", () => {
      spyOn<any>(http, "get").and.returnValue(of([]));
      let value = [];
      service.getReassignedByListner().subscribe(val => (value = val));
      service.getReassignedBy();
      expect(value).toEqual([]);
    });
    it("should handle the error on getting Reassignment report", () => {
      spyOn(http, "get").and.returnValue(throwError(null));
      service.reassignmentByResponse = [];
      service.getReassignedBy();
      expect(service.reassignmentByResponse).toEqual([]);
    });
  });
});
