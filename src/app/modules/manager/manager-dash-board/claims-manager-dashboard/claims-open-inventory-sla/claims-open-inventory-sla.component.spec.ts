import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsOpenInventorySlaComponent } from "./claims-open-inventory-sla.component";
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
  getClaimsOpenInventory() {
    const prodArray: any = openInventry;
    this.claimsOpenInvFetch.next(prodArray);
  }
}

describe("ClaimsOpenInventorySlaComponent", () => {
  let component: ClaimsOpenInventorySlaComponent;
  let fixture: ComponentFixture<ClaimsOpenInventorySlaComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      //   declarations: [ClaimsOpenInventorySlaComponent],
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
    fixture = TestBed.createComponent(ClaimsOpenInventorySlaComponent);
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
      fixture = TestBed.createComponent(ClaimsOpenInventorySlaComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should set enlarged Display as true", () => {
      component.enlargedDisplay = false;
      component.dataInventory = openInventry.claimsInventoryDto;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });

    it("should openpopup when selected object has values", () => {
      const e = [];
      e.push({ column: 1, row: 2 });
      component.editMode = false;
      component.dataInventory = openInventry.claimsInventoryDto;
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
      const locSpy = spyOn(component, "getClaimsOpenInventory");
      component.onSubmitOpenInv();
      const fbAge = new FormBuilder();
      expect(locSpy).toHaveBeenCalled();
      component.invGroup = fbAge.group({
        days: "Default"
      });
      component.onSubmitOpenInv();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataInventory = [];
      fixture.detectChanges();
      component.getClaimsOpenInventoryChartNoValue();
      expect(component.dataInventory[0]).toEqual([
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
      component.setSlaDays(arr);
      expect(component.isSLAArray).toBeFalsy();
    });

    it("should set SLA value", () => {
      component.daysList = [];
      component.isSLAArray = true;
      const arr = [{ month: "2020-10-01", target: 44 }];
      fixture.detectChanges();
      component.setSlaDays(arr);
      expect(component.daysList.length).toBeGreaterThan(0);
    });

    it("should set SLA array as false when all SLA values are same", () => {
      component.isSLAArray = true;
      const arr = [
        { month: "2020-10-01", target: 44 },
        { month: "2020-11-01", target: 44 }
      ];
      fixture.detectChanges();
      component.setSlaDays(arr);
      expect(component.isSLAArray).toBeFalsy();
    });
    it("should set SLA array as false when SLA values are different", () => {
      component.isSLAArray = true;
      const arr = [
        { month: "2020-10-01", target: 44 },
        { month: "2020-11-01", target: 47 }
      ];
      fixture.detectChanges();
      component.setSlaDays(arr);
      expect(component.isSLAArray).toBeTruthy();
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsOpenInv.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getClaimsOpenInventoryChartNoValue();
      expect(component.optionsOpenInv.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsOpenInv.legend.position = "top";
      fixture.detectChanges();
      component.getClaimsOpenInventoryChartNoValue();
      expect(component.optionsOpenInv.legend.position).toBe("none");
    });
    it("should set data when response value is present", () => {
      component.dataInventory = [];
      component.claimsCount = openInventry.claimsInventoryDto;
      fixture.detectChanges();
      component.getClaimsOpenInventoryChartValue();
      const l = component.dataInventory.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should set data to no data when response value is empty", () => {
      component.dataInventory = [];
      component.claimsCount = null;
      fixture.detectChanges();
      const locSpy = spyOn(component, "getClaimsOpenInventoryChartNoValue");
      component.getClaimsOpenInventoryChartValue();
      const l = component.dataInventory.length;
      expect(l).toEqual(0);
      expect(locSpy).toHaveBeenCalled();
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsOpenInventorySlaComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch data", () => {
      const defaultDays = "Default";
      component.invGroup.get("days").setValue(defaultDays);
      const servSpy = spyOn(service, "getClaimsOpenInventory").and.returnValue(
        openInventry
      );
      fixture.detectChanges();
      component.getClaimsOpenInventory();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      const defaultDays = "Default";
      component.invGroup.get("days").setValue(defaultDays);
      spyOn(service, "getClaimsOpenInventory").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getClaimsOpenInventoryChartNoValue");
      fixture.detectChanges();
      component.getClaimsOpenInventory();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is empty", () => {
      const defaultDays = "Default";
      component.invGroup.get("days").setValue(defaultDays);
      spyOn(service, "getClaimsOpenInventory").and.returnValue([]);
      component.claimsCount = [];
      const locSpy = spyOn(component, "getClaimsOpenInventoryChartNoValue");
      fixture.detectChanges();
      component.getClaimsOpenInventory();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is null", () => {
      const defaultDays = "Default";
      component.invGroup.get("days").setValue(defaultDays);
      spyOn(service, "getClaimsOpenInventory").and.returnValue(null);
      component.claimsCount = null;
      const locSpy = spyOn(component, "getClaimsOpenInventoryChartNoValue");
      fixture.detectChanges();
      component.getClaimsOpenInventory();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when data is null", () => {
      const defaultDays = "Default";
      component.invGroup.get("days").setValue(defaultDays);
      spyOn(service, "getClaimsOpenInventory").and.returnValue(null);
      const locSpy = spyOn(component, "getClaimsOpenInventoryChartNoValue");
      fixture.detectChanges();
      component.getClaimsOpenInventory();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      const defaultDays = "Default";
      component.invGroup.get("days").setValue(defaultDays);
      fixture.detectChanges();
      component.getClaimsOpenInventory();
      expect(component.isExaminerCountRendered).toBeTruthy();
    });
  });
});
