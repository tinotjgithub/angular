/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { LeadScoreCardComponent } from "./lead-score-card.component";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleChartsModule } from "angular-google-charts";
import { CommonModule, DatePipe } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { mockReport } from "src/app/mocks/dashboard-mock-data";
import { MultiSelectModule } from "primeng/multiselect";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { LeadClaimsCountByAgeVolComponent } from "../lead-claims-count-by-age-vol/lead-claims-count-by-age-vol.component";
import { LeadClaimsCountByStatusQueueComponent } from "../lead-claims-count-by-status-queue/lead-claims-count-by-status-queue.component";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
// tslint:disable-next-line: max-line-length
import { ManagerFinancialScoreComponent } from "./../../../manager/manager-dash-board/manager-financial-score/manager-financial-score.component";
// tslint:disable-next-line: max-line-length
import { ManagerProceduralScoreComponent } from "./../../../manager/manager-dash-board/manager-procedural-score/manager-procedural-score.component";
// tslint:disable-next-line: max-line-length
import { ManagerClaimsProcessedVsAuditedComponent } from "./../../../manager/manager-dash-board/manager-claims-processed-vs-audited/manager-claims-processed-vs-audited.component";
// tslint:disable-next-line: max-line-length
import { AuditReportDashboardModule } from "./../../../audit-report-dashboard/audit-report-dashboard.module";
import { AuditPassedVsFailedExaminerComponent } from "./../audit-passed-vs-failed-examiner/audit-passed-vs-failed-examiner.component";
import { LeadTeamProductivityComponent } from "./../lead-team-productivity/lead-team-productivity.component";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { ReportsModule } from "src/app/modules/reports/reports.module";
import { ManagerModule } from "src/app/modules/manager/manager.module";
import { LandingPageModule } from "./../../../manager/landing-page/landing-page.module";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { of, throwError, Observable } from "rxjs";

const mockBarDetails = [
  {
    auditorName: "Brian Blaze",
    type: "Audit Failed",
    value: 9
  }
];
const mockBar = [
  {
    auditorName: "Brian Blaze",
    assignedClaimsCount: 13,
    passedAuditCount: 16,
    failedAuditCount: 9,
    auditorId: 107
  },
  {
    auditorName: "Dory Wilson",
    assignedClaimsCount: 0,
    passedAuditCount: 0,
    failedAuditCount: 0,
    auditorId: 108
  }
];

class MockAuditorService extends AuditorService {
  auditSummaryByAuditorDetails(): Observable<any[]> {
    return of(mockBarDetails);
  }
  getAuditorCounts(): Observable<any[]> {
    return of(mockBar);
  }
  auditSummaryByAuditorExcel() {
    return of(mockReport);
  }
}

describe("LeadScoreCardComponent", () => {
  let component: LeadScoreCardComponent;
  let fixture: ComponentFixture<LeadScoreCardComponent>;
  let service: AuditorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LeadScoreCardComponent,
        LeadClaimsCountByAgeVolComponent,
        LeadClaimsCountByStatusQueueComponent,
        AuditPassedVsFailedExaminerComponent,
        LeadTeamProductivityComponent
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        GoogleChartsModule,
        LandingPageModule,
        ComponentsModule,
        AuditReportDashboardModule,
        CommonModule,
        CalendarModule,
        DialogModule,
        TooltipModule,
        TableModule,
        MultiSelectModule,
        DropdownModule,
        HttpClientTestingModule,
        ReportsModule,
        ManagerModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        { provide: AuditorService, useClass: MockAuditorService },
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(AuditorService);
  });

  fit("should create", () => {
    expect(component).toBeTruthy();
  });

  fit("get auditor counts", () => {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(prevDate.getMonth() - 3)
    );
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    spyOn(service, "getAuditorCounts").and.returnValue(of(""));
    spyOn(component, "processAuditorGraph");
    component.getAuditorCounts();
    expect(component.auditorCountData).toEqual([
      ["NO DATA", 0, "0", 0, "0", 0, "0"]
    ]);
  });

  fit("get auditor counts - value", () => {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(prevDate.getMonth() - 3)
    );
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    spyOn(service, "getAuditorCounts").and.returnValue(
      of({
        test: 1,
        test2: 2
      })
    );
    spyOn(component, "processAuditorGraph");
    component.getAuditorCounts();
    expect(component.loaded).toBeTruthy();
  });

  fit("get auditor counts - value exceed 4", () => {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(prevDate.getMonth() - 3)
    );
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    spyOn(service, "getAuditorCounts").and.returnValue(
      of({
        test: 1,
        test2: 2,
        test3: 1,
        test4: 2,
        test5: 1
      })
    );
    spyOn(component, "processAuditorGraph");
    component.getAuditorCounts();
    expect(component.loaded).toBeTruthy();
  });

  fit("should map when response length is greater tha zero", () => {
    let auditor = [];
    const res = [
      { auditorName: "Dhanya", passedCount: 5, failedCount: 4 },
      { auditorName: "Brian", passedCount: 2, failedCount: 5 }
    ];
    auditor = component.processAuditorGraph(res);
    expect(auditor.length).toBeGreaterThan(0);
  });

  fit("should not map when response length is not greater tha zero", () => {
    let auditor = [];
    const res = [];
    auditor = component.processAuditorGraph(res);
    expect(auditor.length).not.toBeGreaterThan(0);
  });

  fit("get auditor counts - error", () => {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(prevDate.getMonth() - 3)
    );
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    spyOn(service, "getAuditorCounts").and.returnValue(throwError(404));
    component.getAuditorCounts();
    expect(component.loaded).toBeTruthy();
  });

  fit("should fetch status-date data on OK button click", () => {
    const locSpy = spyOn(component, "getAuditorCounts");
    fixture.detectChanges();
    component.onSubmitStatus();
    expect(locSpy).toHaveBeenCalled();
  });

  it("should calculate difference when from date is present", () => {
    const today = new Date();
    component.isValid = false;
    const todaysDate = new Date(
      component.datePipe.transform(today, "yyyy-MM-dd")
    );
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    const locSpy = spyOn(component, "dateDifference");
    fixture.detectChanges();
    component.validateDates();
    expect(locSpy).toHaveBeenCalled();
  });
  fit("should set validilty to true when to date is not present", () => {
    const today = new Date();
    component.isValid = false;
    const todaysDate = new Date(
      component.datePipe.transform(today, "yyyy-MM-dd")
    );
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    spyOn(component, "dateDifference");
    fixture.detectChanges();
    component.validateDates();
    expect(component.isValid).toBeTruthy();
  });
  fit("should set dates as invalid when diffrence is more than 3 months", () => {
    const today = new Date();
    component.isValid = false;
    const todaysDate = new Date(
      component.datePipe.transform(today, "yyyy-MM-dd")
    );
    const sevenDate = new Date();
    sevenDate.setDate(sevenDate.getDate() - 350);
    const dat = new Date(component.datePipe.transform(sevenDate, "yyyy-MM-dd"));
    const defaultDateRange = [];
    defaultDateRange.push(dat);
    defaultDateRange.push(todaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    spyOn(component, "dateDifference");
    fixture.detectChanges();
    component.validateDates();
    expect(component.isValid).toBeFalsy();
  });
  fit("should set dates as valid when diffrence is less than 3 months", () => {
    const today = new Date();
    component.isValid = false;
    const todaysDate = new Date(
      component.datePipe.transform(today, "yyyy-MM-dd")
    );
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    spyOn(component, "dateDifference").and.returnValue(0);
    fixture.detectChanges();
    component.validateDates();
    expect(component.isValid).toBeTruthy();
  });
  fit("should calculate difference between two dates", () => {
    const today = new Date();
    component.isValid = false;
    const todaysDate = new Date(
      component.datePipe.transform(today, "yyyy-MM-dd")
    );
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    fixture.detectChanges();
    const diff = component.dateDifference(defaultDateRange);
    expect(diff).toBe(0);
  });

  it("should call service when bar is selected", () => {
    const bar = [];
    component.auditorCountData = [
      ["Brian Blaze", 16, "16", 9, "9", 13, "13"],
      ["Dhanya Saraswathi", 16, "16", 9, "9", 13, "13"]
    ];
    component.auditorColumnNames = [
      "",
      "Audit Success",
      { role: "annotation" },
      "Audit Failed",
      { role: "annotation" },
      "Assigned",
      { role: "annotation" }
    ];
    bar.push({ row: 0, column: 5 });
    const spy1 = spyOn(component, "getBarDetails").and.callThrough();
    const spy2 = spyOn(
      service,
      "auditSummaryByAuditorDetails"
    ).and.callThrough();
    fixture.detectChanges();
    component.selectBar(bar);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it("should call excel service", () => {
    component.auditorCountData = [
      ["Brian Blaze", 16, "16", 9, "9", 13, "13"],
      ["Neethu", 16, "16", 9, "9", 13, "13"]
    ];
    component.auditorColumnNames = [
      "",
      "Audit Success",
      { role: "annotation" },
      "Audit Failed",
      { role: "annotation" },
      "Assigned",
      { role: "annotation" }
    ];
    const today = new Date();
    const todaysDate = new Date(
      component.datePipe.transform(today, "yyyy-MM-dd")
    );
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    component.assignedDates.get("dateRange").setValue(defaultDateRange);
    component.barDetails = {
      auditorName: "Brian Blaze",
      type: "Audit Failed",
      value: 9
    };
    const servSpy = spyOn(service, "auditSummaryByAuditorExcel")
      .and.returnValue(mockReport)
      .and.callThrough();

    fixture.detectChanges();
    component.downloadExcel();
    expect(servSpy).toHaveBeenCalled();

    const spyObj = document.createElement("a");
    const blob = new Blob([mockReport.body], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = URL.createObjectURL(blob);
    const dateString = component.datePipe.transform(today, "MMddyyyy");
    spyObj.setAttribute("href", url);
    spyObj.setAttribute("download", "Audit Summary By Auditor-" + dateString);
    document.body.appendChild(spyObj);
    spyOn(document, "createElement").and.returnValue(spyObj);
    const syy = spyOn(spyObj, "click");
    fixture.detectChanges();
    component.downloadExcel();
    // tslint:disable-next-line: deprecation
    expect(document.createElement).toHaveBeenCalledTimes(1);
    // tslint:disable-next-line: deprecation
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(syy).toHaveBeenCalled();
    expect(spyObj.download).toBe("Audit Summary By Auditor-" + dateString);
  });
  it("should not download file", () => {
    component.barDetails = {
      auditorName: "Brian Blaze",
      type: "Audit Failed",
      value: 9
    };
    const today = new Date();
    const dateString = component.datePipe.transform(today, "MMddyyyy");
    const spyObj = document.createElement("a");
    document.body.appendChild(spyObj);
    const servSpy = spyOn(service, "auditSummaryByAuditorExcel")
      .and.returnValue(null)
      .and.callThrough();
    component.downloadExcel();
    const syy = spyOn(spyObj, "click");
    expect(syy).not.toHaveBeenCalled();
    expect(spyObj.download).not.toBe("Audit Summary By Auditor-" + dateString);
  });
});
