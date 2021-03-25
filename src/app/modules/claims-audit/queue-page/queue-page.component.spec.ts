import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { QueuePageComponent } from "./queue-page.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleChartsModule } from "angular-google-charts";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, Confirmation } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { of } from "rxjs";
import { DropdownModule } from "primeng/dropdown";

describe("QueuePageComponent", () => {
  let component: QueuePageComponent;
  let fixture: ComponentFixture<QueuePageComponent>;
  let service: AuditorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QueuePageComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GoogleChartsModule,
        CalendarModule,
        DialogModule,
        TableModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ConfirmDialogModule,
        CheckboxModule,
        DropdownModule
      ],
      providers: [BaseHttpService, ConfirmationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuePageComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditorService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    component.claimsType = "backlog";
    component.setCols();
    component.resetTable(null);
    expect(component.cols.length).toEqual(16);
  });

  it("should set cols for backlog", () => {
    component.claimsType = "backlog";
    component.setCols();
    expect(component.cols.length).toEqual(16);
  });

  it("should get claim & count - no data", () => {
    spyOn(service, "getQueueDetailsLeadManager").and.returnValue(of(""));
    spyOn(
      service,
      "getUnassignedClaimsCountAndAuditorsLeadManager"
    ).and.returnValue(of(""));
    component.getQueueList();
    expect(component.tableData).toEqual([]);
    expect(component.auditorNames).toEqual([]);
  });

  it("should get claim & count - with data", () => {
    spyOn(service, "getQueueDetailsLeadManager").and.returnValue(of([]));
    spyOn(
      service,
      "getUnassignedClaimsCountAndAuditorsLeadManager"
    ).and.returnValue(
      of({
        unassignedCount: 1,
        auditorNames: {
          101: "Brian"
        }
      })
    );
    component.getQueueList();
    expect(component.tableData).toEqual([]);
    expect(component.auditorNames).toEqual([
      {
        value: null,
        label: "Select",
        count: "all"
      }
    ]);
  });

  it("should get options from data", () => {
    component.tableData = [];
    expect(component.getOptions({ field: "" })).toEqual([]);
    component.tableData = [
      {
        name: "Test"
      },
      {
        name: "Test-1"
      }
    ];
    expect(component.getOptions({ field: "name" })).toEqual(["Test", "Test-1"]);
  });

  it("shouls delete claims", () => {
    spyOn(service, "getQueueDetailsLeadManager").and.returnValue(of(""));
    spyOn(service, "deleteClaimLeadManager").and.returnValue(of(""));
    component.toggleDelete(true);
    component.selectedClaims = [
      {
        stagingId: 1
      }
    ];
    component.deleteClaimFromQueue();
    expect(component.selectedClaims).toEqual([]);
  });

  it("should get auditor claims", () => {
    spyOn(service, "getAuditorClaimsLeadManager").and.returnValue(of(""));
    spyOn(service, "getQueueDetailsLeadManager").and.returnValue(of(""));
    spyOn(service, "deleteClaimLeadManager").and.returnValue(of(""));
    const cnfm: ConfirmationService = fixture.debugElement.injector.get(
      ConfirmationService
    );
    spyOn(cnfm, "confirm").and.callFake((confirm: Confirmation) => {
      return confirm.accept();
    });
    component.selectedClaims = [{ stagingId: 1 }];
    component.auditorNameChange(1);
    expect(component.selectedClaims).toEqual([]);
  });

  it("should not get auditor claims", () => {
    spyOn(service, "getQueueDetailsLeadManager").and.returnValue(of(""));
    spyOn(service, "deleteClaimLeadManager").and.returnValue(of(""));
    component.selectedClaims = [{ stagingId: 1 }];
    component.auditorNameChange("");
    expect(component.selectedClaims).toEqual([]);
  });

  it("should get auditor claims - reject", () => {
    spyOn(service, "getQueueDetailsLeadManager").and.returnValue(of(""));
    spyOn(service, "deleteClaimLeadManager").and.returnValue(of(""));
    const cnfm: ConfirmationService = fixture.debugElement.injector.get(
      ConfirmationService
    );
    spyOn(cnfm, "confirm").and.callFake((confirm: Confirmation) => {
      return confirm.reject();
    });
    component.selectedClaims = [{ stagingId: 1 }];
    component.auditorNameChange(1);
    expect(component.selectedClaims).toEqual([{ stagingId: 1 }]);
  });

  it("should get auditor claims - no selected claims", () => {
    spyOn(service, "getAuditorClaimsLeadManager").and.returnValue(
      of({
        queueDetailDtoList: [],
        unAssignedCount: 2,
        assignedCount: 1
      })
    );
    spyOn(service, "getQueueDetailsLeadManager").and.returnValue(of(""));
    spyOn(service, "deleteClaimLeadManager").and.returnValue(of(""));
    component.selectedClaims = [];
    component.auditorNameChange(1);
    expect(component.tableData).toEqual([]);
  });

  it("should assign claims", () => {
    spyOn(service, "getAuditorClaimsLeadManager").and.returnValue(of(""));
    spyOn(service, "assignClaims").and.returnValue(of(""));
    component.selectedClaims = [{ stagingId: 1 }];
    component.auditorName = "2";
    component.assignClaims();
    expect(component.selectedClaims).toEqual([]);
    component.cancelAssign();
  });

  it("should select all claims", () => {
    component.tableData = [{ stagingId: 1, assignmentStatus: "No" }];
    component.selectAllUnassigned(true);
    expect(component.selectedClaims.length).toEqual(1);
    component.selectAllUnassigned("");
    expect(component.selectedClaims.length).toEqual(0);
  });
});
