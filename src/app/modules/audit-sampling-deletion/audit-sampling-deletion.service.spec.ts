import { TestBed, ComponentFixture } from "@angular/core/testing";

import { AuditSamplingDeletionService } from "./audit-sampling-deletion.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseHttpService } from "./../../services/base-http.service";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
import { APP_INITIALIZER } from '@angular/core';
describe("AuditSamplingDeletionService", () => {
  let http: BaseHttpService;
  let service: AuditSamplingDeletionService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        AuditSamplingDeletionService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService
      ]
    })
  );

  beforeEach(() => {
    http = TestBed.get(BaseHttpService);
    service = TestBed.get(AuditSamplingDeletionService);
  });

  describe("fetch user role data", () => {
    it("should get user roles", () => {
      spyOn(service, "get").and.returnValue(of([]));
      let value = [];
      service.getUserRolesListner().subscribe(val => (value = val));
      service.getUserRoles();
      expect(value).toEqual([]);
    });
    it("should handle the error on getting user roles", () => {
      service.deletedByRolesResponse = [];
      spyOn(service, "get").and.returnValue(throwError(404));
      service.getUserRoles();
      expect(service.deletedByRolesResponse).toEqual([]);
    });
  });

  describe("should get deleted by names data", () => {
    it("should get user names", () => {
      spyOn(service, "post").and.returnValue(of([]));
      let value = [];
      service.getDeletedByNamesListner().subscribe(val => (value = val));
      service.getDeletedByNames("test");
      expect(value).toEqual([]);
    });
    it("should handle the error on getting user roles", () => {
      service.deletedByNamesResponse = [];
      spyOn(service, "post").and.returnValue(throwError(404));
      service.getDeletedByNames("test");
      expect(service.deletedByNamesResponse).toEqual([]);
    });
  });

  describe("should get deleted by names data", () => {
    it("should get user names", () => {
      spyOn(service, "post").and.returnValue(of([]));
      let value = [];
      service.samplingDeletionReportListner().subscribe(val => (value = val));
      service.samplingDeletionReport("test");
      expect(value).toEqual([]);
    });
    it("should get user names", () => {
      spyOn(service, "post").and.returnValue(of({message: 'test'}));
      let value = null;
      service.samplingDeletionReportListner().subscribe(val => (value = val));
      service.samplingDeletionReport("test")
      expect(value).toBeTruthy();
    });
    it("should handle the error on getting user roles", () => {
      service.samplingDeletionReportResponse = [];
      spyOn(service, "post").and.returnValue(throwError(404));
      service.samplingDeletionReport("test");
      expect(service.samplingDeletionReportResponse).toEqual([]);
    });
  });

  describe("Should get report", () => {
    it("export to excel", () => {
        spyOn(service, "getExcel").and.returnValue(of([]));
        expect(service.samplingDeletionReportExcel('test')).toBeTruthy();
      });
  });
});
