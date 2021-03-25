import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveUserSnapshotComponent } from './active-user-snapshot.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MessageService } from 'primeng/api';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { of } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AdminUserManagementModule } from '../../user-management/admin-user-management.module';
import { NotificationModule } from '../../notification/notification.module';

describe('ActiveUserSnapshotComponent', () => {
  let component: ActiveUserSnapshotComponent;
  let fixture: ComponentFixture<ActiveUserSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveUserSnapshotComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        TooltipModule,
        HttpClientTestingModule,
        TableModule,
        DialogModule,
        AdminUserManagementModule,
        NotificationModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        UserManagementService,
        MessageService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveUserSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get count details', () => {
    const service: UserManagementService = fixture.debugElement.injector.get(UserManagementService);
    spyOn(service, 'getActiveUserSnapshotCount').and.returnValue(of({
      usersCount: 10,
      leadCount: 10,
      managerCount: 10,
      queueCount: 10,
      userGroups: 10
    }));
    component.ngOnInit();
    expect(component.activeUsers.leadCount).toEqual(10);
  });

  it('should get schedule details', () => {
    const service: UserManagementService = fixture.debugElement.injector.get(UserManagementService);
    spyOn(service, 'getUpcomingScheduledDetails').and.returnValue(of([{
      maintenanceMessage: 'Test',
      maintenanceFrom: 'Test',
      maintenanceTo: 'Test',
      fromTime: 'Test',
      toTime: 'Test',
    }]));
    component.ngOnInit();
    expect(component.upcomingMaintenance.length).toEqual(1);
  });

  it('should get schedule details - no data', () => {
    const service: UserManagementService = fixture.debugElement.injector.get(UserManagementService);
    spyOn(service, 'getUpcomingScheduledDetails').and.returnValue(of(''));
    component.ngOnInit();
    expect(component.upcomingMaintenance.length).toEqual(0);
  });

  it('functions', () => {
    component.openAddUser();
    const str = "test,ty";
    expect(component.processString(str)).toEqual("test, ty");
    expect(component.processString('')).toEqual("");
  });
});
