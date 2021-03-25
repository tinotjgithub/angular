import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FinancialScoreComponent } from "./financial-score.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { finScore, mockReport } from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { FinancialScore } from "./../../../services/task-management/models/FinancialScore";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

class MockTaskMgtService extends TaskmanagementService {
  getMyFinScores() {
    const prodArray: FinancialScore = finScore;
    this.myFinScoresFetch.next(prodArray);
  }
  getFinanceReport() {
    const prodArray = [];
    this.financeReportFetch.next(prodArray);
  }
}

describe("FinancialScoreComponent", () => {
  let component: FinancialScoreComponent;
  let fixture: ComponentFixture<FinancialScoreComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialScoreComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(FinancialScoreComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set displayEnlarded to true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should fetch finScore data on OK button click", () => {
      const locSpy = spyOn(component, "getFinanceDays");
      fixture.detectChanges();
      component.onSubmitMyFinance();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.myDataFinance = [];
      fixture.detectChanges();
      component.getMyFinanceNoChartValue();
      expect(component.myDataFinance[0]).toEqual(["NO DATA", 0, "0", 0, "0"]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.myOptionsFinance.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getMyFinanceNoChartValue();
      expect(component.myOptionsFinance.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.myOptionsFinance.legend.position = "top";
      fixture.detectChanges();
      component.getMyFinanceNoChartValue();
      expect(component.myOptionsFinance.legend.position).toBe("none");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.financialAccuracyDtos = finScore;
      component.myOptionsFinance.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getMyFinanceChartValue();
      expect(component.myOptionsFinance.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.financialAccuracyDtos = finScore;
      component.myOptionsFinance.legend.position = "none";
      fixture.detectChanges();
      component.getMyFinanceChartValue();
      expect(component.myOptionsFinance.legend.position).toBe("top");
    });
    it("should display chart with no data when there is no data present", () => {
      const finScores = { financialAccuracyDtos: null };
      component.financialAccuracyDtos = finScores;
      component.myOptionsFinance.legend.position = "none";
      const locSpy = spyOn(component, "getMyFinanceNoChartValue");
      fixture.detectChanges();
      component.getMyFinanceChartValue();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should map response value when response value is present", () => {
      component.myDataFinance = [];
      component.financialAccuracyDtos = finScore;
      fixture.detectChanges();
      component.getMyFinanceChartValue();
      const l = component.myDataFinance.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should set to date value as to date itself when to date is present", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const sevenDate = new Date();
      sevenDate.setDate(sevenDate.getDate() - 7);
      const dat = new Date(
        component.datePipe.transform(sevenDate, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(dat);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(dat);
    });
    it("should set to date value as from date value when to date is undefined", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(FinancialScoreComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch audit data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getMyFinScores");
      fixture.detectChanges();
      component.getFinanceDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getMyFinScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getMyFinanceNoChartValue");
      fixture.detectChanges();
      component.getFinanceDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when response is null", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getMyFinScores").and.returnValue(null);
      const locSpy = spyOn(component, "getMyFinanceNoChartValue");
      fixture.detectChanges();
      component.getFinanceDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getFinanceDays();
      expect(component.isMyFinRendered).toBeTruthy();
    });
    it("should call excel service", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getFinanceReport");
      fixture.detectChanges();
      component.downloadExcel();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should download file in excel format", () => {
      const spyObj = document.createElement("a");
      const blob = new Blob([mockReport.body], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const today = new Date();
      const url = URL.createObjectURL(blob);
      const dateString = component.datePipe.transform(today, "MMddyyyy");
      spyObj.setAttribute("href", url);
      spyObj.setAttribute(
        "download",
        "My_Financial_Score" + dateString + ".xlsx"
      );
      document.body.appendChild(spyObj);
      spyOn(document, "createElement").and.returnValue(spyObj);
      const syy = spyOn(spyObj, "click");
      fixture.detectChanges();
      component.downloadFile(mockReport);
      // tslint:disable-next-line: deprecation
      expect(document.createElement).toHaveBeenCalledTimes(1);
      // tslint:disable-next-line: deprecation
      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(syy).toHaveBeenCalled();
      expect(spyObj.download).toBe("My_Financial_Score" + dateString + ".xlsx");
    });
    it("should not download file", () => {
      const today = new Date();
      const dateString = component.datePipe.transform(today, "MMddyyyy");
      const spyObj = document.createElement("a");
      document.body.appendChild(spyObj);
      const syy = spyOn(spyObj, "click");
      fixture.detectChanges();
      component.downloadFile(mockReport);
      expect(syy).not.toHaveBeenCalled();
      expect(spyObj.download).not.toBe(
        "My_Financial_Score" + dateString + ".xlsx"
      );
    });
  });

  describe("should validateDates dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(FinancialScoreComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
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
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getNoOfmonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should not calculate difference when from date is not present", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.validateDates();
      expect(component.isValid).toBeTruthy();
    });
    it("should set dates as invalid when diffrence is more than 6 months", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const sevenDate = new Date();
      sevenDate.setDate(sevenDate.getDate() - 350);
      const dat = new Date(
        component.datePipe.transform(sevenDate, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(dat);
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getNoOfmonths");
      fixture.detectChanges();
      component.validateDates();
      expect(component.isValid).toBeFalsy();
    });
    it("should set dates as valid when diffrence is less than 6 months", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.financialGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getNoOfmonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(component.isValid).toBeTruthy();
    });
    it("should calculate difference between two dates", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      fixture.detectChanges();
      const diff = component.getNoOfmonths(todaysDate, todaysDate);
      expect(diff).toBe(0);
    });
  });
});
