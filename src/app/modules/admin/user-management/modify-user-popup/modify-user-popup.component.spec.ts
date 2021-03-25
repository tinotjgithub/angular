/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyUserPopupComponent } from './modify-user-popup.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { throwError, of } from 'rxjs';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('ModifyUserPopupComponent', () => {
  let component: ModifyUserPopupComponent;
  let fixture: ComponentFixture<ModifyUserPopupComponent>;
  let service: UserManagementService;
  let authService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyUserPopupComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        DatePipe,
        AuthenticationService,
        UserManagementService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyUserPopupComponent);
    localStorage.setItem('roleId', 'Admininstrator');
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(UserManagementService);
    authService = fixture.debugElement.injector.get(AuthenticationService);
  });

  it('should create', () => {
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
        role: 'Claims Lead',
        communicationEmail: "johnst@prompt.com",
        status: "Active",
        activeDate: "12/12/2015",
        deactiveDate: "12/12/2022",
        ldapUser: true,
        userGroupId: 19,
        managerName: 'Deepa',
        target: null,
      };
    });

    it('Submit Fail', () => {
      spyOn(service, 'updateUser').and.returnValue(throwError({status: 400}));
      spyOn(service, 'getManagers').and.returnValue(of({users: [
        { id: 1, firstName: 'Deepa', lastName: 'J' }
      ]}));
      spyOn(service, 'getManagerUserGroups').and.returnValue(of([{
        groupId: 19,
        groupName: 'Test'
      }]));
      component.ngOnInit();
      authService.userRoles.next([
        {id: 1, roleName: 'Claims Lead'}
      ]);
      component.ngOnChanges(true);
      component.submit();
      expect(component.failed).toBeTruthy();
    });

    it('Submit Fail - with message', () => {
      spyOn(service, 'updateUser').and.returnValue(throwError({status: 400, error: {message: 'Test'}}));
      spyOn(service, 'getManagers').and.returnValue(of({users: [
        { id: 1, firstName: 'Deepa', lastName: 'J' }
      ]}));
      spyOn(service, 'getManagerUserGroups').and.returnValue(of([{
        groupId: 19,
        groupName: 'Test'
      }]));
      localStorage.setItem('roleId', 'Administrator');
      component.ngOnInit();
      authService.userRoles.next([
        {id: 1, roleName: 'Claims Lead'}
      ]);
      localStorage.clear();
      component.ngOnChanges(true);
      component.submit();
      expect(component.failed).toBeTruthy();
      expect(component.submitFailMessage).toBe('Test');
    });

    it('Submit Success', () => {
      spyOn(service, 'updateUser').and.returnValue(of('success'));
      component.editUser = {
        id: 1,
        firstName: "John",
        lastName: "Steve",
        userName: "johnst@prompt.com",
        dateOfBirth: "12/12/1989",
        role: 'Auditor',
        communicationEmail: "johnst@prompt.com",
        status: "Active",
        activeDate: "12/12/2015",
        deactivateDate: "12/12/2022",
        ldapOrLocal: false,
        userGroupId: 19,
        managerName: "Deepa",
        target: null,
      };
      spyOn(service, 'getManagers').and.returnValue(of({users: [
        { id: 1, firstName: 'Deepa', lastName: 'J' }
      ]}));
      spyOn(service, 'getManagerUserGroups').and.returnValue(of([{
        groupId: 19,
        groupName: 'Test'
      }]));
      localStorage.setItem('roleId', 'Manager');
      component.ngOnInit();
      localStorage.clear();
      authService.userRoles.next([
        {id: 1, roleName: 'Auditor'}
      ]);
      component.ngOnChanges(true);
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
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName@123.com',
        dob: new Date('12/12/1989'),
        email: 'userName@123.com',
        activeDate: new Date('12/12/2015'),
        ldapUser: 'LDAP',
        role: 1,
        deactiveDate: new Date('12/12/2022'),
        userGroupId: 19,
        managerName: 1,
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
        userGroupId: null,
        managerName: null,
        target: null,
      });
    };

    beforeEach(() => {
      component.userRoles = [
        {id: 1, roleName: 'Auditor'}
      ];
    });

    it('Submit Fail', () => {
      spyOn(service, 'createUser').and.returnValue(throwError({status: 400}));
      formPositive(component.userForm);
      try {
        component.userForm.patchValue({
          managerName: 2
        });
        component.submit();
      } catch (error) {
        console.error(error);
      }
      expect(component.failed).toBeTruthy();
    });

    it('Submit Fail - with message', () => {
      formNegative(component.userForm);
      spyOn(service, 'createUser').and.returnValue(throwError({status: 400, error: {message: 'Test'}}));
      try {
        component.submit();
      } catch (error) {
        console.error(error);
      }
      expect(component.failed).toBeTruthy();
      expect(component.submitFailMessage).toBe('Test');
    });

    it('Submit Success', () => {
      formPositive(component.userForm);
      spyOn(service, 'createUser').and.returnValue(of('success'));
      component.ngOnChanges(true);
      component.submit();
      expect(component.failed).toBeFalsy();
    });
  });

  it('Invlaid Form submit', () => {
    component.userForm.reset();
    component.submit();
    expect(component.failed).toBeFalsy();
  });

  it('Create additional field function', () => {
    component.userRoles = [
      {id: 1, roleName: 'Claims Examiner'}
    ];
    component.createAdditionalFieldBasedOnRole('1');
    component.userForm.removeControl('userGroupName');
    component.createAdditionalFieldBasedOnRole('claims examiner', {userGroupId: 19});
    expect(component.userForm.get('userGroupName')).toBeTruthy();
    component.userRoles = [
      {id: 1, roleName: 'Claims Lead'}
    ];
    component.createAdditionalFieldBasedOnRole('1');
    expect(component.userForm.get('managerName')).toBeTruthy();
    component.userForm.addControl('userGroupName', new FormControl());
    component.removeAdditionalFieldBasedOnRole('1');
  });

  it('getManagers & Usergroups', () => {
    spyOn(service, 'getManagerUserGroups').and.returnValue(of(null));
    spyOn(service, 'getManagers').and.returnValue(of(null));
    component.ngOnInit();
    expect(component.userGroups.length).toBe(0);
  });

  it('get usergroups err', () => {
    spyOn(service, 'getManagerUserGroups').and.returnValue(throwError({status: 400}));
    try {
      localStorage.setItem("roleId", "Manager");
      localStorage.setItem("user-details", JSON.stringify({ id: 10 }));
      component.ngOnInit();
    } catch (error) {
      console.error(error);
    }
    expect(component.userGroups.length).toBe(0);
  });

  it('Edit user with no values', () => {
    component.editUser = {
      id: null,
      firstName: "",
      lastName: "",
      userName: "",
      dateOfBirth: "",
      role: '',
      communicationEmail: "",
      status: "",
      activeDate: "",
      deactivateDate: "",
      ldapOrLocal: 'LDAP',
      userGroupId: null,
      managerName: "",
      target: null,
    };
    component.ngOnInit();
    component.ngOnChanges(true);
    expect(component.editMode).toBeTruthy();
  });

  it('shoul able to retun on back', () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    activatedRoute.queryParams = of({
      returnEdit: true
    });
    component.ngOnInit();
    expect(component.backToEdit).toBeTruthy();
  });

  it('Minimum deactivate date', () => {
    const today = new Date();
    const nextDay = new Date(today.setDate(today.getDate() + 1));
    const lowerDay = new Date('12/12/2012');
    component.userForm.patchValue({
      activeDate: nextDay
    });
    expect(component.minDeactivateDate()).toEqual(nextDay);
    component.userForm.patchValue({
      activeDate: lowerDay
    });
    expect(component.minDeactivateDate()).toBeTruthy();
  });

  it('prevent input', () => {
    component.userForm.patchValue({
      target: 80
    });
    component.preventInput('');
    component.userForm.patchValue({
      target: 102
    });
    const event = {
      preventDefault: () => console.log('event')
    };
    component.preventInput(event);
    expect(component.userForm.value.target).toEqual(10);
  });

  afterAll(() => {
    localStorage.clear();
  });
});
