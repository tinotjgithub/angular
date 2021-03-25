import { TestBed } from "@angular/core/testing";
import { UsergroupManagementService } from "./usergroup-management.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService, SelectItem } from "primeng/api";
import UserGroup from "./manage-usergroup/models/UserGroup";
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe("UsergroupManagementService", () => {
  let service: UsergroupManagementService;
  let http: BaseHttpService;
  let router: Router;
  let navigateSpy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
      ],
    });
    service = TestBed.get(UsergroupManagementService);
    http = TestBed.get(BaseHttpService);
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, "navigateByUrl");
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getAllLeads", () => {
    const leadsList: SelectItem[] = [
      { label: "Claims Lead 1", value: 1 },
      { label: "Claims Lead 2", value: 2 },
      { label: "Claims Lead 3", value: 3 }
    ];
    spyOn(http, "get").and.returnValue(of(leadsList));
    service.getAllLeads(10);
    expect(service.leadsList).toEqual(leadsList);
  });

  /* it("getAllQueueNames", () => {
    const payload = [
      { label: "Queue 1", value: 1 },
      { label: "Queue 2", value: 2 },
      { label: "Queue 3", value: 3 },
      { label: "Queue 4", value: 4 }
    ];
    spyOn(http, "get").and.returnValue(of(payload));
    service.getAllQueueNames();
    expect(service.queueNamesList).toEqual(payload);
  }); */

  it("getAllUserGroupTypes", () => {
    const payload = [
      { label: "UserGroupType 1", value: 1 },
      { label: "UserGroupType 2", value: 2 },
      { label: "UserGroupType 3", value: 3 }
    ];
    spyOn(http, "get").and.returnValue(of(payload));
    service.getWorkItemTypes();
    expect(service.userGroupTypesList).toEqual(payload);
  });

  /* it("getAllManagers", () => {
    const payload = [
      { label: "Manger 1", value: 11 },
      { label: "Manger 2", value: 2 },
      { label: "Manger 3", value: 3 }
    ];
    spyOn(http, "get").and.returnValue(of(payload));
    service.getAllManagers();
    expect(service.managersList).toEqual(payload);
  }); */

  it("fetchAllUserGroups", () => {
    const payload: UserGroup[] = [
      {
        groupId: 11,
        groupName: "Quality_Audit_Team",
        leadUserMaster: { name: "Master", id: -1 },
        managerUserMaster: { name: "Master", id: -1 },
        target: 50,
        description: "Quality auditing",
        userGroupType: { id: 1, name: "Claims" },
        queueName: { queuename: "Quality Audit and Recovery WB", queueId: 3 }
      }
    ];
    spyOn(http, "get").and.returnValue(of(payload));
    service.fetchAllUserGroups();
    expect(service.userGroupList).toEqual(payload);
  });

  it("deleteUserGroupData", () => {
    const called = spyOn(http, "get").and.returnValue(of(true));
    const spy = spyOn(service, "fetchAllUserGroups");
    service.deleteUserGroupData(10);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(called).toBeTruthy();
  });

  it("saveUserGroupData", () => {
    const payload: UserGroup = {
      groupId: 10,
      groupName: "userGroup.groupName",
      description: "userGroup.description",
      leadUserMaster: { id: 10 },
      managerUserMaster: { id: 10 },
      queueName: { queueId: 10 },
      target: 10,
      userGroupType: { id: 10 }
    };
    const called = spyOn(http, "post").and.returnValue(of(true));
    const spy = spyOn(service, "fetchAllUserGroups");
    service.saveUserGroupData(payload, false);
    expect(called).toBeTruthy();
    service.saveUserGroupData(payload, true);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(called).toBeTruthy();
  });

  describe('Should get data', () => {
    let userService: UsergroupManagementService;
    let httpOne: BaseHttpService;
    beforeEach(() => {
      userService = TestBed.get(UsergroupManagementService);
      httpOne = TestBed.get(BaseHttpService);
      spyOn(httpOne, 'get').and.returnValue(of(true));
      spyOn(httpOne, 'post').and.returnValue(of(true));
    });

    it('Save UserGroup data', () => {
      const usergroup = {
        groupId: 0,
        groupName: '',
        description: '',
        leadUserMaster: {
          name: '',
          id: 0
        },
        managerUserMaster: {
          name: '',
          id: 0
        },
        queueName: {
          queueName: '',
          queueId: 0
        },
        target: 0,
        userGroupType: {
          name: '',
          id: 0
        },
      };

      userService.saveUserGroupData(usergroup, true);
      expect(userService.userGroupList).toBeTruthy();
    });

    it('Save UserGroup data - no edit', () => {
      const usergroup = {
        groupId: 0,
        groupName: '',
        description: '',
        leadUserMaster: {
          name: '',
          id: 0
        },
        managerUserMaster: {
          name: '',
          id: 0
        },
        queueName: {
          queueName: '',
          queueId: 0
        },
        target: 0,
        userGroupType: {
          name: '',
          id: 0
        },
      };

      userService.saveUserGroupData(usergroup);
      expect(userService.userGroupList).toBeTruthy();
    });

    it('delete user group by id', () => {
      let value;
      userService.getUserGroupListListener().subscribe(val => value = val);
      userService.deleteUserGroupData(1);
      expect(value).toBeTruthy();
    });

    it('Get All Managers', () => {
      let value;
      userService.getManagersListListener().subscribe(val => value = val);
      userService.getAllManagers();
      expect(value).toBeTruthy();
    });

    it('Get All Leads', () => {
      let value;
      userService.getLeadsListListener().subscribe(val => value = val);
      userService.getAllLeads(1);
      expect(value).toBeTruthy();
    });

    it('Get all queue name', () => {
      let value;
      userService.getQueueNameListListener().subscribe(val => value = val);
      userService.getAllQueueNames();
      expect(value).toBeTruthy();
    });

    it('get all user group', () => {
      let value;
      userService.getWorkItemTypeListListener().subscribe(val => value = val);
      userService.getWorkItemTypes();
      expect(value).toBeTruthy();
    });
  });

  describe('Should handle error on getting data', () => {
    let userGroupService: UsergroupManagementService;
    let httpTwo: BaseHttpService;
    beforeEach(() => {
      userGroupService = TestBed.get(UsergroupManagementService);
      httpTwo = TestBed.get(BaseHttpService);
      spyOn(httpTwo, 'get').and.returnValue(throwError(null));
      spyOn(httpTwo, 'post').and.returnValue(throwError(null));
    });

    it('Save UserGroup data', () => {
      const usergroup = {
        groupId: 0,
        groupName: '',
        description: '',
        leadUserMaster: {
          name: '',
          id: 0
        },
        managerUserMaster: {
          name: '',
          id: 0
        },
        queueName: null,
        target: 0,
        userGroupType: {
          name: '',
          id: 0
        },
      };

      userGroupService.saveUserGroupData(usergroup);
      expect(userGroupService.userGroupList).toBeUndefined();
    });

    it('delete user group by id', () => {
      userGroupService.deleteUserGroupData(1);
      expect(userGroupService).toBeTruthy();
    });

    it('Get All Managers', () => {
      userGroupService.getAllManagers();
      expect(userGroupService).toBeTruthy();
    });

    it('Get All Leads', () => {
      userGroupService.getAllLeads(1);
      expect(userGroupService).toBeTruthy();
    });

    it('Get all queue name', () => {
      userGroupService.getAllQueueNames();
      expect(userGroupService).toBeTruthy();
    });

    it('get all user group', () => {
      userGroupService.getWorkItemTypes();
      expect(userGroupService).toBeTruthy();
    });
  });
});
