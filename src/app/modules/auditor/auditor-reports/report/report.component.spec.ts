import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ReportComponent } from "./report.component";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CommonModule } from "@angular/common";
import { AuditBacklogReportComponent } from "./../audit-backlog-report/audit-backlog-report.component";
import { AuditedClaimsReportModule } from "./../../../../modules/audited-claims-report/audited-claims-report.module";
import { AuditRebuttalReportComponent } from "./../audit-rebuttal-report/audit-rebuttal-report.component";
import { AuditReportComponent } from "./../audit-report/audit-report.component";
import { TableModule } from "primeng/table";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";

describe("ReportComponent", () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportComponent,
        AuditRebuttalReportComponent,
        AuditReportComponent,
        AuditBacklogReportComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        TableModule,
        AuditedClaimsReportModule,
        DialogModule,
        MultiSelectModule,
        ComponentsModule,
        CalendarModule,
        DropdownModule,
        CardModule,
        TooltipModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
