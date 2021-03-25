import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChecklistComponent } from "./checklist.component";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuditorService } from "src/app/services/auditor/auditor.service";

import { RouterModule, Routes } from "@angular/router";
import { DialogModule } from "primeng/dialog";

import { of } from "rxjs";

describe("ChecklistComponent", () => {
  let component: ChecklistComponent;
  let fixture: ComponentFixture<ChecklistComponent>;
  let service: AuditorService;
  const checklistData = {
    checkpoints: {
      Professional: ["check1", "check2"],
      "Institutional-IP": ["check1", "check3", "check4", "check5"],
      "Institutional-OP": ["check1", "check3", "check4", "check5"],
      Others: ["check1", "check2"]
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistComponent],
      imports: [
        CommonModule,
        TableModule,
        TooltipModule,
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        FormsModule,
        DialogModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [AuditorService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditorService);
    fixture.detectChanges();
  });

  it("should create", () => {
    spyOn(service, "getChecklist").and.returnValue(of({}));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should get checklist item", () => {
    spyOn(service, "getChecklist").and.returnValue(of(checklistData));
    component.getChecklistItems();
    expect(component.claimsData.Professional).toEqual(["check1", "check2"]);
  });

  it("should prevent adding checkpoint on invalid conditions", () => {
    component.addCheckPoint();
    expect(component.claimsData.Professional).toEqual([]);
    component.checklistForm.patchValue({
      type: "test",
      checkpoint: "12@djdc"
    });
    component.addCheckPoint();
    expect(component.claimsData.Professional).toEqual([]);
  });

  it("should not add empty checkpoint", () => {
    component.checklistForm.patchValue({
      type: "test",
      checkpoint: "  "
    });
    component.addCheckPoint();
    expect(component.claimsData.Professional).toEqual([]);
  });

  it("should add checkpoint", () => {
    component.checklistForm.patchValue({
      type: "Professional",
      checkpoint: "test"
    });
    spyOn(service, "addChecklist").and.returnValue(of(checklistData));
    component.addCheckPoint();
    expect(component.claimsData.Professional).toEqual(["check1", "check2"]);
  });

  it("should remove checkpoint", () => {
    spyOn(service, "removeChecklist").and.returnValue(of(checklistData));
    component.selectedClaims = checklistData.checkpoints;
    component.deleteChecklist("Professional");
    expect(component.selectedClaims.Professional).toEqual([]);
  });
});
