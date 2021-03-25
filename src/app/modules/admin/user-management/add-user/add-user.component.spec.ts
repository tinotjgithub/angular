import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddUserComponent } from "./add-user.component";
import { CommonModule, DatePipe } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { CalendarModule } from "primeng/calendar";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MessageService } from "primeng/api";
import { RouterTestingModule } from "@angular/router/testing";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { throwError, of, Subject } from "rxjs";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { MultiSelectModule } from "primeng/multiselect";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";

describe("AddUserComponent", () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let service: UserManagementService;
  let authService: AuthenticationService;
  let localStorage: CryptoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        CalendarModule,
        HttpClientTestingModule,
        MultiSelectModule,
        RouterTestingModule.withRoutes([{ path: 'manager-home', component: AddUserComponent}])
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        AuthenticationService,
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(UserManagementService);
    authService = fixture.debugElement.injector.get(AuthenticationService);
    localStorage = fixture.debugElement.injector.get(CryptoService);
    localStorage.setItem("roleId", "Admininstrator");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Edit User", () => {
    beforeEach(() => {
      component.editUser = {
        id: 1,
        firstName: "John",
        lastName: "Steve",
        userName: "johnst@prompt.com",
        dateOfBirth: "12/12/1989",
        role: "Claims Lead",
        communicationEmail: "johnst@prompt.com",
        status: "Active",
        activeDate: "12/12/2015",
        deactiveDate: "12/12/2022",
        ldapUser: true,
        userGroups: [],
        managerName: "Deepa",
        target: null
      };
    });

    it("Submit Fail", () => {
      spyOn(service, "updateUser").and.returnValue(throwError({ status: 400 }));
      spyOn(service, "getManagers").and.returnValue(
        of({ users: [{ id: 1, firstName: "Deepa", lastName: "J" }] })
      );
      spyOn(authService, 'getUserRolesByLogin').and.returnValue(of({
        roles: [{ id: 1, roleName: "Claims Lead" }]
      }));
      spyOn(service, "getUserGroups").and.returnValue(
        of({
          userGroups: [
            {
              groupId: 19,
              groupName: "Test"
            }
          ]
        })
      );
      component.ngOnInit();
      component.ngOnChanges(true);
      component.submit();
      expect(component.failed).toBeTruthy();
    });

    it("Submit Fail - with message", () => {
      spyOn(service, "updateUser").and.returnValue(
        throwError({ status: 400, error: { message: "Test" } })
      );
      spyOn(service, "getManagers").and.returnValue(
        of({ users: [{ id: 1, firstName: "Deepa", lastName: "J" }] })
      );
      spyOn(service, "getUserGroups").and.returnValue(
        of({
          userGroups: [
            {
              groupId: 19,
              groupName: "Test"
            }
          ]
        })
      );
      spyOn(authService, 'getUserRolesByLogin').and.returnValue(of({
        roles: [{ id: 1, roleName: "Claims Lead" }]
      }));
      localStorage.setItem("roleId", "Administrator");
      component.ngOnInit();
      localStorage.clear();
      component.ngOnChanges(true);
      component.submit();
      expect(component.failed).toBeTruthy();
      expect(component.submitFailMessage).toBe("Test");
    });

    it("Submit Success", () => {
      spyOn(service, "updateUser").and.returnValue(of("success"));
      component.editUser = {
        id: 1,
        firstName: "John",
        lastName: "Steve",
        userName: "johnst@prompt.com",
        dateOfBirth: "12/12/1989",
        role: "Auditor",
        communicationEmail: "johnst@prompt.com",
        status: "Inactive",
        activeDate: "12/12/2015",
        deactivateDate: "12/12/2022",
        ldapOrLocal: true,
        userGroups: null,
        managerName: "Deepa",
        target: null
      };
      spyOn(service, "getManagers").and.returnValue(
        of({ users: [{ id: 1, firstName: "Deepa", lastName: "J" }] })
      );
      spyOn(service, "getUserGroups").and.returnValue(
        of({
          userGroups: [
            {
              groupId: 19,
              groupName: "Test"
            }
          ]
        })
      );
      spyOn(authService, 'getUserRolesByLogin').and.returnValue(of({
        roles: [{ id: 1, roleName: "Auditor" }]
      }));
      localStorage.setItem("roleId", "Manager");
      component.ngOnInit();
      component.ngOnChanges(true);
      localStorage.setItem("user-details", JSON.stringify({ id: 10 }));
      component.ngOnInit();
      component.ngOnChanges(true);
      localStorage.clear();
      component.userForm.patchValue({
        deactiveDate: new Date()
      });
      console.log(component.userForm);
      component.submit();
      expect(component.failed).toBeFalsy();
    });

    afterAll(() => {
      component.editUser = null;
    });
  });

  describe("Add User", () => {
    const formPositive = (form: FormGroup) => {
      form.reset();
      form.patchValue({
        firstName: "firstName",
        lastName: "lastName",
        userName: "userName@123.com",
        dob: new Date("12/12/1989"),
        email: "userName@123.com",
        activeDate: new Date("12/12/2015"),
        ldapUser: "LDAP",
        role: 1,
        deactiveDate: new Date("12/12/2022"),
        userGroups: [
          {
            groupId: 1,
            groupName: "Test"
          }
        ],
        managerUserId: 1,
        target: 10
      });
    };

    const formNegative = (form: FormGroup) => {
      form.reset();
      form.patchValue({
        firstName: "firstName",
        lastName: "lastName",
        userName: "userName@123.com",
        dob: new Date("12/12/1989"),
        email: "userName@123.com",
        activeDate: new Date("12/12/2015"),
        ldapUser: "LocalUser",
        role: 1,
        deactiveDate: null,
        userGroups: null,
        managerUserId: null,
        target: null
      });
    };

    beforeEach(() => {
      component.userRoles = [{ id: 1, roleName: "Auditor" }];
    });

    it("Submit Fail", () => {
      spyOn(service, "createUser").and.returnValue(throwError({ status: 400 }));
      formPositive(component.userForm);
      try {
        component.submit();
      } catch (error) {
        console.error(error);
      }
      expect(component.failed).toBeTruthy();
    });

    it("Submit Fail - with message", () => {
      formNegative(component.userForm);
      spyOn(service, "createUser").and.returnValue(
        throwError({ status: 400, error: { message: "Test" } })
      );
      try {
        component.submit();
      } catch (error) {
        console.error(error);
      }
      expect(component.failed).toBeTruthy();
      expect(component.submitFailMessage).toBe("Test");
    });

    it("Submit Success", () => {
      formPositive(component.userForm);
      spyOn(service, "createUser").and.returnValue(of("success"));
      component.ngOnChanges(true);
      component.submit();
      expect(component.failed).toBeFalsy();
    });
  });

  it("Invlaid Form submit", () => {
    component.userForm.reset();
    component.submit();
    expect(component.failed).toBeFalsy();
  });

  it("Create additional field function", () => {
    component.userRoles = [{ id: 1, roleName: "Claims Examiner" }];
    component.createAdditionalFieldBasedOnRole("1");
    component.userForm.removeControl("userGroupName");
    component.createAdditionalFieldBasedOnRole("claims examiner", {
      userGroupId: 19
    });
    expect(component.userForm.get("userGroupName")).toBeTruthy();
    component.userRoles = [{ id: 1, roleName: "Claims Lead" }];
    component.createAdditionalFieldBasedOnRole("1");
    expect(component.userForm.get("managerName")).toBeTruthy();
    component.userForm.addControl("userGroupName", new FormControl());
    component.removeAdditionalFieldBasedOnRole("1");
  });

  it("getManagers & Usergroups", () => {
    spyOn(service, "getUserGroups").and.returnValue(of(null));
    spyOn(service, "getManagers").and.returnValue(of(null));
    authService.userDetails = { id: "", name: "" };
    component.ngOnInit();
    expect(component.userGroups).toBeUndefined();
  });

  it("get usergroups err", () => {
    spyOn(service, "getUserGroups").and.returnValue(
      throwError({ status: 404 })
    );
    try {
      component.userRoles = [{ id: 1, roleName: "Claims Examiner" }];
      component.userForm.patchValue({
        role: 1
      });
      component.onManagerChange(0);
    } catch (error) {
      console.error(error);
    }
    expect(component.userGroups).toEqual([]);
  });

  it("Edit user with no values", () => {
    component.editUser = {
      id: null,
      firstName: "",
      lastName: "",
      userName: "",
      dateOfBirth: "",
      role: "",
      communicationEmail: "",
      status: "",
      activeDate: "",
      deactivateDate: "",
      ldapOrLocal: "LDAP",
      userGroups: null,
      managerName: "",
      target: null
    };
    component.ngOnInit();
    component.ngOnChanges(true);
    expect(component.editMode).toBeTruthy();
  });

  it("shoul able to retun on back", () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(
      ActivatedRoute
    );
    activatedRoute.queryParams = of({
      returnEdit: true
    });
    component.ngOnInit();
    expect(component.backToEdit).toBeTruthy();
  });

  it("Minimum deactivate date", () => {
    const today = new Date();
    const nextDay = new Date(today.setDate(today.getDate() + 1));
    const lowerDay = new Date("12/12/2012");
    component.userForm.patchValue({
      activeDate: nextDay
    });
    expect(component.minDeactivateDate()).toEqual(nextDay);
    component.userForm.patchValue({
      activeDate: lowerDay
    });
    expect(component.minDeactivateDate()).toBeTruthy();
  });

  it("Manager field change", () => {
    component.userForm.patchValue({
      role: 1
    });
    component.userRoles = [
      {
        id: 1,
        roleName: "Claims Examiner"
      }
    ];
    spyOn(service, "getUserGroups").and.returnValue(of(null));
    component.onManagerChange(1);
    component.userRoles = [
      {
        id: 2,
        roleName: "Claims Lead"
      }
    ];
    component.onManagerChange(1);
    expect(component.userGroups).toEqual([]);
  });

  it("validators test", () => {
    component.userForm.patchValue({
      activeDate: new Date("12/12/2012"),
      deactiveDate: new Date("12/12/2010"),
      target: 101
    });
    component.userRoles = [
      {
        id: 1,
        roleName: "Claims Auditor"
      }
    ];
    component.deactivateDateValidator(component.userForm);
    const event = {
      preventDefault: () => console.log("prevented")
    };
    component.userForm.patchValue({
      target: 10
    });
    fixture.detectChanges();
    component.preventInput(event);
    expect(component.userForm.value.target).toEqual(10);
  });

  it("createAdditionalFieldBasedOnRole", () => {
    component.editUser = {
      id: 1,
      firstName: "John",
      lastName: "Steve",
      userName: "johnst@prompt.com",
      dateOfBirth: "12/12/1989",
      role: "Claims Auditor",
      communicationEmail: "johnst@prompt.com",
      status: "Inactive",
      activeDate: "12/12/2015",
      deactivateDate: "12/12/2022",
      ldapOrLocal: true,
      userGroups: [],
      managerName: "Deepa",
      target: null
    };
    localStorage.setItem("roleId", "Manager");
    component.userRoles = [
      {
        id: 1,
        roleName: "Claims Auditor"
      }
    ];
    component.createAdditionalFieldBasedOnRole(
      "Claims Auditor",
      component.editUser
    );
    expect(component).toBeTruthy();
  });

  it("Remove additional field", () => {
    component.userForm.reset();
    component.userForm.setControl("userGroupName", new FormControl(""));
    component.removeAllAdditionalField();
    expect(component.userForm.controls.userGropuName).toBeUndefined();
    component.userForm.setControl("managerName", new FormControl(""));
    component.userRoles = [
      {
        id: 1,
        roleName: "Test"
      }
    ];
    component.removeAdditionalFieldBasedOnRole("2");
    expect(component.userForm.controls.managerName).toBeUndefined();
  });

  it("should not get manager id", () => {
    localStorage.setItem("roleId", "Manager");
    localStorage.setItem("user-details", "");
    component.ngOnInit();
    expect(component.userGroups).toBeUndefined();
  });

  it("edit for manager role", () => {
    component.editUser = {
      id: 1,
      firstName: "John",
      lastName: "Steve",
      userName: "johnst@prompt.com",
      dateOfBirth: "12/12/1989",
      role: "Claims Examiner",
      communicationEmail: "johnst@prompt.com",
      status: "Inactive",
      activeDate: "12/12/2015",
      deactivateDate: "12/12/2022",
      ldapOrLocal: true,
      userGroups: null,
      managerName: "Deepa",
      target: null
    };
    spyOn(service, "getUserGroups").and.returnValue(
      of({
        userGroups: [
          {
            groupId: 19,
            groupName: "Test"
          }
        ]
      })
    );

    const payload = {
      success: true,
      roleId: "Manager",
      authToken: "ysdgyeuroho"
    };
    spyOn(authService, "getUserDetails").and.returnValue(
      of({ id: 1, firstName: "", lastName: "" })
    );
    authService.setLogin(payload);
    spyOn(authService, 'getUserRolesByLogin').and.returnValue(of({
      roles: [{ id: 1, roleName: "Claims Examiner" }]
    }));
    const secureLocalStorage: CryptoService = fixture.debugElement.injector.get(CryptoService);
    spyOn(secureLocalStorage, 'getItem').and.callFake((key) => {
      return key === 'roleId' ? 'Manager' : JSON.stringify({ id: 10 });
    })
    component.ngOnInit();
    expect(component.userGroups).toBeTruthy();
    component.cancel();
    component.clearForm();
  });

  afterAll(() => {
    localStorage.clear();
  });
});
