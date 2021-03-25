import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MyUsersComponent } from "./my-users.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageModule } from "primeng/message";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { MultiSelectModule } from "primeng/multiselect";
import { TableModule } from "primeng/table";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReportService } from "src/app/services/report/report.service";
import { of, Subscription, throwError } from "rxjs";
import { ConstantPool } from "@angular/compiler";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";

describe("MyUsersComponent", () => {
  let component: MyUsersComponent;
  let fixture: ComponentFixture<MyUsersComponent>;
  let authService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyUsersComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        MultiSelectModule,
        ComponentsModule,
        CalendarModule,
        DropdownModule,
        MessageModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe,
        ReportService,
        TaskmanagementService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyUsersComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthenticationService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should able to get user report - Active Users", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getMyUserReportListner").and.returnValue(of([]));
    component.userListForm.patchValue({
      activeFrom: new Date(),
      activeTo: new Date(),
      status: "Active",
      lead: "",
      userGroup: ""
    });
    component.reportSubscription = new Subscription();
    try {
      component.getMyUserReport();
    } catch (error) {
      console.log(error);
    }
    expect(component.isDataPresent).toBeFalsy();
  });

  it("should able to get user report - All Users", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getMyUserReportListner").and.returnValue(of(["Test"]));
    component.userListForm.patchValue({
      activeFrom: new Date(),
      activeTo: new Date(),
      status: "All",
      lead: "",
      userGroup: ""
    });
    component.reportSubscription = new Subscription();
    try {
      component.getMyUserReport();
    } catch (error) {
      console.log(error);
    }
    expect(component.isDataPresent).toBeTruthy();
  });

  it("should able to get user report - Inactive Users", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getMyUserReportListner").and.returnValue(of([]));
    component.userListForm.patchValue({
      activeFrom: new Date(),
      activeTo: new Date(),
      status: "Inactive",
      lead: "",
      userGroup: "Test"
    });
    component.reportSubscription = new Subscription();
    try {
      component.getMyUserReport();
    } catch (error) {
      console.log(error);
    }
    expect(component.isDataPresent).toBeFalsy();
  });

  it("should set user Id on Init", () => {
    const payload = {
      success: true,
      roleId: "Manager",
      authToken: "ysdgyeuroho"
    };
    spyOn(authService, "getUserDetails").and.returnValue(
      of({ id: "1", firstName: "", lastName: "" })
    );
    authService.setLogin(payload);
    const spy2 = spyOn(component, "getUserGroupList");
    const spy3 = spyOn(component, "getLeadList");
    component.ngOnInit();
    expect(component.userId).toEqual("1");
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it("get Claims Lead from leads list", () => {
    component.leadList = [
      {
        value: "test"
      }
    ];
    expect(component.mapLead("test")).toEqual({
      value: "test"
    });
  });

  it("should get leads list from API", () => {
    const service: TaskmanagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    spyOn(service, "getLeadNamesListner").and.returnValue(
      of([
        {
          value: "test"
        }
      ])
    );
    component.leadSubscription = new Subscription();
    component.getLeadList();
    expect(component.leadList.length).toBeGreaterThan(0);
  });

  it("should get user groups list from API", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getManagerUserGroups").and.returnValue(of([]));
    component.getUserGroupList();
    expect(component.userGroups).toEqual([]);
  });

  it("should get user groups list from API - No Res", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getManagerUserGroups").and.returnValue(of(null));
    component.getUserGroupList();
    expect(component.userGroups).toEqual([]);
  });

  it("should handle error on getting user groups list from API", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getManagerUserGroups").and.returnValue(
      throwError({ status: 400 })
    );
    component.getUserGroupList();
    expect(component.userGroups).toEqual([]);
  });

  it("should check the todate always greater than fromdate", () => {
    component.userListForm.patchValue({
      activeFrom: new Date(),
      activeTo: new Date(),
      status: "Inactive",
      lead: "",
      userGroup: "Test"
    });
    component.checkToDate();
    component.userListForm.patchValue({
      activeFrom: new Date(),
      activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
      status: "Inactive",
      lead: "",
      userGroup: "Test"
    });
    component.checkToDate();
    expect(component.getActiveTo.value).toBeNull();
  });

  it("should able to submit", () => {
    component.submit();
    component.myUsersTable = {
      reset: () => console.log("reset")
    };
    component.submit();
    expect(component).toBeTruthy();
  });

  it("should not allow to download excel when form is invalid", () => {
    component.userListForm.reset();
    component.exportExcel();
    expect(component).toBeTruthy();
  });

  it("should allow to download excel - Active", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getUserListReports").and.returnValue(of({ body: "test" }));
    component.userListForm.patchValue({
      activeFrom: new Date(),
      activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
      status: "Active",
      lead: "",
      userGroup: "Test"
    });
    component.exportExcel();
    expect(component).toBeTruthy();
  });

  it("should allow to download excel - All", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getUserListReports").and.returnValue(of({ body: "test" }));
    component.userListForm.patchValue({
      activeFrom: new Date(),
      activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
      status: "All",
      lead: "",
      userGroup: ""
    });
    component.exportExcel();
    expect(component).toBeTruthy();
  });

  it("should allow to download excel - Inactive", () => {
    const service: ReportService = fixture.debugElement.injector.get(
      ReportService
    );
    spyOn(service, "getUserListReports").and.returnValue(of({ body: "test" }));
    component.userListForm.patchValue({
      activeFrom: new Date(),
      activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
      status: "Inactive",
      lead: "",
      userGroup: "Test"
    });
    component.exportExcel();
    expect(component).toBeTruthy();
  });

  it("should get formatted date", () => {
    const date = new Date("12/12/2012");
    expect(component.getUserGroup.value).toBe("");
    expect(component.getLead.value).toBe("");
    expect(component.getFormattedDate(date)).toEqual("12/12/2012");
  });
});
