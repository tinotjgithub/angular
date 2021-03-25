import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditorAuditStatusDetailsComponent } from "./auditor-audit-status-details.component";
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
  mockReport,
  auditStatusDetails
} from "src/app/mocks/dashboard-mock-data";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ReportsModule } from "src/app/modules/reports/reports.module";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
import { APP_INITIALIZER } from '@angular/core';

class MockTaskMgtService extends TaskmanagementService {
  auditVolStatus() {
    const prodArray: any = openInvThrasholdGrid;
    this.inventoryClaimsFetch.next(prodArray);
  }
  AuditVolStatusReport(): Observable<any[]> {
    return of(mockReport);
  }
}
class MockAuditDashboardService extends AuditDashboardService {
  auditStatusDetails() {
    const auditStatusArray: any = auditStatusDetails;
    this.auditStatusDetailsFetch.next(auditStatusArray);
  }
  auditStatusDetailsReport() {
    return of(mockReport);
  }
}

describe("AuditorAuditStatusDetailsComponent", () => {
  let component: AuditorAuditStatusDetailsComponent;
  let fixture: ComponentFixture<AuditorAuditStatusDetailsComponent>;
  let localStorage: CryptoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditorAuditStatusDetailsComponent],
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
        AppConfigService,
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        { provide: AuditDashboardService, useClass: MockAuditDashboardService },
        DatePipe,
        MessageService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorAuditStatusDetailsComponent);
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
      fixture = TestBed.createComponent(AuditorAuditStatusDetailsComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      component.editUser = {
        status: "Audit Passed"
      };
      fixture.detectChanges();
    });
    it("should format request when a range is present", () => {
      component.editUser = {
        status: "Audit Passed"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({ auditStatus: "AuditSuccess" });
    });
    it("should format request when a  single value is selected", () => {
      component.editUser = {
        status: "Audit Passed"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({ auditStatus: "AuditSuccess" });
    });
    it("should format request when status is Audit Passed", () => {
      component.editUser = {
        status: "Audit Passed"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        auditStatus: "AuditSuccess"
      });
    });
    it("should format request when status is Audit Failed", () => {
      component.editUser = {
        status: "Audit Failed"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        auditStatus: "AuditFailed"
      });
    });

    it("should format request when status is Audit Rebuttal", () => {
      component.editUser = {
        status: "Audit Rebuttal"
      };
      fixture.detectChanges();
      const request = component.getPayload();
      expect(request).toEqual({
        auditStatus: "AuditRebuttal"
      });
    });

    it("should set failed status columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setStausFailedCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });

    it("should set passed status columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setStausPassedCols();
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
    let service;
    let adtservice;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditorAuditStatusDetailsComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      adtservice = fixture.debugElement.injector.get(AuditDashboardService);
      component = fixture.componentInstance;
      component.editUser = {
        status: "Audit Passed"
      };
      fixture.detectChanges();
    });
    it("should call service to fetch data when status is Audit Passed", () => {
      component.editUser = {
        status: "Audit Passed"
      };
      const servSpy = spyOn(adtservice, "auditStatusDetails").and.returnValue(
        openInvThrasholdGrid
      );
      fixture.detectChanges();
      component.auditVolStatus();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should call service to fetch data", () => {
      component.editUser = {
        status: "Audit Passed"
      };
      const servSpy = spyOn(adtservice, "auditStatusDetails").and.returnValue(
        openInvThrasholdGrid
      );
      fixture.detectChanges();
      component.auditVolStatus();
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
        status: "Audit Passed"
      };
      spyOn(component, "getPayload");
      const servSpy = spyOn(
        adtservice,
        "auditStatusDetailsReport"
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
      spyObj.setAttribute("download", "AuditStatus-" + dateString + ".xlsx");
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
      expect(spyObj.download).toBe("AuditStatus-" + dateString + ".xlsx");
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
