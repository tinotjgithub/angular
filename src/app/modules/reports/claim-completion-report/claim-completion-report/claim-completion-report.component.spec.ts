import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimCompletionReportComponent } from './claim-completion-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { DatePipe, CommonModule } from '@angular/common';
import { ReportService } from 'src/app/services/report/report.service';
import { MockReportService } from 'src/app/mocks/mock-services';

describe('ClaimCompletionReportComponent', () => {
  let component: ClaimCompletionReportComponent;
  let fixture: ComponentFixture<ClaimCompletionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimCompletionReportComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        MultiSelectModule,
        TableModule,
        RouterTestingModule,
        CommonModule
      ],
      providers: [
        {provide: BaseHttpService, useClass: MockBaseHttpService},
        {provide: ReportService, useClass: MockReportService},
        MessageService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimCompletionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
