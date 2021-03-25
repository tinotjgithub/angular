/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LeadModifyUserComponent } from "./lead-modify-user.component";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { MessageService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { PaginatorModule } from "primeng/paginator";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("LeadModifyUserComponent", () => {
  let component: LeadModifyUserComponent;
  let fixture: ComponentFixture<LeadModifyUserComponent>;
  let service: UserManagementService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeadModifyUserComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        ComponentsModule,
        ComponentsModule,
        PaginatorModule,
        ReactiveFormsModule,
        TableModule,
        TooltipModule,
        CommonModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
        MessageService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        TaskmanagementService,
        UserManagementService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadModifyUserComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(UserManagementService);
    fixture.detectChanges();
    component.leadTarget[0] = {
      target: 5
    };
  });

  it("should create", () => {
    spyOn(service, 'getAllUsers').and.returnValue(of(''));
    expect(component).toBeTruthy();
  });

  it("should initiate table with columns", () => {
    spyOn(service, 'getAllUsers').and.returnValue(of({users: []}));
    component.ngOnInit();
    expect(component.editMode).toBeFalsy();
  });

  it("should return empty list when searched with empty value", () => {
    component.filterType = null;
    component.filterValue = null;
    component.search();
    expect(component.userList.length).toEqual(0);
  });

  it("should able to search for user with value", () => {
    spyOn(service, "leadModifyUserSearch").and.returnValue(of([]));
    component.filterType = "first-name";
    component.filterValue = "Test";
    component.search();
    expect(component.userList).toEqual([]);
  });

  it("should return empty [] when no response from API on search", () => {
    spyOn(service, "leadModifyUserSearch").and.returnValue(of(null));
    component.filterType = "first-name";
    component.filterValue = "Test";
    component.search();
    expect(component.userList).toEqual([]);
  });

  it("should handle the error on search", () => {
    spyOn(service, "leadModifyUserSearch").and.returnValue(
      throwError({ status: 400 })
    );
    component.filterType = "first-name";
    component.filterValue = "Test";
    try {
      component.search();
    } catch (error) {
      console.log(error);
    }
    expect(component.userList).toEqual([]);
  });

  // it('should able to update row on edit', () => {
  //   const user = {
  //     id: 1,
  //     firstName: "",
  //     lastName: "",
  //     dateOfBirth: "",
  //     userName: "",
  //     communicationEmail: "",
  //     role: "",
  //     status: "",
  //     activeDate: "",
  //     deactivateDate: "",
  //     ldapOrLocal: "",
  //     userGroupId: 1,
  //     userGroupName: "",
  //     leadName: "",
  //     managerName: "",
  //     target: 0,
  //   };
  //   component.onRowEditInit(user, 0);
  //   expect(component.leadTarget).toBe(0);
  // });

  it("should be able to clear filter", () => {
    component.filterChange();
    expect(component.filterValue).toEqual("");
  });

  it("should able to save on row edit - success", () => {
    const serviceTask: TaskmanagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    spyOn(serviceTask, "leadModifyUserUpdate").and.returnValue(of(true));
    const user = {
      id: 1,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      userName: "",
      communicationEmail: "",
      role: "",
      status: "",
      activeDate: "",
      deactivateDate: "",
      ldapOrLocal: "",
      userGroupId: 1,
      userGroupName: "",
      leadName: "",
      managerName: "",
      target: 0
    };
    component.onRowEditSave(user, 0);
    component.onRowEditSave(user, 0, true);
    expect(component.failed).toBeFalsy();
  });

  it("should able to handle error on row edit save", () => {
    const serviceTask: TaskmanagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    spyOn(component.leadTarget, 'delete').and.callFake(() => true);
    spyOn(serviceTask, "leadModifyUserUpdate").and.returnValue(
      throwError({ status: 400, error: { message: "Test" } })
    );
    const user = {
      id: 1,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      userName: "",
      communicationEmail: "",
      role: "",
      status: "",
      activeDate: "",
      deactivateDate: "",
      ldapOrLocal: "",
      userGroupId: 1,
      userGroupName: "",
      leadName: "",
      managerName: "",
      target: 0
    };
    component.userList = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];
    component.allUserList = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];
    component.leadTarget.set('all7', 7);
    try {
      component.onRowEditSave(user, 0);
      component.onRowEditSave(user, 0, true);
    } catch (error) {
      console.log(error);
    }
    expect(component.failed).toBeTruthy();
  });

  it("should able to handle error on row edit save - no message", () => {
    const serviceTask = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(serviceTask, "leadModifyUserUpdate").and.returnValue(
      throwError({ status: 400 })
    );
    const user = {
      id: 1,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      userName: "",
      communicationEmail: "",
      role: "",
      status: "",
      activeDate: "",
      deactivateDate: "",
      ldapOrLocal: "",
      userGroupId: 1,
      userGroupName: "",
      leadName: "",
      managerName: "",
      target: 0
    };
    try {
      component.userList = [
        {
          id: 7,
          firstName: "Devika",
          lastName: "Kumari",
          dateOfBirth: "2020-02-28",
          userName: "devika.k@ust-global.com",
          communicationEmail: "devika.kumari@ust-global.com",
          role: "Claims Examiner",
          status: "Active",
          activeDate: "2020-02-28",
          deactivateDate: "2099-12-31",
          ldapOrLocal: false,
          userGroupId: 2,
          userGroupName: "UG1",
          leadName: "Tino",
          managerName: "Deepa",
          target: 15,
          userRoleId: 4
        }
      ];
      component.allUserList = [
        {
          id: 7,
          firstName: "Devika",
          lastName: "Kumari",
          dateOfBirth: "2020-02-28",
          userName: "devika.k@ust-global.com",
          communicationEmail: "devika.kumari@ust-global.com",
          role: "Claims Examiner",
          status: "Active",
          activeDate: "2020-02-28",
          deactivateDate: "2099-12-31",
          ldapOrLocal: false,
          userGroupId: 2,
          userGroupName: "UG1",
          leadName: "Tino",
          managerName: "Deepa",
          target: 15,
          userRoleId: 4
        }
      ];

      component.onRowEditInit(user, 0);
      component.onRowEditSave(user, 0);
    } catch (error) {
      console.log(error);
    }
    expect(component.failed).toBeTruthy();
  });

  it("should able to cancel row edit", () => {
    const user = {
      id: 1,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      userName: "",
      communicationEmail: "",
      role: "",
      status: "",
      activeDate: "",
      deactivateDate: "",
      ldapOrLocal: "",
      userGroupId: 1,
      userGroupName: "",
      leadName: "",
      managerName: "",
      target: 0
    };
    component.userList = [user];
    component.onRowEditInit(user, 0);
    component.onRowEditCancel(user, 0);
    expect(component.userList[0].target).toEqual(0);
  });

  it("should able to cancel row edit - all", () => {
    const user = {
      id: 1,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      userName: "",
      communicationEmail: "",
      role: "",
      status: "",
      activeDate: "",
      deactivateDate: "",
      ldapOrLocal: "",
      userGroupId: 1,
      userGroupName: "",
      leadName: "",
      managerName: "",
      target: 0
    };
    component.allUserList = [user];
    component.onRowEditInit(user, 0, true);
    component.onRowEditCancel(user, 0, true);
    expect(component.allUserList[0].target).toEqual(0);
  });

  it("should be able to reset table", () => {
    component.resetTable({
      reset: () => console.log()
    });
    expect(component).toBeTruthy();
  });

  it('prevent input', () => {
    component.preventInput('', {target: 80});
    const event = {
      preventDefault: () => console.log('event')
    };
    const rowData = {
      target: 120
    };
    component.preventInput(event, rowData);
    expect(rowData.target).toEqual(12);
  });

  it('paginate', () => {
    spyOn(service, 'getAllUsers').and.returnValue(of(''));
    const details = {page: 1, rows: 2};
    component.paginate(details);
    component.onRowEditSave({target: ""}, 0);
    component.resetTable(null);
    expect(component).toBeTruthy();
  });
});
