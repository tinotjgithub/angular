import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LeadReportComponent } from "./lead-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { TableModule } from "primeng/table";
import { MultiSelectModule } from "primeng/multiselect";
import { SharedModule } from "primeng/components/common/shared";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { MessageService } from "primeng/api";
import { MyUsersComponent } from "src/app/modules/manager/reports/my-users/my-users.component";
import { ClaimsExaminerQualityComponent } from "../../claims-examiner-quality/claims-examiner-quality.component";
// tslint:disable: max-line-length
import { ClaimReassignmentReportComponent } from "src/app/modules/claim-reassignment/components/claim-reassignment-report/claim-reassignment-report.component";
import { AuditSamplingDeletionReportComponent } from "src/app/modules/audit-sampling-deletion/audit-sampling-deletion-report/audit-sampling-deletion-report.component";
import { ReportTableComponent } from "../../report-table/report-table.component";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { ProgressSpinner } from "primeng/progressspinner";
import { PromtUserListComponent } from '../../promt-user-list/promt-user-list.component';
import { StatusReportComponent } from '../../status-report/status-report.component';
import { ClaimCompletionReportComponent } from '../../claim-completion-report/claim-completion-report/claim-completion-report.component';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
import { ReportService } from 'src/app/services/report/report.service';
import { MockReportService } from 'src/app/mocks/mock-services';

describe("LeadReportComponent", () => {
  let component: LeadReportComponent;
  let fixture: ComponentFixture<LeadReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LeadReportComponent,
        PromtUserListComponent,
        StatusReportComponent,
        ClaimsExaminerQualityComponent,
        ClaimReassignmentReportComponent,
        AuditSamplingDeletionReportComponent,
        ReportTableComponent,
        LoaderComponent,
        ProgressSpinner,
        ClaimCompletionReportComponent    
      ],
      imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        CalendarModule,
        TableModule,
        MultiSelectModule,
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        {provide: ReportService, useClass: MockReportService},
        MessageService,
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("scroll into view", () => {
    const element = document.createElement('div');
    const spi = spyOn(element, 'scrollIntoView');
    spyOn(document, 'getElementById').and.returnValue(element);
    component.scrollItemToView('test');
    expect(spi).toHaveBeenCalled();
  });
});
