import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ProceduralScoreComponent } from "./procedural-score.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { procScore, mockReport } from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { ProceduralScore } from "./../../../services/task-management/models/ProceduralScore";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

class MockTaskMgtService extends TaskmanagementService {
  getMyProcScores() {
    const prodArray: ProceduralScore = procScore;
    this.myProcScoresFetch.next(prodArray);
  }
  getProcReport() {
    const prodArray = [];
    this.procReportFetch.next(prodArray);
  }
}

describe("ProceduralScoreComponent", () => {
  let component: ProceduralScoreComponent;
  let fixture: ComponentFixture<ProceduralScoreComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProceduralScoreComponent],
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
    fixture = TestBed.createComponent(ProceduralScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ProceduralScoreComponent);
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
    it("should fetch procScore data on OK button click", () => {
      const locSpy = spyOn(component, "getProcedauralData");
      fixture.detectChanges();
      component.onSubmitMyProcedure();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.mydataprocedure = [];
      fixture.detectChanges();
      component.getMyProcedureNoChartValue();
      expect(component.mydataprocedure[0]).toEqual(["NO DATA", 0, "0", 0, "0"]);
    });
    it("should set tooltip text in chart to a default value when data is empty", async(() => {
      component.myoptionsprocedure.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getMyProcedureNoChartValue();
      expect(component.myoptionsprocedure.tooltip.trigger).toBe("none");
    }));
    it("should not display legend when there are no values", () => {
      component.myoptionsprocedure.legend.position = "top";
      fixture.detectChanges();
      component.getMyProcedureNoChartValue();
      expect(component.myoptionsprocedure.legend.position).toBe("none");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.userMyProcedureDto = procScore;
      component.myoptionsprocedure.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getMyProcedureChartValue(component.userMyProcedureDto);
      expect(component.myoptionsprocedure.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.userMyProcedureDto = procScore;
      component.myoptionsprocedure.legend.position = "none";
      fixture.detectChanges();
      component.getMyProcedureChartValue(component.userMyProcedureDto);
      expect(component.myoptionsprocedure.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.mydataprocedure = [];
      component.userMyProcedureDto = procScore;
      fixture.detectChanges();
      component.getMyProcedureChartValue(component.userMyProcedureDto);
      const l = component.mydataprocedure.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should map response value when response value is not present", () => {
      component.mydataprocedure = [];
      const procScores: ProceduralScore = {
        proceduralAccuracyDtoList: null
      };
      component.userMyProcedureDto = procScores;
      const sspy = spyOn(component, "getMyProcedureNoChartValue");
      fixture.detectChanges();
      component.getMyProcedureChartValue(component.userMyProcedureDto);
      expect(sspy).toHaveBeenCalled();
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
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue(
        defaultDateRange[0],
        defaultDateRange[1]
      );
      expect(toDate).toBe(dat);
    });
    it("should set to date value as from date value when to date is undefined", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue(
        defaultDateRange[0],
        defaultDateRange[1]
      );
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ProceduralScoreComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getMyProcScores");
      fixture.detectChanges();
      component.getProcedauralData(defaultDateRange[0], defaultDateRange[1]);
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
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getMyProcScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getMyProcedureNoChartValue");
      fixture.detectChanges();
      component.getProcedauralData(defaultDateRange[0], defaultDateRange[1]);
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when empty data", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getMyProcScores").and.returnValue([]);
      const locSpy = spyOn(component, "getMyProcedureNoChartValue");
      fixture.detectChanges();
      component.getProcedauralData(defaultDateRange[0], defaultDateRange[1]);
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
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getProcedauralData(defaultDateRange[0], defaultDateRange[1]);
      expect(component.isMyProcRendered).toBeTruthy();
    });
    it("should call excel service", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getProcReport");
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
        "My_Procedural_Score" + dateString + ".xlsx"
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
      expect(spyObj.download).toBe(
        "My_Procedural_Score" + dateString + ".xlsx"
      );
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
        "My_Procedural_Score" + dateString + ".xlsx"
      );
    });
  });

  describe("should validate dates", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ProceduralScoreComponent);
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
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validate();
      expect(locSpy).toHaveBeenCalled();
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
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validate();
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
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validate();
      expect(component.isValid).toBeTruthy();
    });
    it("should set validity to true when from date is absent", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.procedureGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validate();
      expect(component.isValid).toBeTruthy();
    });
    it("should calculate difference between two dates", () => {
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      fixture.detectChanges();
      const diff = component.getMonths(todaysDate, todaysDate);
      expect(diff).toBe(0);
    });
  });
});
