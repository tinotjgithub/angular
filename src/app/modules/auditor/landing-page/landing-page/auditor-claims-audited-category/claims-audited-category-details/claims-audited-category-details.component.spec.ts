import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimsAuditedCategoryDetailsComponent } from "./claims-audited-category-details.component";
import { GoogleChartsModule } from "angular-google-charts";
import { TableModule } from "primeng/table";
import { Observable, of } from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { MessageService } from "primeng/api";
import { RouterModule } from "@angular/router";
import { AuditDashboardService } from "./../../../../auditor-dashboard/audit-dashboard.service";
import { catDetails, mockReport } from "src/app/mocks/dashboard-mock-data";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ReportsModule } from "src/app/modules/reports/reports.module";
import { ComponentsModule } from "src/app/shared/components/components.module";

class MockAuditDashboardService extends AuditDashboardService {
  claimsAuditedCategoryDetails() {
    const prodArray: any = catDetails;
    this.auditorAuditedDetailsFetch.next(prodArray);
  }
  claimsAuditedCategoryReport(): Observable<any[]> {
    return of(mockReport);
  }
}

describe("ClaimsAuditedCategoryDetailsComponent", () => {
  let component: ClaimsAuditedCategoryDetailsComponent;
  let fixture: ComponentFixture<ClaimsAuditedCategoryDetailsComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsAuditedCategoryDetailsComponent],
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
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        { provide: AuditDashboardService, useClass: MockAuditDashboardService },
        DatePipe,
        MessageService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAuditedCategoryDetailsComponent);
    localStorage = fixture.debugElement.injector.get(CryptoService);
    localStorage.setItem("user-details", JSON.stringify({ id: 1 }));
    component = fixture.componentInstance;
    component.editUser = {
      chartType: "claimType",
      type: "Institutional-IP"
    };
    fixture.detectChanges();
  });

  it("should have input info", () => {
    component.editUser = {
      chartType: "claimType",
      type: "Institutional-IP"
    };
    expect(component.editUser instanceof Object).toBeTruthy();
  });

  it("should create", () => {
    component.editUser = {
      chartType: "claimType",
      type: "Institutional-IP"
    };
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditedCategoryDetailsComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      component.editUser = {
        chartType: "claimType",
        type: "Institutional-IP"
      };
      fixture.detectChanges();
    });

    it("should call and set claim type", () => {
      component.editUser = {
        chartType: "claimType",
        type: "Institutional-IP"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        chartType: "claimType",
        type: "Institutional-IP"
      });
    });

    it("should format request when Institutional-IP is selected present", () => {
      component.editUser = {
        chartType: "claimType",
        type: "Institutional-IP"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        chartType: "claimType",
        type: "Institutional-IP"
      });
    });
    it("should format request when value from payment Type chart is selected", () => {
      component.editUser = {
        chartType: "paymentType",
        type: "Check Issued"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        chartType: "paymentType",
        type: "Check Issued"
      });
    });

    it("should format request when value from claim source chart is selected", () => {
      component.editUser = {
        chartType: "claimSource",
        type: "EDI"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        chartType: "claimSource",
        type: "EDI"
      });
    });

    it("should format request when value from adjudicated type chart is selected", () => {
      component.editUser = {
        chartType: "adjudicatedType",
        type: "Auto Adjudicated"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        chartType: "adjudicatedType",
        type: "Auto Adjudicated"
      });
    });

    it("should call claim types columns", () => {
      component.editUser = {
        chartType: "claimType",
        type: "Institutional-IP"
      };
      const spy = spyOn(component, "setClaimTypeCols");
      fixture.detectChanges();
      component.getColumns();
      expect(spy).toHaveBeenCalled();
    });

    it("should call payment status columns", () => {
      component.editUser = {
        chartType: "paymentType",
        type: "Check Issued"
      };
      const spy = spyOn(component, "setPaymentStatusCols");
      fixture.detectChanges();
      component.getColumns();
      expect(spy).toHaveBeenCalled();
    });
    it("should call claim source columns", () => {
      component.editUser = {
        chartType: "claimSource",
        type: "EDI"
      };
      const spy = spyOn(component, "setClaimSourceCols");
      fixture.detectChanges();
      component.getColumns();
      expect(spy).toHaveBeenCalled();
    });
    it("should calladjudication type columns", () => {
      component.editUser = {
        chartType: "adjudicatedType",
        type: "Auto Adjudicated"
      };
      const spy = spyOn(component, "getClaimAdjTypeCols");
      fixture.detectChanges();
      component.getColumns();
      expect(spy).toHaveBeenCalled();
    });

    it("should set claim types columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setClaimTypeCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set payment status columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setPaymentStatusCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set claim source columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setClaimSourceCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set claim adjudication type columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.getClaimAdjTypeCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });
  });
  describe("should fetch data from service", () => {
    let service;
    let adtservice;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditedCategoryDetailsComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      adtservice = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      component.editUser = {
        chartType: "claimType",
        type: "Institutional-IP"
      };
      fixture.detectChanges();
    });
    it("should call service to fetch data when chart from claimType is seleted", () => {
      component.editUser = {
        chartType: "claimType",
        type: "Institutional-IP"
      };
      const servSpy = spyOn(
        adtservice,
        "claimsAuditedCategoryDetails"
      ).and.returnValue(catDetails);
      fixture.detectChanges();
      component.claimsAuditedCategoryDetails();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call service to fetch data", () => {
      component.editUser = {
        chartType: "claimType",
        type: "Institutional-IP"
      };
      const servSpy = spyOn(
        adtservice,
        "claimsAuditedCategoryDetails"
      ).and.returnValue(catDetails);
      fixture.detectChanges();
      component.claimsAuditedCategoryDetails();
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
        chartType: "claimType",
        type: "Institutional-IP"
      };
      spyOn(component, "getPayload");
      const servSpy = spyOn(
        adtservice,
        "claimsAuditedCategoryReport"
      ).and.returnValue(of(createFakeFile));
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
        "Claims Audit By Category-" + dateString + ".xlsx"
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
        "Claims Audit By Category-" + dateString + ".xlsx"
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
      expect(spyObj.download).not.toBe(
        "Claims Audit By Category-" + dateString + ".xlsx"
      );
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
