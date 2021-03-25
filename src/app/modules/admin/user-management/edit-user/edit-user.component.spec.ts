import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from "@angular/core/testing";
import { NotifierService } from "src/app/services/notifier.service";
import { EditUserComponent } from "./edit-user.component";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MessageService } from "primeng/api";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TableModule, Table } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { AddUserComponent } from "../add-user/add-user.component";
import { ModifyUserPopupComponent } from "../modify-user-popup/modify-user-popup.component";
import { CalendarModule } from "primeng/calendar";
import { RouterTestingModule } from "@angular/router/testing";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { throwError, of } from "rxjs";
import { Router } from "@angular/router";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { MultiSelectModule } from "primeng/multiselect";
import { PaginatorModule } from "primeng/paginator";
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockNotiferService extends NotifierService {
  throwNotification(notification) {
    this.notifierListener.next({
      type: notification.type,
      message: notification.message
    });
  }
}

describe("EditUserComponent", () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let service: UserManagementService;
  let notifierService;
  const data = [
    {
      id: 5,
      firstName: "Manju",
      lastName: "Varghese",
      dateOfBirth: "1987-11-21",
      userName: "manju.varghese@ust-global.com",
      communicationEmail: "manju.varghese@gmail.com",
      role: "Claims Examiner",
      status: "Inactive",
      activeDate: "2020-01-01",
      deactivateDate: "2020-02-01",
      ldapOrLocal: "Local User",
      userGroupId: 2,
      userGroupName: "Group B",
      leadName: "Deepa",
      managerName: "Roy",
      target: 20
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditUserComponent,
        AddUserComponent,
        ModifyUserPopupComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TableModule,
        DialogModule,
        TooltipModule,
        CalendarModule,
        RouterTestingModule,
        MultiSelectModule,
        PaginatorModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        { provide: NotifierService, useClass: MockNotiferService },
        MessageService,
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(UserManagementService);
    notifierService = fixture.debugElement.injector.get(NotifierService);
  });

  it("should create", () => {
    spyOn(service, "getAllUsers").and.returnValue(
      of({
        totalRecords: 10,
        users: []
      })
    );
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it("Search Fail", () => {
    spyOn(service, "modifyUserTargetSearchUser").and.returnValue(
      throwError({ status: 400 })
    );
    spyOn(service, "searchUser").and.returnValue(throwError({ status: 400 }));
    component.filterType = "userName";
    component.filterValue = "Test";
    try {
      component.userRoleID = "Administrator";
      component.search();
      component.userRoleID = "Manager";
      component.search();
    } catch (error) {
      console.error(error);
    }
    expect(component.searchDone).toBeTruthy();
  });

  it("Search Success", () => {
    spyOn(service, "modifyUserTargetSearchUser").and.returnValue(of(data));
    spyOn(service, "searchUser").and.returnValue(of(data));
    component.filterType = "userName";
    component.filterValue = "Test";
    component.userRoleID = "Administrator";
    component.search();
    component.userRoleID = "Manager";
    component.search();
    expect(component.searchDone).toBeTruthy();
  });

  it("Search Success- No Response", () => {
    spyOn(service, "modifyUserTargetSearchUser").and.returnValue(of(null));
    spyOn(service, "searchUser").and.returnValue(of(null));
    component.filterType = "userName";
    component.filterValue = "Test";
    component.userRoleID = "Administrator";
    component.search();
    component.userRoleID = "Manager";
    component.search();
    expect(component.searchDone).toBeTruthy();
  });

  it("Search no role", () => {
    component.userRoleID = "Administrator";
    component.ngOnInit();
    component.userRoleID = "Manager";
    component.ngOnInit();
    component.userRoleID = "Claims Lead";
    component.filterType = "userName";
    component.filterValue = "Test";
    component.search();
    expect(component.userRoleID).toBe("Claims Lead");
    component.filterValue = "";
    component.filterType = "";
    component.onUpdateSucces();
    expect(component.userList).toEqual([]);
  });

  it("Select user functions", () => {
    expect(component.isSelected(data)).toBeFalsy();
    component.selectUser({ target: { checked: true } }, data);
    expect(component.isSelected(data)).toBeTruthy();
    expect(component.isSelected({ userName: "Test" })).toBeFalsy();
    component.selectUser({ target: { checked: false } }, data);
    component.openEdit(data);
    component.closeEdit();
  });

  it("Download Report", () => {
    spyOn<any>(service, "downloadReport").and.returnValue(of({ body: "test" }));
    component.downloadReport();
    component.refreshTable({
      reset: () => console.log("reset")
    });
    const router: Router = fixture.debugElement.injector.get(Router);
    spyOn<any>(router, "navigateByUrl").and.returnValue(true);
    component.navigateToAdd();
    component.filterChange();
    expect(component.filterValue).toEqual("");
  });

  it("should able to paginate", () => {
    const spi = spyOn(service, "getAllUsers").and.returnValue(of(""));
    component.paginate({
      page: 1,
      rows: 10
    });
    expect(spi).toHaveBeenCalled();
  });

  it("should able to unlock user on click if user is locked", () => {
    const spi = spyOn(component, "unLockUser");
    const rowData = { id: 1, isAccountLocked: "Locked" };
    component.onRowSelect(rowData);
    expect(spi).toHaveBeenCalled();
  });

  it("should not able to unlock user on click if user is not locked", () => {
    const spi = spyOn(component, "unLockUser");
    const rowData = { id: 1, isAccountLocked: false };
    component.onRowSelect(rowData);
    expect(spi).not.toHaveBeenCalled();
  });

  it("should call service to upload user group creation file", fakeAsync(() => {
    const spy = spyOn(service, "unlockUsers").and.returnValue(
      of({ success: true })
    );
    const spyNotf = spyOn(notifierService, "throwNotification").and.returnValue(
      {
        type: "success",
        message: "User unlocked successfully!"
      }
    );
    fixture.detectChanges();
    component.unLockUser(1);

    expect(spy).toHaveBeenCalled();
    service.unlockUsers(1).subscribe(result => {
      expect(spyNotf).toHaveBeenCalled();
    });
  }));

  it("should clear user list when filterValue is empty", fakeAsync(() => {
    component.filterValue = "";
    component.userList = [{ id: 1, name: "Tino" }];
    fixture.detectChanges();
    component.clearValues();
    expect(component.userList).toEqual([]);
  }));
  it("should not clear user list when filterValue is not empty", fakeAsync(() => {
    component.filterValue = "false";
    component.userList = [{ id: 1, name: "Tino" }];
    fixture.detectChanges();
    component.clearValues();
    expect(component.userList).not.toEqual([]);
  }));

  it("getGoingToDeactivate", () => {
    expect(component.getGoingToDeactivate('12/12/2012', 'Inactive')).toBeFalsy();
    const today = new Date();
    const from = new Date(today.setDate(today.getDate() + 6));
    expect(component.getGoingToDeactivate(from.toDateString(), 'Active')).toBeTruthy();
    const from1 = new Date(today.setDate(today.getDate() + 12));
    expect(component.getGoingToDeactivate(from1.toDateString(), 'Active')).toBeFalsy();
    const from2 = new Date(today.setDate(today.getMonth() + 1));
    expect(component.getGoingToDeactivate(from2.toDateString(), 'Active')).toBeFalsy();
  });

  it("should call service to upload user group creation file - error", fakeAsync(() => {
    const spy = spyOn(service, "unlockUsers").and.returnValue(throwError(200));
    component.unLockUser(1);
    component.search();
    component.filterValue = 'tr';
    component.onUpdateSucces();
    expect(spy).toHaveBeenCalled();
  }));
});
