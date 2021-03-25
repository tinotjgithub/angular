import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StatusDateComponent } from "./status-date.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { statusDate, mockReport } from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { StatusDate } from "./../../../services/task-management/models/StatusDate";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

class MockTaskMgtService extends TaskmanagementService {
  getStatusScores() {
    const statusArray: StatusDate = statusDate;
    this.statusScoresFetch.next(statusArray);
  }
  getStatusReport() {
    const statusArray = [];
    this.statusReportFetch.next(statusArray);
  }
}

describe("StatusDateComponent", () => {
  let component: StatusDateComponent;
  let fixture: ComponentFixture<StatusDateComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusDateComponent],
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
    fixture = TestBed.createComponent(StatusDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(StatusDateComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set displayEnlarded to true", () => {
      component.displayEnlarged = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.displayEnlarged).toBe(true);
    });
    it("should fetch status-date data on OK button click", () => {
      const locSpy = spyOn(component, "getStatusDays");
      fixture.detectChanges();
      component.onSubmitStatus();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataStatus = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataStatus[0]).toEqual(["NO DATA", 1]);
    });
    it("should set pie slice text in chart to a default value when data is empty", () => {
      component.optionsStatus.pieSliceText = "value";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.pieSliceText).toBe("label");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsStatus.tooltip.text = "value";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.tooltip.text).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsStatus.legend.position = "top";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.legend.position).toBe("none");
    });
    it("should set pie slice text in chart to a default value when data is empty", () => {
      component.userStatusDto = statusDate;
      component.optionsStatus.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.pieSliceText).toBe("value");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.userStatusDto = statusDate;
      component.optionsStatus.tooltip.text = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.tooltip.text).toBe("value");
    });
    it("should display legend when there are values", () => {
      component.userStatusDto = statusDate;
      component.optionsStatus.legend.position = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataStatus = [];
      component.userStatusDto = statusDate;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataStatus.length;
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
      component.statusDates.get("dateRange").setValue(defaultDateRange);
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
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(StatusDateComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch status-data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getStatusScores");
      fixture.detectChanges();
      component.getStatusDays();
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
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getStatusScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when null response", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getStatusScores").and.returnValue(null);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
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
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getStatusDays();
      expect(component.isStatusRendered).toBeTruthy();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getAuditScores");
      component.userStatusDto = null;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is undefined", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getAuditScores");
      component.userStatusDto = undefined;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should call excel service", () => {
      const createFakeFile = (fileName: string = "fileName"): File => {
        const blob: any = new Blob([""], { type: "text/html" });
        blob.header = fileName;
        blob.body = blob;
        return blob as File;
      };
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getStatusReport").and.returnValue(
        createFakeFile
      );
      component.userStatusReportDto = createFakeFile;
      // const dwnSpy = spyOn(component, "downloadFile");
      fixture.detectChanges();
      component.downloadExcel();
      expect(servSpy).toHaveBeenCalled();
      // expect(dwnSpy).toHaveBeenCalled();
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
      spyObj.setAttribute("download", "Claims_Count_By_Status" + dateString + ".xlsx");
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
      expect(spyObj.download).toBe("Claims_Count_By_Status" + dateString + ".xlsx");
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
      expect(spyObj.download).not.toBe("Claims_Report-" + dateString + ".xlsx");
    });
    it("should not download file when download is undefined", () => {
      const today = new Date();
      const dateString = component.datePipe.transform(today, "MMddyyyy");
      const spyObj = document.createElement("u");
      document.body.appendChild(spyObj);
      const syy = spyOn(spyObj, "click");
      fixture.detectChanges();
      component.downloadFile(mockReport);
      expect(syy).not.toHaveBeenCalled();
    });
    it("should map response values", () => {
      const dataStatusArray = [];
      dataStatusArray.push(
        {
          status: "Completed",
          claimCount: 0
        },
        {
          status: "Pended",
          claimCount: 0
        },
        {
          status: "Routed Out",
          claimCount: 0
        }
      );
      component.mapResponseValue(statusDate.userStatusDtos, dataStatusArray);
      const len = component.dataStatus.length;
      expect(len).toEqual(4);
    });
  });

  describe("should validate dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(StatusDateComponent);
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
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "dateDifference");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set validilty to true when to date is not present", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "dateDifference");
      fixture.detectChanges();
      component.validateDates();
      expect(component.isValid).toBeTruthy();
    });
    it("should set dates as invalid when diffrence is more than 3 months", () => {
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
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "dateDifference");
      fixture.detectChanges();
      component.validateDates();
      expect(component.isValid).toBeFalsy();
    });
    it("should set dates as valid when diffrence is less than 3 months", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.statusDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "dateDifference").and.returnValue(0);
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
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      fixture.detectChanges();
      const diff = component.dateDifference(defaultDateRange);
      expect(diff).toBe(0);
    });
  });
});
