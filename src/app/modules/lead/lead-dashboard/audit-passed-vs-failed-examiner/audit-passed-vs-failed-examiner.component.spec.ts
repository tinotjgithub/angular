import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditPassedVsFailedExaminerComponent } from "./audit-passed-vs-failed-examiner.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import {
  passedVsFailed,
  leadUserGroups,
  managerEXaminers,
  managerTenExaminers
} from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ReportsModule } from 'src/app/modules/reports/reports.module';

class MockTaskMgtService extends TaskmanagementService {
  getLeadExaminerPassFailScores() {
    const prodArray: any = passedVsFailed;
    this.leadStatusScoresFetch.next(prodArray);
  }
  getManagerUserGroups() {
    const prodArray: any = leadUserGroups;
    this.managerUserGroupsSub.next(prodArray);
  }
  getLeadClaimsExaminers() {
    const prodArray: any = managerEXaminers;
    this.leadClaimsExaminersSub.next(prodArray);
  }
}

describe("AuditPassedVsFailedExaminerComponent", () => {
  let component: AuditPassedVsFailedExaminerComponent;
  let fixture: ComponentFixture<AuditPassedVsFailedExaminerComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditPassedVsFailedExaminerComponent],
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
    fixture = TestBed.createComponent(AuditPassedVsFailedExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage = fixture.debugElement.injector.get(CryptoService);
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditPassedVsFailedExaminerComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should map user groups for lead", () => {
      component.userGroup = [];
      const grp = [];
      grp.push({ id: 1, name: "Group A", code: "Group A" });
      grp.push({
        id: 2,
        name: "Group B",
        code: "Group B"
      });
      component.userGroupArray = [];
      fixture.detectChanges();
      component.mapUsergroupNameList(grp);
      expect(component.userGroupArray.length).toBeGreaterThan(0);
    });

    it("should map examiner for lead", () => {
      component.isStatusRendered = false;
      component.claimsExaminer = [];
      const userAuditScoreDtos = {
        userAuditScoreDto: [
          {
            examinerId: 7,
            examinerName: "Devika Kumari",
            passedAuditCount: 16,
            failedAuditCount: 8
          },
          {
            examinerId: 125,
            examinerName: "John Mathew",
            passedAuditCount: 1,
            failedAuditCount: 1
          }
        ]
      };
      component.claimsExaminerArray = [
        { examinerId: 7, examinerName: "Devika Kumari" },
        { examinerId: 10, examinerName: "Megha Murali" },
        { examinerId: 125, examinerName: "John Mathew" }
      ];
      fixture.detectChanges();
      component.mapLoadedExaminersToExaminers(userAuditScoreDtos);
      expect(component.isStatusRendered).toBeTruthy();
    });

    it("should not map examiner for lead when empty", () => {
      component.claimsExaminer = [];
      component.claimsExaminerArray = [
        { examinerId: 7, examinerName: "Devika Kumari" },
        { examinerId: 10, examinerName: "Megha Murali" },
        { examinerId: 125, examinerName: "John Mathew" }
      ];
      fixture.detectChanges();
      component.mapLoadedExaminersToExaminers([]);
      const exm = component.countByStatusGroup.get("examinerName").value;
      expect(exm.length).toEqual(0);
    });

    it("should not map user groups for lead when user group names are empty", () => {
      component.userGroup = [];
      const grp = [];
      component.userGroupArray = [];
      fixture.detectChanges();
      component.mapUsergroupNameList(grp);
      expect(component.userGroupArray.length).toEqual(0);
    });

    it("should not map examiner for lead when examiner names are undefined", () => {
      component.claimsExaminer = [];
      const grp = undefined;
      component.claimsExaminerArray = [];
      fixture.detectChanges();
      component.mapLoadedExaminersToExaminers(grp);
      expect(component.claimsExaminerArray.length).toEqual(0);
    });

    it("should map userGroup names for lead", () => {
      component.userGroup = [];
      component.userGroup = leadUserGroups;
      fixture.detectChanges();
      component.mapUserGroups();
      expect(component.userGroupList.length).toBeGreaterThan(0);
    });

    it("should map userGroup names for lead when no user group selected", () => {
      component.userGroup = [];
      fixture.detectChanges();
      component.mapUserGroups();
      expect(component.userGroupList.length).toEqual(0);
    });

    it("should map examiners for lead", () => {
      component.userGroup = [];
      const grp = [];
      grp.push({ id: 1, name: "Devika Kumari", code: "Devika Kumari" });
      grp.push({
        id: 2,
        name: "Brian Blaze",
        code: "Brain Blaze"
      });
      component.claimsExaminerArray = [];
      fixture.detectChanges();
      component.mapClaimsExaminerList(grp);
      expect(component.claimsExaminerArray.length).toBeGreaterThan(0);
    });

    it("should not map examiners for lead when examiner names are empty", () => {
      component.userGroup = [];
      const grp = [];
      component.claimsExaminerArray = [];
      fixture.detectChanges();
      component.mapClaimsExaminerList(grp);
      expect(component.claimsExaminerArray.length).toEqual(0);
    });

    it("should not map examiners for lead when examiner names are undefined", () => {
      component.userGroup = [];
      const grp = undefined;
      component.claimsExaminerArray = [];
      fixture.detectChanges();
      component.mapClaimsExaminerList(grp);
      expect(component.claimsExaminerArray.length).toEqual(0);
    });

    it("should map examiner names for lead", () => {
      component.claimsExaminer = [];
      component.claimsExaminer = managerEXaminers;
      fixture.detectChanges();
      component.mapClaimsExaminers(managerEXaminers);
      expect(component.claimsExaminerList.length).toBeGreaterThan(0);
    });

    it("should map userGroup names for lead when no user group selected", () => {
      component.claimsExaminer = [];
      fixture.detectChanges();
      component.mapClaimsExaminers([]);
      expect(component.claimsExaminerList.length).toEqual(0);
    });

    it("should fetch user groups for lead", () => {
      component.userGroup = [];
      component.enlargedDisplay = false;
      fixture.detectChanges();
      const res = { id: 4 };
      localStorage.setItem("user-details", JSON.stringify(res));
      const servSpy = spyOn(service, "getManagerUserGroups");
      component.getManagerUserGroups();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should fetch examiners for lead", () => {
      component.userGroup = [];
      component.enlargedDisplay = false;
      fixture.detectChanges();
      const res = { id: 4 };
      localStorage.setItem("user-details", JSON.stringify(res));
      const servSpy = spyOn(service, "getLeadClaimsExaminers");
      component.getLeadClaimsExaminers();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set displayEnlarded to true", () => {
      component.userGroup = [];
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should fetch examiner data on OK button click when userGroup is not empty", () => {
      component.emptyGroup = false;
      component.userGroup = [];
      const locSpy = spyOn(component, "getStatusDays");
      fixture.detectChanges();
      component.onSubmitStatus();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should not fetch examiner data on OK button click  when userGroup is empty", () => {
      component.userGroup = [];
      component.emptyGroup = true;
      const locSpy = spyOn(component, "getStatusDays");
      fixture.detectChanges();
      component.onSubmitStatus();
      expect(locSpy).not.toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.userGroup = [];
      component.dataStatus = [];
      fixture.detectChanges();
      component.getStatusChartNoValue();
      expect(component.dataStatus[0]).toEqual(["NO DATA", 0, "0", 0, "0"]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.userGroup = [];
      component.optionsStatus.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getStatusChartNoValue();
      expect(component.optionsStatus.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.userGroup = [];
      component.optionsStatus.legend.position = "top";
      fixture.detectChanges();
      component.getStatusChartNoValue();
      expect(component.optionsStatus.legend.position).toBe("none");
    });
    it("should map response value when response value is present", () => {
      component.dataStatus = [];
      const pass = {
        userAuditScoreDto: [
          {
            examinerId: 7,
            examinerName: "Devika Kumari",
            passedAuditCount: 16,
            failedAuditCount: 8
          },
          {
            examinerId: 125,
            examinerName: "John Mathew",
            passedAuditCount: 1,
            failedAuditCount: 1
          }
        ]
      };
      const passd = [
        {
          userAuditScoreDto: {
            examinerName: "Devika Kumari",
            failedAuditCount: 8,
            passedAuditCount: 16
          }
        },
        {
          userAuditScoreDto: {
            examinerName: "John Mathew",
            failedAuditCount: 1,
            passedAuditCount: 1
          }
        }
      ];
      spyOn(component, "setLeadChartOptions");
      spyOn(component, "mapParsedResponseValue");
      spyOn(component, "parseResponseValue").and.returnValue(passd);
      component.getStatusChartValue(pass);
      fixture.detectChanges();
      const l = component.dataStatus.length;
      expect(l).toBeGreaterThan(0);
    });

    it("should validate examiners return false if it is less than 10", () => {
      component.countByStatusGroup
        .get("examinerName")
        .setValue(managerEXaminers);
      component.validateExaminerSelection();
      expect(component.examinersExceeded).toBeFalsy();
    });
    it("should validate examiners return true if it is greater than 10", () => {
      component.countByStatusGroup
        .get("examinerName")
        .setValue(managerTenExaminers);
      component.validateExaminerSelection();
      expect(component.examinersExceeded).toBeTruthy();
    });
    it("should set lead chart options", () => {
      component.dataStatus = [];
      component.userGroup = [];
      component.claimsExaminer = [];
      component.dataStatus = passedVsFailed.userAuditScoreDto;
      fixture.detectChanges();
      component.setLeadChartOptions();
      expect(component.optionsStatusEnlarged.height).toEqual(400);
      expect(component.optionsStatus.height).toEqual(120);
    });

    it("should map parsed response value when parsed response value is present", () => {
      const pass = [
        {
          userAuditScoreDto: {
            examinerName: "Devika Kumari",
            failedAuditCount: 8,
            passedAuditCount: 16
          }
        },
        {
          userAuditScoreDto: {
            examinerName: "John Mathew",
            failedAuditCount: 1,
            passedAuditCount: 1
          }
        }
      ];
      const resp = {
        userAuditScoreDto: [
          {
            examinerId: 7,
            examinerName: "Devika Kumari",
            passedAuditCount: 16,
            failedAuditCount: 8
          },
          {
            examinerId: 125,
            examinerName: "John Mathew",
            passedAuditCount: 1,
            failedAuditCount: 1
          }
        ]
      };
      fixture.detectChanges();
      const parsed = component.mapParsedResponseValue(resp, pass);
      expect(parsed).toEqual(pass);
    });

    it("should parse response value when response value is not present", () => {
      fixture.detectChanges();
      const parsedRes = component.parseResponseValue({ userAuditScoreDto: [] });
      expect(parsedRes.length).toEqual(0);
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
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
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
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditPassedVsFailedExaminerComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch lead passed failed data", () => {
      component.userGroup = [];
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      const servSpy = spyOn(service, "getLeadExaminerPassFailScores");
      fixture.detectChanges();
      component.getStatusDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      const today = new Date();
      component.userGroup = [];
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getLeadExaminerPassFailScores").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getStatusChartNoValue");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is null", () => {
      const today = new Date();
      component.userGroup = [];
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(service, "getLeadExaminerPassFailScores").and.returnValue(null);
      const locSpy = spyOn(component, "getStatusChartNoValue");
      fixture.detectChanges();
      component.getStatusDays();
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
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      fixture.detectChanges();
      component.getStatusDays();
      expect(component.isStatusRendered).toBeTruthy();
    });
  });

  describe("should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditPassedVsFailedExaminerComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set empty userGroup to false when to userGroup is present", () => {
      const grp = [];
      grp.push({ id: 1, name: "Group A", code: "Group A" });
      grp.push({
        id: 2,
        name: "Group B",
        code: "Group B"
      });
      component.countByStatusGroup.get("userGroupName").setValue(grp);
      fixture.detectChanges();
      component.validateGrp();
      expect(component.emptyGroup).toBeFalsy();
    });

    it("should set empty userGroup to false when to examiner is present", () => {
      const ex = [];
      ex.push({ id: 1, name: "Devika", code: "Devika" });
      ex.push({
        id: 2,
        name: "Brian Blaze",
        code: "Brian Blaze"
      });
      component.countByStatusGroup.get("examinerName").setValue(ex);
      fixture.detectChanges();
      component.validateExm();
      expect(component.emptyExm).toBeFalsy();
    });

    it("should set empty userGroup to true when to examiner is not present", () => {
      const ex = [];
      component.countByStatusGroup.get("examinerName").setValue(ex);
      fixture.detectChanges();
      component.validateExm();
      expect(component.emptyExm).toBeTruthy();
    });

    it("should set empty userGroup to true when to userGroup is not present", () => {
      const grp = [];
      component.countByStatusGroup.get("userGroupName").setValue(grp);
      fixture.detectChanges();
      component.validateGrp();
      expect(component.emptyGroup).toBeTruthy();
    });
    it("should calculate difference when from date is present", () => {
      component.userGroup = [];
      const today = new Date();
      component.inValidDate = true;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      const locSpy = spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set invalidity to true when diffrence is more than 6 months", () => {
      component.userGroup = [];
      const today = new Date();
      component.inValidDate = true;
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
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(component.inValidDate).toBeTruthy();
    });
    it("should set set invalidity to false when diffrence is less than 6 months", () => {
      component.userGroup = [];
      const today = new Date();
      component.inValidDate = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths").and.returnValue(0);
      fixture.detectChanges();
      component.validateDates();
      expect(component.inValidDate).toBeFalsy();
    });
    it("should set validilty to false when to date is not present", () => {
      const today = new Date();
      component.inValidDate = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(component.inValidDate).toBeFalsy();
    });
    it("should set validilty to true when to date is present", () => {
      const today = new Date();
      component.inValidDate = false;
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const defaultDateRange = [];
      defaultDateRange.push(todaysDate);
      defaultDateRange.push(todaysDate);
      component.countByStatusGroup.get("dateRange").setValue(defaultDateRange);
      spyOn(component, "getMonths");
      fixture.detectChanges();
      component.validateDates();
      expect(component.inValidDate).toBeTruthy();
    });
    it("should calculate difference between two dates", () => {
      component.userGroup = [];
      const today = new Date();
      component.inValidDate = true;
      const defaultDateRange = [];
      defaultDateRange.push(new Date("12/12/2012"));
      defaultDateRange.push(new Date("12/06/2012"));
      fixture.detectChanges();
      const diff = component.getMonths(defaultDateRange);
      expect(diff).toBe(0);
    });
  });
});
