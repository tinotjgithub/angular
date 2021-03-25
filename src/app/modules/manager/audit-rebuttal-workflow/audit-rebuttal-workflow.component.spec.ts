import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditRebuttalWorkflowComponent } from "./audit-rebuttal-workflow.component";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageModule } from "primeng/message";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuditRebuttalWorkflowService } from "../../services/audit-rebuttal-workflow.service";
import { of, Observable } from "rxjs";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

const sav = [
  {
    flowId: 1,
    roleId: 2,
    roleName: "Manager",
    isLevelOneFlowEnabled: true,
    isLevelTwoFlowEnabled: false,
    isLevelThreeFlowEnabled: true
  },
  {
    flowId: 2,
    roleId: 3,
    roleName: "Claims Lead",
    isLevelOneFlowEnabled: true,
    isLevelTwoFlowEnabled: true,
    isLevelThreeFlowEnabled: false
  },
  {
    flowId: 3,
    roleId: 4,
    roleName: "Claims Auditor",
    isLevelOneFlowEnabled: true,
    isLevelTwoFlowEnabled: true,
    isLevelThreeFlowEnabled: false
  },
  {
    flowId: 4,
    roleId: 5,
    roleName: "Claims Examiner",
    isLevelOneFlowEnabled: true,
    isLevelTwoFlowEnabled: true,
    isLevelThreeFlowEnabled: false
  }
];

class MockAuditRebuttalWorkflowService extends AuditRebuttalWorkflowService {
  getSavedWorkFlowConfig(): Observable<any> {
    return of(sav);
  }
}
describe("AuditRebuttalWorkflowComponent", () => {
  let component: AuditRebuttalWorkflowComponent;
  let fixture: ComponentFixture<AuditRebuttalWorkflowComponent>;
  let auditRebuttalWorkflowService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditRebuttalWorkflowComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MessageModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        TooltipModule,
        CalendarModule,
        CardModule,
        HttpClientTestingModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        {
          provide: AuditRebuttalWorkflowService,
          useClass: MockAuditRebuttalWorkflowService
        },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AuditRebuttalWorkflowComponent);
    auditRebuttalWorkflowService = fixture.debugElement.injector.get(
      AuditRebuttalWorkflowService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRebuttalWorkflowComponent);
    component = fixture.componentInstance;
    auditRebuttalWorkflowService = fixture.debugElement.injector.get(
      AuditRebuttalWorkflowService
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("initializeForm", () => {
    component.initializeForm();
    expect(component.formGroupLevel1).toBeDefined();
    expect(component.formGroupLevel2).toBeDefined();
    expect(component.formGroupLevel3).toBeDefined();
    expect(component.managerForm).toBeDefined();
    expect(component.leadForm).toBeDefined();
    expect(component.examinerForm).toBeDefined();
  });
  const data = [
    {
      flowId: 1,
      roleId: 2,
      roleName: "Manager",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: false,
      isLevelThreeFlowEnabled: true
    },
    {
      flowId: 2,
      roleId: 3,
      roleName: "Claims Lead",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: true,
      isLevelThreeFlowEnabled: false
    },
    {
      flowId: 3,
      roleId: 5,
      roleName: "Claims Auditor",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: true,
      isLevelThreeFlowEnabled: false
    },
    {
      flowId: 4,
      roleId: 4,
      roleName: "Claims Examiner",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: true,
      isLevelThreeFlowEnabled: false
    }
  ];

  it("getSavedWorkFlowConfig", () => {
    const spy = spyOn(
      auditRebuttalWorkflowService,
      "getSavedWorkFlowConfig"
    ).and.returnValue(of(data));
    const spy2 = spyOn(component, "patchForm");
    component.getSavedWorkFlowConfig();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("patchForm", () => {
    component.initializeForm();
    expect(component.formGroupLevel1.value).toEqual({
      isLevelOneFlowEnabledForManager: false,
      isLevelOneFlowEnabledForLead: false
    });
    expect(component.formGroupLevel2.value).toEqual({
      isLevelTwoFlowEnabledForManager: false,
      isLevelTwoFlowEnabledForLead: false
    });
    expect(component.formGroupLevel3.value).toEqual({
      isLevelThreeFlowEnabledForManager: false,
      isLevelThreeFlowEnabledForLead: false
    });
    expect(component.leadForm.value).toEqual({
      flowId: 0,
      roleId: 0,
      roleName: "Claims Lead"
    });
    expect(component.managerForm.value).toEqual({
      flowId: 0,
      roleId: 0,
      roleName: "Manager"
    });
    expect(component.examinerForm.value).toEqual({
      flowId: 0,
      roleId: 0,
      roleName: "Claims Examiner"
    });
    expect(component.auditorForm.value).toEqual({
      flowId: 0,
      roleId: 0,
      roleName: "Claims Auditor"
    });

    component.patchForm(data);

    expect(component.formGroupLevel1.value).toEqual({
      isLevelOneFlowEnabledForManager: true,
      isLevelOneFlowEnabledForLead: true
    });
    expect(component.formGroupLevel2.value).toEqual({
      isLevelTwoFlowEnabledForManager: false,
      isLevelTwoFlowEnabledForLead: true
    });
    expect(component.formGroupLevel3.value).toEqual({
      isLevelThreeFlowEnabledForManager: true,
      isLevelThreeFlowEnabledForLead: false
    });
    expect(component.leadForm.value).toEqual({
      flowId: 2,
      roleId: 3,
      roleName: "Claims Lead"
    });
    expect(component.managerForm.value).toEqual({
      flowId: 1,
      roleId: 2,
      roleName: "Manager"
    });
    expect(component.examinerForm.value).toEqual({
      flowId: 4,
      roleId: 4,
      roleName: "Claims Examiner"
    });
    expect(component.auditorForm.value).toEqual({
      flowId: 3,
      roleId: 5,
      roleName: "Claims Auditor"
    });
  });

  it("AtLeastOneFieldValidator", () => {
    component.initializeForm();
    component.formGroupLevel2.setValidators(component.AtLeastOneFieldValidator);
    component.formGroupLevel3.setValidators(component.AtLeastOneFieldValidator);
    component.formGroupLevel1.patchValue({
      isLevelOneFlowEnabledForManager: false,
      isLevelOneFlowEnabledForLead: false
    });
    fixture.detectChanges();
    const comp1 = component.AtLeastOneFieldValidator(component.formGroupLevel1);
    expect(comp1).toEqual({ required: true });

    component.formGroupLevel2.patchValue({
      isLevelTwoFlowEnabledForManager: false,
      isLevelTwoFlowEnabledForLead: false
    });
    fixture.detectChanges();
    const comp2 = component.AtLeastOneFieldValidator(component.formGroupLevel2);
    expect(comp2).toEqual({ required: true });
    component.formGroupLevel3.patchValue({
      isLevelThreeFlowEnabledForManager: false,
      isLevelThreeFlowEnabledForLead: false
    });
    fixture.detectChanges();
    const comp3 = component.AtLeastOneFieldValidator(component.formGroupLevel3);
    expect(comp3).toEqual({ required: true });
    component.formGroupLevel2.patchValue({
      isLevelTwoFlowEnabledForManager: false,
      isLevelTwoFlowEnabledForLead: false
    });
    fixture.detectChanges();
    const compp2 = component.AtLeastOneFieldValidator(
      component.formGroupLevel2
    );
    expect(compp2).toEqual({ required: true });
  });

  it("saveWorkFlowConfig", () => {
    const saveSpy = spyOn(
      auditRebuttalWorkflowService,
      "saveWorkFlowConfig"
    ).and.returnValue(of(true));
    const spy2 = spyOn(component, "patchForm");
    component.onSave();
    expect(spy2).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
  });
});
