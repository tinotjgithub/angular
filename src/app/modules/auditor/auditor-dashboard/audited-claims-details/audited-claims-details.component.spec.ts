import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditedClaimsDetailsComponent } from "./audited-claims-details.component";
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
import { AuditDashboardService } from "./../audit-dashboard.service";
import { typeSts, mockReport } from "src/app/mocks/dashboard-mock-data";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ReportsModule } from "src/app/modules/reports/reports.module";
import { ComponentsModule } from "src/app/shared/components/components.module";

class MockAuditDashboardService extends AuditDashboardService {
  auditClaimsDetails() {
    const prodArray: any = typeSts;
    this.auditClaimsDetailsFetch.next(prodArray);
  }
  auditClaimsDetailsReport(): Observable<any[]> {
    return of(mockReport);
  }
}

describe("AuditedClaimsDetailsComponent", () => {
  let component: AuditedClaimsDetailsComponent;
  let fixture: ComponentFixture<AuditedClaimsDetailsComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditedClaimsDetailsComponent],
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
    fixture = TestBed.createComponent(AuditedClaimsDetailsComponent);
    localStorage = fixture.debugElement.injector.get(CryptoService);
    localStorage.setItem("user-details", JSON.stringify({ id: 1 }));
    component = fixture.componentInstance;
    component.editUser = {
      status: "Audit Passed"
    };
    fixture.detectChanges();
  });

  it("should have input info", () => {
    component.editUser = {
      status: "Audit Passed"
    };
    expect(component.editUser instanceof Object).toBeTruthy();
  });

  it("should create", () => {
    component.editUser = {
      status: "Audit Passed"
    };
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditedClaimsDetailsComponent);
      service = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      component.editUser = {
        status: "Audit Passed"
      };
      fixture.detectChanges();
    });
    it("should format request when a range is present for claims audited queue", () => {
      const today = new Date();
      component.editUser.type = "claims-audited-queue";
      component.editUser.fromDate = today;
      component.editUser.toDate = today;
      component.editUser.queueName = "QQ";
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        fromDate: today,
        toDate: today,
        queueName: "QQ"
      });
    });

    it("should format request when a range is present for claims audit summary", () => {
      const today = new Date();
      component.editUser.type = "audit-claims-summary";
      component.editUser.count = "1";
      component.editUser.status = "Audit Passed";
      component.editUser.date = today;
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        count: "1",
        date: today,
        status: "Audit Passed"
      });
    });

    it("should format request when a range is present for calims audited queue", () => {
      const today = new Date();
      component.editUser.type = "claims-audited-queue";
      component.editUser.paymentStatus = "Audit Failed";
      component.editUser.fromDate = today;
      component.editUser.toDate = today;
      component.editUser.queueName = "QQ";
      component.editUser.claimType = "EDI";
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        fromDate: today,
        queueName: "QQ",
        toDate: today
      });
    });

    it("should format request when status is Audit Passed", () => {
      const today = new Date();
      component.editUser.type = "claims-audited-by-type-status";
      component.editUser.fromDate = today;
      component.editUser.toDate = today;
      component.editUser.paymentStatus = "EDI";
      component.editUser.claimType = "Audit Passed";
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        fromDate: today,
        toDate: today,
        paymentStatus: "EDI",
        claimType: "Audit Passed"
      });
    });
    it("should format request when status is Audit Failed", () => {
      const today = new Date();
      component.editUser.type = "claims-audited-queue";
      component.editUser.fromDate = today;
      component.editUser.toDate = today;
      component.editUser.queueName = "QQ";
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        queueName: "QQ",
        fromDate: today,
        toDate: today
      });
    });

    it("should set summary failed status columns", () => {
      component.editUser.type = "audit-claims-summary";
      component.editUser.status = "Audit Failed";
      component.cols = [];
      fixture.detectChanges();
      component.setSummaryFailedCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set summary passed status columns", () => {
      component.editUser.type = "audit-claims-summary";
      component.editUser.status = "Audit Passed";
      component.cols = [];
      fixture.detectChanges();
      component.setSummaryPassedCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set claims audited queue columns", () => {
      component.editUser.type = "claims-audited-queue";
      component.editUser.paymentStatus = "Audit Failed";
      component.cols = [];
      fixture.detectChanges();
      component.setAuditQueueCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set claims audit type status columns", () => {
      component.editUser.type = "claims-audited-queue";
      (component.editUser.name = "Q1"), (component.cols = []);
      fixture.detectChanges();
      component.setAuditTypeStatusCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });
  });

  describe("should fetch data from service", () => {
    let service;
    let adtservice;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditedClaimsDetailsComponent);
      adtservice = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      component.editUser = {
        status: "Audit Passed"
      };
      fixture.detectChanges();
    });

    it("should call excel service", () => {
      const today = new Date();
      component.editUser.type = "claims-audited-queue";
      component.editUser.fromDate = today;
      component.editUser.toDate = today;
      component.editUser.queueName = "QQ";
      fixture.detectChanges();
      const createFakeFile = (fileName: string = "fileName"): File => {
        const blob: any = new Blob([""], { type: "text/html" });
        blob.header = fileName;
        blob.body = blob;
        return blob as File;
      };
      spyOn(component, "getPayload");
      const servSpy = spyOn(
        adtservice,
        "auditClaimsDetailsReport"
      ).and.returnValue(of(createFakeFile));
      fixture.detectChanges();
      component.exportExcel();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should download file in excel format", () => {
      const today = new Date();
      component.editUser.type = "claims-audited-queue";
      component.editUser.fromDate = today;
      component.editUser.toDate = today;
      component.editUser.queueName = "QQ";
      fixture.detectChanges();
      const spyObj = document.createElement("a");
      const blob = new Blob([mockReport.body], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      component.editUser.type = "audit-claims-summary";
      const url = URL.createObjectURL(blob);
      const dateString = component.datePipe.transform(today, "MMddyyyy");
      spyObj.setAttribute("href", url);
      spyObj.setAttribute(
        "download",
        "Claims Audit Summary-" + dateString + ".xlsx"
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
        "Claims Audit Summary-" + dateString + ".xlsx"
      );
    });
    it("should not download file", () => {
      const today = new Date();
      component.editUser.type = "claims-audited-queue";
      component.editUser.fromDate = today;
      component.editUser.toDate = today;
      component.editUser.queueName = "QQ";
      fixture.detectChanges();
      const dateString = component.datePipe.transform(today, "MMddyyyy");
      const spyObj = document.createElement("a");
      document.body.appendChild(spyObj);
      const syy = spyOn(spyObj, "click");
      fixture.detectChanges();
      component.exportExcel();
      expect(syy).not.toHaveBeenCalled();
      expect(spyObj.download).not.toBe(
        "Claims Audit Summary-" + dateString + ".xlsx"
      );
    });
    it("should not download file when download is undefined", () => {
      const today = new Date();
      component.editUser.type = "claims-audited-queue";
      component.editUser.fromDate = today;
      component.editUser.toDate = today;
      component.editUser.queueName = "QQ";
      fixture.detectChanges();
      const spyObj = document.createElement("u");
      document.body.appendChild(spyObj);
      const syy = spyOn(spyObj, "click");
      fixture.detectChanges();
      component.exportExcel();
      expect(syy).not.toHaveBeenCalled();
    });
  });
});
