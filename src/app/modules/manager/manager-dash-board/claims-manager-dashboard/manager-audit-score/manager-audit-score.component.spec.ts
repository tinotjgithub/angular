import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ManagerAuditScoreComponent } from "./manager-audit-score.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import {
  userGroupNames,
  userGroups,
  auditStatus
} from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockTaskMgtService extends TaskmanagementService {
  getManagerAuditScores() {
    const prodArray: any = auditStatus;
    this.managerAuditScoresFetch.next(prodArray);
  }
  getManagerUserGroups() {
    const grpArray: any = userGroups;
    this.managerUserGroupsSub.next(grpArray);
  }
}

describe("ManagerAuditScoreComponent", () => {
  let component: ManagerAuditScoreComponent;
  let fixture: ComponentFixture<ManagerAuditScoreComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerAuditScoreComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        MultiSelectModule,
        HttpClientTestingModule,
        ReportsModule
      ],
      providers: [
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAuditScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ManagerAuditScoreComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should map user groups for manager", () => {
      component.userGroupList = [];
      component.userGroup = [];
      component.userGroup.push({
        groupId: 3,
        groupName: "Group A"
      });
      component.userGroup.push({
        groupId: 2,
        groupName: "Group B"
      });
      fixture.detectChanges();
      component.mapUserGroups();
      expect(component.userGroupList.length).toBeGreaterThan(0);
    });
    it("should not map user groups for manager when user group names are empty", () => {
      component.userGroupList = [];
      component.userGroup = [];
      fixture.detectChanges();
      component.mapUserGroups();
      expect(component.userGroupList.length).toEqual(0);
    });

    it("should not map user groups for manager when user group names are undefined", () => {
      component.userGroupList = [];
      component.userGroup = undefined;
      fixture.detectChanges();
      component.mapUserGroups();
      expect(component.userGroupList.length).toEqual(0);
    });

    it("should map userGroup names for manager", () => {
      const userGroupName = userGroupNames;
      component.userGroup = [];
      fixture.detectChanges();
      component.mapUserGroupList(userGroupName);
      expect(component.userGroupArray.length).toBeGreaterThan(0);
    });

    it("should not map userGroup names for manager when empty", () => {
      component.userGroup = [];
      fixture.detectChanges();
      component.mapUserGroupList([]);
      expect(component.userGroupArray.length).toEqual(0);
    });

    it("should fetch user groups for manager", () => {
      component.userGroup = [];
      component.enlargedDisplay = false;
      fixture.detectChanges();
      const res = { id: 4 };
      localStorage.setItem("user-details", JSON.stringify(res));
      const servSpy = spyOn(service, "getManagerUserGroups");
      component.getManagerUserGroups();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set displayEnlarded to true", () => {
      component.userGroup = [];
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should fetch auditStatus data on OK button click when userGroup is not empty", () => {
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
      // component.auditDates.get("dateRange").setErrors({ emptyGroup: false });
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      component.auditDates.get("userGroupName").setValue(userGroupNames);
      const locSpy = spyOn(component, "getAuditDays");
      fixture.detectChanges();
      component.onSubmitAudit();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should not fetch auditStatus data on OK button click  when userGroup is empty", () => {
      component.userGroup = [];
      // component.auditDates.get("dateRange").setErrors({ emptyGroup: true });
      const locSpy = spyOn(component, "getAuditDays");
      fixture.detectChanges();
      component.onSubmitAudit();
      expect(locSpy).not.toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.userGroup = [];
      component.dataAudit = [];
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.dataAudit[0]).toEqual(["NO DATA", 0, "0", 0, "0"]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.userGroup = [];
      component.optionsAudit.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.userGroup = [];
      component.optionsAudit.legend.position = "top";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.legend.position).toBe("none");
    });
    it("should map response value when response value is present", () => {
      component.dataAudit = [];
      component.optionsAudit.legend.position = "top";
      component.optionsAudit.tooltip.trigger = "focus";
      component.optionsAuditEnlarged.legend.position = "top";
      component.optionsAuditEnlarged.tooltip.trigger = "focus";
      component.userAuditScoreDto = auditStatus;
      const locSpy = spyOn(component, "setManagerChartOptions");
      fixture.detectChanges();
      component.getAuditChartValue();
      const l = component.dataAudit.length;
      expect(l).toBeGreaterThan(0);
      expect(locSpy).toHaveBeenCalled();
    });

    it("should set manager chart options", () => {
      component.dataAudit = [];
      component.userGroup = [];
      component.dataAudit = auditStatus;
      fixture.detectChanges();
      component.setManagerChartOptions();
      expect(component.optionsAuditEnlarged.height).toEqual(400);
      expect(component.optionsAudit.height).toEqual(400);
    });

    it("should map response when response value is present", () => {
      component.userAuditScoreDto = auditStatus;
      component.dataAudit = [];
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.dataAudit.length).not.toEqual(0);
    });

    it("should not map when response value is empty", () => {
      component.userAuditScoreDto = [];
      component.dataAudit = [];
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.dataAudit.length).toEqual(0);
    });

    it("should set to date value as to date itself when to date is present", () => {
      const today = new Date();
      component.userGroup = [];
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
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(dat);
    });
    it("should set to date value as from date value when to date is undefined", () => {
      component.userGroup = [];
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ManagerAuditScoreComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch manager userGroup data", () => {
      component.userGroup = [];
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getManagerAuditScores");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when error occurs", () => {
      const today = new Date();
      component.userGroup = [];
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerAuditScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      const today = new Date();
      component.userGroup = [];
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerAuditScores").and.returnValue([]);
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is null", () => {
      const today = new Date();
      component.userGroup = [];
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getManagerAuditScores").and.returnValue(null);
      component.userAuditScoreDto = null;
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      component.userGroup = [];
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getAuditDays();
      expect(component.isAuditRendered).toBeTruthy();
    });
  });

  describe("should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ManagerAuditScoreComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set empty userGroup to false when to userGroup is present", () => {
      const que = [];
      que.push({ id: 1, name: "Medi Care", code: "Medi Care" });
      que.push({
        id: 2,
        name: "HPS Special Care Unit",
        code: "HPS Special Care Unit"
      });
      component.auditDates.get("userGroupName").setValue(que);
      fixture.detectChanges();
      component.changeUserGroups();
      expect(
        component.auditDates.get("userGroupName").hasError("emptyGroup")
      ).toBeFalsy();
    });
    it("should set empty userGroup to true when to userGroup is not present", () => {
      const que = [];
      component.auditDates.get("userGroupName").setValue(que);
      fixture.detectChanges();
      component.changeUserGroups();
      expect(
        component.auditDates.get("userGroupName").invalid
      ).toBeTruthy();
    });
    it("should calculate difference when from date is present", () => {
      component.userGroup = [];
      const today = new Date();
      component.isValid = true;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set validity to false when diffrence is more than 6 months", () => {
      component.userGroup = [];
      const today = new Date();
      component.isValid = true;
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
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.auditDates.get("dateRange").hasError("inValidDate")
      ).toBeTruthy();
    });
    it("should set set validity to true when diffrence is less than 6 months", () => {
      component.userGroup = [];
      const today = new Date();
      component.isValid = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.auditDates.get("dateRange").hasError("inValidDate")
      ).toBeFalsy();
    });
    it("should set validilty to false when to date is not present", () => {
      component.isValid = true;
      component.auditDates.get("dateRange").setValue("");
      const defaultDateRange = [];
      defaultDateRange.push(new Date(""));
      defaultDateRange.push(new Date("12/12/2012"));
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.auditDates.get("dateRange").hasError("inValidDate")
      ).toBeTruthy();
    });
    it("should set validilty to true when to date is present", () => {
      component.isValid = false;
      component.auditDates.get("dateRange").setValue("");
      const defaultDateRange = [];
      defaultDateRange.push(new Date("12/12/2012"));
      defaultDateRange.push(new Date("12/06/2012"));
      component.auditDates.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.validateDates();
      expect(
        component.auditDates.get("dateRange").hasError("inValidDate")
      ).toBeFalsy();
    });
    it("should calculate difference between two dates", () => {
      component.userGroup = [];
      const today = new Date();
      component.isValid = true;
      const defaultDateRange = [];
      defaultDateRange.push(new Date("12/12/2012"));
      defaultDateRange.push(new Date("12/06/2012"));
      fixture.detectChanges();
      const diff = component.getMonths(defaultDateRange);
      expect(diff).toBe(0);
    });
  });
});
