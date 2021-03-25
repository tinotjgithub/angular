/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ManagerFinancialScoreComponent } from "./manager-financial-score.component";
import { CommonModule, DatePipe } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { GoogleChartsModule } from "angular-google-charts";
import { DialogModule } from "primeng/dialog";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TooltipModule } from "primeng/tooltip";
import { AuditDashboardService } from "src/app/modules/auditor/auditor-dashboard/audit-dashboard.service";
import { of } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

describe("ManagerFinancialScoreComponent", () => {
  let component: ManagerFinancialScoreComponent;
  let service: AuditDashboardService;
  let taskManagementService: TaskmanagementService;
  let fixture: ComponentFixture<ManagerFinancialScoreComponent>;

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
      declarations: [ManagerFinancialScoreComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        GoogleChartsModule,
        CommonModule,
        CalendarModule,
        DialogModule,
        TooltipModule,
        MultiSelectModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerFinancialScoreComponent);
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
    component.finGroup = new FormBuilder().group({
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
    expect(component.finGroup.get("examinerName").value).toEqual([
      { id: 1, name: "Jim Tom", code: "Jim Tom" },
      { id: 2, name: "Manju Varghese", code: "Manju Varghese" }
    ]);
  });

  it("validateDates", () => {
    component.finGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    component.validateDates();
    expect(
      component.finGroup.get("dateRange").hasError("inValidDate")
    ).toBeFalsy();
    expect(
      component.finGroup.get("dateRange").hasError("invalidPeriod")
    ).toBeFalsy();
    component.finGroup.get("dateRange").setValue([new Date(), new Date()]);
    component.validateDates();
    expect(
      component.finGroup.get("dateRange").hasError("inValidDate")
    ).toBeFalsy();
    expect(
      component.finGroup.get("dateRange").hasError("invalidPeriod")
    ).toBeTruthy();
    component.finGroup
      .get("dateRange")
      .setValue([new Date(yester.setMonth(yester.getMonth() - 7)), new Date()]);
    component.validateDates();
    expect(component.finGroup.get('dateRange').getError("inValidDate")).toBeTruthy();
  });

  it("getMonths", () => {
    component.finGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    component.finGroup
      .get("dateRange")
      .setValue([new Date("10/10/2010"), new Date("11/10/2010")]);
    expect(
      component.getMonths(component.finGroup.get("dateRange").value)
    ).toEqual(1);
  });

  it("changeExaminers", () => {
    const spy1 = spyOn(component, "updateMultiSelectLabels");
    const spy2 = spyOn(component, "validateExaminerSelection");
    component.changeExaminers();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("validateExaminerSelection when examiners exceeded", () => {
    component.finGroup
      .get("dateRange")
      .setValue([new Date("10/10/2010"), new Date("11/10/2010")]);
    let i = 0;
    while (i > 30) {
      examiners.push(examiners[i]);
      i++;
    }
    component.finGroup.get("examinerName").setValue(examiners);
    fixture.detectChanges();
    component.validateExaminerSelection();
    expect(
      component.finGroup.get("examinerName").hasError("examinersExceeded")
    ).toBeTruthy();
  });

  it("validateExaminerSelection when examiners have not exceeded", () => {
    component.finGroup
      .get("dateRange")
      .setValue([new Date("10/10/2010"), new Date("11/10/2010")]);
    component.finGroup.get("examinerName").setValue([
      {
        examinerId: 1,
        examinerName: "Jim Tom"
      }
    ]);
    fixture.detectChanges();
    component.validateExaminerSelection();
    expect(
      component.finGroup.get("examinerName").hasError("examinersExceeded")
    ).toBeFalsy();
  });

  it("getFinChartNoValue", () => {
    component.ngOnInit();
    component.getFinChartNoValue();
    expect(component.myOptionsFin.legend.position).toEqual("none");
    expect(component.myOptionsFinEnlarged.legend.position).toEqual("none");
    expect(component.dataFin.length).toEqual(1);
  });

  it("getFinDays", () => {
    // Set up
    const a = {
      name: "Avg Financial Score",
      financialScoreAuditorDtos: [
        {
          monthStartDate: "2020-05-01",
          financialAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          financialAccuracy: 96.89,
          target: 99.0
        }
      ]
    };
    component.finGroup = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: [examiners, Validators.required]
    });
    spyOn(service, "getAuditorFinScores");
    const spy = spyOn(service, "getAuditorFinScoresListner").and.returnValue(
      of(a)
    );
    component.role = "Claims Auditor";
    component.getFinDays();
    expect(component.financialScoreManagerDtos).toEqual({
      name: "Avg Financial Score",
      financialScoreAuditorDtos: [
        { monthStartDate: "2020-05-01", financialAccuracy: 97.53, target: 99 },
        { monthStartDate: "2020-06-01", financialAccuracy: 96.89, target: 99 }
      ]
    });

    spyOn(taskManagementService, "getManagerFinScores");
    const spy1 = spyOn(
      taskManagementService,
      "getManagerFinScoresListner"
    ).and.returnValue(of(a));
    component.role = "Claims Lead";
    component.getFinDays();
    expect(component.financialScoreManagerDtos).toEqual({
      name: "Avg Financial Score",
      financialScoreAuditorDtos: [
        { monthStartDate: "2020-05-01", financialAccuracy: 97.53, target: 99 },
        { monthStartDate: "2020-06-01", financialAccuracy: 96.89, target: 99 }
      ]
    });
  });

  it("getFinChartValue", () => {
    const a = {
      name: "Avg Financial Score",
      financialScoreAuditorDtos: [
        {
          monthStartDate: "2020-05-01",
          financialAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          financialAccuracy: 96.89,
          target: 99.0
        }
      ]
    };

    const c = {
      name: "Avg Financial Score",
      financialScoreLeadDtos: [
        {
          monthStartDate: "2020-05-01",
          financialAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          financialAccuracy: 96.89,
          target: 99.0
        }
      ]
    };
    const b = {
      name: "Avg Procedural Score",
      financialScoreManagerDtos: [
        {
          monthStartDate: "2020-05-01",
          financialAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          financialAccuracy: 96.89,
          target: 98.0
        },
        {
          monthStartDate: "2020-07-01",
          financialAccuracy: 99.92,
          target: 98.0
        }
      ]
    };
    const d = {
      name: "Avg Procedural Score",
      financialScoreLeadDtos: null
    };
    component.role = "Manager";
    component.getFinChartValue(b);
    expect(component.dataFin).toEqual([
      ["May`20", 97.53, 97.53, 99, 99],
      ["Jun`20", 96.89, 96.89, 98, 98],
      ["Jul`20", 99.92, 99.92, 98, 98]
    ]);
    component.role = "Claims Auditor";
    component.getFinChartValue(a);
    expect(component.dataFin).toEqual([
      ["May`20", 97.53, 97.53, 99, 99],
      ["Jun`20", 96.89, 96.89, 99, 99]
    ]);
    component.role = "Claims Lead";
    component.getFinChartValue(c);
    expect(component.dataFin).toEqual([
      ["May`20", 97.53, 97.53, 99, 99],
      ["Jun`20", 96.89, 96.89, 99, 99]
    ]);
    component.role = "Claims Lead";
    component.getFinChartValue(d);
    expect(component.dataFin).toEqual([["NO DATA", 0, "0", 0, "0"]]);
  });

  it("getToDateValue", () => {
    component.finGroup = new FormBuilder().group({
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

  it("should not get financial score on submitting if examiner count is invalid", () => {
    component.examinersExceeded = true;
    const spy = spyOn(component, "getFinDays");
    fixture.detectChanges();
    component.onSubmitFin();
    expect(spy).not.toHaveBeenCalled();
  });

  it("should get financial score on submitting if examiner count is valid", () => {
    component.examinersExceeded = false;
    const spy = spyOn(component, "getFinDays");
    fixture.detectChanges();
    component.onSubmitFin();
    expect(spy).not.toHaveBeenCalled();
  });
});
