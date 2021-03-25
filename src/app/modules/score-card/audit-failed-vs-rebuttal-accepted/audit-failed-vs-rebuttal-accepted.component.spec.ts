/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
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
import { of } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

import { AuditFailedVsRebuttalAcceptedComponent } from "./audit-failed-vs-rebuttal-accepted.component";

describe("AuditFailedVsRebuttalAcceptedComponent", () => {
  let component: AuditFailedVsRebuttalAcceptedComponent;
  let fixture: ComponentFixture<AuditFailedVsRebuttalAcceptedComponent>;
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
      declarations: [AuditFailedVsRebuttalAcceptedComponent],
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
    fixture = TestBed.createComponent(AuditFailedVsRebuttalAcceptedComponent);
    component = fixture.componentInstance;
    taskManagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("ngOnInit", () => {
    component.statusDates = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required]
    });
    const spy = spyOn(component, "getStatusDays");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it("showDialog", () => {
    component.showDialog();
    expect(component.displayEnlarged).toBeTruthy();
  });

  it("noDataChart", () => {
    component.getNoDataChart();
    expect(component.dataStatus).toEqual([["NO DATA", 1]]);
    console.log(JSON.stringify(component.dataStatus));
    expect(component.optionsStatus.pieSliceText).toEqual("label");
    expect(component.optionsStatus.tooltip.text).toEqual("none");
    expect(component.optionsStatus.legend.position).toEqual("none");
  });

  it("getDataChart", () => {
    component.dataStatus = [];
    const data = {
      auditStatusCountDtos: [
        {
          status: "Rebuttal Accepted",
          claimCount: 6
        },
        {
          status: "Rebuttal Failed",
          claimCount: 1
        }
      ]
    };
    component.auditStatusCountDto = data;
    const spy = spyOn(component, "mapResponseValue");
    component.getDataChart();
    expect(spy).toHaveBeenCalled();
    expect(component.optionsStatus.pieSliceText).toEqual("value");
    expect(component.optionsStatus.tooltip.text).toEqual("value");
    expect(component.optionsStatus.legend.position).toEqual("top");
  });

  it("getToDateValue", () => {
    component.statusDates = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    component.getToDateValue();
    expect(new Date(component.getToDateValue()).getDate()).toEqual(11);
    expect(new Date(component.getToDateValue()).getMonth()).toEqual(7);
    expect(new Date(component.getToDateValue()).getFullYear()).toEqual(2020);
  });

  it("mapResponseValue", () => {
    const a = [
      { status: "Rebuttal Accepted", claimCount: 6 },
      { status: "Rebuttal Failed", claimCount: 1 }
    ];
    const b = [
      { status: "Rebuttal Failed", claimCount: 0 },
      { status: "Rebuttal Accepted", claimCount: 0 }
    ];
    component.mapResponseValue(a, b);
    expect(component.dataStatus).toEqual([
      ["NO DATA", 1],
      ["Rebuttal Failed", 1],
      ["Rebuttal Accepted", 6]
    ]);
  });

  it("validateDates", () => {
    component.statusDates = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
    component.validateDates();
    expect(component.isValid).toBeTruthy();
    component.statusDates.get("dateRange").setValue([new Date(), new Date()]);
    component.validateDates();
    expect(component.isValid).toBeTruthy();
    component.statusDates
      .get("dateRange")
      .setValue([new Date(yester.setMonth(yester.getMonth() - 7)), new Date()]);
    component.validateDates();
    expect(component.isValid).toBeFalsy();
  });

  it("should calculate difference when from date is present", () => {
    const today = new Date();
    component.isValid = false;
    const todaysDate = new Date(
      component.datePipe.transform(today, "yyyy-MM-dd")
    );
    const defaultDateRange2 = [];
    defaultDateRange2.push(todaysDate);
    defaultDateRange2.push(todaysDate);
    component.statusDates.get("dateRange").setValue(defaultDateRange2);
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
    const defaultDateRange3 = [];
    defaultDateRange3.push(todaysDate);
    component.statusDates.get("dateRange").setValue(defaultDateRange3);
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
    const dat = new Date(component.datePipe.transform(sevenDate, "yyyy-MM-dd"));
    const defaultDateRange4 = [];
    defaultDateRange4.push(dat);
    defaultDateRange4.push(todaysDate);
    component.statusDates.get("dateRange").setValue(defaultDateRange4);
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
    const defaultDateRange5 = [];
    defaultDateRange5.push(todaysDate);
    defaultDateRange5.push(todaysDate);
    component.statusDates.get("dateRange").setValue(defaultDateRange5);
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
    const defaultDateRange1 = [];
    defaultDateRange1.push(todaysDate);
    defaultDateRange1.push(todaysDate);
    fixture.detectChanges();
    const diff = component.dateDifference(defaultDateRange1);
    expect(diff).toBe(0);
  });

  it("getFinDays", () => {
    // Set up
    const data = {
      auditStatusCountDtos: [
        {
          status: "Rebuttal Accepted",
          claimCount: 6
        },
        {
          status: "Rebuttal Failed",
          claimCount: 1
        }
      ]
    };
    component.statusDates = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required]
    });
    spyOn(taskManagementService, "getAuditFailedRebuttalAccepted");
    const spy = spyOn(
      taskManagementService,
      "getAuditFailedRebuttalAcceptedListner"
    ).and.returnValue(of(data));
    const spyData = spyOn(component, "getDataChart");
    component.getStatusDays();
    expect(component.auditStatusCountDto).toEqual(data);
    expect(spyData).toHaveBeenCalled();
  });

  it("getFinDays  without data", () => {
    const nodata = { auditStatusCountDtos: undefined };
    component.statusDates = new FormBuilder().group({
      dateRange: [defaultDateRange, Validators.required]
    });
    spyOn(taskManagementService, "getAuditFailedRebuttalAccepted");
    const spy = spyOn(
      taskManagementService,
      "getAuditFailedRebuttalAcceptedListner"
    ).and.returnValue(of(nodata));
    const spyNoData = spyOn(component, "getNoDataChart");
    component.getStatusDays();
    expect(component.auditStatusCountDto).toEqual(nodata);
    expect(spyNoData).toHaveBeenCalled();
  });

  it("ngonDestroy", () => {
    const spy = spyOn(
      component.statusSubscription,
      "unsubscribe"
    ).and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
