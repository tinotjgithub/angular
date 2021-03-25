import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromtUserListComponent } from './promt-user-list.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ReportTableComponent } from '../report-table/report-table.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReportService } from 'src/app/services/report/report.service';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('PromtUserListComponent', () => {
  let component: PromtUserListComponent;
  let fixture: ComponentFixture<PromtUserListComponent>;
  let service: ReportService;
  let authService: AuthenticationService;
  let userManagementService: UserManagementService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PromtUserListComponent, ReportTableComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        HttpClientTestingModule,
        TableModule,
        RouterTestingModule,
        TooltipModule,
        MultiSelectModule,
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        ReportService,
        AuthenticationService,
        MessageService,
        DatePipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('roleId', 'Claims Lead');
    fixture = TestBed.createComponent(PromtUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(ReportService);
    authService = fixture.debugElement.injector.get(AuthenticationService);
    userManagementService = fixture.debugElement.injector.get(UserManagementService);
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Reset toDate when its less than fromDate', () => {
    const form = component.userListForm;
    const today = new Date();
    const previousDay = new Date(new Date().setDate(today.getDate() - 1));
    form.patchValue({
      activeFrom: today,
      activeTo: previousDay
    });
    component.checkToDate();
    expect(component.getActiveTo.value).toBeNull();
  });

  it('should get report data - Success', () => {
    const data = [
      {
        slNo: 0,
        firstName: "Pallavi",
        lastName: "Babu",
        userName: "pallavibabu@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-03-24",
        deactivateDate: "2099-12-31",
        ldapOrLocal: "LDAP User",
        userGroup: "Missing_Member_Team",
        managerName: "Deepa John",
        leadName: "Tino Jose",
        proficiency: "Beginner"
      }
    ];
    spyOn(service, 'getUserListReportData').and.returnValue(of(data));
    component.submit();
    expect(component.reportData.length).toBe(1);
  });

  it('should get report data - Fail', () => {
    spyOn(service, 'getUserListReportData').and.returnValue(throwError({status: 400}));
    component.submit();
    expect(component.reportData.length).toBe(0);
  });

  it('should get report data - No Res', () => {
    spyOn(service, 'getUserListReportData').and.returnValue(of(null));
    component.submit();
    expect(component.reportData.length).toBe(0);
  });

  it('should get report data - Invalid Form', () => {
    const form = component.userListForm;
    const today = new Date();
    const previousDay = new Date(new Date().setDate(today.getDate() - 1));
    form.patchValue({
      activeFrom: today,
      activeTo: previousDay,
      status: null
    });
    component.submit();
    expect(component.reportData).toBeUndefined();
  });

  it('should download excel', () => {
    spyOn(service, 'getUserListReports').and.returnValue(of({
      body: 'test'
    }));
    component.downloadExcel();
    expect(component).toBeTruthy();
  });

  it('Status conditions', () => {
    spyOn(service, 'getUserListReportData').and.returnValue(throwError({status: 400}));
    spyOn(service, 'getUserListReports').and.returnValue(of());
    const form = component.userListForm;
    const today = new Date();
    const previousDay = new Date(new Date().setDate(today.getDate() - 1));
    form.patchValue({
      activeFrom: today,
      activeTo: previousDay,
      status: 'All'
    });
    component.downloadExcel();
    component.submit();
    form.patchValue({
      status: 'Inactive'
    });
    component.downloadExcel();
    component.submit();
    component.getFormattedDate(today);
    component.role = 'Administrator';
    form.patchValue({
      role: {
        id: 2,
        roleName: 'Claims Lead'
      },
      name: {id: 1, firstName: 'Test', lastName: 'Test'}
    });
    component.ngOnInit();
    component.downloadExcel();
    component.submit();
    component.getFileName(today.toISOString());
    expect(component.reportLoaded).toBeFalsy();
  });

  it('Admin User List', () => {
    component.role = 'Administrator';
    let fileName;
    spyOn(userManagementService, 'getUserNameList').and.returnValue(of({users: [{id: 1, firstName: 'Test', lastName: 'Test'}]}));
    const data = {
      examinerCount: 1,
      leadCount: 1,
      userListDtoList: [
        {
          slNo: 0,
          firstName: "Pallavi",
          lastName: "Babu",
          userName: "pallavibabu@ust-global.com",
          role: "Claims Examiner",
          status: "Active",
          activeDate: "2020-03-24",
          deactivateDate: "2099-12-31",
          ldapOrLocal: "LDAP User",
          userGroup: "Missing_Member_Team",
          managerName: "Deepa John",
          leadName: "Tino Jose",
          proficiency: "Beginner",
        },
      ],
    };
    spyOn(service, 'getUserListReportData').and.returnValue(of(data));
    authService.roleResponse = [ {
      id: 2,
      roleName: 'Claims Lead'
    }];
    // fixture.detectChanges();
    component.ngOnInit();
    const form = component.userListForm;
    form.patchValue({
      role: {
        id: 2,
        roleName: 'Claims Lead'
      },
      name: [{id: 1, firstName: 'Test', lastName: 'Test'}]
    });
    form.updateValueAndValidity();
    component.submit();
    component.downloadExcel();
    fileName = component.getFileName('test');
    form.patchValue({
      role: {
        id: 2,
        roleName: 'Auditor'
      }
    });
    form.updateValueAndValidity();
    fileName = component.getFileName('test');
    form.patchValue({
      role: {
        id: 2,
        roleName: 'All'
      }
    });
    form.updateValueAndValidity();
    fileName = component.getFileName('test');
    form.patchValue({
      role: ''
    });
    form.updateValueAndValidity();
    component.submit();
    component.downloadExcel();
    expect(component.role).toBe('Administrator');
  });

  it('update columns based on role', () => {
    spyOn(userManagementService, 'getUserNameList').and.returnValue(of(null));
    component.getNameList('lead');
    expect(component.nameList.length === 0).toBeTruthy();
    component.updateColumns(null);
    component.updateColumns({roleName: 'Claims Lead'});
    component.updateColumns({roleName: 'All'});
    component.updateColumns({roleName: 'Claims Examiner'});
    component.updateColumns({roleName: 'Claims Lead'}, ['test']);
    component.updateColumns({roleName: 'Claims Examiner'}, ['test']);
    component.updateColumns({roleName: 'Auditor'}, ['test']);
    expect(component.columns.length > 7).toBeTruthy();
  });
});
