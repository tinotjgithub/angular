import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LandingPageComponent } from "./landing-page.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { of, throwError } from "rxjs";
import { InventoryStatus } from "../../model/auditor.model";
import { Router } from "@angular/router";
import { AuditorAuditStatusComponent } from "./../landing-page/auditor-audit-status/auditor-audit-status.component";
import { AuditorQualityScoreComponent } from "./../landing-page/auditor-quality-score/auditor-quality-score.component";
// tslint:disable-next-line: max-line-length
import { AuditorClaimsAuditedCategoryComponent } from "./../landing-page/auditor-claims-audited-category/auditor-claims-audited-category.component";
import { AuditorClaimsAuditedComponent } from "./../landing-page/auditor-claims-audited/auditor-claims-audited.component";
import { DialogModule } from "primeng/dialog";
import { DatePipe } from "@angular/common";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ConfirmationService } from 'primeng/api';
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
import { APP_INITIALIZER } from '@angular/core';
import { AuditorAuditStatusDetailsComponent } from './auditor-audit-status/auditor-audit-status-details/auditor-audit-status-details.component';
import { AuditorClaimsAuditedDetailsComponent } from './auditor-claims-audited/auditor-claims-audited-details/auditor-claims-audited-details.component';
import { AuditorQualityScoreDetailsComponent } from './auditor-quality-score/auditor-quality-score-details/auditor-quality-score-details.component';
import { ClaimsAuditedCategoryDetailsComponent } from './auditor-claims-audited-category/claims-audited-category-details/claims-audited-category-details.component';
import { TableModule } from 'primeng/table';
describe("LandingPageComponent", () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let service: AuditorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LandingPageComponent,
        AuditorAuditStatusComponent,
        AuditorClaimsAuditedComponent,
        AuditorQualityScoreComponent,
        AuditorClaimsAuditedCategoryComponent,
        AuditorAuditStatusDetailsComponent,
        AuditorClaimsAuditedDetailsComponent,
        AuditorQualityScoreDetailsComponent,
        ClaimsAuditedCategoryDetailsComponent
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        DialogModule,
        CalendarModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TableModule
      ],
      providers: [
        AppConfigService,
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        AuditorService,
        ConfirmationService,
        DatePipe,
        { provide: BaseHttpService, useClass: MockBaseHttpService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditorService);
    fixture.detectChanges();
  });

  it("should create", () => {
    spyOn(service, "getQueueSummary").and.returnValue(of({}));
    spyOn(service, "getAuditStatus").and.returnValue(of(false));
    spyOn(service, "getProcessedClaimsInventoryStatus").and.returnValue(
      of(false)
    );
    console.log(component.queueSummary);
    expect(component).toBeTruthy();
  });

  it("should get queue summary", () => {
    const data = {
      todayQueue: 0,
      backlog: 2,
      rebuttalQueue: 0
    };
    spyOn(service, "getQueueSummary").and.returnValue(of(data));
    component.getQueueSummary();
    expect(component.queueSummary).toEqual(data);
  });

  it("should get the graph details", () => {
    const data = {
      totalClaimsCount: 2,
      manualClaimsCount: 1,
      adjustedClaimsCount: 1,
      claimSource: {
        Paper: 1,
        EDI: 1
      },
      claimType: {
        Others: 1,
        Professional: 1
      },
      claimDecision: {
        Paid: 1,
        Deny: 1
      }
    };
    spyOn(service, "getProcessedClaimsInventoryStatus").and.returnValue(
      of(data)
    );
    component.getClaimsInventoryStatus();
    expect(component.inventoryStatus).toEqual(data);
  });

  it("should handle the error on getting inventory details", () => {
    spyOn(service, "getProcessedClaimsInventoryStatus").and.returnValue(
      throwError({ status: 404 })
    );
    component.getClaimsInventoryStatus();
    expect(component.inventoryStatus).toBeUndefined();
  });

  it("should process graph with no data", () => {
    const data: InventoryStatus = null;
    component.inventoryStatus = data;
    component.processGraph();
    expect(component.claimSourceData).toEqual([["NO DATA", 0, "", "0"]]);
  });

  it("should process graph with no values", () => {
    const data: InventoryStatus = {
      totalClaimsCount: 0,
      manualClaimsCount: 0,
      adjustedClaimsCount: 0,
      claimSource: null,
      claimType: null,
      claimDecision: null
    };
    component.inventoryStatus = data;
    component.processGraph();
    expect(component.claimSourceData).toEqual([["NO DATA", 0, "", "0"]]);
  });

  it("should process graph with no inside values", () => {
    const data: InventoryStatus = {
      totalClaimsCount: 0,
      manualClaimsCount: 0,
      adjustedClaimsCount: 0,
      claimSource: {
        EDI: null,
        Paper: null
      },
      claimType: {
        "Institutional-IP": null,
        "Institutional-OP": null,
        Others: null,
        Professional: null
      },
      claimDecision: {
        Deny: null,
        Paid: null
      }
    };
    component.inventoryStatus = data;
    component.processGraph();
    expect(component.claimSourceData).toEqual([
      ["Paper", 0, "#c5b200", 0],
      ["EDI", 0, "#4cc14f", 0]
    ]);
  });

  it("should prevent get Claim on Invalid conditions", () => {
    component.getClaimCount();
    expect(component.claimCountDetails).toBeUndefined();
  });

  it("should get Claim", () => {
    const data = {
      autoSamplingCount: 8,
      manualSamplingCount: 0
    };
    spyOn(service, "getClaimCountDetails").and.returnValue(of(data));
    const today = new Date();
    const yesterday = new Date(new Date().setDate(today.getDate() - 1));
    component.samplingForm.patchValue({
      from: yesterday,
      to: yesterday,
      criteriaType: "AUTO"
    });
    component.getClaimCount();
    expect(component.claimCountDetails).toEqual(data);
  });

  it("should handle error on get Claim", () => {
    spyOn(service, "getClaimCountDetails").and.returnValue(
      throwError({ status: 400 })
    );
    const today = new Date();
    const yesterday = new Date(new Date().setDate(today.getDate() - 1));
    component.samplingForm.patchValue({
      from: yesterday,
      to: yesterday,
      criteriaType: "AUTO"
    });
    component.getClaimCount();
    expect(component.claimCountDetails).toBeNull();
  });

  it("should prevent add Claim on Invalid conditions", () => {
    component.claimCountDetails = {
      autoSamplingCount: 8,
      manualSamplingCount: 0
    };
    component.addTolaimsQueue();
    expect(component.claimCountDetails).toBeDefined();
    component.claimCountDetails = null;
    const today = new Date();
    const yesterday = new Date(new Date().setDate(today.getDate() - 1));
    component.samplingForm.patchValue({
      from: yesterday,
      to: yesterday,
      criteriaType: "AUTO"
    });
    component.addTolaimsQueue();
    expect(component.samplingForm.valid).toBeTruthy();
  });

  it("should add Claim", () => {
    component.claimCountDetails = {
      autoSamplingCount: 8,
      manualSamplingCount: 0
    };
    const today = new Date();
    const yesterday = new Date(new Date().setDate(today.getDate() - 1));
    component.samplingForm.patchValue({
      from: yesterday,
      to: yesterday,
      criteriaType: "AUTO"
    });
    spyOn(service, "addClaimCountDetails").and.returnValue(of(true));
    spyOn(service, "getQueueSummary").and.returnValue(of(null));
    component.addTolaimsQueue();
    expect(component.samplingForm.valid).toBeFalsy();
  });

  it("should navigate to backlog queue summay page", () => {
    component.queueSummary = {
      todayQueue: 0,
      backlog: 2,
      rebuttalQueue: 0
    };
    const router: Router = fixture.debugElement.injector.get(Router);
    const spyRouter = spyOn(router, "navigateByUrl").and.returnValue(
      new Promise((res, rej) => res(true))
    );
    component.navigateToSummaryQueue("backlog");
    expect(spyRouter).toHaveBeenCalled();
  });

  it("should navigate to rebuttal queue summay page", () => {
    component.queueSummary = {
      todayQueue: 0,
      backlog: 2,
      rebuttalQueue: 2
    };
    const router: Router = fixture.debugElement.injector.get(Router);
    const spyRouter = spyOn(router, "navigateByUrl").and.returnValue(
      new Promise((res, rej) => res(true))
    );
    component.navigateToSummaryQueue("rebuttal");
    expect(spyRouter).toHaveBeenCalled();
  });

  it("should not navigate on other types", () => {
    component.queueSummary = {
      todayQueue: 0,
      backlog: 2,
      rebuttalQueue: 0
    };
    const router: Router = fixture.debugElement.injector.get(Router);
    const spyRouter = spyOn(router, "navigateByUrl").and.returnValue(
      new Promise((res, rej) => res(true))
    );
    component.navigateToSummaryQueue("test");
    expect(spyRouter).not.toHaveBeenCalled();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
  /* it("should call resize function", () => {
    component.onWindowResize(null);
    expect(component).toBeTruthy();
  }); */
});
