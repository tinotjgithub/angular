import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { AuditDetailsPageComponent } from "./audit-details-page.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { of, throwError } from "rxjs";
import { Observable } from "rxjs";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
const tblData = [
  {
    claimId: "23456123",
    assignmentType: "complete",
    claimType: "Complete",
    status: "Complete",
    receiptDate: "04/19/2019",
    age: "5",
    billedAmount: "5657",
    allowedAmount: "56790",
    paidAmount: "789",
    processedDate: "04/19/2019",
    examinerName: "Manju",
    claimQueueName: "Queue2",
    auditDate: "04/19/2019"
  }
];
class MockAuditorService extends AuditorService {
  getAuditQueueDetails(): Observable<any> {
    return of(tblData);
  }
}

describe("AuditDetailsPageComponent", () => {
  let component: AuditDetailsPageComponent;
  let fixture: ComponentFixture<AuditDetailsPageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditDetailsPageComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        TableModule,
        DropdownModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [
        AppConfigService,
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        { provide: AuditorService, useClass: MockAuditorService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AuditDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    // const route: ActivatedRoute = fixture.debugElement.injector.get(
    //   ActivatedRoute
    // );
    expect(component).toBeTruthy();
  });
  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(AuditDetailsPageComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should call service to fetch data", () => {
      component.claimsType = "Complete";
      const servSpy = spyOn(service, "getAuditQueueDetails")
        .and.returnValue(of(tblData))
        .and.callThrough();
      fixture.detectChanges();
      component.getQueueList();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should set table values as null when data is empty", () => {
      component.claimsType = "Complete";
      spyOn(service, "getAuditQueueDetails").and.returnValue(of([]));
      component.tableData = [];
      const col = { field: "claimId", header: "Claim ID", filter: "text" };
      fixture.detectChanges();
      const data = component.getOptions(col);
      expect(data.length).toEqual(0);
    });
    it("should set table values when data is not empty", () => {
      component.claimsType = "Complete";
      spyOn(service, "getAuditQueueDetails").and.returnValue(of(tblData));
      component.tableData = tblData;
      const col = { field: "claimId", header: "Claim ID", filter: "text" };
      fixture.detectChanges();
      const data = component.getOptions(col);
      expect(data.length).toBeGreaterThan(0);
    });
    it("should setCols length as 13 when claim type is complete", () => {
      component.claimsType = "Complete";
      fixture.detectChanges();
      component.setCols();
      expect(component.cols.length).toEqual(13);
    });
    it("should setCols length as 17 when claim type is failed", () => {
      component.claimsType = "failed";
      fixture.detectChanges();
      component.setCols();
      expect(component.cols.length).toEqual(17);
    });
  });
});
