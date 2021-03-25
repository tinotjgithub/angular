import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ManagerProceduralScoreComponent } from "./manager-procedural-score.component";
import { GoogleChartsModule } from "angular-google-charts";
import { DatePipe } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuditDashboardService } from "src/app/modules/auditor/auditor-dashboard/audit-dashboard.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of } from "rxjs";

describe("ManagerProceduralScoreComponent", () => {
  let component: ManagerProceduralScoreComponent;
  let fixture: ComponentFixture<ManagerProceduralScoreComponent>;
  let service: AuditDashboardService;
  let taskManagementService: TaskmanagementService;

  const defaultDateRange = [];
  const yester = new Date("2020-08-12T08:19:25.520Z");
  yester.setDate(yester.getDate() - 1);
  const yesterdaysDate = new Date("2020-08-12T08:19:25.520Z");
  yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
  const threeMonthsBefore = new Date(yester.setMonth(yester.getMonth() - 3));
  defaultDateRange.push(threeMonthsBefore);
  defaultDateRange.push(yesterdaysDate);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerProceduralScoreComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        MultiSelectModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerProceduralScoreComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditDashboardService);
    taskManagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("ngOnInit", () => {
    localStorage.setItem("roleId", "Manager");
    const spy = spyOn(component, "getManagerClaimsExaminers");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it("ngAfterViewInit", () => {
    const spy = spyOn(component, "updateMultiSelectLabels");
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it("updateMultiSelectLabels", () => {
    component.updateMultiSelectLabels();
    expect(component.claimsExaminerSelect.updateLabel).toBeDefined();
  });
  const examiners = [
    {
      examinerId: 1,
      examinerName: "Jim Tom"
    },
    {
      examinerId: 2,
      examinerName: "Manju Varghese"
    }
  ];

  const examiners1 = [
    {
      examinerId: 1,
      examinerName: "Jim Tom 1"
    },
    {
      examinerId: 2,
      examinerName: "Manju Varghese 1"
    }
  ];

  it("getManagerClaimsExaminers", () => {
    const spy = spyOn(
      service,
      "getAuditorClaimsExaminersListner"
    ).and.returnValue(of(examiners));
    const spy1 = spyOn(component, "mapClaimsExaminers");
    spyOn(service, "getAuditorClaimsExaminers");
    component.role = "Claims Auditor";
    component.getManagerClaimsExaminers();
    expect(component.claimsExaminer).toEqual(examiners);
    expect(spy1).toHaveBeenCalled();
    const spy3 = spyOn(
      taskManagementService,
      "getManagerClaimsExaminersListner"
    ).and.returnValue(of(examiners1));
    spyOn(taskManagementService, "getManagerClaimsExaminers");
    component.role = "Manager";
    component.getManagerClaimsExaminers();
    expect(component.claimsExaminer).toEqual(examiners1);
    expect(spy1).toHaveBeenCalled();
  });

  it("mapClaimsExaminers", () => {
    component.procGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    component.claimsExaminer = examiners;
    component.mapClaimsExaminers();
    expect(component.claimsExaminerList).toEqual([
      { label: "Jim Tom", value: { id: 1, name: "Jim Tom", code: "Jim Tom" } },
      {
        label: "Manju Varghese",
        value: { id: 2, name: "Manju Varghese", code: "Manju Varghese" }
      }
    ]);
    expect(component.procGroup.get("examinerName").value).toEqual([
      { id: 1, name: "Jim Tom", code: "Jim Tom" },
      { id: 2, name: "Manju Varghese", code: "Manju Varghese" }
    ]);
  });

  it("validateDates", () => {
    component.procGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    component.validateDates();
    expect(
      component.procGroup.get("dateRange").hasError("inValidDate")
    ).toBeFalsy();
    expect(
      component.procGroup.get("dateRange").hasError("invalidPeriod")
    ).toBeFalsy();
    component.procGroup.get("dateRange").setValue([new Date(), new Date()]);
    component.validateDates();
    expect(
      component.procGroup.get("dateRange").hasError("inValidDate")
    ).toBeFalsy();
    expect(
      component.procGroup.get("dateRange").hasError("invalidPeriod")
    ).toBeTruthy();
    component.procGroup
      .get("dateRange")
      .setValue([new Date(yester.setMonth(yester.getMonth() - 7)), new Date()]);
    component.validateDates();
    expect(
      component.procGroup.get("dateRange").hasError("inValidDate")
    ).toBeTruthy();
    expect(
      component.procGroup.get("dateRange").hasError("invalidPeriod")
    ).toBeFalsy();
  });

  it("getMonths", () => {
    component.procGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    component.procGroup
      .get("dateRange")
      .setValue([new Date("10/10/2010"), new Date("11/10/2010")]);
    expect(
      component.getMonths(component.procGroup.get("dateRange").value)
    ).toEqual(1);
  });

  it("changeExaminers", () => {
    const spy1 = spyOn(component, "updateMultiSelectLabels");
    const spy2 = spyOn(component, "validateExaminerSelection");
    component.changeExaminers();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("validateExaminerSelection", () => {
    component.procGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    component.procGroup.get("examinerName").setValue(examiners);
    component.validateExaminerSelection();
    expect(
      component.procGroup.get("examinerName").hasError("examinersExceeded")
    ).toBeFalsy();
    let i = 0;
    while (i < 25) {
      examiners.push(examiners[1]);
      i++;
    }
    console.log(examiners.length);
    component.validateExaminerSelection();
    expect(
      component.procGroup.get("examinerName").hasError("examinersExceeded")
    ).toBeTruthy();
  });

  it("getFinChartNoValue", () => {
    component.ngOnInit();
    component.getProcChartNoValue();
    expect(component.myOptionsProc.legend.position).toEqual("none");
    expect(component.myOptionsProcEnlarged.legend.position).toEqual("none");
    expect(component.dataProc.length).toEqual(1);
  });

  it("getFinDays", () => {
    // Set up
    const a = {
      name: "Avg Procedural Score",
      ProceduralScoreAuditorDtos: [
        {
          monthStartDate: "2020-05-01",
          ProceduralAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          ProceduralAccuracy: 96.89,
          target: 99.0
        }
      ]
    };
    component.procGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: [examiners, Validators.required]
    });
    spyOn(service, "getAuditorProcScores");
    spyOn(service, "getAuditorProcScoresListner").and.returnValue(of(a));
    component.role = "Claims Auditor";
    component.getProcDays();
    expect(component.proceduralScoreManagerDtos).toEqual({
      name: "Avg Procedural Score",
      ProceduralScoreAuditorDtos: [
        { monthStartDate: "2020-05-01", ProceduralAccuracy: 97.53, target: 99 },
        { monthStartDate: "2020-06-01", ProceduralAccuracy: 96.89, target: 99 }
      ]
    });

    spyOn(taskManagementService, "getManagerProcScores");
    const spy1 = spyOn(
      taskManagementService,
      "getManagerProcScoresListner"
    ).and.returnValue(of(a));
    component.role = "Claims Lead";
    component.getProcDays();
    expect(component.proceduralScoreManagerDtos).toEqual({
      name: "Avg Procedural Score",
      ProceduralScoreAuditorDtos: [
        { monthStartDate: "2020-05-01", ProceduralAccuracy: 97.53, target: 99 },
        { monthStartDate: "2020-06-01", ProceduralAccuracy: 96.89, target: 99 }
      ]
    });
  });

  it("getProcChartValue", () => {
    const a = {
      name: "Avg Procedural Score",
      proceduralScoreAuditorTeamDtos: [
        {
          monthStartDate: "2020-05-01",
          ProceduralAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          ProceduralAccuracy: 96.89,
          target: 99.0
        }
      ]
    };

    const c = {
      name: "Avg Procedural Score",
      proceduralScoreLeadDtos: [
        {
          monthStartDate: "2020-05-01",
          ProceduralAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          ProceduralAccuracy: 96.89,
          target: 99.0
        }
      ]
    };
    const b = {
      name: "Avg Procedural Score",
      proceduralScoreManagerDtos: [
        {
          monthStartDate: "2020-05-01",
          ProceduralAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          ProceduralAccuracy: 96.89,
          target: 98.0
        },
        {
          monthStartDate: "2020-07-01",
          ProceduralAccuracy: 99.92,
          target: 98.0
        }
      ]
    };
    const d = {
      name: "Avg Procedural Score",
      proceduralScoreLeadDtos: null
    };
    component.role = "Manager";
    component.getProcChartValue(b);

    expect(component.dataProc).toEqual([
      ["May`20", undefined, undefined, 99, 99],
      ["Jun`20", undefined, undefined, 98, 98],
      ["Jul`20", undefined, undefined, 98, 98]
    ]);
    component.role = "Claims Auditor";
    component.getProcChartValue(a);
    expect(component.dataProc).toEqual([
      ["May`20", undefined, undefined, 99, 99],
      ["Jun`20", undefined, undefined, 99, 99]
    ]);

    component.role = "Claims Lead";
    component.getProcChartValue(c);
    expect(component.dataProc).toEqual([
      ["May`20", undefined, undefined, 99, 99],
      ["Jun`20", undefined, undefined, 99, 99]
    ]);
    component.role = "Claims Lead";
    component.getProcChartValue(d);
    expect(component.dataProc).toEqual([["NO DATA", 0, "0", 0, "0"]]);
  });

  it("getToDateValue", () => {
    component.procGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    expect(new Date(component.getToDateValue()).getDate()).toEqual(11);
    expect(new Date(component.getToDateValue()).getMonth()).toEqual(7);
    expect(new Date(component.getToDateValue()).getFullYear()).toEqual(2020);
  });

  it("mapClaimsExaminerList", () => {
    const exa = [{ id: 1, name: "A" }];
    component.mapClaimsExaminerList(exa);
    expect(component.claimsExaminerArray).toEqual([1]);
  });

  it("should get procedural score on submitting if examiner count is valid", () => {
    component.procGroup.controls.examinerName.setErrors({
      examinersExceeded: false
    });
    component.procGroup.get("examinerName").setValue(examiners);
    const spy = spyOn(component, "getProcDays");
    fixture.detectChanges();
    component.onSubmitProc();
    expect(spy).toHaveBeenCalled();
  });

  it("should not get procedural score on submitting if examiner count is invalid", () => {
    component.procGroup.controls.examinerName.setErrors({
      examinersExceeded: true
    });
    const spy = spyOn(component, "getProcDays");
    fixture.detectChanges();
    component.onSubmitProc();
    expect(spy).not.toHaveBeenCalled();
  });
});
