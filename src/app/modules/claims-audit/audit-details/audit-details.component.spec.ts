import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditDetailsComponent } from "./audit-details.component";
import { RouterTestingModule } from "@angular/router/testing";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { GoogleChartsModule } from "angular-google-charts";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { of, throwError } from "rxjs";
import { InventoryStatus } from "../../auditor/model/auditor.model";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { QueuePageComponent } from "./../queue-page/queue-page.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { DropdownModule } from "primeng/dropdown";
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("AuditDetailsComponent", () => {
  let component: AuditDetailsComponent;
  let fixture: ComponentFixture<AuditDetailsComponent>;
  let service: AuditorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditDetailsComponent, QueuePageComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GoogleChartsModule,
        ComponentsModule,
        CalendarModule,
        RouterModule.forRoot([]),
        DropdownModule,
        DialogModule,
        TableModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ConfirmDialogModule,
        CheckboxModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        BaseHttpService,
        ConfirmationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditDetailsComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditorService);
    fixture.detectChanges();
  });

  it("should create", () => {
    spyOn(service, "getQueueSummaryLeadManager").and.returnValue(of({}));
    spyOn(service, "getAuditStatusLeadManager").and.returnValue(of(false));
    spyOn(
      service,
      "getProcessedClaimsInventoryStatusLeadManager"
    ).and.returnValue(of(false));
    console.log(component.queueSummary);
    expect(component).toBeTruthy();
  });

  it("should get queue summary", () => {
    const data = {
      todayQueue: 0,
      backlog: 2,
      rebuttalQueue: 0
    };
    spyOn(service, "getQueueSummaryLeadManager").and.returnValue(of(data));
    component.getQueueSummary();
    expect(component.queueSummary).toEqual(data);
  });

  it("should get queue summary", () => {
    const data = {
      todayQueue: 0,
      backlog: 2,
      rebuttalQueue: 0
    };
    spyOn(service, "getAuditStatusLeadManager").and.returnValue(of(data));
    component.getAuditStatus();
    expect(component.auditStatus).toEqual(data);
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
    spyOn(
      service,
      "getProcessedClaimsInventoryStatusLeadManager"
    ).and.returnValue(of(data));
    component.getClaimsInventoryStatus();
    expect(component.inventoryStatus).toEqual(data);
  });

  it("should handle the error on getting inventory details", () => {
    spyOn(
      service,
      "getProcessedClaimsInventoryStatusLeadManager"
    ).and.returnValue(throwError({ status: 404 }));
    component.getClaimsInventoryStatus();
    expect(component.inventoryStatus).toBeUndefined();
  });
  /*
  it("should call resize function", () => {
    component.ngOnInit();
    component.onWindowResize(null);
    expect(component).toBeTruthy();
  }); */

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
      ["Paper", 0, "#f25eb0", 0],
      ["EDI", 0, "#2b5381", 0]
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
    spyOn(service, "getQueueSummaryLeadManager").and.returnValue(of(null));
    component.addTolaimsQueue();
    expect(component.samplingForm.valid).toBeFalsy();
  });
});
