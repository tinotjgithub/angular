import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";

import { DatePipe } from "@angular/common";
import { SlaConfigurationComponent } from "./sla-configuration.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MessageService } from "primeng/api";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { slaTargetScores, rowData } from "src/app/mocks/mock-data";
import { RadioButtonModule } from "primeng/radiobutton";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { Routes, RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { By } from "@angular/platform-browser";
import { AnimationDriver } from "@angular/animations/browser";

class MockTaskMgtService extends TaskmanagementService {
  getSLAConfig() {
    const targetArray: any = slaTargetScores;
    this.userTargetSub.next(targetArray);
  }
}
function queryDebugElement(de: DebugElement, selector: string) {
  return de.query(By.css(selector));
}
describe("SlaConfigurationComponent", () => {
  let service;
  let component: SlaConfigurationComponent;
  let fixture: ComponentFixture<SlaConfigurationComponent>;
  const childComponent = jasmine.createSpyObj("ChildComponent", ["reset"]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlaConfigurationComponent],
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
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        MessageService,
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaConfigurationComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(TaskmanagementService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("set values to controls", () => {
    it("should call service to fetch target data", () => {
      const servSpy = spyOn(service, "getSLAConfig")
        .and.returnValue(slaTargetScores)
        .and.callThrough();
      fixture.detectChanges();
      component.getSLAConfig();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should return the same value when target doesnot exceed", () => {
      component.targetSettings.get("targetSLA").setValue(89);
      fixture.detectChanges();
      component.preventInput("");
      expect(component.targetSettings.get("targetSLA").value).toEqual(89);
    });

    it("should return the updated value when target exceeds", () => {
      component.targetSettings.get("targetSLA").setValue(890);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInput(e);
      expect(component.targetSettings.get("targetSLA").value).toEqual(89);
    });

    it("should not return the updated value when sla target is not a no.", () => {
      component.targetSettings.get("targetSLA").setValue("FH");
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInput(e);
      expect(component.targetSettings.get("targetSLA").hasError).toBeTruthy();
    });

    it("should not return the updated value when sla target is null or undefined.", () => {
      component.targetSettings.get("targetSLA").setValue(null);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInput(e);
      expect(component.targetSettings.get("targetSLA").hasError).toBeTruthy();
    });

    it("should return the same value when Threshold target doesnot exceed 100", () => {
      component.targetSettings.get("targetSLA").setValue(89);
      fixture.detectChanges();
      component.preventInputThreshold("");
      expect(component.targetSettings.get("targetSLA").value).toEqual(89);
    });

    it("should not set errors when Threshold target exceeds 100", () => {
      component.targetSettings.get("targetSLA").setValue(890);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputThreshold(e);
      expect(component.targetSettings.get("targetSLA").value).toEqual(890);
    });

    it("should set errors when Threshold target exceeds turn around time", () => {
      component.targetSettings.get("thresholdTime").setValue(89);
      component.targetSettings.get("turnAroundTime").setValue(60);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputThreshold(e);
      expect(component.targetSettings.get("targetSLA").hasError).toBeTruthy();
    });

    it("should not return the updated value when Threshold time is not a no.", () => {
      component.targetSettings.get("thresholdTime").setValue("FH");
      component.targetSettings.get("targetSLA").setValue(60);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputThreshold(e);
      expect(component.targetSettings.get("targetSLA").hasError).toBeTruthy();
    });

    it("should return the updated value when threshold Time doesnot exceed turn around time", () => {
      component.targetSettings.get("thresholdTime").setValue(89);
      component.targetSettings.get("turnAroundTime").setValue(90);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputThreshold(e);
      expect(component.targetSettings.get("targetSLA").hasError).toBeTruthy();
    });

    it("should return the updated value when Threshold time is null or undefined", () => {
      component.targetSettings.get("thresholdTime").setValue(null);
      component.targetSettings.get("targetSLA").setValue(90);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputThreshold(e);
      expect(component.targetSettings.get("targetSLA").hasError).toBeTruthy();
    });

    it("should return the same value when turnAround Time doesnot exceed 100", () => {
      component.targetSettings.get("turnAroundTime").setValue(89);
      component.targetSettings.get("targetSLA").setValue(90);
      fixture.detectChanges();
      component.preventInputTurnaround("");
      expect(component.targetSettings.get("targetSLA").value).toEqual(90);
    });

    it("should not set errors when turnAround Time exceeds 100", () => {
      component.targetSettings.get("targetSLA").setValue(890);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputTurnaround(e);
      expect(component.targetSettings.get("targetSLA").value).toEqual(890);
    });

    it("should set errors when threshold Time exceeds turnAround Time", () => {
      component.targetSettings.get("turnAroundTime").setValue(59);
      component.targetSettings.get("thresholdTime").setValue(60);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputTurnaround(e);
      expect(component.targetSettings.get("targetSLA").hasError).toBeTruthy();
    });

    it("should not return the updated value when turnAround Time is not a no.", () => {
      component.targetSettings.get("turnAroundTime").setValue("FH");
      component.targetSettings.get("thresholdTime").setValue(60);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputTurnaround(e);
      expect(
        component.targetSettings.get("turnAroundTime").hasError
      ).toBeTruthy();
    });

    it("should return the updated value when threshold Time doesnot exceed turn around time", () => {
      component.targetSettings.get("thresholdTime").setValue(89);
      component.targetSettings.get("turnAroundTime").setValue(90);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputTurnaround(e);
      expect(component.targetSettings.get("targetSLA").hasError).toBeTruthy();
    });

    it("should return the updated value when turnAround Time is null or undefined", () => {
      component.targetSettings.get("thresholdTime").setValue(null);
      component.targetSettings.get("turnAroundTime").setValue(90);
      fixture.detectChanges();
      let e = jasmine.createSpyObj("e", ["preventDefault"]);
      component.preventInputTurnaround(e);
      expect(
        component.targetSettings.get("thresholdTime").hasError
      ).toBeTruthy();
    });

    it("should set the columns for sla data in grid", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setSLACols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should get values for sla data", () => {
      component.targetSettings.get("targetSLA").setValue(89);
      fixture.detectChanges();
      const sla = component.getControl("targetSLA");
      expect(sla.value).toEqual(89);
    });

    it("should clear all values", () => {
      component.isEdit = true;
      component.targetSettings.get("targetSLA").setValue(89);
      fixture.detectChanges();
      component.clearData();
      expect(component.isEdit).toBeFalsy();
      expect(component.targetSettings.get("targetSLA").value).toEqual(null);
    });
  });

  describe("should add or edit target details", () => {
    it("should edit sla target details", () => {
      const scoreTable = jasmine.createSpyObj("scoreTable", ["reset"]);
      component.scoreTable = scoreTable;
      component.isEdit = false;
      fixture.detectChanges();
      component.editSLATarget(rowData);
      expect(component.isEdit).toBeTruthy();
    });

    it("should set target data with sla data when sla option is selected", () => {
      const scoreTable = jasmine.createSpyObj("scoreTable", ["reset"]);
      component.scoreTable = scoreTable;
      fixture.detectChanges();
      component.setTargetData(rowData);
      expect(component.targetSettings.get("targetSLA").value).toBe(92);
    });

    it("should format date values", () => {
      const formattedDate = component.getFormattedDate("2020-02-20", false);
      expect(formattedDate).toEqual("02/20/2020");
    });
  });

  describe("should save target values", () => {
    it("should call service to save newly added sla target data", () => {
      component.scoreTable = childComponent;
      component.targetSettings.get("targetSLA").setValue(99);
      component.targetSettings.get("turnAroundTime").setValue(7);
      component.targetSettings.get("slaName").setValue("productivity");
      const d = new Date();
      component.targetSettings.get("period").setValue(d);
      component.isEdit = false;
      const servSpy = spyOn(service, "saveSlaConfig");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call service to save sla target data", () => {
      component.scoreTable = childComponent;
      const d = new Date();
      component.targetSettings.get("targetSLA").setValue(99);
      component.targetSettings.get("turnAroundTime").setValue(7);
      component.targetSettings.get("slaName").setValue("productivity");
      component.targetSettings.get("period").setValue(d);
      component.isEdit = true;
      const servSpy = spyOn(service, "updateSlaConfig");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call save function", () => {
      component.scoreTable = childComponent;
      const d = new Date();
      component.targetSettings.get("targetSLA").setValue(99);
      component.targetSettings.get("turnAroundTime").setValue(7);
      component.targetSettings.get("slaName").setValue("productivity");
      component.targetSettings.get("period").setValue(d);
      component.isEdit = true;
      const spySave = spyOn(component, "saveTarget");
      const spyClear = spyOn(component, "clearData");
      fixture.detectChanges();
      component.saveTargetScore();
      expect(spySave).toHaveBeenCalled();
      expect(spyClear).toHaveBeenCalled();
    });
    it("should call service to update sla target data", () => {
      component.scoreTable = childComponent;
      const d = new Date();
      component.targetSettings.get("targetSLA").setValue(99);
      component.targetSettings.get("turnAroundTime").setValue(7);
      component.targetSettings.get("slaName").setValue("productivity");
      component.targetSettings.get("period").setValue(d);
      component.isEdit = true;
      const servSpy = spyOn(service, "updateSlaConfig");
      fixture.detectChanges();
      component.saveTarget();
      expect(servSpy).toHaveBeenCalled();
    });
  });
});
