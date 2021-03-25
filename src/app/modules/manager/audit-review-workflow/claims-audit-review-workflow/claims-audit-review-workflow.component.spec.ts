import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NotifierService } from "src/app/services/notifier.service";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageModule } from "primeng/message";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { AuditorService } from "./../../../../services/auditor/auditor.service";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { workflowData } from "./../../../../mocks/mock-data";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ClaimsAuditReviewWorkflowComponent } from "./claims-audit-review-workflow.component";
import { CalendarModule } from "primeng/calendar";
import { DatePipe } from "@angular/common";
import { of, Subscription, throwError } from "rxjs";

class MockAuditorService extends AuditorService {
  getWorkFlowRoles() {
    const auditWorkFlowArray: any = workflowData;
    this.workFlowRoleSub.next(auditWorkFlowArray);
  }
}

class MockNotiferService extends NotifierService {
  throwNotification(notification) {
    this.notifierListener.next({
      type: notification.type,
      message: notification.message
    });
  }
}

describe("ClaimsAuditReviewWorkflowComponent", () => {
  let component: ClaimsAuditReviewWorkflowComponent;
  let fixture: ComponentFixture<ClaimsAuditReviewWorkflowComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsAuditReviewWorkflowComponent],
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
        { provide: AuditorService, useClass: MockAuditorService },
        { provide: NotifierService, useClass: MockNotiferService },
        MessageService,
        ConfirmationService,
        DatePipe,
        { provide: BaseHttpService, useClass: MockBaseHttpService }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAuditReviewWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditReviewWorkflowComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set data to checkboxes", () => {
      component.isrendered = false;
      fixture.detectChanges();
      component.createRoles();
      expect(component.isrendered).toBeTruthy();
    });
    it("should enable/disable roles when value is present", () => {
      component.workRoles = [];
      fixture.detectChanges();
      component.createFormInputs(workflowData.roles);
      expect(component.workRoles.length).toBeGreaterThan(0);
    });
    it("should not enable/disable roles when no value is present", () => {
      component.workRoles = [];
      fixture.detectChanges();
      component.createFormInputs([]);
      expect(component.workRoles.length).toEqual(0);
    });
    it("should not enable/disable roles when no value is present", () => {
      component.workRoles = [];
      fixture.detectChanges();
      component.createFormInputs([]);
      expect(component.workRoles.length).toEqual(0);
    });
    it("should save enabled roles when selected", () => {
      component.workRoles = [];
      component.workRoles = workflowData.roles;
      component.isLeadDisabled = false;
      component.isManagerDisabled = false;
      component.isAuditorDisabled = false;
      const compSpy = spyOn(component, "saveRoleWorkFlow");
      fixture.detectChanges();
      component.onChange(1, true);
      expect(compSpy).toHaveBeenCalled();
    });
  });

  describe("Should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditReviewWorkflowComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should fetch report data from service", () => {
      const servSpy = spyOn(service, "getWorkFlowRoles");
      spyOn(component, "createFormInputs");
      fixture.detectChanges();
      component.getRoleActions();
      expect(servSpy).toHaveBeenCalled();
    });
  });

  describe("Should save data to service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimsAuditReviewWorkflowComponent);
      service = fixture.debugElement.injector.get(AuditorService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should save selected value to service", () => {
      component.workRoles = workflowData;
      const servSpy = spyOn(service, "saveWorkFlowRoles");
      fixture.detectChanges();
      component.saveRoleWorkFlow();
      expect(servSpy).toHaveBeenCalled();
    });
  });
  afterAll(() => {
    localStorage.clear();
  });
});
