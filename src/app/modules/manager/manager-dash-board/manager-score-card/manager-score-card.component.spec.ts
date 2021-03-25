// import { async, ComponentFixture, TestBed } from "@angular/core/testing";
// import { ManagerScoreCardComponent } from "./manager-score-card.component";
// // tslint:disable-next-line: max-line-length
// import { ManagerClaimsCountByStatusComponent } from "../manager-claims-count-by-status-queue/manager-claims-count-by-status-queue.component";
// // tslint:disable-next-line: max-line-length
// import { ClaimsExaminerCountByLeadComponent } from "../manager-claims-examiner-count-by-lead/manager-claims-examiner-count-by-lead.component";
// import { ClaimsCountByAgeComponent } from "../manager-claims-count-by-age-vol/manager-claims-count-by-age-vol.component";
// import { CommonModule, DatePipe } from "@angular/common";
// import { GoogleChartsModule } from "angular-google-charts";
// import { mockReport } from "src/app/mocks/dashboard-mock-data";
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { DialogModule } from "primeng/dialog";
// import { CalendarModule } from "primeng/calendar";
// import { ButtonModule } from "primeng/button";
// import { TooltipModule } from "primeng/tooltip";
// import { DropdownModule } from "primeng/dropdown";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { BaseHttpService } from "src/app/services/base-http.service";
// import { MessageService } from "primeng/api";
// import { MultiSelectModule } from "primeng/multiselect";
// import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
// import { ManagerFinancialScoreComponent } from "./../manager-financial-score/manager-financial-score.component";
// import { ManagerProceduralScoreComponent } from "./../manager-procedural-score/manager-procedural-score.component";
// // tslint:disable-next-line: max-line-length
// import { ManagerClaimsProcessedVsAuditedComponent } from "./../manager-claims-processed-vs-audited/manager-claims-processed-vs-audited.component";
// import { ManagerAuditScoreComponent } from "./../manager-audit-score/manager-audit-score.component";
// import { ManagerTeamProductivityComponent } from "./../manager-team-productivity/manager-team-productivity.component";
// // tslint:disable-next-line: max-line-length
// import { AuditReportDashboardModule } from "./../../../audit-report-dashboard/audit-report-dashboard.module";
// import { RouterModule } from "@angular/router";
// import { AuditorService } from "src/app/services/auditor/auditor.service";
// import { of, throwError, Observable } from "rxjs";
// import { ReportsModule } from "src/app/modules/reports/reports.module";
// import { LowPerformingExaminersComponent } from "../low-performing-examiners/low-performing-examiners.component";
// import { HighPerformingExaminersComponent } from "../high-performing-examiners/high-performing-examiners.component";
// import { LandingPageModule } from "./../../../manager/landing-page/landing-page.module";
// import { ComponentsModule } from "src/app/shared/components/components.module";

// const mockBarDetails = [
//   {
//     auditorName: "Brian Blaze",
//     type: "Audit Failed",
//     value: 9
//   }
// ];
// const mockBar = [
//   {
//     auditorName: "Brian Blaze",
//     assignedClaimsCount: 13,
//     passedAuditCount: 16,
//     failedAuditCount: 9,
//     auditorId: 107
//   },
//   {
//     auditorName: "Dory Wilson",
//     assignedClaimsCount: 0,
//     passedAuditCount: 0,
//     failedAuditCount: 0,
//     auditorId: 108
//   }
// ];

// class MockAuditorService extends AuditorService {
//   auditSummaryByAuditorDetails(): Observable<any[]> {
//     return of(mockBarDetails);
//   }
//   getAuditorCounts(): Observable<any[]> {
//     return of(mockBar);
//   }
//   auditSummaryByAuditorExcel() {
//     return of(mockReport);
//   }
// }

// describe("ManagerScoreCardComponent", () => {
//   let component: ManagerScoreCardComponent;
//   let fixture: ComponentFixture<ManagerScoreCardComponent>;
//   let service: AuditorService;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         ManagerScoreCardComponent,
//         ManagerClaimsCountByStatusComponent,
//         ClaimsExaminerCountByLeadComponent,
//         ClaimsCountByAgeComponent,
//         ManagerFinancialScoreComponent,
//         ManagerTeamProductivityComponent,
//         ManagerClaimsProcessedVsAuditedComponent,
//         ManagerProceduralScoreComponent,
//         ManagerAuditScoreComponent,
//         LowPerformingExaminersComponent,
//         HighPerformingExaminersComponent
//       ],
//       imports: [
//         CommonModule,
//         GoogleChartsModule,
//         FormsModule,
//         ReactiveFormsModule,
//         DialogModule,
//         ComponentsModule,
//         AuditReportDashboardModule,
//         CalendarModule,
//         LandingPageModule,
//         ButtonModule,
//         TooltipModule,
//         DropdownModule,
//         HttpClientTestingModule,
//         MultiSelectModule,
//         RouterModule.forRoot([]),
//         ReportsModule
//       ],
//       providers: [
//         {
//           provide: AuditorService,
//           useClass: MockAuditorService
//         },
//         { provide: BaseHttpService, useClass: MockBaseHttpService },
//         MessageService,
//         DatePipe
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ManagerScoreCardComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//     service = fixture.debugElement.injector.get(AuditorService);
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should fetch status-date data on OK button click", () => {
//     const locSpy = spyOn(component, "getAuditorCounts");
//     fixture.detectChanges();
//     component.onSubmitStatus();
//     expect(locSpy).toHaveBeenCalled();
//   });

//   it("get auditor counts", () => {
//     const prevDate = new Date();
//     prevDate.setDate(prevDate.getDate() - 1);
//     const threeMonthsBefore = new Date(
//       prevDate.setMonth(prevDate.getMonth() - 3)
//     );
//     const yesterdaysDate = new Date();
//     yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
//     const defaultDateRange = [];
//     defaultDateRange.push(threeMonthsBefore);
//     defaultDateRange.push(yesterdaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     spyOn(service, "getAuditorCounts").and.returnValue(of(""));
//     component.getAuditorCounts();
//     expect(component.auditorCountData).toEqual([
//       ["NO DATA", 0, "0", 0, "0", 0, "0"]
//     ]);
//   });

//   it("get auditor counts - value", () => {
//     const prevDate = new Date();
//     prevDate.setDate(prevDate.getDate() - 1);
//     const threeMonthsBefore = new Date(
//       prevDate.setMonth(prevDate.getMonth() - 3)
//     );
//     const yesterdaysDate = new Date();
//     yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
//     const defaultDateRange = [];
//     defaultDateRange.push(threeMonthsBefore);
//     defaultDateRange.push(yesterdaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     spyOn(service, "getAuditorCounts").and.returnValue(
//       of({
//         test: 1,
//         test2: 2
//       })
//     );
//     spyOn(component, "processAuditorGraph");
//     component.getAuditorCounts();
//     expect(component.loaded).toBeTruthy();
//   });

//   it("should map when response length is greater tha zero", () => {
//     let auditor = [];
//     const res = [
//       { auditorName: "Dhanya", passedCount: 5, failedCount: 4 },
//       { auditorName: "Brian", passedCount: 2, failedCount: 5 }
//     ];
//     auditor = component.processAuditorGraph(res);
//     expect(auditor.length).toBeGreaterThan(0);
//   });

//   it("should not map when response length is not greater tha zero", () => {
//     let auditor = [];
//     const res = [];
//     auditor = component.processAuditorGraph(res);
//     expect(auditor.length).not.toBeGreaterThan(0);
//   });

//   it("get auditor counts - value exceed 4", () => {
//     const prevDate = new Date();
//     prevDate.setDate(prevDate.getDate() - 1);
//     const threeMonthsBefore = new Date(
//       prevDate.setMonth(prevDate.getMonth() - 3)
//     );
//     const yesterdaysDate = new Date();
//     yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
//     const defaultDateRange = [];
//     defaultDateRange.push(threeMonthsBefore);
//     defaultDateRange.push(yesterdaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     spyOn(service, "getAuditorCounts").and.returnValue(
//       of({
//         test: 1,
//         test2: 2,
//         test3: 1,
//         test4: 2,
//         test5: 1
//       })
//     );
//     spyOn(component, "processAuditorGraph");
//     component.getAuditorCounts();
//     expect(component.loaded).toBeTruthy();
//   });

//   it("get auditor counts - error", () => {
//     const prevDate = new Date();
//     prevDate.setDate(prevDate.getDate() - 1);
//     const threeMonthsBefore = new Date(
//       prevDate.setMonth(prevDate.getMonth() - 3)
//     );
//     const yesterdaysDate = new Date();
//     yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
//     const defaultDateRange = [];
//     defaultDateRange.push(threeMonthsBefore);
//     defaultDateRange.push(yesterdaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     spyOn(service, "getAuditorCounts").and.returnValue(throwError(401));
//     component.getAuditorCounts();
//     expect(component.loaded).toBeTruthy();
//   });

//   it("should calculate difference when from date is present", () => {
//     const today = new Date();
//     component.isValid = false;
//     const todaysDate = new Date(
//       component.datePipe.transform(today, "yyyy-MM-dd")
//     );
//     const defaultDateRange = [];
//     defaultDateRange.push(todaysDate);
//     defaultDateRange.push(todaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     const locSpy = spyOn(component, "dateDifference");
//     fixture.detectChanges();
//     component.validateDates();
//     expect(locSpy).toHaveBeenCalled();
//   });
//   it("should set validilty to true when to date is not present", () => {
//     const today = new Date();
//     component.isValid = false;
//     const todaysDate = new Date(
//       component.datePipe.transform(today, "yyyy-MM-dd")
//     );
//     const defaultDateRange = [];
//     defaultDateRange.push(todaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     spyOn(component, "dateDifference");
//     fixture.detectChanges();
//     component.validateDates();
//     expect(component.isValid).toBeTruthy();
//   });
//   it("should set dates as invalid when diffrence is more than 3 months", () => {
//     const today = new Date();
//     component.isValid = false;
//     const todaysDate = new Date(
//       component.datePipe.transform(today, "yyyy-MM-dd")
//     );
//     const sevenDate = new Date();
//     sevenDate.setDate(sevenDate.getDate() - 350);
//     const dat = new Date(component.datePipe.transform(sevenDate, "yyyy-MM-dd"));
//     const defaultDateRange = [];
//     defaultDateRange.push(dat);
//     defaultDateRange.push(todaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     spyOn(component, "dateDifference");
//     fixture.detectChanges();
//     component.validateDates();
//     expect(component.isValid).toBeFalsy();
//   });
//   it("should set dates as valid when diffrence is less than 3 months", () => {
//     const today = new Date();
//     component.isValid = false;
//     const todaysDate = new Date(
//       component.datePipe.transform(today, "yyyy-MM-dd")
//     );
//     const defaultDateRange = [];
//     defaultDateRange.push(todaysDate);
//     defaultDateRange.push(todaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     spyOn(component, "dateDifference").and.returnValue(0);
//     fixture.detectChanges();
//     component.validateDates();
//     expect(component.isValid).toBeTruthy();
//   });
//   it("should calculate difference between two dates", () => {
//     const today = new Date();
//     component.isValid = false;
//     const todaysDate = new Date(
//       component.datePipe.transform(today, "yyyy-MM-dd")
//     );
//     const defaultDateRange = [];
//     defaultDateRange.push(todaysDate);
//     defaultDateRange.push(todaysDate);
//     fixture.detectChanges();
//     const diff = component.dateDifference(defaultDateRange);
//     expect(diff).toBe(0);
//   });

//   it("should call service when bar is selected", () => {
//     const bar = [];
//     component.auditorCountData = [
//       ["Brian Blaze", 16, "16", 9, "9", 13, "13"],
//       ["Neethu", 16, "16", 9, "9", 13, "13"]
//     ];
//     component.auditorColumnNames = [
//       "",
//       "Audit Success",
//       { role: "annotation" },
//       "Audit Failed",
//       { role: "annotation" },
//       "Assigned",
//       { role: "annotation" }
//     ];
//     bar.push({ column: 1, row: 0 });
//     const spy1 = spyOn(component, "getBarDetails").and.callThrough();
//     const spy2 = spyOn(
//       service,
//       "auditSummaryByAuditorDetails"
//     ).and.callThrough();
//     fixture.detectChanges();
//     component.selectBar(bar);
//     expect(spy1).toHaveBeenCalled();
//     expect(spy2).toHaveBeenCalled();
//   });

//   it("should call excel service", () => {
//     component.auditorCountData = [
//       ["Brian Blaze", 16, "16", 9, "9", 13, "13"],
//       ["Neethu", 16, "16", 9, "9", 13, "13"]
//     ];
//     component.auditorColumnNames = [
//       "",
//       "Audit Success",
//       { role: "annotation" },
//       "Audit Failed",
//       { role: "annotation" },
//       "Assigned",
//       { role: "annotation" }
//     ];
//     const today = new Date();
//     const todaysDate = new Date(
//       component.datePipe.transform(today, "yyyy-MM-dd")
//     );
//     const defaultDateRange = [];
//     defaultDateRange.push(todaysDate);
//     defaultDateRange.push(todaysDate);
//     component.assignedDates.get("dateRange").setValue(defaultDateRange);
//     component.barDetails = {
//       auditorName: "Brian Blaze",
//       type: "Audit Failed",
//       value: 9
//     };
//     const servSpy = spyOn(service, "auditSummaryByAuditorExcel")
//       .and.returnValue(mockReport)
//       .and.callThrough();

//     fixture.detectChanges();
//     component.downloadExcel();
//     expect(servSpy).toHaveBeenCalled();

//     const spyObj = document.createElement("a");
//     const blob = new Blob([mockReport.body], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     });
//     const url = URL.createObjectURL(blob);
//     const dateString = component.datePipe.transform(today, "MMddyyyy");
//     spyObj.setAttribute("href", url);
//     spyObj.setAttribute(
//       "download",
//       "Audit Summary By Auditor-" + dateString
//     );
//     document.body.appendChild(spyObj);
//     spyOn(document, "createElement").and.returnValue(spyObj);
//     const syy = spyOn(spyObj, "click");
//     fixture.detectChanges();
//     component.downloadExcel();
//     // tslint:disable-next-line: deprecation
//     expect(document.createElement).toHaveBeenCalledTimes(1);
//     // tslint:disable-next-line: deprecation
//     expect(document.createElement).toHaveBeenCalledWith("a");
//     expect(syy).toHaveBeenCalled();
//     expect(spyObj.download).toBe(
//       "Audit Summary By Auditor-" + dateString
//     );
//   });
//   it("should not download file", () => {
//     component.barDetails = {
//       auditorName: "Brian Blaze",
//       type: "Audit Failed",
//       value: 9
//     };
//     const today = new Date();
//     const dateString = component.datePipe.transform(today, "MMddyyyy");
//     const spyObj = document.createElement("a");
//     document.body.appendChild(spyObj);
//     const servSpy = spyOn(service, "auditSummaryByAuditorExcel")
//       .and.returnValue(null)
//       .and.callThrough();
//     component.downloadExcel();
//     const syy = spyOn(spyObj, "click");
//     expect(syy).not.toHaveBeenCalled();
//     expect(spyObj.download).not.toBe(
//       "Audit Summary By Auditor-" + dateString
//     );
//   });
// });
