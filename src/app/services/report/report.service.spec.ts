import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from '../base-http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('ReportService', () => {
  let http: BaseHttpService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ],
    providers: [
      ReportService,
      { provide: BaseHttpService, useClass: MockBaseHttpService },
      MessageService,
      AuthenticationService
    ]
  }));

  beforeEach(() => {
    http = TestBed.get(BaseHttpService);
  });

  it('should be created', () => {
    const service: ReportService = TestBed.get(ReportService);
    spyOn(http, 'get').and.returnValue(of({}));
    expect(service).toBeTruthy();
  });

  it('should set report id - no existing report', () => {
    const service: ReportService = TestBed.get(ReportService);
    let value;
    service.myReportIds = [2];
    service.getCurrentReportFilterListener().subscribe(val => value = val);
    service.setReport(1);
    expect(value).toEqual({});
  });

  it('should set report id - already report exists', () => {
    const service: ReportService = TestBed.get(ReportService);
    service.myReportIds = [1];
    service.myReportsList = [{reportId: 2, reportFilter: 'Test'}, {reportId: 1, reportFilter: 'Test'}];
    let value;
    service.getCurrentReportFilterListener().subscribe(val => value = val);
    service.setReport(1);
    expect(value).toBe('Test');
  });

  it('should get user reports', () => {
    const service: ReportService = TestBed.get(ReportService);
    spyOn(http, 'get').and.returnValue(of([{reportId: 1, reportFilter: 'Test'}]));
    let value;
    service.myReportIdListener().subscribe(val => value = val);
    service.getUserReports();
    expect(value).toEqual([1]);
    expect(service.myReportsList.length).toBe(1);
  });

  it('save report - without myReportList', () => {
    const service: ReportService = TestBed.get(ReportService);
    service.myReportIds = [];
    service.myReportsList = undefined;
    service.currentReportId = 1;
    try {
      service.saveReport('Test');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('save report - with myReportList', () => {
    const service: ReportService = TestBed.get(ReportService);
    service.myReportIds = [];
    service.myReportsList = [
      {
        reportId: 1,
        reportFilter: "Test",
      },
      {
        reportId: 2,
        reportFilter: "Test",
      },
    ];
    service.currentReportId = 1;
    service.saveReport('Test');
    expect(service.myReportsList.length).toBe(2);
  });

  it('save report - with myReportList & without current report id', () => {
    const service: ReportService = TestBed.get(ReportService);
    service.myReportIds = [];
    service.myReportsList = [
      {
        reportId: 2,
        reportFilter: "Test",
      },
    ];
    service.currentReportId = 1;
    service.saveReport("Test");
    expect(service.myReportsList.length).toBe(2);
  });

  it('should get the user report - success', () => {
    const service: ReportService = TestBed.get(ReportService);
    spyOn(http, 'post').and.returnValue(of([]));
    let value;
    service.getMyUserReportListner().subscribe(val => value = val);
    service.getMyUserReport({});
    expect(value).toEqual([]);
  });

  it('should get the user report - success with message', () => {
    const service: ReportService = TestBed.get(ReportService);
    spyOn(http, 'post').and.returnValue(of({message: 'Test'}));
    let value;
    service.getMyUserReportListner().subscribe(val => value = val);
    service.getMyUserReport({});
    expect(value).toEqual({message: 'Test'});
  });

  it('should handle error on user report', () => {
    const service: ReportService = TestBed.get(ReportService);
    spyOn(http, 'post').and.returnValue(throwError('Tesr'));
    service.getMyUserReport({});
    expect(service.myUsersResponse).toEqual([]);
  });

  it('should get the data and report for pended and routed', () => {
    const service: ReportService = TestBed.get(ReportService);
    spyOn(http, 'post').and.returnValue(of(true));
    expect(service.getClaimsStatusByPendeOrRoutedReport({}, 'Pended')).toBeTruthy();
    expect(service.getClaimsStatusByPendeOrRoutedData({}, 'Pended')).toBeTruthy();
    expect(service.getClaimsStatusByPendeOrRoutedReport({}, 'Routed')).toBeTruthy();
    expect(service.getClaimsStatusByPendeOrRoutedData({}, 'Routed')).toBeTruthy();
  });

  it('should get the reports for Claims Lead', () => {
    const service: ReportService = TestBed.get(ReportService);
    const authService: AuthenticationService = TestBed.get(AuthenticationService);
    spyOn(http, 'post').and.returnValue(of(true));
    localStorage.setItem('roleId', 'Claims Lead');
    authService.roleId = 'Claims Lead';
    expect(service.getUserListReports({})).toBeTruthy();
    expect(service.getUserListReportData({})).toBeTruthy();
    expect(service.generateClaimQuality({})).toBeTruthy();
    expect(service.getClaimQualityData({})).toBeTruthy();
    localStorage.clear();
  });

  it('should get the reports for Administrator', () => {
    const service: ReportService = TestBed.get(ReportService);
    const authService: AuthenticationService = TestBed.get(AuthenticationService);
    spyOn(http, 'post').and.returnValue(of(true));
    localStorage.setItem('roleId', 'Administrator');
    authService.roleId = 'Administrator';
    expect(service.getUserListReports({})).toBeTruthy();
    expect(service.getUserListReportData({})).toBeTruthy();
    expect(service.generateClaimQuality({})).toBeTruthy();
    expect(service.getClaimQualityData({})).toBeTruthy();
    expect(service.getClaimAgeRange()).toBeTruthy();
    localStorage.clear();
  });

  it('should get the reports for Manager', () => {
    const service: ReportService = TestBed.get(ReportService);
    const authService: AuthenticationService = TestBed.get(AuthenticationService);
    spyOn(http, 'post').and.returnValue(of(true));
    spyOn(http, 'get').and.returnValue(of(true));
    localStorage.setItem('roleId', 'Manager');
    authService.roleId = 'Manager';
    expect(service.getUserListReports({})).toBeTruthy();
    expect(service.getManagerUserGroups()).toBeTruthy();
    localStorage.clear();
  });
});
