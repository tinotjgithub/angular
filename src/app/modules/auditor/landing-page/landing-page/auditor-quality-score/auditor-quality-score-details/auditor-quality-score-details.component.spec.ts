import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditorQualityScoreDetailsComponent } from "./auditor-quality-score-details.component";
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
import {
  openInvThrasholdGrid,
  mockReport
} from "src/app/mocks/dashboard-mock-data";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ReportsModule } from "src/app/modules/reports/reports.module";
import { ComponentsModule } from "src/app/shared/components/components.module";

class MockAuditDashboardService extends AuditDashboardService {
  auditQualityDetails() {
    const prodArray: any = openInvThrasholdGrid;
    this.auditQualityDetailsFetch.next(prodArray);
  }
  auditQualityDetailsReport(): Observable<any[]> {
    return of(mockReport);
  }
}

describe("AuditorQualityScoreDetailsComponent", () => {
  let component: AuditorQualityScoreDetailsComponent;
  let fixture: ComponentFixture<AuditorQualityScoreDetailsComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditorQualityScoreDetailsComponent],
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
    fixture = TestBed.createComponent(AuditorQualityScoreDetailsComponent);
    localStorage = fixture.debugElement.injector.get(CryptoService);
    localStorage.setItem("user-details", JSON.stringify({ id: 1 }));
    component = fixture.componentInstance;
    component.editUser = {
      status: "Audit Failed"
    };
    fixture.detectChanges();
  });

  it("should have input info", () => {
    component.editUser = {
      status: "Audit Failed"
    };
    expect(component.editUser instanceof Object).toBeTruthy();
  });

  it("should create", () => {
    component.editUser = {
      status: "Audit Failed"
    };
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let adtservice;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorQualityScoreDetailsComponent);
      adtservice = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      component.editUser = {
        status: "Audit Failed"
      };
      fixture.detectChanges();
    });
    it("should format request when a range is present", () => {
      component.editUser = {
        status: "Audit Failed"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({ type: "Audit Failed" });
    });
    it("should format request when a  single value is selected", () => {
      component.editUser = {
        status: "Audit Failed"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({ type: "Audit Failed" });
    });
    it("should format request when status is Audit Failed", () => {
      component.editUser = {
        status: "Audit Failed"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        type: "Audit Failed"
      });
    });
    it("should format request when status is Rebuttal Accepted", () => {
      component.editUser = {
        status: "Rebuttal Accepted"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        type: "Rebuttal Accepted"
      });
    });

    it("should format request when status is Rebuttal Accepted", () => {
      component.editUser = {
        status: "Rebuttal Accepted"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        type: "Rebuttal Accepted"
      });
    });

    it("should set failed status columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setStausFailedCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set rebuttal status columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setStausRebuttedCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let adtservice;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorQualityScoreDetailsComponent);
      adtservice = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      component.editUser = {
        status: "Audit Failed"
      };
      fixture.detectChanges();
    });

    it("should call service to fetch data", () => {
      component.editUser = {
        status: "Audit Failed"
      };
      const servSpy = spyOn(adtservice, "auditQualityDetails").and.returnValue(
        openInvThrasholdGrid
      );
      fixture.detectChanges();
      component.auditQualityDetails();
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
        status: "Audit Failed"
      };
      spyOn(component, "getPayload");
      const servSpy = spyOn(
        adtservice,
        "auditQualityDetailsReport"
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
        "My Quality Score-" + dateString + ".xlsx"
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
      expect(spyObj.download).toBe("My Quality Score-" + dateString + ".xlsx");
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
        "My Quality Score-" + dateString + ".xlsx"
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
