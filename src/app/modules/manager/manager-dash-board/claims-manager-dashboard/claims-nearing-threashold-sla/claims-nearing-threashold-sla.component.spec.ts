import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsNearingThreasholdSlaComponent } from "./claims-nearing-threashold-sla.component";
import { GoogleChartsModule } from "angular-google-charts";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { MessageService } from "primeng/api";
import { RouterModule } from "@angular/router";
import { openInventry } from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ReportsModule } from "src/app/modules/reports/reports.module";
import { ComponentsModule } from "src/app/shared/components/components.module";

class MockTaskMgtService extends TaskmanagementService {
  getClaimsThreashold() {
    const prodArray: any = openInventry;
    this.managerAgeScoresFetch.next(prodArray);
  }
}

describe("ClaimsNearingThreasholdSlaComponent", () => {
  let component: ClaimsNearingThreasholdSlaComponent;
  let fixture: ComponentFixture<ClaimsNearingThreasholdSlaComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      //   declarations: [ClaimsNearingThreasholdSlaComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        MultiSelectModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ReportsModule,
        ComponentsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe,
        MessageService
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsNearingThreasholdSlaComponent);
    component = fixture.componentInstance;
    localStorage = fixture.debugElement.injector.get(CryptoService);
    localStorage.setItem("user-details", JSON.stringify({ id: 1 }));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsNearingThreasholdSlaComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should set enlarged Display as true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });

    it("should openpopup when selected object has values", () => {
      const e = [];
      e.push({ column: 1, row: 2 });
      component.editMode = false;
      component.dataThreshold = openInventry.claimsInventoryDto;
      fixture.detectChanges();
      component.openPopUp(e);
      expect(component.editMode).toBeTruthy();
    });

    it("should close popup", () => {
      component.editMode = true;
      fixture.detectChanges();
      component.closePopUp();
      expect(component.editMode).toBeFalsy();
    });

    it("should not openpopup when selected object has no values", () => {
      const e = [];
      component.editMode = false;
      fixture.detectChanges();
      component.openPopUp(e);
      expect(component.editMode).toBeFalsy();
    });

    it("should fetch managerClaimsCountByVol data on OK button click", () => {
      const locSpy = spyOn(component, "getClaimsThreashold");
      component.onSubmitThreshold();
      const fbAge = new FormBuilder();
      expect(locSpy).toHaveBeenCalled();
      component.thresholdGroup = fbAge.group({
        days: "Default"
      });
      component.onSubmitThreshold();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataThreshold = [];
      fixture.detectChanges();
      component.getClaimsThreasholdChartNoValue();
      expect(component.dataThreshold[0]).toEqual([
        "NO DATA",
        0,
        "0",
        "#800909"
      ]);
    });

    it("should set SLA array as false when only one SLA value is present", () => {
      component.isSLAArray = true;
      const arr = [{ month: "2020-10-01", target: 44 }];
      fixture.detectChanges();
      component.setThresholddays(arr);
      expect(component.isSLAArray).toBeFalsy();
    });

    it("should set SLA value", () => {
      component.daysList = [];
      component.isSLAArray = true;
      const arr = [{ month: "2020-10-01", target: 44 }];
      fixture.detectChanges();
      component.setThresholddays(arr);
      expect(component.daysList.length).toBeGreaterThan(0);
    });

    it("should set SLA array as false when all SLA values are same", () => {
      component.isSLAArray = true;
      const arr = [
        { month: "2020-10-01", target: 44 },
        { month: "2020-11-01", target: 44 }
      ];
      fixture.detectChanges();
      component.setThresholddays(arr);
      expect(component.isSLAArray).toBeFalsy();
    });
    it("should set SLA array as false when SLA values are different", () => {
      component.isSLAArray = true;
      const arr = [
        { month: "2020-10-01", target: 44 },
        { month: "2020-11-01", target: 47 }
      ];
      fixture.detectChanges();
      component.setThresholddays(arr);
      expect(component.isSLAArray).toBeTruthy();
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsThreshold.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getClaimsThreasholdChartNoValue();
      expect(component.optionsThreshold.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsThreshold.legend.position = "top";
      fixture.detectChanges();
      component.getClaimsThreasholdChartNoValue();
      expect(component.optionsThreshold.legend.position).toBe("none");
    });
    it("should set data when response value is present", () => {
      component.dataThreshold = [];
      component.claimsCount = openInventry.claimsInventoryDto;
      fixture.detectChanges();
      component.getClaimsThreasholdChartValue();
      const l = component.dataThreshold.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should set data to no data when response value is empty", () => {
      component.dataThreshold = [];
      component.claimsCount = null;
      fixture.detectChanges();
      const locSpy = spyOn(component, "getClaimsThreasholdChartNoValue");
      component.getClaimsThreasholdChartValue();
      const l = component.dataThreshold.length;
      expect(l).toEqual(0);
      expect(locSpy).toHaveBeenCalled();
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsNearingThreasholdSlaComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch data", () => {
      const defaultDays = "Default";
      component.thresholdGroup.get("days").setValue(defaultDays);
      const servSpy = spyOn(service, "getClaimsThreashold").and.returnValue(
        openInventry
      );
      fixture.detectChanges();
      component.getClaimsThreashold();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      const defaultDays = "Default";
      component.thresholdGroup.get("days").setValue(defaultDays);
      spyOn(service, "getClaimsThreashold").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getClaimsThreasholdChartNoValue");
      fixture.detectChanges();
      component.getClaimsThreashold();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is empty", () => {
      const defaultDays = "Default";
      component.thresholdGroup.get("days").setValue(defaultDays);
      spyOn(service, "getClaimsThreashold").and.returnValue([]);
      component.claimsCount = [];
      const locSpy = spyOn(component, "getClaimsThreasholdChartNoValue");
      fixture.detectChanges();
      component.getClaimsThreashold();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is null", () => {
      const defaultDays = "Default";
      component.thresholdGroup.get("days").setValue(defaultDays);
      spyOn(service, "getClaimsThreashold").and.returnValue(null);
      component.claimsCount = null;
      const locSpy = spyOn(component, "getClaimsThreasholdChartNoValue");
      fixture.detectChanges();
      component.getClaimsThreashold();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is null", () => {
      const defaultDays = "Default";
      component.thresholdGroup.get("days").setValue(defaultDays);
      spyOn(service, "getClaimsThreashold").and.returnValue(null);
      const locSpy = spyOn(component, "getClaimsThreasholdChartNoValue");
      fixture.detectChanges();
      component.getClaimsThreashold();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      const defaultDays = "Default";
      component.thresholdGroup.get("days").setValue(defaultDays);
      fixture.detectChanges();
      component.getClaimsThreashold();
      expect(component.isExaminerCountRendered).toBeTruthy();
    });
  });
});
