import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditSamplingByCategoryComponent } from "./audit-sampling-by-category.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { MultiSelectModule } from "primeng/multiselect";
import {
  samplingCategory,
  auditDates,
  samplingParameters
} from "./../mocks/report-dashboard.mock";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { categoryScore } from "src/app/mocks/auditor-landing-page-charts.mock";
import { auditDetails } from "../../auditor/auditor-dashboard/auditor-dashboard.mock";

class MockAuditDashboardService extends AuditReportDashboardService {
  getAuditSamplingCategory() {
    const prodArray = samplingCategory;
    this.auditSamplingCategoryFetch.next(prodArray);
  }
  getAuditDates() {
    return auditDates;
  }
  getClaimsParameterList() {
    const samplingArray = samplingParameters;
    this.claimsParameterListFetch.next(samplingArray);
  }
  resetFormSubject() {
    return auditDates;
  }
}

describe("AuditSamplingByCategoryComponent", () => {
  let component: AuditSamplingByCategoryComponent;
  let fixture: ComponentFixture<AuditSamplingByCategoryComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditSamplingByCategoryComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        MultiSelectModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: AuditReportDashboardService,
          useClass: MockAuditDashboardService
        },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSamplingByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      // fixture = TestBed.createComponent(AuditSamplingByCategoryComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      // component = fixture.componentInstance;
      // fixture.detectChanges();
    });
    it("should set to empty audit details when response is not present", () => {
      component.processedDates = [];
      fixture.detectChanges();
      component.getAuditDetails();
      spyOn(service, "resetFormSubject").and.returnValue(of(null));
      expect(component.processedDates.length).toEqual(0);
    });
    it("should set displayEnlarded to true", () => {
      component.enlargedDisplay = false;
      fixture.detectChanges();
      component.showDialog();
      expect(component.enlargedDisplay).toBe(true);
    });
    it("should set data in chart as 'No Data' when data is empty", () => {
      component.dataAudit = [];
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.dataAudit[0]).toEqual(["NO DATA", 0, "0"]);
    });
    it("should set tooltip text in chart to a default value when data is empty", () => {
      component.optionsAudit.tooltip.trigger = "focus";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.tooltip.trigger).toBe("none");
    });
    it("should not display legend when there are no values", () => {
      component.optionsAudit.legend.position = "top";
      fixture.detectChanges();
      component.getAuditChartNoValue();
      expect(component.optionsAudit.legend.position).toBe("none");
    });
    it("should set tooltip text in chart when data is not empty", () => {
      component.auditReportBarChartMaps =
        samplingCategory.auditReportBarChartMaps;
      component.optionsAudit.tooltip.trigger = "none";
      fixture.detectChanges();
      component.getAuditChartValues();
      expect(component.optionsAudit.tooltip.trigger).toBe("focus");
    });
    it("should display legend when there are values", () => {
      component.auditReportBarChartMaps =
        samplingCategory.auditReportBarChartMaps;
      component.optionsAudit.legend.position = "none";
      fixture.detectChanges();
      component.getAuditChartValues();
      expect(component.optionsAudit.legend.position).toBe("top");
    });
    it("should map response value when response value is present", () => {
      component.dataAudit = [];
      component.auditReportBarChartMaps =
        samplingCategory.auditReportBarChartMaps;
      fixture.detectChanges();
      component.getAuditChartValues();
      const l = component.dataAudit.length;
      expect(l).toBeGreaterThan(0);
    });
    it("should set to date value as to date itself when to date is present", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      const sevenDate = new Date();
      sevenDate.setDate(sevenDate.getDate() - 7);
      const dat = new Date(
        component.datePipe.transform(sevenDate, "yyyy-MM-dd")
      );
      component.processedDates = [];
      component.processedDates.push(todaysDate);
      component.processedDates.push(dat);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(dat);
    });
    it("should set to date value as from date value when to date is undefined", () => {
      const today = new Date();
      const todaysDate = new Date(
        component.datePipe.transform(today, "yyyy-MM-dd")
      );
      component.processedDates = [];
      component.processedDates.push(todaysDate);
      fixture.detectChanges();
      const toDate = component.getToDateValue();
      expect(toDate).toBe(todaysDate);
    });

    it("scrollChart", () => {
      component.dataAudit = categoryScore;
      component.setChartScroll();
      expect(component.optionsAuditEnlarged.height).toEqual(400);
      expect(component.optionsAudit.height).toEqual(200);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      // fixture = TestBed.createComponent(AuditSamplingByCategoryComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      // component = fixture.componentInstance;
      // fixture.detectChanges();
    });
    it("should call service to fetch audit data", () => {
      component.processedDates = auditDates.auditDates;
      const servSpy = spyOn(service, "getAuditSamplingCategory");
      fixture.detectChanges();
      component.getAuditDays();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should get filter parameters for the chart", () => {
      const servSpy = spyOn(service, "getClaimsParameterList");
      fixture.detectChanges();
      component.getClaimsParameterList();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when error occurs", () => {
      component.processedDates = auditDates.auditDates;
      spyOn(service, "getAuditSamplingCategory").and.returnValue(
        throwError({ status: 401 })
      );
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set data in chart as 'No Data' when response is null", () => {
      component.processedDates = auditDates.auditDates;
      spyOn(service, "getAuditSamplingCategory");
      component.auditReportBarChartMaps = null;
      const locSpy = spyOn(component, "getAuditChartNoValue");
      fixture.detectChanges();
      component.getAuditDays();
      expect(locSpy).toHaveBeenCalled();
    });
    it("should render chart", () => {
      component.processedDates = auditDates.auditDates;
      fixture.detectChanges();
      component.getAuditDays();
      expect(component.isAuditRendered).toBeTruthy();
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      // fixture = TestBed.createComponent(AuditSamplingByCategoryComponent);
      service = fixture.debugElement.injector.get(AuditReportDashboardService);
      /* component = fixture.componentInstance;
      fixture.detectChanges(); */
    });

    it("mapClaimTypeArray with data", () => {
      const array = [{ name: "Claim Type", id: "1" }];
      component.mapClaimTypeArray(array);
      expect(component.claimTypeArray).toEqual(["Claim Type"]);
    });

    it("mapClaimTypeArray if no data", () => {
      const array = [];
      component.mapClaimTypeArray(array);
      expect(component.claimTypeArray).toEqual([]);
    });

    it("mapPaymentStatusArray", () => {
      const array = [{ name: "paymentStatusArray", id: "id" }];
      component.mapPaymentStatusArray(array);
      expect(component.paymentStatusArray).toEqual(["paymentStatusArray"]);
      array.pop();
      component.mapPaymentStatusArray(array);
      expect(component.paymentStatusArray).toEqual([]);
    });

    it("mapLOBArray", () => {
      const array = [{ name: "LOB" }];
      component.mapLOBArray(array);
      expect(component.lobArray).toEqual(["LOB"]);
      array.pop();
      component.mapLOBArray(array);
      expect(component.lobArray).toEqual([]);
    });

    it("mapClaimSourceArray", () => {
      const array = [{ name: "Claim Source" }];
      component.mapClaimSourceArray(array);
      expect(component.claimSourceArray).toEqual(["Claim Source"]);
      array.pop();
      component.mapClaimSourceArray(array);
      expect(component.claimSourceArray).toEqual([]);
    });

    it("mapSamplingArray", () => {
      const array = [{ name: "mapSamplingArray" }];
      component.mapSamplingArray(array);
      expect(component.samplingArray).toEqual(["MAPSAMPLINGARRAY"]);
      array.pop();
      component.mapSamplingArray(array);
      expect(component.samplingArray).toEqual([]);
    });

    it("mapColumns", () => {
      let typeArray = ["Professional"];
      component.mapColumns(typeArray);
      expect(component.columnNamesAudit).toEqual([
        "",
        "Professional",
        { role: "annotation" }
      ]);
      typeArray = ["InstitutionalIP"];
      component.mapColumns(typeArray);
      expect(component.columnNamesAudit).toEqual([
        "",
        "Institutional(IP)",
        { role: "annotation" }
      ]);
      typeArray = ["InstitutionalOP"];
      component.mapColumns(typeArray);
      expect(component.columnNamesAudit).toEqual([
        "",
        "Institutional(OP)",
        { role: "annotation" }
      ]);
      typeArray = ["Others"];
      component.mapColumns(typeArray);
      expect(component.columnNamesAudit).toEqual([
        "",
        "Others",
        { role: "annotation" }
      ]);
    });

    it("mapData", () => {
      let data = {
        auditReportBarChartMaps: [
          {
            claimType: "Check Issued",
            Professional: 9,
            InstitutionalOP: 12,
            InstitutionalIP: 1,
            Others: 0
          },
          {
            claimType: "Check Not Issued",
            Professional: 5,
            InstitutionalOP: 3,
            InstitutionalIP: 3,
            Others: 0
          }
        ]
      };
      component.mapData(data.auditReportBarChartMaps);
      expect(component.dataAudit).toEqual([
        ["Check Issued", 9, 9, 1, 1, 12, 12, 0, 0],
        ["Check Not Issued", 5, 5, 3, 3, 3, 3, 0, 0]
      ]);

      data = {
        auditReportBarChartMaps: [
          {
            claimType: "Professional",
            Professional: 9,
            InstitutionalOP: 12,
            InstitutionalIP: 1,
            Others: 0
          },
          {
            claimType: "InstitutionalIP",
            Professional: 5,
            InstitutionalOP: 3,
            InstitutionalIP: 3,
            Others: 0
          },
          {
            claimType: "InstitutionalOP",
            Professional: 5,
            InstitutionalOP: 3,
            InstitutionalIP: 3,
            Others: 0
          },
          {
            claimType: "Others",
            Professional: 5,
            InstitutionalOP: 3,
            InstitutionalIP: 3,
            Others: 0
          }
        ]
      };
      component.mapData(data.auditReportBarChartMaps);
      expect(component.dataAudit).toEqual([
        ["Professional", 9, 9, 1, 1, 12, 12, 0, 0],
        ["InstitutionalIP", 5, 5, 3, 3, 3, 3, 0, 0],
        ["InstitutionalOP", 5, 5, 3, 3, 3, 3, 0, 0],
        ["Others", 5, 5, 3, 3, 3, 3, 0, 0]
      ]);
    });
    it("mapPaymentStatus", () => {
      component.paymentSts = [{ id: "1", name: "status" }];
      component.mapPaymentStatus();
      expect(component.paymentStatusList).toEqual([
        { label: "status", value: { id: "1", name: "status", code: "status" } }
      ]);
      expect(component.samplingGroup.get("paymentStatus").value).toEqual([
        { id: "1", name: "status", code: "status" }
      ]);
    });

    it("mapLOB", () => {
      component.lob = [{ id: "1", name: "status" }];
      component.mapLOB();
      expect(component.businessList).toEqual([
        { label: "status", value: { id: "1", name: "status", code: "status" } }
      ]);
      expect(component.samplingGroup.get("ListOfBusiness").value).toEqual([
        { id: "1", name: "status", code: "status" }
      ]);
    });
    it("mapSamplingList", () => {
      component.samplingMethod = [{ id: "1", name: "status" }];
      component.mapSamplingList();
      expect(component.samplingList).toEqual([
        { label: "status", value: { id: "1", name: "status", code: "status" } }
      ]);
      expect(component.samplingGroup.get("samplingMethod").value).toEqual([
        { id: "1", name: "status", code: "status" }
      ]);
    });

    it("getClaimTypeList", () => {
      component.getClaimTypeList();

      const a = [
        {
          label: "Professional",
          value: { id: "1", name: "Professional", code: "Professional" }
        },
        {
          label: "Institutional-IP",
          value: { id: "2", name: "Institutional-IP", code: "Institutional-IP" }
        },
        {
          label: "Institutional-OP",
          value: { id: "3", name: "Institutional-OP", code: "Institutional-OP" }
        },
        { label: "Others", value: { id: "4", name: "Others", code: "Others" } }
      ];
      const b = [
        { id: "1", name: "Professional", code: "Professional" },
        { id: "2", name: "Institutional-IP", code: "Institutional-IP" },
        { id: "3", name: "Institutional-OP", code: "Institutional-OP" },
        { id: "4", name: "Others", code: "Others" }
      ];

      expect(component.claimTypeList).toEqual(a);
      expect(component.samplingGroup.get("claimType").value).toEqual(b);
    });
  });
});
