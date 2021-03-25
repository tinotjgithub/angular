import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditorClaimsAuditedComponent } from "./auditor-claims-audited.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { auditQueueWeeklyTrend } from "src/app/mocks/auditor-landing-page-charts.mock";
import { of, throwError } from "rxjs";
import { AuditorService } from "./../../../../../services/auditor/auditor.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuditorClaimsAuditedDetailsComponent } from "./auditor-claims-audited-details/auditor-claims-audited-details.component";
import { TableModule } from "primeng/table";
class MockAuditorService extends AuditorService {
  getAuditorClaimsAudited() {
    const prodArray = auditQueueWeeklyTrend;
    this.auditorClaimsAuditedFetch.next(prodArray);
  }
}

describe("AuditorClaimsAuditedComponent", () => {
  let component: AuditorClaimsAuditedComponent;
  let fixture: ComponentFixture<AuditorClaimsAuditedComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditorClaimsAuditedComponent,
        AuditorClaimsAuditedDetailsComponent
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        TableModule,
        ReactiveFormsModule,
        CalendarModule,
        BrowserAnimationsModule,
        DialogModule,
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
    fixture = TestBed.createComponent(AuditorClaimsAuditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorClaimsAuditedComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataAudit = [];
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.dataAudit[0]).toEqual([
        "NO DATA",
        0,
        "0",
        0,
        "0",
        0,
        "0"
      ]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsAudit.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsAudit.legend.position = "bottom";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.legend.position).toBe("none");
    });
    it("should set tooltip text in chart to a its own value when data is not empty", () => {
      component.auditedAndBacklogDtos = auditQueueWeeklyTrend;
      component.optionsAudit.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.auditedAndBacklogDtos = auditQueueWeeklyTrend;
      component.optionsAudit.legend.position = "none";
      fixture.detectChanges();
      component.getAuditChartValue();
      expect(component.optionsAudit.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataAudit = [];
      component.auditedAndBacklogDtos = auditQueueWeeklyTrend;
      fixture.detectChanges();
      component.getAuditChartValue();
      const l = component.dataAudit.length;
      expect(l).toBeGreaterThan(0);
    });

    it("should close popup", () => {
      component.editMode = true;
      component.dataAudit = [
        ["05-18-2020 - 05-23-2020", 6, 6, 0, 0, 1, 1],
        ["06-15-2020 - 06-20-2020", 10, 10, 7, 7, 2, 2],
        ["06-22-2020 - 06-27-2020", 6, 6, 10, 10, 1, 1],
        ["06-29-2020 - 06-30-2020", 2, 2, 0, 0, 1, 1]
      ];
      const e = [];
      e.push({ column: 1, row: 2 });
      component.editUser = {
        type: "Open Inventory",
        fromDate: "test",
        toDate: "test"
      };
      fixture.detectChanges();
      component.closePopUp();
      expect(component.editMode).toBeFalsy();
    });

    it("should open Payment popup when selected object has values", () => {
      const e = [];
      e.push({ column: 3, row: 2 });
      component.editMode = false;
      component.dataAudit = [
        ["05-18-2020 - 05-23-2020", 6, 6, 0, 0, 1, 1],
        ["06-15-2020 - 06-20-2020", 10, 10, 7, 7, 2, 2],
        ["06-22-2020 - 06-27-2020", 6, 6, 10, 10, 1, 1],
        ["06-29-2020 - 06-30-2020", 2, 2, 0, 0, 1, 1]
      ];
      component.columnNamesAudit = [
        "",
        "Claims Audited",
        { role: "annotation" },
        "Open Inventory/Backlog",
        { role: "annotation" },
        "Average",
        { role: "annotation" }
      ];
      fixture.detectChanges();
      component.openPopUp(e);
      expect(component.editMode).toBeTruthy();
    });

    it("should not open popup when selected object has no values", () => {
      const e = [];
      component.editMode = false;
      component.dataAudit = [
        ["05-18-2020 - 05-23-2020", 6, 6, 0, 0, 1, 1],
        ["06-15-2020 - 06-20-2020", 10, 10, 7, 7, 2, 2],
        ["06-22-2020 - 06-27-2020", 6, 6, 10, 10, 1, 1],
        ["06-29-2020 - 06-30-2020", 2, 2, 0, 0, 1, 1]
      ];
      component.columnNamesAudit = [
        "",
        "Claims Audited",
        { role: "annotation" },
        "Open Inventory/Backlog",
        { role: "annotation" },
        "Average",
        { role: "annotation" }
      ];
      fixture.detectChanges();
      component.openPopUp(e);
      expect(component.editMode).toBeFalsy();
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorClaimsAuditedComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to fetch audit data", () => {
      component.dataAudit = [
        ["05-18-2020 - 05-23-2020", 6, 6, 0, 0, 1, 1],
        ["06-15-2020 - 06-20-2020", 10, 10, 7, 7, 2, 2],
        ["06-22-2020 - 06-27-2020", 6, 6, 10, 10, 1, 1],
        ["06-29-2020 - 06-30-2020", 2, 2, 0, 0, 1, 1]
      ];
      const servSpy = spyOn(service, "getAuditorClaimsAudited");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when error occurs", () => {
      spyOn(service, "getAuditorClaimsAudited").and.returnValue(null);
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response doesnot have the variable auditedAndBacklogDtos", () => {
      spyOn(service, "getAuditorClaimsAudited").and.returnValue([]);
      component.auditedAndBacklogDtos = [];
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      spyOn(service, "getAuditorClaimsAudited").and.returnValue(null);
      component.auditedAndBacklogDtos = null;
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      fixture.detectChanges();
      component.getAuditDays();
      expect(component.isAuditRendered).toBeTruthy();
    });
  });
});
