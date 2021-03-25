import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { NotifierService } from "src/app/services/notifier.service";
import UserGroup from "./manage-usergroup/models/UserGroup";
import { Subject } from "rxjs";
import { SelectItem } from "primeng/api";

@Injectable({
  providedIn: "root"
})
export class UsergroupManagementService {
  // Subjects
  private userGroupListSubject = new Subject<UserGroup[]>();
  // Dropdowns
  private managersListSubject = new Subject<SelectItem[]>();
  private leadsListSubject = new Subject<SelectItem[]>();
  private queueNamesListSubject = new Subject<SelectItem[]>();
  private userGroupTypesListSubject = new Subject<SelectItem[]>();

  // Grid List
  public userGroupList: UserGroup[];

  // Dropdown Lists
  managersList: SelectItem[];
  leadsList: SelectItem[];
  queueNamesList: SelectItem[];
  userGroupTypesList: SelectItem[];

  constructor(
    public baseHTTPService: BaseHttpService,
    private messageService: NotifierService
  ) {}

  getUserGroupListListener() {
    return this.userGroupListSubject.asObservable();
  }

  getManagersListListener() {
    return this.managersListSubject.asObservable();
  }

  getLeadsListListener() {
    return this.leadsListSubject.asObservable();
  }

  getQueueNameListListener() {
    return this.queueNamesListSubject.asObservable();
  }

  getGroupTypeListListener() {
    return this.userGroupTypesListSubject.asObservable();
  }

  saveUserGroupData(userGroup: UserGroup, edit = false) {
    const payload = {
      groupId: userGroup.groupId,
      groupName: userGroup.groupName,
      description: userGroup.description,
      leadUserMaster: { id: userGroup.leadUserMaster },
      managerUserMaster: { id: userGroup.managerUserMaster },
      queueName: { queueId: userGroup.queueName },
      target: userGroup.target,
      userGroupType: { id: userGroup.userGroupType }
    };
    const urlSegment = edit
      ? "api/userGroup/updateUserGroup"
      : "api/userGroup/createUserGroup";

    const msg = edit
      ? "User Group Updated Successfully!"
      : userGroup.queueName !== null
      ? "User Group to Queue Linking Completed"
      : "User Group Created Successfully!";
    this.baseHTTPService.post(payload, urlSegment).subscribe(
      data => {
        this.messageService.throwNotification({
          type: "success",
          message: msg
        });
        this.fetchAllUserGroups();
      },
      error => {}
    );
  }

  deleteUserGroupData(id) {
    const urlSegment = "api/userGroup/deleteUserGroup";
    const msg = "User Group Deleted!";
    const payload = {
      groupID: id
    };

    this.baseHTTPService.get(urlSegment, payload).subscribe(
      data => {
        this.messageService.throwNotification({
          type: "warning",
          message: msg
        });
        this.fetchAllUserGroups();
      },
      error => {}
    );
  }

  fetchAllUserGroups() {
    const urlSegment = "api/userGroup/getAllUserGroups";
    this.baseHTTPService.get(urlSegment).subscribe(
      data => {
        this.userGroupList = data;
        this.userGroupListSubject.next(this.userGroupList);
      },
      error => {}
    );
  }

  getAllManagers(userGroupType) {
    const urlSegment = "api/userGroup/claim-or-enrol-managers";
    this.baseHTTPService.post(userGroupType, urlSegment).subscribe(
      data => {
        this.managersList = data;
        this.managersListSubject.next(this.managersList);
      },
      error => {}
    );
  }

  getAllLeads(managerId, typeId) {
    const urlSegment = "api/userGroup/lead-names";
    this.baseHTTPService.post({ managerId, typeId }, urlSegment).subscribe(
      data => {
        this.leadsList = data;
        this.leadsListSubject.next(this.leadsList);
      },
      error => {}
    );
  }

  getAllQueueNames(userGroupType) {
    const urlSegment = "api/userGroup/claim-or-enrol-queues";
    this.baseHTTPService.post(userGroupType, urlSegment).subscribe(
      data => {
        this.queueNamesList = data;
        this.queueNamesListSubject.next(this.queueNamesList);
      },
      error => {}
    );
  }

  getAllUserGroupTypes() {
    const urlSegment = "api/userGroup/work-item-types";
    this.baseHTTPService.get(urlSegment).subscribe(
      data => {
        this.userGroupTypesList = data;
        this.userGroupTypesListSubject.next(this.userGroupTypesList);
      },
      error => {}
    );
  }
}
