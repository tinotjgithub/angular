// import { async, ComponentFixture, TestBed } from "@angular/core/testing";
// import { AuditScoreComponent } from "./audit-score.component";
// import { GoogleChartsModule } from "angular-google-charts";
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { CalendarModule } from "primeng/calendar";
// import { DialogModule } from "primeng/dialog";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { BaseHttpService } from "src/app/services/base-http.service";
// import { DatePipe } from "@angular/common";
// import { qualityScore, mockReport } from "src/app/mocks/dashboard-mock-data";
// import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
// import { of, throwError } from "rxjs";
// import { QualityScore } from "./../../../services/task-management/models/QualityScore";
// import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

// class MockTaskMgtService extends TaskmanagementService {
//   getAuditScores() {
//     const prodArray: QualityScore = qualityScore;
//     this.auditScoresFetch.next(prodArray);
//   }
//   getAuditReport() {
//     const prodArray = [];
//     this.auditReportFetch.next(prodArray);
//   }
// }

// describe("AuditScoreComponent", () => {
//   let component: AuditScoreComponent;
//   let fixture: ComponentFixture<AuditScoreComponent>;
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [AuditScoreComponent],
//       imports: [
//         GoogleChartsModule,
//         FormsModule,
//         ReactiveFormsModule,
//         CalendarModule,
//         DialogModule,
//         HttpClientTestingModule
//       ],
//       providers: [
//         { provide: TaskmanagementService, useClass: MockTaskMgtService },
//         { provide: BaseHttpService, useClass: MockBaseHttpService },
//         DatePipe
//       ]
//     }).compileComponents();
//   }));
//   beforeEach(() => {
//     fixture = TestBed.createComponent(AuditScoreComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//   fit("should create", () => {
//     expect(component).toBeTruthy();
//   });

//   describe("get and set values", () => {
//     let service;
//     beforeEach(() => {
//       fixture = TestBed.createComponent(AuditScoreComponent);
//       service = fixture.debugElement.injector.get(TaskmanagementService);
//       component = fixture.componentInstance;
//       fixture.detectChanges();
//     });
//     fit("should set displayEnlarded to true", () => {
//       component.enlargedDisplay = false;
//       fixture.detectChanges();
//       component.showDialog();
//       expect(component.enlargedDisplay).toBe(true);
//     });
//     fit("should fetch qualityScore data on OK button click", () => {
//       const locSpy = spyOn(component, "getAuditDays");
//       fixture.detectChanges();
//       component.onSubmitAudit();
//       expect(locSpy).toHaveBeenCalled();
//     });
//     fit("should set data in chart as 'No Data' when data is empty", () => {
//       component.dataAudit = [];
//       fixture.detectChanges();
//       component.getAuditChartNoValue();
//       expect(component.dataAudit[0]).toEqual(["NO DATA", 0, "0", 0, "0"]);
//     });
//     fit("should set tooltip text in chart to a default value when data is empty", () => {
//       component.optionsAudit.tooltip.trigger = "focus";
//       fixture.detectChanges();
//       component.getAuditChartNoValue();
//       expect(component.optionsAudit.tooltip.trigger).toBe("none");
//     });
//     fit("should not display legend when there are no values", () => {
//       component.optionsAudit.legend.position = "top";
//       fixture.detectChanges();
//       component.getAuditChartNoValue();
//       expect(component.optionsAudit.legend.position).toBe("none");
//     });
//     fit("should set tooltip text in chart to a default value when data is empty", () => {
//       component.statusCountDtos = qualityScore;
//       component.optionsAudit.tooltip.trigger = "none";
//       fixture.detectChanges();
//       component.getAuditChartValue();
//       expect(component.optionsAudit.tooltip.trigger).toBe("focus");
//     });
//     fit("should display legend when there are values", () => {
//       component.statusCountDtos = qualityScore;
//       component.optionsAudit.legend.position = "none";
//       fixture.detectChanges();
//       component.getAuditChartValue();
//       expect(component.optionsAudit.legend.position).toBe("top");
//     });
//     fit("should map response value when response value is present", () => {
//       component.dataAudit = [];
//       component.statusCountDtos = qualityScore;
//       fixture.detectChanges();
//       component.getAuditChartValue();
//       const l = component.dataAudit.length;
//       expect(l).toBeGreaterThan(0);
//     });
//     fit("should set to date value as to date itself when to date is present", () => {
//       const today = new Date();
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const sevenDate = new Date();
//       sevenDate.setDate(sevenDate.getDate() - 7);
//       const dat = new Date(
//         component.datePipe.transform(sevenDate, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(dat);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       fixture.detectChanges();
//       const toDate = component.getToDateValue();
//       expect(toDate).toBe(dat);
//     });
//     fit("should set to date value as from date value when to date is undefined", () => {
//       const today = new Date();
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       fixture.detectChanges();
//       const toDate = component.getToDateValue();
//       expect(toDate).toBe(todaysDate);
//     });
//   });

//   describe("should fetch data from service", () => {
//     let service;
//     beforeEach(() => {
//       fixture = TestBed.createComponent(AuditScoreComponent);
//       service = fixture.debugElement.injector.get(TaskmanagementService);
//       component = fixture.componentInstance;
//       fixture.detectChanges();
//     });
//     fit("should call service to fetch audit data", () => {
//       const today = new Date();
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       const servSpy = spyOn(service, "getAuditScores");
//       fixture.detectChanges();
//       component.getAuditDays();
//       expect(servSpy).toHaveBeenCalled();
//     });
//     fit("should set data in chart as 'No Data' when error occurs", () => {
//       const today = new Date();
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       spyOn(service, "getAuditScores").and.returnValue(
//         throwError({ status: 401 })
//       );
//       const locSpy = spyOn(component, "getAuditChartNoValue");
//       fixture.detectChanges();
//       component.getAuditDays();
//       expect(locSpy).toHaveBeenCalled();
//     });
//     fit("should set data in chart as 'No Data' when response is null", () => {
//       const today = new Date();
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       spyOn(service, "getAuditScores");
//       component.statusCountDtos = null;
//       const locSpy = spyOn(component, "getAuditChartNoValue");
//       fixture.detectChanges();
//       component.getAuditDays();
//       expect(locSpy).toHaveBeenCalled();
//     });
//     fit("should render chart", () => {
//       const today = new Date();
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       fixture.detectChanges();
//       component.getAuditDays();
//       expect(component.isAuditRendered).toBeTruthy();
//     });
//     fit("should call excel service", () => {
//       const today = new Date();
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       const servSpy = spyOn(service, "getAuditReport");
//       fixture.detectChanges();
//       component.downloadExcel();
//       expect(servSpy).toHaveBeenCalled();
//     });
//     fit("should download file in excel format", () => {
//       const spyObj = document.createElement("a");
//       const blob = new Blob([mockReport.body], {
//         type:
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       });
//       const today = new Date();
//       const url = URL.createObjectURL(blob);
//       const dateString = component.datePipe.transform(today, "MMddyyyy");
//       spyObj.setAttribute("href", url);
//       spyObj.setAttribute(
//         "download",
//         "My_Quality_Score" + dateString + ".xlsx"
//       );
//       document.body.appendChild(spyObj);
//       spyOn(document, "createElement").and.returnValue(spyObj);
//       const syy = spyOn(spyObj, "click");
//       fixture.detectChanges();
//       component.downloadFile(mockReport);
//       // tslint:disable-next-line: deprecation
//       expect(document.createElement).toHaveBeenCalledTimes(1);
//       // tslint:disable-next-line: deprecation
//       expect(document.createElement).toHaveBeenCalledWith("a");
//       expect(syy).toHaveBeenCalled();
//       expect(spyObj.download).toBe("My_Quality_Score" + dateString + ".xlsx");
//     });
//     fit("should not download file", () => {
//       const today = new Date();
//       const dateString = component.datePipe.transform(today, "MMddyyyy");
//       const spyObj = document.createElement("a");
//       document.body.appendChild(spyObj);
//       const syy = spyOn(spyObj, "click");
//       fixture.detectChanges();
//       component.downloadFile(mockReport);
//       expect(syy).not.toHaveBeenCalled();
//       expect(spyObj.download).not.toBe(
//         "My_Quality_Score" + dateString + ".xlsx"
//       );
//     });
//   });

//   describe("should validate dates", () => {
//     let service;
//     beforeEach(() => {
//       fixture = TestBed.createComponent(AuditScoreComponent);
//       service = fixture.debugElement.injector.get(TaskmanagementService);
//       component = fixture.componentInstance;
//       fixture.detectChanges();
//     });
//     fit("should calculate difference when to date is present", () => {
//       const today = new Date();
//       component.isValid = false;
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       const locSpy = spyOn(component, "getMonths");
//       fixture.detectChanges();
//       component.validateDates();
//       expect(locSpy).toHaveBeenCalled();
//     });
//     fit("should set validilty to true when to date is not present", () => {
//       const today = new Date();
//       component.isValid = false;
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       spyOn(component, "getMonths");
//       fixture.detectChanges();
//       component.validateDates();
//       expect(component.isValid).toBeTruthy();
//     });
//     fit("should set dates as invalid when diffrence is more than 6 months", () => {
//       const today = new Date();
//       component.isValid = false;
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const sevenDate = new Date();
//       sevenDate.setDate(sevenDate.getDate() - 350);
//       const dat = new Date(
//         component.datePipe.transform(sevenDate, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(dat);
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       spyOn(component, "getMonths");
//       fixture.detectChanges();
//       component.validateDates();
//       expect(component.isValid).toBeFalsy();
//     });
//     fit("should set dates as valid when diffrence is less than 6 months", () => {
//       const today = new Date();
//       component.isValid = false;
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(todaysDate);
//       component.auditDates.get("dateRange").setValue(defaultDateRange);
//       spyOn(component, "getMonths").and.returnValue(0);
//       fixture.detectChanges();
//       component.validateDates();
//       expect(component.isValid).toBeTruthy();
//     });
//     fit("should calculate difference between two dates", () => {
//       const today = new Date();
//       component.isValid = false;
//       const todaysDate = new Date(
//         component.datePipe.transform(today, "yyyy-MM-dd")
//       );
//       const defaultDateRange = [];
//       defaultDateRange.push(todaysDate);
//       defaultDateRange.push(todaysDate);
//       fixture.detectChanges();
//       const diff = component.getMonths(defaultDateRange);
//       expect(diff).toBe(0);
//     });
//   });
// });
