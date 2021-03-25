import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusReportComponent } from './status-report.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { TooltipModule } from 'primeng/tooltip';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MessageService } from 'primeng/api';
import { ReportTableComponent } from '../report-table/report-table.component';
import { ReportService } from 'src/app/services/report/report.service';
import { of, throwError } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('StatusReportComponent', () => {
  let component: StatusReportComponent;
  let fixture: ComponentFixture<StatusReportComponent>;
  let service: ReportService;
  const defaultFrom = new Date("01-01-1970");

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusReportComponent, ReportTableComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        HttpClientTestingModule,
        TableModule,
        RouterTestingModule,
        TooltipModule,
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        DatePipe,
        ReportService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(ReportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load routed claims and get claims age range', () => {
    spyOn(service, 'getClaimAgeRange').and.returnValue(of([]));
    component.reportType = 'Pended';
    component.ngOnInit();
    expect(component.claimAges).toEqual([]);
  });

  it('should handle error on getting claims age', () => {
    spyOn(service, 'getClaimAgeRange').and.returnValue(throwError({status: 400}));
    try {
      component.getClaimAgeRange();
    } catch (error) {
      console.error(error);
    }
    expect(component.claimAges).toEqual([]);
  });

  it("should validate the 'toDate' and reset when 'toDate' is less than 'fromDate'", () => {
    component.checkToDate();
    component.userListForm.patchValue({
      activeFrom: new Date('12/12/2012'),
      activeTo: new Date('11/12/2012')
    });
    component.checkToDate();
    expect(component.getActiveTo.value).toBeNull();
  });

  describe('should fetch the report data', () => {
    it('invalid form', () => {
      component.userListForm.reset();
      component.submit();
      expect(component.reportLoaded).toBeFalsy();
    });

    it('load report data', () => {
      spyOn(service, 'getClaimsStatusByPendeOrRoutedData').and.returnValue(of([]));
      component.userListForm.patchValue({
        activeFrom: defaultFrom,
        activeTo: new Date()
      });
      component.submit();
      expect(component.reportLoaded).toBeTruthy();
    });

    it('load report data', () => {
      spyOn(service, 'getClaimsStatusByPendeOrRoutedData').and.returnValue(of(null));
      component.userListForm.patchValue({
        activeFrom: defaultFrom,
        activeTo: new Date()
      });
      component.submit();
      expect(component.reportLoaded).toBeTruthy();
      expect(component.reportData).toEqual([]);
    });

    it('handle error', () => {
      spyOn(service, 'getClaimsStatusByPendeOrRoutedData').and.returnValue(throwError({status: 400}));
      component.userListForm.patchValue({
        activeFrom: defaultFrom,
        activeTo: new Date()
      });
      try {
        component.submit();
      } catch (error) {
        console.error(error);
      }
      expect(component.reportLoaded).toBeFalsy();
    });
  });

  it('should download report', () => {
    spyOn(service, 'getClaimsStatusByPendeOrRoutedReport').and.returnValue(of({body: 'Test'}));
    component.userListForm.patchValue({
      activeFrom: defaultFrom,
      activeTo: new Date()
    });
    component.downloadExcel();
    expect(component).toBeTruthy();
  });

  it('should clear the report data', () => {
    component.clearData();
    component.getFormattedDate(new Date());
    expect(component.reportLoaded).toBeFalsy();
  });
});
