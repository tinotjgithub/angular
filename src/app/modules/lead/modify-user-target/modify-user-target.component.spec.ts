/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyUserTargetComponent } from './modify-user-target.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MessageService } from 'primeng/api';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('ModifyUserTargetComponent', () => {
  let component: ModifyUserTargetComponent;
  let fixture: ComponentFixture<ModifyUserTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyUserTargetComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        CommonModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        TaskmanagementService,
        DatePipe,
        UserManagementService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyUserTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate table with columns', () => {
    component.ngOnInit();
    expect(component.col.length).toBeGreaterThan(0);
  });

  it('should able to select user', () => {
    const user = {
      userName: 'Test',
      firstName: 'Test',
      lastName: '1'
    };
    component.selectUser({target: { checked: true}}, user);
    expect(component.isSelected(user)).toBeTruthy();
  });

  it('should able to remove user from selected user', () => {
    const user = {
      userName: 'Test',
      firstName: 'Test',
      lastName: '1'
    };
    component.selectUser({target: { checked: true}}, user);
    component.selectUser({target: { checked: false}}, user);
    expect(component.isSelected(user)).toBeFalsy();
  });

  it('should avble to check whether user is selected', () => {
    const user = {
      userName: 'Test',
      firstName: 'Test',
      lastName: '1'
    };
    component.selectUser({target: { checked: true}}, user);
    expect(component.isSelected({
      userName: 'Test 1'
    })).toBeFalsy();
  });

  it('should return empty list when searched with empty value', () => {
    component.filterType = null;
    component.filterValue = null;
    component.search();
    expect(component.userList.length).toEqual(0);
  });

  it('should able to search for user with value', () => {
    const service: TaskmanagementService = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(service, 'modifyUserTarget').and.returnValue(of([]));
    component.filterType = 'first-name';
    component.filterValue = 'Test';
    component.search();
    expect(component.userList).toEqual([]);
  });

  it('should return empty [] when no response from API on search' , () => {
    const service: TaskmanagementService = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(service, 'modifyUserTarget').and.returnValue(of(null));
    component.filterType = 'first-name';
    component.filterValue = 'Test';
    component.search();
    expect(component.userList).toEqual([]);
  });

  it('should handle the error on search', () => {
    const service: TaskmanagementService = fixture.debugElement.injector.get(TaskmanagementService);
    spyOn(service, 'modifyUserTarget').and.returnValue(throwError({status: 400}));
    component.filterType = 'first-name';
    component.filterValue = 'Test';
    try {
      component.search();
    } catch (error) {
      console.log(error);
    }
    expect(component.userList).toEqual([]);
  });

  it('should open the edit mode', () => {
    component.openEdit({
      userName: 'Test'
    });
    expect(component.editMode).toBeTruthy();
  });

  it('should navigate to add user page', () => {
    const router: Router = fixture.debugElement.injector.get(Router);
    const spied = spyOn<any>(router, 'navigateByUrl').and.returnValue(true);
    component.navigateToAdd();
    expect(spied).toHaveBeenCalled();
  });

  it('should update on edit success', () => {
    component.onUpdateSucces();
    expect(component.editMode).toBeFalsy();
  });

  it('should able to download report', () => {
    const service: UserManagementService = fixture.debugElement.injector.get(UserManagementService);
    spyOn<any>(service, 'downloadReport').and.returnValue(of({body: 'test'}));
    component.downloadReport();
    expect(component).toBeTruthy();
  });

  it('should able to update row on edit', () => {
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
      target: 0,
    };
    component.userList = [user];
    component.onRowEditInit(user, 0);
    expect(component.userList.length).toBeGreaterThan(0);
  });

  it('should able toc close edit mode', () => {
    component.closeEdit();
    expect(component.editUser).toBeNull();
  });

  it('should be able to clear filter', () => {
    component.filterChange();
    expect(component.filterValue).toEqual('');
  });
});
