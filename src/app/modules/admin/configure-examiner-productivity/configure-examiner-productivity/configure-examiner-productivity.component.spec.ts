import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigureExaminerProductivityComponent } from "./configure-examiner-productivity.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from "primeng/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MessageService, ConfirmationService, Confirmation } from "primeng/api";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { of } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { CheckboxModule } from "primeng/checkbox";
describe("ConfigureExaminerProductivityComponent", () => {
  let component: ConfigureExaminerProductivityComponent;
  let fixture: ComponentFixture<ConfigureExaminerProductivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureExaminerProductivityComponent],
      imports: [
        CommonModule,
        CalendarModule,
        TooltipModule,
        RouterTestingModule,
        FormsModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        CheckboxModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        UserManagementService,
        ConfirmationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureExaminerProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initiate form", () => {
    const service: UserManagementService = fixture.debugElement.injector.get(
      UserManagementService
    );
    spyOn(service, "getExaminerProductivitiyConfig").and.returnValue(
      of({
        routedOutStatus: ""
      })
    );
    component.ngOnInit();
    expect(component.getFormControl("routedOutStatus").value).toBeFalsy();
  });

  it("should initiate form with data from API", () => {
    const service: UserManagementService = fixture.debugElement.injector.get(
      UserManagementService
    );
    spyOn(service, "getExaminerProductivitiyConfig").and.returnValue(
      of({
        routedOutStatus: true
      })
    );
    component.ngOnInit();
    expect(component.getFormControl("routedOutStatus").value).toBeTruthy();
  });

  it("should able to save data to service", () => {
    const service: UserManagementService = fixture.debugElement.injector.get(
      UserManagementService
    );
    spyOn(service, "ExaminerProductivitiyConfig").and.returnValue(
      of("success")
    );
    component.submit();
    expect(component.getFormControl("routedOutStatus").value).toBeFalsy();
  });
});
