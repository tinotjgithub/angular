import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsExaminerQualityComponent } from './claims-examiner-quality.component';
import { ReportTableComponent } from '../report-table/report-table.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from 'src/app/services/report/report.service';
import { of, throwError } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('ClaimsExaminerQualityComponent', () => {
  let component: ClaimsExaminerQualityComponent;
  let fixture: ComponentFixture<ClaimsExaminerQualityComponent>;
  let service: ReportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsExaminerQualityComponent, ReportTableComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        HttpClientTestingModule,
        TableModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        ReportService,
        MessageService,
        DatePipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsExaminerQualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(ReportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get report data - success', () => {
    spyOn(service, 'getClaimQualityData').and.returnValue(of([]));
    component.submit();
    expect(component.reportLoaded).toBeTruthy();
  });

  it('should get report data - success no response', () => {
    spyOn(service, 'getClaimQualityData').and.returnValue(of(null));
    component.submit();
    expect(component.reportLoaded).toBeTruthy();
  });

  it('should get report data - fail', () => {
    spyOn(service, 'getClaimQualityData').and.returnValue(throwError({status: 400}));
    component.submit();
    expect(component.reportLoaded).toBeFalsy();
  });

  it('should get report data - fail invalid form', () => {
    const form = component.usersForm;
    const today = new Date();
    const previousDay = new Date(new Date().setDate(today.getDate() - 1));
    form.patchValue({
      fromDate: today,
      toDate: previousDay
    });
    component.submit();
    expect(component.reportLoaded).toBeUndefined();
  });

  it('should download excel', () => {
    spyOn(service, 'generateClaimQuality').and.returnValue(of({body: 'Test'}));
    component.downloadReport();
    expect(component).toBeTruthy();
  });

  it('functions coverage', () => {
    const today = new Date();
    const previousDay = new Date(new Date().setDate(today.getDate() - 1));
    component.setFromDate(today);
    component.setToDate(previousDay);
    component.clearData();
    expect(component.getFormControl('fromDate').value).toBe(today);
    expect(component.reportLoaded).toBeFalsy();
  });
});
