import { TestBed } from "@angular/core/testing";

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseHttpService } from "../base-http.service";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { UserManagementService } from "./user-management.service";
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe("UserManagementService", () => {
  let http: BaseHttpService;
  let service: UserManagementService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        UserManagementService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        AuthenticationService,
      ],
    })
  );

  beforeEach(() => {
    http = TestBed.get(BaseHttpService);
    service = TestBed.get(UserManagementService);
    spyOn<any>(http, 'get').and.returnValue(true);
    spyOn<any>(http, 'post').and.returnValue(true);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it('should get the usergroup and user name list', () => {
    const authService: AuthenticationService = TestBed.get(AuthenticationService);
    authService.roleId = 'Manager';
    expect(service.getUserGroups()).toBeTruthy();
    expect(service.getUserNameList('Manager')).toBeTruthy();
    authService.roleId = 'Claims Lead';
    expect(service.getUserGroups()).toBeTruthy();
    expect(service.getUserNameList('Claims Lead')).toBeTruthy();
  });

  it('should download report', () => {
    spyOn<any>(http, 'getBlob').and.returnValue(true);
    expect(service.downloadReport()).toBeTruthy();
  });

  it('should get data', () => {
    expect(service.getActiveUserSnapshotCount()).toBeTruthy();
    expect(service.getLeadsTodaysStatusCount()).toBeTruthy();
    expect(service.getManagersTodaysStatusCount()).toBeTruthy();
    expect(service.getLeadsPieChartCount()).toBeTruthy();
    expect(service.getUpcomingScheduledDetails()).toBeTruthy();
    expect(service.saveSupportDetails({})).toBeTruthy();
    expect(service.getSupportDetails()).toBeTruthy();
    expect(service.checkForReset()).toBeTruthy();
    expect(service.createUser({})).toBeTruthy();
    expect(service.updateUser({})).toBeTruthy();
    expect(service.getManagers()).toBeTruthy();
    expect(service.getAllUsers({})).toBeTruthy();
    expect(service.getManagerUserGroups()).toBeTruthy();
    expect(service.searchUser('Test', 'Test')).toBeTruthy();
    expect(service.modifyUserTargetSearchUser('Test', 'Test')).toBeTruthy();
    expect(service.leadModifyUserSearch('Test', 'Test')).toBeTruthy();
  });

  it('should reset password', () => {
    expect(service.resetPassword({}, true)).toBeTruthy();
    expect(service.resetPassword({})).toBeTruthy();
  });

  it('should update usergroup target', () => {
    expect(service.getUserGroupTargetList()).toBeTruthy();
    expect(service.editUserGroupTarget({})).toBeTruthy();
  });
});
