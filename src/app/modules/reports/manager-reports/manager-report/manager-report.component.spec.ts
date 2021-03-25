import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ManagerReportComponent } from "./manager-report.component";
import { MyUsersComponent } from "src/app/modules/manager/reports/my-users/my-users.component";
import { ClaimsExaminerQualityComponent } from "../../claims-examiner-quality/claims-examiner-quality.component";
// tslint:disable-next-line: max-line-length
import { ClaimReassignmentReportComponent } from "src/app/modules/claim-reassignment/components/claim-reassignment-report/claim-reassignment-report.component";
// tslint:disable-next-line: max-line-length
import { AuditSamplingDeletionReportComponent } from "src/app/modules/audit-sampling-deletion/audit-sampling-deletion-report/audit-sampling-deletion-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { TableModule } from "primeng/table";
import { ReportTableComponent } from "../../report-table/report-table.component";
import { MultiSelectModule } from "primeng/multiselect";
import { SharedModule } from "primeng/components/common/shared";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { ProgressSpinner } from "primeng/progressspinner";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "primeng/api";
import { ClaimCompletionReportComponent } from '../../claim-completion-report/claim-completion-report/claim-completion-report.component';
import { MockReportService } from 'src/app/mocks/mock-services';
import { ReportService } from 'src/app/services/report/report.service';

describe("ManagerReportComponent", () => {
  let component: ManagerReportComponent;
  let fixture: ComponentFixture<ManagerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManagerReportComponent,
        MyUsersComponent,
        ClaimsExaminerQualityComponent,
        ClaimReassignmentReportComponent,
        AuditSamplingDeletionReportComponent,
        ClaimCompletionReportComponent,
        ReportTableComponent,
        LoaderComponent,
        ProgressSpinner
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
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        {provide: ReportService, useClass: MockReportService},
        MessageService,
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
