import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { CryptoService } from "../crypto-service/crypto.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserManagementService {
  private unlockUsersSub = new Subject<any>();
  constructor(
    private baseHttpService: BaseHttpService,
    private authService: AuthenticationService,
    private secureLocalStorage: CryptoService
  ) {}

  resetPassword(formValue, dontShowError?: boolean) {
    let options = {};
    if (dontShowError) {
      options = {
        headers: { showerror: "true" }
      };
    }
    return this.baseHttpService.post(
      {
        ...formValue
      },
      "auth/reset/password",
      options
    );
  }

  unlockUsersListner() {
    return this.unlockUsersSub.asObservable();
  }

  checkForReset() {
    return this.baseHttpService.get("api/login/password-reset-flag");
  }

  createUser(userInfo) {
    return this.baseHttpService.post(
      { ...userInfo },
      "api/user-management/user/create"
    );
  }

  updateUser(userInfo) {
    return this.baseHttpService.post(
      { ...userInfo },
      "api/user-management/user/modify"
    );
  }

  getManagers(roleWorkItemTypeId?) {
    const base = "api/user-management/users/manager";
    const apiUrl = roleWorkItemTypeId
      ? `${base}?roleWorkItemTypeId=${roleWorkItemTypeId}`
      : base;
    return this.baseHttpService.get(apiUrl);
  }

  // get Users with server side pagination
  /* getAllUsers(paylod) {
    const role = this.secureLocalStorage.getItem("roleId");
    const apiUrl =
      role === "Claims Lead"
        ? "api/user-management/lead/all/user/details"
        : "api/user-management/admin/onlyuser/details";
    return this.baseHttpService.post(paylod, apiUrl);
  } */

  getAllUsers(type) {
    const role = this.secureLocalStorage.getItem("roleId");
    const apiUrl =
      role === "Claims Lead"
        ? "api/user-management/lead/all/user/details"
        : type === 'manager' ? 'api/user-management/admin/manager/details'
        : `api/user-management/admin/onlyuser/details/userType=${type}`;
    return this.baseHttpService.get(apiUrl);
  }

  getUserGroups(id?, roleWorkItemTypeId?) {
    /* if (this.authService.roleId === "Manager") {
      return this.baseHttpService.get("api/userGroup/getUserGroupsForManager");
    } else {
      return this.baseHttpService.get("api/userGroup/getAllUserGroups");
    } */
    return this.baseHttpService.get(
      `api/user-management/user/groups?managerUserId=${id}&roleWorkItemTypeId=${roleWorkItemTypeId}`
    );
  }

  getManagerUserGroups() {
    return this.baseHttpService.get("api/userGroup/getUserGroupsForManager");
  }

  searchUser(searchField: string, searchValue: string, type: string) {
    const apiUrl = String(type).toLowerCase() === 'manager' ? 
    `api/user-management/manager/admin/details/${searchField}=${searchValue}`
    : `api/user-management/usersearch/admin/firstname-details/${searchField}=${searchValue}&user-type=${type.toLowerCase()}`;
    return this.baseHttpService.get(apiUrl);
  }

  modifyUserTargetSearchUser(searchField: string, searchValue: string) {
    return this.baseHttpService.get(
      `api/user-management/user/manager/details/${searchField}=${searchValue}`
    );
  }

  leadModifyUserSearch(searchField: string, searchValue: string) {
    return this.baseHttpService.get(
      `api/user-management/user/lead/details/${searchField}=${searchValue}`
    );
  }

  downloadReport() {
    return this.baseHttpService.getBlob("api/admin/reports/users-list-report");
  }

  getActiveUserSnapshotCount() {
    return this.baseHttpService.get("api/admin/landing/active-user-snapshot");
  }

  getLeadsTodaysStatusCount() {
    return this.baseHttpService.get("api/lead/landing-page/count");
  }

  getManagersTodaysStatusCount() {
    return this.baseHttpService.get("api/managerlanding/userdetail/count");
  }

  getLeadsPieChartCount() {
    return this.baseHttpService.get("api/lead/landing-page/pie-chart");
  }

  getUpcomingScheduledDetails() {
    return this.baseHttpService.get(
      "api/admin/landing/upcoming-scheduled-details"
    );
  }
  saveSupportDetails(payload) {
    return this.baseHttpService.post(
      payload,
      "api/configuration/support/create"
    );
  }

  ExaminerProductivitiyConfig(payload) {
    return this.baseHttpService.post(
      payload,
      `api/configuration/routedIn/options/create`
    );
  }

  getSupportDetails() {
    return this.baseHttpService.get("api/configuration/support/details");
  }

  getExaminerProductivitiyConfig() {
    return this.baseHttpService.get(`api/configuration/routedIn/options`);
  }

  getUserNameList(roleName, roleWorkItemType?) {
    let apiUrl = "";
    if (roleName === "Claims Lead") {
      apiUrl = `api/user-management/users/lead`;
    } else {
      apiUrl = `api/user-management/users/manager?roleWorkItemTypeId=${roleWorkItemType}`;
    }
    return this.baseHttpService.get(apiUrl);
  }

  getUserGroupTargetList() {
    return this.baseHttpService.get("api/userGroup/getAllUserGroupsForLead");
  }

  editUserGroupTarget(param) {
    return this.baseHttpService.post(
      param,
      "api/userGroup/updateUserGroupTarget"
    );
  }

  unlockUsers(userID) {
    return this.baseHttpService.get(
      `api/user-management/user/unlock?userId=${userID}`
    );
  }

  getPendingCount() {
    return this.baseHttpService.get("api/pend/reassignment/user/count");
  }

  getPendingAssignmentDetails() {
    return this.baseHttpService.get("api/pend/reassignment/user/detail");
  }

  getUsergroupsPrioritize(payload) {
    return this.baseHttpService.post(payload, "api/claims/user-group");
  }

  getExaminerPrioritize(payload) {
    return this.baseHttpService.post(payload, `api/claims/examiners`);
  }

  //Get All Managers for Edit Users
  /* getAllManagerUserList() {
    return this.baseHttpService.get(`api/user-management/admin/manager/details`);
  } */
}
