import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsOpenInventoryViewComponent } from "./claims-open-inventory-view.component";
import { GoogleChartsModule } from "angular-google-charts";
import { TableModule } from "primeng/table";
import { Observable, of } from "rxjs";
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
import {
  openInvThrasholdGrid,
  mockReport
} from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ReportsModule } from "src/app/modules/reports/reports.module";
import { ComponentsModule } from "src/app/shared/components/components.module";

class MockTaskMgtService extends TaskmanagementService {
  getInventoryClaims() {
    const prodArray: any = openInvThrasholdGrid;
    this.inventoryClaimsFetch.next(prodArray);
  }
  getOpenInvReport(): Observable<any[]> {
    return of(mockReport);
  }
}

describe("ClaimsOpenInventoryViewComponent", () => {
  let component: ClaimsOpenInventoryViewComponent;
  let fixture: ComponentFixture<ClaimsOpenInventoryViewComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      //   declarations: [ClaimsOpenInventoryViewComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        TableModule,
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
    fixture = TestBed.createComponent(ClaimsOpenInventoryViewComponent);
    localStorage = fixture.debugElement.injector.get(CryptoService);
    localStorage.setItem("user-details", JSON.stringify({ id: 1 }));
    component = fixture.componentInstance;
    component.editUser = {
      age: "3-5",
      claimCount: 36,
      type: "open-inventory"
    };
    fixture.detectChanges();
  });

  it("should have input info", () => {
    component.editUser = {
      age: "3-5",
      claimCount: 36,
      type: "open-inventory"
    };
    expect(component.editUser instanceof Object).toBeTruthy();
  });

  it("should create", () => {
    component.editUser = {
      age: "3-5",
      claimCount: 36,
      type: "open-inventory"
    };
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsOpenInventoryViewComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      component.editUser = {
        age: "3-5",
        claimCount: 36,
        type: "open-inventory"
      };
      fixture.detectChanges();
    });
    it("should format request when a range is present", () => {
      component.editUser = {
        age: "3-5",
        claimCount: 36,
        type: "open-inventory"
      };
      fixture.detectChanges();
      const request = component.formatRequest(component.editUser);
      expect(request).toEqual({ startDay: "3", endDay: "5", type: "range" });
    });
    it("should format request when a  single value is selected", () => {
      component.editUser = {
        age: "4",
        claimCount: 36,
        type: "open-inventory"
      };
      fixture.detectChanges();
      const request = component.formatRequest(component.editUser);
      expect(request).toEqual({ startDay: "4", endDay: "4", type: "single" });
    });
    it("should format request when less than 0 value is present", () => {
      component.editUser = {
        age: "<0",
        claimCount: 36,
        type: "open-inventory"
      };
      fixture.detectChanges();
      const request = component.formatRequest(component.editUser);
      expect(request).toEqual({
        startDay: "0",
        endDay: "0",
        type: "lessThanZero"
      });
    });
    it("should format request when greater than SLA value is present", () => {
      component.editUser = {
        age: ">40",
        claimCount: 36,
        type: "open-inventory"
      };
      fixture.detectChanges();
      const request = component.formatRequest(component.editUser);
      expect(request).toEqual({
        startDay: "40",
        endDay: "40",
        type: "greaterThanSLA"
      });
    });

    it("should set SLA columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setSLACols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set threshold columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setThresholdCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsOpenInventoryViewComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      component.editUser = {
        age: "3-5",
        claimCount: 36,
        type: "open-inventory"
      };
      fixture.detectChanges();
    });
    it("should call service to fetch data", () => {
      component.editUser = {
        age: "3-5",
        claimCount: 36,
        type: "open-inventory"
      };
      const servSpy = spyOn(service, "getInventoryClaims").and.returnValue(
        openInvThrasholdGrid
      );
      fixture.detectChanges();
      component.getInventoryClaims();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call service to fetch data", () => {
      component.editUser = {
        age: "3-5",
        claimCount: 36,
        type: "open-inventory"
      };
      const servSpy = spyOn(service, "getInventoryClaims").and.returnValue(
        openInvThrasholdGrid
      );
      fixture.detectChanges();
      component.getInventoryClaims();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call excel service", () => {
      const createFakeFile = (fileName: string = "fileName"): File => {
        const blob: any = new Blob([""], { type: "text/html" });
        blob.header = fileName;
        blob.body = blob;
        return blob as File;
      };
      component.editUser = {
        age: "3-5",
        claimCount: 36,
        type: "open-inventory"
      };
      spyOn(component, "formatRequest");
      const servSpy = spyOn(service, "getOpenInvReport").and.returnValue(
        of(createFakeFile)
      );
      fixture.detectChanges();
      component.exportExcel();
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
        "Claims Open Inventory Nearing SLA-" + dateString + ".xlsx"
      );
      document.body.appendChild(spyObj);
      spyOn(document, "createElement").and.returnValue(spyObj);
      const syy = spyOn(spyObj, "click");
      fixture.detectChanges();
      component.exportExcel();
      // tslint:disable-next-line: deprecation
      expect(document.createElement).toHaveBeenCalledTimes(1);
      // tslint:disable-next-line: deprecation
      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(syy).toHaveBeenCalled();
      expect(spyObj.download).toBe(
        "Claims Open Inventory Nearing SLA-" + dateString + ".xlsx"
      );
    });
    it("should not download file", () => {
      const today = new Date();
      const dateString = component.datePipe.transform(today, "MMddyyyy");
      const spyObj = document.createElement("a");
      document.body.appendChild(spyObj);
      const syy = spyOn(spyObj, "click");
      fixture.detectChanges();
      component.exportExcel();
      expect(syy).not.toHaveBeenCalled();
      expect(spyObj.download).not.toBe("Claims_Report-" + dateString + ".xlsx");
    });
    it("should not download file when download is undefined", () => {
      const spyObj = document.createElement("u");
      document.body.appendChild(spyObj);
      const syy = spyOn(spyObj, "click");
      fixture.detectChanges();
      component.exportExcel();
      expect(syy).not.toHaveBeenCalled();
    });
  });
});
