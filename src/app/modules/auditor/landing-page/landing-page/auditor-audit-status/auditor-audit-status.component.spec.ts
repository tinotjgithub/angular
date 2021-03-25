import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditorAuditStatusComponent } from "./auditor-audit-status.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { auditStatus } from "src/app/mocks/auditor-landing-page-charts.mock";
import { AuditorService } from "./../../../../../services/auditor/auditor.service";
import { of, throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuditorAuditStatusDetailsComponent } from "./auditor-audit-status-details/auditor-audit-status-details.component";
import { TableModule } from "primeng/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

class MockAuditorService extends AuditorService {
  getAuditorAuditStatus() {
    const statusArray: any = auditStatus;
    this.auditorAuditStatusFetch.next(statusArray);
  }
}

describe("AuditorAuditStatusComponent", () => {
  let component: AuditorAuditStatusComponent;
  let fixture: ComponentFixture<AuditorAuditStatusComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditorAuditStatusComponent,
        AuditorAuditStatusDetailsComponent
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CalendarModule,
        DialogModule,
        TableModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuditorService, useClass: MockAuditorService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorAuditStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorAuditStatusComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set displayEnlarded to true", () => {
      component.displayEnlarged = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.displayEnlarged).toBe(true);
    });

    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataStatus = [];
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.dataStatus[0]).toEqual(["NO DATA", 1]);
    });
    it("should set pie slice text in chart to a default value when data is empty", () => {
      component.optionsStatus.pieSliceText = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.pieSliceText).toBe("label");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsStatus.tooltip.text = "value-and-percentage";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.tooltip.text).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsStatus.legend.position = "top";
      fixture.detectChanges();
      component.getNoDataChart();
      expect(component.optionsStatus.legend.position).toBe("none");
    });
    it("should set pie slice text in chart to a default value when data is empty", () => {
      component.auditStatusCountDto = auditStatus;
      component.optionsStatus.pieSliceText = "label";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.pieSliceText).toBe("value-and-percentage");
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.auditStatusCountDto = auditStatus;
      component.optionsStatus.tooltip.text = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.tooltip.text).toBe("value-and-percentage");
    });
    it("should display legend when there are values", () => {
      component.auditStatusCountDto = auditStatus;
      component.optionsStatus.legend.position = "none";
      fixture.detectChanges();
      component.getDataChart();
      expect(component.optionsStatus.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataStatus = [];
      component.auditStatusCountDto = auditStatus;
      fixture.detectChanges();
      component.getDataChart();
      const l = component.dataStatus.length;
      expect(l).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorAuditStatusComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch status-data", () => {
      const servSpy = spyOn(service, "getAuditorAuditStatus");
      fixture.detectChanges();
      component.getStatusDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when error occurs", () => {
      spyOn(service, "getAuditorAuditStatus").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when null response", () => {
      spyOn(service, "getAuditorAuditStatus").and.returnValue(null);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should data in chart as 'No Data' when undefined response", () => {
      spyOn(service, "getAuditorAuditStatus").and.returnValue(undefined);
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      fixture.detectChanges();
      component.getStatusDays();
      expect(component.isStatusRendered).toBeTruthy();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      spyOn(service, "getAuditorAuditStatus");
      component.auditStatusCountDto = null;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is undefined", () => {
      spyOn(service, "getAuditorAuditStatus");
      component.auditStatusCountDto = undefined;
      const locSpy = spyOn(component, "getNoDataChart");
      fixture.detectChanges();
      component.getStatusDays();
      expect(locSpy).toHaveBeenCalled();
    });
    // openPopUp

    it("should openpopup when selected object has values", () => {
      const e = [];
      e.push({ column: 1, row: 2 });
      component.editMode = false;
      component.dataStatus = [
        ["Audit Passed", 12],
        ["Audit Failed", 12],
        ["Audit Rebutted", 13]
      ];
      fixture.detectChanges();
      component.openPopUp(e);
      expect(component.editMode).toBeTruthy();
    });

    it("should close popup", () => {
      component.editMode = true;
      component.dataStatus = [
        ["Audit Passed", 12],
        ["Audit Failed", 12],
        ["Audit Rebutted", 13]
      ];
      const e = [];
      e.push({ column: 1, row: 2 });
      const row = e[0].row;
      const status = component.dataStatus[row][0];
      component.editUser = {
        status: status
      };
      fixture.detectChanges();
      component.closePopUp();
      expect(component.editMode).toBeFalsy();
    });

    it("should not openpopup when selected object has no values", () => {
      const e = [];
      component.editMode = false;
      component.dataStatus = [
        ["Audit Passed", 12],
        ["Audit Failed", 12],
        ["Audit Rebutted", 13]
      ];
      fixture.detectChanges();
      component.openPopUp(e);
      expect(component.editMode).toBeFalsy();
    });

    it("should map response values", () => {
      const dataStatusArray = [];
      dataStatusArray.push(
        {
          status: "Audit Failed",
          claimCount: 12
        },
        {
          status: "Audit Passed",
          claimCount: 12
        },
        {
          status: "Audit Rebutted",
          claimCount: 13
        }
      );
      component.mapResponseValue(
        auditStatus.auditStatusCountDtos,
        dataStatusArray
      );
      const len = component.dataStatus.length;
      expect(len).toEqual(4);
    });
  });
});
