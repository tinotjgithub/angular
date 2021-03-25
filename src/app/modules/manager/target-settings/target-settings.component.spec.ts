/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatePipe } from "@angular/common";
import { TargetSettingsComponent } from "./target-settings.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MessageService } from "primeng/api";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import {
  targetScores,
  prcRowData,
  finRowData
} from "./../../../../app/mocks/mock-data";
import { RadioButtonModule } from "primeng/radiobutton";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { Routes, RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";

class MockTaskMgtService extends TaskmanagementService {
  getUserTarget() {
    const targetArray: any = targetScores;
    this.userTargetSub.next(targetArray);
  }
}

describe("TargetSettingsComponent", () => {
  let service;
  let component: TargetSettingsComponent;
  let fixture: ComponentFixture<TargetSettingsComponent>;
  const childComponent = jasmine.createSpyObj("ChildComponent", ["reset"]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TargetSettingsComponent],
      imports: [
        CommonModule,
        FormsModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        RadioButtonModule,
        CalendarModule,
        TableModule,
        DropdownModule,
        HttpClientTestingModule,
        DialogModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        TaskmanagementService,
        MessageService,
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetSettingsComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(TaskmanagementService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("set values to controls", () => {
    it("should call service to fetch target data", () => {
      const servSpy = spyOn(service, "getUserTarget");
      fixture.detectChanges();
      component.getTargetScores();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should set the columns for financial score data in grid", () => {
      component.cols = [];
      component.isFinancial = true;
      fixture.detectChanges();
      component.setFinCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set the columns for procedural score data in grid", () => {
      component.cols = [];
      component.isFinancial = false;
      fixture.detectChanges();
      component.setProcCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set the columns for productivity target data in grid", () => {
      component.cols = [];
      component.isFinancial = false;
      component.isProcedural = false;
      fixture.detectChanges();
      component.setProdCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should reset data and clear all values when financial tab is selected", () => {
      component.cols = [];
      component.targetSettings.get("targetOption").setValue("");
      fixture.detectChanges();
      const targetcompSpy = spyOn(component, "getTargetScores");
      const fincompSpy = spyOn(component, "setFinCols");
      const clearSpy = spyOn(component, "clearData");
      component.onClickFinancial();
      expect(targetcompSpy).toHaveBeenCalled();
      expect(fincompSpy).toHaveBeenCalled();
      expect(clearSpy).toHaveBeenCalled();
      expect(component.targetSettings.get("targetOption").value).toEqual(
        "Financial"
      );
    });

    it("should reset data and clear all values when procedural tab is selected", () => {
      component.targetSettings.get("targetOption").setValue("");
      component.cols = [];
      fixture.detectChanges();
      const targetcompSpy = spyOn(component, "getTargetScores");
      const proccompSpy = spyOn(component, "setProcCols");
      const clearSpy = spyOn(component, "clearData");
      component.onClickProcedural();
      expect(targetcompSpy).toHaveBeenCalled();
      expect(proccompSpy).toHaveBeenCalled();
      expect(clearSpy).toHaveBeenCalled();
      expect(component.targetSettings.get("targetOption").value).toEqual(
        "Procedural"
      );
    });

    it("should reset data and clear all values when productivity tab is selected", () => {
      component.targetSettings.get("targetOption").setValue("");
      component.cols = [];
      component.isFinancial = false;
      component.isProcedural = false;
      fixture.detectChanges();
      const targetcompSpy = spyOn(component, "getTargetScores");
      const prodcompSpy = spyOn(component, "setProdCols");
      const clearSpy = spyOn(component, "clearData");
      component.onClickProductivity();
      expect(targetcompSpy).toHaveBeenCalled();
      expect(prodcompSpy).toHaveBeenCalled();
      expect(clearSpy).toHaveBeenCalled();
      expect(component.targetSettings.get("targetOption").value).toEqual(
        "Productivity"
      );
    });

    it("should clear all values", () => {
      component.isEdit = true;
      component.targetSettings.get("target").setValue(89);
      fixture.detectChanges();
      component.clearData();
      expect(component.isEdit).toBeFalsy();
      expect(component.targetSettings.get("endDate").value).toEqual(null);
    });
  });

  describe("should add or edit target details", () => {
    it("should edit procedural target details", () => {
      const scoreTable = jasmine.createSpyObj("scoreTable", ["reset"]);
      component.scoreTable = scoreTable;
      component.isEdit = false;
      fixture.detectChanges();
      component.editTarget(prcRowData);
      expect(component.isEdit).toBeTruthy();
    });

    it("should edit financial target details", () => {
      const scoreTable = jasmine.createSpyObj("scoreTable", ["reset"]);
      component.scoreTable = scoreTable;
      component.isEdit = false;
      fixture.detectChanges();
      component.editTarget(finRowData);
      expect(component.isEdit).toBeTruthy();
    });

    it("should set target data with financial score data when financial score option is selected", () => {
      component.isFinancial = true;
      const scoreTable = jasmine.createSpyObj("scoreTable", ["reset"]);
      component.scoreTable = scoreTable;
      fixture.detectChanges();
      component.setTargetData(finRowData);
      expect(component.targetSettings.get("target").value).toBe(
        finRowData.financialScores
      );
    });

    it("check if to date is greater than front date", () => {
      const today = new Date();
      component.targetSettings.get("startDate").setValue(today);
      component.targetSettings.get("endDate").setValue(today);
      fixture.detectChanges();
      component.checkToDate();
      expect(component.targetSettings.get("endDate").value).not.toEqual(null);
    });
    it("if to date is greater than front date reset date", () => {
      const today = new Date();
      component.targetSettings.get("startDate").setValue(today);
      const date = new Date();
      date.setDate(date.getDate() - 7);
      component.targetSettings.get("endDate").setValue(date);
      fixture.detectChanges();
      component.checkToDate();
      expect(component.targetSettings.get("endDate").value).toEqual(null);
    });

    it("should set target data with procedural score data when procedural score option is selected", () => {
      component.isFinancial = false;
      component.isProcedural = true;
      const scoreTable = jasmine.createSpyObj("scoreTable", ["reset"]);
      component.scoreTable = scoreTable;
      fixture.detectChanges();
      component.setTargetData(prcRowData);
      expect(component.targetSettings.get("target").value).toBe(
        prcRowData.proceduralScores
      );
    });

    it("should not return the updated value when target is not a no.", () => {
      component.targetSettings.get("target").setValue("FH");
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInput(e);
      expect(component.targetSettings.get("target").hasError).toBeTruthy();
    });

    it("should not return the updated value when target is null or undefined.", () => {
      component.targetSettings.get("target").setValue(null);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInput(e);
      expect(component.targetSettings.get("target").hasError).toBeTruthy();
    });

    it("should set validity to true when target and dates set by user are not empty", () => {
      component.isFinancial = false;
      const scoreTable = jasmine.createSpyObj("scoreTable", ["reset"]);
      component.scoreTable = scoreTable;
      fixture.detectChanges();
      const isValid = component.checkEmpty(67, "2020-02-20", "2020-04-27");
      expect(isValid).toBeTruthy();
    });

    it("should set validity to false when target set by user is empty", () => {
      component.isFinancial = false;
      const scoreTable = jasmine.createSpyObj("scoreTable", ["reset"]);
      component.scoreTable = scoreTable;
      fixture.detectChanges();
      const isValid = component.checkEmpty("", "2020-02-20", "2020-04-27");
      expect(isValid).toBeFalsy();
    });

    it("should set validity to false when start date set by user is empty", () => {
      component.isFinancial = false;
      fixture.detectChanges();
      const isValid = component.checkEmpty(67, "", "2020-04-27");
      expect(isValid).toBeFalsy();
    });

    it("should set validity to false when end set by user is empty", () => {
      component.isFinancial = false;
      fixture.detectChanges();
      const isValid = component.checkEmpty(67, "2020-02-20", "");
      expect(isValid).toBeFalsy();
    });

    it("should format date values", () => {
      const formattedDate = component.getFormattedDate("2020-02-20", false);
      expect(formattedDate).toEqual("02/20/2020");
    });
  });

  describe("should save target values", () => {
    it("should save target and clear data", () => {
      component.scoreTable = childComponent;
      component.isFinancial = true;
      component.isEdit = false;
      component.targetSettings.get("target").setValue("89");
      fixture.detectChanges();
      component.saveTargetScore();
      // expect(component.invalidRange).toBeFalsy();
    });

    it("should call service to save newly added financial target data", () => {
      component.scoreTable = childComponent;
      component.isFinancial = true;
      component.isProcedural = false;
      component.isEdit = false;
      const servSpy = spyOn(service, "saveFinancialTargetScore");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call service to save newly added procedural target data", () => {
      component.scoreTable = childComponent;
      component.isFinancial = false;
      component.isProcedural = true;
      component.isEdit = false;
      const servSpy = spyOn(service, "saveProceduralTargetScore");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call service to update procedural target data", () => {
      component.scoreTable = childComponent;
      component.isFinancial = false;
      component.isProcedural = true;
      component.isEdit = true;
      const servSpy = spyOn(service, "updateProceduralTargetScore");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call service to update financial target data", () => {
      component.scoreTable = childComponent;
      component.isFinancial = true;
      component.isProcedural = false;
      component.isEdit = true;
      const servSpy = spyOn(service, "updateFinancialTargetScore");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should call service to save newly added productivity target data", () => {
      component.scoreTable = childComponent;
      component.isFinancial = false;
      component.isProcedural = false;
      component.isEdit = false;
      const servSpy = spyOn(service, "saveProductivityTargetScore");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should call service to update productivity target data", () => {
      component.scoreTable = childComponent;
      component.isFinancial = false;
      component.isProcedural = false;
      component.isEdit = true;
      const servSpy = spyOn(service, "updateProductivityTargetScore");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });
  });
});
